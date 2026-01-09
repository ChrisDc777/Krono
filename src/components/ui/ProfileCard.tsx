import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Divider, Icon, Text, useTheme } from 'react-native-paper';
import { PLATFORMS } from '../../types/platform';
import { UnifiedProfile } from '../../types/user';

interface ProfileCardProps {
  profile: UnifiedProfile;
}

  // Platform specific color logic
  const platformConfig = PLATFORMS[profile.platformId];
  const platformColor = platformConfig?.color || colors.primary;
  const platformIcon = platformConfig?.icon || 'code-tags';
  const isDarkPlatform = profile.platformId === 'atcoder' && isDarkMode; // Handle AtCoder white on dark

  // Dynamic Text Color for contrast on colored backgrounds
  // Simple heuristic: if platform is AtCoder (white/black), handle explicitly
  const textColor = profile.platformId === 'atcoder' && !isDarkMode ? '#000000' : platformColor;
  
  return (
    <Card style={[styles.card, { borderColor: platformColor + '40', backgroundColor: platformColor + '05' }]} mode="outlined">
      <View style={styles.cardInner}>
        
        {/* Header: Platform & Handle */}
        <View style={styles.header}>
            <View style={[styles.platformPill, { backgroundColor: platformColor + '20' }]}>
                 <MaterialCommunityIcons 
                    name={platformIcon as any} 
                    size={16} 
                    color={profile.platformId === 'atcoder' && isDarkMode ? '#000000' : platformColor} 
                 />
                 <Text variant="labelSmall" style={{ marginLeft: 6, color: profile.platformId === 'atcoder' && isDarkMode ? '#000000' : platformColor, fontWeight: '700' }}>
                    {profile.platformId.toUpperCase()}
                 </Text>
            </View>
            <Text variant="titleSmall" style={{ fontWeight: 'bold', color: colors.onSurface, opacity: 0.8 }} numberOfLines={1}>
                @{profile.username}
            </Text>
        </View>

        {/* Hero: Rating & Rank */}
        <View style={styles.heroContainer}>
            {profile.rating !== undefined ? (
                <>
                    <Text variant="displaySmall" style={{ fontWeight: '900', color: textColor, lineHeight: 42 }}>
                        {profile.rating}
                    </Text>
                    <Text variant="labelSmall" style={{ color: colors.outline, marginTop: 4, marginBottom: 12, letterSpacing: 2, textTransform: 'uppercase' }}>
                        Rating
                    </Text>
                </>
            ) : (
                 <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: colors.outline, fontStyle: 'italic', marginVertical: 12 }}>
                    Unrated
                 </Text>
            )}

            {/* Rank Title - Full Width, Centered, Tinted Background */}
            {profile.rank && (
                <View style={[styles.rankContainer, { backgroundColor: platformColor }]}>
                    <Text 
                        variant="bodyLarge" 
                        style={{ 
                            color: profile.platformId === 'atcoder' && !isDarkMode ? '#FFFFFF' : '#FFFFFF', // Force white text on colored bg
                            fontWeight: '700', 
                            textAlign: 'center',
                            textShadowColor: 'rgba(0,0,0,0.2)',
                            textShadowRadius: 2
                        }}
                    >
                        {profile.rank}
                    </Text>
                </View>
            )}
        </View>

        <Divider style={{ backgroundColor: colors.outlineVariant, marginVertical: 12, opacity: 0.5 }} />

        {/* Footer: Stats (Problems Solved) */}
        <View style={styles.footer}>
             <View style={styles.statItem}>
                  <Icon source="check-circle-outline" size={18} color={colors.secondary} />
                  <Text variant="bodyMedium" style={{ marginLeft: 6, color: colors.onSurfaceVariant }}>
                    <Text style={{ fontWeight: 'bold', color: colors.onSurface }}>{profile.problemsSolved || 0}</Text> Solved
                  </Text>
             </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 300, 
    minHeight: 260,
    borderRadius: 24,
    marginRight: 0,
    borderWidth: 1.5, // Slightly thicker border
  },
  cardInner: {
      flex: 1,
      padding: 20,
      justifyContent: 'space-between'
  },
  header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4
  },
  platformPill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 100,
  },
  heroContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      marginVertical: 4
  },
  rankContainer: {
      width: '100%',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 12,
      marginTop: 8,
      alignItems: 'center',
      justifyContent: 'center'
  },
  footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
  },
  statItem: {
      flexDirection: 'row',
      alignItems: 'center'
  }
});
