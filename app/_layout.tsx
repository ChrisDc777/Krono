import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { colors } from '../src/theme/colors';

// Adapt our custom colors to React Native Paper theme
import { darkTheme } from '../src/theme/colors';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...darkTheme.colors,
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

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </PaperProvider>
  );
}
