import React, {useState, useEffect, useContext, useCallback} from "react";
import {Table} from 'react-bootstrap';
import firebase from '../metro.config';
import styled from "styled-components";
import { UserContext } from "../App";
import Loading from "./Loading";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';

function Archives() {

   //debut firebase

   const ref = firebase.firestore().collection("ArchivesBiblio")

   const [data,setData]=useState([])
   //const [dataArchi,setDataArchi]=useState([])
   const [loader,setLoader] = useState(false)

   
  const {searchWord} = useContext(UserContext)

  
   const getData = useCallback(() => {
    ref.onSnapshot((querySnapshot) => {
      const items = []
      querySnapshot.forEach((doc) => {
        items.push(doc.data())
        setLoader(true)
      })
      setData(items)
      
    });
   },[ref]);
  
   useEffect(() =>{
    getData()
  //  console.log('listDocModal',search)
   },[getData])
  //firebase fin
  const { darkMode } = useContext(UserContext);

    return (
      <div className="content-box">
      <Sidebar />
      <Navbar />
      <Section>
        {loader ? 
      <Table variant={darkMode ? "dark" : undefined} bordered hover>
        <thead>
          <tr>
            <th  style={{
                backgroundColor: "#E7DAC1FF", color:"chocolate", fontSize: "20px", fontWeight: "bold" , width: "400px"
            }}>
                Information du client
            </th>
            <th style={{
                backgroundColor: "#E7DAC1FF", color:"chocolate", fontSize: "20px", fontWeight: "bold" , width: "250px"
            }}>
                Nom du document
            </th>
            <th style={{
                  backgroundColor: "#E7DAC1FF", color:"chocolate", fontSize: "20px", fontWeight: "bold" , width: "250px"
                }}>
                Date de remise
            </th>
            <th style={{
                  backgroundColor: "#E7DAC1FF", color:"chocolate", fontSize: "20px", fontWeight: "bold" , width: "250px"
                }}>
                Statut
            </th>
           
          </tr>
        </thead>
        <tbody>
        {data.map((doc, index) =>{
        
      return( doc.tableauArchives.slice().reverse().map((e,i)=>{
        if(e.nomDoc.includes(searchWord.toUpperCase()) || e.heure.toUpperCase().includes(searchWord.toUpperCase()) || e.nomEtudiant.toUpperCase().includes(searchWord.toUpperCase())){
          return (
          <tr key={i}>
            <td className="flex">
              <p className="fw-bold">
                {e.nomEtudiant}
              </p>

              <span style={{color: "grey", fontSize: "12px"}}>
                {doc.tableauArchives.length - i}
              </span>
            </td>
            <td>{e.nomDoc}</td>
            <td>{e.heure}</td>
            <td>Remis</td>
          </tr>);
        }
          return null;
          }))
         
        })}
        </tbody>
      </Table> : <Loading /> }
      </Section>
      </div>
    );
  }
  
  export default Archives;

  const Section = styled.section`
    overflow:auto;
    margin-top: 40px;
    margin-bottom: 20px;
  
    td, tr{
      text-align: center;
    }
  `