// Shared Step 3 back-lengthening color palette (PRIMARY supplied per variant).

export const STEP3_COLORS_BASE = {
  PURPLE: '#A29FCF',
  PINK: '#FDCFE1',
  GREEN: '#DAEDBD',
  GRAY: '#E6E6E6',
  WHITE: '#ffffff',
  BLACK: '#000',
  TEXT_PRIMARY: '#1A1A1A',
  TEXT_SECONDARY: '#6b7280',
  BACKGROUND: '#F8F9FA',
  DIVIDER: '#CCCCCC',
  BLUE: '#009FE3',
  ORANGE: '#E76F51',
} as const;

export type Step3Colors = typeof STEP3_COLORS_BASE & { PRIMARY: string };

export function step3ColorsWithPrimary(primary: string): Step3Colors {
  return { ...STEP3_COLORS_BASE, PRIMARY: primary };
}
