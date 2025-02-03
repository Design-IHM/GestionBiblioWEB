import React, { useState, useEffect, useContext, useCallback } from "react";
import { Table, Button } from 'react-bootstrap';
import firebase from '../metro.config';
import styled from "styled-components";
import Loading from "./Loading";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import { UserContext } from "../App";

function ListeReservations() {
  const ref = firebase.firestore().collection("BiblioUser");
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

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


  const d = new Date();

  function reserv1(dos) {
    const ref = firebase.firestore().collection("BiblioUser");
    if (dos.etat1 === 'reserv') {
      ref.doc(dos.email).update({
        etat1: 'emprunt',
        tabEtat1: [dos.tabEtat1[0], dos.tabEtat1[1], dos.tabEtat1[2], dos.tabEtat1[3], dos.tabEtat1[4], d.toISOString()]
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  function reserv2(dos) {
    const ref = firebase.firestore().collection("BiblioUser");
    if (dos.etat2 === 'reserv') {
      ref.doc(dos.email).update({
        etat2: 'emprunt',
        tabEtat2: [dos.tabEtat2[0], dos.tabEtat2[1], dos.tabEtat2[2], dos.tabEtat2[3], dos.tabEtat2[4], d.toISOString()]
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  function reserv3(dos) {
    const ref = firebase.firestore().collection("BiblioUser");
    if (dos.etat3 === 'reserv') {
      ref.doc(dos.email).update({
        etat3: 'emprunt',
        tabEtat3: [dos.tabEtat3[0], dos.tabEtat3[1], dos.tabEtat3[2], dos.tabEtat3[3], dos.tabEtat3[4], d.toISOString()]
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  const { darkMode } = useContext(UserContext);

  return (
    <div className="content-box">
      <Sidebar />
      <Navbar />
      <Section>
        {loader ?
          <Table variant={darkMode ? "dark" : undefined} bordered hover>
            <thead>
            <tr>
              <th style={{
                backgroundColor: "#E7DAC1FF", color: "chocolate", fontSize: "20px", fontWeight: "bold", width: "250px"
              }}>
                Information
              </th>
              <th style={{
                backgroundColor: "#E7DAC1FF", color: "chocolate", fontSize: "20px", fontWeight: "bold", width: "250px"
              }}>
                Document 1
              </th>
              <th style={{
                backgroundColor: "#E7DAC1FF", color: "chocolate", fontSize: "20px", fontWeight: "bold", width: "250px"
              }}>
                Document 2
              </th>
              <th style={{
                backgroundColor: "#E7DAC1FF", color: "chocolate", fontSize: "20px", fontWeight: "bold", width: "250px"
              }}>
                Document 3
              </th>
              <th style={{
                backgroundColor: "#E7DAC1FF", color: "chocolate", fontSize: "20px", fontWeight: "bold", width: "250px"
              }}>
                Etat</th>
            </tr>
            </thead>
            <tbody>
              {data.map((doc, index) => {
                if (doc.etat1 === 'reserv' || doc.etat2 === 'reserv' || doc.etat3 === 'reserv') {
                  return (
                    <tr key={doc.id}>
                      <td>
                        <div className="d-flex flex-column justify-content-between">
                          <h5 className="text-center">
                              {doc.name}
                            </h5>
                          <div className="mx-3 mt-4 justify-content-between d-flex flex-row ">
                            <span style={{fontSize: "12px"}}>id: <p
                                style={{fontSize: "12px", color: "grey"}}>{index + 1}</p></span>
                            <span style={{fontSize: "12px"}}>class: <p
                                  style={{fontSize: "12px", color: "grey"}}>{doc.niveau}</p></span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <h5>{doc.etat1 === 'reserv' ? doc.tabEtat1[0] + '\n' : ''}</h5>
                        {doc.etat1 === 'reserv' ? (
                          <span style={{fontSize: "12px"}}>Date: </span>
                          ) : ""
                        }
                        <span
                          style={{
                            fontSize: "12px",
                            color: "grey"
                          }}
                        >
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
                              Valider Emprunt
                            </Button>
                            ) : (
                              <p style={{margin: "10px", fontSize: "14px"}}>
                                Espace disponible pour une réservation
                              </p>
                            )}
                          </div>
                      </td>

                        <td>
                          <h5>{doc.etat2 === 'reserv' ? doc.tabEtat2[0] + '\n' : ''}</h5>
                          {doc.etat2 === 'reserv' ? (
                              <span style={{fontSize: "12px"}}>Date: </span>
                          ) : ""
                          }
                          <span
                            style={{
                              fontSize: "12px",
                              color: "grey"
                            }}
                          >
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
                                Valider Emprunt
                              </Button>
                            ) : (
                              <p style={{margin: "10px", fontSize: "14px"}}>
                                Espace disponible pour une réservation
                              </p>
                            )}
                          </div>
                        </td>

                        <td>
                          <h5>{doc.etat3 === 'reserv' ? doc.tabEtat3[0] + '\n' : ''}</h5>
                          {doc.etat3 === 'reserv' ? (
                              <span style={{fontSize: "12px"}}>Date: </span>
                          ) : ""
                          }
                          <span
                              style={{
                                fontSize: "12px",
                                color: "grey"
                              }}
                          >
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
                                Valider Emprunt
                              </Button>
                              ) : (
                              <p style={{margin: "10px", fontSize: "14px"}}>
                                Espace disponible pour une réservation
                              </p>
                            )}
                          </div>
                        </td>

                        <td>{doc.etat}</td>
                      </tr>
                  );
                }
                return null; // Ajoute cette ligne pour retourner quelque chose même si la condition n'est pas remplie
              })}
            </tbody>
          </Table> :
            <Loading/>
        }
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
