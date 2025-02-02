import React, { useState, useEffect } from 'react';
import { FaBook, FaPlus } from 'react-icons/fa';
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import { useNavigate } from 'react-router-dom';  // Importation de useNavigate
import img1 from '../assets/memoireGI.jpg';
import img2 from '../assets/memoireGC.jpg';
import img3 from '../assets/memoireGele.jpg';
import img4 from '../assets/memoireGtel.jpg';
import img5 from '../assets/memoireGM.jpg';
import img6 from '../assets/Msp.jpg';
import firebase from "../metro.config";
import { Button, Modal, Form } from 'react-bootstrap';
import ReactJsAlert from "reactjs-alert";

export default function AdminMemoriesHome() {
  const [memories, setMemories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(false);
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [name, setName] = useState('');
  const [matricule, setMatricule] = useState('');
  const [theme, setTheme] = useState('');
  const [departement, setDepartement] = useState('');
  const [annee, setAnnee] = useState('');
  const [image, setImage] = useState('');

  const departements = [
    "Génie informatique",
    "Genie Civile",
    "Génie Télécom",
    "Génie électrique",
    "Génie industriel mécanique",
    "Département de MSP",
  ];

  const images = [
    img1, img2, img3, img4, img5, img6
  ];

  const navigate = useNavigate();  // Initialisation de useNavigate

  const departementRows = [];
  let currentRow = [];

  // Récupérer les mémoires depuis Firebase Firestore
  const fetchMemories = () => {
    const ref = firebase.firestore().collection("Memoire");
    ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => items.push(doc.data()));
      setMemories(items);
      console.log("Mémoires récupérées:", items);
    });
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  departements.forEach((departement, index) => {
    currentRow.push(
      <div key={index} className="col-md-4 mb-4">
        <div className="card shadow" style={{ width: '18rem' }}>
          <img src={images[index]} className="card-img-top" alt={departement} />
          <div className="card-body text-center">
            <h5 className="card-title">{departement}</h5>
            <div className="d-flex justify-content-between">
              <button className="btn btn-primary" onClick={() => handleVisualiser(departement)}>
                Visualiser
              </button>
              <button className="btn btn-success" onClick={() => handleAjouter(departement)}>
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

  // Fonction pour filtrer et rediriger vers le composant MemoireParDepartement
  const handleVisualiser = (departement) => {
    console.log("Visualiser le département:", departement);

    // Filtrer les mémoires par département
    const filteredMemories = memories.filter((memoire) => memoire.département === departement);

    // Redirection vers MemoireParDepartement avec les mémoires filtrées en paramètre
    navigate('/memoireParDepartement', { state: { memories: filteredMemories, departement: departement } });
  };

  const handleAjouter = (departement) => {
    console.log("Ajouter un mémoire dans le département:", departement);
    setShowModal(true);
    setDepartement(departement);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const res = async () => {
    await firebase.firestore().collection('Memoire').doc(matricule).set({
      name: name,
      matricule: matricule,
      theme: theme,
      département: departement,
      annee: parseInt(annee),
      etagere: '',
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
    setStatus(true);
    setType("success");
    setTitle("Mémoire ajouté avec succès");
    navigate("/catalogueMemoire", { state: { département: departement } });
  };

  return (
    <div className="content-box">
      <Sidebar />
      <Navbar />
      <div className="d-flex align-items-center justify-content-center mb-4">
        <h1 className="mr-2 text-secondary">Administration des mémoires</h1>
        <FaBook style={{ fontSize: '2rem' }} className='text-dark' />
      </div>
      {departementRows}

      <Modal show={showModal} onHide={handleModalClose} style={{ backgroundColor: 'transparent' }}>
        <Modal.Header closeButton>
          <Modal.Title className='text-center'><h2 className='text-center'>Ajouter Mémoire de {departement}</h2></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3' controlId='formBasicName'>
              <Form.Label className="labelForm">Nom de l'étudiant</Form.Label>
              <Form.Control className="name-input" type="text" placeholder="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required></Form.Control>
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicName'>
              <Form.Label className="labelForm">Département</Form.Label>
              <Form.Control
                type="text"
                name="departement"
                value={departement}
                onChange={(e) => setDepartement(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicNumber'>
              <Form.Label className="labelForm">Matricule de l'étudiant</Form.Label>
              <Form.Control className="name-input" type="text" placeholder="20P123" name="matricule" value={matricule} onChange={(e) => setMatricule(e.target.value)} required></Form.Control>
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicName'>
              <Form.Label className="labelForm">Thème de soutenance</Form.Label>
              <Form.Control className="name-input" type="text" placeholder="Gestion de la bibliothèque" name="theme" value={theme} onChange={(e) => setTheme(e.target.value)} required></Form.Control>
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicName'>
              <Form.Label className="labelForm">Année de soutenance</Form.Label>
              <Form.Control className="name-input" type="number" placeholder="2025" value={annee} onChange={(e) => setAnnee(e.target.value)} name='etagere' required></Form.Control>
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicName'>
              <FaBook style={{ fontSize: '40px', marginRight: '10px', color: "gray", marginBottom: '10px' }} />
              <Form.Label className="labelForm">Entrer le lien de l'image</Form.Label>
              <Form.Control className="image-input" type="text" placeholder="Image" value={image} onChange={(e) => setImage(e.target.value)} name='image' required></Form.Control>
            </Form.Group>
            <ReactJsAlert
              status={status} // true or false
              type={type} // success, warning, error, info
              title={title}
              quotes={true}
              quote=""
              Close={() => setStatus(false)}
            />
            <button type='button' onClick={res} className='btn-btn-primary' style={{ borderRadius: 5, textAlign: 'center', padding: 10, color: 'white', backgroundColor: 'green', alignContent: 'center' }}>Ajouter</button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
