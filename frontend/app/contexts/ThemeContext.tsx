import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  cardBackground: string;
  cardBackBackground: string;
  searchBackground: string;
  shadowColor: string;
}

const lightTheme: ThemeColors = {
  primary: '#f3f4f6',
  secondary: '#e5e7eb',
  background: '#ffffff',
  surface: '#f9fafb',
  text: '#1f2937',
  textSecondary: '#6b7280',
  border: '#d1d5db',
  cardBackground: '#ffffff',
  cardBackBackground: '#f8fafc',
  searchBackground: 'rgba(255, 255, 255, 0.9)',
  shadowColor: '#000',
};

const darkTheme: ThemeColors = {
  primary: '#1f2937',
  secondary: '#374151',
  background: '#111827',
  surface: '#1f2937',
  text: '#ffffff',
  textSecondary: '#d1d5db',
  border: '#374151',
  cardBackground: '#2c284d',
  cardBackBackground: '#1c1a2d',
  searchBackground: 'rgba(31, 41, 55, 0.9)',
  shadowColor: '#000',
};

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const colors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
