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

// Organic Flow Light Theme - Sage green dominant with flowing organic feel
const defaultLight: ThemeColors = {
  primary: '#A7C4A0', // Sage green - dominant
  secondary: '#D4A574', // Terracotta - warm accent
  background: '#FAF7F2', // Cream
  surface: '#F0EBE3', // Warm off-white
  text: '#2D2A26', // Charcoal
  textSecondary: '#7A8B6E', // Earth moss - organic feel
  border: '#D4CFC5', // Soft natural border
  cardBackground: '#FDFCFA', // Clean white with warmth
  cardBackBackground: '#F5F1EB', // Subtle cream
  searchBackground: 'rgba(250, 247, 242, 0.95)',
  shadowColor: '#8B9B7E', // Sage-tinted shadow
  cardHeading: '#A7C4A0', // Sage green for headings
  cardAccent: '#D4A574', // Terracotta accent
};

// Organic Flow Dark Theme - Sage accents with warm earth tones
const defaultDark: ThemeColors = {
  primary: '#B8D4B0', // Lighter sage for dark mode
  secondary: '#E5B894', // Lighter terracotta
  background: '#1E2420', // Deep forest green-black
  surface: '#2A302B', // Dark sage-tinted surface
  text: '#FAF7F2', // Cream text
  textSecondary: '#C4D4BE', // Light sage secondary
  border: '#3D4A3F', // Organic dark border
  cardBackground: '#2D3530', // Dark forest card
  cardBackBackground: '#252B27', // Deeper forest
  searchBackground: 'rgba(30, 36, 32, 0.95)',
  shadowColor: '#0F1210', // Deep shadow
  cardHeading: '#B8D4B0', // Light sage heading
  cardAccent: '#E5B894', // Terracotta accent
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
    accent: colors.cardAccent ?? colors.secondary ?? '#D4A574',
    headerColor: colors.cardHeading ?? colors.primary ?? '#A7C4A0',
    softBackground: 'rgba(167, 196, 160, 0.12)', // Sage tint
    subtleBorder: 'rgba(167, 196, 160, 0.35)', // Soft sage border
    iconTint: colors.primary || '#A7C4A0',
    stepDotBackground: 'rgba(167, 196, 160, 0.3)', // Sage dots
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,

    cardTextColorLight: '#2D2A26',
    cardTextColorDark: '#FAF7F2',
    cardTextSecondaryColorLight: '#5A6B55', // Earthy green-brown
    cardTextSecondaryColorDark: '#E8E2D9',
    cardTextColor: '#2D2A26',
    cardTextSecondaryColor: '#5A6B55',
    overlayBg: 'rgba(167, 196, 160, 0.25)', // Sage overlay
    menuBg: 'rgba(250, 247, 242, 0.95)', // Warm cream
    menuBorder: 'rgba(167, 196, 160, 0.3)',
    divider: 'rgba(167, 196, 160, 0.25)',
    triggerBg: 'rgba(167, 196, 160, 0.2)', // Sage tint trigger
    triggerBorder: 'rgba(255, 255, 255, 0.4)',
    triggerIconColor: '#FFFFFF',
    triggerIconShadowColor: 'rgba(0, 0, 0, 0.3)',
    iconColor: colors.text ?? '#2D2A26',
    labelColor: colors.text ?? '#2D2A26',
    menuShadowOpacity: 0.15,
    menuShadowRadius: 16,

    backgroundImageOpacity: 1,
    backgroundImageOverlay: 'rgba(167, 196, 160, 0.12)', // Light sage overlay
  };

  const DARK_COMPUTED: ComputedTheme = {
    accent: colors.cardAccent ?? colors.secondary ?? '#E5B894',
    headerColor: colors.cardHeading ?? colors.primary ?? '#B8D4B0',
    softBackground: 'rgba(184, 212, 176, 0.12)', // Sage tint dark
    subtleBorder: 'rgba(184, 212, 176, 0.25)', // Soft sage border dark
    iconTint: colors.primary ?? '#B8D4B0',
    stepDotBackground: 'rgba(184, 212, 176, 0.3)', // Sage dots
    textShadowColor: 'rgba(15, 18, 16, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,

    cardTextColorLight: '#2D2A26',
    cardTextColorDark: '#FAF7F2',
    cardTextSecondaryColorLight: '#5A6B55',
    cardTextSecondaryColorDark: '#C4D4BE', // Light sage secondary
    cardTextColor: '#FAF7F2',
    cardTextSecondaryColor: '#C4D4BE',
    overlayBg: 'rgba(30, 36, 32, 0.65)', // Forest overlay
    menuBg: 'rgba(42, 48, 43, 0.95)', // Dark sage menu
    menuBorder: 'rgba(184, 212, 176, 0.2)',
    divider: 'rgba(184, 212, 176, 0.15)',
    triggerBg: 'rgba(184, 212, 176, 0.15)', // Sage tint trigger
    triggerBorder: 'rgba(184, 212, 176, 0.3)',
    triggerIconColor: '#FAF7F2',
    triggerIconShadowColor: 'transparent',
    iconColor: '#FAF7F2',
    labelColor: '#FAF7F2',
    menuShadowOpacity: 0.4,
    menuShadowRadius: 20,

    backgroundImageOpacity: 1,
    backgroundImageOverlay: 'rgba(30, 36, 32, 0.35)', // Forest overlay
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
