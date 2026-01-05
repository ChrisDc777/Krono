import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { PLATFORMS } from '../../types/platform';
import { UnifiedProfile } from '../../types/user';

interface ProfileCardProps {
  profile: UnifiedProfile;
}

const { width } = Dimensions.get('window');

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  // Determine gradient based on platform color or theme
  const platformColor = PLATFORMS[profile.platformId].color;
  
  // Custom dark gradient logic: Mix rich dark Slate with a hint of the platform color
  // Default to Slate/Zinc if no match
  const gradientColors = [colors.surfaceHighlight, colors.surface];
  
  return (
    <View style={styles.shadowContainer}>
    <LinearGradient
      colors={[colors.surfaceHighlight, colors.background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.platformIconContainer}>
             <MaterialCommunityIcons name={PLATFORMS[profile.platformId].icon as any} size={20} color={platformColor} />
             <Text style={styles.platformName}>{PLATFORMS[profile.platformId].name}</Text>
        </View>
        {profile.rank && (
            <View style={[styles.rankBadge, { borderColor: platformColor, backgroundColor: 'rgba(0,0,0,0.3)' }]}>
                <Text style={[styles.rankText, { color: platformColor }]}>{profile.rank}</Text>
            </View>
        )}
      </View>

      <View style={styles.content}>
        <View>
             <Text style={styles.label}>RATING</Text>
             <Text style={[styles.rating, { color: platformColor }]}>
                {profile.rating}
             </Text>
             {profile.maxRating && (
                 <Text style={styles.maxRating}>Max: {profile.maxRating}</Text>
             )}
        </View>
        
        <View style={styles.rightStats}>
            <Text style={styles.label}>SOLVED</Text>
            <Text style={styles.solved}>{profile.problemsSolved}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.handle} numberOfLines={1}>{profile.displayName}</Text>
        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.text.muted} />
      </View>

       {/* Decorative glow line at top */}
       <View style={[styles.glowLine, { backgroundColor: platformColor }]} />
    </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 10,
    marginRight: 16,
  },
  container: {
    width: width * 0.75, // 75% of screen width
    height: 170,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative'
  },
  glowLine: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  platformIconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6
  },
  platformName: {
      color: colors.text.secondary,
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 0.5,
      textTransform: 'uppercase'
  },
  rankBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
      borderWidth: 1,
  },
  rankText: {
      fontSize: 10,
      fontWeight: 'bold',
  },
  content: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginVertical: 10
  },
  label: {
      fontSize: 10,
      color: colors.text.muted,
      fontWeight: 'bold',
      marginBottom: 2,
      letterSpacing: 1
  },
  rating: {
      fontSize: 32,
      fontWeight: '800',
      letterSpacing: -1
  },
  maxRating: {
      fontSize: 11,
      color: colors.text.muted,
      marginTop: 2
  },
  rightStats: {
      alignItems: 'flex-end'
  },
  solved: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text.primary
  },
  footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.05)'
  },
  handle: {
      fontSize: 14,
      color: colors.text.primary,
      fontWeight: '500',
      maxWidth: '80%'
  }
});
