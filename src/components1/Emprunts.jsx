import { Table, Button } from 'react-bootstrap';
import firebase from '../metro.config';
import React, { useState, useEffect, useContext, useCallback } from "react";
import { arrayUnion } from "firebase/firestore";
import styled from "styled-components";
import Loading from "./Loading";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
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
        {loader ?
          <Table variant={darkMode ? "dark" : undefined} striped bordered hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Nom</th>
                <th>Classe</th>
                <th>Document 1</th>
                <th>Document 2</th>
                <th>Document 3</th>
                <th>Etat</th>
              </tr>
            </thead>
            <tbody>
              {data.map((doc, index) => {
                if (doc.etat1 === 'emprunt' || doc.etat2 === 'emprunt' || doc.etat3 === 'emprunt') {
                  return (
                    <tr key={doc.id}>
                      <td>{index + 1}</td>
                      <td>{doc.name}</td>
                      <td>{doc.niveau}</td>
                      <td>
                        <h4>{doc.etat1 === 'emprunt' ? doc.tabEtat1[0] + '\n' : ''}</h4>
                        <h6>{doc.etat1 === 'emprunt' ? doc.tabEtat1[5].slice(0, 16) + '\n' : ''}</h6>
                        <div>
                          {doc.etat1 === 'emprunt' ?
                            <Button
                              style={{ backgroundColor: 'green', marginTop: '10px', fontWeight: 'bold' }}
                              variant="secondary"
                              className="btn-sm"
                              onClick={() => { remis1(doc) }}
                            >
                              Valider Remise
                            </Button>
                            : "Le document a déjà été remis."}
                        </div>
                      </td>
                      <td>
                        <h4>{doc.etat2 === 'emprunt' ? doc.tabEtat2[0] + '\n' : ''}</h4>
                        <h6>{doc.etat2 === 'emprunt' ? doc.tabEtat2[5].slice(0, 16) + '\n' : ''}</h6>
                        <div>
                          {doc.etat2 === 'emprunt' ?
                            <Button
                              style={{ backgroundColor: 'green', marginTop: '10px', fontWeight: 'bold' }}
                              variant="secondary"
                              className="btn-sm"
                              onClick={() => { remis2(doc) }}
                            >
                              Valider Remise
                            </Button>
                            : "Le document a déjà été remis."}
                        </div>
                      </td>
                      <td>
                        <h4>{doc.etat3 === 'emprunt' ? doc.tabEtat3[0] + '\n' : ''}</h4>
                        <h6>{doc.etat3 === 'emprunt' ? doc.tabEtat3[5].slice(0, 16) + '\n' : ''}</h6>
                        <div>
                          {doc.etat3 === 'emprunt' ?
                            <Button
                              style={{ backgroundColor: 'green', marginTop: '10px', fontWeight: 'bold' }}
                              variant="secondary"
                              className="btn-sm"
                              onClick={() => { remis3(doc) }}
                            >
                              Valider Remise
                            </Button>
                            : "Le document a déjà été remis."}
                        </div>
                      </td>
                      <td>{doc.etat}</td>
                    </tr>
                  );
                }
                return null; // Ajoute cette ligne pour retourner quelque chose même si la condition n'est pas remplie
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
  margin-top: 40px;
  margin-bottom: 20px;

  td, tr {
    text-align: center;
  }
`;


