import Sidebar from "../components1/Sidebar";
import Navbar from "../components1/Navbar";
import { useNavigate } from "react-router-dom";
import left from "../assets/Left.png"
import { BookHalf, Memory } from "react-bootstrap-icons";
import "./WelcomePage.css"

const Accueil = () => {
  const navigate = useNavigate();

  return (
    <div className="content-box">
      <Sidebar/>
      <Navbar/>
      <div className="hero-banner">
        <div className="hero">
          <h1>Bienvenue à <span className="highlight">BIBLIO ENSPY</span></h1>
          <p>
            Votre application web de gestion de la bibliothèque de l'École Nationale Supérieure Polytechnique de Yaoundé
            (ENSPY).
          </p>
          <p>
            Depuis cette plateforme, vous, chers membres de la cellule documentation, avez la possibilité de gérer les
            documents et les réservations de façon automatique, en toute simplicité et tranquillité.
          </p>
        </div>

        <img
          src={left}
          alt="banner"
          className="img-banner"
        />
      </div>

      <div className="features">
        <h2><span className="emoji">🤔</span>. Nos Services: </h2>
        <button
          className="button-style"
          onClick={() => navigate("/departement")}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#ff9567")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#fe7a3f")}
        >
          <BookHalf
            size="1.5rem"
          />
          Gestion des livres
        </button>
        <button
          className="button-style"
          onClick={() => navigate("/departementMem")}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#ff9567")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#fe7a3f")}
        >
          <Memory
            size="1.5rem"
          />
          <span>
            Gestion des mémoires
          </span>
        </button>
      </div>
    </div>
  );
};

export default Accueil;
