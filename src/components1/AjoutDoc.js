import React, { useState, useRef } from "react";
import { Button as BootstrapButton, Form, Row, Col, Container, Card } from "react-bootstrap";
import ReactJsAlert from "reactjs-alert";
import "./AjoutDoc.css";
import firebase from '../metro.config';
import { useNavigate } from "react-router-dom";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import styled from 'styled-components';
import memoire from "../../src/assets/mémoirecard.jpeg";
import livre from "../../src/assets/livrecard.jpg";
import { FaUpload } from "react-icons/fa";
import { useI18n } from "../Context/I18nContext";

export default function AjoutDoc(props) {
    const [name, setName] = useState('');
    const [cathegorie, setCathegorie] = useState('');
    const [desc, setDesc] = useState('');
    const [etagere, setEtagere] = useState('');
    const [exemplaire, setExemplaire] = useState(1);
    const [image, setImage] = useState("");
    const [salle, setSalle] = useState('');
    const [typ] = useState('');
    const formRef = useRef();
    const navigate = useNavigate();
    const { language } = useI18n();

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
        });
        setStatus(true);
        setType("success");
        setTitle(translations.document_added);
        navigate("/catalogue", { state: { departement: cathegorie } });
    };

    const resetForm = () => {
        setName('');
        setCathegorie('');
        setDesc('');
        setEtagere('');
        setExemplaire(1);
        setImage(null);
        setSalle('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file.name); // Store the file name or handle the file as needed
        }
    };

    const [status, setStatus] = useState(false);
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");

    // Traductions directes pour le formulaire d'ajout de document
    const translations = {
        book_name: language === "FR" ? "Nom du livre" : "Book Name",
        number_of_copies: language === "FR" ? "Nombre d'exemplaires" : "Number of Copies",
        department: language === "FR" ? "Département" : "Department",
        room_number: language === "FR" ? "Numéro de salle" : "Room Number",
        shelf_number: language === "FR" ? "Numéro de l'étagère" : "Shelf Number",
        image_link: language === "FR" ? "Lien de l'image" : "Image Link",
        document_description: language === "FR" ? "Description du document" : "Document Description",
        add: language === "FR" ? "Ajouter" : "Add",
        cancel: language === "FR" ? "Annuler" : "Cancel",
        document_added: language === "FR" ? "Document ajouté avec succès" : "Document added successfully",
        imgBook: language === "FR" ? "LIVRE": "BOOK",
        imgTheses: language === "FR"? "MEMOIRE": "THESES"
    };

    return (
        <LivreContainer fluid>
            <Row>
                <Col md={2}>
                    <Sidebar />
                </Col>
                <Col md={10} className="bg-white">
                    <Navbar />
                    <Row className="justify-content-center mt-4">
                        <Col md={3} className="mb-3">
                            <Card
                                className="text-center p-3 border"
                                onClick={() => navigate('/ajouterDoc')}
                                style={{
                                    cursor: 'pointer',
                                    borderColor: 'green',
                                    borderWidth: '2px',
                                    boxShadow: '0 4px 8px rgba(210, 105, 30, 1)', // Green drop shadow
                                }}
                            >
                                <Card.Img variant="top" src={livre} />
                                <Card.Body>
                                    <Card.Text style={{ color: 'chocolate', fontWeight: 'bold' }}>{translations.imgBook}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} className="mb-3">
                            <Card className="text-center p-3" onClick={() => navigate('/ajoutermémoire')} style={{ cursor: 'pointer' }}>
                                <Card.Img variant="top" src={memoire} />
                                <Card.Body>
                                    <Card.Text style={{ color: 'chocolate', fontWeight: 'bold' }}>{translations.imgTheses}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <FormContainer>
                        <Form ref={formRef} onSubmit={res}>
                            <FormGrid>
                                <FormGroup>
                                    <Label>{translations.book_name}</Label>
                                    <StyledInput
                                        type="text"
                                        placeholder={translations.book_name}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>{translations.number_of_copies}</Label>
                                    <StyledInput
                                        type="number"
                                        placeholder={translations.number_of_copies}
                                        value={exemplaire}
                                        onChange={(e) => setExemplaire(e.target.value)}
                                        required
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>{translations.department}</Label>
                                    <StyledSelect
                                        value={cathegorie}
                                        onChange={(e) => setCathegorie(e.target.value)}
                                        required
                                    >

                                        <option value='Mathematique'>MSP</option>
                                        <option value='Genie Informatique'>Génie informatique</option>
                                        <option value="Genie Civil">Génie Civil</option>
                                        <option value='Genie Electrique'>Génie Électrique</option>
                                        <option value='Genie Mecanique'>Génie Mécanique/Industriel</option>
                                        <option value='Genie Telecom'>Génie Télécom</option>

                                    </StyledSelect>
                                </FormGroup>

                                <FormGroup>
                                    <Label>{translations.room_number}</Label>
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
                                    <Label>{translations.shelf_number}</Label>
                                    <StyledInput
                                        type="text"
                                        placeholder={translations.shelf_number}
                                        value={etagere}
                                        onChange={(e) => setEtagere(e.target.value)}
                                        required
                                    />
                                </FormGroup>

                                <FileInputContainer>
                                    <Label className="text-left">{translations.image_link}</Label>
                                    {/* Hidden file input */}
                                    <HiddenFileInput
                                        type="file"
                                        id="file-input"
                                        onChange={handleFileChange}
                                    />
                                    {/* Custom file input button */}
                                    <CustomFileInput htmlFor="file-input">
                                        <FaUpload />
                                        {image ? `Selected: ${image}` : translations.choose_file}
                                    </CustomFileInput>
                                </FileInputContainer>

                                <FormGroup>
                                    <Label>{translations.document_description}</Label>
                                    <StyledTextarea
                                        rows={3}
                                        placeholder={translations.document_description}
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                    />
                                </FormGroup>
                            </FormGrid>
                            <ButtonGroup>
                                <StyledButton type="button" onClick={res} $primary>
                                    {translations.add}
                                </StyledButton>
                                <StyledButton type="button" onClick={resetForm}>
                                    {translations.cancel}
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
    );
}

// Styled components
const FileInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HiddenFileInput = styled.input`
  display: none; // Hide the default file input
`;

const CustomFileInput = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  text-align: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

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
  ${inputStyles};
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
