import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { UserContext } from "../App";
import { IoMdSend } from "react-icons/io";
import firebase from '../metro.config';
import { arrayUnion, Timestamp } from "firebase/firestore";
import Loading from "./Loading";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import { IoSearchOutline, IoClose } from "react-icons/io5";

export default function Discussion() {
  const { email, nom } = useContext(UserContext);
  const [datUserTest, setDatUserTest] = useState(true);
  const [setDat] = useState({ messages: [] });
  const [message, setMessage] = useState('');
  const [localMessages, setLocalMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const formRef = useRef();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);

  // Styles intégrés
  const styles = {
    searchContainer: `
      padding: 10px 15px;
      background-color: #f9f9f9;
      border-bottom: 1px solid #eaeaea;
      display: ${isSearching ? 'flex' : 'none'};
      align-items: center;
      gap: 10px;
    `,
    searchInput: `
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #dadce0;
      border-radius: 20px;
      font-size: 14px;
      outline: none;
      background-color: white;
    `,
    searchButton: `
      background: none;
      border: none;
      cursor: pointer;
      color: #5f6368;
      padding: 5px;
      display: flex;
      align-items: center;
    `,
    searchNavigation: `
      display: flex;
      align-items: center;
      gap: 10px;
      color: #5f6368;
      font-size: 12px;
    `,
    searchCount: `
      color: #5f6368;
      font-size: 12px;
    `,
    searchNavigationButtons: `
      display: flex;
      gap: 5px;
    `,
    searchHighlight: `
      background-color: #ffeb3b;
      padding: 2px;
      border-radius: 2px;
    `,
    searchToggle: `
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      color: #5f6368;
      margin-left: auto;
      display: flex;
      align-items: center;
    `,
    discussionContainer: `
      height: calc(100% - 30px);
      display: flex;
      flex-direction: column;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      margin: 15px;
      position: relative;
    `,
    header: `
      display: flex;
      align-items: center;
      padding: 15px 20px;
      border-bottom: 1px solid #eaeaea;
      background-color: #f9f9f9;
      position: sticky;
      top: 0;
      z-index: 10;
    `,
    avatar: `
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: chocolate;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      margin-right: 15px;
    `,
    recipientName: `
      font-size: 18px;
      font-weight: 500;
      color: #202124;
    `,
    onlineStatus: `
      font-size: 12px;
      color: #34a853;
      margin-top: 2px;
    `,
    messagesArea: `
      flex: 1;
      overflow-y: auto;
      padding: 20px;
     
    `,
    dateDivider: `
      text-align: center;
      color: chocolate;
      font-size: 12px;
      margin: 20px 0;
      position: relative;
    `,
    dateDividerLine: `
      display: block;
      height: 1px;
      background: chocolate;
      position: absolute;
      top: 50%;
      width: 100%;
      z-index: 1;
    `,
    dateDividerText: `
      background: white;
      padding: 0 10px;
      position: relative;
      z-index: 2;
    `,
    composeArea: `
      padding: 15px;
      border-top: 1px solid #eaeaea;
      background-color: #fff;
      position: sticky;
      bottom: 0;
      z-index: 10;
    `,
    composeForm: `
      display: flex;
      align-items: flex-end;
    `,
    textareaContainer: `
      flex: 1;
      border: 1px solid #dadce0;
      border-radius: 20px;
      background-color: #f5f7f9;
      transition: all 0.2s;
      margin-right: 10px;
      min-height: 45px;
      max-height: 120px;
      overflow: hidden;
    `,
    textareaContainerFocused: `
      border-color: #1a73e8;
      box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
      background-color: #fff;
    `,
    textarea: `
      width: 100%;
      border: none;
      outline: none;
      resize: none;
      padding: 12px 15px;
      font-family: inherit;
      font-size: 14px;
      background: transparent;
      min-height: 21px;
    `,
    sendButton: `
      width: 45px;
      height: 45px;
      border-radius: 50%;
      border: none;
      background-color: #f0f0f0;
      color: #9aa0a6;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    `,
    sendButtonActive: `
      background-color: #1a73e8;
      color: white;
    `,
    emptyState: `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 30px;
      text-align: center;
      color: #5f6368;
    `,
    emptyIcon: `
      font-size: 50px;
      margin-bottom: 20px;
    `,
    emptyTitle: `
      font-size: 20px;
      margin-bottom: 10px;
      color: #202124;
    `,
    emptyText: `
      font-size: 14px;
    `,
  };

  // Fonction pour basculer la recherche
  const toggleSearch = () => {
    setIsSearching(!isSearching);
    if (!isSearching) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  // Fonction pour rechercher dans les messages
  const searchMessages = useCallback((query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = localMessages.reduce((acc, message, index) => {
      if (message.texte.toLowerCase().includes(query.toLowerCase())) {
        acc.push(index);
      }
      return acc;
    }, []);

    setSearchResults(results);
    setCurrentResultIndex(results.length > 0 ? 0 : -1);
  }, [localMessages]);

  // Fonction pour naviguer dans les résultats
  const navigateResults = (direction) => {
    if (searchResults.length === 0) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentResultIndex + 1) % searchResults.length;
    } else {
      newIndex = (currentResultIndex - 1 + searchResults.length) % searchResults.length;
    }
    setCurrentResultIndex(newIndex);

    // Faire défiler jusqu'au message trouvé
    const messageElement = document.getElementById(`message-${searchResults[newIndex]}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Fonction pour surligner le texte trouvé
  const highlightText = (text, query) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ?
        <mark key={index} style={{ cssText: styles.searchHighlight }}>{part}</mark> :
        part
    );
  };

  // Mettre à jour la recherche quand la requête change
  useEffect(() => {
    searchMessages(searchQuery);
  }, [searchQuery, searchMessages]);

  useEffect(() => {
    setTimeout(() => {
      setDatUserTest(false);
    }, 100);
  }, [email]);

  const subscriber = useCallback(() => {
    if (email && email.length !== 0) {
      firebase.firestore()
        .collection('BiblioUser')
        .doc(email)
        .onSnapshot(documentSnapshot => {
          if (documentSnapshot.exists && documentSnapshot.data()) {
            setDat(documentSnapshot.data());
            setLocalMessages(documentSnapshot.data().messages || []);
          }
        });
    }
  }, [email, setDat]);

  useEffect(() => {
    subscriber();
  }, [subscriber]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function ajouter() {
    const dt = Timestamp.fromDate(new Date());
    const newMessage = { "recue": "R", "texte": message, "heure": dt };

    // Update local state immediately for instant feedback
    setLocalMessages(prev => [...prev, newMessage]);

    // Then update Firestore
    const washingtonRef = firebase.firestore().collection("BiblioUser").doc(email);
    washingtonRef.update({
      messages: arrayUnion(newMessage)
    });
  }

  const res = async function() {
    if (!message.trim()) return;

    try {
      await firebase.firestore().collection('MessagesRecue').doc(message).set({
        email: email,
        messages: message,
        lue: false // Ajout de l'attribut ici
      });

      await ajouter();
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    res();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      res();
    }
  };

  const [textareaFocused, setTextareaFocused] = useState(false);

  // Function to group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};

    messages.forEach(msg => {
      const date = new Date(msg.heure.seconds * 1000);
      const dateStr = new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);

      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }

      groups[dateStr].push(msg);
    });

    return groups;
  };

  // Function to determine if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Function to determine if a date is yesterday
  const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.getDate() === yesterday.getDate() &&
           date.getMonth() === yesterday.getMonth() &&
           date.getFullYear() === yesterday.getFullYear();
  };

  // Function to get display label for date
  const getDateLabel = (dateStr) => {
    const date = new Date(dateStr.split(' ')[0] + ' ' + dateStr.split(' ')[1] + ' ' + dateStr.split(' ')[2]);

    if (isToday(date)) {
      return "Aujourd'hui";
    } else if (isYesterday(date)) {
      return "Hier";
    } else {
      return dateStr;
    }
  };

  return (
    <div className="content-box">
      <Sidebar />
      <Navbar />
      <div>
        {email && email.length !== 0 ? (
          <div style={{ cssText: styles.discussionContainer }}>
            {/* Chat Header */}
            <div style={{ cssText: styles.header }}>
              <div style={{ cssText: styles.avatar }}>
                {nom && nom.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ cssText: styles.recipientName }}>{nom}</div>
              </div>
              <button
                style={{ cssText: styles.searchToggle }}
                onClick={toggleSearch}
              >
                <IoSearchOutline size={20} />
              </button>
            </div>

            {/* Search Bar */}
            <div style={{ cssText: styles.searchContainer }}>
              <IoSearchOutline size={20} color="#5f6368" />
              <input
                type="text"
                style={{ cssText: styles.searchInput }}
                placeholder="Rechercher dans la conversation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchResults.length > 0 && (
                <div style={{ cssText: styles.searchNavigation }}>
                  <span style={{ cssText: styles.searchCount }}>
                    {currentResultIndex + 1}/{searchResults.length}
                  </span>
                  <div style={{ cssText: styles.searchNavigationButtons }}>
                    <button
                      style={{ cssText: styles.searchButton }}
                      onClick={() => navigateResults('prev')}
                    >
                      ↑
                    </button>
                    <button
                      style={{ cssText: styles.searchButton }}
                      onClick={() => navigateResults('next')}
                    >
                      ↓
                    </button>
                  </div>
                </div>
              )}
              <button
                style={{ cssText: styles.searchButton }}
                onClick={toggleSearch}
              >
                <IoClose size={20} />
              </button>
            </div>

            {/* Messages Container avec surbrillance */}
            <div style={{ cssText: styles.messagesArea }}>
              {datUserTest ? (
                <Loading />
              ) : (
                <>
                  {Object.entries(groupMessagesByDate(localMessages)).map(([dateStr, messages]) => (
                    <React.Fragment key={dateStr}>
                      <div style={{ cssText: styles.dateDivider }}>
                        <span style={{ cssText: styles.dateDividerLine }}></span>
                        <span style={{ cssText: styles.dateDividerText }}>
                          {getDateLabel(dateStr)}
                        </span>
                      </div>

                      {messages.map((dev, index) => {
                        const isSearchResult = searchResults.includes(index);
                        const MessageComponent = dev.recue === "R" ? Send : Receiv;

                        return (
                          <div
                            key={index}
                            id={`message-${index}`}
                            style={{
                              backgroundColor: isSearchResult && index === searchResults[currentResultIndex] ? '#f8f9fa' : 'transparent',
                              padding: '2px',
                              borderRadius: '8px',
                            }}
                          >
                            <MessageComponent
                              heure={dev.heure}
                              texte={searchQuery ? highlightText(dev.texte, searchQuery) : dev.texte}
                            />
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Composer (resté inchangé) */}
            <div style={{ cssText: styles.composeArea }}>
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                style={{ cssText: styles.composeForm }}
              >
                <div
                  style={{
                    cssText: `${styles.textareaContainer} ${textareaFocused ? styles.textareaContainerFocused : ''}`
                  }}
                >
                  <textarea
                    style={{ cssText: styles.textarea }}
                    value={message}
                    placeholder="Rédigez un message..."
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setTextareaFocused(true)}
                    onBlur={() => setTextareaFocused(false)}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    cssText: `${styles.sendButton} ${message.trim() ? styles.sendButtonActive : ''}`
                  }}
                  disabled={!message.trim()}
                >
                  <IoMdSend size={20} />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div style={{ cssText: styles.emptyState }}>
            <div style={{ cssText: styles.emptyIcon }}>📨</div>
            <h2 style={{ cssText: styles.emptyTitle }}>Sélectionnez une conversation</h2>
            <p style={{ cssText: styles.emptyText }}>Choisissez un contact pour commencer à discuter</p>
          </div>
        )}
      </div>
    </div>
  );
}

const Receiv = ({ heure, texte }) => {
  const date = new Date(heure.seconds * 1000);
  const formatTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
  }).format(date);

  const styles = {
    container: `
      max-width: 70%;
      margin-bottom: 15px;
      align-self: flex-start;
      display: flex;
      flex-direction: column;
    `,
    bubble: `
      background-color: #f1f3f4;
      border-radius: 18px 18px 18px 5px;
      padding: 12px 15px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      position: relative;
      color: #202124;
      line-height: 1.4;
      word-break: break-word;
      align-self: flex-start;
    `,
    text: `
      margin: 0;
      font-size: 14px;
    `,
    time: `
      font-size: 11px;
      color: #80868b;
      margin-top: 5px;
      display: block;
    `,
    date: `
      font-size: 11px;
      color: #80868b;
      margin-top: 2px;
      margin-left: 5px;
    `
  };

  return (
    <div style={{ cssText: styles.container }}>
      <div style={{ cssText: styles.bubble }}>
        <p style={{ cssText: styles.text }}>{texte}</p>
        <span style={{ cssText: styles.time }}>{formatTime}</span>
      </div>
      <span style={{ cssText: styles.date }}>{formatDate}</span>
    </div>
  );
};

const Send = ({ heure, texte }) => {
  const date = new Date(heure.seconds * 1000);
  const formatTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
  }).format(date);

  const styles = {
    container: `
      max-width: 70%;
      margin-bottom: 15px;
      margin-left: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    `,
    bubble: `
      background-color: #FFF0E6;
      border-radius: 18px 18px 5px 18px;
      padding: 12px 15px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      position: relative;
      color: #1565c0;
      line-height: 1.4;
      word-break: break-word;
    `,
    text: `
      margin: 0;
      font-size: 14px;
    `,
    timeContainer: `
      display: flex;
      align-items: center;
      margin-top: 5px;
      justify-content: flex-end;
    `,
    time: `
      font-size: 11px;
      color: #80868b;
      margin-right: 3px;
    `,
    status: `
      font-size: 11px;
      color: #1565c0;
    `,
    date: `
      font-size: 11px;
      color: #80868b;
      margin-top: 2px;
      margin-right: 5px;
    `
  };

  return (
    <div style={{ cssText: styles.container }}>
      <div style={{ cssText: styles.bubble }}>
        <p style={{ cssText: styles.text }}>
          {typeof texte === 'string' ? texte : texte}
        </p>
        <div style={{ cssText: styles.timeContainer }}>
          <span style={{ cssText: styles.time }}>{formatTime}</span>
          <span style={{ cssText: styles.status }}>✓</span>
        </div>
      </div>
      <span style={{ cssText: styles.date }}>{formatDate}</span>
    </div>
  );
};
