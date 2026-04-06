import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BookOpen, Monitor, Keyboard, Terminal, X } from 'lucide-react';

const HelpModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={handleOutsideClick}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-premium p-10 rounded-[3rem] border border-white/5 shadow-2xl relative custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 p-3 rounded-2xl hover:bg-white/5 transition-all text-muted hover:text-primary border border-white/5"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_var(--accent-glow)]">
                <BookOpen className="w-10 h-10 text-accent" />
              </div>
              <div>
                <h2 className="text-4xl font-black tracking-tighter text-primary">
                  Operator <span className="text-accent font-light italic">Manual</span>
                </h2>
                <p className="text-[10px] text-muted uppercase tracking-[0.4em] font-black mt-1">System Architecture & Control Logic</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 hover:border-accent/30 transition-all duration-500 group">
                <h3 className="font-black text-xl mb-4 flex items-center gap-3 text-primary tracking-tight">
                  <Terminal size={22} className="text-blue-500 group-hover:scale-110 transition-transform" />
                  Mission Directives
                </h3>
                <ul className="text-secondary space-y-3 text-sm leading-relaxed">
                  <li className="flex gap-2"><span>•</span> <span>Initialize <strong>New Mission</strong> via basic command input.</span></li>
                  <li className="flex gap-2"><span>•</span> <span>Modify active parameters using the <strong>Edit Matrix</strong>.</span></li>
                  <li className="flex gap-2"><span>•</span> <span><strong>Purge</strong> deprecated nodes using the deletion protocol.</span></li>
                  <li className="flex gap-2"><span>•</span> <span>Cycle status to <strong>Executed</strong> to archive module.</span></li>
                  <li className="flex gap-2"><span>•</span> <span>Dynamic logic allows <strong>Drag-and-Drop</strong> resequencing.</span></li>
                </ul>
              </div>

              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 hover:border-accent/30 transition-all duration-500 group">
                <h3 className="font-black text-xl mb-4 flex items-center gap-3 text-primary tracking-tight">
                  <Monitor size={22} className="text-yellow-500 group-hover:scale-110 transition-transform" />
                  Visual Spectrum
                </h3>
                <p className="text-secondary text-sm mb-4 leading-relaxed">
                  Synchronize the interface across three distinct visual modules via the top navigation relay.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_var(--accent-glow)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Neon Spectrum</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5">
                    <div className="w-2 h-2 rounded-full bg-slate-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Midnight Pro</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Pure Light</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 hover:border-accent/30 transition-all duration-500 group md:col-span-2">
                <h3 className="font-black text-xl mb-4 flex items-center gap-3 text-primary tracking-tight">
                  <Keyboard size={22} className="text-purple-500 group-hover:scale-110 transition-transform" />
                  Neural Translation Matrix
                </h3>
                <p className="text-secondary text-sm leading-relaxed">
                  Access the globe interface in the primary navigation array to toggle language modules (English / Hindi). 
                  All configuration data is tethered to local storage and persists through system reboots.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default HelpModal;
