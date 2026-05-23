import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Default to Nepali ('ne')
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'ne');

  const toggleLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
