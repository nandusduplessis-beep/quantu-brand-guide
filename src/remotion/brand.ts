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

// Brand themes for the Resonance ecosystem (colors from Figma monogram source)
export const BRAND_THEMES = {
  tqi:          { label: 'The Quantum Insider', accent: '#0AA0AB', glow: '#0014F0', monogram: '#0AA0AB' },
  qhub:         { label: 'QHUB',               accent: '#0AA0AB', glow: '#0014F0', monogram: '#0AA0AB' },
  resonance:    { label: 'Resonance',           accent: '#0014F0', glow: '#0014F0', monogram: '#0014F0' },
  aiInsider:    { label: 'AI Insider',          accent: '#5D00F4', glow: '#5D00F4', monogram: '#5D00F4' },
  spaceInsider: { label: 'Space Insider',       accent: '#00438E', glow: '#00438E', monogram: '#00438E' },
} as const;

// Resonance hexagon monogram SVG path data (3 concentric rings)
export const MONOGRAM_PATHS = {
  outer: 'M206.972 386.844C187.436 398.123 163.366 398.123 143.83 386.844L31.5711 322.031C12.0348 310.752 0 289.907 0 267.349L0 137.723C0 115.164 12.0348 94.3194 31.571 83.0401L143.83 18.2274C163.366 6.94826 187.436 6.94827 206.972 18.2275L319.231 83.0401C338.767 94.3194 350.802 115.164 350.802 137.723L350.802 267.349C350.802 289.907 338.767 310.752 319.231 322.031L206.972 386.844ZM1.60685 266.42C1.60685 288.979 13.6416 309.824 33.1778 321.103L143.83 384.988C163.366 396.268 187.436 396.268 206.972 384.988L317.624 321.103C337.16 309.824 349.195 288.979 349.195 266.421L349.195 138.651C349.195 116.092 337.16 95.2473 317.624 83.968L206.972 20.083C187.436 8.80379 163.366 8.80379 143.83 20.083L33.1779 83.968C13.6417 95.2473 1.60685 116.092 1.60685 138.651L1.60685 266.42Z',
  middle: 'M164.272 301.251C147.526 310.919 126.895 310.919 110.15 301.251L27.0609 253.28C10.3155 243.612 0 225.745 0 206.409L0 110.466C0 91.1299 10.3156 73.2628 27.0609 63.5949L110.15 15.6235C126.895 5.95563 147.526 5.95566 164.272 15.6236L247.361 63.5949C264.106 73.2628 274.421 91.1299 274.421 110.466L274.421 206.409C274.421 225.745 264.106 243.612 247.36 253.28L164.272 301.251ZM1.25699 205.683C1.25699 225.019 11.5725 242.886 28.3178 252.554L110.15 299.8C126.895 309.467 147.526 309.467 164.272 299.8L246.104 252.554C262.849 242.886 273.164 225.019 273.164 205.683L273.164 111.192C273.164 91.8557 262.849 73.9887 246.104 64.3208L164.272 17.0751C147.526 7.40717 126.895 7.40718 110.15 17.0751L28.3179 64.3208C11.5725 73.9887 1.25699 91.8557 1.25699 111.192L1.25699 205.683Z',
  inner: 'M122.083 209.029C106.454 218.053 87.1988 218.053 71.5699 209.029L25.2568 182.291C9.62786 173.267 0 156.591 0 138.545L0 85.0668C0 67.02 9.62786 50.3441 25.2568 41.3207L71.5699 14.582C87.1988 5.55861 106.454 5.55861 122.083 14.582L168.396 41.3207C184.025 50.3441 193.653 67.02 193.653 85.0668L193.653 138.545C193.653 156.591 184.025 173.267 168.396 182.291L122.083 209.029ZM0.88703 138.032C0.88703 156.079 10.5148 172.755 26.1438 181.778L71.5698 208.005C87.1988 217.028 106.454 217.028 122.083 208.005L167.509 181.778C183.138 172.755 192.766 156.079 192.766 138.032L192.766 85.579C192.766 67.5322 183.138 50.8563 167.509 41.8329L122.083 15.6063C106.454 6.58293 87.1988 6.58292 71.5699 15.6063L26.1438 41.833C10.5149 50.8563 0.88703 67.5322 0.88703 85.579L0.88703 138.032Z',
} as const;

export type BrandThemeKey = keyof typeof BRAND_THEMES;

// Dark theme UI tokens (from Resonance design system)
export const UI = {
  bg: '#0A0A14',
  bgCard: '#12121E',
  bgCardHover: '#181830',
  textPrimary: '#E8E8F0',
  textSecondary: '#8A8AA0',
  textMuted: '#5A5A70',
  border: 'rgba(255,255,255,0.06)',
  borderActive: 'rgba(0,20,240,0.3)',
} as const;

// Hexagon ring opacity semantics
export const RING_OPACITIES = {
  outer: 0.3,   // The Field — raw, unprocessed signal
  middle: 0.7,  // The Structure — analytical framework
  inner: 1.0,   // The Intelligence — verified, certain
} as const;

export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
