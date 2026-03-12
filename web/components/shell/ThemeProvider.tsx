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

/** Time-based auto theme: 7 AM → light, 7 PM → dark */
function getTimeBasedTheme(): 'light' | 'dark' {
    const hour = new Date().getHours();
    return (hour >= 7 && hour < 19) ? 'light' : 'dark';
}

function applyTheme(r: 'light' | 'dark') {
    document.documentElement.classList.toggle('dark', r === 'dark');
    document.documentElement.classList.toggle('light', r === 'light');
    document.documentElement.setAttribute('data-theme', r);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('auto');
    const [resolved, setResolved] = useState<'light' | 'dark'>('dark');

    // Load saved preference
    useEffect(() => {
        const saved = localStorage.getItem('mls-theme') as Theme | null;
        if (saved) setThemeState(saved);
    }, []);

    // Resolve and apply theme
    useEffect(() => {
        const r = theme === 'auto' ? getTimeBasedTheme() : theme;
        setResolved(r);
        applyTheme(r);
    }, [theme]);

    // In auto mode: re-check every 60s so the switch happens automatically at 7 AM / 7 PM
    useEffect(() => {
        if (theme !== 'auto') return;
        const interval = setInterval(() => {
            const r = getTimeBasedTheme();
            setResolved(prev => {
                if (prev !== r) applyTheme(r);
                return r;
            });
        }, 60_000);
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
