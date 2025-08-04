import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeColors {
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

const defaultLight: ThemeColors = {
  primary: '#3b82f6',
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

const defaultDark: ThemeColors = {
  primary: '#3b82f6',
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
  setPalette: (
    palette: Partial<ThemeColors>,
    mode?: 'light' | 'dark' | 'both',
  ) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const mergeColors = (
  base: ThemeColors,
  patch?: Partial<ThemeColors>,
): ThemeColors => ({ ...base, ...(patch ?? {}) });

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [lightPalette, setLightPalette] = useState<ThemeColors>(defaultLight);
  const [darkPalette, setDarkPalette] = useState<ThemeColors>(defaultDark);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setPalette = useCallback(
    (
      palette: Partial<ThemeColors>,
      mode: 'light' | 'dark' | 'both' = 'both',
    ) => {
      if (mode === 'light' || mode === 'both')
        setLightPalette((c) => mergeColors(c, palette));
      if (mode === 'dark' || mode === 'both')
        setDarkPalette((c) => mergeColors(c, palette));
    },
    [],
  );

  const colors = theme === 'light' ? lightPalette : darkPalette;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, setPalette }}>
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

export default ThemeProvider;
