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

function getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(r: 'light' | 'dark') {
    document.documentElement.classList.toggle('dark', r === 'dark');
    document.documentElement.classList.toggle('light', r === 'light');
    document.documentElement.setAttribute('data-theme', r);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('auto');
    const [resolved, setResolved] = useState<'light' | 'dark'>('dark');

    useEffect(() => {
        const saved = localStorage.getItem('mls-theme') as Theme | null;
        if (saved) setThemeState(saved);
    }, []);

    useEffect(() => {
        const r = theme === 'auto' ? getSystemTheme() : theme;
        setResolved(r);
        applyTheme(r);
    }, [theme]);

    // Listen for OS theme changes in real-time (only in auto mode)
    useEffect(() => {
        if (theme !== 'auto') return;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e: MediaQueryListEvent) => {
            const r = e.matches ? 'dark' : 'light';
            setResolved(r);
            applyTheme(r);
        };
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
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
