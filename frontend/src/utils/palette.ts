export type Hex = `#${string}`;

export interface PalettePreset {
  dominant: Hex;
  accent?: Hex;
  background?: Hex;
  textLight?: Hex;
  textDark?: Hex;
}

export interface ThemeColorsPatch {
  primary?: Hex;
  secondary?: Hex;
  background?: Hex;
  surface?: Hex;
  text?: Hex;
  textSecondary?: Hex;
  border?: Hex;
  cardBackground?: Hex;
  cardBackBackground?: Hex;
  searchBackground?: string;
  shadowColor?: Hex | string;
}

function clamp01(x: number) {
  return Math.min(1, Math.max(0, x));
}

function hexToRgb(hex: Hex) {
  const m = hex.replace('#', '');
  const norm =
    m.length === 3
      ? m
          .split('')
          .map((c) => c + c)
          .join('')
      : m;
  const bigint = parseInt(norm, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number): Hex {
  const toHex = (v: number) =>
    Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}` as Hex;
}

function mixHex(a: Hex, b: Hex, t: number): Hex {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const r = Math.round(A.r + (B.r - A.r) * clamp01(t));
  const g = Math.round(A.g + (B.g - A.g) * clamp01(t));
  const bl = Math.round(A.b + (B.b - A.b) * clamp01(t));
  return rgbToHex(r, g, bl);
}

function getLuma(hex: Hex) {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
}

function bestTextOn(bg: Hex): Hex {
  return getLuma(bg) > 0.55 ? ('#111111' as Hex) : ('#FFFFFF' as Hex);
}

export function buildLightPatch(preset: PalettePreset): ThemeColorsPatch {
  const dominant = preset.dominant;
  // Organic Flow: sage green as primary, terracotta as accent
  const accent = preset.accent ?? mixHex(dominant, '#D4A574' as Hex, 0.5);
  const background =
    preset.background ?? mixHex(dominant, '#FAF7F2' as Hex, 0.92);
  const surface = mixHex(background, '#F0EBE3' as Hex, 0.4);
  const text = preset.textLight ?? ('#2D2A26' as Hex);
  const textSecondary = '#7A8B6E' as Hex; // Earth moss
  const border = mixHex(dominant, '#E5DDD3' as Hex, 0.6);
  const cardBackground = mixHex(surface, '#FDFCFA' as Hex, 0.7);
  const cardBackBackground = mixHex(surface, '#F5F1EB' as Hex, 0.5);
  const searchBackground = 'rgba(250,247,242,0.95)';
  const shadowColor = mixHex(dominant, '#8B9B7E' as Hex, 0.5);

  return {
    primary: dominant, // Sage green dominant
    secondary: accent, // Terracotta accent
    background,
    surface,
    text,
    textSecondary,
    border,
    cardBackground,
    cardBackBackground,
    searchBackground,
    shadowColor,
  };
}

export function buildDarkPatch(preset: PalettePreset): ThemeColorsPatch {
  const dominant = preset.dominant;
  // Organic Flow: lighter sage for dark mode with terracotta accent
  const lightSage = mixHex(dominant, '#ffffff' as Hex, 0.2);
  const accent =
    preset.accent ?? mixHex('#D4A574' as Hex, '#ffffff' as Hex, 0.15);
  const background =
    preset.background ?? mixHex(dominant, '#1E2420' as Hex, 0.85);
  const surface = mixHex(background, '#2A302B' as Hex, 0.5);
  const text = preset.textDark ?? ('#FAF7F2' as Hex);
  const textSecondary = '#C4D4BE' as Hex; // Light sage
  const border = mixHex(dominant, '#3D4A3F' as Hex, 0.5);
  const cardBackground = mixHex(surface, '#2D3530' as Hex, 0.6);
  const cardBackBackground = mixHex(cardBackground, '#252B27' as Hex, 0.5);
  const searchBackground = 'rgba(30,36,32,0.95)';
  const shadowColor = '#0F1210';

  return {
    primary: lightSage, // Lighter sage for dark
    secondary: accent, // Terracotta accent
    background,
    surface,
    text,
    textSecondary,
    border,
    cardBackground,
    cardBackBackground,
    searchBackground,
    shadowColor,
  };
}

export function buildPalettesFromPreset(preset: PalettePreset): {
  light: ThemeColorsPatch;
  dark: ThemeColorsPatch;
} {
  return {
    light: buildLightPatch(preset),
    dark: buildDarkPatch(preset),
  };
}
