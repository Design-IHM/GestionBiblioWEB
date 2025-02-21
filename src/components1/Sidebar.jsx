import React, { useState, useContext} from "react";
import styled from "styled-components";
import { BsListUl } from "react-icons/bs";

import { GrCatalog } from "react-icons/gr";
import { FaArchive } from "react-icons/fa";

import { MdPostAdd, MdRuleFolder } from "react-icons/md";
import { GiHamburgerMenu, GiBookPile } from "react-icons/gi";
import { VscChromeClose } from "react-icons/vsc";
import { HiUsers } from "react-icons/hi";
import { AiFillMessage } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import { UserContext } from "../App";
import { useI18n } from "../Context/I18nContext";
import { useTheme } from "../Context/ThemeContext"; // Importer le hook useTheme

export default function Sidebar() {
  const [currentLink, setCurrentLink] = useState(0);
  const [navbarState, setNavbarState] = useState(false);
  const { setSearchPage } = useContext(UserContext);
  const { language } = useI18n();
  const { isDarkMode } = useTheme(); 

  const html = document.querySelector("html");
  html.addEventListener("click", () => setNavbarState(false));

  const changer = () => {
    setCurrentLink(2);
    setSearchPage("etudiant");
  };

  

  const changerAc = () => {
    setCurrentLink(14);
  };

  const changerCat = () => {
    setCurrentLink(6);
    setSearchPage("document");
  };

  const changerReserv = () => {
    setCurrentLink(4);
    setSearchPage("ras");
  };

  const changerEmprunt = () => {
    setCurrentLink(5);
    setSearchPage("ras");
  };

  const changerMsg = () => {
    setCurrentLink(7);
    setSearchPage("ras");
  };

  const changerArch = () => {
    setCurrentLink(8);
    setSearchPage("archives");
  };

  // Traductions directes pour la Sidebar
  const translations = {
    home: language === "FR" ? "Accueil" : "Home",
    book_management: language === "FR" ? "Gestion de Livres" : "Book Management",
    thesis_management: language === "FR" ? "Gestion de Memoires" : "Thesis Management",
    registered_students: language === "FR" ? "Etudiants inscrits" : "Registered Students",
    add_documents: language === "FR" ? "Ajouter documents" : "Add Documents",
    reservation_list: language === "FR" ? "Liste de réservations" : "Reservation List",
    borrowed_documents: language === "FR" ? "Documents empruntés" : "Borrowed Documents",
    messages: language === "FR" ? "Messages" : "Messages",
    archives: language === "FR" ? "Archives" : "Archives",
    statistics: language === "FR" ? "Statistiques" : "Statistics"
  };

  return (
    <>
      <Section darkMode={isDarkMode}>
        <div className="top">
          <div className="brandSide">
            <a href="/accueil">
              <GiBookPile />
              <span className="text-sm md:text-md">ENSPY</span>
            </a>
          </div>

          <div className="toggle">
            {navbarState ? (
              <VscChromeClose className="menu" onClick={() => setNavbarState(false)} />
            ) : (
              <GiHamburgerMenu
                className="menu"
                onClick={(e) => {
                  e.stopPropagation();
                  setNavbarState(true);
                }}
              />
            )}
          </div>

          <div className="links">
            <ul>
              <li className={currentLink === 14 ? "active" : "none"} onClick={() => changerAc()}>
                <NavLink className="linkin" to="/accueil" end>
                  <GrCatalog />
                  <span>{translations.home}</span>
                </NavLink>
              </li>

              <li className={currentLink === 6 ? "active" : "none"} onClick={() => changerCat()}>
                <NavLink className="linkin" to="/departement" end>
                  <GrCatalog />
                  <span>{translations.book_management}</span>
                </NavLink>
              </li>

              <li className={currentLink === 15 ? "active" : "none"} onClick={() => changerCat()}>
                <NavLink className="linkin" to="/departementMem" end>
                  <MdRuleFolder />
                  <span>{translations.thesis_management}</span>
                </NavLink>
              </li>

              <li className={currentLink === 2 ? "active" : "none"} onClick={() => changer()}>
                <NavLink className="linkin" to="/listeEtudiant" end>
                  <HiUsers />
                  <span>{translations.registered_students}</span>
                </NavLink>
              </li>

              <li className={currentLink === 3 ? "active" : "none"} onClick={() => setCurrentLink(3)}>
                <NavLink className="linkin" to="/ajouterDoc" end>
                  <MdPostAdd />
                  <span>{translations.add_documents}</span>
                </NavLink>
              </li>

              <li className={currentLink === 4 ? "active" : "none"} onClick={() => changerReserv()}>
                <NavLink className="linkin" to="/listeReservation" end>
                  <BsListUl />
                  <span>{translations.reservation_list}</span>
                </NavLink>
              </li>

              <li className={currentLink === 5 ? "active" : "none"} onClick={() => changerEmprunt()}>
                <NavLink className="linkin" to="/emprunts" end>
                  <BsListUl />
                  <span>{translations.borrowed_documents}</span>
                </NavLink>
              </li>

              <li className={currentLink === 7 ? "active" : "none"} onClick={() => changerMsg()}>
                <NavLink className="linkin" to="/messages" end>
                  <AiFillMessage />
                  <span>{translations.messages}</span>
                </NavLink>
              </li>

              <li className={currentLink === 8 ? "active" : "none"} onClick={() => changerArch()}>
                <NavLink className="linkin" to="/archives" end>
                  <FaArchive />
                  <span>{translations.archives}</span>
                </NavLink>
              </li>

              <li className={currentLink === 16 ? "active" : "none"} onClick={() => changer()}>
                <NavLink className="linkin" to="/dashboard" end>
                  <MdRuleFolder />
                  <span>{translations.statistics}</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      <ResponsiveNav state={navbarState} darkMode={isDarkMode} className={navbarState ? "show" : ""}>
        <div className="responsive__links">
          <ul>
            <li className={currentLink === 6 ? "active" : "none"} onClick={() => changerCat()}>
              <NavLink className="linkin" to="/departement" end>
                <GrCatalog />
                <span>{translations.book_management}</span>
              </NavLink>
            </li>

            <li className={currentLink === 2 ? "active" : "none"} onClick={() => changer()}>
              <NavLink className="linkin" to="/listeEtudiant" end>
                <HiUsers />
                <span>{translations.registered_students}</span>
              </NavLink>
            </li>

            <li className={currentLink === 3 ? "active" : "none"} onClick={() => setCurrentLink(3)}>
              <NavLink className="linkin" to="/ajouterDoc" end>
                <MdPostAdd />
                <span>{translations.add_documents}</span>
              </NavLink>
            </li>

            <li className={currentLink === 4 ? "active" : "none"} onClick={() => changerReserv()}>
              <NavLink className="linkin" to="/listeReservation" end>
                <BsListUl />
                <span>{translations.reservation_list}</span>
              </NavLink>
            </li>

            <li className={currentLink === 5 ? "active" : "none"} onClick={() => changerEmprunt()}>
              <NavLink className="linkin" to="/emprunts" end>
                <BsListUl />
                <span>{translations.borrowed_documents}</span>
              </NavLink>
            </li>

            <li className={currentLink === 7 ? "active" : "none"} onClick={() => changerMsg()}>
              <NavLink className="linkin" to="/messages" end>
                <AiFillMessage />
                <span>{translations.messages}</span>
              </NavLink>
            </li>

            <li className={currentLink === 8 ? "active" : "none"} onClick={() => changerArch()}>
              <NavLink className="linkin" to="/archives" end>
                <FaArchive />
                <span>{translations.archives}</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </ResponsiveNav>
    </>
  );
}

