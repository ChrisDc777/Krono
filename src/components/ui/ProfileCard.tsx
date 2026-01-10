import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { PLATFORMS } from '../../types/platform';
import { UnifiedProfile } from '../../types/user';

interface ProfileCardProps {
  profile: UnifiedProfile;
}


export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const { colors, dark } = useTheme();
  // 'dark' is a property of MD3Theme.
  // We can also assume standard dark mode behavior or just rely on 'colors' for most things.
  // Let's bring back isDarkMode if we need it for AtCoder specifically.
  // A safe way if our theme supports it or we inferred it:
  const isDarkMode = dark; 

  // Platform specific color logic
  const platformConfig = PLATFORMS[profile.platformId];
  let platformColor = platformConfig?.color || colors.primary;
  
  // Special Handling for AtCoder (White Brand Color) through "effective" color
  // In Light Mode: Use Black (#000000) so it's visible.
  // In Dark Mode: Keep White (#FFFFFF) as it glows nicely against dark bg.
  if (profile.platformId === 'atcoder' && !isDarkMode) {
      platformColor = '#000000';
  }

  // Text color on top of the platformColor (for pills/rank)
  // If the background is white (AtCoder in Dark Mode), text must be black.
  // Otherwise (usual colored brands or Black AtCoder), text can be white.
  const onPlatformColor = (profile.platformId === 'atcoder' && isDarkMode) ? '#000000' : '#FFFFFF';
  
  // Check for valid profile data
  const handle = profile.username || 'Unknown';
  const rating = profile.rating !== undefined ? profile.rating : 'Unrated';
  const rank = profile.rank || '';

  return (
    <Surface style={[styles.card, { backgroundColor: platformColor }]} elevation={4}>
      {/* Watermark Icon - Fills spacing */}
      <View style={styles.watermarkContainer}>
           <MaterialCommunityIcons 
              name={platformConfig?.icon as any || 'code-tags'} 
              size={140} 
              color={onPlatformColor} 
              style={{ opacity: 0.1 }}
           />
      </View>

      <View style={styles.cardInner}>
        
        {/* Header: Platform & Solved Count */}
        <View style={styles.header}>
            <View style={[styles.platformPill, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                 <MaterialCommunityIcons 
                    name={platformConfig?.icon as any || 'code-tags'} 
                    size={14} 
                    color={onPlatformColor} 
                 />
                 <Text variant="labelSmall" style={{ marginLeft: 4, color: onPlatformColor, fontWeight: '800', fontSize: 10 }}>
                    {profile.platformId?.toUpperCase()}
                 </Text>
            </View>
            
            <View style={[styles.statPill, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
                  <MaterialCommunityIcons name="check-decagram-outline" size={14} color={onPlatformColor} />
                  <Text variant="labelSmall" style={{ marginLeft: 4, color: onPlatformColor, fontWeight: '700' }}>
                    {profile.problemsSolved || 0}
                  </Text>
            </View>
        </View>

        {/* Hero: Rating, Rank, Handle */}
        <View style={styles.heroContainer}>
            {profile.rating !== undefined ? (
                <Text variant="displayLarge" style={{ fontWeight: '900', color: onPlatformColor, lineHeight: 60, letterSpacing: -2, includeFontPadding: false }}>
                    {rating}
                </Text>
            ) : (
                 <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: onPlatformColor, fontStyle: 'italic', opacity: 0.8 }}>
                    {rating}
                 </Text>
            )}
             
            {rank ? (
                <Text variant="titleMedium" style={{ color: onPlatformColor, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, opacity: 0.9 }}>
                    {rank}
                </Text>
            ) : null}

            <Text variant="bodyMedium" style={{ fontWeight: '600', color: onPlatformColor, opacity: 0.75, marginTop: 4 }}>
                @{handle}
            </Text>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 280, // Slightly narrower for better carousel feel
    height: 180, // Compact height
    borderRadius: 24,
    marginRight: 0,
    borderWidth: 0, // Remove border for cleaner look
    overflow: 'hidden', // Ensure background doesn't bleed
  },
  cardInner: {
      flex: 1,
      padding: 16,
      zIndex: 2
  },
  watermarkContainer: {
      position: 'absolute',
      right: -20,
      bottom: -20,
      zIndex: 1,
      transform: [{ rotate: '-10deg' }]
  },
  header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  platformPill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
  },
  statPill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
  },
  heroContainer: {
      justifyContent: 'center',
      flex: 1,
      paddingVertical: 8
  },
});
