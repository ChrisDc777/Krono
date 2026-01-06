import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { colors } from '../src/theme/colors';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    error: colors.status.error,
    elevation: {
      level0: 'transparent',
      level1: colors.surface,
      level2: colors.surfaceHighlight,
      level3: colors.surfaceHighlight,
      level4: colors.surfaceHighlight,
      level5: colors.surfaceHighlight,
    }
  },
};

import { useThemeStore } from '../src/stores/useThemeStore';

export default function RootLayout() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <PaperProvider theme={theme}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </PaperProvider>
  );
}
