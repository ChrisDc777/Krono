export const colors = {
  // Dark mode primary
  background: '#121212',
  surface: '#1e1e1e',
  surfaceHighlight: '#2c2c2c',
  
  primary: '#6b3ac2', // Deep purple
  accent: '#03dac6', // Teal
  
  text: {
    primary: '#ffffff',
    secondary: '#b0b0b0',
    disabled: '#6e6e6e',
  },
  
  status: {
    success: '#4caf50',
    error: '#cf6679',
    warning: '#fb8c00',
    info: '#2196f3',
  },
  
  platforms: {
    codeforces: '#1f8dd6',
    leetcode: '#ffa116',
    codechef: '#5b4638',
    atcoder: '#ffffff',
    codingninjas: '#f66c24',
    geeksforgeeks: '#2f8d46',
  }
};

export const darkTheme = {
  dark: true,
  colors: {
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text.primary,
    border: colors.surfaceHighlight,
    notification: colors.accent,
  },
};
