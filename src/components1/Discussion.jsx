import React,{useState,useEffect,useContext, useRef, useCallback} from "react";
import "./Discussion.css";
import { UserContext } from "../App";
import { IoMdSend } from "react-icons/io";
import firebase from '../metro.config'
import { arrayUnion,Timestamp  } from "firebase/firestore";
import Loading from "./Loading";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';

export default function  Discussion(){


  const {email, nom} = useContext(UserContext)

  const [datUserTest, setDatUserTest]= useState(true)
  useEffect(() => {
   console.log(email)
    setTimeout(() => {
      setDatUserTest(false);
    }, 100);
  }, [email]);

    const [dat, setDat] = useState([])

    const subscriber =useCallback (() =>{
      if(email.length !== 0){
        firebase.firestore()
        .collection('BiblioUser')
        .doc(email)
        .onSnapshot(documentSnapshot => {
            console.log('User exists: ', documentSnapshot._firestore)
            setDat(documentSnapshot.data())
       })}},[email])

       console.log(email)

       useEffect(() =>{
        subscriber()
       },[subscriber])

    var dt =Timestamp.fromDate(new Date())
    function ajouter(){
     // debut ajouter tableau
     const washingtonRef = firebase.firestore().collection("BiblioUser").doc(email)

     washingtonRef.update({
       messages: arrayUnion({"recue":"R", "texte": message ,"heure": dt})
     });

    }

    const  res = async function(){
        await firebase.firestore().collection('MessagesRecue').doc(message).set({
           email:email,
           messages:message
        })
    //    setNom("");
        setMessage("");
     //   setEmail("");
     //   setObjet("");
        ajouter()

       }

       //const [objet, setObjet] = useState('');
    const [message, setMessage] = useState('');
    const formRef = useRef();
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }


    return(
      <div className="content-box">
      <Sidebar />
      <Navbar />
      <div>
        {
          email.length !== 0?
        <div className="messag-div">
            <div className="discussion">
            <div className="namerecep">{nom}</div>

            {datUserTest ?
            <Loading /> :
              (dat.messages.map((dev,index)=>
                    dev.recue === "R" ?<Send heure={dev.heure} texte={dev.texte} key={index}/>
                      :<Receiv heure={dev.heure} texte={dev.texte} key={index}/>
            ))
            }
            </div>
            <div className="write-mess">
                    <form ref={formRef} onSubmit={handleSubmit} className="form-mess">
                        <textarea type="text" className="input-mess" value={message} placeholder="Entrer votre message..." onChange={(e) => setMessage(e.target.value)} />
                        <input type="hidden" value={email} name="email"/>
                        <IoMdSend type="submit" onClick={res} />
                    </form>
                </div>
        </div> :<div></div>
        }
        </div>
        </div>
    );
}

const Receiv =({heure, texte})=>{
    const date = new Date(heure.seconds * 1000);
    const formatDate = date.toDateString();
    const formatHeure = date.toTimeString();

    return(
      <div className="recepteur">
          <span className="text-rec">{texte}</span>
          <p>{formatDate} At {formatHeure.slice(0,8)}</p>
      </div>
    )
  }

  const Send=({heure, texte})=>{
      const date = new Date(heure.seconds * 1000);
      const formatDate = date.toDateString();
      const formatHeure = date.toTimeString();
      return(
        <div className="emmeteur">
            <span className="text-emm">{texte}</span>
            <p>{formatDate} At {formatHeure.slice(0,8)}</p>
        </div>
      )
  }
