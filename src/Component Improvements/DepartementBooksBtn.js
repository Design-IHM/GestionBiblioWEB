
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form } from 'react-bootstrap';
import { FaBook, FaPlus } from 'react-icons/fa';
import firebase from '../metro.config';
import ReactJsAlert from "reactjs-alert";

export default function DepartementMemoriesBtn(props) {
  const navigate = useNavigate();
  const { nom_du_departement, myimage} = props ;
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState({
    titre: '',
    nombreExemplaires: 0,
    departement: nom_du_departement,
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
      departement: nom_du_departement,
      etagere: '',
      description: '',
    });
    // Fermez la modal
    setShowModal(false);
  };

  //const handleInputChange = (event) => {
    //const { name, value } = event.target;
    //setFormValues({ ...formValues, [name]: value });
  //};

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const [name, setName] = useState('')
  //const [catégorie, setCatégorie] = useState('')
  const [setCathegorie] = useState('');
  const [desc, setDesc] = useState('')
  const [etagere, setEtagere] = useState('')
  const [exemplaire, setExemplaire] = useState(0)
  const [image, setImage] = useState(null)
 // const [pdf, setPdf] = useState(null)
  //const [setUrl] = useState(null)
  const [salle] = useState('')
  const [typ] = useState('')
  //const formRef = useRef()

 /* const handleChangeImage = (e) => {
      if (e.target.files[0]) {
          setImage(e.target.files[0])
          handleSumit()
      }
  }*/

  /*const handleSumit = (e) => {

      const imageRef = ref(storage, `images/${image.name + v4()}`)
      //const pdfRef = ref(storage, `files/${image.name}`)

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

  }*/

 
  
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
    backgroundColor: '#fe7a3f', // Couleur bleue pour le bouton "Visualiser"
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
  
  //const [setInputs] = useState({});

  /*const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;


      setInputs(values => ({ ...values, [name]: value }))
  }*/

  const [status, setStatus] = useState(false);
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");

  /*function ajouter() {
    const ref = firebase.firestore().collection("BiblioInformatique")

    ref
        .doc('anna')
        .set({ name: inputs.name, exemplaires: inputs.exemplaire, cathegorie: inputs.cathegorie, salle: inputs.salle, etagere: inputs.etagere, description: inputs.desc, image: inputs.image })
        .catch((err) => {
            console.log(err)
        })

    console.log("ajouter", inputs)
}*/

const res = async function () {
  await firebase.firestore().collection('BiblioInformatique').doc(name).set({
      name: name,
      exemplaire: parseInt(exemplaire),
      etagere: etagere,
      salle: salle,
      image: image,
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
  })
  setStatus(true);
  setType("success");
  setTitle("Document ajouté avec succes");
  navigate("/catalogue", { state: { departement: nom_du_departement } });
}


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
          <Modal.Title className='text-center'><h2 className='text-center'>Ajouter un livre de {nom_du_departement}</h2></Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Nom du Livre</Form.Label>
                    <Form.Control className="name-input" type="text" placeholder="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required></Form.Control>
                </Form.Group>
          <Form onSubmit={handleFormSubmit}>
          <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Département </Form.Label>
              <Form.Control
                type="text"
                name="departement"
                
                value={nom_du_departement}

                onChange={(e) => setCathegorie(e.target.value)}
                required
              />
            </Form.Group>
          <Form.Group className='mb-3' controlId='formBasicNumber'>
                    <Form.Label className="labelForm">Nombre d'exemplaires </Form.Label>
                    <Form.Control className="price-input" type="number" placeholder="Nombre d'exemplaires" name="exemplaire" value={exemplaire} onChange={(e) => setExemplaire(e.target.value)} ></Form.Control>
                </Form.Group> 
                <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Etagère</Form.Label>
                    <Form.Control className="name-input" type="text" placeholder="Etagère" value={etagere} onChange={(e) => setEtagere(e.target.value)} name='etagere' required></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Description du document</Form.Label>
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="2" placeholder="Desciption" value={desc} onChange={(e) => setDesc(e.target.value)} name='desc'></textarea>
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
    </div>
   
  );
}