import React, { useState, useEffect, useContext, useCallback } from "react";
import { Table, Button } from 'react-bootstrap';
import firebase from '../metro.config';
import styled from "styled-components";
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
  const [reservations, setReservations] = useState([]);
  const itemsPerPage = 7;

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

 

  const d = new Date();

  useEffect(() => {
    const unsubscribe = ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setReservations(items); // Mettre à jour l'état des réservations
      setLoader(true);
    });

    return () => unsubscribe(); // Nettoyer l'abonnement
  }, [ref]);



  function reserv1(dos) {
    const userRef = firebase.firestore().collection("BiblioUser");
    const bookRef = firebase.firestore().collection("BiblioInformatique");

    if (dos.etat1 === 'reserv') {
      // Mettre à jour l'état de l'utilisateur dans Firestore
      userRef.doc(dos.email).update({
        etat1: 'emprunt',
        tabEtat1: [dos.tabEtat1[0], dos.tabEtat1[1], dos.tabEtat1[2], dos.tabEtat1[3], dos.tabEtat1[4], d.toISOString()]
      }).then(() => {
        // Mettre à jour l'état local des réservations
        setReservations((prevReservations) =>
          prevReservations.map((reservation) =>
            reservation.email === dos.email
              ? {
                  ...reservation,
                  etat1: 'emprunt',
                  tabEtat1: [dos.tabEtat1[0], dos.tabEtat1[1], dos.tabEtat1[2], dos.tabEtat1[3], dos.tabEtat1[4], d.toISOString()],
                }
              : reservation
          )
        );
      }).catch((err) => {
        console.log(err);
      });

      // Incrémenter l'attribut exemplaire du livre
      bookRef
        .where("name", "==", dos.tabEtat1[0]) // Rechercher le livre par son nom
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const currentExemplaire = doc.data().exemplaire || 0;
            doc.ref.update({
              exemplaire: currentExemplaire + 1, // Incrémenter exemplaire
            });
          });
        })
        .catch((err) => {
          console.log("Erreur lors de la mise à jour du livre :", err);
        });
    }
  }
  
  function reserv2(dos) {
    const userRef = firebase.firestore().collection("BiblioUser");
    const bookRef = firebase.firestore().collection("BiblioInformatique");
  
    if (dos.etat2 === 'reserv') {
      // Mettre à jour l'état de l'utilisateur dans Firestore
      userRef.doc(dos.email).update({
        etat2: 'emprunt',
        tabEtat2: [dos.tabEtat2[0], dos.tabEtat2[1], dos.tabEtat2[2], dos.tabEtat2[3], dos.tabEtat2[4], d.toISOString()]
      }).then(() => {
        // Mettre à jour l'état local des réservations
        setReservations((prevReservations) =>
          prevReservations.map((reservation) =>
            reservation.email === dos.email
              ? {
                  ...reservation,
                  etat2: 'emprunt',
                  tabEtat2: [dos.tabEtat2[0], dos.tabEtat2[1], dos.tabEtat2[2], dos.tabEtat2[3], dos.tabEtat2[4], d.toISOString()],
                }
              : reservation
          )
        );
      }).catch((err) => {
        console.log(err);
      });
  
      // Incrémenter l'attribut exemplaire du livre
      bookRef
        .where("name", "==", dos.tabEtat2[0]) // Rechercher le livre par son nom
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const currentExemplaire = doc.data().exemplaire || 0;
            doc.ref.update({
              exemplaire: currentExemplaire + 1, // Incrémenter exemplaire
            });
          });
        })
        .catch((err) => {
          console.log("Erreur lors de la mise à jour du livre :", err);
        });
    }
  }
  
  function reserv3(dos) {
    const userRef = firebase.firestore().collection("BiblioUser");
    const bookRef = firebase.firestore().collection("BiblioInformatique");
  
    if (dos.etat3 === 'reserv') {
      // Mettre à jour l'état de l'utilisateur dans Firestore
      userRef.doc(dos.email).update({
        etat3: 'emprunt',
        tabEtat3: [dos.tabEtat3[0], dos.tabEtat3[1], dos.tabEtat3[2], dos.tabEtat3[3], dos.tabEtat3[4], d.toISOString()]
      }).then(() => {
        // Mettre à jour l'état local des réservations
        setReservations((prevReservations) =>
          prevReservations.map((reservation) =>
            reservation.email === dos.email
              ? {
                  ...reservation,
                  etat3: 'emprunt',
                  tabEtat3: [dos.tabEtat3[0], dos.tabEtat3[1], dos.tabEtat3[2], dos.tabEtat3[3], dos.tabEtat3[4], d.toISOString()],
                }
              : reservation
          )
        );
      }).catch((err) => {
        console.log(err);
      });
  
      // Incrémenter l'attribut exemplaire du livre
      bookRef
        .where("name", "==", dos.tabEtat3[0]) // Rechercher le livre par son nom
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const currentExemplaire = doc.data().exemplaire || 0;
            doc.ref.update({
              exemplaire: currentExemplaire + 1, // Incrémenter exemplaire
            });
          });
        })
        .catch((err) => {
          console.log("Erreur lors de la mise à jour du livre :", err);
        });
    }
  }

  // Traductions directes pour la liste des réservations
  const translations = {
    information: language === "FR" ? "Information" : "Information",
    document1: language === "FR" ? "Document 1" : "Document 1",
    document2: language === "FR" ? "Document 2" : "Document 2",
    document3: language === "FR" ? "Document 3" : "Document 3",
    status: language === "FR" ? "Etat" : "Status",
    validate_loan: language === "FR" ? "Valider Emprunt" : "Validate Loan",
    available_space: language === "FR" ? "Espace disponible pour une réservation" : "Space available for reservation",
    previous: language === "FR" ? "Précédent" : "Previous", // Traduction pour "Précédent"
    next: language === "FR" ? "Suivant" : "Next", // Traduction pour "Suivant"
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
    <div className="content-box">
      <Sidebar />
      <Navbar />
      <Section>
        {loader ? (
          <>
            <Table variant={darkMode ? "dark" : undefined} bordered hover>
              <thead>
                <tr>
                  <th style={{ backgroundColor: "#E7DAC1FF", color: "chocolate", fontSize: "20px", fontWeight: "bold", width: "250px" }}>
                    {translations.information}
                  </th>
                  <th style={{ backgroundColor: "#E7DAC1FF", color: "chocolate", fontSize: "20px", fontWeight: "bold", width: "250px" }}>
                    {translations.document1}
                  </th>
                  <th style={{ backgroundColor: "#E7DAC1FF", color: "chocolate", fontSize: "20px", fontWeight: "bold", width: "250px" }}>
                    {translations.document2}
                  </th>
                  <th style={{ backgroundColor: "#E7DAC1FF", color: "chocolate", fontSize: "20px", fontWeight: "bold", width: "250px" }}>
                    {translations.document3}
                  </th>
                  <th style={{ backgroundColor: "#E7DAC1FF", color: "chocolate", fontSize: "20px", fontWeight: "bold", width: "250px" }}>
                    {translations.status}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((doc, index) => (
                  <tr key={index}>
                    <td>
                      <div className="d-flex flex-column justify-content-between">
                        <h5 className="text-center">
                          {doc.name}
                        </h5>
                        <div className="mx-3 mt-4 justify-content-between d-flex flex-row ">
                          <span style={{ fontSize: "12px" }}>matricule: <p style={{ fontSize: "12px", color: "grey" }}>{doc.matricule}</p></span>
                          <span style={{ fontSize: "12px" }}>class: <p style={{ fontSize: "12px", color: "grey" }}>{doc.niveau}</p></span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <h5>{doc.etat1 === 'reserv' ? doc.tabEtat1[0] + '\n' : ''}</h5>
                      {doc.etat1 === 'reserv' ? (
                        <span style={{ fontSize: "12px" }}>Date: </span>
                      ) : ""}
                      <span style={{ fontSize: "12px", color: "grey" }}>
                        {doc.etat1 === 'reserv' ? doc.tabEtat1[5]?.toLocaleString().slice(0, 16) + '\n' : ''}
                      </span>
                      <div>
                        {doc.etat1 === 'reserv' ? (
                          <Button
                            style={{
                              backgroundColor: 'chocolate',
                              marginTop: "5px",
                              fontSize: "12px",
                              fontWeight: 'bold',
                              borderColor: "chocolate",
                              padding: "3px"
                            }}
                            onClick={() => {
                              reserv1(doc);
                            }}
                          >
                            {translations.validate_loan}
                          </Button>
                        ) : (
                          <p style={{ margin: "10px", fontSize: "14px" }}>
                            {translations.available_space}
                          </p>
                        )}
                      </div>
                    </td>

                    <td>
                      <h5>{doc.etat2 === 'reserv' ? doc.tabEtat2[0] + '\n' : ''}</h5>
                      {doc.etat2 === 'reserv' ? (
                        <span style={{ fontSize: "12px" }}>Date: </span>
                      ) : ""}
                      <span style={{ fontSize: "12px", color: "grey" }}>
                        {doc.etat2 === 'reserv' ? doc.tabEtat2[5]?.toLocaleString().slice(0, 16) + '\n' : ''}
                      </span>
                      <div>
                        {doc.etat2 === 'reserv' ? (
                          <Button
                            style={{
                              backgroundColor: 'chocolate',
                              marginTop: "5px",
                              fontSize: "12px",
                              fontWeight: 'bold',
                              borderColor: "chocolate",
                              padding: "3px"
                            }}
                            onClick={() => {
                              reserv2(doc);
                            }}
                          >
                            {translations.validate_loan}
                          </Button>
                        ) : (
                          <p style={{ margin: "10px", fontSize: "14px" }}>
                            {translations.available_space}
                          </p>
                        )}
                      </div>
                    </td>

                    <td>
                      <h5>{doc.etat3 === 'reserv' ? doc.tabEtat3[0] + '\n' : ''}</h5>
                      {doc.etat3 === 'reserv' ? (
                        <span style={{ fontSize: "12px" }}>Date: </span>
                      ) : ""}
                      <span style={{ fontSize: "12px", color: "grey" }}>
                        {doc.etat3 === 'reserv' ? doc.tabEtat3[5]?.toLocaleString().slice(0, 16) + '\n' : ''}
                      </span>
                      <div>
                        {doc.etat3 === 'reserv' ? (
                          <Button
                            style={{
                              backgroundColor: 'chocolate',
                              marginTop: "5px",
                              fontSize: "12px",
                              fontWeight: 'bold',
                              borderColor: "chocolate",
                              padding: "3px"
                            }}
                            onClick={() => {
                              reserv3(doc);
                            }}
                          >
                            {translations.validate_loan}
                          </Button>
                        ) : (
                          <p style={{ margin: "10px", fontSize: "14px" }}>
                            {translations.available_space}
                          </p>
                        )}
                      </div>
                    </td>

                    <td>{doc.etat}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {filteredData.length > itemsPerPage && (
              <PaginationContainer>
                <PaginationButton onClick={prevPage} disabled={currentPage === 1}>
                  {translations.previous} {/* Traduction pour "Précédent" */}
                </PaginationButton>
                <PageIndicator>Page {currentPage} / {totalPages}</PageIndicator>
                <PaginationButton onClick={nextPage} disabled={currentPage === totalPages}>
                  {translations.next} {/* Traduction pour "Suivant" */}
                </PaginationButton>
              </PaginationContainer>
            )}
          </>
        ) : (
          <Loading />
        )}
      </Section>
    </div>
  );
}

export default ListeReservations;

const Section = styled.section`
  overflow: auto;
  margin-top: 20px;
  margin-bottom: 20px;

  td, tr {
    text-align: center;
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