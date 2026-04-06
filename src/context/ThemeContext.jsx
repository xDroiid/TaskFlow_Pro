import { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { i18n } = useTranslation();
  
  const [theme, setTheme] = useState(() => localStorage.getItem('tf_theme') || 'neon');
  const [language, setLanguage] = useState(() => localStorage.getItem('i18nextLng') || 'en');

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  // Apply theme to html root
  useEffect(() => {
    const root = document.documentElement;
    
    // Clean up existing theme classes
    root.classList.remove('theme-neon', 'theme-dark', 'theme-light', 'dark');

    // Add current theme class
    const themeClass = `theme-${theme}`;
    root.classList.add(themeClass);

    // Support Tailwind 'dark' class for neon and dark themes
    if (theme === 'neon' || theme === 'dark') {
      root.classList.add('dark');
    }

    localStorage.setItem('tf_theme', theme);
  }, [theme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
  }

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, language, changeLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
};

