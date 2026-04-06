import { useState, useRef, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
];

const LanguageSelector = () => {
  const { language, changeLanguage } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectLanguage = (code) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const currentLangName = languages.find(l => l.code === language)?.name.split(' ')[0] || language.toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
        title={t('Language')}
      >
        <Globe size={18} />
        <span className="hidden sm:inline font-medium text-sm">{currentLangName}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto bg-black/90 backdrop-blur-md border border-white/10 rounded-xl shadow-xl z-50 custom-scrollbar"
          >
            <div className="p-2 flex flex-col gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    language === lang.code 
                      ? 'bg-neon-green/20 text-neon-green font-medium' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
