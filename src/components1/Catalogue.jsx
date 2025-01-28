import React,{useState,useEffect,useContext,useRef, useCallback} from "react";
import styled from "styled-components";
import { cardStyles } from "./ReusableStyles";
import firebase from '../metro.config'
import { UserContext } from "../App";
import Modal from 'react-modal';
import ReactJsAlert from "reactjs-alert";
import { GrFormClose } from "react-icons/gr";
import Pagination from "react-bootstrap/Pagination";

import Loading from "./Loading";

import { useLocation } from 'react-router-dom';

import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';

export default function Catalogue() {
  const location = useLocation();
  //const { state } = location;
  const departement = location.state.departement;
 // const  departement  = state ? state.departement: null;

  //Modal 2
const [modalIsOpens, setIsOpens] = useState(false);

//Alert 

const [status, setStatus] = useState(false);
const [type, setType] = useState("");
const [title, setTitle] = useState("");

function openModal(e) {
    setNomBD(e.nomBD)
    setName(e.name)
    setExemplaire(e.exemplaire)
    setCathegorie(e.cathegorie)
    setEtagere(e.etagere)
    setDesc(e.desc)
    setComment(e.commentaire)
    setIsOpens(true);
    setImage(e.image)
}

function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#000';
}

function closeModal() {
    setIsOpens(false);
}

const customStyles = {
    content: {
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      padding: '10px 50px',
      transform: 'translate(-50%, -50%)',
    },
  };
  const closeStyle = {
      position:"absolute",
      right: '10px',
      left: 'auto',
      cursor:'pointer',
  };
  const formClass = {
    display: "flex",
    flexDirection: "column",  
    gap:"10px",
  };
  const labelForm = {
    fontSize:"20px",  
  };

  const labelInput = {
    borderRadius: "5px",
    border: "1px solid",
    width: "100%",
    height: "30px",  
  };

  let subtitle;
  

  const [name, setName] = useState('')
  const [nomBD, setNomBD] = useState('')
  const [cathegorie, setCathegorie] = useState('')
  const [desc, setDesc] = useState('')
  const [etagere, setEtagere] = useState('')
  const [exemplaire, setExemplaire] = useState(0)
  const [image, setImage] = useState(null)
  const [comment, setComment] = useState(null)
 // const [pdf, setPdf] = useState(null)
  //const [url, setUrl] = useState(null)
  const [salle, setSalle] = useState('')
const formRef = useRef()
  //fin modal 2
  
  const {searchWord} = useContext(UserContext)



    //debut firebase

    const ref = firebase.firestore().collection("BiblioInformatique")

    const [data,setData]=useState([])
    const [loader,setLoader] = useState(false)
 
 
   
    const getData= useCallback(() =>{
     ref.where('cathegorie', '==', departement).onSnapshot((querySnapshot) => {
       const items = []
       querySnapshot.forEach((doc) => {
         items.push(doc.data())
         setLoader(true)
       })
       setData(items)
       
       
     });
    },[ref, departement]);

    

    
   
    useEffect(() =>{
     getData()
   //  console.log('listDocModal',search)
    },[getData])
   //firebase fin
   

   // Add a new document in collection "cities" with ID 'LA'
const  resUdapte = async function(){
  await firebase.firestore().collection('BiblioInformatique').doc(nomBD).set({
     name: name,
     exemplaire:parseInt(exemplaire) ,
     etagere:etagere,
     salle:salle,
    // image:url,
     cathegorie:cathegorie,
     desc:desc,
     image:image,
     nomBD:nomBD,
     commentaire:comment
  })
  setStatus(true);
  setType("success");
  setTitle("Document ajouté avec succès");
  setIsOpens(false);

 }





//fin addData


