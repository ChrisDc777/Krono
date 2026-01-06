import { format, isSameDay, parseISO } from 'date-fns';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Contest } from '../../types/contest';
import { PLATFORMS } from '../../types/platform';

interface TimelineItemProps {
  contest: Contest;
  isLast?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ contest, isLast }) => {
  const { colors, isDarkMode } = useTheme();

  const handlePress = async () => {
    if (contest.url) {
      await WebBrowser.openBrowserAsync(contest.url);
    }
  };

  const getBrandColor = (platformId: string) => {
    switch(platformId) {
        case 'codeforces': return '#1877F2';
        case 'codechef': return '#8B4513';
        case 'leetcode': return '#FFA116';
        case 'atcoder': return isDarkMode ? '#FFFFFF' : '#1C1917';
        case 'geeksforgeeks': return '#2F8D46';
        case 'codingninjas': return '#D04D28';
        default: return colors.primary;
    }
  };

  const brandColor = getBrandColor(contest.platformId);
  
  // Handle startTime potentially being a string from JSON/DB or a Date object
  const startTime = typeof contest.startTime === 'string' 
      ? parseISO(contest.startTime) 
      : contest.startTime;

  const formattedTime = format(startTime, 'h:mm a');
  const formattedDate = format(startTime, 'MMM d');
  const isToday = isSameDay(startTime, new Date());
  const durationHours = (contest.durationSeconds / 3600).toFixed(1);

  return (
    <View style={styles.container}>
      {/* Left: Time Column */}
      <View style={styles.timeColumn}>
        <Text style={[styles.timeText, { color: colors.text.primary }]}>{formattedTime}</Text>
        <Text style={[styles.dateText, { color: colors.text.muted }]}>{isToday ? 'Today' : formattedDate}</Text>
        {!isLast && <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />}
      </View>

      {/* Right: Card */}
       <TouchableOpacity 
          style={[styles.cardContainer, { 
              backgroundColor: colors.surface, 
              borderColor: colors.border,
              shadowColor: brandColor 
          }]} 
          onPress={handlePress}
          activeOpacity={0.8}
       >
          <View style={[styles.accentStrip, { backgroundColor: brandColor }]} />
          
          <View style={styles.cardContent}>
              <View style={styles.headerRow}>
                  <Text style={[styles.platformName, { color: colors.text.secondary }]}>
                      {PLATFORMS[contest.platformId]?.name.toUpperCase() || contest.platformId}
                  </Text>
                  <View style={[styles.durationBadge, { backgroundColor: colors.background }]}>
                      <Text style={[styles.durationText, { color: colors.text.muted }]}>{durationHours}h</Text>
                  </View>
              </View>
              
              <Text style={[styles.contestTitle, { color: colors.text.primary }]} numberOfLines={2}>
                  {contest.name}
              </Text>
          </View>
       </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 0,
    minHeight: 100
  },
  timeColumn: {
    width: 60,
    alignItems: 'flex-end',
    paddingRight: 16,
    paddingTop: 4
  },
  timeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 8,
    marginRight: 6, // Center with text roughly
    borderRadius: 1
  },
  cardContainer: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    
    // Hard Shadow
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0
  },
  accentStrip: {
      width: 6,
      height: '100%'
  },
  cardContent: {
      flex: 1,
      padding: 12
  },
  headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6
  },
  platformName: {
      fontSize: 10,
      fontWeight: '900',
      letterSpacing: 0.5
  }
});
