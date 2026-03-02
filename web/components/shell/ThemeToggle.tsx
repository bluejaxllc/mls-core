'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { motion } from 'framer-motion';

export function ThemeToggle() {
    const { theme, resolved, setTheme } = useTheme();

    const cycle = () => {
        const next = theme === 'auto' ? 'light' : theme === 'light' ? 'dark' : 'auto';
        setTheme(next);
    };

    const icon = theme === 'auto'
        ? <Monitor className="w-4 h-4" />
        : resolved === 'dark'
            ? <Moon className="w-4 h-4" />
            : <Sun className="w-4 h-4" />;

    const label = theme === 'auto'
        ? 'Auto'
        : resolved === 'dark'
            ? 'Noche'
            : 'Día';

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={cycle}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            title={`Tema: ${label}`}
        >
            <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
            >
                {icon}
            </motion.div>
            <span className="hidden lg:block">{label}</span>
        </motion.button>
    );
}
