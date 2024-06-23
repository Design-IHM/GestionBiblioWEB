import React,{useState,useEffect,useContext, useRef} from "react";
import styled from "styled-components";
import firebase from '../metro.config'
import { UserContext } from "../App";
import Modal from 'react-modal';
import ReactJsAlert from "reactjs-alert";
import { GrFormClose } from "react-icons/gr";
import {Table, Button} from 'react-bootstrap';
import Loading from "./Loading";

import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';


export default function ListeEtudiants() {


  const {searchWord} = useContext(UserContext)




     //debut firebase

     const ref = firebase.firestore().collection("BiblioUser")

     const [data,setData]=useState([])
     const [loader,setLoader] = useState(false)

     //modal
     const [modalIsOpens, setIsOpens] = useState(false);

     function afterOpenModal() {
      // references are now sync'd and can be accessed.
      subtitle.style.color = '#000';
  }
  
  function closeModal() {
      setIsOpens(false);
  }

  function openModal(e) {
    setName(e.name)
    setNiveau(e.niveau)
    setMatricule(e.matricule)
    setTel(e.tel)
    setIsOpens(true);
    setImage(e.image)
    setStat(e.etat)
    setEmail(e.email)
}

const [name, setName] = useState('')
const [niveau, setNiveau] = useState('')
const [matricule, setMatricule] = useState('')
const [tel, setTel] = useState('')
const [image, setImage] = useState('')
const [stat, setStat] = useState('')
const [email, setEmail] = useState('')
  
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

    const modalDiv = {
        display:'flex',
        alignItems:'center',
        gap:'2rem'
    };

    const imgP = {
      display: 'block',
      width: '300px',
      height: '300px',
      borderRadius: '50px'
    };

    const infor = {
      display: 'flex',
      flexDirection: 'column',
      color:'black',
      gap:'30px',
      fontSize:'30px'
    }
  
    let subtitle;
  
    
     function getData(){
      ref.onSnapshot((querySnapshot) => {
        const items = []
        querySnapshot.forEach((doc) => {
          items.push(doc.data())
          setLoader(true)
        })
        setData(items)
        
      })
     }
    
     useEffect(() =>{
      getData()
  //    console.log('mes dataaaaaaa aaaaaaaa dans Ccformationnnn',data)
     },[])

      //update
 function updates(dos){
  const ref = firebase.firestore().collection("BiblioUser")
  if( dos.etat == 'bloc'){
  ref
  .doc(dos.email)
  .update({etat:'ras'})
  .catch((err)=>{
    console.log(err)
  })}

  if( dos.etat != 'bloc'){
    ref
    .doc(dos.email)
    .update({etat:'bloc'})
    .catch((err)=>{
      console.log(err)
    })}
  
}
//fin update


  const { darkMode} = useContext(UserContext);
  return (

    <>
    <Sidebar />
    <Navbar />
    <Section>
      {loader ? 
      <div className="table">
       <Table variant={darkMode ? "dark" : undefined} striped bordered hover>
        <thead>
          <tr>
            <th>Photo de profil</th>
            <th>Nom</th>
            <th>Classe</th>
            <th>Matricule</th>
            <th>Téléphone</th>
            <th>Statut</th>
            <th>Action possible</th>
          </tr>
        </thead>
        <tbody>
        {data.map((etudiant, index) =>{
       if(etudiant.name.toUpperCase().includes(searchWord.toUpperCase())){
        return(
          <tr key={index + 1}>
            <td>
              <a href={etudiant.image} alt='profil'>
                <img src={etudiant.image} className="img-pfl" alt="profil"/>
              </a>  
            </td>
            <td onClick={()=>openModal(etudiant)} style={{cursor:'pointer'}}>{etudiant.name}</td>
            <td onClick={()=>openModal(etudiant)} style={{cursor:'pointer'}}> {etudiant.niveau}</td>
            <td onClick={()=>openModal(etudiant)} style={{cursor:'pointer'}}>{etudiant.matricule}</td>
            <td onClick={()=>openModal(etudiant)} style={{cursor:'pointer'}}>{etudiant.tel}</td>
            <td onClick={()=>openModal(etudiant)} style={{cursor:'pointer'}}>{etudiant.etat}</td>
            <td>
              <div className="btn-bloc-etudiant">
                <a
                    onClick={()=>{updates(etudiant)}}
                    style={{color:'white', backgroundColor: etudiant.etat == 'bloc' ? 'red' : 'green', fontWeight:"bold" }}
                  >
                  {etudiant.etat === 'bloc' ? 'Débloquer' : 'Bloquer'}
                </a>
              </div>
            </td>
            
          </tr>
         )} })}
        </tbody>
      </Table> 
      </div>
      : <Loading /> }
        
      <div className="resp-modal">
                <Modal
                    isOpen={modalIsOpens}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                  <a onClick={closeModal} style={closeStyle}><GrFormClose /></a>
                  <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Informations personnelles sur l'étudiant: {name}</h2>
                  <div style={modalDiv}>
                      <div>
                        <img style={imgP} src={image} alt="profil" />
                      </div>
                      <div style={infor}>
                       <span>  Matricule : {matricule} </span>
                       <span>  Classe : {niveau} </span>
                       <span>  Téléphone : {tel} </span>
                       <span>  Statut : {stat} </span>
                      </div>
                  </div>
                  
                </Modal>
            </div>


    </Section>
    </>
  );
}
const Section = styled.section`
overflow:auto;
.img-pfl{
  width:50px;
  height:50px;
  border-radius:5px;
}
.btn-bloc-etudiant a{
  padding:8px;
  border-radius:10px;
  cursor:pointer; 
}

.btn-bloc-etudiant{
  margin-top: 10px;
  margin-bottom: 10px;
}

.table{
  margin-top: 40px;
  margin-bottom: 20px;
}
th, td{
  text-align: center;
}

.modal_div{
  display: flex;
  .img_p{
    display: block;
    background-color: black;
    width: 100px;
    height: 100px;
    border-radius: 50px;
  }
  .infor{
    display: flex;
    flex-direction: column;
  }
}
`;
