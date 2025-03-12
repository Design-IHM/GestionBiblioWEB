import React, { useState, useRef, useEffect } from "react";
import { Form } from "react-bootstrap";
import firebase from '../metro.config';
import { useNavigate } from "react-router-dom";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import styled from 'styled-components';
import memoire from "../../src/assets/mémoirecard.jpeg";
import livre from "../../src/assets/livrecard.jpg";
import { FaUpload, FaTimes, FaCheckCircle, FaExclamationTriangle, FaBook, FaFileAlt, FaGraduationCap } from "react-icons/fa";
import { useI18n } from "../Context/I18nContext";
import { storage } from "../firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

// Composant de notification
const Notification = ({ isVisible, type, message, onClose }) => {
  if (!isVisible) return null;

  return (
    <NotificationWrapper type={type}>
      <NotificationContent>
        <NotificationIcon type={type}>
          {type === "success" ? <FaCheckCircle size={20} /> : <FaExclamationTriangle size={20} />}
        </NotificationIcon>
        <NotificationMessage>{message}</NotificationMessage>
        <NotificationClose onClick={onClose}>
          <FaTimes />
        </NotificationClose>
      </NotificationContent>
    </NotificationWrapper>
  );
};

export default function Ajoutermemoire() {
  // États du formulaire
  const [name, setName] = useState('');
  const [matricule, setMatricule] = useState('');
  const [theme, setTheme] = useState('');
  const [departement, setDepartement] = useState('');
  const [annee, setAnnee] = useState('');
  const [etagere, setEtagere] = useState('');
  const [superviseur, setSuperviseur] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [departements, setDepartements] = useState([]);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Références et navigation
  const formRef = useRef();
  const navigate = useNavigate();
  const { language } = useI18n();

  // Validation du formulaire
  const [formErrors, setFormErrors] = useState({});

  // Notification
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "success",
    message: ""
  });

  // Récupérer les départements depuis Firestore
  useEffect(() => {
    const fetchDepartements = () => {
      const ref = firebase.firestore().collection("departements");
      ref.onSnapshot((querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setDepartements(items);
      });
    };

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

    fetchDepartements();
    fetchMemories();
  }, []);

  // Gestion des notifications
  const showNotification = (type, message) => {
    setNotification({
      isVisible: true,
      type,
      message
    });

    setTimeout(() => {
      closeNotification();
    }, 4000);
  };

  const closeNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  // Validation du formulaire
  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = true;
    if (!matricule.trim()) errors.matricule = true;
    if (!theme.trim()) errors.theme = true;
    if (!departement) errors.departement = true;
    if (!annee.trim()) errors.annee = true;
    if (!etagere.trim()) errors.etagere = true;
    if (!image) errors.image = true;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Gestion de l'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Upload de l'image
  const uploadImage = async (file) => {
    if (!file) return null;

    try {
      const imageRef = ref(storage, `memoires/${file.name + v4()}`);
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image:", error);
      throw error;
    }
  };

  // Soumission du formulaire
  const res = async function (e) {
    if (e) e.preventDefault();

    if (!validateForm()) {
      showNotification("error", translations.error_validation);
      return;
    }

    if (!image) {
      showNotification("error", translations.error_upload_image);
      return;
    }

    setLoading(true);

    try {
      // Upload de l'image et récupération de l'URL
      const imageUrl = await uploadImage(image);

      if (!imageUrl) {
        showNotification("error", translations.error_upload_image);
        setLoading(false);
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
        superviseur: superviseur || null,
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

      showNotification("success", translations.document_added);
    } catch (error) {
      console.error("Erreur lors de l'ajout du mémoire:", error);
      showNotification("error", translations.error_saving);
    } finally {
      setLoading(false);
    }
  };

  // Réinitialisation du formulaire
  const resetForm = () => {
    setName('');
    setMatricule('');
    setTheme('');
    setDepartement('');
    setAnnee('');
    setEtagere('');
    setSuperviseur('');
    setImage(null);
    setImagePreview(null);
    setFormErrors({});
  };

  // Traductions
  const translations = {
    student_name: language === "FR" ? "Nom de l'étudiant" : "Student Name",
    student_id: language === "FR" ? "Matricule de l'étudiant" : "Student ID",
    thesis_theme: language === "FR" ? "Thème de soutenance" : "Thesis Theme",
    department: language === "FR" ? "Département" : "Department",
    supervisor: language === "FR" ? "Superviseur" : "Supervisor",
    graduation_year: language === "FR" ? "Année de soutenance" : "Graduation Year",
    shelf_number: language === "FR" ? "Numéro de l'étagère" : "Shelf Number",
    thesis_image: language === "FR" ? "Image du mémoire" : "Thesis Image",
    add: language === "FR" ? "Enregistrer" : "Register",
    adding: language === "FR" ? "Ajout en cours..." : "Adding...",
    cancel: language === "FR" ? "Annuler" : "Cancel",
    document_added: language === "FR" ? "Mémoire ajouté avec succès" : "Thesis added successfully",
    imgBook: language === "FR" ? "LIVRE" : "BOOK",
    imgTheses: language === "FR" ? "MÉMOIRE" : "THESIS",
    choose_file: language === "FR" ? "Choisir une image" : "Choose an image",
    image_selected: language === "FR" ? "Image sélectionnée" : "Image selected",
    error_upload_image: language === "FR" ? "Erreur lors de l'upload de l'image" : "Error uploading image",
    error_saving: language === "FR" ? "Erreur lors de l'enregistrement" : "Error saving document",
    error_validation: language === "FR" ? "Veuillez remplir tous les champs obligatoires" : "Please fill all required fields",
    select_department: language === "FR" ? "Sélectionner un département" : "Select a department",
    add_document: language === "FR" ? "Ajouter un mémoire" : "Add a thesis",
    document_type: language === "FR" ? "Type de document" : "Document type",
    required_fields: language === "FR" ? "Champs obligatoires" : "Required fields",
    document_info: language === "FR" ? "Informations du mémoire" : "Thesis information",
    student_info: language === "FR" ? "Informations de l'étudiant" : "Student information",
    document_location: language === "FR" ? "Emplacement du document" : "Document location",
    document_image: language === "FR" ? "Image du document" : "Document image",
  };

  return (
    <AppLayout>
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>

      <MainContainer>
        <NavbarWrapper>
          <Navbar />
        </NavbarWrapper>

        <PageContent>
          {/* Notification */}
          <Notification
            isVisible={notification.isVisible}
            type={notification.type}
            message={notification.message}
            onClose={closeNotification}
          />

          <PageHeader>
            <HeaderTitle>{translations.add_document}</HeaderTitle>
            <RequiredNote>
              <RequiredDot />
              <span>{translations.required_fields}</span>
            </RequiredNote>
          </PageHeader>

          {/* Formulaire complet */}
          <FormContainer>
            {/* Sélection du type de document */}
            <SectionCard>
              <SectionTitle>
                <SectionIcon><FaBook /></SectionIcon>
                {translations.document_type}
              </SectionTitle>

              <DocumentTypeContainer>
                <DocumentTypeOption
                  active={false}
                  onClick={() => navigate('/ajouterDoc')}
                >
                  <TypeIconContainer active={false}>
                    <FaBook size={24} />
                  </TypeIconContainer>
                  <TypeDetails>
                    <TypePreview src={livre} alt={translations.imgBook} />
                    <TypeLabel active={false}>{translations.imgBook}</TypeLabel>
                  </TypeDetails>
                </DocumentTypeOption>

                <DocumentTypeOption
                  active={true}
                  onClick={() => navigate('/ajoutermémoire')}
                >
                  <TypeIconContainer active={true}>
                    <FaFileAlt size={24} />
                  </TypeIconContainer>
                  <TypeDetails>
                    <TypePreview src={memoire} alt={translations.imgTheses} />
                    <TypeLabel active={true}>{translations.imgTheses}</TypeLabel>
                  </TypeDetails>
                </DocumentTypeOption>
              </DocumentTypeContainer>
            </SectionCard>

            <Form ref={formRef} onSubmit={(e) => { e.preventDefault(); res(e); }}>
              <FormLayout>
                {/* Informations de l'étudiant */}
                <FormSection>
                  <SectionTitle>
                    <SectionIcon><FaGraduationCap /></SectionIcon>
                    {translations.student_info}
                  </SectionTitle>

                  <FormGroup>
                    <FormLabel>
                      {translations.student_name}
                      <RequiredDot />
                    </FormLabel>
                    <FormControl
                      type="text"
                      placeholder={translations.student_name}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      hasError={formErrors.name}
                    />
                    {formErrors.name && <ErrorMessage>{translations.error_validation}</ErrorMessage>}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      {translations.student_id}
                      <RequiredDot />
                    </FormLabel>
                    <FormControl
                      type="text"
                      placeholder="20P123"
                      value={matricule}
                      onChange={(e) => setMatricule(e.target.value)}
                      hasError={formErrors.matricule}
                    />
                    {formErrors.matricule && <ErrorMessage>{translations.error_validation}</ErrorMessage>}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      {translations.supervisor}
                    </FormLabel>
                    <FormControl
                      type="text"
                      placeholder="Dr. Nom du superviseur"
                      value={superviseur}
                      onChange={(e) => setSuperviseur(e.target.value)}
                    />
                  </FormGroup>
                </FormSection>

                {/* Informations du mémoire */}
                <FormSection>
                  <SectionTitle>
                    <SectionIcon><FaFileAlt /></SectionIcon>
                    {translations.document_info}
                  </SectionTitle>

                  <FormGroup>
                    <FormLabel>
                      {translations.thesis_theme}
                      <RequiredDot />
                    </FormLabel>
                    <FormControl
                      type="text"
                      placeholder={translations.thesis_theme}
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      hasError={formErrors.theme}
                    />
                    {formErrors.theme && <ErrorMessage>{translations.error_validation}</ErrorMessage>}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      {translations.department}
                      <RequiredDot />
                    </FormLabel>
                    <FormSelect
                      value={departement}
                      onChange={(e) => setDepartement(e.target.value)}
                      hasError={formErrors.departement}
                    >
                      <option value="">{translations.select_department}</option>
                      {departements.map((dept) => (
                        <option key={dept.id} value={dept.nom}>
                          {dept.nom}
                        </option>
                      ))}
                    </FormSelect>
                    {formErrors.departement && <ErrorMessage>{translations.error_validation}</ErrorMessage>}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      {translations.graduation_year}
                      <RequiredDot />
                    </FormLabel>
                    <FormControl
                      type="number"
                      placeholder="2025"
                      value={annee}
                      onChange={(e) => setAnnee(e.target.value)}
                      hasError={formErrors.annee}
                    />
                    {formErrors.annee && <ErrorMessage>{translations.error_validation}</ErrorMessage>}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      {translations.shelf_number}
                      <RequiredDot />
                    </FormLabel>
                    <FormControl
                      type="text"
                      placeholder={translations.shelf_number}
                      value={etagere}
                      onChange={(e) => setEtagere(e.target.value)}
                      hasError={formErrors.etagere}
                    />
                    {formErrors.etagere && <ErrorMessage>{translations.error_validation}</ErrorMessage>}
                  </FormGroup>
                </FormSection>

                {/* Image du document */}
                <FormSection>
                  <SectionTitle>
                    <SectionIcon><FaFileAlt /></SectionIcon>
                    {translations.document_image}
                  </SectionTitle>

                  <ImageUploadContainer>
                    <FormGroup>
                      <FormLabel>
                        {translations.thesis_image}
                        <RequiredDot />
                      </FormLabel>
                      <FileUploadWrap hasError={formErrors.image}>
                        <HiddenInput
                          type="file"
                          id="image-upload"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        <UploadButton htmlFor="image-upload">
                          <FaUpload />
                          <span>{imagePreview ? translations.image_selected : translations.choose_file}</span>
                        </UploadButton>
                        {formErrors.image && <ErrorMessage>{translations.error_validation}</ErrorMessage>}
                      </FileUploadWrap>
                    </FormGroup>

                    {imagePreview ? (
                      <ImagePreviewWrap>
                        <ImagePreview src={imagePreview} alt="Aperçu" />
                      </ImagePreviewWrap>
                    ) : (
                      <ImagePlaceholder>
                        <FaFileAlt size={48} />
                        <PlaceholderText>{translations.thesis_image}</PlaceholderText>
                      </ImagePlaceholder>
                    )}
                  </ImageUploadContainer>
                </FormSection>
              </FormLayout>

              {/* Boutons d'action */}
              <ActionButtons>
                <SubmitButton
                  type="submit"
                  disabled={loading}
                >
                  {loading ? translations.adding : translations.add}
                </SubmitButton>
                <CancelButton type="button" onClick={resetForm}>
                  {translations.cancel}
                </CancelButton>
              </ActionButtons>
            </Form>
          </FormContainer>
        </PageContent>
      </MainContainer>
    </AppLayout>
  );
}

