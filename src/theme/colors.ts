// Common platform colors remain the same
const platformColors = {
    codeforces: '#1C1917', 
    leetcode: '#1C1917',   
    codechef: '#1C1917',   
    atcoder: '#1C1917',    
    codingninjas: '#1C1917',
    geeksforgeeks: '#1C1917',
};

const commonStatus = {
    success: '#166534', // Green 800
    error: '#DC2626',   // Red 600
    warning: '#D97706', // Amber 600
    info: '#0284C7',    // Sky 600
};

export const lightColors = {
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
  
  status: commonStatus,
  platforms: platformColors,
  
  isDark: false
};

export const darkColors = {
  background: '#0C0A09', // Stone 950
  surface: '#1C1917',    // Stone 900
  surfaceHighlight: '#292524', // Stone 800
  border: '#57534E',     // Stone 600 (Softer border for dark mode)
  
  primary: '#F5F5F4', // Stone 100 (White-ish)
  secondary: '#A8A29E', // Stone 400
  accent: '#78716C', // Stone 500
  
  text: {
    primary: '#F5F5F4', // Stone 100
    secondary: '#D6D3D1', // Stone 300
    muted: '#78716C', // Stone 500
    disabled: '#57534E', // Stone 600
    inverse: '#1C1917', // Black text on white
  },
  
  status: {
    ...commonStatus,
    error: '#EF4444', // Red 500 (Brighter for dark mode)
    success: '#22C55E', // Green 500
    warning: '#F59E0B', // Amber 500
    info: '#0EA5E9', // Sky 500
  },
  platforms: platformColors,

  isDark: true
};

// Default export for backwards compatibility during refactor (Points to Light temporarily)
export const colors = lightColors;
