import { Table, Button } from 'react-bootstrap';
import firebase from '../metro.config';
import React, { useState, useEffect, useContext, useCallback } from "react";
import { arrayUnion } from "firebase/firestore";
import styled from "styled-components";
import Loading from "./Loading";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import "./Table.css"
import { UserContext } from "../App";
import { useI18n } from "../Context/I18nContext";

function Emprunts() {
  const ref = firebase.firestore().collection("BiblioUser");
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const { darkMode } = useContext(UserContext);
  const { language } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
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

  useEffect(() => {
    getData();
  }, [getData]);

  function ajouter(nomEtudiant, nomDoc) {
    const washingtonRef = firebase.firestore().collection("ArchivesBiblio").doc("Arch");
    let date = new Date();
    washingtonRef.update({
      tableauArchives: arrayUnion({ "nomEtudiant": nomEtudiant, "nomDoc": nomDoc, "heure": date.toISOString().slice(0, 25) })
    });
  }

  function remis1(dos) {
    const ref = firebase.firestore().collection("BiblioUser");
    const refDoc = firebase.firestore().collection(dos.tabEtat1[1]);
    if (dos.etat1 === 'emprunt') {
      ajouter(dos.name, dos.tabEtat1[0]);
      ref.doc(dos.email).update({ etat1: 'ras', tabEtat1: ["", "", ""] }).catch((err) => {
        console.log(err);
      });
      refDoc.doc(dos.tabEtat1[4]).update({ exemplaire: dos.tabEtat1[3] + 1 }).catch((err) => {
        console.log(err);
      });
    }
  }

  function remis2(dos) {
    const ref = firebase.firestore().collection("BiblioUser");
    const refDoc = firebase.firestore().collection(dos.tabEtat2[1]);
    if (dos.etat2 === 'emprunt') {
      ajouter(dos.name, dos.tabEtat2[0]);
      ref.doc(dos.email).update({ etat2: 'ras', tabEtat2: ["", "", ""] }).catch((err) => {
        console.log(err);
      });
      refDoc.doc(dos.tabEtat2[4]).update({ exemplaire: dos.tabEtat2[3] + 1 }).catch((err) => {
        console.log(err);
      });
    }
  }

  function remis3(dos) {
    const ref = firebase.firestore().collection("BiblioUser");
    const refDoc = firebase.firestore().collection(dos.tabEtat3[1]);
    if (dos.etat3 === 'emprunt') {
      ajouter(dos.name, dos.tabEtat3[0]);
      ref.doc(dos.email).update({ etat3: 'ras', tabEtat3: ["", "", "", ""] }).catch((err) => {
        console.log(err);
      });
      refDoc.doc(dos.tabEtat3[4]).update({ exemplaire: dos.tabEtat3[3] + 1 }).catch((err) => {
        console.log(err);
      });
    }
  }

  // Traductions directes pour la liste des emprunts
  const translations = {
    information: language === "FR" ? "Information" : "Information",
    document1: language === "FR" ? "Document 1" : "Document 1",
    document2: language === "FR" ? "Document 2" : "Document 2",
    document3: language === "FR" ? "Document 3" : "Document 3",
    status: language === "FR" ? "Etat" : "Status",
    validate_return: language === "FR" ? "Valider Remise" : "Validate Return",
    document_returned: language === "FR" ? "Le document a déjà été remis." : "The document has already been returned.",
    previous: language === "FR" ? "Précédent" : "Previous", // Traduction pour "Précédent"
    next: language === "FR" ? "Suivant" : "Next", // Traduction pour "Suivant"
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
                        <h5>{doc.name}</h5>
                        <div className="mx-3 mt-4 justify-content-between d-flex flex-row ">
                          <span style={{ fontSize: "12px" }}>id: <p style={{ fontSize: "12px", color: "grey" }}>{indexOfFirstItem + index + 1}</p></span>
                          <span style={{ fontSize: "12px" }}>class: <p style={{ fontSize: "12px", color: "grey" }}>{doc.niveau}</p></span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <h5>{doc.etat1 === 'emprunt' ? doc.tabEtat1[0] + '\n' : ''}</h5>
                      {doc.etat1 === 'emprunt' ? (
                        <span style={{ fontSize: "12px" }}>Date: </span>
                      ) : ""}
                      <span style={{ fontSize: "12px", color: "grey" }}>
                        {doc.etat1 === 'emprunt' ? doc.tabEtat1[5].slice(0, 16) + '\n' : ''}
                      </span>
                      <div>
                        {doc.etat1 === 'emprunt' ? (
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
                              remis1(doc);
                            }}
                          >
                            {translations.validate_return}
                          </Button>
                        ) : (
                          <p style={{ margin: "10px", fontSize: "14px" }}>
                            {translations.document_returned}
                          </p>
                        )}
                      </div>
                    </td>

                    <td>
                      <h5>{doc.etat2 === 'emprunt' ? doc.tabEtat2[0] + '\n' : ''}</h5>
                      {doc.etat2 === 'emprunt' ? (
                        <span style={{ fontSize: "12px" }}>Date: </span>
                      ) : ""}
                      <span style={{ fontSize: "12px", color: "grey" }}>
                        {doc.etat2 === 'emprunt' ? doc.tabEtat2[5].slice(0, 16) + '\n' : ''}
                      </span>
                      <div>
                        {doc.etat2 === 'emprunt' ? (
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
                              remis2(doc);
                            }}
                          >
                            {translations.validate_return}
                          </Button>
                        ) : (
                          <p style={{ margin: "10px", fontSize: "14px" }}>
                            {translations.document_returned}
                          </p>
                        )}
                      </div>
                    </td>

                    <td>
                      <h5>{doc.etat3 === 'emprunt' ? doc.tabEtat3[0] + '\n' : ''}</h5>
                      {doc.etat3 === 'emprunt' ? (
                        <span style={{ fontSize: "12px" }}>Date: </span>
                      ) : ""}
                      <span style={{ fontSize: "12px", color: "grey" }}>
                        {doc.etat3 === 'emprunt' ? doc.tabEtat3[5].slice(0, 16) + '\n' : ''}
                      </span>
                      <div>
                        {doc.etat3 === 'emprunt' ? (
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
                              remis3(doc);
                            }}
                          >
                            {translations.validate_return}
                          </Button>
                        ) : (
                          <p style={{ margin: "10px", fontSize: "14px" }}>
                            {translations.document_returned}
                          </p>
                        )}
                      </div>
                    </td>

                    <td style={{ margin: "10px", fontSize: "14px" }}>{doc.etat}</td>
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

export default Emprunts;

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