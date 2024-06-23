import React, { useState, useRef } from "react";
import { Button, Form, Row } from "react-bootstrap";
import ReactJsAlert from "reactjs-alert";
import "./AjoutDoc.css";
import firebase from '../metro.config';
import { storage } from "../firebase-config";
import { ref, uploadBytes, getDownloadURL, getStorage, uploadBytesResumable } from "firebase/storage"
import { v4 } from "uuid"
import Avatar from '@mui/material/Avatar';
import { useNavigate } from "react-router-dom";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import { FaBook } from "react-icons/fa";

export default function AjoutDoc(props) {
    //   const [email, setEmail] = useState('');
    const [name, setName] = useState('')
    const [catégorie, setCatégorie] = useState('')
    const [cathegorie, setCathegorie] = useState('');
    const [desc, setDesc] = useState('')
    const [etagere, setEtagere] = useState('')
    const [exemplaire, setExemplaire] = useState(1)
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

    const bookIconStyle = {
        fontSize: '40px',
        marginRight: '10px',
        color:"gray",
        marginBottom: '10px',
        
      };
    


    // Add a new document in collection "cities" with ID 'LA'
    const res = async function () {
        await firebase.firestore().collection('BiblioInformatique').doc(name).set({
            name: name,
            exemplaire: parseInt(exemplaire),
            etagere: etagere,
            salle: salle,
            image: image,
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
        navigate("/catalogue", { state: { departement: cathegorie } })

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
      const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        padding: '10px',
        fontSize: '20px',
        fontWeight: 'bold',
      };

    return (
        <>
            <Sidebar />
            <Navbar />
            
            <Row style={{display: 'flex',
        justifyContent: 'space-around', marginTop: '35px', marginBottom: '20px'}}>
            <Button  style={buttonVisualiserStyle}>
            Livre
          </Button>
          <Button variant="success"  style={buttonAjouterStyle} onClick={()=>navigate('/ajoutermémoire')}>
           Memoire
          </Button>
          </Row>
            <Form ref={formRef} onSubmit={res} className="rounded p-4 p-sm-3">
                <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Entrer le nom du Livre </Form.Label>
                    <Form.Control className="name-input" type="text" placeholder="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required></Form.Control>
                </Form.Group>
                
                <Form.Group className='mb-3' controlId='formBasicNumber'>
                    <Form.Label className="labelForm">Entrer le nombre d'exemplaire</Form.Label>
                    <Form.Control className="price-input" type="number" placeholder="Nombre d'exemplaires" name="exemplaire" value={exemplaire} onChange={(e) => setExemplaire(e.target.value)} ></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Choisir le département</Form.Label>
                    <Form.Select className="name-input" aria-label="Default select example" type="text" placeholder="departement" name='cathegorie' onChange={(e) => setCathegorie(e.target.value)} required>
                       
                        <option value='Mathematique'>MSP</option>
                        <option value='Genie Informatique'>Genie Informatique</option>
                        <option value="Genie Civile">Genie Civile</option>
                        <option value='Genie Electrique'>Genie Electrique </option>
                        <option value='Genie Mecanique'>Genie Mecanique/Industriel </option>
                        <option value='Genie Telecom'>Genie telecom </option>
                        
                       
                    </Form.Select>
                </Form.Group>

                <Form.Group className='mb-3' controlId='formBasicNumber'>
                    <Form.Label className="labelForm">Entrer le numero de salle</Form.Label>
                    <Form.Select className="name-input" aria-label="Default select example" placeholder="Entrer la salle" name="salle" value={salle} onChange={(e) => setSalle(e.target.value)} required>
                        
                        <option value='1'selected>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Numéro de l'Etagère</Form.Label>
                    <Form.Control className="name-input" type="text" placeholder="Etagère" value={etagere} onChange={(e) => setEtagere(e.target.value)} name='etagere' required></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Entrer la description du document</Form.Label>
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Desciption" value={desc} onChange={(e) => setDesc(e.target.value)} name='desc'></textarea>
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