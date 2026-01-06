import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme/colors';
import { PLATFORMS } from '../../types/platform';
import { UnifiedProfile } from '../../types/user';
import { SleekCard } from './SleekCard';

interface ProfileCardProps {
  profile: UnifiedProfile;
}

const { width } = Dimensions.get('window');

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const router = useRouter();

  const handlePress = () => {
    // Navigate to profile details if needed
    // router.push(`/profile/${profile.id}`);
  };

  const PlatformColors: Record<string, string> = {
      leetcode: '#FFA116',
      codeforces: '#1877F2', // Custom Blue as requested
      codechef: '#8B4513', // Brown for CodeChef
      atcoder: '#1C1917', // Black for AtCoder (High Contrast)
      geeksforgeeks: '#2F8D46',
      codingninjas: '#D04D28'
  };

  // Determine Platform Brand Color
  const brandColor = PlatformColors[profile.platformId] || '#1C1917';
  
  // Format rank for display
  // Ensuring fallback to 'Unrated' doesn't override valid empty strings weirdly
  const rankDisplay = (profile.rank && profile.rank !== 'Unrated') 
      ? profile.rank.toUpperCase() 
      : (profile.rating ? `RATED` : 'UNRATED'); // Fallback if rating exists but rank is missing
  const globalRankDisplay = profile.globalRank ? `#${profile.globalRank}` : '-';

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <SleekCard style={styles.container} variant="default" customShadowColor={brandColor}>
        
        {/* Row 1: Platform & Username */}
        <View style={styles.topRow}>
             <View style={styles.platformPill}>
                 <MaterialCommunityIcons name={PLATFORMS[profile.platformId]?.icon as any || 'code-tags'} size={14} color={brandColor} />
                 <Text style={[styles.platformText, { color: brandColor }]}>
                     {PLATFORMS[profile.platformId]?.name.toUpperCase()}
                 </Text>
             </View>
             <Text style={styles.username} numberOfLines={1}>@{profile.username}</Text>
        </View>

        {/* Row 2: Hero Rating */}
        <View style={styles.heroSection}>
             <Text style={[styles.heroRating, { color: brandColor }]}>
                 {profile.rating || '-'}
             </Text>
             <Text style={styles.heroLabel}>RATING</Text>
        </View>

        {/* Row 3: Rank Badge (The "Title") */}
        <View style={[styles.rankBadge, { backgroundColor: brandColor }]}>
             <Text style={styles.rankText}>{rankDisplay}</Text>
        </View>

        {/* Row 4: Stats Grid (Solved Only) */}
        <View style={styles.statsGrid}>
            <View style={[styles.statItem, { alignItems: 'center', width: '100%' }]}>
                <Text style={styles.statLabel}>SOLVED</Text>
                <Text style={styles.statValue}>{profile.problemsSolved}</Text>
            </View>
        </View>
        
      </SleekCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300, // Fixed width for carousel
    minHeight: 260, 
    marginRight: 16, // Horizontal spacing
    marginBottom: 0, 
    justifyContent: 'space-between'
  },
  topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10
  },
  platformPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingHorizontal: 8,
      paddingVertical: 5,
      borderRadius: 12, // Softer
      borderWidth: 1,
      borderColor: colors.border
  },
  platformText: {
      fontSize: 10,
      fontWeight: '900',
      marginLeft: 4,
      letterSpacing: 0.5
  },
  username: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text.primary
  },
  heroSection: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: -10,
      marginBottom: 10
  },
  heroRating: {
      fontSize: 56,
      fontWeight: '900',
      lineHeight: 60,
      letterSpacing: -1
  },
  heroLabel: {
      fontSize: 10,
      fontWeight: '900',
      color: colors.text.muted,
      letterSpacing: 2,
      marginTop: 0
  },
  rankBadge: {
      paddingVertical: 8,
      borderRadius: 12, // Softer matches card
      alignItems: 'center',
      marginBottom: 16,
      width: '100%'
  },
  rankText: {
      color: colors.text.inverse,
      fontSize: 14,
      fontWeight: '900',
      letterSpacing: 1,
      textTransform: 'uppercase'
  },
  statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderTopWidth: 2,
      borderTopColor: colors.background,
      paddingTop: 12
  },
  statItem: {
      justifyContent: 'center'
  },
  statLabel: {
      fontSize: 9,
      fontWeight: '900',
      color: colors.text.muted,
      marginBottom: 2
  },
  statValue: {
      fontSize: 14,
      fontWeight: '900',
      color: colors.text.primary
  }
});
