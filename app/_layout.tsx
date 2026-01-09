import {
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
    useFonts
} from '@expo-google-fonts/inter';
import {
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold
} from '@expo-google-fonts/jetbrains-mono';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { registerBackgroundTask } from '../src/services/backgroundTask';
import { useThemeStore } from '../src/stores/useThemeStore';
import { theme as md3Theme } from '../src/theme/md3-theme';

// ... (previous imports)

// The theme creation logic is moved to src/theme/md3-theme.ts
// We will select the correct object inside the component based on store


export default function RootLayout() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
  });

  useEffect(() => {
    // Initialize background sync
    registerBackgroundTask();

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  /* 
     We select specific theme based on mode 
     Type casting 'as any' is often needed if Paper types mismatch with custom tokens slightly, 
     but our definition is standard MD3.
  */
  const activeTheme = isDarkMode ? md3Theme.dark : md3Theme.light;

  return (
    <PaperProvider theme={activeTheme}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} backgroundColor={activeTheme.colors.background} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </PaperProvider>
  );
}
