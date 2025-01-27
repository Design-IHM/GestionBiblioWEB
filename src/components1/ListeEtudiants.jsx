import React, { useState, useEffect, useContext, useCallback } from "react";
import styled from "styled-components";
import firebase from '../metro.config';
import { UserContext } from "../App";
import Modal from 'react-modal';
import { GrFormClose } from "react-icons/gr";
import { Table } from 'react-bootstrap';
import Loading from "./Loading";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import { FaLock, FaUnlock } from "react-icons/fa";

Modal.setAppElement('#root');

function ListeEtudiants() {
  const { searchWord, darkMode } = useContext(UserContext);

  const ref = firebase.firestore().collection("BiblioUser");
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  // Modal
  const [modalIsOpens, setIsOpens] = useState(false);
  const [name, setName] = useState('');
  const [niveau, setNiveau] = useState('');
  const [matricule, setMatricule] = useState('');
  const [tel, setTel] = useState('');
  const [image, setImage] = useState('');
  const [stat, setStat] = useState('');
  const [setEmail] = useState('');

  const [tooltipText, setTooltipText] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

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

  const closeStyle = {
    position: "absolute",
    right: '10px',
    top: '10px',
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

  function afterOpenModal() {
    subtitle.style.color = '#000';
  }

  function closeModal() {
    setIsOpens(false);
  }

  function openModal(e) {
    setName(e.name);
    setNiveau(e.niveau);
    setMatricule(e.matricule);
    setTel(e.tel);
    setIsOpens(true);
    setImage(e.image);
    setStat(e.etat);
    setEmail(e.email);
  }

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

  
  
  const Section = styled.section`
  overflow: auto;
  padding: 20px;
  background-color: ${(props) => (props.darkMode ? "#333333" : "#ffffff")};
  color: ${(props) => (props.darkMode ? "#ffffff" : "#000000")};
  transition: background-color 0.3s ease, color 0.3s ease;

  .img-pfl {
    width: 50px;
    height: 50px;
    border-radius: 5px;
  }

  .btn-bloc-etudiant a {
    padding: 8px;
    border-radius: 10px;
    cursor: pointer;
  }

  .btn-bloc-etudiant {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .table {
    margin-top: 40px;
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
      <Section>
        {loader ? (
          <div className="table">
            <Table variant={darkMode ? "dark" : undefined} striped bordered hover>
              <thead>
                <tr>
                  <th>Photo de profil</th>
                  <th>Nom</th>
                  <th>Classe</th>
                  <th>Matricule</th>
                  <th>Téléphone</th>
                  <th>Statut</th>
                  <th>Action possible</th>
                </tr>
              </thead>
              <tbody>
                {data.map((etudiant, index) => {
                  if (etudiant.name && etudiant.name.toUpperCase().includes(searchWord.toUpperCase())) {
                    return (
                      <tr key={index + 1}>
                        <td>
                          <a href={etudiant.image} alt='profil'>
                            <img src={etudiant.image} className="img-pfl" alt="profil" />
                          </a>
                        </td>
                        <td onClick={() => openModal(etudiant)} style={{ cursor: 'pointer' }}>{etudiant.name}</td>
                        <td onClick={() => openModal(etudiant)} style={{ cursor: 'pointer' }}>{etudiant.niveau}</td>
                        <td onClick={() => openModal(etudiant)} style={{ cursor: 'pointer' }}>{etudiant.matricule}</td>
                        <td onClick={() => openModal(etudiant)} style={{ cursor: 'pointer' }}>{etudiant.tel}</td>
                        <td onClick={() => openModal(etudiant)} style={{ cursor: 'pointer' }}>{etudiant.etat}</td>
                        <td>
                          <div className="btn-bloc-etudiant">
                            <button
                              onClick={() => updates(etudiant)}
                              onMouseEnter={(e) =>
                                handleMouseEnter(
                                  e,
                                  etudiant.etat === "bloc" ? "Débloquer" : "Bloquer"
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

        <div className="resp-modal">
          <Modal
            isOpen={modalIsOpens}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <button onClick={closeModal} style={closeStyle}>
              <GrFormClose />
            </button>
            <h2 ref={(_subtitle) => (subtitle = _subtitle)}>
              Informations personnelles sur l'étudiant: {name}
            </h2>
            <div style={modalDiv}>
              <div>
                <img style={imgP} src={image} alt="profil" />
              </div>
              <div style={infor}>
                <span>Matricule : {matricule}</span>
                <span>Classe : {niveau}</span>
                <span>Téléphone : {tel}</span>
                <span>Statut : {stat}</span>
              </div>
            </div>
          </Modal>
        </div>
      </Section>
    </div>
    
    
  );
}

export default ListeEtudiants;


