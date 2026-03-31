// TQI Brand Constants for Remotion Compositions
export const BRAND = {
  colors: {
    quantumTeal: '#0aa0ab',
    deepNavy: '#040620',
    coolGray: '#bec1c9',
    resonanceBlue: '#0014f0',
    white: '#ffffff',
  },
  fonts: {
    primary: 'Roboto',
    weights: ['400', '700'] as const,
  },
  tagline: 'Actionable quantum intelligence and bespoke solutions — empowering confident decisions that move the industry forward.',
  name: 'The Quantum Insider',
  shortName: 'TQI',
} as const;

// Brand themes for the Resonance ecosystem
export const BRAND_THEMES = {
  tqi:          { label: 'The Quantum Insider', accent: '#0aa0ab', glow: '#0014f0' },
  qhub:         { label: 'QHUB',               accent: '#0aa0ab', glow: '#0014f0' },
  resonance:    { label: 'Resonance',           accent: '#0014f0', glow: '#0014f0' },
  aiInsider:    { label: 'AI Insider',          accent: '#6366f1', glow: '#8b5cf6' },
  spaceInsider: { label: 'Space Insider',       accent: '#f97316', glow: '#ea580c' },
} as const;

export type BrandThemeKey = keyof typeof BRAND_THEMES;

export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
