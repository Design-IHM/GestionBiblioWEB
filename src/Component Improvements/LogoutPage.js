import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogoutPage.css';
import { BiSearch } from 'react-icons/bi';
import Loading from '../components1/Loading';
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';

const LogoutPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3); // Temps de compte à rebours en secondes
  const [logoutCompleted, setLogoutCompleted] = useState(false); // État de déconnexion

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Rediriger vers la page de connexion après la déconnexion
    setTimeout(() => {
      setLogoutCompleted(true);
      navigate('/');
    }, countdown * 1000); // Redirection après le compte à rebours

    return () => {
      clearInterval(countdownInterval);
    };
  }, [navigate, countdown]);

  return (
    <div className="content-box">
      <Sidebar />
      <Navbar />
      <div className="logout-page-container">
        <h1 className="logout-page-heading">Déconnexion</h1>
        {!logoutCompleted ? (
          <>
            <p className="logout-page-message">Vous avez été déconnecté avec succès.</p>
            <p className="logout-page-redirect">Vous serez redirigé vers la page de connexion dans {countdown} seconde{countdown !== 1 && 's'}...</p>

            <Loading className="loading" />
          </>
        ) : (
          <>
            <BiSearch />
            <p className="logout-page-completed">Déconnexion terminée.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default LogoutPage;