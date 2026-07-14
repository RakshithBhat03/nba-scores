import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={15} />;
      case 'dark':
        return <Moon size={15} />;
      case 'system':
        return <Monitor size={15} />;
      default:
        return <Sun size={15} />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light Theme';
      case 'dark':
        return 'Dark Theme';
      case 'system':
        return 'System Theme';
      default:
        return 'Light Theme';
    }
  };

  return (
    <button
      onClick={toggleTheme}
      title={getLabel()}
      className="grid h-8 w-8 place-items-center rounded-lg text-white/90 transition-all duration-200 hover:scale-105 hover:bg-white/15"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {getIcon()}
      </motion.div>
    </button>
  );
}