// Structure de base de l'application
const AppLayout = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
`;

const SidebarWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 100;
  width: 200px;

  @media (max-width: 992px) {
    width: 10px;
  }
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 320px;
  width: calc(100% - 250px);
  height: 100vh;

  @media (max-width: 992px) {
    margin-left: 10px;
    width: calc(100% - 10px);
  }
`;

const NavbarWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 90;
  width: 100%;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const PageContent = styled.div`
  flex: 1;
  padding: 20px;

  overflow-y: auto;
  height: calc(100vh - 60px); /* Ajustez cette valeur selon la hauteur de votre navbar */
`;

// En-tête de la page
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e9ecef;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 140px;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: 576px) {
    width: 100%;
  }
`;

const BaseButton = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 120px;
`;

const SubmitButton = styled(BaseButton)`
  background-color: #fe7a3f;
  color: white;

  &:hover:not(:disabled) {
    background-color: #e66a2f;
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const CancelButton = styled(BaseButton)`
  background-color: #e9ecef;
  color: #495057;

  &:hover {
    background-color: #dee2e6;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Styles pour les notifications
const NotificationWrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  min-width: 280px;
  max-width: 350px;
  background: ${props => props.type === "success" ? "#d4edda" : "#f8d7da"};
  color: ${props => props.type === "success" ? "#155724" : "#721c24"};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.type === "success" ? "#155724" : "#721c24"};
  overflow: hidden;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;

