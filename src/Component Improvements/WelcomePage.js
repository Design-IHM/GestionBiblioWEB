import React, { useContext } from "react";
import Sidebar from "../components1/Sidebar";
import Navbar from "../components1/Navbar";
import { useNavigate } from "react-router-dom";
import left from "../assets/Left.png";
import { BookHalf, Memory } from "react-bootstrap-icons";
import "./WelcomePage.css";
import { useI18n } from "../Context/I18nContext";

const Accueil = () => {
  const navigate = useNavigate();
  const { language } = useI18n();

  // Traductions directes pour la page d'accueil
  const translations = {
    welcome: language === "FR" ? "Bienvenue à" : "Welcome to",
    biblio_enspy: "BIBLIO ENSPY",
    description: language === "FR" ?
      "Votre application web de gestion de la bibliothèque de l'École Nationale Supérieure Polytechnique de Yaoundé (ENSPY)." :
      "Your web application for managing the library of the National Advanced School of Public Works of Yaoundé (ENSPY).",
    manage_documents: language === "FR" ?
      "Depuis cette plateforme, vous, chers membres de la cellule documentation, avez la possibilité de gérer les documents et les réservations de façon automatique, en toute simplicité et tranquillité." :
      "From this platform, you, dear members of the documentation unit, have the ability to manage documents and reservations automatically, with ease and peace of mind.",
    our_services: language === "FR" ? "Nos Services:" : "Our Services:",
    book_management: language === "FR" ? "Gestion des livres" : "Book Management",
    thesis_management: language === "FR" ? "Gestion des mémoires" : "Thesis Management"
  };

  return (
    <div className="content-box">
      <Sidebar />
      <Navbar />
      <div className="hero-banner">
        <div className="hero">
          <h1>{translations.welcome} <span className="highlight">{translations.biblio_enspy}</span></h1>
          <p>{translations.description}</p>
          <p>{translations.manage_documents}</p>
        </div>

        <img src={left} alt="banner" className="img-banner" />
      </div>

      <div className="features">
        <h2><span className="emoji">🤔</span>. {translations.our_services}</h2>
        <button
          className="button-style"
          onClick={() => navigate("/departement")}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#ff9567")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#fe7a3f")}
        >
          <BookHalf size="1.5rem" />
          {translations.book_management}
        </button>
        <button
          className="button-style"
          onClick={() => navigate("/departementMem")}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#ff9567")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#fe7a3f")}
        >
          <Memory size="1.5rem" />
          <span>{translations.thesis_management}</span>
        </button>
      </div>
    </div>
  );
};

export default Accueil;
