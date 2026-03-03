import {
    MD3DarkTheme,
    MD3LightTheme,
    configureFonts,
} from "react-native-paper";
import { darkColors as customDark, lightColors as customLight } from "./colors";
import { typography } from "./typography";

// Light: Clean white with black accent
const lightColors = {
  ...MD3LightTheme.colors,
  primary: customLight.primary, // Black
  onPrimary: "#FFFFFF",
  primaryContainer: "#F4F4F5", // Zinc 100
  onPrimaryContainer: "#09090B", // Zinc 950

  secondary: customLight.secondary, // Zinc 600
  onSecondary: "#FFFFFF",
  secondaryContainer: "#F4F4F5",
  onSecondaryContainer: "#52525B",

  tertiary: customLight.accent, // Zinc 700
  onTertiary: "#FFFFFF",
  tertiaryContainer: "#E4E4E7",
  onTertiaryContainer: "#3F3F46",

  error: customLight.status.error,
  onError: "#FFFFFF",
  errorContainer: "#FEE2E2",
  onErrorContainer: "#991B1B",

  background: customLight.background,
  onBackground: customLight.text.primary,
  surface: customLight.surface,
  onSurface: customLight.text.primary,
  surfaceVariant: customLight.surfaceHighlight,
  onSurfaceVariant: customLight.text.secondary,

  outline: customLight.border,
  outlineVariant: "#E4E4E7",

  shadow: "transparent",
  scrim: "#000000",
  inverseSurface: "#18181B",
  inverseOnSurface: "#FAFAFA",
  inversePrimary: "#FAFAFA",

  elevation: {
    level0: "transparent",
    level1: "#FAFAFA",
    level2: "#F4F4F5",
    level3: "#E4E4E7",
    level4: "#E4E4E7",
    level5: "#D4D4D8",
  },
  surfaceDisabled: "rgba(0, 0, 0, 0.04)",
  onSurfaceDisabled: "rgba(0, 0, 0, 0.38)",
  backdrop: "rgba(0, 0, 0, 0.4)",
};

// Dark: Deep navy blue with white accent
const darkColors = {
  ...MD3DarkTheme.colors,
  primary: customDark.primary, // White
  onPrimary: "#121212", // Charcoal
  primaryContainer: "#2A2A2A",
  onPrimaryContainer: "#FAFAFA",

  secondary: customDark.secondary, // Slate 400
  onSecondary: "#121212",
  secondaryContainer: "#2A2A2A",
  onSecondaryContainer: "#9E9E9E",

  tertiary: customDark.accent, // Slate 300
  onTertiary: "#121212",
  tertiaryContainer: "#383838",
  onTertiaryContainer: "#C0C0C0",

  error: customDark.status.error,
  onError: "#121212",
  errorContainer: "#7F1D1D",
  onErrorContainer: "#FECACA",

  background: customDark.background,
  onBackground: customDark.text.primary,
  surface: customDark.surface,
  onSurface: customDark.text.primary,
  surfaceVariant: customDark.surfaceHighlight,
  onSurfaceVariant: customDark.text.secondary,

  outline: customDark.border,
  outlineVariant: "#2A2A2A",

  shadow: "transparent",
  scrim: "#000000",
  inverseSurface: "#FAFAFA",
  inverseOnSurface: "#121212",
  inversePrimary: "#121212",

  elevation: {
    level0: "transparent",
    level1: "#181818",
    level2: "#1E1E1E",
    level3: "#252525",
    level4: "#252525",
    level5: "#2E2E2E",
  },
  surfaceDisabled: "rgba(255, 255, 255, 0.04)",
  onSurfaceDisabled: "rgba(255, 255, 255, 0.38)",
  backdrop: "rgba(0, 0, 0, 0.5)",
};

export const theme = {
  light: {
    ...MD3LightTheme,
    fonts: configureFonts({ config: typography.fonts }),
    colors: lightColors,
  },
  dark: {
    ...MD3DarkTheme,
    fonts: configureFonts({ config: typography.fonts }),
    colors: darkColors,
  },
};
