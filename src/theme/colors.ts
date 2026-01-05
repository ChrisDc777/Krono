export const colors = {
  // Vibrant Dark Theme - "Cyber Nebula"
  background: '#13111C', // Deep, rich violet-black, not pitch black
  surface: '#1E1B2E',    // Lighter violet-grey
  surfaceHighlight: '#2D2A42',
  border: '#3E3B56',
  
  primary: '#A855F7', // Vivid Purple
  secondary: '#06B6D4', // Electric Cyan
  accent: '#F43F5E', // Neon Rose
  
  text: {
    primary: '#F8FAFC', // Crisp White
    secondary: '#CBD5E1', // Bright Grey
    muted: '#94A3B8',
    disabled: '#475569',
    inverse: '#0F172A',
  },
  
  status: {
    success: '#34D399', // Emerald
    error: '#F87171',   // Soft Red
    warning: '#FBBF24', // Amber
    info: '#60A5FA',    // Blue
  },
  
  platforms: {
    codeforces: '#3B82F6', 
    leetcode: '#F59E0B',   
    codechef: '#D97706',   // More vibrant amber/gold
    atcoder: '#FFFFFF',    
    geeksforgeeks: '#22C55E', 
  },

  // Gradients ( simulated with object for usage in styles)
  gradients: {
    primary: ['#A855F7', '#C084FC'],
    surface: ['#1E1B2E', '#2D2A42'],
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
