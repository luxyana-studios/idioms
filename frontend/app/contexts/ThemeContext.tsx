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
  primary: '#e5e7eb',
  secondary: '#d1d5db',
  background: '#f8fafc',
  surface: '#f1f5f9',
  text: '#1f2937',
  textSecondary: '#64748b',
  border: '#cbd5e1',
  cardBackground: '#ffffff',
  cardBackBackground: '#f1f5f9',
  searchBackground: 'rgba(248, 250, 252, 0.95)',
  shadowColor: '#64748b',
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
