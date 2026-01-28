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
  primary: '#8B7355',
  secondary: '#E8E2D9',
  background: '#FAF7F2',
  surface: '#F5F0E8',
  text: '#2D2A26',
  textSecondary: '#9B9388',
  border: '#E5DDD3',
  cardBackground: '#ffffff',
  cardBackBackground: '#F5F0E8',
  searchBackground: 'rgba(250, 247, 242, 0.95)',
  shadowColor: '#9B9388',
  cardHeading: '#8B7355',
  cardAccent: '#D4A574',
};

const defaultDark: ThemeColors = {
  primary: '#D4A574',
  secondary: '#3D3835',
  background: '#2D2A26',
  surface: '#3D3835',
  text: '#FAF7F2',
  textSecondary: '#E8E2D9',
  border: '#4A4540',
  cardBackground: '#3D3835',
  cardBackBackground: '#332F2C',
  searchBackground: 'rgba(45, 42, 38, 0.9)',
  shadowColor: '#1E1B18',
  cardHeading: '#D4A574',
  cardAccent: '#A7C4A0',
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
    accent: colors.cardAccent ?? colors.primary ?? '#D4A574',
    headerColor: colors.cardHeading ?? colors.primary ?? '#8B7355',
    softBackground: (colors.text ?? '#2D2A26') + '0F',
    subtleBorder: (colors.border ?? '#E5DDD3') + '80',
    iconTint: colors.primary || '#8B7355',
    stepDotBackground: (colors.text ?? '#2D2A26') + '26',
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,

    cardTextColorLight: '#2D2A26',
    cardTextColorDark: '#FAF7F2',
    cardTextSecondaryColorLight: '#4A4540',
    cardTextSecondaryColorDark: '#E8E2D9',
    cardTextColor: '#2D2A26',
    cardTextSecondaryColor: '#4A4540',
    overlayBg: (colors.text ?? '#2D2A26') + '33',
    menuBg: (colors.surface ?? '#F5F0E8') + 'F2',
    menuBorder: (colors.border ?? '#E5DDD3') + '99',
    divider: (colors.border ?? '#E5DDD3') + '99',
    triggerBg: 'rgba(0, 0, 0, 0.2)',
    triggerBorder: 'rgba(255, 255, 255, 0.3)',
    triggerIconColor: '#FFFFFF',
    triggerIconShadowColor: '#00000055',
    iconColor: colors.text ?? '#2D2A26',
    labelColor: colors.text ?? '#2D2A26',
    menuShadowOpacity: 0.2,
    menuShadowRadius: 12,

    backgroundImageOpacity: 1,
    backgroundImageOverlay: 'rgba(0, 0, 0, 0.18)',
  };

  const DARK_COMPUTED: ComputedTheme = {
    accent: colors.cardAccent ?? colors.primary ?? '#A7C4A0',
    headerColor: colors.cardHeading ?? colors.primary ?? '#D4A574',
    softBackground: (colors.surface ?? '#3D3835') + '33',
    subtleBorder: (colors.text ?? '#FAF7F2') + '30',
    iconTint: colors.text ?? '#FAF7F2',
    stepDotBackground: 'rgba(250, 247, 242, 0.35)',
    textShadowColor: (colors.background ?? '#2D2A26') + '66',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,

    cardTextColorLight: '#2D2A26',
    cardTextColorDark: '#FAF7F2',
    cardTextSecondaryColorLight: '#4A4540',
    cardTextSecondaryColorDark: '#E8E2D9',
    cardTextColor: '#FAF7F2',
    cardTextSecondaryColor: '#E8E2D9',
    overlayBg: 'rgba(30, 27, 24, 0.6)',
    menuBg: 'rgba(61, 56, 53, 0.95)',
    menuBorder: 'rgba(250, 247, 242, 0.2)',
    divider: 'rgba(250, 247, 242, 0.1)',
    triggerBg: 'rgba(0, 0, 0, 0.2)',
    triggerBorder: 'rgba(250, 247, 242, 0.3)',
    triggerIconColor: '#FAF7F2',
    triggerIconShadowColor: 'transparent',
    iconColor: '#FAF7F2',
    labelColor: '#FAF7F2',
    menuShadowOpacity: 0.35,
    menuShadowRadius: 16,

    backgroundImageOpacity: 1,
    backgroundImageOverlay: 'rgba(30, 27, 24, 0.28)',
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