const Section = styled.section`
  position: fixed;
  top: 0;
  left: 0;
  background-color: ${props => props.darkMode ? "#111827" : "rgb(231, 218, 193)"};
  height: 100vh;
  width: 18vw;
  display: flex;
  flex-direction: column;
  padding-bottom: 2rem;
  padding-top: 2rem;
  gap: 2rem;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  .top {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;

    .toggle {
      display: none;
    }

    .brandSide a {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      text-decoration: none;

      svg {
        color: chocolate;
        font-size: 3rem;
      }

      span {
        font-size: 2rem;
        color: chocolate;
        font-weight: bold;
      }
    }

    .links {
      display: flex;
      justify-content: center;
      margin-left: -20px;

      ul {
        list-style-type: none;
        display: flex;
        margin: auto;
        flex-direction: column;
        gap: 1rem;

        li {
          border-radius: 0.6rem;

          &:hover {
            background-color: ${props => props.darkMode ? "#4b5563" : "#ececec"};

            .linkin {
              color: chocolate;
            }
          }

          .linkin {
            padding: 0.6rem 1rem;
            text-decoration: none;
            border-radius: 0.6rem;
            display: flex;
            gap: 1rem;
            color: ${props => props.darkMode ? "white" : "#888888"};
            font-weight: bold;
          }
        }

        .active {
          background-color: ${props => props.darkMode ? "#4b5563" : "#ececec"};

          .linkin {
            color: chocolate;
            border-radius: 0.6rem;
          }
        }
      }
    }
  }

  .logout {
    padding: 0.6rem 1rem;
    border-radius: 0.6rem;
    font-weight: bold;

    &:hover {
      background-color: #da0037;
      color: black;
    }

    .linkin {
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: grey;
    }
  }

  @media screen and (min-width: 100px) and (max-width: 1080px) {
    position: initial;
    width: 100%;
    height: max-content;
    padding: 1rem;
    .top {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;

      .toggle {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        color: #121212;
        align-items: center;
        z-index: 99;

        .menu {
          color: chocolate;
          font-size: 1.2rem;
        }
      }

      .brandSide a {
        gap: 1rem;

        svg {
          font-size: 2rem;
        }

        span {
          font-size: 1rem;
        }
      }
    }

    .top > .links,
    .logout {
      display: none;
    }
  }
`;

const ResponsiveNav = styled.div`
  position: fixed;
  right: -10vw;
  top: 0;
  z-index: 10;
  background-color: ${props => props.darkMode ? "#111827" : "rgb(231, 218, 193)"};
  height: 100vh;
  width: ${({ state }) => (state ? "60vh" : "0%")};
  transition: 0.4s ease-in-out;
  display: flex;
  opacity: 1;
  padding: 1rem;
  .responsive__links {
    ul {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 3rem;
      li {
        border-radius: 0.6rem;
        &:hover {
          background-color: ${props => props.darkMode ? "#4b5563" : "#fe7a3f"};
          .linkin {
            color: ${props => props.darkMode ? "chocolate" : "white"};
            font-weight: bold;
          }
        }
        .linkin {
          padding: 0.6rem 1rem;
          text-decoration: none;
          display: flex;
          gap: 1rem;
          color: ${props => props.darkMode ? "white" : "black"};
        }
      }
    }
  }
`;
