import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Bell, Zap } from 'lucide-react';

import { useTranslation } from 'react-i18next';

const PomodoroTimer = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [boostActive, setBoostActive] = useState(false);
  const [showTooltip, setShowTooltip] = useState('');
  
  const timerRef = useRef(null);

  const modes = {
    work: { label: t('Focus'), time: 25 * 60, color: 'text-accent', glow: 'var(--accent-glow)', bg: 'bg-accent/10', border: 'border-accent/20' },
    short: { label: t('Short Break'), time: 5 * 60, color: 'text-blue-400', glow: 'rgba(96, 165, 250, 0.3)', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
    long: { label: t('Long Break'), time: 15 * 60, color: 'text-purple-400', glow: 'rgba(192, 38, 211, 0.3)', bg: 'bg-purple-400/10', border: 'border-purple-400/20' }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].time);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setBoostActive(false);
    setTimeLeft(modes[newMode].time);
  };

  const activateBoost = () => {
    setBoostActive(true);
    setIsActive(false);
    setTimeLeft(5 * 60);
    setTimeout(() => setIsActive(true), 100);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((modes[mode].time - timeLeft) / modes[mode].time) * 100;

  return (
    <div className="glass-premium p-10 rounded-[3rem] border border-white/5 flex flex-col items-center relative overflow-hidden group shadow-2xl">
      {/* Background Pulse Glow */}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 blur-[100px] -z-10"
            style={{ backgroundColor: modes[mode].glow, opacity: 0.15 }}
          />
        )}
      </AnimatePresence>

      <div className="flex gap-1.5 mb-10 bg-white/5 p-1.5 rounded-[1.5rem] border border-white/5 shadow-inner">
        {Object.entries(modes).map(([key, config]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              mode === key 
                ? `${config.bg} ${config.color} border ${config.border} shadow-lg ring-1 ring-white/10` 
                : 'text-muted hover:text-primary hover:bg-white/5'
            }`}
          >
            {config.label}
          </button>
        ))}
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center mb-10 group/timer">
        <svg className="w-full h-full -rotate-90 filter drop-shadow-2xl">
          <circle
            cx="128"
            cy="128"
            r="118"
            className="stroke-white/5 fill-none"
            strokeWidth="10"
          />
          <motion.circle
            cx="128"
            cy="128"
            r="118"
            className={`fill-none ${modes[mode].color} stroke-current transition-colors duration-700`}
            strokeWidth="10"
            strokeDasharray="741.05"
            animate={{ strokeDashoffset: 741.05 - (741.05 * progress) / 100 }}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center transform transition-transform group-hover/timer:scale-110 duration-500">
          <span className="text-6xl font-black font-sans tracking-tighter text-primary">
            {formatTime(timeLeft)}
          </span>
          <span className={`text-[10px] uppercase tracking-[0.4em] font-black mt-2 opacity-60 ${modes[mode].color} animate-pulse`}>
            {isActive ? 'Neural Sync' : 'Standby'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={resetTimer}
          className="p-4 rounded-2xl bg-white/5 text-muted hover:text-primary hover:bg-white/10 transition-all border border-white/5 shadow-lg active:scale-90"
        >
          <RotateCcw size={22} />
        </button>
        
        <button
          onClick={toggleTimer}
          className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all shadow-2xl active:scale-95 ${
            isActive 
              ? 'bg-red-500/10 text-red-500 border border-red-500/30' 
              : 'bg-[var(--accent)] text-[var(--text-on-accent)] hover:scale-105 shadow-[0_0_30px_var(--accent-glow)]'
          }`}
        >
          {isActive ? <Pause size={32} /> : <Play size={32} className="translate-x-1" />}
        </button>

        <button
          onClick={activateBoost}
          onMouseEnter={() => setShowTooltip('boost')}
          onMouseLeave={() => setShowTooltip('')}
          className={`relative p-4 rounded-2xl transition-all border shadow-lg active:scale-90 ${
            boostActive
              ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30 shadow-[0_0_20px_rgba(250,204,21,0.3)]'
              : 'bg-white/5 text-muted hover:text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400/20 border-white/5'
          }`}
        >
          <Zap size={22} />
          <AnimatePresence>
            {showTooltip === 'boost' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 text-yellow-400 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl whitespace-nowrap border border-yellow-400/20 shadow-2xl z-20"
              >
                Boost Sprint
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-6 left-6 right-6 bg-[var(--accent)] text-[var(--text-on-accent)] p-4 rounded-2xl flex items-center gap-3 shadow-[0_0_30px_var(--accent-glow)] font-black text-xs uppercase tracking-widest z-10"
          >
            <Bell size={20} />
            Transmission: Session Complete
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PomodoroTimer;
