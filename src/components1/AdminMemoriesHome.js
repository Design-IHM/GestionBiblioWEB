import React, { useState, useEffect } from 'react';
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import ReactJsAlert from "reactjs-alert";
import { useI18n } from "../Context/I18nContext";
import firebase from "../metro.config";
import { FaPlus, FaUpload, FaCheck, FaTimes, FaEye, FaFileAlt, FaGraduationCap } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import { storage } from "../firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

// Composant de notification stylisé
const Notification = ({ isVisible, type, message, onClose }) => {
  if (!isVisible) return null;

  return (
    <NotificationWrapper type={type}>
      <NotificationContent>
        <NotificationIcon type={type}>
          {type === "success" ? <FaCheck size={20} /> : <FaTimes size={20} />}
        </NotificationIcon>
        <NotificationMessage>{message}</NotificationMessage>
        <NotificationClose onClick={onClose}>
          <FaTimes />
        </NotificationClose>
      </NotificationContent>
    </NotificationWrapper>
  );
};

export default function AdminMemoriesHome() {
    // États pour la liste des mémoires et le modal
    const [memories, setMemories] = useState([]);
    const [departements, setDepartements] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDepartementModal, setShowDepartementModal] = useState(false);

    // États pour les alertes
    const [status, setStatus] = useState(false);
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");

    // États du formulaire mémoire
    const [name, setName] = useState('');
    const [matricule, setMatricule] = useState('');
    const [theme, setTheme] = useState('');
    const [departement, setDepartement] = useState('');
    const [annee, setAnnee] = useState('');
    const [etagere, setEtagere] = useState('');
    const [superviseur, setSuperviseur] = useState('');

    // États du formulaire département
    const [nomDepartement, setNomDepartement] = useState('');
    const [imageDepartement, setImageDepartement] = useState(null);
    const [previewImage, setPreviewImage] = useState('');

    // États pour la gestion de l'image du mémoire
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [departementLoading, setDepartementLoading] = useState(false);

    // États de validation du formulaire
    const [formErrors, setFormErrors] = useState({});

    // Notification
    const [notification, setNotification] = useState({
      isVisible: false,
      type: "success",
      message: ""
    });

    const navigate = useNavigate();
    const { language } = useI18n();

    // Traductions pour l'interface
    const translations = {
        admin_memories: language === "FR" ? "Administration des mémoires" : "Memories Administration",
        student_name: language === "FR" ? "Nom de l'étudiant" : "Student Name",
        student_id: language === "FR" ? "Matricule de l'étudiant" : "Student ID",
        thesis_theme: language === "FR" ? "Thème de soutenance" : "Thesis Theme",
        department: language === "FR" ? "Département" : "Department",
        graduation_year: language === "FR" ? "Année de soutenance" : "Graduation Year",
        shelf_number: language === "FR" ? "Numéro de l'étagère" : "Shelf Number",
        supervisor: language === "FR" ? "Superviseur" : "Supervisor",
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
        select_department: language === "FR" ? "Sélectionner l'année de soutenance" : "Select the year of defense",
        add_document: language === "FR" ? "Ajouter un mémoire" : "Add a thesis",
        document_type: language === "FR" ? "Type de document" : "Document type",
        required_fields: language === "FR" ? "Champs obligatoires" : "Required fields",
        document_info: language === "FR" ? "Informations du mémoire" : "Thesis information",
        student_info: language === "FR" ? "Informations de l'étudiant" : "Student information",
        document_location: language === "FR" ? "Emplacement du document" : "Document location",
        document_image: language === "FR" ? "Image du document" : "Document image",
        view: language === "FR" ? "Visualiser" : "View",
        addDepartment: language === "FR" ? "Ajouter un département" : "Add a department",
        addDepartmentMobile: language === "FR" ? "Département" : "Department",
        createDepartment: language === "FR" ? "Créer un nouveau département" : "Create a new department",
        departmentName: language === "FR" ? "Nom du département" : "Department name",
        departmentNamePlaceholder: language === "FR" ? "Ex: Sciences, Littérature..." : "Ex: Sciences, Literature...",
        shortNameTip: language === "FR" ? "Saisissez un nom court et descriptif" : "Enter a short and descriptive name",
        departmentImage: language === "FR" ? "Image du département" : "Department image",
        selectImage: language === "FR" ? "Cliquez pour sélectionner une image" : "Click to select an image",
        changeImage: language === "FR" ? "Changer l'image" : "Change image",
        imageFormat: language === "FR" ? "Format recommandé: JPG, PNG (max 5MB)" : "Recommended format: JPG, PNG (max 5MB)",
        preview: language === "FR" ? "Aperçu" : "Preview",
        save: language === "FR" ? "Enregistrer" : "Save",
        saving: language === "FR" ? "Enregistrement..." : "Saving...",
        noDepartments: language === "FR" ? "Aucun département n'a été créé" : "No department has been created",
        createFirstDepartment: language === "FR" ? "Créer votre premier département" : "Create your first department",
        department_added: language === "FR" ? "Département ajouté avec succès dans les livres et memoires" : "Department successfully added to books and memoirs",
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

    // Récupérer les départements depuis Firebase
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

    useEffect(() => {
        fetchMemories();
        fetchDepartements();
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
      if (!annee) errors.annee = true;
      if (!etagere.trim()) errors.etagere = true;
      if (!image) errors.image = true;

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };

    // Gestion du formulaire de mémoire
    const handleModalClose = () => {
        setShowModal(false);
        resetForm();
    };

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Gestion du formulaire de département
    const handleDepartementModalClose = () => {
        setShowDepartementModal(false);
        setNomDepartement('');
        setImageDepartement(null);
        setPreviewImage('');
    };

    const handleDepartementImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageDepartement(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Upload d'image
    const uploadImage = async (file, path) => {
        if (!file) return null;

        try {
            const imageRef = ref(storage, `${path}/${file.name + v4()}`);
            await uploadBytes(imageRef, file);
            const downloadURL = await getDownloadURL(imageRef);
            return downloadURL;
        } catch (error) {
            console.error("Erreur lors de l'upload de l'image:", error);
            throw error;
        }
    };

    // Soumission du formulaire de mémoire
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
            const imageUrl = await uploadImage(image, 'memoires');

            if (!imageUrl) {
                showNotification("error", translations.error_upload_image);
                setLoading(false);
                return;
            }

            await firebase.firestore().collection('Memoire').doc(matricule).set({
                id: matricule, // ID explicite
                name: name,
                matricule: matricule,
                theme: theme,
                département: departement,
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
            handleModalClose();

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
            console.error("Erreur lors de l'enregistrement:", error);
            showNotification("error", translations.error_saving);
        } finally {
            setLoading(false);
        }
    };

    // Soumission du formulaire de département
    const handleDepartementSubmit = async (e) => {
        e.preventDefault();

        if (!nomDepartement || !imageDepartement) {
            setStatus(true);
            setType("error");
            setTitle(translations.select_image);
            return;
        }

        setDepartementLoading(true);

        try {
            // Upload de l'image dans Firebase Storage
            const imageUrl = await uploadImage(imageDepartement, 'departements');

            // Ajout du document dans la collection departement
            await firebase.firestore().collection('departements').add({
                nom: nomDepartement,
                image: imageUrl,
                dateCreation: new Date(),
                dateModification: new Date()
            });

            setStatus(true);
            setType("success");
            setTitle(translations.department_added);
            handleDepartementModalClose();
        } catch (error) {
            console.error("Erreur lors de l'ajout du département:", error);
            setStatus(true);
            setType("error");
            setTitle(translations.error_saving);
        } finally {
            setDepartementLoading(false);
        }
    };

    // Gestion des actions par département
    const handleVisualiser = (departement) => {
        const departementNom = departement.nom;
        const filteredMemories = memories.filter((memoire) => memoire.département === departementNom);
        navigate('/memoireParDepartement', {
            state: {
                memories: filteredMemories,
                departement: departementNom
            }
        });
    };

    const handleAjouter = (departement) => {
        setShowModal(true);
        setDepartement(departement.nom);
    };

    // Générer les années
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1971 + 1 }, (_, i) => 1971 + i);

    // Générer les cartes de département
    const departementRows = [];
    let currentRow = [];

    departements.forEach((dept, index) => {
        currentRow.push(
            <div key={dept.id} className="col-md-4 mb-4">
                <div className="card shadow" style={{ width: '18rem' }}>
                    <img src={dept.image} className="card-img-top" alt={dept.nom} style={{ height: '180px', objectFit: 'cover' }} />
                    <div className="card-body text-center">
                        <h5 className="card-title">{dept.nom}</h5>
                        <div className="d-flex justify-content-between">
                            <button
                                className="btn"
                                style={{ backgroundColor: '#fe7a3f', color: 'white' }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#e66a2f'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#fe7a3f'}
                                onClick={() => handleVisualiser(dept)}>
                                <FaEye /> {translations.view}
                            </button>
                            <button
                                className="btn"
                                style={{ backgroundColor: '#28a745', color: 'white' }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#2a9b44'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
                                onClick={() => handleAjouter(dept)}>
                                <FaPlus /> {translations.add}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );

        if ((index + 1) % 3 === 0 || index === departements.length - 1) {
            departementRows.push(
                <div key={index} className="row">
                    {currentRow}
                </div>
            );
            currentRow = [];
        }
    });

    return (
        <div className="content-box">
            <Sidebar />
            <Navbar />

            <div className="d-flex align-items-center justify-content-between px-4 py-3 mb-4">
                <h1 className="mr-2 text-secondary">{translations.admin_memories}</h1>

                {/* Bouton d'ajout de département responsive */}
                <Button
                    className="d-flex align-items-center shadow custom-primary-btn"
                    style={{ backgroundColor: "#fe7a3f", borderColor: "#fe7a3f", color: "white" }}
                    onClick={() => setShowDepartementModal(true)}
                >
                    <FaPlus className="me-2" />
                    <span className="d-none d-sm-inline">{translations.addDepartment}</span>
                    <span className="d-inline d-sm-none">{translations.addDepartmentMobile}</span>
                </Button>
            </div>

            <div className="px-2 px-md-4 mt-2">
                {departements.length === 0 ? (
                    <div className="text-center py-5 my-4 bg-light rounded">
                        <p className="text-muted mb-3">{translations.noDepartments}</p>
                        <Button
                            className="custom-primary-btn"
                            style={{ backgroundColor: "#fe7a3f", borderColor: "#fe7a3f", color: "white" }}
                            onClick={() => setShowDepartementModal(true)}>
                            <FaPlus className="me-2" /> {translations.createFirstDepartment}
                        </Button>
                    </div>
                ) : (
                    departementRows
                )}
            </div>

            {/* Notification */}
            <Notification
              isVisible={notification.isVisible}
              type={notification.type}
              message={notification.message}
              onClose={closeNotification}
            />

            {/* Modal pour ajouter un mémoire avec style AjouterMemoire */}
            <ModalStyled
              show={showModal}
              onHide={handleModalClose}
              size="xl"
              centered
              backdrop="static"
            >
                <ModalHeader closeButton>
                    <ModalTitle>
                        {translations.add_document} - {departement}
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <FormContainer>
                      <Form onSubmit={handleSubmit}>
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
                                {translations.graduation_year}
                                <RequiredDot />
                              </FormLabel>
                              <FormSelect
                                value={annee}
                                onChange={(e) => setAnnee(e.target.value)}
                                hasError={formErrors.annee}
                              >
                                <option value="">{translations.select_department}</option>
                                {years.map((year) => (
                                  <option key={year} value={year}>{year}</option>
                                ))}
                              </FormSelect>
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
                          <CancelButton type="button" onClick={handleModalClose}>
                            {translations.cancel}
                          </CancelButton>
                        </ActionButtons>
                      </Form>
                    </FormContainer>
                </ModalBody>
            </ModalStyled>

            {/* Modal pour créer un nouveau département */}
            <Modal
                show={showDepartementModal}
                onHide={handleDepartementModalClose}
                centered
                backdrop="static"
                size="lg"
            >
                <Modal.Header className="bg-light">
                    <Modal.Title className="fs-4">
                        <FaPlus className="me-2" style={{ color: "#fe7a3f" }} />
                        {translations.createDepartment}
                    </Modal.Title>
                    <Button
                        variant="light"
                        className="btn-close"
                        onClick={handleDepartementModalClose}
                        aria-label="Fermer"
                    />
                </Modal.Header>

                <Modal.Body className="px-4">
                    <Form onSubmit={handleDepartementSubmit} id="departementForm">
                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <Form.Group controlId="nomDepartement">
                                    <Form.Label className="fw-bold mb-2">{translations.departmentName}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder={translations.departmentNamePlaceholder}
                                        value={nomDepartement}
                                        onChange={(e) => setNomDepartement(e.target.value)}
                                        className="py-2 shadow-sm"
                                        required
                                    />
                                    <Form.Text className="text-muted">
                                        {translations.shortNameTip}
                                    </Form.Text>
                                </Form.Group>
                            </div>

                            <div className="col-md-6 mb-4">
                                <Form.Group controlId="imageDepartement">
                                    <Form.Label className="fw-bold mb-2">{translations.departmentImage}</Form.Label>
                                    <div className="custom-file-upload">
                                        <div className={`upload-zone p-3 rounded text-center ${previewImage ? 'border-custom' : 'border-dashed'}`}
                                             style={{cursor: 'pointer', borderWidth: '2px', borderStyle: previewImage ? 'solid' : 'dashed', borderColor: previewImage ? '#fe7a3f' : '#dee2e6'}}>
                                            {previewImage ? (
                                                <FaCheck className="mb-2" style={{fontSize: '1.5rem', color: '#fe7a3f'}} />
                                            ) : (
                                                <FaUpload className="text-muted mb-2" style={{fontSize: '1.5rem'}} />
                                            )}
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={handleDepartementImageChange}
                                                required
                                                className="d-none"
                                                id="fileInput"
                                            />
                                            <label htmlFor="fileInput" className="d-block mb-0" style={{cursor: 'pointer'}}>
                                                {previewImage ? translations.changeImage : translations.selectImage}
                                            </label>
                                            <small className="text-muted d-block mt-1">
                                                {translations.imageFormat}
                                            </small>
                                        </div>
                                    </div>
                                </Form.Group>
                            </div>
                        </div>

                        {/* Aperçu de l'image avec animation de transition */}
                        {previewImage && (
                            <div className="text-center mb-4 p-3 bg-light rounded">
                                <h6 className="text-muted mb-3">{translations.preview}</h6>
                                <div className="image-preview-container">
                                    <img
                                        src={previewImage}
                                        alt="Aperçu"
                                        className="img-preview img-fluid rounded shadow-sm"
                                        style={{ maxHeight: '240px', transition: 'all 0.3s ease' }}
                                    />
                                </div>
                            </div>
                        )}
                    </Form>
                </Modal.Body>

                <Modal.Footer className="border-top-0 pt-0 pb-4 px-4">
                    <Button
                        variant="outline-secondary"
                        onClick={handleDepartementModalClose}
                        className="px-4 d-flex align-items-center"
                        disabled={departementLoading}
                    >
                        <FaTimes className="me-2" /> {translations.cancel}
                    </Button>
                    <Button
                        type="submit"
                        form="departementForm"
                        className="px-4 d-flex align-items-center shadow-sm custom-primary-btn"
                        style={{ backgroundColor: "#fe7a3f", borderColor: "#fe7a3f", color: "white" }}
                        disabled={departementLoading}
                    >
                        {departementLoading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                {translations.saving}
                            </>
                        ) : (
                            <>
                                <FaCheck className="me-2" /> {translations.save}
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

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
