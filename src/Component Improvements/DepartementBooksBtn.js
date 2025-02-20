import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form } from 'react-bootstrap';
import { FaBook, FaPlus } from 'react-icons/fa';
import firebase from '../metro.config';
import ReactJsAlert from "reactjs-alert";
import { v4 as uuidv4 } from 'uuid';
import { useI18n } from "../Context/I18nContext"; // Importez le contexte i18n

export default function DepartementMemoriesBtn(props) {
  const navigate = useNavigate();
  const { nom_du_departement, myimage } = props;
  
  // Contexte i18n
  const { language } = useI18n();

  // Traductions
  const translations = {
    view: language === "FR" ? "Visualiser" : "View",
    add: language === "FR" ? "Ajouter" : "Add",
    add_book: language === "FR" ? `Ajouter un livre de ${nom_du_departement}` : `Add a book from ${nom_du_departement}`,
    book_name: language === "FR" ? "Nom du Livre" : "Book Name",
    department: language === "FR" ? "Département" : "Department",
    number_of_copies: language === "FR" ? "Nombre d'exemplaires" : "Number of Copies",
    shelf: language === "FR" ? "Etagère" : "Shelf",
    description: language === "FR" ? "Description du document" : "Document Description",
    book_image: language === "FR" ? "Image du livre" : "Book Image",
    save: language === "FR" ? "Enregistrement en cours..." : "Saving...",
    add_button: language === "FR" ? "Ajouter" : "Add",
    document_added: language === "FR" ? "Document ajouté avec succès" : "Document added successfully",
    error_upload_image: language === "FR" ? "Veuillez sélectionner une image" : "Please select an image",
    error_saving: language === "FR" ? "Erreur lors de l'enregistrement du document" : "Error saving document",
  };

  // États pour le style et modal
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // États pour le formulaire
  const [name, setName] = useState('');
  const [exemplaire, setExemplaire] = useState(0);
  const [etagere, setEtagere] = useState('');
  const [desc, setDesc] = useState('');
  const [salle] = useState('');
  const [typ] = useState('');
  
  // États pour l'image et le chargement
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // États pour l'alerte
  const [status, setStatus] = useState(false);
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");

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

  const resetForm = () => {
    setName('');
    setExemplaire(0);
    setEtagere('');
    setDesc('');
    setImage(null);
    setImagePreview(null);
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
    
    if (!image) {
      setStatus(true);
      setType("error");
      setTitle(translations.error_upload_image);
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadImage(image);
      
      await firebase.firestore().collection('BiblioInformatique').doc(name).set({
        name: name,
        exemplaire: parseInt(exemplaire),
        etagere: etagere,
        salle: salle,
        image: imageUrl,
        type: typ,
        nomBD: name,
        cathegorie: nom_du_departement,
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
      handleModalClose();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      setStatus(true);
      setType("error");
      setTitle(translations.error_saving);
    } finally {
      setLoading(false);
    }
  };

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
    backgroundColor: isHovered ? '#28a745' : 'success',
    borderColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: '5px',
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

  const bookIconStyle1 = {
    fontSize: '40px',
    marginRight: '10px',
    color: "gray",
    marginBottom: '10px',
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
            <Button variant="primary" onClick={handleVisualiser} style={buttonVisualiserStyle}>
              {translations.view}
            </Button>
            <Button variant="success" onClick={handleAjouter} style={buttonAjouterStyle}>
              <FaPlus style={iconStyle} /> {translations.add}
            </Button>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleModalClose} style={{ backgroundColor: 'transparent' }}>
        <Modal.Header closeButton>
          <Modal.Title className='text-center'>
            <h2 className='text-center'>{translations.add_book}</h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3'>
              <Form.Label className="labelForm">{translations.book_name}</Form.Label>
              <Form.Control
                type="text"
                placeholder={translations.book_name}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label className="labelForm">{translations.department}</Form.Label>
              <Form.Control
                type="text"
                value={nom_du_departement}
                readOnly
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label className="labelForm">{translations.number_of_copies}</Form.Label>
              <Form.Control
                type="number"
                placeholder={translations.number_of_copies}
                value={exemplaire}
                onChange={(e) => setExemplaire(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label className="labelForm">{translations.shelf}</Form.Label>
              <Form.Control
                type="text"
                placeholder={translations.shelf}
                value={etagere}
                onChange={(e) => setEtagere(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label className="labelForm">{translations.description}</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder={translations.description}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <FaBook style={bookIconStyle1} />
              <Form.Label className="labelForm">{translations.book_image}</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              {imagePreview && (
                <div className="mt-2 text-center">
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                </div>
              )}
            </Form.Group>

            <button
              type='submit'
              className='btn btn-success w-100'
              disabled={loading}
            >
              {loading ? translations.save : translations.add_button}
            </button>
          </Form>
        </Modal.Body>
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