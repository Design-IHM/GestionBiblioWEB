import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import styled from "styled-components";
import { UserContext } from "../App";
import Modal from 'react-modal';
import ReactJsAlert from "reactjs-alert";
import { GrFormClose } from "react-icons/gr";
import { FiBook, FiUser, FiGrid, FiBookmark } from 'react-icons/fi';
import Loading from "./Loading";
import { useLocation } from 'react-router-dom';
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import firebase from '../metro.config';

export default function Catalogue() {
    const location = useLocation();
    const departement = location.state.departement;

    // Modal
    const [modalIsOpen, setIsOpen] = useState(false);

    // Alert
    const [status, setStatus] = useState(false);
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");

    function openModal(e) {
        setNomBD(e.nomBD);
        setName(e.name);
        setExemplaire(e.exemplaire);
        setCathegorie(e.cathegorie);
        setEtagere(e.etagere);
        setDesc(e.desc);
        setComment(e.commentaire);
        setIsOpen(true);
        setImage(e.image);
    }

    function afterOpenModal() {
        subtitle.style.color = '#000';
    }

    function closeModal() {
        setIsOpen(false);
    }

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

    const formClass = {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    };

    const labelForm = {
        fontSize: "20px",
    };

    const labelInput = {
        borderRadius: "5px",
        border: "1px solid",
        width: "100%",
        height: "30px",
    };

    let subtitle;

    const [name, setName] = useState('');
    const [nomBD, setNomBD] = useState('');
    const [cathegorie, setCathegorie] = useState('');
    const [desc, setDesc] = useState('');
    const [etagere, setEtagere] = useState('');
    const [exemplaire, setExemplaire] = useState(0);
    const [image, setImage] = useState(null);
    const [comment, setComment] = useState(null);
    const [salle, setSalle] = useState('');
    const formRef = useRef();

    const { searchWord } = useContext(UserContext);

    // Firebase
    const ref = firebase.firestore().collection("BiblioInformatique");
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(false);

    const getData = useCallback(() => {
        ref.where('cathegorie', '==', departement).onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
                setLoader(true);
            });
            setData(items);
            console.log("Données récupérées :", items);
        });
    }, [ref, departement]);

    useEffect(() => {
        getData();
    }, [getData]);

    // Pagination
    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const filteredData = data.filter((doc) => {
        const docName = doc.name || "";
        return docName.toUpperCase().includes(searchWord.toUpperCase());
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    function nextPage() {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    }

    function prevPage() {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    }

    // Add a new document in collection "cities" with ID 'LA'
    const resUpdate = async function () {
        await firebase.firestore().collection('BiblioInformatique').doc(nomBD).set({
            name: name,
            exemplaire: parseInt(exemplaire),
            etagere: etagere,
            salle: salle,
            image: image,
            cathegorie: cathegorie,
            desc: desc,
            nomBD: nomBD,
            commentaire: comment
        });
        setStatus(true);
        setType("success");
        setTitle("Document ajouté avec succès");
        setIsOpen(false);
    }

    // Delete
    const deleteDoc = async function () {
        await firebase.firestore().collection('BiblioInformatique').doc(nomBD).delete();
        setIsOpen(false);
    }

    return (
        <div className="content-box">
            <Container>
                <Sidebar />
                <Navbar />
                <MainContent>
                    <Title>
                        <FiBook className="icon" />
                        Liste des Livres du {departement}
                    </Title>
                    <Section>
                        {loader ? (
                            displayedData.map((doc, index) => (
                                <Card key={index} onClick={() => openModal(doc)}>
                                    <CardHeader>
                                        <ThemeTitle>
                                            <FiBookmark className="icon" />
                                            {doc.name}
                                        </ThemeTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <CardInfo>
                                            <InfoItem>
                                                <FiUser className="icon" />
                                                <span>{doc.cathegorie}</span>
                                            </InfoItem>
                                            <InfoItem>
                                                <FiGrid className="icon" />
                                                <span>{doc.exemplaire}</span>
                                            </InfoItem>
                                        </CardInfo>
                                        <CardImage>
                                            <img src={doc.image} alt="logo" />
                                        </CardImage>
                                    </CardBody>
                                </Card>
                            ))
                        ) : (
                            <Loading />
                        )}
                    </Section>
                    {filteredData.length > itemsPerPage && (
                        <PaginationContainer>
                            <PaginationButton onClick={prevPage} disabled={currentPage === 1}>
                                Précédent
                            </PaginationButton>
                            <PageIndicator>Page {currentPage} / {totalPages}</PageIndicator>
                            <PaginationButton onClick={nextPage} disabled={currentPage === totalPages}>
                                Suivant
                            </PaginationButton>
                        </PaginationContainer>
                    )}
                    <div>
                        <Modal
                            isOpen={modalIsOpen}
                            onAfterOpen={afterOpenModal}
                            onRequestClose={closeModal}
                            style={customStyles}
                            contentLabel="Example Modal"
                        >
                            <button onClick={closeModal} style={closeStyle}><GrFormClose /></button>
                            <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Modifier le document</h2>
                            <form ref={formRef} style={formClass}>
                                <label className="labelForm" style={labelForm} htmlFor="name">Entrer le nouveau nom</label>
                                <input style={labelInput} id="name" type="text" placeholder={name} name="name" value={name} onChange={(e) => setName(e.target.value)} />
                                <label className="labelForm" style={labelForm} htmlFor="exemp">Entrer le nouveau nombre d'exemplaire</label>
                                <input style={labelInput} id="exemp" type="text" placeholder="Nouveau nombre exemplaire..." name="exemplaire" value={exemplaire} onChange={(e) => setExemplaire(e.target.value)} />
                                <label className="labelForm" style={labelForm} htmlFor="class">Entrer la nouvelle matière</label>
                                <select style={labelInput} id="class" type="text" placeholder="Nouvelle catégorie..." name='cathegorie' value={cathegorie} onChange={(e) => setCathegorie(e.target.value)} >
                                    <option value=''></option>
                                    <option value='Mathematique'>Mathematique</option>
                                    <option value='Physique'>Physique</option>
                                    <option value='Chimie'>Chimie</option>
                                    <option value='Genie Informatique'>Genie Informatique</option>
                                    <option value="Genie Civile">Genie Civile</option>
                                    <option value='Genie Electrique'>Genie Electrique</option>
                                    <option value='Genie Mecanique'>Genie Mecanique</option>
                                    <option value='Genie Telecom'>Genie Telecom</option>
                                    <option value='Genie Electrique'>Genie Electrique</option>
                                    <option value='Memoire GI'>Memoire Genie Informatique</option>
                                    <option value='Memoire GC'>Memoire Genie Civile</option>
                                    <option value='Memoire GELE'>Memoire Genie Electrique</option>
                                    <option value='Memoire GET'>Memoire Genie Telecom</option>
                                    <option value='Memoire GIndus'>Memoire Genie Industriel</option>
                                    <option value='Memoire GM'>Memoire Genie Mecanique</option>
                                </select>
                                <label className="labelForm" style={labelForm} htmlFor="salle">Entrer son nouveau numero de salle</label>
                                <select style={labelInput} id="salle" type="text" placeholder="Nouvelle salle..." name="salle" value={salle} onChange={(e) => setSalle(e.target.value)}>
                                    <option value=''></option>
                                    <option value='1'>1</option>
                                    <option value='2'>2</option>
                                    <option value='3'>3</option>
                                    <option value='4'>4</option>
                                </select>
                                <label className="labelForm" style={labelForm} htmlFor="etagere">Entrer la position de l'étagère</label>
                                <input style={labelInput} id="etagere" type="text" placeholder="Nouvelle étagère..." name="etagere" value={etagere} onChange={(e) => setEtagere(e.target.value)} />
                                <label className="labelForm" style={labelForm} htmlFor="desc">Entrer la nouvelle description</label>
                                <textarea style={labelInput} id="etagere" type="desc" placeholder="Nouvelle description..." name="description" value={desc} onChange={(e) => setDesc(e.target.value)} />
                                <ReactJsAlert
                                    status={status} // true or false
                                    type={type} // success, warning, error, info
                                    title={title}
                                    quotes={true}
                                    quote=""
                                    Close={() => setStatus(false)}
                                />
                                <div className="btn-sub" style={{ display: 'flex', gap: '160px' }}>
                                    <button type='button' onClick={resUpdate} className='btn-btn-primary' style={{ display: 'flex', borderRadius: 5, textAlign: 'center', padding: 10, color: 'white', background: 'green', width: 100 }}>Modifier</button>
                                    <button type='button' onClick={deleteDoc} className='btn-btn-primary' style={{ display: 'flex', borderRadius: 5, textAlign: 'center', padding: 10, color: 'white', background: 'red', width: 100 }}>Supprimer</button>
                                </div>
                            </form>
                        </Modal>
                    </div>
                </MainContent>
            </Container>
        </div>
    );
}

const Container = styled.div`
  min-height: 100vh;
`;

const MainContent = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #2d3748;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;

  .icon {
    color: chocolate;
  }
`;

const Section = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  padding: 1rem;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;
  margin: 0;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }
`;

const CardHeader = styled.div`
  padding: 1rem;
  background: #E7DAC1FF;
`;

const CardBody = styled.div`
  padding: 1rem;
`;

const ThemeTitle = styled.h3`
  color: black;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;

  .icon {
    font-size: 1em;
  }
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  font-size: 0.9rem;

  .icon {
    color: chocolate;
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 150px;
  overflow: hidden;
  border-radius: 8px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
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
