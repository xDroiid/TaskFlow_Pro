import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Plus, Search, Calendar, BarChart3, LayoutGrid, Sparkles, Clock, Bell, Tag, History, Download, Upload, Trash2, Timer } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import PomodoroTimer from '../components/PomodoroTimer';
import Scheduler from '../components/Scheduler';
import AnalyticsPanel from '../components/AnalyticsPanel';
import ActivityLog from '../components/ActivityLog';
import BottomNav from '../components/BottomNav';

const Dashboard = () => {
  const { t } = useTranslation();
  
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('tf_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('tasks');
  const [isAdding, setIsAdding] = useState(false);
  const [editTask, setEditTask] = useState(null);
  
  const [activityLogs, setActivityLogs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tf_logs') || '[]');
    } catch {
      return [];
    }
  });

  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    priority: 'medium', 
    dueDate: '',
    labels: [],
    subtasks: [],
    reminderTime: ''
  });

  // Persist tasks and logs
  useEffect(() => {
    localStorage.setItem('tf_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('tf_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  const addLog = useCallback((action, taskTitle) => {
    const entry = { id: Date.now(), action, taskTitle, timestamp: new Date().toISOString() };
    setActivityLogs(prev => [entry, ...prev].slice(0, 100));
  }, []);

  const handleUpdate = useCallback((id, updates) => {
    setTasks(prev => {
      const updatedTasks = prev.map(t => t._id === id ? { ...t, ...updates } : t);
      
      if ('completed' in updates) {
        const task = prev.find(t => t._id === id);
        addLog(updates.completed ? 'completed' : 'uncompleted', task?.title || 'Task');
      } else {
        const task = prev.find(t => t._id === id);
        addLog('edited', task?.title || 'Task');
      }
      
      return updatedTasks;
    });
  }, [addLog]);

  const handleDelete = useCallback((id) => {
    const task = tasks.find(t => t._id === id);
    setTasks(prev => prev.filter(t => t._id !== id));
    addLog('deleted', task?.title || 'Task');
  }, [tasks, addLog]);

  const onDragEnd = useCallback((result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
  }, [tasks]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editTask) {
      handleUpdate(editTask._id, formData);
    } else {
      const newTask = {
        ...formData,
        _id: Date.now().toString(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTasks(prev => [newTask, ...prev]);
      addLog('created', formData.title);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', priority: 'medium', dueDate: '', labels: [], subtasks: [], reminderTime: '' });
    setIsAdding(false);
    setEditTask(null);
  };

  const clearAllTasks = () => {
    if (window.confirm("Are you sure you want to clear all tasks? This action cannot be undone.")) {
      setTasks([]);
      addLog('cleared all', 'Data Matrix');
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `taskflow_export_${new Date().toISOString().slice(0,10)}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    addLog('exported', 'Task Database');
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedTasks = JSON.parse(event.target.result);
        if (Array.isArray(importedTasks)) {
          setTasks(importedTasks);
          addLog('imported', `${importedTasks.length} Tasks`);
          alert("Data imported successfully!");
        } else {
          alert("Invalid file format.");
        }
      } catch (err) {
        alert("Error parsing JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const filteredTasks = useMemo(() => tasks.filter(task => {
    if (filter === 'completed' && !task.completed) return false;
    if (filter === 'pending' && !!task.completed) return false;
    if (searchQuery && !task.title?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }), [tasks, filter, searchQuery]);

  const stats = useMemo(() => ({
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.completed).length,
  }), [tasks]);

  const pageVariants = {
    initial: { opacity: 0, scale: 0.98, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.98, y: -10 },
  };

  const pageTransition = {
    type: "spring",
    stiffness: 260,
    damping: 20
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-12 relative">
      {/* Dynamic Background Aura */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent opacity-[0.03] blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-accent opacity-[0.02] blur-[100px]" />
      </div>

      <div className="max-w-7xl w-full mx-auto px-4 py-12 flex flex-col gap-8 md:px-12">
        
        {/* Main Grid UI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative">
          
          {/* Sidebar Controls */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-6 sticky top-28">
            <div className="glass-premium p-5 rounded-[2.5rem] border-white/5 space-y-2">
              {[
                { id: 'tasks', label: 'Command Center', icon: LayoutGrid },
                { id: 'timer', label: 'Focus Zone', icon: Timer },
                { id: 'schedule', label: 'Timeline', icon: Calendar },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'log', label: 'Log File', icon: History }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest ${
                    activeTab === tab.id
                      ? 'bg-[var(--accent)] text-[var(--text-on-accent)] shadow-[0_0_20px_var(--accent-glow)]'
                      : 'text-muted hover:text-primary hover:bg-white/5'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="glass-premium p-6 rounded-[2.5rem] border-white/5 space-y-4">
              <div className="flex flex-col gap-3">
                  <button 
                    onClick={exportData}
                    className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-muted hover:text-primary text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5"
                  >
                    <Download size={14} /> Export Data
                  </button>
                  <label className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-muted hover:text-primary text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5 cursor-pointer">
                    <Upload size={14} /> Import Data
                    <input type="file" accept=".json" onChange={importData} className="hidden" />
                  </label>
                  <button 
                    onClick={clearAllTasks}
                    className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-red-500/5 hover:bg-red-500/20 text-red-500/60 hover:text-red-500 text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-red-500/10"
                  >
                    <Trash2 size={14} /> Clear All
                  </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 w-full">
            <AnimatePresence mode="wait">
              {activeTab === 'tasks' && (
                <motion.div 
                  key="tasks-view"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={pageTransition}
                  className="space-y-8"
                >
                  {/* Header Glass Section */}
                  <div className="glass-premium p-10 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-accent opacity-[0.07] rounded-full blur-[120px] transition-all duration-1000 group-hover:scale-125 pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2.5 text-accent mb-1 drop-shadow-glow">
                          <Sparkles size={16} className="animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-[0.4em] font-mono">System ACTIVE</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-primary leading-tight">
                          Active <span className="text-muted font-light">Missions</span>
                        </h1>
                      </div>

                      <div className="flex p-1.5 bg-white/5 rounded-[1.5rem] border border-white/5 self-start shadow-inner">
                        {['all', 'pending', 'completed'].map(f => (
                          <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all ${
                              filter === f ? 'bg-[var(--accent)] text-[var(--text-on-accent)] shadow-lg' : 'text-muted hover:text-primary'
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="relative group/search mb-10">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within/search:text-accent transition-colors" size={20} />
                      <input 
                        type="text" 
                        placeholder="SCAN MISSION RECORDS..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 p-6 pl-16 rounded-3xl text-sm font-bold focus:border-accent/40 focus:outline-none transition-all placeholder:text-muted/50 font-sans shadow-inner focus:bg-white/[0.08]"
                      />
                    </div>

                    {/* Task Form Upgrade */}
                    <AnimatePresence>
                      {(isAdding || editTask) ? (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="overflow-hidden"
                        >
                          <form onSubmit={handleFormSubmit} className="glass-premium p-10 rounded-[2.5rem] border-accent/20 space-y-8 bg-black/20 mb-8 border-2 shadow-2xl">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black font-mono text-accent uppercase tracking-[0.3em]">
                                {editTask ? 'Re-Programming Mission' : 'Initializing New Mission'}
                              </span>
                            </div>

                            <input 
                              type="text" 
                              placeholder="MISSION TITLE..."
                              value={formData.title}
                              onChange={e => setFormData({...formData, title: e.target.value})}
                              className="w-full bg-white/5 border border-white/5 p-6 rounded-2xl text-2xl font-black text-primary focus:border-accent outline-none transition-all placeholder:text-muted/30"
                              autoFocus
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2">
                                  <Tag size={12} className="text-accent" /> Categories
                                </label>
                                <input 
                                  type="text"
                                  placeholder="Work, High-Priority, Urgent..."
                                  value={formData.labels.join(', ')}
                                  onChange={e => setFormData({...formData, labels: e.target.value.split(',').map(l => l.trim()).filter(Boolean)})}
                                  className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-xs font-bold focus:border-accent outline-none text-primary/80"
                                />
                              </div>
                              <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2">
                                  <Clock size={12} className="text-accent" /> Deadline
                                </label>
                                <input 
                                  type="date"
                                  value={formData.dueDate}
                                  onChange={e => setFormData({...formData, dueDate: e.target.value})}
                                  className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-xs font-bold focus:border-accent outline-none text-primary/80"
                                />
                              </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                              <button type="submit" className="btn-premium flex-grow py-5 text-lg group">
                                COMMENCE MISSION <span className="ml-2 transition-transform group-hover:translate-x-2">»</span>
                              </button>
                              <button 
                                type="button" 
                                onClick={resetForm}
                                className="px-10 py-5 bg-white/5 hover:bg-white/10 text-muted font-black rounded-2xl border border-white/5 transition-all text-xs uppercase tracking-widest"
                              >
                                Abort
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      ) : (
                        <button 
                          onClick={() => setIsAdding(true)}
                          className="w-full h-28 border-2 border-dashed border-white/10 rounded-[2.5rem] flex items-center justify-center gap-6 hover:border-accent/40 hover:bg-accent/5 transition-all group overflow-hidden relative shadow-inner"
                        >
                          <div className="flex items-center gap-6 group-hover:scale-105 transition-transform z-10">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-all shadow-xl border border-white/5">
                              <Plus size={28} />
                            </div>
                            <span className="text-2xl font-black text-muted group-hover:text-primary transition-colors tracking-tighter">Deploy New Mission Component</span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:animate-[shimmer_3s_infinite]" />
                        </button>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Task List Section */}
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="tasks">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-5 min-h-[400px]">
                          <AnimatePresence mode="popLayout">
                            {filteredTasks.length === 0 ? (
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-24 flex flex-col items-center gap-6 opacity-20"
                              >
                                <LayoutGrid size={64} strokeWidth={1} className="text-accent" />
                                <span className="text-[10px] font-black uppercase tracking-[0.6em] font-mono text-center">NO MISSION RECORDS DETECTED IN LOCAL BUFFER</span>
                              </motion.div>
                            ) : (
                              filteredTasks.map((task, idx) => (
                                <TaskCard 
                                  key={task._id} 
                                  task={task} 
                                  index={idx} 
                                  updateTask={handleUpdate} 
                                  deleteTask={handleDelete}
                                  startEdit={(t) => {
                                    setEditTask(t);
                                    setFormData({
                                      title: t.title,
                                      description: t.description || '',
                                      priority: t.priority || 'medium',
                                      dueDate: t.dueDate ? t.dueDate.substring(0, 10) : '',
                                      labels: t.labels || [],
                                      subtasks: t.subtasks || [],
                                      reminderTime: t.reminderTime ? t.reminderTime.substring(0, 16) : ''
                                    });
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                />
                              ))
                            )}
                          </AnimatePresence>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </motion.div>
              )}

              {/* Other sections with same premium treatment */}
              {activeTab === 'timer' && (
                <motion.div 
                  key="timer-view"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={pageTransition}
                  className="flex flex-col items-center justify-center min-h-[60vh] space-y-10"
                >
                  <div className="text-center space-y-3">
                     <h2 className="text-5xl font-black text-primary tracking-tighter">Focus Room</h2>
                     <p className="text-accent font-black text-[10px] italic tracking-[0.5em] uppercase opacity-60">Initializing Neural Sync</p>
                  </div>
                  <div className="w-full max-w-md scale-110">
                    <PomodoroTimer />
                  </div>
                </motion.div>
              )}

              {activeTab === 'schedule' && (
                <motion.div 
                  key="schedule-view"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={pageTransition}
                  className="glass-premium p-10 md:p-14 rounded-[4rem] border-white/5 shadow-2xl"
                >
                  <Scheduler 
                    tasks={tasks} 
                    updateTask={handleUpdate} 
                    deleteTask={handleDelete} 
                    startEdit={(t) => {
                      setEditTask(t);
                      setActiveTab('tasks');
                    }}
                  />
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <motion.div 
                  key="analytics-view"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={pageTransition}
                  className="glass-premium p-10 md:p-14 rounded-[4rem] border-white/5 shadow-2xl"
                >
                  <AnalyticsPanel stats={stats} tasks={tasks} />
                </motion.div>
              )}

              {activeTab === 'log' && (
                <motion.div
                  key="log-view"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={pageTransition}
                  className="glass-premium p-10 md:p-14 rounded-[4rem] border-white/5 shadow-2xl"
                >
                  <div className="flex justify-end mb-8">
                    <button
                      onClick={() => {
                        setActivityLogs([]);
                        localStorage.removeItem('tf_logs');
                      }}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/40 hover:text-red-500 border border-red-500/10 hover:border-red-500/30 px-6 py-3 rounded-2xl transition-all"
                    >
                      Purge Buffer
                    </button>
                  </div>
                  <ActivityLog logs={activityLogs} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Premium Bottom Nav */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Dashboard;
