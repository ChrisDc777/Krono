import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface SleekCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'outlined' | 'flat';
  customShadowColor?: string;
}

export const SleekCard: React.FC<SleekCardProps> = ({ 
    children, 
    style, 
    variant = 'default',
    customShadowColor 
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {/* Hard Shadow Layer - Neo Brutalist Style */}
      {variant !== 'flat' && (
        <View style={[
          styles.shadowLayer, 
          { 
            backgroundColor: customShadowColor || colors.primary,
            borderColor: colors.border // Match border color
          }
        ]} />
      )}
      
      {/* Content Layer */}
      <View style={[
        styles.cardContent,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        variant === 'outlined' && { backgroundColor: 'transparent' }
      ]}>
        {children}
      </View>
    </View>
  );
};

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
