import React, { useState, useEffect, useContext, useCallback } from "react";
import firebase from '../metro.config';
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCheckCircle, 
  FaTimes, 
  FaClock, 
  FaBook, 
  FaUser, 
  FaCalendarAlt, 
  FaArrowLeft, 
  FaArrowRight 
} from "react-icons/fa";
import Loading from "./Loading";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import { UserContext } from "../App";
import { useI18n } from "../Context/I18nContext";

function ListeReservations() {
  const ref = firebase.firestore().collection("BiblioUser");
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const { darkMode } = useContext(UserContext);
  const { language } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // États pour gérer les notifications et les animations
  const [processingItem, setProcessingItem] = useState(null);
  const [notification, setNotification] = useState({ visible: false, type: "", message: "" });

  const getData = useCallback(() => {
    ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
        setLoader(true);
      });
      setData(items);
    });
  }, [ref]);

  useEffect(() => {
    getData();
  }, [getData]);

  // Fonction pour gérer les notifications
  const showNotification = (type, message) => {
    setNotification({ visible: true, type, message });

    setTimeout(() => {
      setNotification({ visible: false, type: "", message: "" });
    }, 3000);
  };

  const d = new Date();

  async function reserv1(dos) {
    if (dos.etat1 === 'reserv') {
      setProcessingItem(dos.email + "-1");
      try {
        const userRef = firebase.firestore().collection("BiblioUser");
        const bookRef = firebase.firestore().collection("BiblioInformatique");
        
        // Mettre à jour l'état de l'utilisateur
        await userRef.doc(dos.email).update({
          etat1: 'emprunt',
          tabEtat1: [dos.tabEtat1[0], dos.tabEtat1[1], dos.tabEtat1[2], dos.tabEtat1[3], dos.tabEtat1[4], d.toISOString()]
        });

        // Décrémenter le nombre d'exemplaires du livre
        const docName = dos.tabEtat1[0];
        const querySnapshot = await bookRef.where("name", "==", docName).get();
        
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          const currentExemplaire = querySnapshot.docs[0].data().exemplaire || 0;
          
          await docRef.update({ 
            exemplaire: Math.max(0, currentExemplaire - 1) // Empêcher les valeurs négatives
          });
        }

        showNotification("success", `${language === "FR" ? "Le document" : "Document"} "${dos.tabEtat1[0]}" ${language === "FR" ? "a été emprunté avec succès" : "has been successfully borrowed"}`);
      } catch (err) {
        console.error("Erreur lors de la validation de l'emprunt:", err);
        showNotification("error", language === "FR" ? "Une erreur s'est produite" : "An error occurred");
      } finally {
        setProcessingItem(null);
      }
    }
  }

  async function reserv2(dos) {
    if (dos.etat2 === 'reserv') {
      setProcessingItem(dos.email + "-2");
      try {
        const userRef = firebase.firestore().collection("BiblioUser");
        const bookRef = firebase.firestore().collection("BiblioInformatique");
        
        // Mettre à jour l'état de l'utilisateur
        await userRef.doc(dos.email).update({
          etat2: 'emprunt',
          tabEtat2: [dos.tabEtat2[0], dos.tabEtat2[1], dos.tabEtat2[2], dos.tabEtat2[3], dos.tabEtat2[4], d.toISOString()]
        });

        // Décrémenter le nombre d'exemplaires du livre
        const docName = dos.tabEtat2[0];
        const querySnapshot = await bookRef.where("name", "==", docName).get();
        
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          const currentExemplaire = querySnapshot.docs[0].data().exemplaire || 0;
          
          await docRef.update({ 
            exemplaire: Math.max(0, currentExemplaire - 1) // Empêcher les valeurs négatives
          });
        }

        showNotification("success", `${language === "FR" ? "Le document" : "Document"} "${dos.tabEtat2[0]}" ${language === "FR" ? "a été emprunté avec succès" : "has been successfully borrowed"}`);
      } catch (err) {
        console.error("Erreur lors de la validation de l'emprunt:", err);
        showNotification("error", language === "FR" ? "Une erreur s'est produite" : "An error occurred");
      } finally {
        setProcessingItem(null);
      }
    }
  }

  async function reserv3(dos) {
    if (dos.etat3 === 'reserv') {
      setProcessingItem(dos.email + "-3");
      try {
        const userRef = firebase.firestore().collection("BiblioUser");
        const bookRef = firebase.firestore().collection("BiblioInformatique");
        
        // Mettre à jour l'état de l'utilisateur
        await userRef.doc(dos.email).update({
          etat3: 'emprunt',
          tabEtat3: [dos.tabEtat3[0], dos.tabEtat3[1], dos.tabEtat3[2], dos.tabEtat3[3], dos.tabEtat3[4], d.toISOString()]
        });

        // Décrémenter le nombre d'exemplaires du livre
        const docName = dos.tabEtat3[0];
        const querySnapshot = await bookRef.where("name", "==", docName).get();
        
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          const currentExemplaire = querySnapshot.docs[0].data().exemplaire || 0;
          
          await docRef.update({ 
            exemplaire: Math.max(0, currentExemplaire - 1) // Empêcher les valeurs négatives
          });
        }

        showNotification("success", `${language === "FR" ? "Le document" : "Document"} "${dos.tabEtat3[0]}" ${language === "FR" ? "a été emprunté avec succès" : "has been successfully borrowed"}`);
      } catch (err) {
        console.error("Erreur lors de la validation de l'emprunt:", err);
        showNotification("error", language === "FR" ? "Une erreur s'est produite" : "An error occurred");
      } finally {
        setProcessingItem(null);
      }
    }
  }

  // Traductions directes pour la liste des réservations
  const translations = {
    page_title: language === "FR" ? "Liste des réservations" : "Reservations List",
    information: language === "FR" ? "Information" : "Information",
    document1: language === "FR" ? "Document 1" : "Document 1",
    document2: language === "FR" ? "Document 2" : "Document 2",
    document3: language === "FR" ? "Document 3" : "Document 3",
    status: language === "FR" ? "Etat" : "Status",
    validate_loan: language === "FR" ? "Valider Emprunt" : "Validate Loan",
    processing: language === "FR" ? "Traitement..." : "Processing...",
    available_space: language === "FR" ? "Espace disponible pour une réservation" : "Space available for reservation",
    previous: language === "FR" ? "Précédent" : "Previous",
    next: language === "FR" ? "Suivant" : "Next",
    no_reservations: language === "FR" ? "Aucune réservation en cours" : "No current reservations",
    no_reservations_message: language === "FR" ? "Lorsque des utilisateurs réserveront des documents, ils apparaîtront ici" : "When users reserve documents, they will appear here",
    matricule: language === "FR" ? "Matricule" : "ID",
    class: language === "FR" ? "Classe" : "Class",
    date: language === "FR" ? "Date" : "Date",
    borrowed_documents: language === "FR" ? "Documents empruntés" : "Borrowed documents",
  };

  // Filtrer les données pour n'afficher que les réservations en cours
  const filteredData = data.filter((doc) => doc.etat1 === 'reserv' || doc.etat2 === 'reserv' || doc.etat3 === 'reserv');

  // Calculer les indices de début et de fin pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Total des pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Changer de page
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <AppContainer>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <MainContent darkMode={darkMode}>
        <NavbarContainer>
          <Navbar />
        </NavbarContainer>
        
        <PageHeader>
          <HeaderTitle>
            <FaBook style={{ marginRight: '12px', color: '#fe7a3f' }} />
            {translations.page_title}
          </HeaderTitle>
        </PageHeader>
        
        <ContentContainer>
          {loader ? (
            <>
              {filteredData.length > 0 ? (
                <>
                  {currentItems.map((user, index) => (
                    <ReservationCard key={user.email || index}>
                      <UserSection>
                        <UserAvatar>
                          <FaUser />
                        </UserAvatar>
                        <UserInfo>
                          <UserName>{user.name}</UserName>
                          <UserDetails>
                            <DetailItem>
                              <DetailLabel>{translations.matricule}:</DetailLabel>
                              <DetailValue>{user.matricule || (indexOfFirstItem + index + 1)}</DetailValue>
                            </DetailItem>
                            <DetailItem>
                              <DetailLabel>{translations.class}:</DetailLabel>
                              <DetailValue>{user.niveau || 'N/A'}</DetailValue>
                            </DetailItem>
                          </UserDetails>
                        </UserInfo>
                        <StatusBadge>{user.etat || 'Normal'}</StatusBadge>
                      </UserSection>
                      
                      <DocumentsSection>
                        <SectionTitle>{translations.borrowed_documents}</SectionTitle>
                        <DocumentsList>
                          {user.etat1 === 'reserv' && (
                            <DocumentItem>
                              <DocumentIcon>
                                <FaBook />
                              </DocumentIcon>
                              <DocumentDetails>
                                <DocumentTitle>{user.tabEtat1[0]}</DocumentTitle>
                                <DocumentMeta>
                                  <FaCalendarAlt size={12} />
                                  <MetaText>
                                    {translations.date}: {user.tabEtat1[5]?.toLocaleString().slice(0, 16)}
                                  </MetaText>
                                </DocumentMeta>
                              </DocumentDetails>
                              <ActionButton
                                onClick={() => reserv1(user)}
                                disabled={processingItem === user.email + "-1"}
                                processing={processingItem === user.email + "-1"}
                              >
                                {processingItem === user.email + "-1" ? (
                                  <>
                                    <FaClock className="rotating" />
                                    <ButtonText>{translations.processing}</ButtonText>
                                  </>
                                ) : (
                                  <>
                                    <FaCheckCircle />
                                    <ButtonText>{translations.validate_loan}</ButtonText>
                                  </>
                                )}
                              </ActionButton>
                            </DocumentItem>
                          )}

                          {user.etat2 === 'reserv' && (
                            <DocumentItem>
                              <DocumentIcon>
                                <FaBook />
                              </DocumentIcon>
                              <DocumentDetails>
                                <DocumentTitle>{user.tabEtat2[0]}</DocumentTitle>
                                <DocumentMeta>
                                  <FaCalendarAlt size={12} />
                                  <MetaText>
                                    {translations.date}: {user.tabEtat2[5]?.toLocaleString().slice(0, 16)}
                                  </MetaText>
                                </DocumentMeta>
                              </DocumentDetails>
                              <ActionButton
                                onClick={() => reserv2(user)}
                                disabled={processingItem === user.email + "-2"}
                                processing={processingItem === user.email + "-2"}
                              >
                                {processingItem === user.email + "-2" ? (
                                  <>
                                    <FaClock className="rotating" />
                                    <ButtonText>{translations.processing}</ButtonText>
                                  </>
                                ) : (
                                  <>
                                    <FaCheckCircle />
                                    <ButtonText>{translations.validate_loan}</ButtonText>
                                  </>
                                )}
                              </ActionButton>
                            </DocumentItem>
                          )}

                          {user.etat3 === 'reserv' && (
                            <DocumentItem>
                              <DocumentIcon>
                                <FaBook />
                              </DocumentIcon>
                              <DocumentDetails>
                                <DocumentTitle>{user.tabEtat3[0]}</DocumentTitle>
                                <DocumentMeta>
                                  <FaCalendarAlt size={12} />
                                  <MetaText>
                                    {translations.date}: {user.tabEtat3[5]?.toLocaleString().slice(0, 16)}
                                  </MetaText>
                                </DocumentMeta>
                              </DocumentDetails>
                              <ActionButton
                                onClick={() => reserv3(user)}
                                disabled={processingItem === user.email + "-3"}
                                processing={processingItem === user.email + "-3"}
                              >
                                {processingItem === user.email + "-3" ? (
                                  <>
                                    <FaClock className="rotating" />
                                    <ButtonText>{translations.processing}</ButtonText>
                                  </>
                                ) : (
                                  <>
                                    <FaCheckCircle />
                                    <ButtonText>{translations.validate_loan}</ButtonText>
                                  </>
                                )}
                              </ActionButton>
                            </DocumentItem>
                          )}
                        </DocumentsList>
                      </DocumentsSection>
                    </ReservationCard>
                  ))}

                  {filteredData.length > itemsPerPage && (
                    <PaginationContainer>
                      <PaginationButton 
                        onClick={prevPage} 
                        disabled={currentPage === 1}
                      >
                        <FaArrowLeft />
                        <span>{translations.previous}</span>
                      </PaginationButton>
                      <PageIndicator>
                        {currentPage} / {totalPages}
                      </PageIndicator>
                      <PaginationButton 
                        onClick={nextPage} 
                        disabled={currentPage === totalPages}
                      >
                        <span>{translations.next}</span>
                        <FaArrowRight />
                      </PaginationButton>
                    </PaginationContainer>
                  )}
                </>
              ) : (
                <EmptyState>
                  <FaBook size={64} color="#E7DAC1" />
                  <EmptyStateTitle>
                    {translations.no_reservations}
                  </EmptyStateTitle>
                  <EmptyStateText>
                    {translations.no_reservations_message}
                  </EmptyStateText>
                </EmptyState>
              )}
            </>
          ) : (
            <LoadingContainer>
              <Loading />
            </LoadingContainer>
          )}
        </ContentContainer>

        {/* Notification de succès ou d'erreur */}
        <AnimatePresence>
          {notification.visible && (
            <NotificationContainer
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              type={notification.type}
            >
              <NotificationIcon>
                {notification.type === "success" ? (
                  <FaCheckCircle size={20} />
                ) : (
                  <FaTimes size={20} />
                )}
              </NotificationIcon>
              <NotificationMessage>{notification.message}</NotificationMessage>
            </NotificationContainer>
          )}
        </AnimatePresence>
      </MainContent>
    </AppContainer>
  );
}

