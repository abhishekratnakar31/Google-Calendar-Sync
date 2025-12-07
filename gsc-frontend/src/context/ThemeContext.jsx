import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                return savedTheme;
            }
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        }
        return 'light';
    });

    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;
        // If transitioning, don't update class immediately? 
        // Actually, we want to update the class in the MIDDLE of the transition.
        // So this useEffect is fine, assuming setTheme is called mid-animation.

        // But if setTheme triggers this, we rely on toggleTheme timing.
        // So update DOM here naturally.
        if (!isTransitioning) {
            // Initial load or update without transition? 
            // We should always sync, but for the toggle, we want to sync only after state update.
            root.classList.remove('light', 'dark');
            root.classList.add(theme);
            localStorage.setItem('theme', theme);
        } else {
            root.classList.remove('light', 'dark');
            root.classList.add(theme);
            localStorage.setItem('theme', theme);
        }
    }, [theme, isTransitioning]);

    const toggleTheme = () => {
        setIsTransitioning(true);
        // Curve animation timeline:
        // 0ms: Start (Cover screen)
        // 350ms + 750ms = 1100ms? No.
        // Enter duration: 0.75s, delay: 0.35s. Total 1.1s to finish covering?
        // Wait. `enter` variant transitions `top` from -300px to -100vh.

        // Let's assume standard curve timing. 
        // We want to switch theme when screen is fully covered.
        // The curve enters (covers), then exits (reveals).
        // Let's wait ~600ms to switch theme, then finish.

        setTimeout(() => {
            setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
        }, 1200); // 800ms to allow curve to fully cover

        setTimeout(() => {
            setIsTransitioning(false);
        }, 1200); // Unmount immediately after switch to trigger exit animation
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isTransitioning }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