//delete
const  deleteDoc = async function(){
  await firebase.firestore().collection('BiblioInformatique').doc(nomBD).delete()
  setIsOpens(false);

}



  return (
  <div className="content-box">
    <Sidebar />
    <Navbar />
    <h1 style={{textAlign: 'center', color: 'gray', marginTop:'10px', marginBottom:'20px' }}>Liste des Livres du {departement}</h1>
    <Section>
    
      {loader ? ( data.map((doc, index) =>{
       if(doc.name.toUpperCase().includes(searchWord.toUpperCase())){
        return(
                <div className="analytic " key={index}>
                  <div className="content" onClick={()=>openModal(doc)}>
                    <h3>{doc.name}</h3>
                    <h6>Departement : {doc.cathegorie}</h6>
                    <h6>Exemplaire disponible: {doc.exemplaire}</h6>
                  </div>
                  <div className="logo">
                  <a href={doc.image}>
                    <img src={doc.image} alt="logo" />
                  </a> 
                  </div>
                </div>
         )}
          return null; }) ) :<Loading />    }
          <div>
                <Modal
                    isOpen={modalIsOpens}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                  <button onClick={closeModal} style={closeStyle}><GrFormClose /></button>
                    <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Modifier le document</h2>
                    
                    <form ref={formRef}  style={formClass}>
          
                <label className="labelForm" style={labelForm} htmlFor="name">Entrer le nouveau nom</label>
                <input style={labelInput} id="name" type="text" placeholder={name} name="name" value={name} onChange = {(e) => setName(e.target.value)} />
                <label className="labelForm" style={labelForm} htmlFor="exemp">Entrer le nouveau nombre d'exemplaire</label>
                <input style={labelInput} id="exemp" type="text" placeholder="Nouveau nombre exemplaire..." name="exemplaire" value={exemplaire}  onChange={(e) => setExemplaire(e.target.value)} />
                <label className="labelForm" style={labelForm} htmlFor="class">Entrer la nouvelle matière</label>
                <select style={labelInput} id="class" type="text" placeholder="Nouvelle catégorie..." name='cathegorie' value={cathegorie} onChange={(e) => setCathegorie(e.target.value)} >
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
                    <option value='Memoire GELE '>Memoire Génie Electrique </option>
                    <option value='Memoire GET'>Memoire Génie Telecom </option>
                    <option value='Memoire GIndus'>Memoire Génie Industriel </option>
                    <option value='Memoire GM'>Memoire Génie Mecanique </option>
                </select>
                <label className="labelForm" style={labelForm} htmlFor="salle">Entrer son nouveau numero de salle</label>
                <select style={labelInput} id="salle" type="text" placeholder="Nouvelle salle..." name="salle" value={salle}  onChange={(e) => setSalle(e.target.value)}>
                    <option value=''></option>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                </select>
                <label className="labelForm" style={labelForm} htmlFor="etagere">Entrer la position de l'étagere</label>
                <input style={labelInput} id="etagere" type="text" placeholder="Nouvelle etagère..." name="etagere" value={etagere} onChange = {(e) => setEtagere(e.target.value)} /> 
                <label className="labelForm" style={labelForm} htmlFor="desc">Entrer la nouvelle description</label>
                <textarea style={labelInput} id="etagere" type="desc" placeholder="Nouvelle description..." name="description" value={desc} onChange = {(e) => setDesc(e.target.value)} />       
                <ReactJsAlert
                    status={status} // true or false
                    type={type} // success, warning, error, info
                    title={title}
                    quotes={true}
                    quote=""
                    Close={() => setStatus(false)}
                />
                 <div className="btn-sub" style={{display:'flex', gap:'160px'}}> 
            <button type='button'onClick={resUdapte} className='btn-btn-primary' style={{display:'flex',borderRadius:5,textAlign:'center', padding:10,color:'white',background:'green',width:100}}>Modifier</button>
            <button type='button'onClick={deleteDoc} className='btn-btn-primary' style={{display:'flex',borderRadius:5,textAlign:'center', padding:10,color:'white',background:'red',width:100}}>supprimer</button>
            </div>
        </form>
                </Modal>
            </div>
            <Pagination className="pagination justify-content-center">
     <Pagination.Prev />
     <Pagination.Item>{1}</Pagination.Item>

     <Pagination.Item>{2}</Pagination.Item>
     <Pagination.Item>{3}</Pagination.Item>
     <Pagination.Item>{4}</Pagination.Item>
     <Pagination.Item>{5}</Pagination.Item>
     <Pagination.Item>{6}</Pagination.Item>

     <Pagination.Item>{7}</Pagination.Item>
     <Pagination.Next />
 </Pagination>
    </Section>
    </div>
  );
}
const Section = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  background-color:#ececec;
  overflow-x:auto;
  .analytic {
    ${cardStyles};
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: start;
    background-color: #fff;
    color: grey;
    gap: 1rem;
    transition: 0.5s ease-in-out;
    &:hover {
      background-color: #fff;
      color: grey;
      transform: scale(1.03);
    }
    .content{cursor:pointer;}
    .logo img{
      background-color: black;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 100px;
    }
  }
  @media screen and (min-width: 280px) and (max-width: 720px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    .analytic {
      &:nth-of-type(3),
      &:nth-of-type(4) {
        flex-direction: row-reverse;
      }
    }
  }
`;