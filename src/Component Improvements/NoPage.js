import React, { useEffect } from 'react';
import './NoPage.css';

const NoPage = () => {
    useEffect(() => {
        document.body.classList.add('error-404');

        return () => {
            document.body.classList.remove('error-404');
        };
    }, []);

    return (
        <div className="no-page-container">
            <h1 className="no-page-heading">Erreur 404</h1>
            <p className="no-page-message">Désolé, la page que vous recherchez est introuvable.</p>
        </div>
    );
};

export default NoPage;