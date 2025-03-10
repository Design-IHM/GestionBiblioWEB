import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { UserContext } from "../App";
import { useLocation, useNavigate } from 'react-router-dom'; // Ajout de useNavigate pour la redirection
import { FiBook, FiUser, FiCalendar, FiGrid, FiBookmark, FiHardDrive } from 'react-icons/fi';
import Sidebar from "../components1/Sidebar";
import Navbar from "../components1/Navbar";
import Loading from "./Loading";
import firebase from '../metro.config';
import { useI18n } from "../Context/I18nContext";

export default function MemoireParDepartement() {
    const { searchWord } = useContext(UserContext);
    const { state } = useLocation();
    const navigate = useNavigate(); // Pour la navigation vers these_details
    const [loading, setLoading] = useState(true); // Start with loading true
    const [memoires, setMemoires] = useState([]);
    const [departement, setDepartement] = useState("");
    const [sortOption, setSortOption] = useState('nameAsc');

    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(memoires.length / itemsPerPage);

    const filteredMemoires = memoires.filter((doc) => {
        const docName = doc.name || "";
        return docName.toUpperCase().includes(searchWord.toUpperCase());
    });

    useEffect(() => {
        // First try to get data from navigation state
        if (state && state.memories && state.memories.length > 0) {
            console.log("Received memoires from navigation:", state.memories);
            setMemoires(state.memories);
            setDepartement(state.departement || "");
            setLoading(false);
        }
        // If no data in navigation or empty array, fetch from Firestore
        else {
            const departmentName = state?.departement || "";
            setDepartement(departmentName);

            console.log("Fetching memoires for department:", departmentName);

            const fetchMemoires = async () => {
                try {
                    let query = firebase.firestore().collection("Memoire");

                    // If we have a department name, filter by it
                    if (departmentName) {
                        query = query.where("département", "==", departmentName);
                    }

                    const snapshot = await query.get();
                    const items = [];
                    snapshot.forEach(doc => items.push(doc.data()));

                    console.log("Fetched memoires:", items);
                    setMemoires(items);
                } catch (error) {
                    console.error("Error fetching memoires:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchMemoires();
        }
    }, [state]);

    const sortedMemoires = [...filteredMemoires].sort((a, b) => {
        if (sortOption === 'nameAsc') {
            return a.name.localeCompare(b.name);
        } else if (sortOption === 'nameDesc') {
            return b.name.localeCompare(a.name);
        } else if (sortOption === 'anneeAsc') {
            return a.annee - b.annee;
        } else if (sortOption === 'anneeDesc') {
            return b.annee - a.annee;
        }
        return 0;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedMemoires = sortedMemoires.slice(startIndex, startIndex + itemsPerPage);

    // Fonction pour naviguer vers la page de détails lors du clic sur une carte
    const handleCardClick = (memoire) => {
        console.log("Navigating to these details for:", memoire);
        navigate(`/these-details/${memoire.matricule}`, { state: { memory: memoire } });
    };

    const { language } = useI18n();

    // Traductions directes pour la gestion des mémoires
    const translations = {
        list_memoires: language === "FR" ? "Liste des Mémoires du" : "List of Memories from",
        name_asc: language === "FR" ? "Nom A-Z" : "Name A-Z",
        name_desc: language === "FR" ? "Nom Z-A" : "Name Z-A",
        year_asc: language === "FR" ? "Année croissante" : "Year Ascending",
        year_desc: language === "FR" ? "Année décroissante" : "Year Descending",
        theme: language === "FR" ? "Thème" : "Theme",
        department: language === "FR" ? "Département" : "Department",
        year: language === "FR" ? "Année" : "Year",
        shelf_number: language === "FR" ? "Étagère" : "Shelf Number",
        image: language === "FR" ? "Image" : "Image",
        previous: language === "FR" ? "Précédent" : "Previous",
        next: language === "FR" ? "Suivant" : "Next",
        page: language === "FR" ? "Page" : "Page",
        no_memories: language === "FR" ? "Aucun mémoire trouvé pour" : "No memories found for",
    };

    return (
        <div className="content-box">
            <Container>
                <Sidebar />
                <Navbar />
                <MainContent>
                    <Title>
                        <FiBook className="icon" />
                        {translations.list_memoires} {departement}
                    </Title>
                    <SortContainer>
                        <SortSelect value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                            <option value="nameAsc">{translations.name_asc}</option>
                            <option value="nameDesc">{translations.name_desc}</option>
                            <option value="anneeAsc">{translations.year_asc}</option>
                            <option value="anneeDesc">{translations.year_desc}</option>
                        </SortSelect>
                    </SortContainer>

                    <Section>
                        {loading ? (
                          <Loading />
                        ) : displayedMemoires.length > 0 ? (
                          displayedMemoires.map((doc, index) => (
                            <Card key={index} onClick={() => handleCardClick(doc)}>
                                <CardHeader>
                                    <ThemeTitle>
                                        <FiBookmark className="icon" />
                                        {doc.theme}
                                    </ThemeTitle>
                                </CardHeader>
                                <CardBody>
                                    <CardInfo>
                                        <InfoItem>
                                            <FiUser className="icon" />
                                            <span>{doc.name}</span>
                                        </InfoItem>
                                     
                                        <InfoItem>
                                            <FiCalendar className="icon" />
                                            <span>{doc.annee}</span>
                                        </InfoItem>
                                        <InfoItem>
                                            <FiHardDrive className="icon" />
                                            <span>{translations.shelf_number}: {doc.etagere}</span>
                                        </InfoItem>
                                    </CardInfo>
                                    <CardImage>
                                        <img src={doc.image} alt="mémoire" />
                                    </CardImage>
                                </CardBody>
                            </Card>
                          ))
                        ) : (
                          <NoDataMessage>
                              {translations.no_memories} {departement || "ce département"}
                          </NoDataMessage>
                        )}
                    </Section>

                    {filteredMemoires.length > itemsPerPage && (
                        <PaginationContainer>
                            <PaginationButton
                                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                {translations.previous}
                            </PaginationButton>
                            <PageIndicator>Page {currentPage} / {totalPages}</PageIndicator>
                            <PaginationButton
                                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                {translations.next}
                            </PaginationButton>
                        </PaginationContainer>
                    )}
                </MainContent>
            </Container>
        </div>
    );
}

const Container = styled.div`
  min-height: 100vh;
`;

const MainContent = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #2d3748;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;

  .icon {
    color: chocolate;
  }
`;

const SortContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const SortSelect = styled.select`
  background: white;
  border: 1px solid chocolate;
  height: 40px;
  width: 200px;
  border-radius: 60px;
  padding: 0.5rem;
  color: chocolate;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background: chocolate;
    color: white;
  }
`;

const Section = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr); // Forcé à 4 colonnes au lieu de auto-fill
  gap: 1.5rem;
  padding: 1rem;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const NoDataMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%; // Permet à la carte de prendre toute la largeur de sa cellule
  margin: 0;   // Retire la marge auto

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }
`;

const CardHeader = styled.div`
  padding: 1rem;
  background:  #E7DAC1FF;
`;

const CardBody = styled.div`
  padding: 1rem;
`;

const ThemeTitle = styled.h3`
  color: black;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;

  .icon {
    font-size: 1em;
  }
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  font-size: 0.9rem;

  .icon {
    color: chocolate;
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 150px;
  overflow: hidden;
  border-radius: 8px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PaginationButton = styled.button`
  background: ${props => props.disabled ? '#ccc' : 'white'};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  color: ${props => props.disabled ? '#666' : 'chocolate'};
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: chocolate;
    color: white;
  }
`;

const PageIndicator = styled.span`
  color: #4a5568;
  font-weight: 500;
`;