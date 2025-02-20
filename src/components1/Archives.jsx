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
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("recent"); // "recent" ou "old"
  const itemsPerPage = 8;

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
    returned: language === "FR" ? "Remis" : "Returned",
    recent:language==="FR"?"Date récente":"recent date",
    old:language === "FR"? "Date ancienne" : "oldest date",
    prec: language === "FR" ? "Précédent": "Previous",
    suiv: language === "FR" ? "Suivant" : "Next"
  };

  // Filtrer les données en fonction de la recherche
  const filteredData = data.flatMap(doc => 
    doc.tableauArchives.slice().reverse().filter(e => 
      e.nomDoc.includes(searchWord.toUpperCase()) || 
      e.heure.toUpperCase().includes(searchWord.toUpperCase()) || 
      e.nomEtudiant.toUpperCase().includes(searchWord.toUpperCase())
  ));

  // Trier les données par date
  const sortedData = [...filteredData].sort((a, b) => {
    const dateA = new Date(a.heure); // Supposons que "heure" est la propriété de la date
    const dateB = new Date(b.heure);
    return sortOrder === "recent" ? dateB - dateA : dateA - dateB;
  });

  // Calculer les indices de début et de fin pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  // Total des pages
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Changer de page
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Changer l'ordre de tri
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1); // Réinitialiser à la première page après le tri
  };

  return (
    <div className="content-box">
      <Sidebar />
      <Navbar />
      <Section>
        {loader ? (
          <>
            <SortContainer>
              <SortSelect value={sortOrder} onChange={handleSortChange}>
                <option value="recent">{translations.recent}</option>
                <option value="old">{translations.old}</option>
              </SortSelect>
            </SortContainer>
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
                {currentItems.map((e, i) => (
                  <tr key={i}>
                    <td className="flex">
                      <p className="fw-bold">{e.nomEtudiant}</p>
                      <span style={{ color: "grey", fontSize: "12px" }}>
                        {sortedData.length - (indexOfFirstItem + i)}
                      </span>
                    </td>
                    <td>{e.nomDoc}</td>
                    <td>{e.heure}</td>
                    <td>{translations.returned}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {sortedData.length > itemsPerPage && (
              <PaginationContainer>
                <PaginationButton onClick={prevPage} disabled={currentPage === 1}>
                {translations.prec}
                </PaginationButton>
                <PageIndicator>Page {currentPage} / {totalPages}</PageIndicator>
                <PaginationButton onClick={nextPage} disabled={currentPage === totalPages}>
                {translations.suiv}
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

export default Archives;

const Section = styled.section`
  overflow: auto;
  margin-top: 40px;
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

const SortContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const SortSelect = styled.select`
  background: white;
  border: 1px solid chocolate;
  height: 40px;
  width: 150px;
  border-radius: 8px;
  padding: 0.5rem;
  color: chocolate;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: chocolate;
    color: white;
  }
`;