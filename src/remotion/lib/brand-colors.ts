export const BRAND = {
  quantumTeal: "hsl(186, 90%, 35%)",
  quantumLightTeal: "hsl(186, 47%, 68%)",
  quantumDark: "hsl(237, 89%, 7%)",
  resonanceBlue: "hsl(230, 100%, 47%)",
  resonanceGray: "hsl(220, 13%, 76%)",
  white: "#ffffff",
} as const;

export const GRADIENTS = {
  quantum: `linear-gradient(135deg, ${BRAND.quantumTeal}, ${BRAND.quantumLightTeal})`,
  resonance: `linear-gradient(135deg, ${BRAND.resonanceBlue}, ${BRAND.quantumTeal})`,
  dark: `linear-gradient(160deg, ${BRAND.quantumDark}, hsl(237, 70%, 12%))`,
} as const;
