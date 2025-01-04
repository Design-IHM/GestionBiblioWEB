import React, { useState, useRef } from "react";
import { Button, Form, Row } from "react-bootstrap";
import ReactJsAlert from "reactjs-alert";
import "./AjoutDoc.css";
import firebase from '../metro.config';
import { useNavigate } from "react-router-dom";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import { FaBook } from "react-icons/fa";

export default function Ajoutermémoirec () {
    //   const [email, setEmail] = useState('');
    const [name, setName] = useState('')
    const [matricule, setMatricule] = useState('')
    const [theme, setTheme] = useState('')
    const [département, setDépartement] = useState('');
    const [annee, setAnnee] = useState('')
    const [etagere, setEtagere] = useState('')
    //const [setUrl] = useState(null);
    const [image, setImage] = useState('');

    const formRef = useRef()

   /* const handleChangeImage = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
            handleSumit()
        }
    }*/

    /*const handleSumit = (e) => {

        const imageRef = ref(storage, `images/${image.name + v4()}`)
       // const pdfRef = ref(storage, `files/${image.name}`)

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

    const navigate = useNavigate();




    // Add a new document in collection "cities" with ID 'LA'
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
        navigate("/catalogueMemoire", { state: { département: département } })

    }





    //fin addData



    //debut formulaire

   // const [inputs, setInputs] = useState({});

    /*const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;


        setInputs(values => ({ ...values, [name]: value }))
    }*/


    
    const bookIconStyle = {
        fontSize: '40px',
        marginRight: '10px',
        color:"gray",
        marginBottom: '10px',
        
      };
    


    //fin formulaire

    //const [validation, setValidation] = useState("")



    //Alert 

    const [status, setStatus] = useState(false);
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");

    //fin   Alert




    //ajouter
    /*function ajouter() {
        const ref = firebase.firestore().collection("Memoire")

        ref
            .doc('anna')
            .set({ name: inputs.name, matricule: inputs.matricule, département: inputs.département, etagere: inputs.etagere, annee: inputs.annee, theme: inputs.theme,  image: inputs.image})
            .catch((err) => {
                console.log(err)
            })

        console.log("ajouter", inputs)
    }*/

    /*const [imageUpload, setImageUpload] = useState(null)
  
    const uploadImage=()=>{
      if (imageUpload = null) return;
      const imageRef = ref(storage,`images/${imageUpload.name + v4()}`)
      uploadBytes(imageRef, imageUpload).then(()=>{
          alert("Image uploader")
      })
    }*/

    const buttonAjouterStyle = {
        width: '120px',
        backgroundColor:  '#28a745' ,
        borderColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '5px',
       height: '50px',
       fontSize: '20px',
        fontWeight: 'bold',
      };
    
      const buttonVisualiserStyle = {
        width: '120px',
        backgroundColor: '#fe7a3f', // Couleur bleue pour le bouton "Visualiser"
        borderColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '5px',
        height: '50px',
        fontSize: '20px',
        fontWeight: 'bold',
        
    
      };
      /*const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        padding: '10px',
        fontSize: '20px',
        fontWeight: 'bold',
      };*/

    return (
        <>
            <Sidebar />
            <Navbar />
            
            <Row style={{display: 'flex',
        justifyContent: 'space-around', marginTop: '35px', marginBottom: '20px'}}>
            <Button  style={buttonVisualiserStyle} onClick={()=>navigate('/ajouterDoc')}>
            Livre
          </Button>
          <Button variant="success"  style={buttonAjouterStyle} >
           Memoire
          </Button>
          </Row>
            <Form ref={formRef} onSubmit={res} className="rounded p-4 p-sm-3">
                <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Nom de l'etudiant </Form.Label>
                    <Form.Control className="name-input" type="text" placeholder="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required></Form.Control>
                </Form.Group>
                
                <Form.Group className='mb-3' controlId='formBasicNumber'>
                    <Form.Label className="labelForm"> Matricule de l'etudiant </Form.Label>
                    <Form.Control className="name-input" type="text" placeholder="20P123" name="matricule" value={matricule} onChange={(e) => setMatricule(e.target.value)} required></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Theme de soutenance </Form.Label>
                    <Form.Control className="name-input" type="text" placeholder="Gestion de la bibliotheque" name="theme" value={theme} onChange={(e) => setTheme(e.target.value)} required></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Entrer le département</Form.Label>
                    <Form.Select className="name-input" aria-label="Default select example"  placeholder="Genie informatique" type="text" name='département' onChange={(e) => setDépartement(e.target.value)} required>
                       
                        <option value='Genie Informatique' >Genie Informatique</option>
                        <option value="Genie Civile">Genie Civile</option>
                        <option value='Genie Electrique'>Genie Electrique </option>
                        <option value='Genie Mecanique'>Genie Mecanique/Industriel </option>
                        <option value='Genie Telecom'>Génie Telecom </option>
                        
                       
                    </Form.Select>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Année de soutenance</Form.Label>
                    <Form.Control className="name-input" type="number" placeholder="2025" value={annee} onChange={(e) => setAnnee(e.target.value)} name='etagere' required></Form.Control>
                </Form.Group>
               
                <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Numéro de l'Etagère</Form.Label>
                    <Form.Control className="name-input" type="text" placeholder="Etagère" value={etagere} onChange={(e) => setEtagere(e.target.value)} name='etagere' required></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicName'>
                    
                    <FaBook style={bookIconStyle} />
                    <Form.Label className="labelForm">Entrer le lien de l'image</Form.Label>
                    <Form.Control className="image-input" type="text" placeholder="Image" value={image} onChange={(e) => setImage(e.target.value)} name='image'></Form.Control>
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
                <button type='button' onClick={res} className='btn-btn-primary' style={{ borderRadius: 5, textAlign: 'center', padding: 10, color: 'white', backgroundColor: 'green' }}>Ajouter</button>


            </Form>
        </>
    )
}