import React, { useState, useEffect, createContext } from "react";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";

import styled from "styled-components";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import scrollreveal from "scrollreveal";

// Routes
import ListeEtudiants from "./components1/ListeEtudiants";
import AjoutDoc from "./components1/AjoutDoc";
import Emprunts from "./components1/Emprunts";
import Catalogue from "./components1/Catalogue";
import ListeReservations from "./components1/ListeReservations";
import SendMess from "./components1/SendMess";
import Messages from "./components1/Messages";
import ViewMess from "./components1/ViewMess";
import Archives from "./components1/Archives";
import Discussion from "./components1/Discussion";
import NoPage from "./Component Improvements/NoPage";
import Accueil from "./Component Improvements/WelcomePage";
import LogoutPage from "./Component Improvements/LogoutPage";
import Login from "./Component Improvements/Login";
import RegistrationValidation from "./Component Improvements/RegistrationValidation";
import RegistrationConfirmation from "./Component Improvements/RegistrationConfirmation";
import Pagenation from "./components1/pagination";
import Profil from "./Component Improvements/Profil";
import Cat from "./Component Improvements/catlivre";
import Dept from "./Component Improvements/AdminBooksHome";
import AdminMemoriesHome from "./components1/AdminMemoriesHome";
import Ajoutermémoire from "./components1/ajouterMemoire";
import CatalogueMemoire from "./components1/CatalogueMemoire";
import DepartementMemoriesBtn from "./Component Improvements/DepartementBooksBtn";
import DepartementsList from "./Component Improvements/AdminBooksHome";


export const UserContext = createContext();

export default function App() {
  const [searchWord, setSearchWord] = useState("");
  const [email, setEmail] = useState("mbengivan63@gmail.com");
  const [messages, setMessages] = useState("");
  const [nom, setNom] = useState("Ivan");

  const [searchPage, setSearchPage] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  useEffect(() => {
    const sr = scrollreveal({
      origin: "bottom",
      distance: "80px",
      duration: 2000,
      reset: false,
    });
    sr.reveal(
      `
        nav,
        .row__one,
        .row__two
    `,
      {
        opacity: 0,
        interval: 100,
      }
    );
  }, []);

  return (
    <>
      <UserContext.Provider
        value={{
          searchPage,
          setSearchPage,
          searchWord,
          setSearchWord,
          messages,
          setMessages,
          email,
          setEmail,
          nom,
          setNom,
          darkMode,
          toggleDarkMode,
        }}
      >
        <Div>
          <Router>
            <Section>
              <Routes>
                <Route path="/gestlivre" element={<Cat />} />
                <Route path="/departement" element={<Dept />} />
                <Route path="/departementMem" element={<AdminMemoriesHome />} />
                <Route path="/" element={<Login />} />
                <Route
                  path="/registrationConfirmation"
                  element={<RegistrationConfirmation />}
                />
                <Route
                  path="/registrationValidation"
                  element={<RegistrationValidation />}
                />
                <Route path="/gestmemoire" element={<AdminMemoriesHome />} />
                <Route path="/AdminBooks" element={<DepartementsList />} />
                <Route path="/profil" element={<Profil />} />
                <Route path="/accueil" element={<Accueil />} />
                <Route path="/listeEtudiant" element={<ListeEtudiants />} />
                <Route path="/ajouterDoc" element={<AjoutDoc />} />
                <Route path="/ajoutermémoire" element={<Ajoutermémoire />} />
                <Route path="/emprunts" element={<Emprunts />} />
                <Route
                  path="/listeReservation"
                  element={<ListeReservations />}
                />
                <Route path="/catalogue" element={<Catalogue />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/sendMessage" element={<SendMess />} />
                <Route path="/viewMessage" element={<ViewMess />} />
                <Route path="/archives" element={<Archives />} />
                <Route path="/discuss" element={<Discussion />} />
                <Route path="/logoutPage" element={<LogoutPage />} />
                <Route path="/pagenation" element={<Pagenation />} />
                <Route
                  path="/catalogueMemoire"
                  element={<CatalogueMemoire />}
                />
                <Route
                  path="/departementMemoriesBtn"
                  element={<DepartementMemoriesBtn />}
                />

                <Route path="*" element={<NoPage />} />
              </Routes>
            </Section>
          </Router>
        </Div>
      </UserContext.Provider>
    </>
  );
}

const Div = styled.div`
    position: relative;
    background-color: #ffffff;
`;

const Section = styled.section`
    //margin-left: 18vw;
    background-color: #ffffff;
    padding: 2rem;
    height: 100%;

    .grid {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 1rem;
        margin-top: 2rem;

        .row__one {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            height: 50%;
            gap: 1rem;
        }

        .row__two {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            height: 50%;
        }
    }

    @media screen and (min-width: 280px) and (max-width: 1080px) {
        margin-left: 0;
        .grid {
            .row__one,
            .row__two {
                grid-template-columns: 1fr;
            }
        }
    }
`;
