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
    lock: language === "FR" ? "Bloquer" : "Lock"
  };

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
    flex:1;
    overflow-y:auto;
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

  return (
    <div className="content-box">
      <Sidebar />
      <Navbar />
      <Section darkMode={darkMode}>
        {loader ? (
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
                {data.map((etudiant, index) => {
                  if (etudiant.name && etudiant.name.toUpperCase().includes(searchWord.toUpperCase())) {
                    return (
                      <tr key={index + 1}>
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
                    );
                  }
                  return null;
                })}
              </tbody>
            </Table>
          </div>
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
