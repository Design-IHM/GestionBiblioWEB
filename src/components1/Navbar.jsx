import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { BiSearch, BiUserCircle, BiLogOut, BiGlobe, BiMessageDetail, BiDotsVerticalRounded } from "react-icons/bi";
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
    const { setSearchWord, searchWord } = useContext(UserContext);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

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

    // Fonction de retour arrière modifiée pour éviter les pages d'authentification
    const goBack = () => {
        // Liste des routes d'authentification à éviter
        const authRoutes = ['/', '/login', '/forget-password', '/registrationValidation', '/registrationConfirmation'];
        
        // Si nous sommes sur la page d'accueil, ne rien faire
        if (location.pathname === "/accueil") {
            return;
        }
        
        // Utiliser l'historique natif du navigateur pour revenir en arrière
        window.history.back();
        
        // Vérifier après un court délai si on est sur une page d'authentification
        setTimeout(() => {
            if (authRoutes.includes(window.location.pathname)) {
                navigate('/accueil');
            }
        }, 100);
    };

    const handleLogout = () => {
        // Afficher la rétroaction de déconnexion
        setIsLoggingOut(true);
        
        // Attendre un peu avant de rediriger vers la page de connexion
        setTimeout(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user_id");
            navigate("/");
        }, 1500);
    };

    // Traductions directes pour la Navbar
    const translations = {
        search_student: language === "FR" ? "Rechercher un étudiant" : "Search for a student",
        search_document: language === "FR" ? "Rechercher un document" : "Search for a document",
        change_language: language === "FR" ? "Changer de langue" : "Change language",
        light_mode: language === "FR" ? "Mode clair" : "Light mode",
        dark_mode: language === "FR" ? "Mode sombre" : "Dark mode",
        profile: language === "FR" ? "Profil" : "Profile",
        logout: language === "FR" ? "Déconnexion" : "Logout",
        logging_out: language === "FR" ? "Déconnexion..." : "Logging out..."
    };

    // Vérifier si le bouton de retour doit être affiché
    const shouldShowBackButton = location.pathname !== "/accueil";

    return (
        <NavbarContainer darkMode={isDarkMode}>
            <LogoSection>
                {shouldShowBackButton && (
                    <BackButton onClick={goBack} darkMode={isDarkMode}>
                        <IoIosArrowBack />
                    </BackButton>
                )}
                <Logo darkMode={isDarkMode}></Logo>
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

            <MenuSection>
                <MobileMenuToggle
                    darkMode={isDarkMode}
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                    <BiDotsVerticalRounded />
                </MobileMenuToggle>
            </MenuSection>

            <NavActions showMobile={showMobileMenu} darkMode={isDarkMode}>
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

                <NavButton onClick={handleLogout} darkMode={isDarkMode} title={translations.logout}>
                    <BiLogOut />
                    <ButtonLabel>{translations.logout}</ButtonLabel>
                </NavButton>
            </NavActions>
        </NavbarContainer>
    );
}

// Composant d'animation pour les points de chargement
const LoadingDots = () => {
    return (
        <DotsContainer>
            <Dot delay="0s" />
            <Dot delay="0.2s" />
            <Dot delay="0.4s" />
        </DotsContainer>
    );
};

// Styled Components
const DotsContainer = styled.div`
    display: flex;
    align-items: center;
    margin-left: 5px;
`;

const Dot = styled.span`
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: currentColor;
    margin: 0 2px;
    opacity: 0;
    animation: fadeInOut 1.4s infinite;
    animation-delay: ${props => props.delay || "0s"};
    
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
    }
`;

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
  z-index: 100;
`;


const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MenuSection = styled.div`
  margin-left: auto;
  
  @media (min-width: 769px) {
    display: none;
  }
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
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  transition: all 0.3s ease;
  font-size: 0.875rem;
  opacity: ${props => props.disabled ? 0.7 : 1};

  &:hover {
    background-color: ${props => !props.disabled && (props.darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)")};
  }

  svg {
    font-size: 1.25rem;
  }
`;

// Nouveau composant spécifique pour le bouton de déconnexion
const LogoutButton = styled(NavButton)`
  /* Couleur chocolate lorsqu'en déconnexion */
  color: ${props => props.isLoggingOut ? 'chocolate' : props.darkMode ? "#f3f4f6" : "#1f2937"};
  font-weight: ${props => props.isLoggingOut ? 'bold' : 'normal'};
  
  /* Animation de pulsation subtile lorsqu'en déconnexion */
  animation: ${props => props.isLoggingOut ? 'pulse 1.5s infinite' : 'none'};
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
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
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: ${props => props.darkMode ? "#f3f4f6" : "#1f2937"};
  
  svg {
    font-size: 1.5rem;
  }
`;