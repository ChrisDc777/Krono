import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface SleekCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary' | 'accent' | 'default';
  customShadowColor?: string;
}

export const SleekCard = ({ children, style, variant = 'primary', customShadowColor }: SleekCardProps) => {
  // Determine shadow color based on variant
  let shadowColor = colors.primary;
  if (variant === 'secondary') shadowColor = colors.secondary;
  if (variant === 'accent') shadowColor = colors.accent;
  if (variant === 'default') shadowColor = '#1C1917'; // Match primary Black
  
  // Override if custom color provided
  if (customShadowColor) shadowColor = customShadowColor;

  return (
    <View style={[styles.shadowLayer, { backgroundColor: shadowColor }, style]}>
      <View style={styles.cardContent}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowLayer: {
    borderRadius: 16, // Squircle-like
    marginBottom: 16,
    marginRight: 4,
  },
  cardContent: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 16,
    borderRadius: 16, // Match shadow layer
    // Offset the content "up and left" relative to the shadow layer
    // to reveal the shadow on bottom-right
    transform: [{ translateX: -4 }, { translateY: -4 }],
    minHeight: 50, 
  }
});
