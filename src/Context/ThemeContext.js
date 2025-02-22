// ThemeContext.js
import React, { createContext, useState, useContext } from 'react';

// Créer un contexte pour le thème
const ThemeContext = createContext();

// Créer un fournisseur de contexte
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Par défaut, le mode clair est activé

  // Fonction pour basculer entre le mode sombre et le mode clair
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte du thème
export const useTheme = () => useContext(ThemeContext);