import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form } from 'react-bootstrap';
import { FaBook, FaPlus } from 'react-icons/fa';
import firebase from '../metro.config';
import ReactJsAlert from "reactjs-alert";

export default function DepartementMemoriesBtn(props) {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { nom_du_departement, myimage } = props;
  const [formValues, setFormValues] = useState({
    titre: '',
    nombreExemplaires: 0,
    departement: '',
    etagere: '',
    description: '',
  });

  const [status, setStatus] = useState(false);
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [name, setName] = useState('')
    const [matricule, setMatricule] = useState('')
    const [theme, setTheme] = useState('')
    const [département, setDépartement] = useState('');
    const [annee, setAnnee] = useState('')
    const [etagere] = useState('')
    //const [url, setUrl] = useState(null);
    const [image, setImage] = useState('');
  const res = async function () {
    await firebase.firestore().collection('Memoire').doc(matricule).set({
        name: name,
        matricule: matricule,
        theme: theme,
        département: département,
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
    })
    setStatus(true);
    setType("success");
    setTitle("Mémoire ajouté avec succes");
    navigate("/catalogueMemoire", { state: { département:  nom_du_departement } })

}

  const handleVisualiser = () => {
    // Redirection vers la page catalogue avec le nom du département
    navigate('/catalogueMemoire', { state: { département: nom_du_departement } });
  };

  const handleAjouter = () => {
    setShowModal(true);
    setFormValues({ ...formValues, departement: nom_du_departement });
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Traitez les valeurs du formulaire ici
    console.log(formValues);
    // Réinitialisez les valeurs du formulaire
    setFormValues({
      titre: '',
      nombreExemplaires: 0,
      departement: '',
      etagere: '',
      description: '',
    });
    // Fermez la modal
    setShowModal(false);
  };

  /*const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };*/

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Style du cadre parent
  const parentCardStyle = {
    width: '350px',
    margin: '0 auto', // Centrer horizontalement
    textAlign: 'center',
  };

  const cardStyle = {
    backgroundImage: `url(${myimage})`,
    backgroundSize: 'cover',
    width: '200px',
    height: '200px',
    borderRadius: '50%', // Cadre en cercle
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
    // Centrer horizontalement
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
  };

  const buttonAjouterStyle = {
    width: '80px', // Réduire la largeur du bouton Ajouter
    fontSize: '0.8rem', // Réduire la taille de la police du bouton Ajouter
    backgroundColor: isHovered ? '#28a745' : 'success',
    borderColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: '5px',
  };

  const buttonVisualiserStyle = {
    width: '80px', // Réduire la largeur du bouton Visualiser
    fontSize: '0.8rem', // Réduire la taille de la police du bouton Visualiser
    backgroundColor:'#fe7a3f',
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
    color:"gray",
    marginBottom: '10px',
    
  };

  return (
    <div style={parentCardStyle} className='bg-light'>

    <h4>
      <FaBook style={bookIconStyle} className='text-danger'/> <span className="text-dark">{nom_du_departement}</span>
    </h4>
  
<div
  className="card"
  style={cardStyle}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
>
  
</div>
      <div style={buttonContainerStyle}>
        <Button variant="primary" onClick={handleVisualiser} style={buttonVisualiserStyle}>
          Visualiser
        </Button>
        <Button variant="success" onClick={handleAjouter} style={buttonAjouterStyle}>
          <FaPlus style={iconStyle} /> Ajouter
        </Button>
      </div>

      <Modal show={showModal} onHide={handleModalClose} style={{ backgroundColor: 'transparent' }}>
        <Modal.Header closeButton>
          <Modal.Title className='text-center'><h2 className='text-center'>Ajouter Mémoire de {nom_du_departement}</h2></Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Group className='mb-3' controlId='formBasicName'>
        <Form.Label className="labelForm">Nom de l'etudiant </Form.Label>
                    <Form.Control className="name-input" type="text" placeholder="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required></Form.Control>
                </Form.Group>
          <Form onSubmit={handleFormSubmit}>
          <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Département </Form.Label>
              <Form.Control
                type="text"
                name="departement"
                
                value={nom_du_departement}

                onChange={(e) => setDépartement(e.target.value)}
                required
              />
            </Form.Group>
          <Form.Group className='mb-3' controlId='formBasicNumber'>
                    <Form.Label className="labelForm">Matricule de l'etudiant </Form.Label>
                    <Form.Control className="name-input" type="text" placeholder="20P123" name="matricule" value={matricule} onChange={(e) => setMatricule(e.target.value)} required></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Theme de soutenance</Form.Label>
                    <Form.Control className="name-input" type="text" placeholder="Gestion de la bibliotheque" name="theme" value={theme} onChange={(e) => setTheme(e.target.value)} required></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Année de soutenance</Form.Label>
                    <Form.Control className="name-input" type="number" placeholder="2025" value={annee} onChange={(e) => setAnnee(e.target.value)} name='etagere' required></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicName'>
                    {/*<button type='button' onClick={handleSumit} style={{ borderRadius: 5, textAlign: 'center', padding: 10, color: 'white', backgroundColor: 'grey' }}>Img</button>*/}
                    <FaBook style={bookIconStyle1} />
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
            {/* <button type='button' onClick={res} className='btn-btn-primary' style={{borderRadius:5,textAlign:'center', padding:10,color:'white',backgroundColor:'green'}}>Ajouter</button> */}
            <button type='button' onClick={res} className='btn-btn-primary' style={{ borderRadius: 5, textAlign: 'center', padding: 10, color: 'white', backgroundColor: 'green', alignContent: 'center' }}>Ajouter</button>

       
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}