const NotificationContent = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
`;

const NotificationIcon = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
`;

const NotificationMessage = styled.div`
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
`;

const NotificationClose = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
`;

const RequiredNote = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: #666;
`;

const RequiredDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  background: #fe7a3f;
  border-radius: 50%;
  margin-right: 5px;
`;

// Conteneur du formulaire
const FormContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

// Styles pour les sections et cartes
const SectionCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  margin-top: 0;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
`;

const SectionIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  color: #fe7a3f;
`;

// Styles pour les types de documents
const DocumentTypeContainer = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const DocumentTypeOption = styled.div`
  display: flex;
  align-items: center;
  background: ${props => props.active ? '#fff8f3' : 'white'};
  border: 2px solid ${props => props.active ? '#fe7a3f' : '#e9ecef'};
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;

  &:hover {
    border-color: ${props => props.active ? '#fe7a3f' : '#ccc'};
    background: ${props => props.active ? '#fff8f3' : '#f8f9fa'};
    transform: translateY(-2px);
  }
`;

const TypeIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.active ? '#fe7a3f' : '#e9ecef'};
  color: ${props => props.active ? 'white' : '#555'};
  width: 50px;
  height: 50px;
  border-radius: 10px;
  margin-right: 15px;
  transition: all 0.2s ease;
`;

