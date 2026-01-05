import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface SleekCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'highlight' | 'bordered';
}

export const SleekCard: React.FC<SleekCardProps> = ({ children, style, variant = 'default' }) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'highlight': return colors.surfaceHighlight;
      case 'bordered': return 'transparent';
      default: return colors.surface;
    }
  };

  const getBorder = () => {
    if (variant === 'bordered') return { borderWidth: 1, borderColor: colors.border };
    return {};
  };

  return (
    <View style={[styles.card, { backgroundColor: getBackgroundColor() }, getBorder(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    // Soft shadow for iOS
    shadowColor: colors.primary, // Use primary color for shadow for a glow effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    // Elevation for Android
    elevation: 6,
  }
});
