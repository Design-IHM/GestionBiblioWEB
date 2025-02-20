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
import { AiOutlineHome } from 'react-icons/ai';

export default function Messages() {
    const { setMessages, setEmail, setNom } = useContext(UserContext);
    const { language } = useI18n();
    const refUser = firebase.firestore().collection("BiblioUser");
    const [data, setData] = useState([]);
    const [dataMes, setDataMes] = useState([]);
    const [loader, setLoader] = useState(false);

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
    };

    const translations = {
        message_history: language === "FR" ? "Historique des discussions" : "Message History",
        names: language === "FR" ? "Noms" : "Names",
        recent_messages: language === "FR" ? "Messages récents" : "Recent Messages",
        no_message: language === "FR" ? "Aucun message" : "No Message",
        new_message: language === "FR" ? "Nouveau Message" : "New Message",
        go_to_home: language === "FR" ? "Accueil" : "Home"
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

                <NavLink onClick={newMessage} className="new-message-button" to="/sendMessage" end>
                    <span>{translations.new_message}</span>
                </NavLink>

                
            </Section>
        </div>
    );
}

// Modifier le style :
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
        /* Suppression de max-height et overflow-y */
        
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