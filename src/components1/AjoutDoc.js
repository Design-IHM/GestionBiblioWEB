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

export default function AjoutDoc(props) {
    const [name, setName] = useState('')
    const [cathegorie, setCathegorie] = useState('');
    const [desc, setDesc] = useState('')
    const [etagere, setEtagere] = useState('')
    const [exemplaire, setExemplaire] = useState(1)
    const [image, setImage] = useState(null)
    const [salle, setSalle] = useState('')
    const [typ] = useState('')
    const formRef = useRef()
    const navigate = useNavigate();

    const res = async function () {
        await firebase.firestore().collection('BiblioInformatique').doc(name).set({
            name: name,
            exemplaire: parseInt(exemplaire),
            etagere: etagere,
            salle: salle,
            image: image,
            type: typ,
            nomBD: name,
            cathegorie: cathegorie,
            desc: desc,
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
        setTitle("Document ajouté avec succès");
        navigate("/catalogue", { state: { departement: cathegorie } })
    }

    const resetForm = () => {
        setName('');
        setCathegorie('');
        setDesc('');
        setEtagere('');
        setExemplaire(1);
        setImage(null);
        setSalle('');
    }

    const [status, setStatus] = useState(false);
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");

    return (
        <LivreContainer fluid>
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
                                <Card.Img variant="top" src={memoire}/>
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
                                    <Label>Nom du livre</Label>
                                    <StyledInput
                                        type="text"
                                        placeholder="Nom"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Nombre d'exemplaires</Label>
                                    <StyledInput
                                        type="number"
                                        placeholder="Nombre d'exemplaires"
                                        value={exemplaire}
                                        onChange={(e) => setExemplaire(e.target.value)}
                                        required
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Département</Label>
                                    <StyledSelect
                                        value={cathegorie}
                                        onChange={(e) => setCathegorie(e.target.value)}
                                        required
                                    >
                                        <option value='Mathematique'>MSP</option>
                                        <option value='Genie Informatique'>Génie Informatique</option>
                                        <option value="Genie Civile">Génie Civile</option>
                                        <option value='Genie Electrique'>Génie Électrique</option>
                                        <option value='Genie Mecanique'>Génie Mécanique/Industriel</option>
                                        <option value='Genie Telecom'>Génie Télécom</option>
                                    </StyledSelect>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Numéro de salle</Label>
                                    <StyledSelect
                                        value={salle}
                                        onChange={(e) => setSalle(e.target.value)}
                                        required
                                    >
                                        <option value='1' selected>1</option>
                                        <option value='2'>2</option>
                                        <option value='3'>3</option>
                                        <option value='4'>4</option>
                                    </StyledSelect>
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

                                <FormGroup>
                                    <Label>Description du document</Label>
                                    <StyledTextarea
                                        rows={3}
                                        placeholder="Description"
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
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
        </LivreContainer>
    )
}

const LivreContainer = styled(Container)`
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

const StyledTextarea = styled.textarea`
    ${inputStyles}
    resize: vertical;
    min-height: 100px;
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
