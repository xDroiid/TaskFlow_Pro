import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BookOpen, Monitor, Keyboard, Terminal } from 'lucide-react';

const Help = () => {
  const { t } = useTranslation();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto flex flex-col gap-8 w-full p-4"
    >
      <div className="glass p-8 rounded-2xl border-t-2 border-l-2 border-neon-green/50 shadow-neonSoft mt-10">
        <div className="flex items-center gap-4 mb-8">
          <BookOpen className="w-10 h-10 text-neon-green" />
          <h1 className="text-3xl font-sans font-bold tracking-wide text-neon-green">
            Operator Manual
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/40 p-6 rounded-xl border border-white/5 hover:border-neon-green/50 transition-colors">
            <h3 className="font-sans font-semibold text-lg mb-3 flex items-center gap-2 text-white">
              <Terminal size={20} className="text-blue-400" />
              Task Directives
            </h3>
            <ul className="text-white/70 space-y-2 text-sm">
              <li>• Click <strong>Add Task</strong> to create a new directive.</li>
              <li>• Click the <strong>Modify (Edit)</strong> icon to update an existing directive.</li>
              <li>• Click the <strong>Eradicate (Trash)</strong> icon to delete.</li>
              <li>• Check the box on the left to mark a task as Executed (Completed).</li>
              <li>• <strong>Drag and drop</strong> tasks by clicking anywhere on the item.</li>
            </ul>
          </div>

          <div className="bg-black/40 p-6 rounded-xl border border-white/5 hover:border-neon-green/50 transition-colors">
            <h3 className="font-sans font-semibold text-lg mb-3 flex items-center gap-2 text-white">
              <Monitor size={20} className="text-yellow-400" />
              Visual Interface (Theme)
            </h3>
            <p className="text-white/70 text-sm mb-2">
              Toggle the theme using the monitor/sun/moon icon in the top right navigation bar.
            </p>
            <ul className="text-white/70 space-y-1 text-sm list-disc list-inside">
              <li><strong>Neon:</strong> Extremely dark green with glowing accents.</li>
              <li><strong>Dark:</strong> Standard pitch black with white text.</li>
              <li><strong>Light:</strong> Bright interface for daytime operations.</li>
            </ul>
          </div>

          <div className="bg-black/40 p-6 rounded-xl border border-white/5 hover:border-neon-green/50 transition-colors md:col-span-2">
            <h3 className="font-sans font-semibold text-lg mb-3 flex items-center gap-2 text-white">
              <Keyboard size={20} className="text-purple-400" />
              Translation Matrix (Language)
            </h3>
            <p className="text-white/70 text-sm">
              Click the globe icon in the top right navigation bar to cycle through available languages. 
              Your preferences (Theme & Language) are saved automatically to your profile and persist across sessions.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Help;
