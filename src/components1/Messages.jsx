import React, { useState, useEffect, useContext, useCallback } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import firebase from '../metro.config';
import { UserContext } from "../App";
import Loading from "./Loading";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import { useI18n } from "../Context/I18nContext";
import { BiMessageDetail } from 'react-icons/bi';
import { IoPersonOutline } from 'react-icons/io5';
import { BsPlusLg } from 'react-icons/bs';
// Fix: Replace AiOutlineMinimize with appropriate icons
import { AiOutlineHome, AiOutlineClose, AiFillMinusSquare, AiOutlineExpand } from 'react-icons/ai';
import ReactJsAlert from "reactjs-alert";
import { arrayUnion, Timestamp } from "firebase/firestore";
import { Form } from "react-bootstrap";

export default function Messages() {
    const { setMessages, email, setEmail, nom, setNom } = useContext(UserContext);
    const { language } = useI18n();
    const refUser = firebase.firestore().collection("BiblioUser");
    const [data, setData] = useState([]);
    const [dataMes, setDataMes] = useState([]);
    const [loader, setLoader] = useState(false);
    
    // États pour le popup style Gmail
    const [showPopup, setShowPopup] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [objet, setObjet] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(false);
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");

    const getDataUser = useCallback(() => {
        refUser.onSnapshot((querySnapshot) => {
            const items = [];
            const itemsMes = [];
            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                if (userData.messages && userData.messages.length > 1) {
                    items.push(userData);
                }
                if (userData.messages) {
                    itemsMes.push(userData.messages);
                }
            });
            setData(items);
            setDataMes(itemsMes);
            setLoader(true);
        });
    }, [refUser]);

    useEffect(() => {
        getDataUser();
    }, [getDataUser]);

    const changerCat = (mes, mail, nom) => {
        setMessages(mes);
        setNom(nom);
        setEmail(mail);
    };

    const newMessage = () => {
        setEmail("");
        setObjet("");
        setMessage("");
        setShowPopup(true);
        setMinimized(false);
    };

    // Fonctions pour envoyer un message
    const ajouter = () => {
        var dt = Timestamp.fromDate(new Date());
        const washingtonRef = firebase.firestore().collection("BiblioUser").doc(email);
        washingtonRef.update({
            messages: arrayUnion({ "recue": "R", "texte": message, "heure": dt })
        });
    };

    const sendMessage = async () => {
        await firebase.firestore().collection('MessagesRecue').doc(message).set({
            email: email,
            messages: message
        });
        setStatus(true);
        setType("success");
        setTitle(translations.message_sent);
        setNom("");
        setMessage(translations.enter_message);
        setEmail(translations.enter_email);
        setObjet(translations.enter_subject);
        ajouter();
        setShowPopup(false);
    };

    const translations = {
        message_history: language === "FR" ? "Historique des discussions" : "Message History",
        names: language === "FR" ? "Noms" : "Names",
        recent_messages: language === "FR" ? "Messages récents" : "Recent Messages",
        no_message: language === "FR" ? "Aucun message" : "No Message",
        new_message: language === "FR" ? "Nouveau Message" : "New Message",
        go_to_home: language === "FR" ? "Accueil" : "Home",
        enter_user_email: language === "FR" ? "À :" : "To:",
        enter_subject: language === "FR" ? "Objet :" : "Subject:",
        enter_message: language === "FR" ? "Entrer le message" : "Enter message",
        send: language === "FR" ? "Envoyer" : "Send",
        message_sent: language === "FR" ? "Message envoyé avec succès" : "Message sent successfully",
        enter_email: language === "FR" ? "Entrer l'email" : "Enter email",
        close: language === "FR" ? "Fermer" : "Close"
    };

    return (
        <div className="content-box">
            <Sidebar />
            <Navbar />
            <Section>
                <div className="title-container">
                    <BiMessageDetail className="title-icon" />
                    <h1 className="title">{translations.message_history}</h1>
                </div>

                {loader ? (
                    <div className="messages-container">
                        <div className="header-mess">
                            <div className="header-name">
                                <IoPersonOutline className="header-icon" />
                                {translations.names}
                            </div>
                            <div className="header-me">
                                <BiMessageDetail className="header-icon" />
                                {translations.recent_messages}
                            </div>
                        </div>

                        <div className="messages-list">
                            {data.map((msg, index) => (
                                <div
                                    className="message-item"
                                    key={index}
                                    onClick={() => changerCat(msg.messages, msg.email, msg.name)}
                                >
                                    <NavLink className="message-link" to="/discuss" end>
                                        <div className="message-name">
                                            <IoPersonOutline className="user-icon" />
                                            {msg.name}
                                        </div>
                                        <div className="message-content">
                                            {msg.messages && msg.messages.length > 0
                                                ? msg.messages[msg.messages.length - 1].texte
                                                : translations.no_message}
                                        </div>
                                    </NavLink>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <Loading />
                )}

                {/* Bouton pour ouvrir le popup */}
                <button onClick={newMessage} className="new-message-button">
                    <BsPlusLg className="plus-icon" />
                    <span>{translations.new_message}</span>
                </button>
                
                {/* Gmail-style Popup */}
                {showPopup && (
                    <GmailPopup minimized={minimized}>
                        <PopupHeader>
                            <div className="popup-title" onClick={() => setMinimized(!minimized)}>
                                {translations.new_message}
                            </div>
                            <div className="popup-controls">
                                <button onClick={() => setMinimized(!minimized)} className="control-btn">
                                    {minimized ? <AiOutlineExpand /> : <AiFillMinusSquare />}
                                </button>
                                <button onClick={() => setShowPopup(false)} className="control-btn">
                                    <AiOutlineClose />
                                </button>
                            </div>
                        </PopupHeader>
                        
                        {!minimized && (
                            <>
                                <PopupBody>
                                    <div className="recipient-row">
                                        <label>{translations.enter_user_email}</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="email@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="subject-row">
                                        <label>{translations.enter_subject}</label>
                                        <input
                                            type="text"
                                            value={objet}
                                            onChange={(e) => setObjet(e.target.value)}
                                            placeholder={translations.enter_subject.replace(':', '')}
                                            required
                                        />
                                    </div>
                                    <div className="message-area">
                                        <textarea
                                            rows="10"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder={translations.enter_message}
                                        />
                                    </div>
                                </PopupBody>
                                
                                <PopupFooter>
                                    <button className="send-btn" onClick={sendMessage}>
                                        {translations.send}
                                    </button>
                                    <button className="discard-btn" onClick={() => setShowPopup(false)}>
                                        {translations.close}
                                    </button>
                                </PopupFooter>
                            </>
                        )}
                    </GmailPopup>
                )}
            </Section>

            <ReactJsAlert
                status={status}
                type={type}
                title={title}
                quotes={true}
                quote=""
                Close={() => setStatus(false)}
            />
        </div>
    );
}

// Style pour le composant Messages
const Section = styled.section`
    padding: 2rem;
    margin-top: 40px;

    .title-container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 2rem;
        gap: 1rem;

        .title-icon {
            font-size: 2.5rem;
            color: #2c3e50;
        }

        .title {
            font-size: 2.5rem;
            color: #2c3e50;
            font-weight: 600;
        }
    }

    .messages-container {
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        overflow: hidden;
    }

    .header-mess {
        display: flex;
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
        padding: 1rem;

        .header-name, .header-me {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.1rem;
            font-weight: 600;
            color: chocolate;
            padding: 0 1rem;
        }

        .header-name {
            width: 30%;
            padding-left: 3rem;
        }

        .header-me {
            width: 70%;
            padding-left: 3rem;
        }

        .header-icon {
            font-size: 1.2rem;
        }
    }

    .messages-list {
        .message-item {
            transition: all 0.2s ease;
            border-bottom: 1px solid #e9ecef;

            &:hover {
                background: #f8f9fa;
            }

            .message-link {
                display: flex;
                text-decoration: none;
                padding: 1rem;
                color: #2c3e50;

                .message-name {
                    width: 30%;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 500;
                    padding-left: 2rem;

                    .user-icon {
                        color: #6c757d;
                    }
                }

                .message-content {
                    width: 70%;
                    padding-left: 2rem;
                    color: #6c757d;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }

    .new-message-button {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: chocolate;
        border-radius: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.8rem 1.5rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
        text-decoration: none;
        border: none;
        cursor: pointer;
        z-index: 10;
        
        .plus-icon {
            margin-right: 0.5rem;
            color: white;
        }
        
        span {
            color: white;
            font-weight: 500;
            font-size: 1rem;
        }

        &:hover {
            transform: scale(1.05);
            background: #411900;
        }
    }

    @media (max-width: 768px) {
        padding: 1rem;

        .title {
            font-size: 2rem;
        }

        .header-mess {
            .header-name, .header-me {
                font-size: 1rem;
                padding-left: 1rem;
            }
        }

        .message-item {
            .message-link {
                flex-direction: column;

                .message-name, .message-content {
                    width: 100%;
                    padding: 0.5rem 1rem;
                }
            }
        }

        .new-message-button {
            padding: 0.6rem 1.2rem;
            
            span {
                font-size: 0.9rem;
            }
        }
    }
`;

// Style pour le Popup Gmail
const GmailPopup = styled.div`
    position: fixed;
    bottom: ${props => props.minimized ? '0' : '2rem'};
    right: 90px;
    width: ${props => props.minimized ? '280px' : '500px'};
    height: ${props => props.minimized ? '42px' : '450px'};
    background: white;
    border-radius: 8px 8px 0 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    z-index: 1000;
    transition: all 0.2s ease-in-out;
    
    @media (max-width: 768px) {
        width: ${props => props.minimized ? '220px' : '92%'};
        right: ${props => props.minimized ? '90px' : '4%'};
        bottom: ${props => props.minimized ? '0' : '10px'};
        height: ${props => props.minimized ? '42px' : '70vh'};
    }
`;

const PopupHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background: #f2f6fc;
    border-radius: 8px 8px 0 0;
    border-bottom: 1px solid #e0e0e0;
    
    .popup-title {
        font-weight: 500;
        color: #202124;
        cursor: pointer;
    }
    
    .popup-controls {
        display: flex;
        gap: 8px;
        
        .control-btn {
            background: transparent;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #5f6368;
            font-size: 16px;
            width: 24px;
            height: 24px;
            
            &:hover {
                background: #e8eaed;
                border-radius: 50%;
            }
        }
    }
`;

const PopupBody = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 10px 15px;
    overflow-y: auto;
    
    .recipient-row, .subject-row {
        display: flex;
        padding: 8px 0;
        border-bottom: 1px solid #e0e0e0;
        
        label {
            min-width: 60px;
            color: #5f6368;
            font-size: 14px;
            padding-top: 8px;
        }
        
        input {
            flex: 1;
            border: none;
            outline: none;
            font-size: 14px;
            padding: 8px 5px;
            color: #202124;
            
            &::placeholder {
                color: #9aa0a6;
            }
        }
    }
    
    .message-area {
        flex: 1;
        margin-top: 10px;
        
        textarea {
            width: 100%;
            height: 100%;
            border: none;
            outline: none;
            resize: none;
            font-size: 14px;
            line-height: 1.5;
            color: #202124;
            
            &::placeholder {
                color: #9aa0a6;
            }
        }
    }
`;

const PopupFooter = styled.div`
    padding: 10px 15px;
    display: flex;
    gap: 10px;
    border-top: 1px solid #e0e0e0;
    
    .send-btn {
        background: #db991d;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 24px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
        
        &:hover {
            background: #c38618;
        }
    }
    
    .discard-btn {
        background: transparent;
        color: #5f6368;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        font-weight: 500;
        cursor: pointer;
        
        &:hover {
            background: #f1f3f4;
        }
    }
`;