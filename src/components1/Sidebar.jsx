import React, { useState,useContext } from "react";
import styled from "styled-components";
import { BsListUl } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { GrCatalog } from "react-icons/gr";
import { FaArchive } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { MdPostAdd } from "react-icons/md";
import { GiHamburgerMenu, GiBookPile } from "react-icons/gi";
import { VscChromeClose } from "react-icons/vsc";
import { HiUsers } from "react-icons/hi";
import { AiFillMessage } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import { UserContext } from "../App";

export default function Sidebar() {
  const [currentLink, setCurrentLink] = useState(0);
  const [navbarState, setNavbarState] = useState(false);
  const html = document.querySelector("html");
  html.addEventListener("click", () => setNavbarState(false));

  const {setSearchPage} = useContext(UserContext)

  const changer =()=>{
    setCurrentLink(2)
    setSearchPage("etudiant")
  }

  const changerProfil =()=>{
    setCurrentLink(10)

  }

  const changerAc =()=>{
    setCurrentLink(14)
  }

  const changerCat =()=>{
    setCurrentLink(6)
    setSearchPage("document")
  }

  const changerReserv =()=>{
    setCurrentLink(4)
    setSearchPage("ras")
  }

  const changerEmprunt =()=>{
    setCurrentLink(5)
    setSearchPage("ras")
  }

  const changerMsg =()=>{
    setCurrentLink(7)
    setSearchPage("ras")
  }

  const changerArch =()=>{
    setCurrentLink(8)
    setSearchPage("archives")
  }

  const { darkMode } = useContext(UserContext);

  return (
    <>
      <Section style={{ backgroundColor: darkMode ? "#333333" : " rgb(231, 218, 193)", color: darkMode ? 'white' : 'black' }}>
        <div className="top">
          <div className="brandSide">
            <a href="/accueil">
              <GiBookPile />
              <span className="text-sm md:text-md">ENSPY</span>
            </a>
          </div>

          <div className="toggle">
            {navbarState ? (
              <VscChromeClose className="menu" onClick={() => setNavbarState(false)}/>
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
                  <GrCatalog/>
                  <span>Accueil</span>
                </NavLink>
              </li>

              <li className={currentLink === 10 ? "active" : "none"} onClick={() => changerProfil()}>
                <NavLink className="linkin" to="/profil" end>
                  <FaUser/>
                  <span>Profil bibliothécaire</span>
                </NavLink>
              </li>

              <li
                className={currentLink === 6 ? "active" : "none"}
                onClick={() => changerCat()}
              >
                <NavLink className="linkin" to="/catalogue" end>
                  <GrCatalog/>
                  <span>Catalogue</span>
                </NavLink>
              </li>


              <li className={currentLink === 2 ? "active" : "none"} onClick={() => changer()}>
                <NavLink className="linkin" to="/listeEtudiant" end>
                  <HiUsers/>
                  <span>Etudiants inscrits</span>
                </NavLink>
              </li>

              <li className={currentLink === 3 ? "active" : "none"} onClick={() => setCurrentLink(3)}>
                <NavLink className="linkin" to="/ajouterDoc" end>
                  <MdPostAdd/>
                  <span>Ajouter documents</span>
                </NavLink>
              </li>

              <li className={currentLink === 4 ? "active" : "none"} onClick={() => changerReserv()}>
                <NavLink className="linkin" to="/listeReservation" end>
                  <BsListUl/>
                  <span>Liste de réservations</span>
                </NavLink>
              </li>

              <li className={currentLink === 5 ? "active" : "none"} onClick={() => changerEmprunt()}>
                <NavLink className="linkin" to="/emprunts" end>
                  <BsListUl/>
                  <span>Documents empruntés</span>
                </NavLink>
              </li>

              <li className={currentLink === 7 ? "active" : "none"} onClick={() => changerMsg()}>
                <NavLink className="linkin" to="/messages" end>
                  <AiFillMessage/>
                  <span>Messages</span>
                </NavLink>
              </li>

              <li className={currentLink === 8 ? "active" : "none"} onClick={() => changerArch()}>
                <NavLink className="linkin" to="/archives" end>
                  <FaArchive/>
                  <span>Archives</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="logout">
          <NavLink className="linkin" to="/logoutPage">
            <span className="logout"><FiLogOut/>  Déconnexion</span>
          </NavLink>
        </div>
      </Section>

      <ResponsiveNav state={navbarState} className={navbarState ? "show" : ""}>
        <div className="responsive__links">
          <ul>
            <li
              className={currentLink === 6 ? "active" : "none"}
              onClick={() => changerCat()}
            >
              <NavLink className="linkin" to="/catalogue" end>
                <GrCatalog />
                <span>Catalogue</span>
              </NavLink>
            </li>

            <li
              className={currentLink === 2 ? "active" : "none"}
              onClick={() =>changer()}
            >
              <NavLink className="linkin" to="/listeEtudiant" end>
                <HiUsers />
                <span>Etudiants inscrits</span>
              </NavLink>
            </li>

            <li
              className={currentLink === 3 ? "active" : "none"}
              onClick={() => setCurrentLink(3)}
            >
              <NavLink className="linkin" to="/ajouterDoc" end>
                <MdPostAdd />
                <span>Ajouter documents</span>
              </NavLink>
            </li>

            <li
              className={currentLink === 4 ? "active" : "none"}
              onClick={() => changerReserv()}
            >
              <NavLink className="linkin"  to="/listeReservation" end>
                <BsListUl />
                <span>Liste de réservations</span>
              </NavLink>
            </li>

            <li
              className={currentLink === 5 ? "active" : "none"}
              onClick={() => changerEmprunt()}
            >
              <NavLink className="linkin" to="/emprunts" end>
                <BsListUl />
                <span>Livres empruntés</span>
              </NavLink>
            </li>

            <li
              className={currentLink === 7 ? "active" : "none"}
              onClick={() => changerMsg()}
            >
              <NavLink className="linkin" to="/messages" end>
                  <AiFillMessage />
                  <span>Messages</span>
                </NavLink>
            </li>

            <li
              className={currentLink === 8 ? "active" : "none"}
              onClick={() => changerArch()}
            >
              <NavLink className="linkin" to="/archives" end>
                  <FaArchive />
                  <span>Archives</span>
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
    background-color: rgb(231, 218, 193);
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
                        background-color: #ececec;

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
                        color: #888888;
                        font-weight: bold;
                    }
                }

                .active {
                    background-color: #ececec;

                    .linkin {
                        color: #fe7a3f;
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

                //.menu {
                //    color: chocolate;
                //    font-size: 1.2rem;
                //}
            }
            .menu {
                color: chocolate;
                font-size: 1.2rem;
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
  background-color: rgb(231, 218, 193);
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
          background-color: #fe7a3f;
          .linkin {
            color: white;
            font-weight:bold;
          }
        }
        .linkin {
          padding: 0.6rem 1rem;
          text-decoration: none;
          display: flex;
          gap: 1rem;
          color:black;
         
        }
      }
    }
  }
`;