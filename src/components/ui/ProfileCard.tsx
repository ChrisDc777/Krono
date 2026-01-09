import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Divider, Icon, Text, useTheme } from 'react-native-paper';
import { PLATFORMS } from '../../types/platform';
import { UnifiedProfile } from '../../types/user';

interface ProfileCardProps {
  profile: UnifiedProfile;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const { colors } = useTheme();

  // Platform specific color accents could be nice, but sticking to theme for consistency first
  // or using the requested "brand color" logic if accessible.
  // user previously asked for "platform specific colors" in the older request, let's keep it subtle or use theme.
  
  const platformIcon = PLATFORMS[profile.platformId]?.icon || 'code-tags';

  return (
    <Card style={[styles.card, { borderColor: colors.outlineVariant }]} mode="contained">
      <View style={styles.cardInner}>
        
        {/* Header: Platform & Handle */}
        <View style={styles.header}>
            <View style={[styles.platformPill, { backgroundColor: colors.surfaceVariant }]}>
                 <MaterialCommunityIcons name={platformIcon as any} size={16} color={colors.onSurfaceVariant} />
                 <Text variant="labelSmall" style={{ marginLeft: 6, color: colors.onSurfaceVariant, fontWeight: '700' }}>
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
                    <Text variant="displaySmall" style={{ fontWeight: '900', color: colors.primary, lineHeight: 42 }}>
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

            {/* Rank Title - Full Width, Centered, No Truncation */}
            {profile.rank && (
                <View style={[styles.rankContainer, { backgroundColor: colors.secondaryContainer }]}>
                    <Text 
                        variant="bodyLarge" 
                        style={{ 
                            color: colors.onSecondaryContainer, 
                            fontWeight: '600', 
                            textAlign: 'center',
                        }}
                    >
                        {profile.rank}
                    </Text>
                </View>
            )}
        </View>

        <Divider style={{ backgroundColor: colors.outlineVariant, marginVertical: 12 }} />

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
    backgroundColor: 'transparent',
    borderWidth: 1, // Subtle border instead of shadow
  },
  cardInner: {
      flex: 1,
      padding: 20, // Slightly reduced padding to allow content to breathe relative to edges if needed
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
      paddingHorizontal: 8,
      paddingVertical: 4,
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
      paddingVertical: 6, // Reduced from 8
      paddingHorizontal: 12,
      borderRadius: 12,
      marginTop: 4,
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
