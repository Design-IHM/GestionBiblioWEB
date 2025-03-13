import React, { useState, useEffect, useContext, useCallback } from "react";
import firebase from '../metro.config';
import { arrayUnion } from "firebase/firestore";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaBook,
    FaPlus,
    FaCalendarAlt,
    FaCheckCircle,
    FaClock,
    FaArrowLeft,
    FaArrowRight,
    FaTimes,
    FaUser
} from "react-icons/fa";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import { UserContext } from "../App";
import { useI18n } from "../Context/I18nContext";
// import Avatar from 'react-avatar';

function Emprunts() {
    const ref = firebase.firestore().collection("BiblioUser");
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(false);
    const { darkMode } = useContext(UserContext);
    const { language } = useI18n();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // États pour gérer les animations et les notifications
    const [processingItem, setProcessingItem] = useState(null);
    const [notification, setNotification] = useState({ visible: false, type: "", message: "" });

    const getData = useCallback(() => {
        ref.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            setData(items);
            setLoader(true);
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

    function ajouter(nomEtudiant, nomDoc) {
        const washingtonRef = firebase.firestore().collection("ArchivesBiblio").doc("Arch");
        let date = new Date();
        washingtonRef.update({
            tableauArchives: arrayUnion({ "nomEtudiant": nomEtudiant, "nomDoc": nomDoc, "heure": date.toISOString().slice(0, 25) })
        });
    }

    async function remis1(dos) {
        if (dos.etat1 === 'emprunt') {
            setProcessingItem(dos.email + "-1");
            try {
                const collectionName = dos.tabEtat1[4] || "BiblioInformatique";
                const refDoc = firebase.firestore().collection(collectionName);

                const nomDoc = dos.tabEtat1[0];
                const exemplaires = dos.tabEtat1[3] || 0;

                const querySnapshot = await refDoc.where("name", "==", nomDoc).get();

                if (querySnapshot.empty) {
                    console.error(`Document ${nomDoc} introuvable dans la collection ${collectionName}`);
                    showNotification("error", language === "FR" ? "Document introuvable" : "Document not found");
                    return;
                }

                const docRef = querySnapshot.docs[0].ref;

                await docRef.update({ exemplaire: exemplaires + 1 });

                ajouter(dos.name, nomDoc);

                await ref.doc(dos.email).update({ etat1: 'ras', tabEtat1: ["", "", ""] });

                showNotification("success", `${language === "FR" ? "Le document" : "Document"} "${nomDoc}" ${language === "FR" ? "a été remis avec succès" : "has been successfully returned"}`);
            } catch (err) {
                console.error("Erreur détaillée:", err);
                showNotification("error", language === "FR" ? "Une erreur s'est produite" : "An error occurred");
            } finally {
                setProcessingItem(null);
            }
        }
    }

    async function remis2(dos) {
        if (dos.etat2 === 'emprunt') {
            setProcessingItem(dos.email + "-2");
            try {
                const collectionName = dos.tabEtat2[4] || "BiblioInformatique";
                const refDoc = firebase.firestore().collection(collectionName);

                const nomDoc = dos.tabEtat2[0];
                const exemplaires = dos.tabEtat2[3] || 0;

                const querySnapshot = await refDoc.where("name", "==", nomDoc).get();

                if (querySnapshot.empty) {
                    console.error(`Document ${nomDoc} introuvable dans la collection ${collectionName}`);
                    showNotification("error", language === "FR" ? "Document introuvable" : "Document not found");
                    return;
                }

                const docRef = querySnapshot.docs[0].ref;

                await docRef.update({ exemplaire: exemplaires + 1 });

                ajouter(dos.name, nomDoc);

                await ref.doc(dos.email).update({ etat2: 'ras', tabEtat2: ["", "", ""] });

                showNotification("success", `${language === "FR" ? "Le document" : "Document"} "${nomDoc}" ${language === "FR" ? "a été remis avec succès" : "has been successfully returned"}`);
            } catch (err) {
                console.error("Erreur détaillée:", err);
                showNotification("error", language === "FR" ? "Une erreur s'est produite" : "An error occurred");
            } finally {
                setProcessingItem(null);
            }
        }
    }

    async function remis3(dos) {
        if (dos.etat3 === 'emprunt') {
            setProcessingItem(dos.email + "-3");
            try {
                const collectionName = dos.tabEtat3[4] || "BiblioInformatique";
                const refDoc = firebase.firestore().collection(collectionName);

                const nomDoc = dos.tabEtat3[0];
                const exemplaires = dos.tabEtat3[3] || 0;

                const querySnapshot = await refDoc.where("name", "==", nomDoc).get();

                if (querySnapshot.empty) {
                    console.error(`Document ${nomDoc} introuvable dans la collection ${collectionName}`);
                    showNotification("error", language === "FR" ? "Document introuvable" : "Document not found");
                    return;
                }

                const docRef = querySnapshot.docs[0].ref;

                await docRef.update({ exemplaire: exemplaires + 1 });

                ajouter(dos.name, nomDoc);

                await ref.doc(dos.email).update({ etat3: 'ras', tabEtat3: ["", "", ""] });

                showNotification("success", `${language === "FR" ? "Le document" : "Document"} "${nomDoc}" ${language === "FR" ? "a été remis avec succès" : "has been successfully returned"}`);
            } catch (err) {
                console.error("Erreur détaillée:", err);
                showNotification("error", language === "FR" ? "Une erreur s'est produite" : "An error occurred");
            } finally {
                setProcessingItem(null);
            }
        }
    }

    // Traductions directes pour la liste des emprunts
    const translations = {
        loans: language === "FR" ? "Emprunts en cours" : "Current Loans",
        information: language === "FR" ? "Information" : "Information",
        document1: language === "FR" ? "Document 1" : "Document 1",
        document2: language === "FR" ? "Document 2" : "Document 2",
        document3: language === "FR" ? "Document 3" : "Document 3",
        validate_return: language === "FR" ? "Valider la renise" : "Validate the renise",
        processing: language === "FR" ? "Traitement..." : "Processing...",
        document_returned: language === "FR" ? "Document remis" : "Document returned",
        previous: language === "FR" ? "Précédent" : "Previous",
        next: language === "FR" ? "Suivant" : "Next",
        new_loan: language === "FR" ? "Nouvel emprunt" : "New Loan",
        no_loans: language === "FR" ? "Aucun emprunt en cours" : "No current loans",
        no_loans_message: language === "FR" ? "Lorsque des étudiants emprunteront des documents, ils apparaîtront ici" : "When students borrow documents, they will appear here",
        email: language === "FR" ? "Email" : "Email",
        level: language === "FR" ? "Niveau" : "Level",
    };

    // Filtrer les données pour n'afficher que les emprunts en cours
    const filteredData = data.filter((doc) => doc.etat1 === 'emprunt' || doc.etat2 === 'emprunt' || doc.etat3 === 'emprunt');

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
        <AppContainer darkMode={darkMode}>
        <SidebarWrapper>
            <Sidebar />
        </SidebarWrapper>
            <MainContent>
                <Navbar />

                <PageContent>
                    <PageHeader>
                        <HeaderTitle>
                            <FaBook size={20} style={{ marginRight: '10px' }} />
                            {translations.loans}
                        </HeaderTitle>
                        <NewLoanButton>
                            <FaPlus size={14} style={{ marginRight: '8px' }} />
                            {translations.new_loan}
                        </NewLoanButton>
                    </PageHeader>

                    {loader ? (
                        <>
                            {filteredData.length > 0 ? (
                                <LoansContainer>
                                    {currentItems.map((user) => (
                                        <LoanCard key={user.email} darkMode={darkMode}>
                                            <UserInfoSection>
                                                <AvatarContainer>
                                                    {user.imageUri ? (
                                                        <UserAvatar src={user.imageUri} alt={user.name} />
                                                    ) : (
                                                        <UserAvatarPlaceholder>
                                                            <FaUser size={32} />
                                                        </UserAvatarPlaceholder>
                                                    )}
                                                </AvatarContainer>
                                                <UserDetails>
                                                    <UserName>{user.name}</UserName>
                                                    <UserMeta>
                                                        <MetaItem>
                                                            <MetaLabel>{translations.email}:</MetaLabel>
                                                            <MetaValue>{user.email || "N/A"}</MetaValue>
                                                        </MetaItem>
                                                        <MetaItem>
                                                            <MetaLabel>{translations.level}:</MetaLabel>
                                                            <MetaValue>{user.niveau || "N/A"}</MetaValue>
                                                        </MetaItem>
                                                    </UserMeta>
                                                </UserDetails>
                                            </UserInfoSection>

                                            <DocumentsSection>
                                                <DocsHeader>
                                                    <DocsTitle>Documents empruntés</DocsTitle>
                                                </DocsHeader>
                                                <DocsList>
                                                    {user.etat1 === 'emprunt' && (
                                                        <DocItem>
                                                            <DocImageWrapper>
                                                                {user.tabEtat1[2] ? (
                                                                    <DocImage src={user.tabEtat1[2]} alt={user.tabEtat1[0]} />
                                                                ) : (
                                                                    <DocImagePlaceholder>
                                                                        <FaBook size={24} />
                                                                    </DocImagePlaceholder>
                                                                )}
                                                            </DocImageWrapper>
                                                            <DocContent>
                                                                <DocHeader>
                                                                    <DocTitleWrapper>
                                                                        <DocTitle>{user.tabEtat1[0]}</DocTitle>
                                                                        <DocCategory>{user.tabEtat1[1]}</DocCategory>
                                                                        <DocDate>
                                                                            <FaCalendarAlt size={12} />
                                                                            <span>{user.tabEtat1[5].slice(0, 16)}</span>
                                                                        </DocDate>
                                                                    </DocTitleWrapper>
                                                                </DocHeader>
                                                                <ReturnButtonContainer>
                                                                    <ReturnButton
                                                                        onClick={() => remis1(user)}
                                                                        disabled={processingItem === user.email + "-1"}
                                                                        processing={processingItem === user.email + "-1"}
                                                                    >
                                                                        {processingItem === user.email + "-1" ? (
                                                                            <>
                                                                                <FaClock size={14} className="rotating" />
                                                                                {translations.processing}
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <FaCheckCircle size={14} />
                                                                                {translations.validate_return}
                                                                            </>
                                                                        )}
                                                                    </ReturnButton>
                                                                </ReturnButtonContainer>
                                                            </DocContent>
                                                        </DocItem>
                                                    )}

                                                    {user.etat2 === 'emprunt' && (
                                                        <DocItem>
                                                            <DocImageWrapper>
                                                                {user.tabEtat2[2] ? (
                                                                    <DocImage src={user.tabEtat2[2]} alt={user.tabEtat2[0]} />
                                                                ) : (
                                                                    <DocImagePlaceholder>
                                                                        <FaBook size={24} />
                                                                    </DocImagePlaceholder>
                                                                )}
                                                            </DocImageWrapper>
                                                            <DocContent>
                                                                <DocHeader>
                                                                    <DocTitleWrapper>
                                                                        <DocTitle>{user.tabEtat2[0]}</DocTitle>
                                                                        <DocCategory>{user.tabEtat2[1]}</DocCategory>
                                                                        <DocDate>
                                                                            <FaCalendarAlt size={12} />
                                                                            <span>{user.tabEtat2[5].slice(0, 16)}</span>
                                                                        </DocDate>
                                                                    </DocTitleWrapper>
                                                                </DocHeader>
                                                                <ReturnButtonContainer>
                                                                    <ReturnButton
                                                                        onClick={() => remis2(user)}
                                                                        disabled={processingItem === user.email + "-2"}
                                                                        processing={processingItem === user.email + "-2"}
                                                                    >
                                                                        {processingItem === user.email + "-2" ? (
                                                                            <>
                                                                                <FaClock size={14} className="rotating" />
                                                                                {translations.processing}
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <FaCheckCircle size={14} />
                                                                                {translations.validate_return}
                                                                            </>
                                                                        )}
                                                                    </ReturnButton>
                                                                </ReturnButtonContainer>
                                                            </DocContent>
                                                        </DocItem>
                                                    )}

                                                    {user.etat3 === 'emprunt' && (
                                                        <DocItem>
                                                            <DocImageWrapper>
                                                                {user.tabEtat3[2] ? (
                                                                    <DocImage src={user.tabEtat3[2]} alt={user.tabEtat3[0]} />
                                                                ) : (
                                                                    <DocImagePlaceholder>
                                                                        <FaBook size={24} />
                                                                    </DocImagePlaceholder>
                                                                )}
                                                            </DocImageWrapper>
                                                            <DocContent>
                                                                <DocHeader>
                                                                    <DocTitleWrapper>
                                                                        <DocTitle>{user.tabEtat3[0]}</DocTitle>
                                                                        <DocCategory>{user.tabEtat3[1]}</DocCategory>
                                                                        <DocDate>
                                                                            <FaCalendarAlt size={12} />
                                                                            <span>{user.tabEtat3[5].slice(0, 16)}</span>
                                                                        </DocDate>
                                                                    </DocTitleWrapper>
                                                                </DocHeader>
                                                                <ReturnButtonContainer>
                                                                    <ReturnButton
                                                                        onClick={() => remis3(user)}
                                                                        disabled={processingItem === user.email + "-3"}
                                                                        processing={processingItem === user.email + "-3"}
                                                                    >
                                                                        {processingItem === user.email + "-3" ? (
                                                                            <>
                                                                                <FaClock size={14} className="rotating" />
                                                                                {translations.processing}
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <FaCheckCircle size={14} />
                                                                                {translations.validate_return}
                                                                            </>
                                                                        )}
                                                                    </ReturnButton>
                                                                </ReturnButtonContainer>
                                                            </DocContent>
                                                        </DocItem>
                                                    )}
                                                </DocsList>
                                            </DocumentsSection>
                                        </LoanCard>
                                    ))}

                                    {filteredData.length > itemsPerPage && (
                                        <PaginationContainer>
                                            <PaginationButton onClick={prevPage} disabled={currentPage === 1}>
                                                <FaArrowLeft size={14} style={{ marginRight: '5px' }} />
                                                {translations.previous}
                                            </PaginationButton>
                                            <PageIndicator>
                                                {currentPage} / {totalPages}
                                            </PageIndicator>
                                            <PaginationButton onClick={nextPage} disabled={currentPage === totalPages}>
                                                {translations.next}
                                                <FaArrowRight size={14} style={{ marginLeft: '5px' }} />
                                            </PaginationButton>
                                        </PaginationContainer>
                                    )}
                                </LoansContainer>
                            ) : (
                                <EmptyStateContainer>
                                    <FaBook size={64} color="#E7DAC1" />
                                    <EmptyStateTitle>{translations.no_loans}</EmptyStateTitle>
                                    <EmptyStateText>{translations.no_loans_message}</EmptyStateText>
                                </EmptyStateContainer>
                            )}
                        </>
                    ) : (
                        <LoadingContainer>
                            <LoadingSpinner>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </LoadingSpinner>
                        </LoadingContainer>
                    )}

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
                </PageContent>
            </MainContent>
        </AppContainer>
    );
}

export default Emprunts;

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: ${props => props.darkMode ? '#2D3748' : '#f8f9fa'};
  color: ${props => props.darkMode ? '#E2E8F0' : '#1A202C'};
  position: relative;
  overflow: hidden;
`;

const SidebarWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  z-index: 1000;
  transition: transform 0.3s ease;
  background-color: ${props => props.darkMode ? '#1A202C' : '#ffffff'};
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 0;
  }
`;

const MainContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  margin-left: 320px;
  width:  calc(100% - 250px);
  transition: margin-left 0.3s ease, width 0.3s ease;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;

const PageContent = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  position: relative;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
`;

const NewLoanButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fe7a3f;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e66a2f;
  }

  @media (max-width: 576px) {
    width: 100%;
  }
`;

const LoansContainer = styled.div`
  display: flex;
  width: 80%;
  margin: 0 auto;
  flex-direction: column;
  gap: 16px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const LoanCard = styled.div`
  background-color: ${props => props.darkMode ? '#3A4556' : 'white'};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const UserInfoSection = styled.div`
  display: flex;
  padding: 16px;
  border-bottom: 1px solid ${props => props.darkMode ? '#4A5568' : '#E2E8F0'};
  background-color: ${props => props.darkMode ? '#2D3748' : '#fcfcfc'};

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const AvatarContainer = styled.div`
  margin-right: 16px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 3px;
    right: 3px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #10B981;
    border: 2px solid white;
  }

  @media (max-width: 576px) {
    margin-right: 0;
    margin-bottom: 12px;
  }
