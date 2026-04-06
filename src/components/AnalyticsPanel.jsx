import { motion } from 'framer-motion';
import { Target, Zap, TrendingUp, CheckCircle, BarChart3, Clock, PieChart } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, colorClass, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-premium p-8 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all shadow-xl"
  >
    <div className="flex flex-col">
      <span className="text-[9px] text-muted uppercase tracking-[0.4em] font-black mb-1.5">{label}</span>
      <span className="text-3xl font-black text-primary tracking-tighter">{value}</span>
    </div>
    <div className={`p-4 rounded-2xl bg-white/5 ${colorClass} group-hover:scale-110 group-hover:shadow-[0_0_20px_currentColor] transition-all duration-300`}>
      <Icon size={24} />
    </div>
  </motion.div>
);

const ProgressCircle = ({ percentage, label, colorClass, glowClass }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64" cy="64" r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="10"
          />
          <motion.circle
            cx="64" cy="64" r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="10"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: "anticipate" }}
            className={`${colorClass} ${glowClass}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-primary font-sans leading-none">{percentage}%</span>
        </div>
      </div>
      <span className="text-[10px] text-muted uppercase tracking-[0.3em] font-black text-center">{label}</span>
    </div>
  );
};

const AnalyticsPanel = ({ stats, tasks }) => {
  const total = stats?.totalTasks || 0;
  const completed = stats?.completedTasks || 0;
  const pending = total - completed;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  const priorityMap = { high: 3, medium: 2, low: 1 };
  const avgPriority = tasks.length > 0 
    ? (tasks.reduce((sum, t) => sum + priorityMap[t.priority || 'medium'], 0) / tasks.length).toFixed(1) 
    : 0;

  const highPriorityTasks = tasks.filter(t => t.priority === 'high');
  const highPriorityDone = highPriorityTasks.length > 0
    ? Math.round((highPriorityTasks.filter(t => t.completed).length / highPriorityTasks.length) * 100)
    : 0;

  const productivityScore = Math.min(100, Math.round((rate * 0.6) + (highPriorityDone * 0.4)));

  return (
    <div className="w-full space-y-12">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_var(--accent-glow)]">
          <BarChart3 className="text-accent" size={24} />
        </div>
        <div className="flex flex-col">
          <h2 className="text-3xl font-black tracking-tighter text-primary">Mission <span className="text-accent font-light italic">Intelligence</span></h2>
          <p className="text-[10px] text-muted uppercase tracking-[0.4em] font-black mt-1">Buffer Status & Productivity Logic</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard label="Total Missions" value={total} icon={Target} colorClass="text-blue-500" />
        <StatCard label="Successful" value={completed} icon={CheckCircle} colorClass="text-accent" delay={0.1} />
        <StatCard label="In-Progress" value={pending} icon={Clock} colorClass="text-yellow-500" delay={0.2} />
        <StatCard label="Neural Load" value={`${productivityScore}%`} icon={TrendingUp} colorClass="text-purple-500" delay={0.3} />
      </div>

      <div className="glass-premium p-12 rounded-[4rem] border border-white/5 overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-[0.05] rounded-full blur-[100px] -z-10" />
        
        <div className="flex flex-col lg:flex-row items-center justify-around gap-16">
          <ProgressCircle percentage={rate} label="Task Completion" colorClass="text-accent" glowClass="drop-shadow-[0_0_10px_var(--accent-glow)]" />
          
          <div className="flex-grow max-w-md w-full space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-secondary uppercase tracking-[0.3em] font-black">Mission Priority Avg</span>
                <span className="text-sm text-blue-500 font-black font-sans">{avgPriority} / 3.0</span>
              </div>
              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(avgPriority / 3) * 100}%` }}
                  transition={{ duration: 1.5, ease: "anticipate" }}
                  className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-secondary uppercase tracking-[0.3em] font-black">High Priority Sync</span>
                <span className="text-sm text-accent font-black font-sans">{highPriorityDone}%</span>
              </div>
              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner transition-all">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${highPriorityDone}%` }}
                  transition={{ duration: 2, ease: "anticipate" }}
                  className="h-full bg-accent shadow-[0_0_20px_var(--accent-glow)]"
                />
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/5 flex items-start gap-4">
              <div className="p-2.5 bg-white/5 rounded-xl">
                <Zap size={16} className="text-yellow-500 animate-pulse" />
              </div>
              <p className="text-[10px] text-muted italic uppercase leading-relaxed tracking-wider font-medium">
                Productivity score is architected based on a 60/40 weighted split between total completion and high-priority mission success.
              </p>
            </div>
          </div>

          <ProgressCircle percentage={productivityScore} label="Overall Score" colorClass="text-purple-500" glowClass="drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]" />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
