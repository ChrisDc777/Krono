import { useThemeStore } from '../stores/useThemeStore';
import { darkColors, lightColors } from '../theme/colors';

export const useTheme = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  
  return {
    colors: isDarkMode ? darkColors : lightColors,
    isDarkMode,
    toggleTheme: useThemeStore((state) => state.toggleTheme)
  };
};
