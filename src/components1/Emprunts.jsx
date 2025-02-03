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

function Emprunts() {
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

  const { darkMode } = useContext(UserContext);

  return (
    <div className="content-box">
      <Sidebar />
      <Navbar />
      <Section>
        {
          loader ?
          <Table variant={darkMode ? "dark" : undefined} bordered hover>
            <thead className="table-head">
              <tr>
                <th className="table-th">
                  Information
                </th>
                <th className="table-th">
                  Document 1
                </th>
                <th className="table-th">
                  Document 2
                </th>
                <th className="table-th">
                  Document 3
                </th>
                <th className="table-th">
                  Etat
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((doc, index) => {
                if (doc.etat1 === 'emprunt' || doc.etat2 === 'emprunt' || doc.etat3 === 'emprunt') {
                  return (
                    <tr key={doc.id}>
                      <td>
                        <div className="d-flex flex-column justify-content-between">
                          <h5>
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
                        <h5>{doc.etat1 === 'emprunt' ? doc.tabEtat1[0] + '\n' : ''}</h5>
                        {doc.etat1 === 'emprunt' ?
                          <span style={{fontSize: "12px"}}>Date: </span>
                          : ""
                        }

                        <span
                          style={{
                            fontSize: "12px",
                            color: "grey"
                          }}>
                          {doc.etat1 === 'emprunt' ? doc.tabEtat1[5].slice(0, 16) + '\n' : ''}</span>

                        <div>
                          {doc.etat1 === 'emprunt' ?
                            <Button
                              style={{
                                backgroundColor: 'chocolate',
                                marginTop: "5px",
                                fontSize: "12px",
                                fontWeight: 'bold',
                                borderColor: "chocolate",
                                padding: "3px"
                              }}
                              // className="btn-sm"
                              onClick={() => {
                                remis1(doc)
                              }}
                            >
                              Valider Remise
                            </Button>
                            :
                            <p style={{margin: "10px", fontSize: "14px"}}>
                              Le document a déjà été remis.
                            </p>
                          }
                        </div>
                      </td>

                      <td>
                        <h5>{doc.etat2 === 'emprunt' ? doc.tabEtat2[0] + '\n' : ''}</h5>
                        {doc.etat2 === 'emprunt' ?
                          <span style={{fontSize: "12px"}}>Date: </span>
                          : ""
                        }

                        <span
                          style={{
                            fontSize: "12px",
                            color: "grey"
                          }}>{doc.etat2 === 'emprunt' ? doc.tabEtat2[5].slice(0, 16) + '\n' : ''}</span>
                        <div>
                          {doc.etat2 === 'emprunt' ?
                            <Button
                              style={{
                                backgroundColor: 'chocolate',
                                marginTop: "5px",
                                fontSize: "12px",
                                fontWeight: 'bold',
                                borderColor: "chocolate",
                                padding: "3px"
                              }}
                              // className="btn-sm"
                              onClick={() => {
                                remis2(doc)
                              }}
                            >
                              Valider Remise
                            </Button>
                            :
                            <p style={{margin: "10px",fontSize: "14px"}}>
                              Le document a déjà été remis.
                            </p>
                          }
                        </div>
                      </td>

                      <td>
                        <h5>{doc.etat3 === 'emprunt' ? doc.tabEtat3[0] + '\n' : ''}</h5>
                        {doc.etat3 === 'emprunt' ?
                          <span style={{fontSize: "12px"}}>Date: </span>
                          : ""
                        }

                        <span
                          style={{
                            fontSize: "12px",
                            color: "grey"
                          }}
                        >
                          {doc.etat3 === 'emprunt' ? doc.tabEtat3[5].slice(0, 16) + '\n' : ''}
                        </span>
                        <div>
                          {doc.etat3 === 'emprunt' ?
                            <Button
                              style={{
                                backgroundColor: 'chocolate',
                                marginTop: "5px",
                                fontSize: "12px",
                                fontWeight: 'bold',
                                borderColor: "chocolate",
                                padding: "3px"
                              }}
                              // className="btn-sm"
                              onClick={() => {
                                remis3(doc)
                              }}
                            >
                              Valider Remise
                            </Button>
                            :
                            <p style={{margin: "10px",fontSize: "14px"}}>
                              Le document a déjà été remis.
                            </p>
                          }
                        </div>
                      </td>

                      <td style={{margin: "10px",fontSize: "14px"}}>{doc.etat}</td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </Table>
          :
          <Loading />
        }
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


