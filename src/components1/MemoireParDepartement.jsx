import React, { useState, useContext, useEffect, useCallback } from "react";
import styled from "styled-components";
import { UserContext } from "../App";
import { useLocation } from 'react-router-dom';
import { FiEdit2, FiX, FiBook, FiUser, FiCalendar, FiGrid, FiBookmark, FiMessageSquare, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import Sidebar from "../components1/Sidebar";
import Navbar from "../components1/Navbar";
import Loading from "./Loading";
import firebase from '../metro.config'; // Assurez-vous d'importer Firebase

export default function MemoireParDepartement() {
    const { searchWord } = useContext(UserContext);
    const { state } = useLocation();
    const [popupIsOpen, setPopupIsOpen] = useState(false);
    const [selectedMemoire, setSelectedMemoire] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedMemoire, setEditedMemoire] = useState(null);
    const [loading, setLoading] = useState(false);
    const [memoires, setMemoires] = useState(state ? state.memories : []);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const departement = state ? state.departement : "";

    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(memoires.length / itemsPerPage);

    const filteredMemoires = memoires.filter((doc) => {
        const docName = doc.name || "";
        return docName.toUpperCase().includes(searchWord.toUpperCase());
    });

    const sortedMemoires = [...filteredMemoires].sort((a, b) => {
        if (sortField) {
            if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
            if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedMemoires = sortedMemoires.slice(startIndex, startIndex + itemsPerPage);

    let subtitle;

    function openPopup(memoire) {
        console.log("Opening popup for:", memoire);
        setSelectedMemoire(memoire);
        setEditedMemoire({ ...memoire });
        setIsEditing(false);
        setPopupIsOpen(true);
    }

    function closePopup() {
        console.log("Closing popup");
        setPopupIsOpen(false);
        setSelectedMemoire(null);
        setEditedMemoire(null);
        setIsEditing(false);
    }

    function handleEdit() {
        setIsEditing(!isEditing);
    }

    function handleInputChange(e, field) {
        setEditedMemoire({
            ...editedMemoire,
            [field]: e.target.value
        });
    }

    const renderValue = (value) => {
        if (value === null || value === undefined) {
            return '';
        }
        if (typeof value === 'object') {
            // Si la valeur est un objet, on le convertit en chaîne lisible
            return JSON.stringify(value);
        }
        return value;
    };

    const updateMemoire = async (e) => {
        e.preventDefault(); // Empêcher le comportement par défaut du formulaire
        try {
            // Vérifiez que le champ `matricule` a une valeur définie
            if (!selectedMemoire.matricule) {
                console.error("Le champ 'matricule' est undefined.");
                return;
            }

            // Log des valeurs avant la mise à jour
            console.log("Avant la mise à jour:", selectedMemoire);
            console.log("Nouvelles valeurs:", editedMemoire);

            // Utilisez le champ `matricule` pour mettre à jour le document
            setLoading(true); // Afficher l'effet de chargement
            await firebase.firestore().collection('Memoire').doc(selectedMemoire.matricule).update(editedMemoire);
            console.log("Mémoire mis à jour avec succès");

            // Récupérer les données mises à jour depuis Firestore
            const updatedDoc = await firebase.firestore().collection('Memoire').doc(selectedMemoire.matricule).get();
            console.log("Après la mise à jour:", updatedDoc.data());

            // Mettre à jour l'état local
            setSelectedMemoire(updatedDoc.data());
            setEditedMemoire(updatedDoc.data());

            // Mettre à jour l'affichage avec les nouvelles données
            const updatedMemoires = memoires.map(memoire =>
                memoire.matricule === selectedMemoire.matricule ? updatedDoc.data() : memoire
            );
            setMemoires(updatedMemoires);

            setLoading(false); // Masquer l'effet de chargement
            closePopup();
        } catch (error) {
            console.error("Erreur lors de la mise à jour du mémoire:", error);
            setLoading(false); // Masquer l'effet de chargement en cas d'erreur
        }
    };

    useEffect(() => {
        if (selectedMemoire) {
            console.log("Selected Memoire:", selectedMemoire);
        }
    }, [selectedMemoire]);

    return (
        <div className="content-box">
            <Container>
                <Sidebar />
                <Navbar />
                <MainContent>
                    <Title>
                        <FiBook className="icon" />
                        Liste des Mémoires du {departement}
                    </Title>
                    <SortContainer>
                        <SortButton onClick={() => setSortField('name')} disabled={sortField === 'name'}>
                            Nom {sortField === 'name' ? (sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />) : <FiArrowUp />}
                        </SortButton>
                        <SortButton onClick={() => setSortField('annee')} disabled={sortField === 'annee'}>
                            Année {sortField === 'annee' ? (sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />) : <FiArrowUp />}
                        </SortButton>
                    </SortContainer>
                    <Section>
                        {displayedMemoires.length > 0 ? (
                            displayedMemoires.map((doc, index) => (
                                <Card key={index} onClick={() => openPopup(doc)}>
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
                                                <FiGrid className="icon" />
                                                <span>{doc.département}</span>
                                            </InfoItem>
                                            <InfoItem>
                                                <FiCalendar className="icon" />
                                                <span>{doc.annee}</span>
                                            </InfoItem>
                                        </CardInfo>
                                        <CardImage>
                                            <img src={doc.image} alt="mémoire" />
                                        </CardImage>
                                    </CardBody>
                                </Card>
                            ))
                        ) : (
                            <Loading />
                        )}
                    </Section>

                    {filteredMemoires.length > itemsPerPage && (
                        <PaginationContainer>
                            <PaginationButton
                                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Précédent
                            </PaginationButton>
                            <PageIndicator>Page {currentPage} / {totalPages}</PageIndicator>
                            <PaginationButton
                                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Suivant
                            </PaginationButton>
                        </PaginationContainer>
                    )}

                    {popupIsOpen && selectedMemoire && (
                        <PopupOverlay onClick={closePopup}>
                            <PopupContent onClick={e => e.stopPropagation()}>
                                <CloseButton onClick={closePopup}>
                                    <FiX />
                                </CloseButton>
                                <h2>Détails du Mémoire</h2>
                                <PopupForm onSubmit={updateMemoire}>
                                    {Object.entries(selectedMemoire).map(([key, value]) => {
                                        // Ignorer certaines clés si nécessaire
                                        if (key === 'image' || key === 'commentaire') return null;

                                        return (
                                            <FormGroup key={key}>
                                                <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                                                {isEditing ? (
                                                    typeof value === 'object' ? (
                                                        <Textarea
                                                            id={key}
                                                            value={JSON.stringify(value, null, 2)}
                                                            onChange={(e) => handleInputChange(e, key)}
                                                        />
                                                    ) : (
                                                        <Input
                                                            id={key}
                                                            type="text"
                                                            value={editedMemoire[key] || ''}
                                                            onChange={(e) => handleInputChange(e, key)}
                                                        />
                                                    )
                                                ) : (
                                                    <p>{renderValue(value)}</p>
                                                )}
                                                {!isEditing && (
                                                    <EditIcon onClick={handleEdit}>
                                                        <FiEdit2 />
                                                    </EditIcon>
                                                )}
                                            </FormGroup>
                                        );
                                    })}

                                    <ButtonContainer>
                                        <EditButton type="submit" disabled={loading}>
                                            {loading ? "Enregistrement..." : isEditing ? "Enregistrer" : "Modifier"}
                                        </EditButton>
                                    </ButtonContainer>
                                </PopupForm>
                            </PopupContent>
                        </PopupOverlay>
                    )}
                </MainContent>
            </Container>
        </div>
    );
}

// Styles...

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
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const SortButton = styled.button`
  background: white;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f0;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
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

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow-y: auto;
  max-height: 80vh;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    border-radius: 0;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #4a5568;
`;

const PopupForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #4a5568;
`;

const Input = styled.input`
  border-radius: 5px;
  border: 1px solid #e2e8f0;
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: chocolate;
    box-shadow: 0 0 0 3px rgba(210, 105, 30, 0.1);
  }
`;

const Textarea = styled.textarea`
  border-radius: 5px;
  border: 1px solid #e2e8f0;
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: chocolate;
    box-shadow: 0 0 0 3px rgba(210, 105, 30, 0.1);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const EditButton = styled.button`
  background: green;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background: darkgreen;
  }
`;

const EditIcon = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #4a5568;
  display: flex;
  align-items: center;
  justify-content: center;
`;
