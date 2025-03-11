import React, { useState, useEffect } from 'react';
import { FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import { Modal, Button, Form, Spinner, Row, Col } from 'react-bootstrap';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import DepartementBooksBtn from './DepartementBooksBtn';
import { useI18n } from '../Context/I18nContext';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function DepartementsList() {
    // États pour gérer les départements et le modal
    const [departements, setDepartements] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [nomDepartement, setNomDepartement] = useState('');
    const [imageDepartement, setImageDepartement] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Référence à Firestore et Storage
    const db = getFirestore();
    const storage = getStorage();

    // Internationalisation
    const { language } = useI18n();
    const translations = {
        admin: language === "FR" ? "Administration des livres" : "Book's administration",
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
        cancel: language === "FR" ? "Annuler" : "Cancel",
        save: language === "FR" ? "Enregistrer" : "Save",
        saving: language === "FR" ? "Enregistrement..." : "Saving...",
        noDepartments: language === "FR" ? "Aucun département n'a été créé" : "No department has been created",
        createFirstDepartment: language === "FR" ? "Créer votre premier département" : "Create your first department",
        success: language === "FR" ? "Département ajouté avec succès!" : "Department successfully added!",
        error: language === "FR" ? "Erreur:" : "Error:",
        fillAllFields: language === "FR" ? "Veuillez remplir tous les champs" : "Please fill in all fields"
    };

    // Charger les départements depuis Firestore au chargement du composant
    useEffect(() => {
        fetchDepartements();
    }, []);

    // Fonction pour récupérer les départements depuis Firestore
    const fetchDepartements = async () => {
        try {
            const departementsCollection = await getDocs(collection(db, "departements"));
            const departementsData = departementsCollection.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setDepartements(departementsData);
        } catch (error) {
            console.error("Erreur lors de la récupération des départements:", error);
        }
    };

    // Gérer l'ouverture/fermeture du modal
    const handleClose = () => {
        setShowModal(false);
        setNomDepartement('');
        setImageDepartement(null);
        setPreviewImage('');
    };

    const handleShow = () => setShowModal(true);

    // Gérer le changement d'image avec prévisualisation
    const handleImageChange = (e) => {
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

    // Ajouter un nouveau département
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nomDepartement || !imageDepartement) {
            alert(translations.fillAllFields);
            return;
        }

        setIsLoading(true);

        try {
            // 1. Upload de l'image dans Firebase Storage
            const storageRef = ref(storage, `departements/${nomDepartement}_${Date.now()}`);
            await uploadBytes(storageRef, imageDepartement);

            // 2. Récupération de l'URL de l'image
            const imageUrl = await getDownloadURL(storageRef);

            // 3. Ajout du document dans la collection departement
            await addDoc(collection(db, "departements"), {
                nom: nomDepartement,
                image: imageUrl
            });

            // 4. Recharger les départements et fermer le modal
            await fetchDepartements();
            handleClose();
            alert(translations.success);
        } catch (error) {
            console.error("Erreur lors de l'ajout du département:", error);
            alert(`${translations.error} ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Organiser les départements en rangées de 3
    const departementRows = [];
    let currentRow = [];

    departements.forEach((departement, index) => {
        currentRow.push(
            <div key={departement.id} className="col-md-4 mb-4">
                <DepartementBooksBtn
                    nom_du_departement={departement.nom}
                    myimage={departement.image}
                />
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
                <h1 className="mr-2 text-secondary">{translations.admin}</h1>

                {/* Bouton d'ajout de département responsive */}
                <Button
                    className="d-flex align-items-center shadow custom-primary-btn"
                    style={{ backgroundColor: "#fe7a3f", borderColor: "#fe7a3f", color: "white" }}
                    onClick={handleShow}
                >
                    <FaPlus className="me-2" />
                    <span className="d-none d-sm-inline">{translations.addDepartment}</span>
                    <span className="d-inline d-sm-none">{translations.addDepartmentMobile}</span>
                </Button>
            </div>

            {/* Conteneur principal avec padding adaptatif */}
            <div className="px-2 px-md-4 mt-2">
                {departements.length === 0 ? (
                    <div className="text-center py-5 my-4 bg-light rounded">
                        <p className="text-muted mb-3">{translations.noDepartments}</p>
                        <Button
                            className="custom-primary-btn"
                            style={{ backgroundColor: "#fe7a3f", borderColor: "#fe7a3f", color: "white" }}
                            onClick={handleShow}>
                            <FaPlus className="me-2" /> {translations.createFirstDepartment}
                        </Button>
                    </div>
                ) : (
                    departementRows
                )}
            </div>

            {/* Modal pour créer un nouveau département - optimisé pour mobile */}
            <Modal
                show={showModal}
                onHide={handleClose}
                centered
                backdrop="static"
                size="lg"
                className="department-modal"
            >
                <Modal.Header className="bg-light">
                    <Modal.Title className="fs-4">
                        <FaPlus className="me-2" style={{ color: "#fe7a3f" }} />
                        {translations.createDepartment}
                    </Modal.Title>
                    <Button
                        variant="light"
                        className="btn-close"
                        onClick={handleClose}
                        aria-label="Fermer"
                    />
                </Modal.Header>

                <Modal.Body className="px-4">
                    <Form onSubmit={handleSubmit} id="departementForm">
                        <Row>
                            <Col md={6} className="mb-4">
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
                            </Col>

                            <Col md={6} className="mb-4">
                                <Form.Group controlId="imageDepartement">
                                    <Form.Label className="fw-bold mb-2">{translations.departmentImage}</Form.Label>
                                    <div className="custom-file-upload">
                                        <div className={`upload-zone p-3 rounded text-center ${previewImage ? 'border-custom' : 'border-dashed'}`}
                                             style={{cursor: 'pointer', borderWidth: '2px', borderStyle: previewImage ? 'solid' : 'dashed', borderColor: previewImage ? '#fe7a3f' : '#dee2e6'}}>

                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
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
                            </Col>
                        </Row>

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
                        onClick={handleClose}
                        className="px-4 d-flex align-items-center"
                        disabled={isLoading}
                    >
                        <FaTimes className="me-2" /> {translations.cancel}
                    </Button>
                    <Button
                        type="submit"
                        form="departementForm"
                        className="px-4 d-flex align-items-center shadow-sm custom-primary-btn"
                        style={{ backgroundColor: "#fe7a3f", borderColor: "#fe7a3f", color: "white" }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
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

            {/* Styles CSS personnalisés pour le formulaire responsive */}
            <style jsx>{`
                @media (max-width: 576px) {
                    .modal-dialog.modal-lg {
                        margin: 0.5rem;
                    }
                }

                /* Animation pour l'aperçu d'image */
                .img-preview {
                    transition: all 0.3s ease;
                }

                .img-preview:hover {
                    transform: scale(1.02);
                }

                /* Styles responsifs pour les boutons sur mobile */
                @media (max-width: 768px) {
                    .modal-footer button {
                        padding-left: 1rem !important;
                        padding-right: 1rem !important;
                    }
                }

                .border-dashed {
                    border-style: dashed;
                    border-color: #dee2e6;
                }

                .border-custom {
                    border-color: #fe7a3f;
                }

                .custom-primary-btn:hover {
                    background-color: #e66a2f !important;
                    border-color: #e66a2f !important;
                }

                .custom-primary-btn:focus, .custom-primary-btn:active {
                    background-color: #fe7a3f !important;
                    border-color: #fe7a3f !important;
                    box-shadow: 0 0 0 0.25rem rgba(254, 122, 63, 0.25) !important;
                }
            `}</style>
        </div>
    );
}
