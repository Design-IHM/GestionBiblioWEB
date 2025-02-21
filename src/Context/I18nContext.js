import React, { createContext, useContext, useState } from 'react';

// Créer le contexte
const I18nContext = createContext();

// Fournir un moyen d'accéder au contexte
export const useI18n = () => {
  return useContext(I18nContext);
};

// Composant fournisseur pour envelopper l'application
export const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Initialiser la langue à partir du localStorage ou utiliser 'FR' par défaut
    return localStorage.getItem('language') || 'FR';
  });

  // Fonction pour changer la langue
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang); // Stocker la langue dans le localStorage
  };

  return (
    <I18nContext.Provider value={{ language, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};
