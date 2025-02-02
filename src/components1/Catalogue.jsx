import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import styled from "styled-components";
import { cardStyles } from "./ReusableStyles";
import firebase from '../metro.config';
import { UserContext } from "../App";
import Modal from 'react-modal';
import ReactJsAlert from "reactjs-alert";
import { GrFormClose } from "react-icons/gr";
import Pagination from "react-bootstrap/Pagination";
import Loading from "./Loading";
import { useLocation } from 'react-router-dom';
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';

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
    const itemsPerPage = 6;
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
                    <h1 style={{ textAlign: 'center', color: 'gray', marginTop: '10px', marginBottom: '20px' }}>Liste des Livres du {departement}</h1>
                    <Section>
                    {loader ? (
                        displayedData.map((doc, index) => {
                            if (doc.name.toUpperCase().includes(searchWord.toUpperCase())) {
                                return (
                                    <Card key={index} onClick={() => openModal(doc)} style={{ backgroundColor: 'white' }}>
                                        <CardContent>
                                            <h3 style={{ textAlign: 'center', color: 'chocolate', marginTop: '10px', marginBottom: '20px' }}>{doc.name}</h3>
                                            <h6 style={{ textAlign: 'center', color: 'black', marginTop: '10px' }}>Département : {doc.cathegorie}</h6>
                                            <h6 style={{ textAlign: 'center', color: doc.exemplaire === 0 ? 'red' : 'green', marginTop: '10px', marginBottom: '20px' }}>Exemplaire disponible: {doc.exemplaire}</h6>
                                        </CardContent>
                                        <CardImage>
                                            <a href={doc.image}>
                                                <img src={doc.image} alt="logo" />
                                            </a>
                                        </CardImage>
                                    </Card>
                                );
                            }
                            return null;
                        })
                    ) : <Loading />}
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
                
                </MainContent >
             </Container>
           
            
            
           
        </div>
    );
}

const Section = styled.section`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    
    overflow-x: auto;

    .analytic {
        ${cardStyles};
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: start;
        background-color: #fff;
        color: grey;
        gap: 1rem;
        transition: 0.5s ease-in-out;

        &:hover {
            background-color: #fff;
            color: grey;
            transform: scale(1.03);
        }

        .content {
            cursor: pointer;
        }

        .logo img {
            background-color: black;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100px;
            height: 100px;
        }
    }

    @media screen and (min-width: 280px) and (max-width: 720px) {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));

        .analytic {
            &:nth-of-type(3),
            &:nth-of-type(4) {
                flex-direction: row-reverse;
            }
        }
    }
`;

const Card = styled.div`
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    margin: 1rem;
    transition: transform 0.3s ease;
    background-color: white;

    &:hover {
        transform: scale(1.05);
    }
`;

const CardContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const CardImage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;

    img {
        width: 100px;
        height: 100px;
        border-radius: 10px;
    }
`;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    gap: 10px;
`;

const PaginationButton = styled.button`
    background-color: chocolate;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

const PageIndicator = styled.span`
    font-size: 1rem;
    color: #333;
`;

const MainContent = styled.div`
  padding: 2rem;
`;

const Container = styled.div`
  min-height: 100vh;
`;