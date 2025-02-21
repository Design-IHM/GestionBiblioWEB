import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { BiSearch, BiUserCircle, BiLogOut, BiGlobe, BiMessageDetail } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import { RiSunFill, RiMoonFill } from "react-icons/ri";
import { useNavigate, useLocation } from "react-router-dom";
import { useI18n } from "../Context/I18nContext";
import { useTheme } from "../Context/ThemeContext";
import { UserContext } from "../App";

export default function Navbar() {
    const { isDarkMode, toggleTheme } = useTheme();
    const { language, changeLanguage } = useI18n();
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0); 
    const {setSearchWord, searchWord } = useContext(UserContext);

    

    // Écouter l'événement personnalisé pour mettre à jour le nombre de messages non lus
    useEffect(() => {
        const handleUnreadMessagesUpdate = (event) => {
            setUnreadMessagesCount(event.detail);
        };

        window.addEventListener("unreadMessagesUpdate", handleUnreadMessagesUpdate);

        // Nettoyer l'écouteur d'événement
        return () => {
            window.removeEventListener("unreadMessagesUpdate", handleUnreadMessagesUpdate);
        };
    }, []);

    // Déterminer si la page actuelle devrait avoir une barre de recherche
    const [searchConfig, setSearchConfig] = useState({ show: false, type: "" });

    useEffect(() => {
        const path = location.pathname;

        if (path === "/listeEtudiant") {
            setSearchConfig({ show: true, type: "etudiant" });
        } else if (["/catalogue", "/memoireParDepartement"].includes(path)) {
            setSearchConfig({ show: true, type: "document" });
        } else {
            setSearchConfig({ show: false, type: "" });
        }
    }, [location]);

    const goBack = () => {
        window.history.back();
    };

    

    // Traductions directes pour la Navbar
    const translations = {
        search_student: language === "FR" ? "Rechercher un étudiant" : "Search for a student",
        search_document: language === "FR" ? "Rechercher un document" : "Search for a document",
        change_language: language === "FR" ? "Changer de langue" : "Change language",
        light_mode: language === "FR" ? "Mode clair" : "Light mode",
        dark_mode: language === "FR" ? "Mode sombre" : "Dark mode",
        profile: language === "FR" ? "Profil" : "Profile",
        logout: language === "FR" ? "Déconnexion" : "Logout"
    };

    return (
        <NavbarContainer darkMode={isDarkMode}>
            <LogoSection>
                <BackButton onClick={goBack} darkMode={isDarkMode}>
                    <IoIosArrowBack />
                </BackButton>
                <Logo darkMode={isDarkMode}></Logo>
                <MobileMenuToggle
                    darkMode={isDarkMode}
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </MobileMenuToggle>
            </LogoSection>

            {searchConfig.show && (
                <SearchSection darkMode={isDarkMode}>
                    <SearchIcon darkMode={isDarkMode}>
                        <BiSearch />
                    </SearchIcon>
                    <SearchInput
                        onChange={(e) => setSearchWord(e.target.value)}
                        value={searchWord}
                        type="text"
                        placeholder={searchConfig.type === "etudiant" ? translations.search_student : translations.search_document}
                        darkMode={isDarkMode}
                    />
                </SearchSection>
            )}

            <NavActions showMobile={showMobileMenu} darkMode={isDarkMode}>
                {/* Bouton pour les messages */}
                <NavButton onClick={() => navigate("/messages")} darkMode={isDarkMode} title="Messages">
                    <BiMessageDetail />
                    {unreadMessagesCount > 0 && (
                        <UnreadBadge>{unreadMessagesCount}</UnreadBadge>
                    )}
                </NavButton>

                <NavButton onClick={() => changeLanguage(language === "FR" ? "EN" : "FR")} darkMode={isDarkMode} title={translations.change_language}>
                    <BiGlobe />
                    <ButtonLabel>{language}</ButtonLabel>
                </NavButton>

                <NavButton onClick={toggleTheme} darkMode={isDarkMode} title={isDarkMode ? translations.light_mode : translations.dark_mode}>
                    {isDarkMode ? <RiSunFill /> : <RiMoonFill />}
                    <ButtonLabel>{isDarkMode ? translations.light_mode : translations.dark_mode}</ButtonLabel>
                </NavButton>

                <NavButton onClick={() => navigate("/profil")} darkMode={isDarkMode} title={translations.profile}>
                    <BiUserCircle />
                    <ButtonLabel>{translations.profile}</ButtonLabel>
                </NavButton>

                <NavButton onClick={() => navigate("/logoutPage")} darkMode={isDarkMode} title={translations.logout}>
                    <BiLogOut />
                    <ButtonLabel>{translations.logout}</ButtonLabel>
                </NavButton>
            </NavActions>
        </NavbarContainer>
    );
}

