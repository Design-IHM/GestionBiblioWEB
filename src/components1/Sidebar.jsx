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
import { useTheme } from "../Context/ThemeContext";

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

  // Define navigation items once to ensure consistency
  const navigationItems = [
    {
      id: 14,
      path: "/accueil",
      icon: <GrCatalog />,
      text: translations.home,
      onClick: changerAc
    },
    {
      id: 6,
      path: "/departement",
      icon: <GrCatalog />,
      text: translations.book_management,
      onClick: changerCat
    },
    {
      id: 15,
      path: "/departementMem",
      icon: <MdRuleFolder />,
      text: translations.thesis_management,
      onClick: changerCat
    },
    {
      id: 2,
      path: "/listeEtudiant",
      icon: <HiUsers />,
      text: translations.registered_students,
      onClick: changer
    },
    {
      id: 3,
      path: "/ajouterDoc",
      icon: <MdPostAdd />,
      text: translations.add_documents,
      onClick: () => setCurrentLink(3)
    },
    {
      id: 4,
      path: "/listeReservation",
      icon: <BsListUl />,
      text: translations.reservation_list,
      onClick: changerReserv
    },
    {
      id: 5,
      path: "/emprunts",
      icon: <BsListUl />,
      text: translations.borrowed_documents,
      onClick: changerEmprunt
    },
    {
      id: 7,
      path: "/messages",
      icon: <AiFillMessage />,
      text: translations.messages,
      onClick: changerMsg
    },
    {
      id: 8,
      path: "/archives",
      icon: <FaArchive />,
      text: translations.archives,
      onClick: changerArch
    },
    {
      id: 16,
      path: "/dashboard",
      icon: <MdRuleFolder />,
      text: translations.statistics,
      onClick: changer
    }
  ];

  // Helper function to render navigation items
  const renderNavItems = () => {
    return navigationItems.map((item) => (
      <li
        key={item.id}
        className={currentLink === item.id ? "active" : "none"}
        onClick={item.onClick}
      >
        <NavLink className="linkin" to={item.path} end>
          {item.icon}
          <span>{item.text}</span>
        </NavLink>
      </li>
    ));
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
              {renderNavItems()}
            </ul>
          </div>
        </div>
      </Section>

      <ResponsiveNav state={navbarState} darkMode={isDarkMode} className={navbarState ? "show" : ""}>
        <div className="responsive__links">
          <ul>
            {renderNavItems()}
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

  @media screen and (min-width: 100px) and (max-width: 900px) {
    display: none;
  }
`;

const ResponsiveNav = styled.div`
  .responsive__links {
    display: none;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    position: absolute;
    top: 0;
    left: 0;
    padding-top: 1rem;
    padding-left: 2rem;

    .links {
      display: flex;
      gap: 1rem;
      flex-direction: column;

      ul {
        list-style-type: none;
      }
    }
  }

  .show {
    display: block;
  }

  @media screen and (min-width: 100px) and (max-width: 900px) {
    position: absolute;
    z-index: 1000;
    width: 100%;
    display: none;
  }
`;
