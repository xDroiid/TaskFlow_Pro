import { motion } from 'framer-motion';
import { LayoutGrid, Calendar, BarChart3, History, Timer } from 'lucide-react';

const BottomNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'tasks', icon: LayoutGrid, label: 'Tasks' },
    { id: 'timer', icon: Timer, label: 'Focus' },
    { id: 'schedule', icon: Calendar, label: 'Timeline' },
    { id: 'analytics', icon: BarChart3, label: 'Stats' },
    { id: 'log', icon: History, label: 'Log' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] lg:hidden px-6 pb-6 pt-3 bg-black/40 backdrop-blur-3xl border-t border-white/5 shadow-2xl">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center gap-1.5 flex-1 group outline-none"
            >
              <div className={`p-3 rounded-2xl transition-all duration-500 relative ${
                isActive 
                  ? 'bg-[var(--accent)] text-[var(--text-on-accent)] scale-110 shadow-[0_0_20px_var(--accent-glow)]' 
                  : 'text-muted group-hover:text-primary group-active:scale-95'
              }`}>
                <Icon size={22} strokeWidth={isActive ? 3 : 2} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest transition-all duration-300 font-sans ${
                isActive ? 'opacity-100 text-accent scale-105' : 'opacity-40 text-muted'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
