import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [fontSize, setFontSize] = useState(100); // Percentage

    const increaseFontSize = () => setFontSize(prev => Math.min(prev + 10, 150)); // Max 150%
    const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 10, 80)); // Min 80%
    const resetFontSize = () => setFontSize(100);

    useEffect(() => {
        // Apply font-size to the root html element
        // 100% is typical default (16px).
        document.documentElement.style.fontSize = `${fontSize}%`;
    }, [fontSize]);

    return (
        <ThemeContext.Provider value={{ fontSize, increaseFontSize, decreaseFontSize, resetFontSize }}>
            {children}
        </ThemeContext.Provider>
    );
};
