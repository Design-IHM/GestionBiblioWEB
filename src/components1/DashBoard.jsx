import React, { useState, useEffect, useContext, useCallback } from "react";
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
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Book,
  GraduationCap,
  Users,
  BarChart3,
  Clock,
  CreditCard,
  TrendingUp
} from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import styled from "styled-components";
import firebase from "../metro.config";
import { UserContext } from "../App";

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
    backgroundColor: '#f3f0ff',
    padding: '8px',
    borderRadius: '8px',
  },
  icon: {
    width: '24px',
    height: '24px',
    color: '#7c3aed',
  },
};

const DashboardCard = ({ icon: Icon, title, value, percentage, isNegative }) => (
  <div style={styles.dashboardCard}>
    <div style={styles.cardHeader}>
      <div style={styles.iconContainer}>
        <Icon style={styles.icon} />
      </div>
      <div style={{flex: 1}}>
        <p style={{color: '#4b5563', fontSize: '14px', marginBottom: '4px'}}>{title}</p>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span style={{fontSize: '20px', fontWeight: '600'}}>{value}</span>
          {percentage !== undefined && (
            <span style={{
              fontSize: '14px',
              color: isNegative ? '#ef4444' : '#10b981'
            }}>
              {isNegative ? '' : '+'}
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
            console.log(items);
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
            console.log(items);
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
              if (data.etat === 'suspendu') {
                suspendedStudents++;
              }
              if (data.etat1 === 'emprunt' || data.etat2 === 'emprunt' || data.etat3 === 'emprunt') {
                borrowedDocuments++;
                totalEmprunts++;
                if (empruntsByDepartment[data.niveau]) {
                  empruntsByDepartment[data.niveau]++;
                } else {
                  empruntsByDepartment[data.niveau] = 1;
                }
                studentsWithEmprunts.push(data);
              }
              if (data.etat1 === 'ras' || data.etat2 === 'ras' || data.etat3 === 'ras') {
                returnedDocuments++;
              }
              if (data.etat1 === 'reservation' || data.etat2 === 'reservation' || data.etat3 === 'reservation') {
                totalReservations++;
              }
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
            console.log("Liste des étudiants ayant fait des emprunts :", studentsWithEmprunts);
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
              title="Total Livres"
              value={stats.totalBooks}
              percentage={5}
            />
            <DashboardCard
              icon={GraduationCap}
              title="Total Mémoires"
              value={stats.totalTheses}
              percentage={8}
            />
            <DashboardCard
              icon={Users}
              title="Étudiants Inscrits"
              value={stats.totalStudents}
              percentage={-2}
              isNegative
            />
            <DashboardCard
              icon={CreditCard}
              title="Documents Empruntés"
              value={stats.borrowedDocuments}
              percentage={15}
            />
            <DashboardCard
              icon={CreditCard}
              title="Total Emprunts"
              value={stats.totalEmprunts}
              percentage={10}
            />
          </StatsGrid>

          <ChartsContainer>
            <ChartCard title="Emprunts Mensuels">
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

            <ChartCard title="Livres par Catégorie">
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

            <ChartCard title="Mémoires par Département">
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

            <ChartCard title="Emprunts par Département">
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
          </ChartsContainer>

          <AdditionalStatsGrid>
            <DashboardCard
              icon={Clock}
              title="Étudiants Suspendus"
              value={stats.suspendedStudents}
              percentage={-10}
              isNegative
            />
            <DashboardCard
              icon={BarChart3}
              title="Total Réservations"
              value={stats.totalReservations}
              percentage={5}
            />
            <DashboardCard
              icon={TrendingUp}
              title="Documents Rendus"
              value={stats.returnedDocuments}
              percentage={12}
            />
          </AdditionalStatsGrid>
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
  background-color: #f4f6f9;
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
  color: #7c3aed;
  margin-bottom: 16px;
  text-align: center;
`;

const AdditionalStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
  color: #7c3aed;
`;

export default Dashboard;
