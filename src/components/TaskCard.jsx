import { motion, AnimatePresence } from 'framer-motion';
import { Draggable } from '@hello-pangea/dnd';
import { Trash2, Edit2, Check, GripVertical, Calendar, Bell, ListChecks, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TaskCard = ({ task, index, updateTask, deleteTask, startEdit, isMini = false }) => {
  const { t } = useTranslation();

  if (!task || !task._id) return null;

  const handleToggle = () => {
    updateTask(task._id, { completed: !task.completed });
  };

  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const priorityColors = {
    high: 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]',
    medium: 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]',
    low: 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
  };

  return (
    <Draggable draggableId={String(task._id)} index={index}>
      {(provided, snapshot) => (
        <motion.div
          layout
          {...provided.draggableProps}
          ref={provided.innerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          whileHover={{ y: -5, scale: 1.01 }}
          className={`group flex items-start gap-4 p-5 mb-4 rounded-3xl border transition-all duration-500 relative overflow-hidden glass-premium card-3d ${
            snapshot.isDragging ? 'z-[100] ring-2 ring-accent/50 shadow-2xl scale-[1.03] rotate-1' : ''
          } ${task.completed ? 'opacity-60' : ''} ${isMini ? 'p-3 mb-2 gap-3' : 'p-5 mb-4 gap-4'}`}
        >
          {/* Priority Vertical Bar */}
          <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-500 ${priorityColors[task.priority || 'medium']}`} />

          <div {...provided.dragHandleProps} className="mt-1 text-muted hover:text-primary transition-colors cursor-grab active:cursor-grabbing">
            <GripVertical size={16} />
          </div>

          <button
            onClick={handleToggle}
            className={`mt-1 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-500 flex-shrink-0 relative overflow-hidden ${
              task.completed
                ? 'bg-[var(--accent)] border-accent text-on-accent shadow-[0_0_15px_var(--accent-glow)]'
                : 'border-border hover:border-accent group-hover:scale-110 bg-surface'
            }`}
          >
            <AnimatePresence>
              {task.completed && (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 45 }}
                >
                  <Check size={16} strokeWidth={4} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <h3 className={`font-bold tracking-tight transition-all duration-500 truncate ${
                task.completed ? 'line-through text-muted italic' : 'text-primary'
              } ${isMini ? 'text-sm' : 'text-lg'}`}>
                {task.title}
              </h3>

              {!isMini && (
                <div className="flex gap-1.5">
                  {task.priority && (
                    <span className={`text-[8px] uppercase font-black px-2 py-0.5 rounded-full border border-white/10 ${
                      task.priority === 'high' ? 'bg-red-500 text-white' : 
                      task.priority === 'medium' ? 'bg-yellow-500 text-on-accent' : 
                      'bg-blue-500 text-white'
                    }`}>
                      {task.priority}
                    </span>
                  )}
                  {task.labels?.map((label, i) => (
                    <span key={i} className="text-[8px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted flex items-center gap-1">
                      <Tag size={8} />
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {!isMini && task.description && (
              <p className={`text-xs mb-3 transition-opacity duration-500 line-clamp-2 ${
                task.completed ? 'opacity-30' : 'text-secondary'
              }`}>
                {task.description}
              </p>
            )}

            {totalSubtasks > 0 && (
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1.5 text-[8px] font-bold uppercase tracking-widest text-muted">
                  <span className="flex items-center gap-1.5">
                    <ListChecks size={10} className="text-accent" />
                    Subtasks ({completedSubtasks}/{totalSubtasks})
                  </span>
                  <span>{Math.round(subtaskProgress)}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${subtaskProgress}%` }}
                    className="h-full bg-accent relative"
                  >
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
                  </motion.div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              {task.dueDate && (
                <div className="text-[9px] text-muted flex items-center gap-1.5 font-bold uppercase tracking-wider">
                  <Calendar size={11} className="text-accent" />
                  {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
              )}
              {task.reminderTime && (
                <div className="text-[9px] text-accent/80 flex items-center gap-1.5 font-bold uppercase tracking-wider animate-pulse">
                  <Bell size={11} />
                  {new Date(task.reminderTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          </div>

          {!isMini && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
              <button
                onClick={() => startEdit(task)}
                className="p-2.5 text-muted hover:text-primary hover:bg-white/10 rounded-xl transition-all"
                title="Edit Task"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => deleteTask(task._id)}
                className="p-2.5 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                title="Delete Task"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </Draggable>
  );
};

export default TaskCard;
