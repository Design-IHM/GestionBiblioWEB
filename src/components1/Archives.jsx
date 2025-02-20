import React, { useState, useEffect, useContext, useCallback } from "react";
import { Table } from 'react-bootstrap';
import firebase from '../metro.config';
import styled from "styled-components";
import Loading from "./Loading";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import { UserContext } from "../App";
import { useI18n } from "../Context/I18nContext";

function Archives() {
  const ref = firebase.firestore().collection("ArchivesBiblio");
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const { searchWord, darkMode } = useContext(UserContext);
  const { language } = useI18n();

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

  // Traductions directes pour la liste des archives
  const translations = {
    client_info: language === "FR" ? "Information utilisateur" : "user Information",
    document_name: language === "FR" ? "Nom du document" : "Document Name",
    return_date: language === "FR" ? "Date de remise" : "Return Date",
    status: language === "FR" ? "Statut" : "Status",
    returned: language === "FR" ? "Remis" : "Returned"
  };

  return (
    <div className="content-box">
      <Sidebar />
      <Navbar />
      <Section>
        {loader ? (
          <Table variant={darkMode ? "dark" : undefined} bordered hover>
            <thead>
              <tr>
                <th style={{ backgroundColor: "#E7DAC1FF", color: "chocolate", fontSize: "20px", fontWeight: "bold", width: "400px" }}>
                  {translations.client_info}
                </th>
                <th style={{ backgroundColor: "#E7DAC1FF", color: "chocolate", fontSize: "20px", fontWeight: "bold", width: "250px" }}>
                  {translations.document_name}
                </th>
                <th style={{ backgroundColor: "#E7DAC1FF", color: "chocolate", fontSize: "20px", fontWeight: "bold", width: "250px" }}>
                  {translations.return_date}
                </th>
                <th style={{ backgroundColor: "#E7DAC1FF", color: "chocolate", fontSize: "20px", fontWeight: "bold", width: "250px" }}>
                  {translations.status}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((doc, index) => {
                return doc.tableauArchives.slice().reverse().map((e, i) => {
                  if (e.nomDoc.includes(searchWord.toUpperCase()) || e.heure.toUpperCase().includes(searchWord.toUpperCase()) || e.nomEtudiant.toUpperCase().includes(searchWord.toUpperCase())) {
                    return (
                      <tr key={i}>
                        <td className="flex">
                          <p className="fw-bold">{e.nomEtudiant}</p>
                          <span style={{ color: "grey", fontSize: "12px" }}>
                            {doc.tableauArchives.length - i}
                          </span>
                        </td>
                        <td>{e.nomDoc}</td>
                        <td>{e.heure}</td>
                        <td>{translations.returned}</td>
                      </tr>
                    );
                  }
                  return null;
                });
              })}
            </tbody>
          </Table>
        ) : (
          <Loading />
        )}
      </Section>
    </div>
  );
}

export default Archives;

const Section = styled.section`
  overflow: auto;
  margin-top: 40px;
  margin-bottom: 20px;

  td, tr {
    text-align: center;
  }
`;
