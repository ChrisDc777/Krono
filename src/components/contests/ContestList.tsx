import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Surface, Text, useTheme } from 'react-native-paper';
import { Contest } from '../../types/contest';
import { PLATFORMS } from '../../types/platform';

interface ContestListProps {
  contests: Contest[];
  emptyMessage?: string;
  limit?: number;
  isLoading?: boolean;
}

export const ContestList: React.FC<ContestListProps> = ({ 
    contests, 
    emptyMessage = "No contests found.", 
    limit,
    isLoading = false
}) => {
  const { colors, dark } = useTheme();
  // Map 'dark' property to 'isDarkMode' variable for compatibility with existing logic
  const isDarkMode = dark;

  const displayedContests = limit ? contests.slice(0, limit) : contests;

  if (isLoading) {
      return <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} />;
  }

  if (contests.length === 0) {
      return (
          <View style={styles.emptyContainer}>
               <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>{emptyMessage}</Text>
          </View>
      );
  }

  return (
    <View style={styles.container}>
      {displayedContests.map((contest) => {
        const startTime = new Date(contest.startTime);
        const platformConfig = PLATFORMS[contest.platformId];
        let platformColor = platformConfig?.color || colors.primary;
        
        // AtCoder Light Mode Visibility Fix
        if (contest.platformId === 'atcoder' && !isDarkMode) {
             platformColor = '#000000';
        }

        const totalMinutes = Math.round(contest.durationSeconds / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const durationText = hours > 0  ? (minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`) : `${minutes}m`;

        return (
          <Surface 
            key={contest.id} 
            style={[
                styles.card, 
                { 
                    backgroundColor: colors.surface,
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)'
                }
            ]} 
            elevation={1} 
            mode="flat"
          >
             {/* Left Tint Bar */}
             <View style={[styles.tintBar, { backgroundColor: platformColor }]} />

             {/* Watermark */}
             <View style={styles.watermarkContainer}>
                  <MaterialCommunityIcons 
                      name={platformConfig?.icon as any || 'trophy-outline'} 
                      size={80} 
                      color={platformColor} 
                      style={{ opacity: 0.05 }}
                  />
             </View>

             <View style={styles.contentContainer} onTouchEnd={() => contest.url && Linking.openURL(contest.url)}>
                {/* Header: Platform & Date */}
                <View style={styles.row}>
                    <View style={[styles.platformPill, { backgroundColor: platformColor + '15' }]}>
                        <MaterialCommunityIcons name={platformConfig?.icon as any} size={12} color={platformColor} />
                        <Text style={{ marginLeft: 4, color: platformColor, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>
                            {contest.platformId}
                        </Text>
                    </View>
                    <Text variant="labelSmall" style={{ color: colors.outline }}>
                        {format(startTime, 'MMM d, HH:mm')}
                    </Text>
                </View>

                {/* Title */}
                <Text variant="titleMedium" style={{ fontWeight: 'bold', marginVertical: 8, color: colors.onSurface }} numberOfLines={2}>
                    {contest.name}
                </Text>

                {/* Footer: Duration */}
                 <View style={styles.row}>
                    <View style={styles.durationPill}>
                        <MaterialCommunityIcons name="clock-outline" size={12} color={colors.secondary} />
                        <Text variant="labelSmall" style={{ marginLeft: 4, color: colors.secondary, fontWeight: '600' }}>
                            {durationText}
                        </Text>
                    </View>
                 </View>
             </View>
          </Surface>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
     gap: 16,
     paddingHorizontal: 20
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)', // Subtle border
    // Shadow for iOS/Android
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 4, // Higher elevation for android
    marginBottom: 2
  },
  tintBar: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 6,
      zIndex: 2
  },
  watermarkContainer: {
      position: 'absolute',
      right: -10,
      bottom: -15,
      zIndex: 1,
      transform: [{ rotate: '-10deg' }]
  },
  contentContainer: {
      padding: 16,
      paddingLeft: 22, // Space for tint bar
      zIndex: 2
  },
  row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
  },
  platformPill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
  },
  durationPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.03)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8
  },
  emptyContainer: {
      paddingVertical: 20,
      alignItems: 'center'
  }
});

