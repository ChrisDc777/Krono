export const colors = {
  // Neutral Neo-Brutalist (Stone Paper)
  background: '#F5F5F4', // Stone 100
  surface: '#FFFFFF',    // White
  surfaceHighlight: '#E7E5E4', // Stone 200
  border: '#1C1917',     // Stone 900 (Black)
  
  primary: '#1C1917', // Black
  secondary: '#57534E', // Stone 600
  accent: '#A8A29E', // Stone 400
  
  text: {
    primary: '#1C1917', // Stone 900
    secondary: '#57534E', // Stone 600
    muted: '#A8A29E', // Stone 400
    disabled: '#D6D3D1', // Stone 300
    inverse: '#FFFFFF', // White text on black
  },
  
  status: {
    success: '#166534', // Green 800
    error: '#DC2626',   // Red 600
    warning: '#D97706', // Amber 600
    info: '#0284C7',    // Sky 600
  },

  platforms: {
    codeforces: '#1C1917', 
    leetcode: '#1C1917',   
    codechef: '#1C1917',   
    atcoder: '#1C1917',    
    codingninjas: '#1C1917',
    geeksforgeeks: '#1C1917',
  },
};

export const darkTheme = {
  dark: false, // Switch to Light Mode
  colors: {
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text.primary,
    border: colors.border,
    notification: colors.primary,
    surface: colors.surface,
    onSurface: colors.text.primary,
    error: colors.status.error,
    placeholder: colors.text.muted,
    backdrop: 'rgba(0,0,0,0.5)',
    elevation: {
        level0: 'transparent',
        level1: colors.surface,
        level2: colors.surface,
        level3: colors.surface,
        level4: colors.surface,
        level5: colors.surface,
    }
  },
};
