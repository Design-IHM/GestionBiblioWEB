import React, { useState, useRef } from "react";
import { Button as BootstrapButton, Form, Row, Col, Container, Card } from "react-bootstrap";
import ReactJsAlert from "reactjs-alert";
import "./AjoutDoc.css";
import firebase from '../metro.config';
import { useNavigate } from "react-router-dom";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';

import styled from 'styled-components';
import memoire from "../../src/assets/mémoirecard.jpeg"
import livre from "../../src/assets/livrecard.jpg"

export default function Ajoutermémoirec() {
    const [name, setName] = useState('')
    const [matricule, setMatricule] = useState('')
    const [theme, setTheme] = useState('')
    const [département, setDépartement] = useState('');
    const [annee, setAnnee] = useState('')
    const [etagere, setEtagere] = useState('')
    const [image, setImage] = useState('');
    const formRef = useRef()
    const navigate = useNavigate();

    const res = async function () {
        await firebase.firestore().collection('Memoire').doc(matricule).set({
            name: name,
            matricule: matricule,
            theme: theme,
            département: département,
            annee: parseInt(annee),
            etagere: etagere,
            image: image,
            commentaire: [
                {
                    heure: new Date(),
                    nomUser: '',
                    texte: '',
                    note: 0
                }
            ]
        })
        setStatus(true);
        setType("success");
        setTitle("Mémoire ajouté avec succès");
        navigate("/catalogueMemoire", { state: { département: département } })
    }

    const resetForm = () => {
        setName('');
        setMatricule('');
        setTheme('');
        setDépartement('');
        setAnnee('');
        setEtagere('');
        setImage('');
    }

    const [status, setStatus] = useState(false);
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");

    return (
        <MemoireContainer fluid>
            <Row>
                <Col md={2}>
                    <Sidebar />
                </Col>
                <Col md={10}>
                    <Navbar />
                    <Row className="justify-content-center mt-4">
                        <Col md={3} className="mb-3">
                            <Card className="text-center p-3" onClick={() => navigate('/ajouterDoc')} style={{ cursor: 'pointer' }}>
                                <Card.Img variant="top" src={livre} />
                                <Card.Body>
                                    
                                    <Card.Text style={{ color: 'chocolate', fontWeight: 'bold' }}>LIVRE</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} className="mb-3">
                            <Card className="text-center p-3" onClick={() => navigate('/ajoutermémoire')} style={{ cursor: 'pointer' }}>
                                <Card.Img variant="top" src={memoire} />
                                <Card.Body>
                                    
                                    <Card.Text style={{ color: 'chocolate', fontWeight: 'bold' }}>MÉMOIRE</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <FormContainer>
                        <Form ref={formRef} onSubmit={res}>
                            <FormGrid>
                                <FormGroup>
                                    <Label>Nom de l'étudiant</Label>
                                    <StyledInput
                                        type="text"
                                        placeholder="Nom"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Matricule de l'étudiant</Label>
                                    <StyledInput
                                        type="text"
                                        placeholder="20P123"
                                        value={matricule}
                                        onChange={(e) => setMatricule(e.target.value)}
                                        required
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Thème de soutenance</Label>
                                    <StyledInput
                                        type="text"
                                        placeholder="Gestion de la bibliothèque"
                                        value={theme}
                                        onChange={(e) => setTheme(e.target.value)}
                                        required
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Département</Label>
                                    <StyledSelect
                                        value={département}
                                        onChange={(e) => setDépartement(e.target.value)}
                                        required
                                    >
                                        <option value='Genie Informatique'>Génie Informatique</option>
                                        <option value="Genie Civile">Génie Civile</option>
                                        <option value='Genie Electrique'>Génie Électrique</option>
                                        <option value='Genie Mecanique'>Génie Mécanique/Industriel</option>
                                        <option value='Genie Telecom'>Génie Télécom</option>
                                    </StyledSelect>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Année de soutenance</Label>
                                    <StyledInput
                                        type="number"
                                        placeholder="2025"
                                        value={annee}
                                        onChange={(e) => setAnnee(e.target.value)}
                                        required
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Numéro de l'étagère</Label>
                                    <StyledInput
                                        type="text"
                                        placeholder="Étagère"
                                        value={etagere}
                                        onChange={(e) => setEtagere(e.target.value)}
                                        required
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Lien de l'image</Label>
                                    <StyledInput
                                        type="text"
                                        placeholder="Image"
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                    />
                                </FormGroup>
                            </FormGrid>
                            <ButtonGroup>
                                <StyledButton type="button" onClick={res} $primary>
                                    Ajouter
                                </StyledButton>
                                <StyledButton type="button" onClick={resetForm}>
                                    Annuler
                                </StyledButton>
                            </ButtonGroup>
                        </Form>
                    </FormContainer>
                    <ReactJsAlert
                        status={status}
                        type={type}
                        title={title}
                        quotes={true}
                        quote=""
                        Close={() => setStatus(false)}
                    />
                </Col>
            </Row>
        </MemoireContainer>
    )
}

const MemoireContainer = styled(Container)`
    min-height: 100vh;
    background-color: #f5f5f5;
`;

const FormContainer = styled.div`
    background: white;
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
`;

const FormGroup = styled.div`
    &:nth-last-child(1) {
        grid-column: 1 / -1;
    }
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #374151;
`;

const inputStyles = `
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background-color: #fff;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    &::placeholder {
        color: #9ca3af;
    }
`;

const StyledInput = styled.input`
    ${inputStyles}
`;

const StyledSelect = styled.select`
    ${inputStyles}
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 3rem;

    @media (max-width: 480px) {
        flex-direction: column;
    }
`;

const StyledButton = styled(BootstrapButton)`
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    background-color: ${props => props.$primary ? '#3b82f6' : '#9ca3af'};
    color: white;
    min-width: 150px;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        background-color: ${props => props.$primary ? '#2563eb' : '#6b7280'};
    }

    &:active {
        transform: translateY(0);
    }

    @media (max-width: 480px) {
        width: 100%;
    }
`;