// Styled Components (rest of your code)
const UnreadBadge = styled.div`
    background: #db991d;
    color: white;
    font-size: 12px;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 50%;
    margin-left: 8px;
`;
const NavbarContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.darkMode ? "#1f2937" : "#ffffff"};
  color: ${props => props.darkMode ? "#f3f4f6" : "#1f2937"};
  padding: 0.75rem 1.5rem;

  transition: all 0.3s ease;
  flex-wrap: wrap;
  position: sticky;
  top: 0;
  z-index: 1000;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.darkMode ? "#f3f4f6" : "#1f2937"};
  letter-spacing: 0.5px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${props => props.darkMode ? "#f3f4f6" : "#1f2937"};
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"};
  }

  svg {
    font-size: 1.25rem;
  }
`;

const SearchSection = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.darkMode ? "#374151" : "#f3f4f6"};
  border-radius: 8px;
  padding: 0.5rem 1rem;
  flex: 1;
  max-width: 400px;
  margin: 0 1rem;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.darkMode ? "#4b5563" : "#e5e7eb"};

  @media (max-width: 768px) {
    margin: 0.75rem 0;
    order: 3;
    width: 100%;
    max-width: 100%;
  }
`;

const SearchIcon = styled.div`
  color: ${props => props.darkMode ? "#9ca3af" : "#6b7280"};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;

  svg {
    font-size: 1.25rem;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background-color: transparent;
  color: ${props => props.darkMode ? "#f3f4f6" : "#1f2937"};
  font-size: 0.875rem;
  outline: none;
  padding: 0.25rem 0;

  &::placeholder {
    color: ${props => props.darkMode ? "#9ca3af" : "#9ca3af"};
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: 100%;
    right: 0;
    background-color: ${props => props.darkMode ? "#1f2937" : "#ffffff"};
    width: 200px;
    padding: ${props => props.showMobile ? "1rem" : "0"};
    max-height: ${props => props.showMobile ? "300px" : "0"};
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    opacity: ${props => props.showMobile ? "1" : "0"};
    pointer-events: ${props => props.showMobile ? "all" : "none"};
    z-index: 999;
    border-radius: 0 0 8px 8px;

    & > button {
      width: 100%;
      justify-content: flex-start;
      padding: 0.75rem;
    }
  }
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: transparent;
  border: none;
  color: ${props => props.darkMode ? "#f3f4f6" : "#1f2937"};
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.875rem;

  &:hover {
    background-color: ${props => props.darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"};
  }

  svg {
    font-size: 1.25rem;
  }
`;

const ButtonLabel = styled.span`
  @media (max-width: 1024px) {
    display: none;
  }

  @media (max-width: 768px) {
    display: inline;
  }
`;

const MobileMenuToggle = styled.button`
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;

  span {
    display: block;
    height: 2px;
    width: 100%;
    background-color: ${props => props.darkMode ? "#f3f4f6" : "#1f2937"};
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  @media (max-width: 768px) {
    display: flex;
    margin-left: auto;
  }
`;
