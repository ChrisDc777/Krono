// Common platform colors remain the same
const platformColors = {
    codeforces: '#1877F2', // Blue
    leetcode: '#FFA116',   // Orange
    codechef: '#8B4513',   // Brown
    atcoder: '#1C1917',    // Black (Light Mode default)
    codingninjas: '#D04D28', // Orange-Red
    geeksforgeeks: '#2F8D46', // Green
};

// Override specifically for Dark Mode
const darkPlatformColors = {
    ...platformColors,
    atcoder: '#FFFFFF', // White for high contrast in dark mode
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
  background: '#09090B', // Zinc 950
  surface: '#18181B',    // Zinc 900
  surfaceHighlight: '#27272A', // Zinc 800
  border: '#3F3F46',     // Zinc 700
  
  primary: '#FAFAFA', // Zinc 50
  secondary: '#A1A1AA', // Zinc 400
  accent: '#71717A', // Zinc 500
  
  text: {
    primary: '#FAFAFA', // Zinc 50
    secondary: '#A1A1AA', // Zinc 400
    muted: '#71717A', // Zinc 500
    disabled: '#52525B', // Zinc 600
    inverse: '#09090B', // Zinc 950
  },
  
  status: {
    ...commonStatus,
    error: '#EF4444', // Red 500
    success: '#22C55E', // Green 500
    warning: '#F59E0B', // Amber 500
    info: '#0EA5E9', // Sky 500
  },
  platforms: darkPlatformColors,

  isDark: true
};

// Default export for backwards compatibility during refactor (Points to Light temporarily)
export const colors = lightColors;
