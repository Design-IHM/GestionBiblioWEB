import React,{useContext} from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { UserContext } from "../App";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';

export default function  ViewMess(){

const {messages} = useContext(UserContext)


    return(
<<<<<<< HEAD
        <>
=======
        <div className="content-box">
>>>>>>> cabe8f3d1de6f3e9ca11bf9340f5336c9452ae46
        <Sidebar />
        <Navbar />
        <Section>
            <div className="image-msg"></div>
            <div className="msg-view">
                {messages}
            </div>
            <div className="btn"><NavLink className="request"  to="/sendMessage" style={{display:'flex',borderRadius:5,textAlign:'center', padding:10,color:'white',background:'rgb(219, 153, 29)',width:100, fontWeight:"bold", textDecoration:"none"}} end >Repondre</NavLink></div>
        </Section>
<<<<<<< HEAD
        </>
=======
        </div>
>>>>>>> cabe8f3d1de6f3e9ca11bf9340f5336c9452ae46
    );
}


const Section = styled.section`
    margin-top: 30px; 
    display:flex;
    flex-direction: column;
    gap: 10px;
    .msg-view{
        color:black;
    }
    
`