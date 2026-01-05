import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { Contest } from '../../types/contest';
import { PLATFORMS } from '../../types/platform';
import { formatContestTime, formatDuration } from '../../utils/dateUtils';

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

  return (
    <View style={styles.container}>
      {/* Left Time Column */}
      <View style={styles.leftColumn}>
        <Text style={styles.day}>{day}</Text>
        <Text style={styles.month}>{month}</Text>
        {/* <Text style={styles.time}>{time}</Text> */}
      </View>

      {/* Timeline Line */}
      <View style={styles.timeline}>
         <View style={[styles.dot, { borderColor: platform.color, backgroundColor: colors.background }]} />
         {!isLast && <View style={styles.line} />}
      </View>

      {/* Right Content */}
      <View style={styles.content}>
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                 <Text style={[styles.platformName, { color: platform.color }]}>{platform.name}</Text>
                 <Text style={styles.timeLabel}>{time}</Text>
            </View>
            <Text style={styles.title} numberOfLines={2}>{contest.name}</Text>
            <View style={styles.footer}>
                <Text style={styles.duration}>
                    {formatDuration(contest.durationSeconds)}
                </Text>
            </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 0, // line handles spacing
  },
  leftColumn: {
    width: 50,
    alignItems: 'center',
    paddingTop: 0,
  },
  day: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  month: {
      fontSize: 11,
      fontWeight: 'bold',
      color: colors.text.muted,
      textTransform: 'uppercase'
  },
  time: {
      fontSize: 10,
      color: colors.text.muted,
      marginTop: 4
  },
  timeline: {
    alignItems: 'center',
    width: 30,
    marginRight: 10
  },
  dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      borderWidth: 2,
      zIndex: 1,
      marginTop: 6
  },
  line: {
      width: 2,
      flex: 1,
      backgroundColor: colors.surfaceHighlight,
      marginVertical: 4
  },
  content: {
    flex: 1,
    paddingBottom: 24
  },
  card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border
  },
  cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6
  },
  platformName: {
      fontSize: 10,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 1
  },
  timeLabel: {
    fontSize: 12,
    color: colors.text.secondary
  },
  title: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text.primary,
      lineHeight: 22,
      marginBottom: 8
  },
  footer: {
      flexDirection: 'row'
  },
  duration: {
      fontSize: 11,
      color: colors.text.muted,
      backgroundColor: colors.surfaceHighlight,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6
  }
});
