import React, { useState, useEffect } from 'react';
import { FaBook } from 'react-icons/fa';
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import { useNavigate } from 'react-router-dom';
import img1 from '../assets/memoireGI.jpg';
import img2 from '../assets/memoireGC.jpg';
import img3 from '../assets/memoireGele.jpg';
import img4 from '../assets/memoireGtel.jpg';
import img5 from '../assets/memoireGM.jpg';
import img6 from '../assets/Msp.jpg';
import firebase from "../metro.config";
import { Button, Modal, Form } from 'react-bootstrap';
import ReactJsAlert from "reactjs-alert";
import { v4 as uuidv4 } from 'uuid';

export default function AdminMemoriesHome() {
  // États pour la liste des mémoires et le modal
  const [memories, setMemories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  // États pour les alertes
  const [status, setStatus] = useState(false);
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  
  // États du formulaire
  const [name, setName] = useState('');
  const [matricule, setMatricule] = useState('');
  const [theme, setTheme] = useState('');
  const [departement, setDepartement] = useState('');
  const [annee, setAnnee] = useState('');
  const [etagere, setEtagere] = useState('');
  
  // États pour la gestion de l'image
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const departements = [
    "Génie informatique",
    "Genie Civile",
    "Génie Télécom",
    "Génie électrique",
    "Génie industriel mécanique",
    "Département de MSP",
  ];

  const images = [img1, img2, img3, img4, img5, img6];

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

  useEffect(() => {
    fetchMemories();
  }, []);

  // Gestion du formulaire et de l'image
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
      const fileRef = storageRef.child(`memoires/${Date.now()}-${file.name}`);
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
      setTitle("Veuillez sélectionner une image");
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadImage(image);
      
      await firebase.firestore().collection('Memoire').doc(matricule).set({
        name,
        matricule,
        theme,
        département: departement,
        annee: parseInt(annee),
        etagere,
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
      handleModalClose();
      ;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      setStatus(true);
      setType("error");
      setTitle("Erreur lors de l'enregistrement du mémoire");
    } finally {
      setLoading(false);
    }
  };

  // Gestion des actions par département
  const handleVisualiser = (departement) => {
    const filteredMemories = memories.filter((memoire) => memoire.département === departement);
    navigate('/memoireParDepartement', { 
      state: { 
        memories: filteredMemories, 
        departement: departement 
      } 
    });
  };

  const handleAjouter = (departement) => {
    setShowModal(true);
    setDepartement(departement);
  };

  // Générer les années
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1971 + 1 }, (_, i) => 1971 + i);

  // Générer les cartes de département
  const departementRows = [];
  let currentRow = [];

  departements.forEach((departement, index) => {
    currentRow.push(
      <div key={index} className="col-md-4 mb-4">
        <div className="card shadow" style={{ width: '18rem' }}>
          <img src={images[index]} className="card-img-top" alt={departement} />
          <div className="card-body text-center">
            <h5 className="card-title">{departement}</h5>
            <div className="d-flex justify-content-between">
              <button className="btn "  style={{ backgroundColor: 'chocolate' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'darkorange'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'chocolate'} 
                     onClick={() => handleVisualiser(departement)}>
                Visualiser
              </button>
              <button className="btn"  style={{ backgroundColor: 'green' }} 
                onMouseEnter={(e) => e.target.style.backgroundColor = 'darkgreen'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'green'} 
                onClick={() => handleAjouter(departement)}>
                Ajouter
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
      <div className="d-flex align-items-center justify-content-center mb-4">
        <h1 className="mr-2 " >Administration des mémoires</h1>
        
      </div>
      {departementRows}

      <Modal show={showModal} onHide={handleModalClose} style={{ backgroundColor: 'transparent' }}>
        <Modal.Header closeButton>
          <Modal.Title className='text-center'>
            <h2 className='text-center'>Ajouter Mémoire de {departement}</h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3'>
              <Form.Label className="labelForm">Nom de l'étudiant</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label className="labelForm">Matricule de l'étudiant</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="20P123" 
                value={matricule} 
                onChange={(e) => setMatricule(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label className="labelForm">Thème de soutenance</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Gestion de la bibliothèque" 
                value={theme} 
                onChange={(e) => setTheme(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label className="labelForm">Année de soutenance</Form.Label>
              <Form.Control
                as="select"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                required
              >
                <option value="">Sélectionnez une année</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label className="labelForm">Étagère</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Étagère" 
                value={etagere} 
                onChange={(e) => setEtagere(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label className="labelForm">Image du mémoire</Form.Label>
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
              {loading ? 'Enregistrement en cours...' : 'Ajouter'}
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