import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { Contest } from '../../types/contest';
import { PLATFORMS } from '../../types/platform';
import { formatContestTime, formatDuration } from '../../utils/dateUtils';
import { SleekCard } from './SleekCard';

interface TimelineItemProps {
  contest: Contest;
  isLast?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ contest, isLast = false }) => {
  const platform = PLATFORMS[contest.platformId];
  
  const startTime = new Date(contest.startTime);
  const day = startTime.getDate();
  const month = startTime.toLocaleString('default', { month: 'short' }).toUpperCase();
  const time = formatContestTime(new Date(contest.startTime));

  const getBrandColor = () => {
       if (contest.platformId === 'leetcode') return '#FFA116'; 
       if (contest.platformId === 'codechef') return '#8B4513'; // Brown
       if (contest.platformId === 'codeforces') return '#1877F2'; // Blue
       return '#1C1917';
  };

  const brandColor = getBrandColor();

  return (
    <View style={styles.container}>
      {/* Left Time Column - Vertical Stack */}
      <View style={styles.leftColumn}>
        <Text style={styles.day}>{day}</Text>
        <Text style={styles.month}>{month}</Text>
      </View>

      {/* Right Content - Wrapped Card */}
      <View style={styles.content}>
        <SleekCard style={styles.card} variant="default" customShadowColor={brandColor}>
            <View style={styles.cardHeader}>
                 <Text style={[styles.platformName, { color: brandColor }]}>{platform.name}</Text>
                 <Text style={styles.timeLabel}>{time}</Text>
            </View>
            <Text style={styles.title} numberOfLines={2}>{contest.name}</Text>
            <View style={styles.footer}>
                <Text style={styles.duration}>
                    {formatDuration(contest.durationSeconds)}
                </Text>
            </View>
        </SleekCard>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  leftColumn: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 4, 
    marginRight: 8
  },
  day: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text.primary,
  },
  month: {
      fontSize: 10,
      fontWeight: 'bold',
      color: colors.text.muted,
      textTransform: 'uppercase'
  },
  content: {
    flex: 1,
  },
  card: {
      minHeight: 80,
      marginRight: 0
  },
  cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6
  },
  platformName: {
      fontSize: 10,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 1
  },
  timeLabel: {
    fontSize: 11,
    color: colors.text.secondary,
    fontWeight: '600'
  },
  title: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text.primary,
      lineHeight: 20,
      marginBottom: 8
  },
  footer: {
      flexDirection: 'row'
  },
  duration: {
      fontSize: 10,
      color: colors.text.inverse,
      backgroundColor: colors.text.secondary,
      paddingHorizontal: 6,
      paddingVertical: 2,
      fontWeight: 'bold'
  }
});
