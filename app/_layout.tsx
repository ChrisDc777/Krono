import {
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
    useFonts,
} from "@expo-google-fonts/inter";
import {
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
} from "@expo-google-fonts/jetbrains-mono";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { registerBackgroundTask } from "../src/services/backgroundTask";
import {
    notificationService,
    setupNotificationHandler,
} from "../src/services/notificationService";
import { useThemeStore } from "../src/stores/useThemeStore";
import { theme as md3Theme } from "../src/theme/md3-theme";

// Set up the notification handler synchronously as early as possible,
// before any async work or renders. This is the correct place — NOT inside
// the module body of notificationService.ts, where the native module may
// not yet be initialised.
setupNotificationHandler();

// Keep the splash screen visible while fonts are loading.
SplashScreen.preventAutoHideAsync();

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

    // Hide the splash screen as soon as fonts are ready.
    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    // One-time service initialisation — runs only once after first mount.
    // Kept separate from the font effect so a font-reload never re-triggers these.
    useEffect(() => {
        registerBackgroundTask();
        notificationService.requestPermissions();
    }, []);

    if (!fontsLoaded) {
        return null;
    }

    const activeTheme = isDarkMode ? md3Theme.dark : md3Theme.light;

    return (
        <PaperProvider theme={activeTheme}>
            <StatusBar
                style={isDarkMode ? "light" : "dark"}
                backgroundColor={activeTheme.colors.background}
            />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="+not-found" />
            </Stack>
        </PaperProvider>
    );
}
