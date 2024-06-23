import React, { useState } from 'react';

export default function Testbg() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
    color: isDarkMode ? 'white' : 'black',
  };

  return (
    <div style={backgroundStyle} className='vh-100'>
      <h1>Changer le fond de la page</h1>
      <button onClick={toggleDarkMode}>
        {isDarkMode ? 'Mode Clair' : 'Mode Sombre'}
      </button>
    </div>
  );
}