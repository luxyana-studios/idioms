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
  cardHeading?: string;
  cardAccent?: string;
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
  cardHeading: '#8B6B58',
  cardAccent: '#8B6B58',
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
  cardHeading: '#E8D04D',
  cardAccent: '#E8D04D',
};

interface ComputedTheme {
  accent: string;
  headerColor: string;
  softBackground: string;
  subtleBorder: string;
  iconTint: string;
  stepDotBackground: string;
  textShadowColor: string;
  textShadowOffset: { width: number; height: number };
  textShadowRadius: number;

  cardTextColorLight: string;
  cardTextColorDark: string;
  cardTextSecondaryColorLight: string;
  cardTextSecondaryColorDark: string;
  cardTextColor: string;
  cardTextSecondaryColor: string;

  overlayBg: string;
  menuBg: string;
  menuBorder: string;
  divider: string;
  triggerBg: string;
  triggerBorder: string;
  triggerIconColor: string;
  triggerIconShadowColor: string;
  iconColor: string;
  labelColor: string;

  menuShadowOpacity: number;
  menuShadowRadius: number;

  backgroundImageOpacity: number;
  backgroundImageOverlay: string;
}

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  computed: ComputedTheme;
  themeDescription: string;
  toggleTheme: () => void;
  setPalette: (
    palette: Partial<ThemeColors>,
    mode?: 'light' | 'dark' | 'both',
  ) => void;
  setPreset: (preset: import('../utils/palette').PalettePreset) => void;
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

  const setPreset = useCallback(
    (preset: import('../utils/palette').PalettePreset) => {
      const { buildPalettesFromPreset } =
        require('../utils/palette') as typeof import('../utils/palette');
      const patches = buildPalettesFromPreset(preset);
      setPalette(patches.light, 'light');
      setPalette(patches.dark, 'dark');
    },
    [setPalette],
  );

  const LIGHT_COMPUTED: ComputedTheme = {
    accent: colors.cardAccent ?? colors.primary ?? '#2563eb',
    headerColor: colors.cardHeading ?? colors.primary ?? '#2563eb',
    softBackground: (colors.text ?? '#111111') + '0F',
    subtleBorder: (colors.border ?? '#cbd5e1') + '80',
    iconTint: colors.primary || '#2563eb',
    stepDotBackground: (colors.text ?? '#111111') + '26',
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,

    cardTextColorLight: '#1F2937',
    cardTextColorDark: '#FFFFFF',
    cardTextSecondaryColorLight: '#374151',
    cardTextSecondaryColorDark: '#F3F4F6',
    cardTextColor: '#1F2937',
    cardTextSecondaryColor: '#374151',
    overlayBg: (colors.text ?? '#111111') + '33',
    menuBg: (colors.surface ?? '#ffffff') + 'F2',
    menuBorder: (colors.border ?? '#cbd5e1') + '99',
    divider: (colors.border ?? '#cbd5e1') + '99',
    triggerBg: 'rgba(0, 0, 0, 0.2)',
    triggerBorder: 'rgba(255, 255, 255, 0.3)',
    triggerIconColor: '#FFFFFF',
    triggerIconShadowColor: '#00000055',
    iconColor: colors.text ?? '#1f2937',
    labelColor: colors.text ?? '#1f2937',
    menuShadowOpacity: 0.2,
    menuShadowRadius: 12,

    backgroundImageOpacity: 1,
    backgroundImageOverlay: 'rgba(0, 0, 0, 0.18)',
  };

  const DARK_COMPUTED: ComputedTheme = {
    accent: colors.cardAccent ?? colors.primary ?? '#E8D04D',
    headerColor: colors.cardHeading ?? colors.primary ?? '#E8D04D',
    softBackground: (colors.surface ?? '#000000') + '33',
    subtleBorder: (colors.text ?? '#ffffff') + '30',
    iconTint: colors.text ?? '#ffffff',
    stepDotBackground: 'rgba(255, 255, 255, 0.35)',
    textShadowColor: (colors.background ?? '#000') + '66',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,

    cardTextColorLight: '#1F2937',
    cardTextColorDark: '#FFFFFF',
    cardTextSecondaryColorLight: '#374151',
    cardTextSecondaryColorDark: '#F3F4F6',
    cardTextColor: '#FFFFFF',
    cardTextSecondaryColor: '#F3F4F6',
    overlayBg: 'rgba(0, 0, 0, 0.6)',
    menuBg: 'rgba(31, 41, 55, 0.95)',
    menuBorder: 'rgba(255, 255, 255, 0.2)',
    divider: 'rgba(255, 255, 255, 0.1)',
    triggerBg: 'rgba(0, 0, 0, 0.2)',
    triggerBorder: 'rgba(255, 255, 255, 0.3)',
    triggerIconColor: '#FFFFFF',
    triggerIconShadowColor: 'transparent',
    iconColor: '#FFFFFF',
    labelColor: '#FFFFFF',
    menuShadowOpacity: 0.35,
    menuShadowRadius: 16,

    backgroundImageOpacity: 1,
    backgroundImageOverlay: 'rgba(0, 0, 0, 0.28)',
  };

  const computed: ComputedTheme = {
    ...(theme === 'light' ? LIGHT_COMPUTED : DARK_COMPUTED),
    cardTextColor:
      theme === 'light'
        ? LIGHT_COMPUTED.cardTextColorLight
        : DARK_COMPUTED.cardTextColorDark,
    cardTextSecondaryColor:
      theme === 'light'
        ? LIGHT_COMPUTED.cardTextSecondaryColorLight
        : DARK_COMPUTED.cardTextSecondaryColorDark,
  };

  const themeDescription = `Current: ${theme === 'light' ? 'Light' : 'Dark'}`;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors,
        computed,
        themeDescription,
        toggleTheme,
        setPalette,
        setPreset,
      }}
    >
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
