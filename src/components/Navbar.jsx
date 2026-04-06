import { useState, useContext, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext';
import { Sun, Moon, Monitor, HelpCircle, Zap, ChevronDown, Check } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import HelpModal from './HelpModal';

const Navbar = () => {
  const { theme, changeTheme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const themeRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setIsThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes = [
    { id: 'neon', label: 'Neon Spectrum', icon: Monitor, color: 'text-accent' },
    { id: 'dark', label: 'Midnight Pro', icon: Moon, color: 'text-slate-400' },
    { id: 'light', label: 'Pure Light', icon: Sun, color: 'text-amber-500' }
  ];

  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  return (
    <>
      <nav className="glass-premium sticky top-0 z-[100] w-full py-4 px-6 border-b border-white/5 backdrop-blur-3xl">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group relative">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-10 h-10 bg-[var(--accent)] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-[0_0_30px_var(--accent-glow)] transition-all"
            >
              <Zap size={22} className="text-[var(--text-on-accent)] fill-current" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-primary tracking-tighter group-hover:text-accent transition-colors leading-none">
                TaskFlow
              </span>
              <span className="text-[8px] text-muted uppercase tracking-[0.4em] mt-1 font-bold">PREMIUM EDITION</span>
            </div>
          </Link>

          {/* Right side controls */}
          <div className="flex items-center gap-3 md:gap-4">
            <LanguageSelector />

            {/* Theme Dropdown */}
            <div className="relative" ref={themeRef}>
              <button
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className="flex items-center gap-2 p-2 px-3 rounded-xl hover:bg-white/5 transition-all text-secondary hover:text-primary border border-transparent hover:border-white/10"
              >
                <currentTheme.icon size={18} className={currentTheme.color} />
                <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">{currentTheme.label}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isThemeOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isThemeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 glass-premium rounded-2xl overflow-hidden p-1.5 shadow-2xl z-[110]"
                  >
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          changeTheme(t.id);
                          setIsThemeOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-xs font-bold uppercase tracking-wider ${
                          theme === t.id 
                            ? 'bg-white/10 text-primary' 
                            : 'text-muted hover:text-primary hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <t.icon size={16} className={t.color} />
                          {t.label}
                        </div>
                        {theme === t.id && <Check size={14} className="text-accent" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-8 w-px bg-white/10 mx-1 hidden md:block" />

            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => setIsHelpOpen(true)}
                className="p-2.5 text-muted hover:text-primary hover:bg-white/5 rounded-xl transition-all"
                title={t('Help')}
              >
                <HelpCircle size={18} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
};

export default Navbar;

