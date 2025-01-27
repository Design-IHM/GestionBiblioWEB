import React, { useState, useRef } from "react";
import { Form } from "react-bootstrap";
import ReactJsAlert from "reactjs-alert";
import "../components1/AjoutDoc.css";
import firebase from '../metro.config';
import { storage } from "../firebase-config";
import { ref, uploadBytes, getDownloadURL} from "firebase/storage"
import { v4 } from "uuid"
import Avatar from '@mui/material/Avatar';
import { useNavigate } from "react-router-dom";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import "./profil.css"

export default function Profil(props) {
    //   const [email, setEmail] = useState('');
    const [name, setName] = useState('')
   // const [catégorie, setCatégorie] = useState('')
    const [cathegorie] = useState('');
    const [desc, setDesc] = useState('')
    const [etagere] = useState('')
    const [Email, setEmail] = useState("")
    const [image, setImage] = useState(null)
    //const [pdf, setPdf] = useState(null)
    const [url, setUrl] = useState(null)
    const [salle] = useState('')
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

    }

    const navigate = useNavigate();




    // Add a new document in collection "cities" with ID 'LA'
    const res = async function () {
        await firebase.firestore().collection('BiblioInformatique').doc(name).set({
            name: name,
            Email: (Email),
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

    //const [inputs, setInputs] = useState({});

   /* const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;


        setInputs(values => ({ ...values, [name]: value }))
    }*/




    //fin formulaire

    //const [validation, setValidation] = useState("")



    //Alert 

    const [status, setStatus] = useState(false);
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");

    //fin   Alert




    //ajouter
   /* function ajouter() {
        const ref = firebase.firestore().collection("BiblioInformatique")

        ref
            .doc('anna')
            .set({ name: inputs.name, Emails: inputs.Email, cathegorie: inputs.cathegorie, salle: inputs.salle, etagere: inputs.etagere, description: inputs.desc, image: inputs.image })
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

    return (
        <>
            <Sidebar />
            <Navbar />
            <Form ref={formRef} onSubmit={res} className="rounded p-4 p-sm-3">

                <Form.Group className='mb-3' controlId='formBasicName'>
                    <button type='button' onClick={handleSumit} style={{ borderRadius: 5, textAlign: 'center', margin: 10, padding: 10, color: 'white', backgroundColor: 'grey' }}>Photo de profil</button>
                    <Avatar style={{ marginTop: 10, marginBottom: 10 }} src={url} sx={{ width: 150, height: 150 }} />
                    <Form.Label className="labelForm">Sélection de la photo :</Form.Label>
                    <Form.Control className="image-input" type="file" placeholder="Image" onChange={handleChangeImage} name='image' required></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Entrer votre nom :</Form.Label>
                    <Form.Control className="name-input" type="text" placeholder="eg :Jason Derulo" name="name" value={name} onChange={(e) => setName(e.target.value)} required></Form.Control>
                </Form.Group>

                <Form.Group className='mb-3' controlId='formBasicNumber'>
                    <Form.Label className="labelForm">Entrer votre adresse e-mail:</Form.Label>
                    <Form.Control className="price-input" type="e-mail" placeholder=" eg: mbengivan63@gmail.com" name="Email" value={Email} onChange={(e) => setEmail(e.target.value)} ></Form.Control>
                </Form.Group>


                <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Entrez le genre: <i>(homme/femme)</i></Form.Label>
                    <Form.Select className="name-input" aria-label="Default select example" type="text" name='cathegorie' onChange={(e) => setTyp(e.target.value)} required>
                        <option value='Homme'>Homme</option>
                        <option value='Femme'>Femme</option>
                    </Form.Select>
                </Form.Group>


                <Form.Group className='mb-3' controlId='formBasicName'>
                    <Form.Label className="labelForm">Entrer une brève description de vous même:</Form.Label>
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Desciption" value={desc} onChange={(e) => setDesc(e.target.value)} name='desc'></textarea>
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
                <button type='button' onClick={() => navigate("/")} className='btn-btn-primary' style={{ borderRadius: 5, textAlign: 'center', padding: 10, color: 'white', backgroundColor: 'green' }}>Valider</button>


            </Form>
        </>
    )
}