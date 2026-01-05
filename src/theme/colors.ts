export const colors = {
  // Premium Midnight Theme
  background: '#09090B', // Zinc 950 - Very dark, almost black, distinct from "void" black
  surface: '#18181B',    // Zinc 900
  surfaceHighlight: '#27272A', // Zinc 800
  border: '#27272A', // Subtle borders
  
  // Sophisticated Accents
  primary: '#6366F1', // Indigo 500 - Professional, trustworthy
  primaryDark: '#4F46E5', // Indigo 600
  secondary: '#EC4899', // Pink 500 - For specific highlights
  accent: '#F59E0B',     // Amber 500 - Gold/Premium feel
  
  text: {
    primary: '#FAFAFA', // Zinc 50
    secondary: '#A1A1AA', // Zinc 400
    muted: '#71717A',    // Zinc 500
    disabled: '#52525B', // Zinc 600
    inverse: '#000000',
  },
  
  status: {
    success: '#10B981', // Emerald 500
    error: '#EF4444',   // Red 500
    warning: '#F59E0B', // Amber 500
    info: '#3B82F6',    // Blue 500
  },
  
  platforms: {
    codeforces: '#228BE6', // Crisp Blue
    leetcode: '#FAB005',   // Rich Yellow
    codechef: '#BE4BDB',   // Grape/Purple (Distinct from standard brown)
    atcoder: '#FFFFFF',    // White
    geeksforgeeks: '#40C057', // Lime Green
  },

  gradients: {
    primary: ['#6366F1', '#8B5CF6'], // Indigo -> Violet
    card: ['#18181B', '#18181B'], // Solid for now, or subtle gradient
    glass: ['rgba(24, 24, 27, 0.7)', 'rgba(24, 24, 27, 0.3)'],
    gold: ['#F59E0B', '#D97706'],
  }
};

export const darkTheme = {
  dark: true,
  colors: {
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text.primary,
    border: colors.border,
    notification: colors.secondary,
  },
};