`;

const UserAvatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #E7DAC1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const UserAvatarPlaceholder = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #E7DAC1;
  color: #6B240C;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const UserDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const UserName = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 8px 0;
  color: #333;
  font-weight: 600;
  display: flex;
  align-items: center;
`;

const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MetaItem = styled.div`
  display: flex;
  font-size: 0.85rem;

  @media (max-width: 576px) {
    justify-content: center;
  }
`;

const MetaLabel = styled.span`
  color: #718096;
  margin-right: 4px;
  font-weight: 500;
`;

const MetaValue = styled.span`
  color: #4A5568;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;

  @media (max-width: 576px) {
    max-width: 100%;
  }
`;


const DocumentsSection = styled.div`
  padding: 12px 16px;
`;

const DocsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #EDF2F7;
`;

const DocsTitle = styled.h4`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DocsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    width: 100%;
  }
`;

const DocImageWrapper = styled.div`
  width: 80px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 16px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #eaeaea;

  @media (max-width: 480px) {
    width: 60px;
    height: 80px;
    margin-right: 12px;
  }
`;

const DocImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DocImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f2f2f2;
  color: #bdbdbd;
`;

const DocContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const DocCategory = styled.span`
  font-size: 0.75rem;
  color: #718096;
  font-style: italic;
  margin-bottom: 2px;
`;

