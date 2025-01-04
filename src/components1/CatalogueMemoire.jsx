import {React,useState,useEffect,useContext,useRef, useCallback} from "react";
import styled from "styled-components";
import { cardStyles } from "./ReusableStyles";
import firebase from '../metro.config'
import { UserContext } from "../App";
import Modal from 'react-modal';
import ReactJsAlert from "reactjs-alert";
import { GrFormClose } from "react-icons/gr";
import Pagination from "react-bootstrap/Pagination";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { useLocation } from 'react-router-dom';
import { FaBook } from "react-icons/fa";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import { Button, Row } from "react-bootstrap";

export default function CatalogueMemoire() {

  const location = useLocation();
  const { state } = location;
  //const departement = location.state.departement;
  const  departement  = state ? state.département: null;
  //const departement = location.state?.departement ?? null;
  const isDepartementNonNull = departement !== null ? 1 : 0;

  const navigate = useNavigate();

  const bookIconStyle = {
    fontSize: '40px',
    marginRight: '10px',
    color:"gray",
    marginBottom: '10px',
    
  };

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
  }
  //Modal 2
const [modalIsOpens, setIsOpens] = useState(false);
const [modalIsOpens1, setIsOpens1] = useState(false);
//Alert 

const [status, setStatus] = useState(false);
const [type, setType] = useState("");
const [title, setTitle] = useState("");

function openModal(e) {
    setMatricule(e.matricule)
    setName(e.name)
    setAnnee(e.annee)
    setDépartement(e.département)
    setEtagere(e.etagere)
    setTheme(e.theme)
    setComment(e.commentaire)
    setIsOpens(true);
    setImage(e.image)
}

/*function openModal1() {
  setIsOpens1(true);
  setIsOpens(false);
}*/

function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#000';
}

function afterOpenModal1() {
  // references are now sync'd and can be accessed.
  subtitle.style.color = '#000';
}

function closeModal() {
    setIsOpens(false);
}