const TypeDetails = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const TypePreview = styled.img`
  width: 80px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 8px;
`;

const TypeLabel = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${props => props.active ? '#fe7a3f' : '#555'};
  text-transform: uppercase;
`;

// Styles pour le formulaire
const FormLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const FormSection = styled(SectionCard)`
  margin-bottom: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const FormLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 6px;
`;

const FormControl = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.hasError ? '#dc3545' : '#dce1e8'};
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s;
  background-color: #f8f9fa;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc3545' : '#fe7a3f'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(220, 53, 69, 0.1)' : 'rgba(254, 122, 63, 0.1)'};
    background-color: white;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.hasError ? '#dc3545' : '#dce1e8'};
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s;
  background-color: #f8f9fa;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23555' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc3545' : '#fe7a3f'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(220, 53, 69, 0.1)' : 'rgba(254, 122, 63, 0.1)'};
    background-color: white;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 4px;
`;

const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const FileUploadWrap = styled.div`
  margin-bottom: 15px;
  border: ${props => props.hasError ? '1px dashed #dc3545' : '1px dashed #dce1e8'};
  border-radius: 6px;
  overflow: hidden;
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadButton = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: #f8f9fa;
  color: #495057;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e9ecef;
  }
`;

const ImagePreviewWrap = styled.div`
  flex: 1;
  min-height: 150px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #dce1e8;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const ImagePlaceholder = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border: 1px dashed #dce1e8;
  border-radius: 6px;
  padding: 20px;
  color: #adb5bd;
  min-height: 150px;
`;

const PlaceholderText = styled.p`
  margin-top: 10px;
  font-size: 0.9rem;
`;

// Styles pour les boutons d'action
const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
  margin-bottom: 30px;

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;
