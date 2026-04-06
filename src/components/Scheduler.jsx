import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ChevronRight, AlertCircle, CheckCircle2, LayoutGrid, List, Inbox } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const SchedulerTaskRow = ({ task, updateTask, deleteTask, startEdit }) => {
  const priorityColors = {
    high: 'bg-red-500/10 text-red-500 border-red-500/20',
    medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    low: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  };
  const priorityBar = {
    high: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]',
    medium: 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]',
    low: 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`group relative flex items-center gap-4 p-5 rounded-2xl border transition-all duration-500 glass-premium card-3d overflow-hidden ${
        task.completed ? 'opacity-50' : ''
      }`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${priorityBar[task.priority || 'medium']}`} />

      <button
        onClick={() => updateTask(task._id, { completed: !task.completed })}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
          task.completed
            ? 'bg-accent border-accent text-on-accent shadow-[0_0_15px_var(--accent-glow)]'
            : 'border-border hover:border-accent bg-white/5'
        }`}
      >
        {task.completed && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
        )}
      </button>

      <div className="flex-grow min-w-0">
        <p className={`text-sm font-black tracking-tight truncate transition-all duration-500 ${task.completed ? 'line-through text-muted italic' : 'text-primary'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          {task.priority && (
            <span className={`text-[8px] uppercase font-black px-2 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          )}
          {task.labels?.filter(Boolean).map((label, i) => (
            <span key={i} className="text-[8px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-muted">
              {label}
            </span>
          ))}
          {task.dueDate && (
            <span className="text-[9px] text-muted font-bold font-sans tracking-wide uppercase">
              {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
        <button
          onClick={() => startEdit(task)}
          className="p-2 text-muted hover:text-primary hover:bg-white/5 rounded-xl transition-all"
        >
          ✏️
        </button>
        <button
          onClick={() => deleteTask(task._id)}
          className="p-2 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
        >
          🗑️
        </button>
      </div>
    </motion.div>
  );
};

const Scheduler = ({ tasks, updateTask, deleteTask, startEdit }) => {
  const { t } = useTranslation();
  const [view, setView] = useState('grouped');

  const scheduledTasks = useMemo(() => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const groups = { overdue: [], today: [], tomorrow: [], upcoming: [], unscheduled: [] };

    (tasks || []).forEach(task => {
      if (!task.dueDate) {
        groups.unscheduled.push(task);
        return;
      }
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);

      if (taskDate < today && !task.completed) {
        groups.overdue.push(task);
      } else if (taskDate.getTime() === today.getTime()) {
        groups.today.push(task);
      } else if (taskDate.getTime() === tomorrow.getTime()) {
        groups.tomorrow.push(task);
      } else if (taskDate >= dayAfterTomorrow) {
        groups.upcoming.push(task);
      } else {
        groups.unscheduled.push(task);
      }
    });

    return groups;
  }, [tasks]);

  const timelineTasks = useMemo(() => {
    return (tasks || [])
      .filter(t => t.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [tasks]);

  const sections = [
    { key: 'overdue', title: t('Critical Overdue'), icon: AlertCircle, color: 'text-red-500', dot: 'bg-red-500', glow: 'rgba(239,68,68,0.2)' },
    { key: 'today', title: t('Current Mission'), icon: Clock, color: 'text-accent', dot: 'bg-accent', glow: 'var(--accent-glow)' },
    { key: 'tomorrow', title: t('Future Ops'), icon: Calendar, color: 'text-blue-500', dot: 'bg-blue-500', glow: 'rgba(59,130,246,0.2)' },
    { key: 'upcoming', title: t('Strategic Roadmap'), icon: ChevronRight, color: 'text-purple-500', dot: 'bg-purple-500', glow: 'rgba(168,85,247,0.2)' },
    { key: 'unscheduled', title: t('Uncategorized'), icon: Inbox, color: 'text-muted', dot: 'bg-white/20', glow: 'transparent' },
  ];

  return (
    <div className="w-full space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_var(--accent-glow)]">
            <Calendar className="text-accent" size={24} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-3xl font-black tracking-tighter text-primary">Smart <span className="text-accent font-light italic">Scheduler</span></h2>
            <p className="text-[10px] text-muted uppercase tracking-[0.4em] font-black mt-1">Tactical Timeline Deployment</p>
          </div>
        </div>

        <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
          <button
            onClick={() => setView('grouped')}
            className={`p-3 rounded-xl transition-all duration-300 ${view === 'grouped' ? 'bg-accent text-black shadow-lg scale-110' : 'text-muted hover:text-primary hover:bg-white/5'}`}
            title="Grouped Logic"
          >
            <LayoutGrid size={18} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => setView('timeline')}
            className={`p-3 rounded-xl transition-all duration-300 ${view === 'timeline' ? 'bg-[var(--accent)] text-[var(--text-on-accent)] shadow-lg scale-110' : 'text-muted hover:text-primary hover:bg-white/5'}`}
            title="Timeline Sequence"
          >
            <List size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'grouped' && (
          <motion.div
            key="grouped"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            {sections.map(({ key, title, icon: Icon, color, dot, glow }) => {
              const sectionTasks = scheduledTasks[key] || [];
              return (
                <div key={key}>
                  <div className="flex items-center gap-4 mb-6 sticky top-0 py-2 z-10">
                    <div className={`p-3 rounded-xl bg-white/5 ${color} shadow-[0_0_15px_${glow}]`}>
                      <Icon size={18} strokeWidth={2.5} />
                    </div>
                    <h3 className={`text-[11px] font-black uppercase tracking-[0.3em] font-sans ${color}`}>{title}</h3>
                    <div className="h-px flex-grow bg-white/5" />
                    <span className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-muted font-sans font-black border border-white/5">
                      {sectionTasks.length} UNITS
                    </span>
                  </div>

                  {sectionTasks.length === 0 ? (
                    <div className="pl-16 py-4">
                      <p className="text-[10px] text-muted italic uppercase tracking-widest opacity-30">
                        {t('No mission components detected')}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 pl-4 border-l-2 border-white/5 ml-6">
                      {sectionTasks.map(task => (
                        <SchedulerTaskRow
                          key={task._id}
                          task={task}
                          updateTask={updateTask}
                          deleteTask={deleteTask}
                          startEdit={startEdit}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}

        {view === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {timelineTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 opacity-20 gap-6">
                <Calendar size={64} strokeWidth={1} className="text-accent" />
                <p className="text-[10px] font-black uppercase tracking-[0.6em] font-mono text-center">{t('No scheduled timeline modules detected')}</p>
              </div>
            ) : (
              <div className="relative pl-8 border-l-2 border-white/5 ml-4 space-y-10 py-4">
                {timelineTasks.map((task, i) => {
                  const date = new Date(task.dueDate);
                  const isToday = date.toDateString() === new Date().toDateString();
                  return (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, type: "spring", stiffness: 200 }}
                      className="relative"
                    >
                      <div className={`absolute -left-[45px] top-4 w-6 h-6 rounded-full border-4 border-bg-body z-10 transition-all duration-500 ${
                        isToday ? 'bg-accent shadow-[0_0_20px_var(--accent-glow)] scale-125' : task.completed ? 'bg-white/20' : 'bg-blue-500'
                      }`} />

                      <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-3 font-sans ${
                        isToday ? 'text-accent' : 'text-muted'
                      }`}>
                        {isToday ? `⚡ SYNCED: ${t('Today')}` : date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>

                      <SchedulerTaskRow
                        task={task}
                        updateTask={updateTask}
                        deleteTask={deleteTask}
                        startEdit={startEdit}
                      />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Scheduler;
