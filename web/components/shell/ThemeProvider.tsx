'use client';

import { useState, useEffect, createContext, useContext } from 'react';

type Theme = 'light' | 'dark' | 'auto';

const ThemeContext = createContext<{
    theme: Theme;
    resolved: 'light' | 'dark';
    setTheme: (t: Theme) => void;
}>({
    theme: 'auto',
    resolved: 'dark',
    setTheme: () => { },
});

export function useTheme() {
    return useContext(ThemeContext);
}

function getAutoTheme(): 'light' | 'dark' {
    const hour = new Date().getHours();
    // Dark from 7PM to 7AM
    return (hour >= 19 || hour < 7) ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('auto');
    const [resolved, setResolved] = useState<'light' | 'dark'>('dark');

    useEffect(() => {
        const saved = localStorage.getItem('mls-theme') as Theme | null;
        if (saved) setThemeState(saved);
    }, []);

    useEffect(() => {
        const r = theme === 'auto' ? getAutoTheme() : theme;
        setResolved(r);
        document.documentElement.classList.toggle('dark', r === 'dark');
        document.documentElement.classList.toggle('light', r === 'light');
    }, [theme]);

    // Re-check auto theme every minute
    useEffect(() => {
        if (theme !== 'auto') return;
        const interval = setInterval(() => {
            setResolved(getAutoTheme());
            document.documentElement.classList.toggle('dark', getAutoTheme() === 'dark');
        }, 60000);
        return () => clearInterval(interval);
    }, [theme]);

    const setTheme = (t: Theme) => {
        setThemeState(t);
        localStorage.setItem('mls-theme', t);
    };

    return (
        <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
