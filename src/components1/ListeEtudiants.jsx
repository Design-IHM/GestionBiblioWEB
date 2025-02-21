import React, { useState, useEffect, useContext, useCallback } from "react";
import styled from "styled-components";
import firebase from '../metro.config';
import { UserContext } from "../App";
import Modal from 'react-modal';
import { Table } from 'react-bootstrap';
import Loading from "./Loading";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import { FaLock, FaUnlock } from "react-icons/fa";
import { useI18n } from "../Context/I18nContext";

Modal.setAppElement('#root');

function ListeEtudiants() {
  const { searchWord, darkMode } = useContext(UserContext);
  const { language } = useI18n();

  const ref = firebase.firestore().collection("BiblioUser");
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("recent"); // "recent" ou "old"
  const itemsPerPage = 8;

  const [tooltipText, setTooltipText] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const customStyles = {
    content: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      padding: '10px 50px',
      transform: 'translate(-50%, -50%)',
    },
  };

  const closeStyle = {
    position: "absolute",
    right: '10px',
    cursor: 'pointer',
  };

  const modalDiv = {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  };

  const imgP = {
    display: 'block',
    width: '300px',
    height: '300px',
    borderRadius: '50px'
  };

  const infor = {
    display: 'flex',
    flexDirection: 'column',
    color: 'black',
    gap: '30px',
    fontSize: '30px'
  };

  let subtitle;

  const getData = useCallback(() => {
    ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setData(items);
      setLoader(true);
    });
  }, [ref]);

  useEffect(() => {
    getData();
  }, [getData]);

  function updates(dos) {
    const ref = firebase.firestore().collection("BiblioUser");
    if (dos.etat === 'bloc') {
      ref.doc(dos.email).update({ etat: 'ras' }).catch((err) => {
        console.log(err);
      });
    } else {
      ref.doc(dos.email).update({ etat: 'bloc' }).catch((err) => {
        console.log(err);
      });
    }
  }

  const handleMouseEnter = (e, text) => {
    const rect = e.target.getBoundingClientRect();
    setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top - 10 });
    setTooltipText(text);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Traductions directes pour la liste des étudiants
  const translations = {
    profile_picture: language === "FR" ? "Photo de profil" : "Profile Picture",
    information: language === "FR" ? "Information" : "Information",
    phone: language === "FR" ? "Téléphone" : "Phone",
    status: language === "FR" ? "Statut" : "Status",
    possible_action: language === "FR" ? "Action possible" : "Possible Action",
    unlock: language === "FR" ? "Débloquer" : "Unlock",
    lock: language === "FR" ? "Bloquer" : "Lock",
    recent: language === "FR" ? "Date récente" : "Recent Date",
    old: language === "FR" ? "Date ancienne" : "Oldest Date",
    prec: language === "FR" ? "Précédent" : "Previous",
    suiv: language === "FR" ? "Suivant" : "Next"
  };

  // Filtrer les données en fonction de la recherche
  const filteredData = data.filter(etudiant =>
    etudiant.name?.toUpperCase().includes(searchWord.toUpperCase())
  );

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
      <Section darkMode={darkMode}>
        {loader ? (
          <>
            <SortContainer>
              <SortSelect value={sortOrder} onChange={handleSortChange}>
                <option value="recent">{translations.recent}</option>
                <option value="old">{translations.old}</option>
              </SortSelect>
            </SortContainer>
            <div className="table">
              <Table variant={darkMode ? "dark" : undefined} bordered>
                <thead>
                  <tr>
                    <th style={{ backgroundColor: "#E7DAC1FF", color: "chocolate", fontSize: "20px", fontWeight: "bold", width: "250px" }}>
                      {translations.profile_picture}
                    </th>
                    <th style={{ backgroundColor: "#E7DAC1FF", color: "chocolate", fontSize: "20px", fontWeight: "bold", width: "250px" }}>
                      {translations.information}
                    </th>
                    <th style={{ backgroundColor: "#E7DAC1FF", color: "chocolate", fontSize: "20px", fontWeight: "bold", width: "250px" }}>
                      {translations.phone}
                    </th>
                    <th style={{ backgroundColor: "#E7DAC1FF", color: "chocolate", fontSize: "20px", fontWeight: "bold", width: "250px" }}>
                      {translations.status}
                    </th>
                    <th style={{ backgroundColor: "#E7DAC1FF", color: "chocolate", fontSize: "20px", fontWeight: "bold", width: "250px" }}>
                      {translations.possible_action}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((etudiant, index) => (
                    <tr key={indexOfFirstItem + index + 1}>
                      <td>
                        <a href={etudiant.image}>
                          <img src={etudiant.image} className="img-pfl" alt="profil" />
                        </a>
                      </td>
                      <td>
                        <div className="d-flex flex-column justify-content-between">
                          <h5>{etudiant.name}</h5>
                          <div className="mx-3 mt-4 justify-content-between d-flex flex-row ">
                            <span style={{ fontSize: "12px" }}>matricule: <p style={{ fontSize: "12px", color: "grey" }}>{etudiant.matricule}</p></span>
                            <span style={{ fontSize: "12px" }}>class: <p style={{ fontSize: "12px", color: "grey" }}>{etudiant.niveau}</p></span>
                          </div>
                        </div>
                      </td>
                      <td className="fw-bold">{etudiant.tel}</td>
                      <td className="fw-bold">{etudiant.etat}</td>
                      <td>
                        <div className="btn-bloc-etudiant">
                          <button
                            onClick={() => updates(etudiant)}
                            onMouseEnter={(e) =>
                              handleMouseEnter(
                                e,
                                etudiant.etat === "bloc" ? translations.unlock : translations.lock
                              )
                            }
                            onMouseLeave={handleMouseLeave}
                          >
                            {etudiant.etat === "bloc" ? (
                              <FaUnlock color="green" size="20" />
                            ) : (
                              <FaLock color="red" size="20" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
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

        {showTooltip && (
          <TooltipContainer
            style={{
              top: tooltipPosition.y,
              left: tooltipPosition.x,
            }}
          >
            {tooltipText}
          </TooltipContainer>
        )}
      </Section>
    </div>
  );
}

export default ListeEtudiants;

const Section = styled.section`
  overflow: auto;
  padding: 20px;
  background-color: ${(props) => (props.darkMode ? "#333333" : "#ffffff")};
  color: ${(props) => (props.darkMode ? "#ffffff" : "#000000")};
  transition: background-color 0.3s ease, color 0.3s ease;

  .img-pfl {
    width: 80px;
    height: 80px;
    border-radius: 100%;
  }

  .btn-bloc-etudiant a {
    padding: 8px;
    border-radius: 10px;
    cursor: pointer;
  }

  .btn-bloc-etudiant {
    margin-bottom: 10px;
  }

  .table {
    margin-bottom: 20px;
    flex: 1;
    overflow-y: auto;
  }

  th,
  td {
    text-align: center;
  }

  @media screen and (max-width: 768px) {
    padding: 10px;
    .table {
      margin-top: 20px;
      margin-bottom: 10px;
    }
    th,
    td {
      font-size: 14px;
    }
    .btn-bloc-etudiant {
      margin-top: 5px;
      margin-bottom: 5px;
    }
  }

  @media screen and (max-width: 480px) {
    padding: 5px;
    .table {
      margin-top: 10px;
      margin-bottom: 5px;
    }
    th,
    td {
      font-size: 12px;
    }
    .btn-bloc-etudiant {
      margin-top: 3px;
      margin-bottom: 3px;
    }
  }
`;

const TooltipContainer = styled.div`
  position: absolute;
  background-color: black;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  transform: translate(-50%, -100%);
  z-index: 999;
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
