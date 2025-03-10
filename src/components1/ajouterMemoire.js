import React, {useState, useRef, useEffect} from "react";
import { Button as BootstrapButton, Form, Row, Col, Container, Card } from "react-bootstrap";
import "./AjoutDoc.css";
import firebase from '../metro.config';
import { useNavigate } from "react-router-dom";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import styled from 'styled-components';
import memoire from "../../src/assets/mémoirecard.jpeg";
import livre from "../../src/assets/livrecard.jpg";
import {FaUpload, FaTimes, FaCheckCircle, FaExclamationTriangle} from "react-icons/fa";
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

export default function Ajoutermémoire() {
    const [name, setName] = useState('');
    const [matricule, setMatricule] = useState('');
    const [theme, setTheme] = useState('');
    const [departement, setDepartement] = useState('');
    const [annee, setAnnee] = useState('');
    const [etagere, setEtagere] = useState('');
    const [image, setImage] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [formSubmitted, setFormSubmitted] = useState(false);
    const formRef = useRef();
    const navigate = useNavigate();

    // État pour la notification personnalisée
    const [notification, setNotification] = useState({
      isVisible: false,
      type: "success",
      message: ""
    });

    const { language } = useI18n();
    const [memories, setMemories] = useState([]);

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
    
    // Validation du formulaire
    const validateForm = () => {
        const errors = {};
        if (!name.trim()) errors.name = true;
        if (!matricule.trim()) errors.matricule = true;
        if (!theme.trim()) errors.theme = true;
        if (!departement) errors.departement = true;
        if (!annee) errors.annee = true;
        if (!etagere.trim()) errors.etagere = true;
        if (!image) errors.image = true;
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

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
    
    const res = async function (e) {
        e.preventDefault();
        setFormSubmitted(true);
        
        if (!validateForm()) {
            // Message d'alerte personnalisé
            const errorCount = Object.keys(formErrors).length;
            const errorMessage = language === "FR" 
                ? `${errorCount} ${errorCount > 1 ? 'champs obligatoires manquants' : 'champ obligatoire manquant'}. Veuillez vérifier le formulaire.` 
                : `${errorCount} ${errorCount > 1 ? 'required fields are' : 'required field is'} missing. Please check the form.`;
            
            showNotification("error", errorMessage);
            
            // Faire défiler jusqu'au premier champ en erreur
            const firstErrorField = document.querySelector('.error');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            return;
        }
        
        try {
          await firebase.firestore().collection('Memoire').doc(matricule).set({
              name: name,
              matricule: matricule,
              theme: theme,
              departement: departement,
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
          });
          
          showNotification("success", language === "FR" ? "Mémoire ajouté avec succès" : "Thesis successfully added");
          
          // Rediriger après un court délai pour permettre à l'utilisateur de voir le message de succès
          setTimeout(() => {
            const filteredMemories = memories.filter((memoire) => memoire.departement === departement);
            navigate('/memoireParDepartement', {
                state: {
                    memories: filteredMemories,
                    departement: departement
                }
            });
          }, 1500);
        } catch (error) {
          console.error("Erreur lors de l'ajout du mémoire:", error);
          showNotification("error", language === "FR" ? "Erreur lors de l'ajout du mémoire" : "Error adding thesis");
        }
    }

    const resetForm = () => {
        setName('');
        setMatricule('');
        setTheme('');
        setDepartement('');
        setAnnee('');
        setEtagere('');
        setImage('');
        setFormErrors({});
        setFormSubmitted(false);
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file.name); // Store the file name or handle the file as needed
            if (formSubmitted) {
                validateForm();
            }
        }
    };

    const translations = {
        name: language === "FR"? "Nom de l'étudiant" : "Student name",
        mat: language === "FR"?"Matricule de l'étudiant": "Student number",
        theme: language === "FR"?"Thème de soutenance": "Thesis theme",
        dep: language === "FR"? "Département": "Department",
        annee: language === "FR"? "Année de soutenance":"Thesis year ",
        etagère: language === "FR"? "Numéro de l'étagère":"Shelf number",
        img: language === "FR"? "Photo du document": "Document image",
        ajouter: language === "FR"?"Ajouter":"Add",
        annuler: language === "FR"?"Annuler":"Cancel",
        imgBook: language === "FR"?"LIVRE":"BOOK",
        imgThesis: language === "FR"?"MEMOIRE":"THESIS",
        
        // Messages d'erreur personnalisés
        errorName: language === "FR"? "Veuillez indiquer le nom de l'étudiant" : "Please provide the student's name",
        errorMat: language === "FR"? "Le matricule de l'étudiant est requis" : "Student number is required",
        errorTheme: language === "FR"? "Le thème du mémoire est obligatoire" : "Thesis theme is required",
        errorDep: language === "FR"? "Veuillez sélectionner un département" : "Please select a department",
        errorAnnee: language === "FR"? "L'année de soutenance est requise" : "Thesis year is required",
        errorEtagere: language === "FR"? "Veuillez indiquer le numéro d'étagère" : "Shelf number is required",
        errorImage: language === "FR"? "Une image du document est requise" : "Document image is required",
        selectOption: language === "FR"? "-- Sélectionnez --" : "-- Select --",
        chooseFile: language === "FR"? "Choisir un fichier" : "Choose a file",
        selected: language === "FR"? "Sélectionné:" : "Selected:"
    }

    return (
        <MemoireContainer fluid>
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
                            <Card className="text-center p-3" onClick={() => navigate('/ajouterDoc')} style={{ cursor: 'pointer' }}>
                                <Card.Img variant="top" src={livre} />
                                <Card.Body>
                                    <Card.Text style={{ color: 'chocolate', fontWeight: 'bold' }}>{translations.imgBook}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} className="mb-3">
                            <Card
                              className="text-center p-3 border"
                              onClick={() => navigate('/ajouterDoc')}
                              style={{
                                  cursor: 'pointer',
                                  borderColor: 'green',
                                  borderWidth: '2px',
                                  boxShadow: '0 4px 8px rgba(210, 105, 30, 1)',
                              }}
                            >
                                <Card.Img variant="top" src={memoire} />
                                <Card.Body>
                                    <Card.Text style={{ color: 'chocolate', fontWeight: 'bold' }}>{translations.imgThesis}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <FormContainer>
                        <Form ref={formRef} onSubmit={res} noValidate>
                            <FormGrid>
                                <FormGroup>
                                    <LabelContainer>
                                        <Label>{translations.name}</Label>
                                        <RequiredAsterisk>*</RequiredAsterisk>
                                    </LabelContainer>
                                    <StyledInput
                                        type="text"
                                        placeholder="Nom"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            if (formSubmitted) {
                                                validateForm();
                                            }
                                        }}
                                        required
                                        className={formErrors.name ? "error" : ""}
                                    />
                                    {formErrors.name && <ErrorText>{translations.errorName}</ErrorText>}
                                </FormGroup>

                                <FormGroup>
                                    <LabelContainer>
                                        <Label>{translations.mat}</Label>
                                        <RequiredAsterisk>*</RequiredAsterisk>
                                    </LabelContainer>
                                    <StyledInput
                                        type="text"
                                        placeholder="20P123"
                                        value={matricule}
                                        onChange={(e) => {
                                            setMatricule(e.target.value);
                                            if (formSubmitted) {
                                                validateForm();
                                            }
                                        }}
                                        required
                                        className={formErrors.matricule ? "error" : ""}
                                    />
                                    {formErrors.matricule && <ErrorText>{translations.errorMat}</ErrorText>}
                                </FormGroup>

                                <FormGroup>
                                    <LabelContainer>
                                        <Label>{translations.theme}</Label>
                                        <RequiredAsterisk>*</RequiredAsterisk>
                                    </LabelContainer>
                                    <StyledInput
                                        type="text"
                                        placeholder="Gestion de la bibliothèque"
                                        value={theme}
                                        onChange={(e) => {
                                            setTheme(e.target.value);
                                            if (formSubmitted) {
                                                validateForm();
                                            }
                                        }}
                                        required
                                        className={formErrors.theme ? "error" : ""}
                                    />
                                    {formErrors.theme && <ErrorText>{translations.errorTheme}</ErrorText>}
                                </FormGroup>

                                <FormGroup>
                                    <LabelContainer>
                                        <Label>{translations.dep}</Label>
                                        <RequiredAsterisk>*</RequiredAsterisk>
                                    </LabelContainer>
                                    <StyledSelect
                                        value={departement}
                                        onChange={(e) => {
                                            setDepartement(e.target.value);
                                            if (formSubmitted) {
                                                validateForm();
                                            }
                                        }}
                                        required
                                        className={formErrors.departement ? "error" : ""}
                                    >
                                        <option value="">{translations.selectOption}</option>
                                        <option value='Génie informatique'>Génie Informatique</option>
                                        <option value="Genie Civile">Génie Civile</option>
                                        <option value='Génie électrique'>Génie Électrique</option>
                                        <option value='Génie industriel mécanique'>Génie Mécanique/Industriel</option>
                                        <option value='Génie Télécom'>Génie Télécom</option>
                                    </StyledSelect>
                                    {formErrors.departement && <ErrorText>{translations.errorDep}</ErrorText>}
                                </FormGroup>

                                <FormGroup>
                                    <LabelContainer>
                                        <Label>{translations.annee}</Label>
                                        <RequiredAsterisk>*</RequiredAsterisk>
                                    </LabelContainer>
                                    <StyledInput
                                        type="number"
                                        placeholder="2025"
                                        value={annee}
                                        onChange={(e) => {
                                            setAnnee(e.target.value);
                                            if (formSubmitted) {
                                                validateForm();
                                            }
                                        }}
                                        required
                                        className={formErrors.annee ? "error" : ""}
                                    />
                                    {formErrors.annee && <ErrorText>{translations.errorAnnee}</ErrorText>}
                                </FormGroup>

                                <FormGroup>
                                    <LabelContainer>
                                        <Label>{translations.etagère}</Label>
                                        <RequiredAsterisk>*</RequiredAsterisk>
                                    </LabelContainer>
                                    <StyledInput
                                        type="text"
                                        placeholder="Étagère"
                                        value={etagere}
                                        onChange={(e) => {
                                            setEtagere(e.target.value);
                                            if (formSubmitted) {
                                                validateForm();
                                            }
                                        }}
                                        required
                                        className={formErrors.etagere ? "error" : ""}
                                    />
                                    {formErrors.etagere && <ErrorText>{translations.errorEtagere}</ErrorText>}
                                </FormGroup>

                                <FileInputContainer>
                                    <LabelContainer>
                                        <Label classname="text-left">{translations.img}</Label>
                                        <RequiredAsterisk>*</RequiredAsterisk>
                                    </LabelContainer>
                                    {/* Hidden file input */}
                                    <HiddenFileInput
                                      type="file"
                                      id="file-input"
                                      onChange={handleFileChange}
                                      required
                                    />
                                    {/* Custom file input button */}
                                    <CustomFileInput 
                                        htmlFor="file-input"
                                        className={formErrors.image ? "error" : ""}
                                    >
                                        <FaUpload />
                                        {image ? `${translations.selected} ${image}` : translations.chooseFile}
                                    </CustomFileInput>
                                    {formErrors.image && <ErrorText>{translations.errorImage}</ErrorText>}
                                </FileInputContainer>
                            </FormGrid>
                            
                            <ButtonGroup>
                                <StyledButton type="submit" $primary>
                                    {translations.ajouter}
                                </StyledButton>
                                <StyledButton type="button" onClick={resetForm}>
                                    {translations.annuler}
                                </StyledButton>
                            </ButtonGroup>
                        </Form>
                    </FormContainer>
                </Col>
            </Row>
        </MemoireContainer>
    )
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

// Styled components pour le formulaire
const FileInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RequiredAsterisk = styled.span`
  color: #dc3545;
  font-weight: bold;
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
  transition: all 0.3s ease;

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
    transition: all 0.3s ease;

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