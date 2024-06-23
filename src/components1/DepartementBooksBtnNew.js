
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form } from 'react-bootstrap';
import { FaBook, FaPlus } from 'react-icons/fa';
import img1 from '../assets/img1.jpg';
import firebase from '../metro.config';
import { storage } from "../firebase-config";
import { ref, uploadBytes, getDownloadURL, getStorage, uploadBytesResumable } from "firebase/storage"
import { v4 } from "uuid"
const [name, setName] = useState('')
    const [catégorie, setCatégorie] = useState('')
    const [cathegorie, setCathegorie] = useState('');
    const [desc, setDesc] = useState('')
    const [etagere, setEtagere] = useState('')
    const [exemplaire, setExemplaire] = useState(0)
    const [image, setImage] = useState(null)
    const [pdf, setPdf] = useState(null)
    const [url, setUrl] = useState(null)
    const [salle, setSalle] = useState('')
    const [typ, setTyp] = useState('')
    const formRef = useRef()

export default function DepartementMemoriesBtn(props) {
  const navigate = useNavigate();
  const { nom_du_departement } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState({
    titre: '',
    nombreExemplaires: 0,
    departement: '',
    etagere: '',
    description: '',
  });

  const handleVisualiser = () => {
    // Redirection vers la page catalogue avec le nom du département
    navigate('/catalogue', { state: { departement: nom_du_departement } });
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const  resUdapte = async function(){
    await firebase.firestore().collection('BiblioInformatique').doc(nomBD).set({
       name: null,
       exemplaire:null ,
       etagere:null,
    
      // image:url,
       cathegorie:null,
       desc:null,
       image:null,
       
    })
    
  
   }

  const cardStyle = {
    backgroundImage: `url(${img1})`,
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
    margin: '0 auto', // Centrer horizontalement
    borderradius:'45px',
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
    backgroundColor: isHovered ? 'blue' : 'primary', // Couleur bleue pour le bouton "Visualiser"
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
    <div
      className="card"
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-body">
        <div style={buttonContainerStyle}>
          <Button variant="primary" onClick={handleVisualiser} style={buttonVisualiserStyle}>
            Visualiser
          </Button>
          <Button variant="success" onClick={handleAjouter} style={buttonAjouterStyle}>
            <FaPlus style={iconStyle} /> Ajouter
          </Button>
        </div>
        <h4>
          <FaBook style={bookIconStyle} /> <span className="text-dark">{nom_du_departement}</span>
        </h4>
      </div>
      <Modal show={showModal} onHide={handleModalClose} style={{ backgroundColor: 'transparent' }}>
        <Modal.Header closeButton>
          <Modal.Title className='text-center'><h2 className='text-center'>Ajouter un livre</h2></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formTitre">
              <Form.Label>Titre</Form.Label>
              <Form.Control
                type="text"
                name="titre"
                value={formValues.titre}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formNombreExemplaires">
              <Form.Label>Nombre d'exemplaires</Form.Label>
              <Form.Control
                type="number"
                name="nombreExemplaires"
                value={formValues.nombreExemplaires}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formDepartement">
              <Form.Label>Département</Form.Label>
              <Form.Control
                type="text"
                name="departement"
                value={formValues.departement}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formEtagere">
              <Form.Label>Étagère</Form.Label>
              <Form.Control
                type="text"
                name="etagere"
                value={formValues.etagere}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <button type='button'onClick={resUdapte} className='btn-btn-primary' style={{display:'flex',borderRadius:5,textAlign:'center', padding:10,color:'white',background:'green',width:100}}>Modifier</button>
            
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}




























import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form } from 'react-bootstrap';
import { FaBook, FaPlus } from 'react-icons/fa';
//import img1 from '../assets/img1.jpg';
import firebase from '../metro.config';
import { storage } from "../firebase-config";
import { ref, uploadBytes, getDownloadURL, getStorage, uploadBytesResumable } from "firebase/storage"
import { v4 } from "uuid"
import Avatar from '@mui/material/Avatar';
import ReactJsAlert from "reactjs-alert";



export default function DepartementBooksBtn(props) {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { nom_du_departement, myimage} = props ;
  
  const handleVisualiser = () => {
    // Redirection vers la page catalogue avec le nom du département
    navigate('/catalogue', { state: { departement: nom_du_departement } });
  };

  const handleAjouter = () => {
    setShowModal(true);
    setFormValues({ ...formValues, departement: nom_du_departement });
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const [formValues, setFormValues] = useState({
    titre: '',
    nombreExemplaires: 0,
    departement: '',
    etagere: '',
    description: '',
  });

  



  ///////////////////////////////////////////////////////////////

  const [name, setName] = useState('')
  const [catégorie, setCatégorie] = useState('')
  const [cathegorie, setCathegorie] = useState('');
  const [desc, setDesc] = useState('')
  const [etagere, setEtagere] = useState('')
  const [exemplaire, setExemplaire] = useState(0)
  const [image, setImage] = useState(null)
  const [pdf, setPdf] = useState(null)
  const [url, setUrl] = useState(null)
  const [salle, setSalle] = useState('')
  const [typ, setTyp] = useState('')
  const formRef = useRef()

  const handleChangeImage = (e) => {
      if (e.target.files[0]) {
          setImage(e.target.files[0])
          handleSumit()
      }
  }

  const handleSumit = (e) => {

      const imageRef = ref(storage, `images/${image.name + v4()}`)
      const pdfRef = ref(storage, `files/${image.name}`)

      uploadBytes(imageRef, image).then(() => {
          getDownloadURL(imageRef).then((url) => {
              setUrl(url)
          })
              .catch((error) => {
                  console.log(error.message, "error getting the image url")
              })
          setImage(null)
      }).catch((error) => {
          console.log(error.message)
      })

  }

  const navigate = useNavigate();




  // Add a new document in collection "cities" with ID 'LA'
  const res = async function () {
      await firebase.firestore().collection('BiblioInformatique').doc(name).set({
          name: name,
          exemplaire: parseInt(exemplaire),
          etagere: etagere,
          salle: salle,
          image: url,
          type: typ,
          nomBD: name,
          cathegorie: cathegorie,
          desc: desc,
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
      setTitle("Document ajouté avec succes");

  }





  //fin addData



  //debut formulaire

  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;


      setInputs(values => ({ ...values, [name]: value }))
  }




  //fin formulaire

  const [validation, setValidation] = useState("")



  //Alert 

  const [status, setStatus] = useState(false);
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");

  //fin   Alert




  //ajouter
  function ajouter() {
      const ref = firebase.firestore().collection("BiblioInformatique")

      ref
          .doc('anna')
          .set({ name: inputs.name, exemplaires: inputs.exemplaire, cathegorie: inputs.cathegorie, salle: inputs.salle, etagere: inputs.etagere, description: inputs.desc, image: inputs.image })
          .catch((err) => {
              console.log(err)
          })

      console.log("ajouter", inputs)
  }
  
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
    margin: '0 auto', // Centrer horizontalement
    borderradius:'45px',
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
    color: 'red'
  };

  return (
  <div className="border border-dadius border-solid-2 p-2 bg-light">
    <h4 className="text-center">
      <FaBook style={bookIconStyle} /> <span className="text-dark">{nom_du_departement}</span>
    </h4>
    
    <div
      className="card"
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-body">
        <div style={buttonContainerStyle}>
          <Button variant="primary" onClick={handleVisualiser} style={buttonVisualiserStyle}>
            Visualiser
          </Button>
          <Button variant="success" onClick={handleAjouter} style={buttonAjouterStyle}>
            <FaPlus style={iconStyle} /> Ajouter
          </Button>
        </div>
      </div>
      <Modal show={showModal} onHide={handleModalClose} style={{ backgroundColor: 'transparent' }}>
        <Modal.Header closeButton>
          <Modal.Title className='text-center'><h2 className='text-center'>Ajouter un livre</h2></Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form ref={formRef} onSubmit={res} className="rounded p-4 p-sm-3">
                <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Entrer le nom du document</Form.Label>
                    <Form.Control className="name-input" type="text" placeholder="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Entrez la catégorie</Form.Label>
                    <Form.Select className="name-input" aria-label="Default select example" type="text" name='catégorie' onChange={(e) => setCatégorie(e.target.value)} required>
                        <option value='Mémoire'>Mémoire</option>
                        <option value='Livre' selected>Livre</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicNumber'>
                    <Form.Label className="labelForm">Entrer le nombre d'exemplaire</Form.Label>
                    <Form.Control className="price-input" type="number" placeholder="Nombre d'exemplaires" name="exemplaire" value={exemplaire} onChange={(e) => setExemplaire(e.target.value)} ></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Entrer la matière</Form.Label>
                    <Form.Select className="name-input" aria-label="Default select example" type="text" name='cathegorie' onChange={(e) => setCathegorie(e.target.value)} required>
                        <option value=''></option>
                        <option value='Mathematique'>Mathematique</option>
                        <option value='Physique'>Physique</option>
                        <option value='Chimie'>Chimie</option>
                        <option value='Génie Informatique'>Génie Informatique</option>
                        <option value="Génie Civile">Génie Civile</option>
                        <option value='Génie Electrique'>Génie Electrique </option>
                        <option value='Génie Mecanique'>Génie Mecanique </option>
                        <option value='Génie Telecom'>Génie telecom </option>
                        <option value='Génie Electrique'>Génie electrique </option>
                        <option value='Memoire GI'>Memoire Génie Informatique </option>
                        <option value='Memoire GC'>Memoire Génie Civile </option>
                        <option value='Memoire GEle '>Memoire Génie Electrique </option>
                        <option value='Memoire GTel'>Memoire Génie Telecom </option>
                        <option value='Memoire GInd'>Memoire Génie Industriel </option>
                        <option value='Memoire GM'>Memoire Génie Mecanique </option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Entrez le genre</Form.Label>
                    <Form.Select className="name-input" aria-label="Default select example" type="text" name='cathegorie' onChange={(e) => setTyp(e.target.value)} required>
                        <option value=''></option>
                        <option value='IA'>IA</option>
                        <option value='reseau'>Reseau</option>
                        <option value='BTP'>BTP</option>
                        <option value='gim'>gim</option>
                        <option value="electricite">electricite</option>
                        <option value='algebre'>algebre</option>
                        <option value='securité'>securité</option>

                    </Form.Select>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicNumber'>
                    <Form.Label className="labelForm">Entrer le numero de salle</Form.Label>
                    <Form.Select className="name-input" aria-label="Default select example" placeholder="Entrer la salle" name="salle" value={salle} onChange={(e) => setSalle(e.target.value)} required>
                        <option value=''></option>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Etagère</Form.Label>
                    <Form.Control className="name-input" type="text" placeholder="Etagère" value={etagere} onChange={(e) => setEtagere(e.target.value)} name='etagere' required></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Entrer la description du document</Form.Label>
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Desciption" value={desc} onChange={(e) => setDesc(e.target.value)} name='desc'></textarea>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicName'>
                    <button type='button' onClick={handleSumit} style={{ borderRadius: 5, textAlign: 'center', padding: 10, color: 'white', backgroundColor: 'grey' }}>Img</button>
                    <Avatar src={url} sx={{ width: 150, height: 150 }} />
                    <Form.Label className="labelForm">Entrer le lien de l'image</Form.Label>
                    <Form.Control className="image-input" type="file" placeholder="Image" onChange={handleChangeImage} name='image' required></Form.Control>
                </Form.Group>
                <ReactJsAlert
                    status={status} // true or false
                    type={type} // success, warning, error, info
                    title={title}
                    quotes={true}
                    quote=""
                    Close={() => setStatus(false)}
                />
                {/* <button type='button' onClick={res} className='btn-btn-primary' style={{borderRadius:5,textAlign:'center', padding:10,color:'white',backgroundColor:'red'}}>Ajouter</button> */}
                <button type='button' onClick={() => navigate("/catalogue")} className='btn-btn-primary' style={{ borderRadius: 5, textAlign: 'center', padding: 10, color: 'white', backgroundColor: 'green' }}>Ajouter</button>


            </Form>
        </Modal.Body>
      </Modal>
    </div>
    </div>   
  );
}