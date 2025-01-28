import React, { useContext } from "react";
import styled from "styled-components";
import { BiSearch } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import { UserContext } from "../App";

import { RiSunFill, RiMoonFill } from "react-icons/ri";
export default function Navbar() {
  const { searchPage, searchWord, setSearchWord } = useContext(UserContext);

  const goBack = () => {
    window.history.back(); // Revenir à la page précédente
  };

  const { darkMode, toggleDarkMode } = useContext(UserContext);

  const DarkModeButton = styled.button`
    background-color: ${(props) => (props.darkMode ? "#ffffff" : "#333333")};
    color: ${(props) => (props.darkMode ? "#000000" : "#ffffff")};
    border: none;
    border-radius: 30px;
    padding: 5px 10px;
    cursor: pointer;
  `;

  return (
    <Nav style={{backgroundColor: darkMode ? "#333333" : "transparent", color: darkMode ? "#ffffff" : "#000000"}}>
      <div className="backButton" onClick={goBack}>
        <IoIosArrowBack/>
      </div>
      {searchPage && (
        <div className="search">
          <BiSearch className="searchIcon"/>
          <input
            className="searchInput"
            onChange={(e) => setSearchWord(e.target.value)}
            value={searchWord}
            type="text"
            placeholder={
              searchPage === "etudiant"
                ? "Search Student"
                : searchPage === "document"
                  ? "Search Document"
                  : "Search Document"
            }
          />
        </div>
      )}

      <div className="titleNav">
        <DarkModeButton className="darkModeButton" darkMode={darkMode} onClick={toggleDarkMode}>
          {darkMode ? <RiSunFill/> : <RiMoonFill/>}
        </DarkModeButton>
      </div>
    </Nav>

  );
}

const Nav = styled.nav`
  display: flex;
  margin-top: -25px;
  margin-bottom: 5px;
  justify-content: space-between;
  align-items: center;
  color: black;
  background-color: #ececec;

  .backButton {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    svg {
      color: black;
      font-size: 1rem;
    }
  }

  .search {
    display: flex;
    align-items: center;
    gap: 1rem;
    background-color: #fff;
    border-radius: 1rem;
    padding: 0.5rem;
    border-color: #6c757d;
  }

  .searchIcon {
    color: #000;
    font-size: 1rem;
  }

  .searchInput {
    flex: 1;
    border: none;
    background-color: transparent;
    color: gray;
    font-size: 1rem;
    padding: 0.5rem;
    outline: none;

    &::placeholder {
      color: gray;
    }
  }

  @media screen and (min-width: 280px) and (max-width: 1080px) {
    flex-direction: column;
    margin-top: 0;

    .title {
      h1 {
        span {
          display: block;
          margin: 1rem 0;
        }
      }
  }
`;
