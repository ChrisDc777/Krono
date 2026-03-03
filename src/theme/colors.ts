// Common platform colors remain the same
const platformColors = {
  codeforces: "#1877F2", // Blue
  leetcode: "#FFA116", // Orange
  codechef: "#8B4513", // Brown
  atcoder: "#1C1917", // Black (Light Mode default)
  codingninjas: "#D04D28", // Orange-Red
  geeksforgeeks: "#2F8D46", // Green
};

// Override specifically for Dark Mode
const darkPlatformColors = {
  ...platformColors,
  atcoder: "#FFFFFF", // White for high contrast in dark mode
};

const commonStatus = {
  success: "#166534", // Green 800
  error: "#DC2626", // Red 600
  warning: "#D97706", // Amber 600
  info: "#0284C7", // Sky 600
};

export const lightColors = {
  background: "#FAFAFA", // Zinc 50
  surface: "#FFFFFF", // White
  surfaceHighlight: "#F4F4F5", // Zinc 100
  border: "#E4E4E7", // Zinc 200

  primary: "#18181B", // Black accent in light mode
  secondary: "#52525B", // Zinc 600
  accent: "#3F3F46", // Zinc 700

  text: {
    primary: "#09090B", // Zinc 950
    secondary: "#52525B", // Zinc 600
    muted: "#A1A1AA", // Zinc 400
    disabled: "#E4E4E7", // Zinc 200
    inverse: "#FFFFFF", // White text
  },

  status: commonStatus,
  platforms: platformColors,

  isDark: false,
};

export const darkColors = {
  background: "#121212", // Charcoal
  surface: "#1E1E1E", // Lighter charcoal
  surfaceHighlight: "#2A2A2A", // Highlight
  border: "#383838", // Subtle border

  primary: "#FAFAFA", // White accent
  secondary: "#9E9E9E", // Neutral 400
  accent: "#C0C0C0", // Neutral 300

  text: {
    primary: "#FAFAFA", // White
    secondary: "#9E9E9E", // Neutral gray
    muted: "#757575", // Mid gray
    disabled: "#4A4A4A", // Dim
    inverse: "#121212", // Charcoal
  },

  status: {
    ...commonStatus,
    error: "#EF4444", // Red 500
    success: "#22C55E", // Green 500
    warning: "#F59E0B", // Amber 500
    info: "#0EA5E9", // Sky 500
  },
  platforms: darkPlatformColors,

  isDark: true,
};

// Default export for backwards compatibility
export const colors = lightColors;
