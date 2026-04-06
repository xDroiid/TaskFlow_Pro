import { motion, AnimatePresence } from 'framer-motion';
import { History, CheckCircle2, Plus, Trash2, Edit3, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ACTION_CONFIG = {
  created:   { icon: Plus,         color: 'text-neon-green',  bg: 'bg-neon-green/10',  label: 'Created' },
  completed: { icon: CheckCircle2, color: 'text-blue-400',    bg: 'bg-blue-400/10',    label: 'Completed' },
  uncompleted:{ icon: Clock,       color: 'text-yellow-400',  bg: 'bg-yellow-400/10',  label: 'Reopened' },
  edited:    { icon: Edit3,        color: 'text-purple-400',  bg: 'bg-purple-400/10',  label: 'Edited' },
  deleted:   { icon: Trash2,       color: 'text-red-400',     bg: 'bg-red-400/10',     label: 'Deleted' },
};

const ActivityLog = ({ logs }) => {
  const { t } = useTranslation();

  const formatTime = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1)  return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
          <History className="text-purple-400" size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Activity <span className="text-purple-400 font-light">Log</span>
          </h2>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold mt-1">
            Task History &amp; Audit Trail
          </p>
        </div>
        <span className="ml-auto text-[10px] font-mono bg-white/5 px-3 py-1 rounded-full text-white/30 border border-white/5">
          {logs.length} entries
        </span>
      </div>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 opacity-20">
          <History size={48} strokeWidth={1} />
          <p className="text-xs font-mono uppercase tracking-[0.4em]">No activity yet</p>
          <p className="text-[10px] text-white/50">Actions you take will appear here</p>
        </div>
      ) : (
        <div className="relative pl-6 border-l-2 border-white/5 space-y-4">
          <AnimatePresence>
            {logs.map((log, i) => {
              const cfg = ACTION_CONFIG[log.action] || ACTION_CONFIG.edited;
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="relative flex items-start gap-4 group"
                >
                  {/* Timeline dot */}
                  <div className={`absolute -left-[29px] top-3 w-3.5 h-3.5 rounded-full ${cfg.bg} border border-white/10 flex items-center justify-center`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${cfg.color.replace('text-', 'bg-')}`} />
                  </div>

                  {/* Card */}
                  <div className="flex-grow bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-2xl px-5 py-4 transition-all">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-1.5 rounded-lg ${cfg.bg} flex-shrink-0`}>
                          <Icon size={12} className={cfg.color} />
                        </div>
                        <div className="min-w-0">
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.color} mr-2`}>
                            {cfg.label}
                          </span>
                          <span className="text-sm font-medium text-white/80 truncate">
                            {log.taskTitle}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] text-white/20 font-mono flex-shrink-0">
                        {formatTime(log.timestamp)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