export default ListeReservations;

const AppContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
`;

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  z-index: 100;

  @media (max-width: 768px) {
    width: 0;
  }
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 250px;
  background-color: ${props => props.darkMode ? '#1a202c' : 'white'};
  min-height: 100vh;
  transition: all 0.3s ease;
  color: ${props => props.darkMode ? '#e2e8f0' : '#343a40'};

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const NavbarContainer = styled.div`
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 90;
`;

const PageHeader = styled.div`
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  @media (max-width: 576px) {
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const HeaderTitle = styled.h1`
  display: flex;
  align-items: center;
  font-size: 1.75rem;
  font-weight: 600;
  color: inherit;
  margin: 0;
`;

const ContentContainer = styled.div`
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 576px) {
    padding: 16px;
  }
`;

const ReservationCard = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #e7dac1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: #6b240c;
  font-size: 20px;

  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
`;

const UserDetails = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: 576px) {
    flex-direction: column;
    gap: 4px;
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.85rem;
`;

const DetailLabel = styled.span`
  color: #718096;
  margin-right: 4px;
  font-weight: 500;
`;

const DetailValue = styled.span`
  color: #4a5568;
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 6px 12px;
  border-radius: 50px;
  background-color: #f0f4ff;
  color: #3b82f6;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;

  @media (max-width: 768px) {
    position: static;
    align-self: flex-start;
  }
`;

const DocumentsSection = styled.div`
  padding: 20px;
`;

const SectionTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
  margin: 0 0 16px 0;
  letter-spacing: 0.5px;
`;

const DocumentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 12px;
  border-left: 3px solid #fe7a3f;
  transition: all 0.2s;

  &:hover {
    background-color: #f0f4f8;
  }

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const DocumentIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #fff3e6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: #fe7a3f;
  
  @media (max-width: 576px) {
    margin-right: 0;
  }
`;

const DocumentDetails = styled.div`
  flex: 1;
  min-width: 0;
  
  @media (max-width: 576px) {
    width: 100%;
  }
`;

const DocumentTitle = styled.h5`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #333;
`;

const DocumentMeta = styled.div`
  display: flex;
  align-items: center;
  color: #718096;
  font-size: 0.8rem;
  gap: 6px;
`;

const MetaText = styled.span`
  margin-left: 4px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: ${props => props.processing ? '#e2e8f0' : '#fe7a3f'};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: ${props => props.processing ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background-color: #e66a2f;
    transform: translateY(-2px);
  }
  
  .rotating {
    animation: rotate 1.5s linear infinite;
  }
  
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 576px) {
    width: 100%;
  }
`;

const ButtonText = styled.span`
  @media (max-width: 350px) {
    display: none;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
`;

const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: white;
  color: ${props => props.disabled ? '#a0aec0' : '#333'};
  border: 1px solid ${props => props.disabled ? '#e2e8f0' : '#e7dac1'};
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background-color: #fe7a3f;
    border-color: #fe7a3f;
    color: white;
  }
`;

const PageIndicator = styled.div`
  font-weight: 600;
  color: #4a5568;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 64px 0;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #4a5568;
  margin: 24px 0 8px 0;
`;

const EmptyStateText = styled.p`
  color: #718096;
  max-width: 400px;
  font-size: 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const NotificationContainer = styled(motion.div)`
  position: fixed;
  top: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-radius: 12px;
  background-color: ${props => props.type === "success" ? "#def7ec" : "#fee2e2"};
  color: ${props => props.type === "success" ? "#046c4e" : "#9b1c1c"};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-width: 400px;
  
  @media (max-width: 576px) {
    left: 24px;
    right: 24px;
    top: 24px;
  }
`;

const NotificationIcon = styled.div`
  margin-right: 12px;
  color: ${props => props.type === "success" ? "#0e9f6e" : "#e02424"};
`;

const NotificationMessage = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
`;