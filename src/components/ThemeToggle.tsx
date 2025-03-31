import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const [isDark, setIsDark] = React.useState(true);

  React.useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-[#CCD6F6]" />
      ) : (
        <Moon className="w-5 h-5 text-[#CCD6F6]" />
      )}
    </motion.button>
  );
};