// Mise à jour du style DocItem pour la nouvelle disposition horizontale
const DocItem = styled.div`
  display: flex;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #fe7a3f;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
  margin-bottom: 12px;

  &:hover {
    background-color: #EDF2F7;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 400px) {
    flex-direction: column;
    align-items: center;

    ${DocImageWrapper} {
      margin-right: 0;
      margin-bottom: 12px;
      width: 100px;
      height: 130px;
    }
  }
`;

const DocHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const DocTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

const DocTitle = styled.h4`
  margin: 0 0 3px 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DocDate = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #718096;
  font-size: 0.75rem;
`;

const ReturnButtonContainer = styled.div`
  width: 100%;
  margin-top: 6px;
`;

const ReturnButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background-color: ${props => props.processing ? '#E2E8F0' : '#fe7a3f'};
  color: ${props => props.processing ? '#4A5568' : 'white'};
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: ${props => props.processing ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s;
  width: 100%;

  &:hover:not(:disabled) {
    background-color: #e66a2f;
  }

  .rotating {
    animation: rotate 1.5s linear infinite;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
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
  background-color: ${props => props.disabled ? '#E2E8F0' : 'white'};
  color: ${props => props.disabled ? '#A0AEC0' : '#333'};
  border: 1px solid ${props => props.disabled ? '#E2E8F0' : '#E7DAC1'};
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #E7DAC1;
    color: #333;
  }
`;

const PageIndicator = styled.div`
  font-weight: 500;
  color: #4A5568;
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 0;
`;

const EmptyStateTitle = styled.h3`
  margin: 16px 0 8px;
  font-size: 1.25rem;
  color: #4A5568;
`;

const EmptyStateText = styled.p`
  color: #718096;
  max-width: 400px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;

  div {
    position: absolute;
    top: 33px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #fe7a3f;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }

  div:nth-child(1) {
    left: 8px;
    animation: lds-ellipsis1 0.6s infinite;
  }

  div:nth-child(2) {
    left: 8px;
    animation: lds-ellipsis2 0.6s infinite;
  }

  div:nth-child(3) {
    left: 32px;
    animation: lds-ellipsis2 0.6s infinite;
  }

  div:nth-child(4) {
    left: 56px;
    animation: lds-ellipsis3 0.6s infinite;
  }

  @keyframes lds-ellipsis1 {
    0% { transform: scale(0); }
    100% { transform: scale(1); }
  }

  @keyframes lds-ellipsis3 {
    0% { transform: scale(1); }
    100% { transform: scale(0); }
  }

  @keyframes lds-ellipsis2 {
    0% { transform: translate(0, 0); }
    100% { transform: translate(24px, 0); }
  }
`;

const NotificationContainer = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background-color: ${props => props.type === "success" ? "#D4EDDA" : "#F8D7DA"};
  color: ${props => props.type === "success" ? "#155724" : "#721C24"};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-width: 350px;
`;

const NotificationIcon = styled.div`
  margin-right: 12px;
`;

const NotificationMessage = styled.div`
  font-size: 0.95rem;
`;