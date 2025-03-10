import React, { useState, useRef, useEffect } from "react";
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
import { storage } from "../firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

export default function Ajoutermémoire() {
    const [name, setName] = useState('');
    const [matricule, setMatricule] = useState('');
    const [theme, setTheme] = useState('');
    const [departement, setDepartement] = useState('');
    const [annee, setAnnee] = useState('');
    const [etagere, setEtagere] = useState('');
    const [superviseur, setSuperviseur] = useState(''); // Nouveau champ pour le superviseur
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const formRef = useRef();
    const navigate = useNavigate();
    const [memories, setMemories] = useState([]);

    // États pour l'alerte
    const [status, setStatus] = useState(false);
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        fetchMemories();
    }, []);

    // Récupérer les mémoires depuis Firebase
    const fetchMemories = () => {
        const ref = firebase.firestore().collection("Memoire");
        ref.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            setMemories(items);
        });
    };

    // État pour la prévisualisation d'image
    const [imagePreview, setImagePreview] = useState(null);

    // Gestion du changement d'image avec prévisualisation
    const handleChangeImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            
            // Créer une URL pour la prévisualisation
            const previewURL = URL.createObjectURL(file);
            setImagePreview(previewURL);
        }
    };

    // Upload de l'image
    const handleSubmitImage = async () => {
        if (!image) return null;
        
        try {
            setIsUploading(true);
            const imageRef = ref(storage, `memoires/${image.name + v4()}`);
            await uploadBytes(imageRef, image);
            const downloadURL = await getDownloadURL(imageRef);
            setUrl(downloadURL);
            setIsUploading(false);
            return downloadURL;
        } catch (error) {
            console.error("Erreur lors de l'upload de l'image:", error);
            setIsUploading(false);
            return null;
        }
    };

    // Envoi du formulaire
    const res = async function (e) {
        if (e) e.preventDefault();
        
        // Validation des champs obligatoires
        if (!name || !matricule || !theme || !departement || !annee || !etagere || !image) {
            // Déterminer quels champs sont manquants pour un message plus spécifique
            const missingFields = [];
            if (!name) missingFields.push("Nom de l'étudiant");
            if (!matricule) missingFields.push("Matricule");
            if (!theme) missingFields.push("Thème de soutenance");
            if (!departement) missingFields.push("Département");
            if (!annee) missingFields.push("Année de soutenance");
            if (!etagere) missingFields.push("Numéro d'étagère");
            if (!image) missingFields.push("Image du mémoire");
            
            setStatus(true);
            setType("error");
            setTitle(`Veuillez remplir les champs obligatoires : ${missingFields.join(", ")}`);
            return;
        }

        try {
            setIsUploading(true);
            // Upload de l'image et récupération de l'URL
            const imageUrl = await handleSubmitImage();
            
            if (!imageUrl) {
                setStatus(true);
                setType("error");
                setTitle("Erreur lors de l'upload de l'image");
                return;
            }

            // Création d'un ID unique pour le document - on utilise le matricule comme ID
            const docId = matricule; // Utilisation du matricule comme ID
            
            // Ajout du document dans Firestore avec l'ID spécifié
            await firebase.firestore().collection('Memoire').doc(docId).set({
                id: docId, // Stockage explicite de l'ID dans le document
                name: name,
                matricule: matricule,
                theme: theme,
                département: departement, // Notez l'accent sur département pour correspondre au schéma existant
                annee: parseInt(annee),
                etagere: etagere,
                superviseur: superviseur, // Ajout du champ superviseur
                image: imageUrl,
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
            setTitle("Mémoire ajouté avec succès");

            // Filtrer les mémoires par département et naviguer vers la page des mémoires
            const filteredMemories = memories.filter((memoire) => memoire.département === departement);
            
            // Attendre un peu pour que l'utilisateur voie le message de succès
            setTimeout(() => {
                navigate('/memoireParDepartement', {
                    state: {
                        memories: filteredMemories,
                        departement: departement
                    }
                });
            }, 1500);
        } catch (error) {
            console.error("Erreur lors de l'ajout du mémoire:", error);
            setStatus(true);
            setType("error");
            setTitle("Erreur lors de l'ajout du mémoire");
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setMatricule('');
        setTheme('');
        setDepartement('');
        setAnnee('');
        setEtagere('');
        setSuperviseur(''); // Réinitialisation du champ superviseur
        setImage(null);
        setUrl(null);
        setImagePreview(null); // Réinitialiser aussi la prévisualisation
    };

    return (
        <MemoireContainer fluid>
            <Row>
                <Col md={2}>
                    <Sidebar />
                </Col>
                <Col md={10} className="bg-white">
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
                            <Card
                              className="text-center p-3 border"
                              style={{
                                  cursor: 'pointer',
                                  borderColor: 'green',
                                  borderWidth: '2px',
                                  boxShadow: '0 4px 8px rgba(210, 105, 30, 1)',
                              }}
                            >
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
                                        value={departement}
                                        onChange={(e) => setDepartement(e.target.value)}
                                        required
                                    >
                                        <option value="">Sélectionnez un département</option>
                                        <option value='Génie informatique'>Génie Informatique</option>
                                        <option value="Genie Civile">Génie Civile</option>
                                        <option value='Génie électrique'>Génie Électrique</option>
                                        <option value='Génie industriel mécanique'>Génie Mécanique/Industriel</option>
                                        <option value='Génie Télécom'>Génie Télécom</option>
                                    </StyledSelect>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Superviseur</Label>
                                    <StyledInput
                                        type="text"
                                        placeholder="Dr. Nom du superviseur"
                                        value={superviseur}
                                        onChange={(e) => setSuperviseur(e.target.value)}
                                    />
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

                                <FileInputContainer>
                                    <Label className="text-left">Image du mémoire</Label>
                                    <div className="d-flex flex-column gap-2">
                                        {/* Input file caché */}
                                        <HiddenFileInput
                                            type="file"
                                            id="file-input"
                                            onChange={handleChangeImage}
                                            accept="image/*"
                                        />
                                        
                                        {/* Bouton personnalisé pour l'upload */}
                                        <CustomFileInput htmlFor="file-input">
                                            <FaUpload />
                                            {image ? `Sélectionné: ${image.name}` : "Choisir un fichier"}
                                        </CustomFileInput>
                                        
                                        {/* Prévisualisation de l'image */}
                                        {imagePreview && (
                                            <div className="mt-3 text-center">
                                                <h6>Aperçu de l'image:</h6>
                                                <div className="preview-container border rounded p-2 d-inline-block">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Aperçu"
                                                        style={{ 
                                                            maxWidth: '200px', 
                                                            maxHeight: '200px', 
                                                            objectFit: 'cover' 
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </FileInputContainer>
                            </FormGrid>
                            <ButtonGroup>
                                <StyledButton 
                                    type="submit" 
                                    $primary 
                                    disabled={isUploading}
                                >
                                    {isUploading ? "Traitement en cours..." : "Ajouter"}
                                </StyledButton>
                                <StyledButton type="button" onClick={resetForm} disabled={isUploading}>
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

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }

    @media (max-width: 480px) {
        width: 100%;
    }
`;