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
  const accent = preset.accent ?? mixHex(dominant, '#ffffff' as Hex, 0.3);
  const background =
    preset.background ?? mixHex(dominant, '#ffffff' as Hex, 0.85);
  const surface = mixHex(background, '#ffffff' as Hex, 0.1);
  const text = preset.textLight ?? bestTextOn(background);
  const textSecondary = mixHex(
    text,
    (text === '#ffffff' ? '#000000' : '#ffffff') as Hex,
    0.5,
  );
  const border = mixHex(text, background, 0.85);
  const cardBackground = surface;
  const cardBackBackground = mixHex(surface, '#ffffff' as Hex, 0.06);
  const searchBackground = 'rgba(250,247,242,0.9)';
  const shadowColor = '#9B9388';

  return {
    primary: accent,
    secondary: mixHex(accent, '#d1d5db' as Hex, 0.5),
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
  const accent = preset.accent ?? mixHex(dominant, '#000000' as Hex, 0.2);
  const background =
    preset.background ?? mixHex(dominant, '#000000' as Hex, 0.68);
  const surface = mixHex(background, '#000000' as Hex, 0.08);
  const text = preset.textDark ?? bestTextOn(background);
  const textSecondary = mixHex(
    text,
    (text === '#ffffff' ? '#000000' : '#ffffff') as Hex,
    0.7,
  );
  const border = mixHex(text, background, 0.72);
  const cardBackground = mixHex(surface, '#3D3835' as Hex, 0.2);
  const cardBackBackground = mixHex(cardBackground, '#2D2A26' as Hex, 0.18);
  const searchBackground = 'rgba(45,42,38,0.9)';
  const shadowColor = '#1E1B18';

  return {
    primary: accent,
    secondary: mixHex(accent, '#3D3835' as Hex, 0.5),
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
