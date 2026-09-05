import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('swasthyasetu_lang') || 'en';
  });

  const [isBoldLook, setIsBoldLook] = useState(() => {
    return localStorage.getItem('swasthyasetu_bold_look') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('swasthyasetu_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('swasthyasetu_bold_look', isBoldLook);
    if (isBoldLook) {
      document.body.classList.add('bold-look-mode');
    } else {
      document.body.classList.remove('bold-look-mode');
    }
  }, [isBoldLook]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const toggleBoldLook = () => {
    setIsBoldLook(prev => !prev);
  };

  // Translation helper
  const t = (key) => {
    const langDict = translations[lang] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  return (
    <ThemeContext.Provider value={{ lang, setLang, toggleLanguage, isBoldLook, toggleBoldLook, t }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
