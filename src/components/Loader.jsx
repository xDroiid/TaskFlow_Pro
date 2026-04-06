import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex bg-neon-dark items-center justify-center min-h-screen w-full z-50">
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-t-4 border-neon-green rounded-full shadow-neon"
        />
        <div className="mt-8 text-neon-green font-sans font-bold tracking-[0.2em] text-xl glitch-wrapper">
          <span className="glitch absolute">TASKFLOW</span>
          <span className="opacity-0">TASKFLOW</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
