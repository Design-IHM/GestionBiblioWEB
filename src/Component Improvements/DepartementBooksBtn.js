import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Form } from 'react-bootstrap';
import { FaBook, FaPlus, FaUpload, FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import firebase from '../metro.config';
import ReactJsAlert from "reactjs-alert";
import { useI18n } from "../Context/I18nContext";
import styled from 'styled-components';

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

export default function DepartementMemoriesBtn(props) {
  const navigate = useNavigate();
  const { nom_du_departement, myimage } = props;
  const formRef = useRef();

  // Contexte i18n
  const { language } = useI18n();

  // États pour le style et modal
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // États pour le formulaire
  const [name, setName] = useState('');
  const [exemplaire, setExemplaire] = useState(1);
  const [etagere, setEtagere] = useState('');
  const [desc, setDesc] = useState('');
  const [salle, setSalle] = useState('');
  const [auteur, setAuteur] = useState('');
  const [edition, setEdition] = useState('');
  const [typ] = useState('');

  // États pour l'image et le chargement
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // États pour la validation du formulaire
  const [formErrors, setFormErrors] = useState({});

  // Notification
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "success",
    message: ""
  });

  // États pour l'alerte
  const [status, setStatus] = useState(false);
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");

  // Traductions
  const translations = {
    view: language === "FR" ? "Visualiser" : "View",
    add: language === "FR" ? "Ajouter" : "Add",
    add_book: language === "FR" ? `Ajouter un livre de ${nom_du_departement}` : `Add a book from ${nom_du_departement}`,
    book_name: language === "FR" ? "Nom du Livre" : "Book Name",
    department: language === "FR" ? "Département" : "Department",
    number_of_copies: language === "FR" ? "Nombre d'exemplaires" : "Number of Copies",
    shelf_number: language === "FR" ? "Numéro de l'étagère" : "Shelf Number",
    room_number: language === "FR" ? "Numéro de salle" : "Room Number",
    author: language === "FR" ? "Auteur" : "Author",
    edition: language === "FR" ? "Édition" : "Edition",
    document_description: language === "FR" ? "Description du document" : "Document Description",
    image_link: language === "FR" ? "Image du livre" : "Book Image",
    adding: language === "FR" ? "Ajout en cours..." : "Adding...",
    cancel: language === "FR" ? "Annuler" : "Cancel",
    document_added: language === "FR" ? "livre ajouté avec succès" : "Book added successfully",
    error_upload_image: language === "FR" ? "Veuillez sélectionner une image" : "Please select an image",
    error_saving: language === "FR" ? "Erreur lors de l'enregistrement" : "Error saving document",
    select_room: language === "FR" ? "Sélectionner une salle" : "Select a room",
    error_validation: language === "FR" ? "Veuillez remplir tous les champs obligatoires" : "Please fill all required fields",
    error_name: language === "FR" ? "Nom requis" : "Name required",
    error_etagere: language === "FR" ? "Étagère requise" : "Shelf required",
    error_salle: language === "FR" ? "Salle requise" : "Room required",
    error_image: language === "FR" ? "Image requise" : "Image required",
    document_info: language === "FR" ? "Informations du document" : "Document information",
    document_location: language === "FR" ? "Emplacement du document" : "Document location",
    document_image: language === "FR" ? "Image du document" : "Document image",
    required_fields: language === "FR" ? "Champs obligatoires" : "Required fields",
    choose_file: language === "FR" ? "Choisir une image" : "Choose an image",
    image_selected: language === "FR" ? "Image sélectionnée" : "Image selected",
  };

  const handleVisualiser = () => {
    navigate('/catalogue', { state: { departement: nom_du_departement } });
  };

  const handleAjouter = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

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
    if (!etagere.trim()) errors.etagere = true;
    if (!salle) errors.salle = true;
    if (!image) errors.image = true;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setName('');
    setExemplaire(1);
    setEtagere('');
    setDesc('');
    setImage(null);
    setImagePreview(null);
    setSalle('');
    setAuteur('');
    setEdition('');
    setFormErrors({});
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        cathegorie: nom_du_departement,
        desc: desc,
        // Nouveaux champs
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
      handleModalClose();
      setTimeout(() => {
        navigate("/catalogue", { state: { departement: nom_du_departement } });
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      showNotification("error", translations.error_saving);
    } finally {
      setLoading(false);
    }
  };

  // Styles pour la carte de département
  const cardStyle = {
    backgroundImage: `url(${myimage})`,
    backgroundSize: 'cover',
    width: '300px',
    height: '200px',
    cursor: 'pointer',
    position: 'relative',
    transition: 'box-shadow 0.3s ease',
    boxShadow: isHovered ? '0 0 10px rgba(0, 0, 0, 0.2)' : 'none',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto',
    borderRadius: '45px',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    padding: '10px',
  };

  const buttonAjouterStyle = {
    width: '100px',
    backgroundColor: '#28a745',
    borderColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: '5px',
    ':hover':{
      backgroundColor: '#218838',
    }
  };

  const buttonVisualiserStyle = {
    width: '100px',
    backgroundColor: '#fe7a3f',
    borderColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: '5px',
  };

  const iconStyle = {
    fontSize: '1.2rem',
  };

  const bookIconStyle = {
    fontSize: '1.5rem',
    marginRight: '5px',
  };

  return (
    <div className="border border-dadius border-solid-2 p-2 bg-light">
      <h4 className="text-center">
        <FaBook style={bookIconStyle} /> <span className="text-dark">{nom_du_departement}</span>
      </h4>

      <div
        className="card"
        style={cardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="card-body">
          <div style={buttonContainerStyle}>
            <button
              className="btn"
              onClick={handleVisualiser}
              style={buttonVisualiserStyle}
            >
              {translations.view}
            </button>
            <button
              className="btn"
              onClick={handleAjouter}
              style={buttonAjouterStyle}
            >
              <FaPlus style={iconStyle} /> {translations.add}
            </button>
          </div>
        </div>
      </div>

      {/* Notification */}
      <Notification
        isVisible={notification.isVisible}
        type={notification.type}
        message={notification.message}
        onClose={closeNotification}
      />

      {/* Modal avec le formulaire harmonisé */}
      <ModalStyled
        show={showModal}
        onHide={handleModalClose}
        size="xl"
        centered
        backdrop="static"
      >
        <ModalHeader closeButton>
          <ModalTitle>
            {translations.add_book}
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <FormContainer>
            <Form ref={formRef} onSubmit={handleSubmit}>
              <FormLayout>
                {/* Informations du document */}
                <FormSection>
                  <SectionTitle>
                    <SectionIcon><FaBook /></SectionIcon>
                    {translations.document_info}
                  </SectionTitle>

                  <FormGroup>
                    <FormLabel>
                      {translations.book_name}
                      <RequiredDot />
                    </FormLabel>
                    <FormControl
                      type="text"
                      placeholder={translations.book_name}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      hasError={formErrors.name}
                    />
                    {formErrors.name && <ErrorMessage>{translations.error_name}</ErrorMessage>}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      {translations.department}
                    </FormLabel>
                    <FormControl
                      type="text"
                      value={nom_du_departement}
                      readOnly
                      disabled
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      {translations.author}
                    </FormLabel>
                    <FormControl
                      type="text"
                      placeholder={translations.author}
                      value={auteur}
                      onChange={(e) => setAuteur(e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      {translations.edition}
                    </FormLabel>
                    <FormControl
                      type="text"
                      placeholder={translations.edition}
                      value={edition}
                      onChange={(e) => setEdition(e.target.value)}
                    />
                  </FormGroup>
                </FormSection>

                {/* Emplacement du document */}
                <FormSection>
                  <SectionTitle>
                    <SectionIcon><FaBook /></SectionIcon>
                    {translations.document_location}
                  </SectionTitle>

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
                    {formErrors.etagere && <ErrorMessage>{translations.error_etagere}</ErrorMessage>}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      {translations.room_number}
                      <RequiredDot />
                    </FormLabel>
                    <FormSelect
                      value={salle}
                      onChange={(e) => setSalle(e.target.value)}
                      hasError={formErrors.salle}
                    >
                      <option value="">{translations.select_room}</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </FormSelect>
                    {formErrors.salle && <ErrorMessage>{translations.error_salle}</ErrorMessage>}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      {translations.number_of_copies}
                      <RequiredDot />
                    </FormLabel>
                    <FormControl
                      type="number"
                      min="1"
                      value={exemplaire}
                      onChange={(e) => setExemplaire(e.target.value)}
                    />
                  </FormGroup>
                </FormSection>

                {/* Image du document */}
                <FormSection>
                  <SectionTitle>
                    <SectionIcon><FaBook /></SectionIcon>
                    {translations.document_image}
                  </SectionTitle>

                  <ImageUploadContainer>
                    <FormGroup>
                      <FormLabel>
                        {translations.image_link}
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
                        {formErrors.image && <ErrorMessage>{translations.error_image}</ErrorMessage>}
                      </FileUploadWrap>
                    </FormGroup>

                    {imagePreview ? (
                      <ImagePreviewWrap>
                        <ImagePreview src={imagePreview} alt="Aperçu" />
                      </ImagePreviewWrap>
                    ) : (
                      <ImagePlaceholder>
                        <FaBook size={48} />
                        <PlaceholderText>{translations.image_link}</PlaceholderText>
                      </ImagePlaceholder>
                    )}
                  </ImageUploadContainer>
                </FormSection>
              </FormLayout>

              {/* Description du document */}
              <DescriptionSection>
                <SectionTitle>
                  <SectionIcon><FaBook /></SectionIcon>
                  {translations.document_description}
                </SectionTitle>
                <TextArea
                  rows="3"
                  placeholder={translations.document_description}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </DescriptionSection>

              {/* Boutons d'action */}
              <ActionButtons>
                <SubmitButton
                  type="submit"
                  disabled={loading}
                >
                  {loading ? translations.adding : translations.add}
                </SubmitButton>
                <CancelButton type="button" onClick={handleModalClose}>
                  {translations.cancel}
                </CancelButton>
              </ActionButtons>
            </Form>
          </FormContainer>
        </ModalBody>
      </ModalStyled>

      <ReactJsAlert
        status={status}
        type={type}
        title={title}
        Close={() => setStatus(false)}
      />
    </div>
  );
}

// Styles pour le Modal
const ModalStyled = styled(Modal)`
  .modal-content {
    border-radius: 10px;
    border: none;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ModalHeader = styled(Modal.Header)`
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 15px 20px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const ModalTitle = styled(Modal.Title)`
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
`;

const ModalBody = styled(Modal.Body)`
  padding: 20px;
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

// Conteneur du formulaire
const FormContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
`;

// Styles pour les sections et cartes
const FormSection = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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

// Styles pour le formulaire
const FormLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
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

const RequiredDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  background: #fe7a3f;
  border-radius: 50%;
  margin-left: 5px;
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

// Styles pour la description
const DescriptionSection = styled(FormSection)``;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dce1e8;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s;
  resize: none;
  background-color: #f8f9fa;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #fe7a3f;
    box-shadow: 0 0 0 3px rgba(254, 122, 63, 0.1);
    background-color: white;
  }
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

const BaseButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
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
