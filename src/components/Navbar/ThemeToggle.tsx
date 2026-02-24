'use client';

import React, { useEffect, useState } from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

export default function ThemeToggle({ forceWhite = false }: { forceWhite?: boolean }) {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 rounded-full hover:bg-[var(--surface-hover)] transition-all duration-300 ${forceWhite ? 'text-white' : 'text-[var(--foreground)]'}`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? <MdDarkMode size={22} /> : <MdLightMode size={22} />}
        </button>
    );
}
