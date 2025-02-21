import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../App";
import firebase from "../metro.config";
import Modal from 'react-modal';
import { GrFormClose } from 'react-icons/gr';
import {FaGraduationCap } from 'react-icons/fa';
import Sidebar from "../components1/Sidebar";
import Navbar from "../components1/Navbar";
import Loading from "./Loading";

export default function CatalogueMemoire() {
  const location = useLocation();
  const { state } = location;
  const departement = state?.département || null;
  const navigate = useNavigate();
  const { searchWord } = useContext(UserContext);

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [matricule, setMatricule] = useState("");
  const [theme, setTheme] = useState("");
  const [département, setDépartement] = useState("");
  const [annee, setAnnee] = useState("");
  const [etagere, setEtagere] = useState("");
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);

  const customStyles = {
    content: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      padding: '10px 50px',
      transform: 'translate(-50%, -50%)',
    },
  };

  const ref = firebase.firestore().collection("Memoire");

  const getData = useCallback(() => {
    
    if (departement) {
      ref.where("département", "==", departement).onSnapshot((querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => items.push(doc.data()));
        setData(items);
        console.log("Mémoire récupérées :", items);
        setLoader(true);
      });
    } else {
      ref.onSnapshot((querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => items.push(doc.data()));
        setData(items);
        console.log("Mémories récupérées :", items);
        setLoader(true);
      });
    }
  }, [ref, departement]);

  useEffect(() => {
    console.log("Département reçu :", departement);

    getData();
  }, [getData, departement]);

  function openModal(e) {
    setMatricule(e.matricule);
    setName(e.name);
    setAnnee(e.annee);
    setDépartement(e.département);
    setEtagere(e.etagere);
    setTheme(e.theme);
    setComment(e.commentaire);
    setImage(e.image);
    setIsOpen(true);
  }

  const resUpdate = async function () {
    await ref.doc(matricule).set({
      name,
      matricule,
      theme,
      département,
      annee: parseInt(annee),
      etagere,
      image,
      commentaire: comment,
    });
    setIsOpen(false);
  };

  const deleteDoc = async function () {
    await ref.doc(matricule).delete();
    setIsOpen(false);
  };

 

console.log("Département reçu :", departement); // Ajoute ce log pour vérifier

  return (
    <div className="content-box">
      <Container>
      <Sidebar />
      <Navbar />
      
      <MainContent>
        <ButtonContainer>
          
          <StyledButton onClick={() => navigate("/catalogueMemoire")} color="#28a745">
            <FaGraduationCap className="text-lg" />
            Mémoire
          </StyledButton>
        </ButtonContainer>

        <Title>Liste des Mémoires {departement}</Title>

        <Section>
          {loader ? (
            data.map((doc, index) => {
              const docName = doc.name || "";
              const search = searchWord || "";

              if (docName.toUpperCase().includes(search.toUpperCase())) {
                return (
                  <Card key={index} onClick={() => openModal(doc)}>
                    <CardContent>
                      <ThemeTitle>{doc.theme}</ThemeTitle>
                      <AuthorName>{doc.name}</AuthorName>
                      <Department>Département : {doc.département}</Department>
                      <Year>Année : {doc.annee}</Year>
                    </CardContent>
                    <CardImage>
                      <a href={doc.image}>
                        <img src={doc.image} alt="mémoire" />
                      </a>
                    </CardImage>
                  </Card>
                );
              }
              return null;
            })
          ) : (
            <Loading />
          )}
        </Section>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setIsOpen(false)}
          style={customStyles}
        >
          <CloseButton onClick={() => setIsOpen(false)}>
            <GrFormClose />
          </CloseButton>
          <ModalTitle>Détails du Mémoire</ModalTitle>
          <ModalForm>
            <FormLabel>Nom</FormLabel>
            <FormInput
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FormLabel>Thème</FormLabel>
            <FormInput
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            />
            <ButtonGroup>
              <ActionButton onClick={resUpdate} color="#28a745">
                Mettre à jour
              </ActionButton>
              <ActionButton onClick={deleteDoc} color="#dc3545">
                Supprimer
              </ActionButton>
            </ButtonGroup>
          </ModalForm>
        </Modal>
      </MainContent>
    </Container>
    </div>
  );
}

// Styled Components
const Container = styled.div`
  min-height: 100vh;
 
`;

const MainContent = styled.div`
  padding: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.color};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.9;
  }
`;

const Title = styled.h1`
  text-align: center;
  color: gray;
  margin-bottom: 2rem;
  font-size: 1.8rem;
`;

const Section = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
`;

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ThemeTitle = styled.h3`
  color: chocolate;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const AuthorName = styled.h4`
  color: #333;
  text-align: center;
`;

const Department = styled.h6`
  color: black;
  text-align: center;
  margin-top: 0.5rem;
`;

const Year = styled.h6`
  color: #666;
  text-align: center;
  margin-top: 0.5rem;
`;

const CardImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;

  img {
    width: 100px;
    height: 100px;
    border-radius: 10px;
    object-fit: cover;
  }
`;

// Modal Styles
const CloseButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
`;

const ModalTitle = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const FormLabel = styled.label`
  font-size: 1rem;
  color: #333;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.color};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.9;
  }
`;