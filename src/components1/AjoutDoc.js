import React, { useState, useRef, useEffect } from "react";
import { Button as BootstrapButton, Form, Row, Col, Container, Card } from "react-bootstrap";
import "./AjoutDoc.css";
import firebase from '../metro.config';
import { useNavigate } from "react-router-dom";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import styled from 'styled-components';
import memoire from "../../src/assets/mémoirecard.jpeg";
import livre from "../../src/assets/livrecard.jpg";
import { FaUpload, FaTimes, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { useI18n } from "../Context/I18nContext";

// Composant personnalisé pour les notifications/alertes
const Notification = ({ isVisible, type, message, onClose }) => {
  if (!isVisible) return null;

  return (
    <NotificationWrapper type={type}>
      <NotificationContent>
        <NotificationIcon type={type}>
          {type === "success" ? <FaCheckCircle size={24} /> : <FaExclamationTriangle size={24} />}
        </NotificationIcon>
        <NotificationMessage>{message}</NotificationMessage>
        <NotificationClose onClick={onClose}>
          <FaTimes />
        </NotificationClose>
      </NotificationContent>
    </NotificationWrapper>
  );
};

export default function AjoutDoc(props) {
  const [name, setName] = useState('');
  const [cathegorie, setCathegorie] = useState('');
  const [desc, setDesc] = useState('');
  const [etagere, setEtagere] = useState('');
  const [exemplaire, setExemplaire] = useState(1);
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [salle, setSalle] = useState('');
  const [typ] = useState('');
  const formRef = useRef();
  const navigate = useNavigate();
  const { language } = useI18n();
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [auteur, setAuteur] = useState('');
  const [edition, setEdition] = useState('');

  // État pour la notification personnalisée
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "success",
    message: ""
  });

  // Afficher une notification
  const showNotification = (type, message) => {
    setNotification({
      isVisible: true,
      type,
      message
    });

    // Fermer automatiquement après 5 secondes
    setTimeout(() => {
      closeNotification();
    }, 5000);
  };

  // Fermer la notification
  const closeNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  // Valider le formulaire avant de soumettre
  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = true;
    if (!cathegorie) errors.cathegorie = true;
    if (!etagere.trim()) errors.etagere = true;
    if (!salle) errors.salle = true;
    if (!image) errors.image = true;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const res = async function () {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  
    if (!image) {
      showNotification("error", translations.error_upload_image);
      return;
    }
  
    try {
      // Générer un identifiant unique
      const docRef = firebase.firestore().collection('BiblioInformatique').doc();
      const documentId = docRef.id;
  
      const imageUrl = await uploadImage(image);
      
      await docRef.set({
        id: documentId, // Stocker l'ID généré comme champ
        name: name,
        exemplaire: parseInt(exemplaire),
        etagere: etagere,
        salle: salle,
        image: imageUrl,
        type: typ,
        nomBD: documentId, // Utiliser l'ID unique comme nomBD
        cathegorie: cathegorie,
        desc: desc,
        // Nouveaux champs non obligatoires
        auteur: auteur || null,
        edition: edition || null,
        commentaire: [
          {
            heure: new Date(),
            nomUser: '',
            texte: '',
            note: 0
          }
        ]
      });
  
      showNotification("success", translations.document_added);
  
      // Rediriger après un court délai pour permettre à l'utilisateur de voir le message de succès
      setTimeout(() => {
        navigate("/catalogue", { state: { departement: cathegorie } });
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de l'ajout du document:", error);
      showNotification("error", translations.error_saving);
    }
  };

  const resetForm = () => {
    setName('');
    setCathegorie('');
    setDesc('');
    setEtagere('');
    setExemplaire(1);
    setImage(null);
    setSalle('');
    setFormErrors({});
    setFormSubmitted(false);
    setAuteur('');
    setEdition('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const uploadImage = async (file) => {
    if (!file) return null;
    
    try {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(`livres/${Date.now()}-${file.name}`);
      await fileRef.put(file);
      return await fileRef.getDownloadURL();
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image:", error);
      throw error;
    }
  };

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
    imgBook: language === "FR" ? "LIVRE" : "BOOK",
    imgTheses: language === "FR" ? "MEMOIRE" : "THESES",
    choose_file: language === "FR" ? "Choisir un fichier" : "Choose a file",
    required_field: language === "FR" ? "Champ obligatoire" : "Required field",
    fill_all_fields: language === "FR" ? "Veuillez remplir tous les champs obligatoires" : "Please fill in all required fields",
    description_notice: language === "FR"
      ? "Merci de remplir soigneusement la description. Elle est utilisée pour faire des recommandations pertinentes aux utilisateurs."
      : "Please fill in the description carefully. It is used to make relevant recommendations to users.",
    error_name: language === "FR" ? "Veuillez indiquer le nom du livre" : "Please provide the book name",
    error_cathegorie: language === "FR" ? "Veuillez sélectionner un département" : "Please select a department",
    error_etagere: language === "FR" ? "Veuillez indiquer le numéro d'étagère" : "Please provide the shelf number",
    error_salle: language === "FR" ? "Veuillez sélectionner un numéro de salle" : "Please select a room number",
    error_image: language === "FR" ? "Une image du document est requise" : "Document image is required",
    author: language === "FR" ? "Auteur" : "Author",
    edition: language === "FR" ? "Édition" : "Edition",
    error_upload_image: language === "FR" ? "Veuillez sélectionner une image" : "Please select an image",
  };

  return (
    <LivreContainer fluid>
      <Row>
        <Col md={2}>
          <Sidebar />
        </Col>
        <Col md={10} className="bg-white">
          <Navbar />

          {/* Notification personnalisée */}
          <Notification
            isVisible={notification.isVisible}
            type={notification.type}
            message={notification.message}
            onClose={closeNotification}
          />

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
            <Form ref={formRef} onSubmit={(e) => { e.preventDefault(); res(); }}>
              <FormGrid>
                <FormGroup>
                  <Label>
                    <RequiredAsterisk>*</RequiredAsterisk> {translations.book_name}
                  </Label>
                  <StyledInput
                    type="text"
                    placeholder={translations.book_name}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={formErrors.name ? "error" : ""}
                  />
                  {formErrors.name && <ErrorText>{translations.error_name}</ErrorText>}
                </FormGroup>

                <FormGroup>
                  <Label>
                    <RequiredAsterisk>*</RequiredAsterisk> {translations.number_of_copies}
                  </Label>
                  <StyledInput
                    type="number"
                    placeholder={translations.number_of_copies}
                    value={exemplaire}
                    onChange={(e) => setExemplaire(e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <RequiredAsterisk>*</RequiredAsterisk> {translations.department}
                  </Label>
                  <StyledSelect
                    value={cathegorie}
                    onChange={(e) => setCathegorie(e.target.value)}
                    required
                    className={formErrors.cathegorie ? "error" : ""}
                  >
                    <option value=''></option>
                    <option value='Mathematique'>MSP</option>
                    <option value='Genie Informatique'>Génie informatique</option>
                    <option value="Genie Civil">Génie Civil</option>
                    <option value='Genie Electrique'>Génie Électrique</option>
                    <option value='Genie Mecanique'>Génie Mécanique/Industriel</option>
                    <option value='Genie Telecom'>Génie Télécom</option>
                  </StyledSelect>
                  {formErrors.cathegorie && <ErrorText>{translations.error_cathegorie}</ErrorText>}
                </FormGroup>

                <FormGroup>
                  <Label>
                    <RequiredAsterisk>*</RequiredAsterisk> {translations.room_number}
                  </Label>
                  <StyledSelect
                    value={salle}
                    onChange={(e) => setSalle(e.target.value)}
                    required
                    className={formErrors.salle ? "error" : ""}
                  >
                    <option value=''></option>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                  </StyledSelect>
                  {formErrors.salle && <ErrorText>{translations.error_salle}</ErrorText>}
                </FormGroup>

                <FormGroup>
                  <Label>
                    <RequiredAsterisk>*</RequiredAsterisk> {translations.shelf_number}
                  </Label>
                  <StyledInput
                    type="text"
                    placeholder={translations.shelf_number}
                    value={etagere}
                    onChange={(e) => setEtagere(e.target.value)}
                    required
                    className={formErrors.etagere ? "error" : ""}
                  />
                  {formErrors.etagere && <ErrorText>{translations.error_etagere}</ErrorText>}
                </FormGroup>

                

                <FormGroup>
                    <Label>{translations.author}</Label>
                    <StyledInput
                      type="text"
                      placeholder={translations.author}
                      value={auteur}
                      onChange={(e) => setAuteur(e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>{translations.edition}</Label>
                    <StyledInput
                      type="text"
                      placeholder={translations.edition}
                      value={edition}
                      onChange={(e) => setEdition(e.target.value)}
                    />
                  </FormGroup>
                  <FileInputContainer>
                      <Label className="text-left">
                        <RequiredAsterisk>*</RequiredAsterisk> {translations.image_link}
                      </Label>
                      <HiddenFileInput
                        type="file"
                        id="file-input"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <CustomFileInput htmlFor="file-input" className={formErrors.image ? "error" : ""}>
                        <FaUpload />
                        {imagePreview ? "Image sélectionnée" : translations.choose_file}
                      </CustomFileInput>
                      {imagePreview && (
                        <div className="mt-2 text-center">
                          <img
                            src={imagePreview}
                            alt="Aperçu"
                            style={{ maxWidth: '200px', maxHeight: '200px' }}
                          />
                        </div>
                      )}
                      {formErrors.image && <ErrorText>{translations.error_image}</ErrorText>}
                    </FileInputContainer>
                  <FormGroup>
                  <Label>{translations.document_description}</Label>
                  <DescriptionNotice>{translations.description_notice}</DescriptionNotice>
                  <StyledTextarea
                    rows={3}
                    placeholder={translations.document_description}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </FormGroup>
              </FormGrid>
              <ButtonGroup>
                <StyledButton type="submit" $primary>
                  {translations.add}
                </StyledButton>
                <StyledButton type="button" onClick={resetForm}>
                  {translations.cancel}
                </StyledButton>
              </ButtonGroup>
            </Form>
          </FormContainer>
        </Col>
      </Row>
    </LivreContainer>
  );
}

// Styled components pour la notification personnalisée
const NotificationWrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  min-width: 300px;
  max-width: 450px;
  background: ${props => props.type === "success" ? "#d4edda" : "#f8d7da"};
  color: ${props => props.type === "success" ? "#155724" : "#721c24"};
  border: 1px solid ${props => props.type === "success" ? "#c3e6cb" : "#f5c6cb"};
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.4s ease-out forwards;

  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;

const NotificationContent = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
`;

const NotificationIcon = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
  color: ${props => props.type === "success" ? "#155724" : "#721c24"};
`;

const NotificationMessage = styled.div`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
`;

const NotificationClose = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  border-radius: 50%;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

// Styled components existants
const RequiredAsterisk = styled.span`
  color: red;
  margin-right: 4px;
  font-size: 1.2em;
`;

const ErrorText = styled.div`
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
  animation: fadeIn 0.3s ease-in;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const DescriptionNotice = styled.p`
  color: #dc3545;
  font-size: 0.85em;
  margin-bottom: 8px;
  font-style: italic;
`;

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

  &.error {
    border: 2px solid #dc3545;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25);
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  }

  @keyframes shake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    20%, 80% { transform: translate3d(2px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
    40%, 60% { transform: translate3d(3px, 0, 0); }
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

  &.error {
    border-color: #dc3545;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25);
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  }

  @keyframes shake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    20%, 80% { transform: translate3d(2px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
    40%, 60% { transform: translate3d(3px, 0, 0); }
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
