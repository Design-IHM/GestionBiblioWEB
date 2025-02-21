import React, { useState, useEffect} from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Book,
  GraduationCap,
  Users,
  BarChart3,
  Clock,
  CreditCard,
} from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import styled from "styled-components";
import firebase from "../metro.config";
import { useI18n } from "../Context/I18nContext";

const styles = {
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  dashboardCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.02)',
    }
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconContainer: {
    backgroundColor: '#FFF0E6',
    padding: '8px',
    borderRadius: '8px',
  },
  icon: {
    width: '24px',
    height: '24px',
    color: 'chocolate',
  },
};

const DashboardCard = ({ icon: Icon, title, value, percentage, isNegative, hidePercentageSign }) => (
  <div style={styles.dashboardCard}>
    <div style={styles.cardHeader}>
      <div style={styles.iconContainer}>
        <Icon style={styles.icon} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '4px' }}>{title}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '20px', fontWeight: '600' }}>{value}</span>
          {percentage !== undefined && (
            <span style={{
              fontSize: '14px',
              color: '#10b981'
            }}>
              {percentage}%
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <ChartContainer>
    <ChartTitle>{title}</ChartTitle>
    {children}
  </ChartContainer>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalTheses: 0,
    booksByCathegorie: {},
    thesesByDepartment: {},
    totalStudents: 0,
    suspendedStudents: 0,
    totalReservations: 0,
    borrowedDocuments: 0,
    returnedDocuments: 0,
    monthlyBorrows: [],
    departmentBorrowStats: [],
    totalEmprunts: 0,
    empruntsByDepartment: {}
  });

  const [loading, setLoading] = useState(true);
  const { language } = useI18n();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const fetchMemories = () => {
          const ref = firebase.firestore().collection("Memoire");
          ref.onSnapshot((querySnapshot) => {
            const items = [];
            const thesesByDepartment = {};
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              items.push(data);
              if (thesesByDepartment[data.département]) {
                thesesByDepartment[data.département]++;
              } else {
                thesesByDepartment[data.département] = 1;
              }
            });
            setStats((prevStats) => ({
              ...prevStats,
              totalTheses: items.length,
              thesesByDepartment
            }));
          });
        };

        const fetchBooks = () => {
          const ref = firebase.firestore().collection("BiblioInformatique");
          ref.onSnapshot((querySnapshot) => {
            const items = [];
            const booksByCathegorie = {};
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              items.push(data);
              if (booksByCathegorie[data.cathegorie]) {
                booksByCathegorie[data.cathegorie]++;
              } else {
                booksByCathegorie[data.cathegorie] = 1;
              }
            });
            setStats((prevStats) => ({
              ...prevStats,
              totalBooks: items.length,
              booksByCathegorie
            }));
          });
        };

        const fetchUsers = () => {
          const ref = firebase.firestore().collection("BiblioUser");
          ref.onSnapshot((querySnapshot) => {
            const items = [];
            let totalStudents = 0;
            let suspendedStudents = 0;
            let totalReservations = 0;
            let borrowedDocuments = 0;
            let returnedDocuments = 0;
            const empruntsByDepartment = {};
            let totalEmprunts = 0;
            const studentsWithEmprunts = [];

            querySnapshot.forEach((doc) => {
              const data = doc.data();
              items.push(data);
              totalStudents++;

              // Vérifier les étudiants suspendus
              if (data.etat === 'bloc') {
                suspendedStudents++;
              }

              // Nouvelle logique pour compter les réservations, emprunts et retours
              const states = [data.etat1, data.etat2, data.etat3];

              // Compter les emprunts par utilisateur (un utilisateur qui a emprunté)
              if (states.includes('emprunt')) {
                totalEmprunts++;

                // Ajouter aux statistiques par département
                if (empruntsByDepartment[data.niveau]) {
                  empruntsByDepartment[data.niveau]++;
                } else {
                  empruntsByDepartment[data.niveau] = 1;
                }

                studentsWithEmprunts.push(data);
              }

              // Compter le nombre total de documents empruntés
              states.forEach(state => {
                if (state === 'emprunt') {
                  borrowedDocuments++;
                } else if (state === 'reserv') {
                  totalReservations++;
                }
              });
            });

            setStats((prevStats) => ({
              ...prevStats,
              totalStudents,
              suspendedStudents,
              totalReservations,
              borrowedDocuments,
              returnedDocuments,
              totalEmprunts,
              empruntsByDepartment
            }));
          });
        };

        const fetchMonthlyBorrows = () => {
          const ref = firebase.firestore().collection("ArchivesBiblio").doc("Arch");
          ref.onSnapshot((doc) => {
            const data = doc.data();
            const monthlyBorrows = [];
            const departmentBorrowStats = [];
            if (data && data.tableauArchives) {
              data.tableauArchives.forEach((entry) => {
                const date = new Date(entry.heure);
                const month = date.toLocaleString('default', { month: 'short' });
                const existingMonth = monthlyBorrows.find((m) => m.month === month);
                if (existingMonth) {
                  existingMonth.borrows++;
                } else {
                  monthlyBorrows.push({ month, borrows: 1 });
                }
                const existingDepartment = departmentBorrowStats.find((d) => d.department === entry.nomDoc);
                if (existingDepartment) {
                  existingDepartment.borrows++;
                } else {
                  departmentBorrowStats.push({ department: entry.nomDoc, borrows: 1 });
                }
              });
            }
            setStats((prevStats) => ({
              ...prevStats,
              monthlyBorrows,
              departmentBorrowStats
            }));
          });
        };

        fetchMemories();
        fetchBooks();
        fetchUsers();
        fetchMonthlyBorrows();

        setLoading(false);
      } catch (error) {
        console.error('Erreur de chargement', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Traductions directes pour le tableau de bord
  const translations = {
    total_books: language === "FR" ? "Total Livres" : "Total Books",
    total_theses: language === "FR" ? "Total Mémoires" : "Total Theses",
    registered_students: language === "FR" ? "Étudiants Inscrits" : "Registered Students",
    borrowed_documents: language === "FR" ? "Documents Empruntés" : "Borrowed Documents",
    people_borrowed: language === "FR" ? "Personnes ayant emprunté" : "People who Borrowed",
    suspended_students: language === "FR" ? "Étudiants Suspendus" : "Suspended Students",
    total_reservations: language === "FR" ? "Total Réservations" : "Total Reservations",
    monthly_borrows: language === "FR" ? "Emprunts Mensuels" : "Monthly Borrows",
    borrows_by_department: language === "FR" ? "Emprunts par Département" : "Borrows by Department",
    books_by_category: language === "FR" ? "Livres par Département" : "Books by Department",
    theses_by_department: language === "FR" ? "Mémoires par Département" : "Theses by Department"
  };

  if (loading) return <LoadingOverlay>Chargement...</LoadingOverlay>;

  return (
    <div className="content-box">
      <Container>
        <Sidebar />
        <Navbar />
        <MainContent>
          <StatsGrid>
            <DashboardCard
              icon={Book}
              title={translations.total_books}
              value={stats.totalBooks}
            />
            <DashboardCard
              icon={GraduationCap}
              title={translations.total_theses}
              value={stats.totalTheses}
            />
            <DashboardCard
              icon={Users}
              title={translations.registered_students}
              value={stats.totalStudents}
            />
            <DashboardCard
              icon={CreditCard}
              title={translations.borrowed_documents}
              value={stats.borrowedDocuments}
              percentage={(((stats.borrowedDocuments) / (stats.totalBooks + stats.totalTheses)) * 100).toFixed(2)}
            />
            <DashboardCard
              icon={CreditCard}
              title={translations.people_borrowed}
              value={stats.totalEmprunts}
              percentage={((stats.totalEmprunts / stats.totalStudents) * 100).toFixed(2)}
            />
            <DashboardCard
              icon={Clock}
              title={translations.suspended_students}
              value={stats.suspendedStudents}
              percentage={((stats.suspendedStudents / stats.totalStudents) * 100).toFixed(2)}
            />
            <DashboardCard
              icon={BarChart3}
              title={translations.total_reservations}
              value={stats.totalReservations}
            />
          </StatsGrid>

          <ChartsContainer>
            <ChartCard title={translations.borrows_by_department}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(stats.empruntsByDepartment).map(([department, count]) => ({ department, borrows: count }))}
                    dataKey="borrows"
                    nameKey="department"
                    fill="#8884d8"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {Object.entries(stats.empruntsByDepartment).map(([department, count], index) => (
                      <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title={translations.books_by_category}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.entries(stats.booksByCathegorie).map(([cathegorie, count]) => ({ cathegorie, books: count }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="cathegorie" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="books" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title={translations.theses_by_department}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.entries(stats.thesesByDepartment).map(([department, count]) => ({ department, theses: count }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="theses" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </ChartsContainer>

          <ChartCard title={translations.monthly_borrows}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.monthlyBorrows}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="borrows" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </MainContent>
      </Container>
    </div>
  );
};

const Container = styled.div`
  min-height: 100vh;
`;

const MainContent = styled.div`
  padding: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 16px;
`;

const ChartTitle = styled.h2`
  color: chocolate;
  margin-bottom: 16px;
  text-align: center;
`;

const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
  color: chocolate;
`;

export default Dashboard;
