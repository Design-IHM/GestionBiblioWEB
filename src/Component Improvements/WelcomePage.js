import Sidebar from "../components1/Sidebar";
import Navbar from "../components1/Navbar";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/bio.webp";

const Accueil = () => {
  const navigate = useNavigate();

  const mainStyle = {
    margin: "5px",
    marginTop: "40px",
    padding: "20%",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    borderRadius: "15px",
    height: "75vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(75px)",
  };
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  };

  const paragraphStyle = {
    fontSize: "25px",
    marginTop: "40px", // Ajuster l'espacement entre les paragraphes
    fontWeight: "bold",
    color: "#333", // Couleur de texte personnalisée
  };

  const buttonStyle = {
    width: "200px",
    height: "70px",
    backgroundColor: "#fe7a3f",
    color: "white",
    borderRadius: "25px",
    margin: "15px",
    fontSize: "18px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    outline: "none",
    fontFamily: "Arial",
  };

  return (
    <>
      <Sidebar />
      <Navbar />
      <main style={mainStyle}>
        <div style={containerStyle}>
          <p style={paragraphStyle}>
            Bienvenue à BIBLIO ENSPY, votre application web de gestion de la
            bibliothèque de l'École Nationale Supérieure Polytechnique de
            Yaoundé (ENSPY).
          </p>
          <p style={paragraphStyle}>
            Depuis cette plateforme, vous, chers membres de la cellule
            documentation, avez la possibilité de gérer les documents et les
            réservations de façon automatique, en toute simplicité et
            tranquillité.
          </p>

          <button
            style={buttonStyle}
            onClick={() => navigate("/departement")}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#ff9567")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#fe7a3f")}
          >
            Gestion des livres
          </button>
          <button
            style={buttonStyle}
            onClick={() => navigate("/departementMem")}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#ff9567")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#fe7a3f")}
          >
            Gestion des mémoires
          </button>
        </div>
      </main>
    </>
  );
};

export default Accueil;
