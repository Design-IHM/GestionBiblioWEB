import React, { useState, useEffect } from "react";
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
  BookOpen,
  BookCopy,
  BookMarked,
  Info,
  TrendingUp,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import styled from "styled-components";
import firebase from "../metro.config";
import { useI18n } from "../Context/I18nContext";

// Composant de carte avec tooltip
const DashboardCard = ({ icon: Icon, title, value, percentage, isNegative, description }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <CardContainer 
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="card-header">
        <div className="icon-container">
          <Icon style={{ width: '24px', height: '24px', color: 'chocolate' }} />
        </div>
        <div style={{ flex: 1 }}>
          <p className="card-title">{title}</p>
          <div className="value-container">
            <span className="value">{value}</span>
            {percentage !== undefined && (
              <span className="percentage">
                {percentage}%
              </span>
            )}
          </div>
        </div>
      </div>
      {showTooltip && description && (
        <TooltipBox>
          {description}
        </TooltipBox>
      )}
    </CardContainer>
  );
};

const ChartCard = ({ title, children }) => (
  <ChartContainer>
    <ChartTitle>{title}</ChartTitle>
    {children}
  </ChartContainer>
);

// Nouveau composant pour la liste des livres
const BookList = ({ title, books, icon: Icon }) => (
  <BookListContainer>
    <BookListTitle>
      {Icon && <Icon size={20} style={{ color: 'chocolate' }} />}
      <span>{title}</span>
    </BookListTitle>
    {books.length > 0 ? (
      <BookListTable>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Info</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={index}>
              <td>{book.name || book.titre}</td>
              <td>{book.count || book.date}</td>
            </tr>
          ))}
        </tbody>
      </BookListTable>
    ) : (
      <EmptyMessage>Aucune donnée disponible</EmptyMessage>
    )}
  </BookListContainer>
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
    empruntsByDepartment: {},
    totalBookExemplaires: 0,      // Total de tous les exemplaires (inventaire)
    availableExemplaires: 0,      // Exemplaires disponibles à la réservation
    reservedNotPickedUp: 0,       // Réservés mais pas encore retirés
    topBorrowedBooks: [],         // Top 5 des livres les plus empruntés
    lowStockBooks: [],            // Livres avec stock faible
    currentWeekBorrows: [],       // Emprunts de la semaine courante
    recentlyReturnedBooks: [],    // Livres récemment retournés
    reservationToBorrowRatio: 0   // Ratio des réservations converties en emprunts
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
            let totalInventoryCount = 0;
            let availableCount = 0;
            let lowStockBooks = [];
            
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              items.push(data);
              
              // Compter par catégorie
              if (booksByCathegorie[data.cathegorie]) {
                booksByCathegorie[data.cathegorie]++;
              } else {
                booksByCathegorie[data.cathegorie] = 1;
              }
              
              // Calculer le total des exemplaires (inventaire)
              if (data.initialExemplaire) {
                totalInventoryCount += data.initialExemplaire;
              }
              
              // Calculer les exemplaires disponibles
              if (data.exemplaire) {
                availableCount += data.exemplaire;
              }
              
              // Vérifier si le stock est faible (moins de 20% disponible)
              if (data.initialExemplaire && data.exemplaire) {
                const availablePercentage = (data.exemplaire / data.initialExemplaire) * 100;
                if (availablePercentage <= 20) {
                  lowStockBooks.push({
                    name: data.name,
                    available: data.exemplaire,
                    total: data.initialExemplaire,
                    percentage: availablePercentage.toFixed(1) + '%'
                  });
                }
              }
            });
            
            // Trier et limiter les livres à faible stock
            lowStockBooks.sort((a, b) => parseFloat(a.percentage) - parseFloat(b.percentage));
            const topLowStock = lowStockBooks.slice(0, 5);
            
            setStats((prevStats) => ({
              ...prevStats,
              totalBooks: items.length,
              booksByCathegorie,
              totalBookExemplaires: totalInventoryCount,
              availableExemplaires: availableCount,
              lowStockBooks: topLowStock
            }));
          });
        };

        const fetchTopBorrowedBooks = async () => {
          try {
            // Ici nous simulons la récupération des livres les plus empruntés
            // Dans une implémentation réelle, vous devrez adapter cette logique
            // selon la structure de vos données
            
            const borrowedBooksMap = new Map();
            
            // Récupérer les données d'emprunt de la collection BiblioUser
            const usersSnapshot = await firebase.firestore().collection("BiblioUser").get();
            
            usersSnapshot.forEach(doc => {
              const userData = doc.data();
              
              // Analyser les états d'emprunt (etat1, etat2, etat3)
              ['tabEtat1', 'tabEtat2', 'tabEtat3'].forEach(tabKey => {
                if (userData[tabKey] && userData[tabKey][0]) {
                  const bookTitle = userData[tabKey][0];
                  borrowedBooksMap.set(bookTitle, (borrowedBooksMap.get(bookTitle) || 0) + 1);
                }
              });
            });
            
            // Convertir la Map en tableau et trier
            const topBooks = Array.from(borrowedBooksMap.entries())
              .map(([name, count]) => ({ name, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 5);
            
            setStats(prevStats => ({
              ...prevStats,
              topBorrowedBooks: topBooks
            }));
            
          } catch (error) {
            console.error("Erreur lors de la récupération des livres les plus empruntés:", error);
          }
        };

        const fetchCurrentWeekBorrows = async () => {
          try {
            // Déterminer les dates de début et fin de la semaine courante
            const currentDate = new Date();
            const firstDayOfWeek = new Date(currentDate);
            const dayOfWeek = currentDate.getDay();
            const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Lundi = 0, Dimanche = 6
            firstDayOfWeek.setDate(currentDate.getDate() - diff);
            firstDayOfWeek.setHours(0, 0, 0, 0);
            
            const lastDayOfWeek = new Date(firstDayOfWeek);
            lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
            lastDayOfWeek.setHours(23, 59, 59, 999);
            
            // Tableau pour stocker les emprunts par jour
            const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
            const weekBorrows = daysOfWeek.map(day => ({ day, borrows: 0 }));
            
            // Récupérer les données d'emprunt depuis ArchivesBiblio ou autre collection pertinente
            const archivesSnapshot = await firebase.firestore().collection("ArchivesBiblio").doc("Arch").get();
            const archives = archivesSnapshot.data();
            
            if (archives && archives.tableauArchives) {
              archives.tableauArchives.forEach(entry => {
                const entryDate = new Date(entry.heure);
                
                // Vérifier si l'entrée est dans la semaine courante
                if (entryDate >= firstDayOfWeek && entryDate <= lastDayOfWeek) {
                  const dayIndex = entryDate.getDay() === 0 ? 6 : entryDate.getDay() - 1;
                  weekBorrows[dayIndex].borrows += 1;
                }
              });
            }
            
            setStats(prevStats => ({
              ...prevStats,
              currentWeekBorrows: weekBorrows
            }));
            
          } catch (error) {
            console.error("Erreur lors de la récupération des emprunts de la semaine:", error);
          }
        };

        const fetchRecentlyReturnedBooks = async () => {
          try {
            // Récupérer les livres récemment retournés
            const archivesSnapshot = await firebase.firestore().collection("ArchivesBiblio").doc("Arch").get();
            const archives = archivesSnapshot.data();
            
            if (archives && archives.tableauArchives) {
              // Trier les entrées par date de retour décroissante
              const sortedReturns = [...archives.tableauArchives]
                .sort((a, b) => new Date(b.heure) - new Date(a.heure))
                .slice(0, 5)
                .map(entry => ({
                  titre: entry.nomDoc,
                  etudiant: entry.nomEtudiant,
                  date: new Date(entry.heure).toLocaleDateString()
                }));
              
              setStats(prevStats => ({
                ...prevStats,
                recentlyReturnedBooks: sortedReturns
              }));
            }
            
          } catch (error) {
            console.error("Erreur lors de la récupération des livres récemment retournés:", error);
          }
        };

        const fetchUsers = () => {
          const ref = firebase.firestore().collection("BiblioUser");
          ref.onSnapshot((querySnapshot) => {
            const items = [];
            let totalStudents = 0;
            let suspendedStudents = 0;
            let totalReservations = 0;
            let borrowedDocuments = 0;
            let reservedNotPickedUp = 0;
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

              // Comptabiliser les réservations, emprunts
              const states = [data.etat1, data.etat2, data.etat3];
              
              // Compter les livres réservés mais non retirés
              states.forEach(state => {
                if (state === 'reserv') {
                  reservedNotPickedUp++;
                  totalReservations++;
                }
              });

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
                }
              });
            });

            // Calculer le ratio réservation vers emprunt
            const reservationToBorrowRatio = totalReservations > 0 
              ? ((borrowedDocuments / (borrowedDocuments + totalReservations)) * 100).toFixed(1)
              : 0;

            setStats((prevStats) => ({
              ...prevStats,
              totalStudents,
              suspendedStudents,
              totalReservations,
              borrowedDocuments,
              totalEmprunts,
              empruntsByDepartment,
              reservedNotPickedUp,
              reservationToBorrowRatio
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
              // Triez les entrées par date pour une meilleure visualisation
              const sortedEntries = [...data.tableauArchives].sort((a, b) => {
                return new Date(a.heure) - new Date(b.heure);
              });
              
              // Obtenez seulement les entrées des 12 derniers mois
              const oneYearAgo = new Date();
              oneYearAgo.setMonth(oneYearAgo.getMonth() - 12);
              
              const recentEntries = sortedEntries.filter(entry => 
                new Date(entry.heure) >= oneYearAgo
              );
              
              // Créer un objet pour stocker les emprunts par mois/année
              const monthsData = {};
              
              recentEntries.forEach((entry) => {
                const date = new Date(entry.heure);
                // Format mois-année (ex: Jan 2023)
                const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
                
                // Incrémenter le compteur pour ce mois/année
                if (monthsData[monthYear]) {
                  monthsData[monthYear]++;
                } else {
                  monthsData[monthYear] = 1;
                }
                
                // Analyser le département à partir de nomDoc ou d'autres données
                // Note: Vous pouvez adapter cette logique selon la structure réelle de vos données
                let department = "Inconnu";
                if (entry.nomDoc) {
                  // Essayez d'extraire le département du nom du document
                  // Par exemple, si votre format est "Livre - Département"
                  const parts = entry.nomDoc.split(' - ');
                  if (parts.length > 1) {
                    department = parts[1];
                  } else {
                    department = entry.nomDoc; // Utilisez le nom du doc comme département si pas de format spécifique
                  }
                }
                
                const existingDepartment = departmentBorrowStats.find(d => d.department === department);
                if (existingDepartment) {
                  existingDepartment.borrows++;
                } else {
                  departmentBorrowStats.push({ department, borrows: 1 });
                }
              });
              
              // Convertir l'objet en tableau pour le graphique
              for (const [monthYear, count] of Object.entries(monthsData)) {
                monthlyBorrows.push({ month: monthYear, borrows: count });
              }
              
              // Trier par date pour l'affichage chronologique
              monthlyBorrows.sort((a, b) => {
                const dateA = new Date(a.month);
                const dateB = new Date(b.month);
                return dateA - dateB;
              });
            }
            
            setStats((prevStats) => ({
              ...prevStats,
              monthlyBorrows,
              departmentBorrowStats
            }));
          });
        };

        // Appel de toutes les fonctions de récupération de données
        fetchMemories();
        fetchBooks();
        fetchUsers();
        fetchMonthlyBorrows();
        fetchTopBorrowedBooks();
        fetchCurrentWeekBorrows();
        fetchRecentlyReturnedBooks();

        setLoading(false);
      } catch (error) {
        console.error('Erreur de chargement', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Calculer les livres physiquement présents (total - empruntés)
  const physicallyPresentBooks = stats.totalBookExemplaires - stats.borrowedDocuments;

  // Traductions directes pour le tableau de bord
  const translations = {
    // Titres existants
    total_books: language === "FR" ? "Total des titres uniques" : "Total Unique Titles",
    total_theses: language === "FR" ? "Total Mémoires" : "Total Theses",
    registered_students: language === "FR" ? "Étudiants Inscrits" : "Registered Students",
    borrowed_documents: language === "FR" ? "Documents Empruntés" : "Borrowed Documents",
    people_borrowed: language === "FR" ? "Personnes ayant emprunté" : "People who Borrowed",
    suspended_students: language === "FR" ? "Étudiants Suspendus" : "Suspended Students",
    total_reservations: language === "FR" ? "Total Réservations" : "Total Reservations",
    monthly_borrows: language === "FR" ? "Emprunts Mensuels" : "Monthly Borrows",
    borrows_by_department: language === "FR" ? "Emprunts par Département" : "Borrows by Department",
    books_by_category: language === "FR" ? "Livres par Département" : "Books by Department",
    theses_by_department: language === "FR" ? "Mémoires par Département" : "Theses by Department",
    
    // Nouvelles traductions pour les métriques ajoutées
    total_inventory: language === "FR" ? "Inventaire total des exemplaires" : "Total Inventory of Copies",
    available_for_reservation: language === "FR" ? "Exemplaires disponibles pour réservation" : "Copies Available for Reservation",
    reserved_not_picked: language === "FR" ? "Réservés mais non retirés" : "Reserved but Not Picked Up",
    physically_present: language === "FR" ? "Exemplaires physiquement présents" : "Physically Present Copies",
    reservation_to_borrow: language === "FR" ? "Taux réservations → emprunts" : "Reservation to Borrow Rate",
    
    // Nouvelles sections
    top_borrowed: language === "FR" ? "Top 5 des livres les plus empruntés" : "Top 5 Most Borrowed Books",
    low_stock: language === "FR" ? "Livres en stock faible (moins de 20%)" : "Low Stock Books (less than 20%)",
    current_week: language === "FR" ? "Emprunts de la semaine courante" : "Current Week Borrows",
    recently_returned: language === "FR" ? "Livres récemment retournés" : "Recently Returned Books",
    
    // Descriptions
    desc_unique_titles: language === "FR" ? 
      "Nombre total de titres distincts dans la bibliothèque, sans compter les exemplaires multiples." : 
      "Total number of distinct titles in the library, not counting multiple copies.",
    desc_total_inventory: language === "FR" ? 
      "Nombre total d'exemplaires acquis par la bibliothèque (somme de tous les exemplaires initiaux)." : 
      "Total number of copies acquired by the library (sum of all initial copies).",
    desc_available: language === "FR" ? 
      "Nombre d'exemplaires actuellement disponibles pour réservation ou emprunt." : 
      "Number of copies currently available for reservation or borrowing.",
    desc_borrowed: language === "FR" ? 
      "Nombre de documents actuellement empruntés par les utilisateurs." : 
      "Number of documents currently borrowed by users.",
    desc_reserved: language === "FR" ? 
      "Nombre de documents réservés mais pas encore retirés par les utilisateurs." : 
      "Number of documents reserved but not yet picked up by users.",
    desc_physically_present: language === "FR" ? 
      "Nombre d'exemplaires physiquement présents dans la bibliothèque (inventaire total moins emprunts)." : 
      "Number of copies physically present in the library (total inventory minus borrowed items).",
    desc_people_borrowed: language === "FR" ? 
      "Nombre d'utilisateurs ayant actuellement au moins un document emprunté." : 
      "Number of users who currently have at least one document borrowed.",
    desc_reservation_ratio: language === "FR" ? 
      "Pourcentage des réservations qui sont converties en emprunts." : 
      "Percentage of reservations that are converted to borrowings.",
    help_message: language === "FR" ? 
      "Pour plus de détails sur chaque carte, survolez-la avec votre curseur." : 
      "For more details on each card, hover over it with your cursor."
  };

  if (loading) return <LoadingOverlay>Chargement...</LoadingOverlay>;

  return (
    <div className="content-box">
      <Container>
        <Sidebar />
        <Navbar />
        <MainContent>
          <HelpMessage>
            <Info size={16} />
            <span>{translations.help_message}</span>
          </HelpMessage>
          
          <StatsGrid>
            {/* Première ligne de cartes - Statistiques des livres */}
            <DashboardCard
              icon={Book}
              title={translations.total_books}
              value={stats.totalBooks}
              description={translations.desc_unique_titles}
            />
            <DashboardCard
              icon={BookCopy}
              title={translations.total_inventory}
              value={stats.totalBookExemplaires}
              description={translations.desc_total_inventory}
            />
            <DashboardCard
              icon={BookOpen}
              title={translations.available_for_reservation}
              value={stats.availableExemplaires}
              percentage={((stats.availableExemplaires / stats.totalBookExemplaires) * 100).toFixed(2)}
              description={translations.desc_available}
            />
            <DashboardCard
              icon={BookMarked}
              title={translations.physically_present}
              value={physicallyPresentBooks}
              percentage={((physicallyPresentBooks / stats.totalBookExemplaires) * 100).toFixed(2)}
              description={translations.desc_physically_present}
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
              percentage={((stats.borrowedDocuments / stats.totalBookExemplaires) * 100).toFixed(2)}
              description={translations.desc_borrowed}
            />
            <DashboardCard
              icon={CreditCard}
              title={translations.reserved_not_picked}
              value={stats.reservedNotPickedUp}
              percentage={((stats.reservedNotPickedUp / stats.totalBookExemplaires) * 100).toFixed(2)}
              description={translations.desc_reserved}
            />
            <DashboardCard
              icon={CreditCard}
              title={translations.people_borrowed}
              value={stats.totalEmprunts}
              percentage={((stats.totalEmprunts / stats.totalStudents) * 100).toFixed(2)}
              description={translations.desc_people_borrowed}
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
            <DashboardCard
              icon={TrendingUp}
              title={translations.reservation_to_borrow}
              value={`${stats.reservationToBorrowRatio}%`}
              description={translations.desc_reservation_ratio}
            />
          </StatsGrid>

          {/* Nouvelles sections pour les statistiques supplémentaires */}
          <AdditionalStatsGrid>
            {/* Top 5 des livres les plus empruntés */}
            <BookList 
              title={translations.top_borrowed}
              books={stats.topBorrowedBooks}
              icon={TrendingUp}
            />
            
            {/* Livres en stock faible */}
            <BookList 
              title={translations.low_stock}
              books={stats.lowStockBooks.map(book => ({
                name: book.name,
                count: `${book.available}/${book.total} (${book.percentage})`
              }))}
              icon={AlertTriangle}
            />
            
            {/* Livres récemment retournés */}
            <BookList 
              title={translations.recently_returned}
              books={stats.recentlyReturnedBooks.map(book => ({
                name: book.titre,
                date: `${book.etudiant} - ${book.date}`
              }))}
              icon={RotateCcw}
            />
          </AdditionalStatsGrid>

          {/* Graphique des emprunts de la semaine courante */}
          <ChartCard title={translations.current_week}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.currentWeekBorrows}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="borrows" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

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

// Nouveau composant de message d'aide
const HelpMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
  padding: 10px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  
  span {
    font-size: 14px;
  }
`;

// Styles pour les listes de livres
const BookListContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const BookListTitle = styled.h3`
  color: chocolate;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
`;

const BookListTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }
  
  th {
    font-weight: 600;
    color: #4b5563;
  }
  
  tr:last-child td {
    border-bottom: none;
  }
`;

const EmptyMessage = styled.p`
  color: #6b7280;
  text-align: center;
  margin-top: 16px;
`;

const AdditionalStatsGrid = styled.div`
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

const CardContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .icon-container {
    background-color: #FFF0E6;
    padding: 8px;
    border-radius: 8px;
  }
  
  .card-title {
    color: #4b5563;
    font-size: 14px;
    margin-bottom: 4px;
  }
  
  .value-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .value {
    font-size: 20px;
    font-weight: 600;
  }
  
  .percentage {
    font-size: 14px;
    color: #10b981;
  }
`;

const TooltipBox = styled.div`
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  width: max-content;
  max-width: 250px;
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  
  &:after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid rgba(0, 0, 0, 0.8);
  }
`;

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