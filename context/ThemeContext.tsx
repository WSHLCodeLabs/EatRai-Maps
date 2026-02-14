import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const THEME_STORAGE_KEY = '@theme_mode';

interface ThemeColors {
    background: string;
    card: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
    tabBar: string;
}

interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
    colors: ThemeColors;
}

const darkColors: ThemeColors = {
    background: '#0D0D0D',
    card: '#1A1A1A',
    border: '#2A2A2A',
    textPrimary: '#FFFFFF',
    textSecondary: '#8A8A8A',
    textMuted: '#5A5A5A',
    accent: '#7CEB00',
    tabBar: '#0D0D0D',
};

const lightColors: ThemeColors = {
    background: '#F5F5F5',
    card: '#FFFFFF',
    border: '#E0E0E0',
    textPrimary: '#1A1A1A',
    textSecondary: '#6B6B6B',
    textMuted: '#9E9E9E',
    accent: '#5BBF00',
    tabBar: '#FFFFFF',
};

const ThemeContext = createContext<ThemeContextType>({
    isDarkMode: true,
    toggleTheme: () => {},
    colors: darkColors,
});

/**
 * Theme provider that manages dark/light mode state
 * and persists the preference to AsyncStorage.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load persisted theme on mount
    useEffect(() => {
        (async () => {
            try {
                const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (stored !== null) {
                    setIsDarkMode(stored === 'dark');
                }
            } catch (error) {
                // Silently default to dark
            } finally {
                setIsLoaded(true);
            }
        })();
    }, []);

    const toggleTheme = async () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode ? 'dark' : 'light');
        } catch (error) {
            // Best-effort persistence
        }
    };

    const colors = isDarkMode ? darkColors : lightColors;

    // Don't render until theme is loaded to avoid flash
    if (!isLoaded) return null;

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * Hook to access theme state and colors.
 * Must be used within a ThemeProvider.
 */
export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export { darkColors, lightColors };
export type { ThemeColors };