function closeModal1() {
  setIsOpens1(false);
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
  const [matricule, setMatricule] = useState('')
  const [theme, setTheme] = useState('')
  const [département, setDépartement] = useState('');
  const [annee, setAnnee] = useState('')
  const [etagere, setEtagere] = useState('')
  const [comment, setComment] = useState('')
  const [image, setImage] = useState(null);
const formRef = useRef()
  //fin modal 2
  
  const {searchWord} = useContext(UserContext)



    //debut firebase

    const ref = firebase.firestore().collection("Memoire")

    const [data,setData]=useState([])
    const [loader,setLoader] = useState(false)


    const getData = useCallback(()=>{
      if (isDepartementNonNull) {
        ref.where('département', '==', departement).onSnapshot((querySnapshot) => {
          const items = [];
          querySnapshot.forEach((doc) => {
            items.push(doc.data());
            setLoader(true);
          });
          setData(items);
        });
      } else  {
        ref.onSnapshot((querySnapshot) => {
          const items = [];
          querySnapshot.forEach((doc) => {
            items.push(doc.data());
            setLoader(true);
          });
          setData(items);
        });
      }
    },[ref,departement,isDepartementNonNull]) 
    
    useEffect(() => {
      getData();
    }, [getData]);
    

    /*function getData(){
      
     ref.where('cathegorie', '==', departement).onSnapshot((querySnapshot) => {
       const items = []
       querySnapshot.forEach((doc) => {
         items.push(doc.data())
         setLoader(true)
       })
       setData(items)
       
       
     });
} 

    
   
    useEffect(() =>{
     getData()
   //  console.log('listDocModal',search)
    },[])*/
    /*function getData() {
          ref.where('cathegorie', '==', departement).onSnapshot((querySnapshot) => {
              const items = [];
              querySnapshot.forEach((doc) => {
                  items.push(doc.data());
                  setLoader(true);
              });
              setData(items);
          });
     
        }
  useEffect(() =>{
    getData()
  },[])*/
   //firebase fin
   

   // Add a new document in collection "cities" with ID 'LA'
const  resUdapte = async function(){
  await firebase.firestore().collection('Memoire').doc(matricule).set({
    name: name,
    matricule: matricule,
    theme: theme,
    département: département,
    annee: parseInt(annee),
    etagere: etagere,
    image: image,
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
  await firebase.firestore().collection('Memoire').doc(matricule).delete()
  setIsOpens(false);

}



  return (
<>
    <Sidebar />
    <Navbar />
    <Row style={{display: 'flex',
        justifyContent: 'space-around', marginTop: '35px', marginBottom: '20px'}}>
            <Button  onClick={()=>navigate('/catalogue')} style={buttonVisualiserStyle}>
            Livre
          </Button>
          <Button variant="success"  style={buttonAjouterStyle} onClick={()=>navigate('/catalogueMemoire')}>
           Memoire
          </Button>
          </Row>
    <h1 style={{textAlign: 'center', color: 'gray', marginTop:'10px', marginBottom:'20px' }}>Liste des Mémoires  {departement}</h1>
    <Section>
      {loader ? ( data.map((doc, index) =>{
       if(doc.name.toUpperCase().includes(searchWord.toUpperCase())){
        return(
            <div className="analytic " key={index}>
            <div className="content" onClick={()=>openModal(doc)}>
              <h3>{doc.theme}</h3>
              <h4>{doc.name}</h4>
              <h6>Departement : {doc.département}</h6>
              <h6>Année de rédaction: {doc.annee}</h6>
            </div>
            <div className="logo">
            <a href={doc.image}>
              <img src={doc.image}  alt="logo"/>
            </a> 
            </div>
          </div>
         )}
           return null;
          }) ) :<Loading />    }
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
                <label className="labelForm" style={labelForm} htmlFor="exemp">Entrer le nouveau matricule</label>
                <input style={labelInput} id="exemp" type="text" placeholder="20P000" name="matricule" value={matricule}  onChange={(e) => setMatricule(e.target.value)} />
                <label className="labelForm" style={labelForm} htmlFor="class">Entrer le nouveau département</label>
                <select style={labelInput} id="class" type="text" placeholder="département" name='département' value={département} onChange={(e) => setDépartement(e.target.value)} required >
   
                        <option value='Genie Informatique' >Genie Informatique</option>
                        <option value="Genie Civile">Genie Civile</option>
                        <option value='Genie Electrique'>Genie Electrique </option>
                        <option value='Genie Mecanique'>Genie Mecanique/Industriel </option>
                        <option value='Genie Telecom'>Génie Telecom </option>
                </select>
                

                 <label className="labelForm" style={labelForm} htmlFor="etagere">Entrer la position de l'étagere</label>
                <input style={labelInput} id="etagere" type="text" placeholder="Nouvelle etagère..." name="etagere" value={etagere} onChange = {(e) => setEtagere(e.target.value)} /> 
                <label className="labelForm" style={labelForm} htmlFor="desc">Entrer la nouvelle année</label>
                <textarea style={labelInput} id="etagere" type="number" placeholder="2025" name="annee" value={annee} onChange = {(e) => setAnnee(e.target.value)} />  

                <FaBook style={bookIconStyle} />
                <label className="labelForm" style={labelForm} htmlFor="desc">Entrer le lien de l'image</label>
                <textarea style={labelInput} id="etagere" type="number" placeholder="image/xxx/yyy"  value={image} onChange={(e) => setImage(e.target.value)} name='image' />  
    
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

            <div>
                <Modal
                    isOpen={modalIsOpens1}
                    onAfterOpen={afterOpenModal1}
                    onRequestClose={closeModal1}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <Modal.Header closeButton>
          <Modal.Title className='text-center'><h2 className='text-center'>Confirmation de suppression</h2></Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <h4 className='text-center'> Voulez vous vraiment supprimer ?</h4>
            <Row style={{display: 'flex',
        justifyContent: 'space-around', marginTop: '35px', marginBottom: '20px'}}>
            <Button onClick={deleteDoc} style={{buttonVisualiserStyle}}>
            Supprimer
          </Button>
          <Button variant="success"  style={buttonAjouterStyle} onClick={closeModal1}>
           Annuler
          </Button>
          </Row>
        </Modal.Body>
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
    </>    
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