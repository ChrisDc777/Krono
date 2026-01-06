import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useTheme } from '../../hooks/useTheme';
import { Contest } from '../../types/contest';
import { TimelineItem } from '../ui/TimelineItem';

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
  const { colors } = useTheme();

  const displayedContests = limit ? contests.slice(0, limit) : contests;

  if (isLoading) {
      return <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} />;
  }

  if (contests.length === 0) {
      return (
          <View style={styles.emptyContainer}>
               <Text style={[styles.emptyText, { color: colors.text.muted }]}>{emptyMessage}</Text>
          </View>
      );
  }

  return (
    <View style={styles.container}>
      {displayedContests.map((contest, index) => (
        <TimelineItem 
            key={contest.id} 
            contest={contest} 
            isLast={index === displayedContests.length - 1} 
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
     // Container styles if needed
  },
  emptyContainer: {
      paddingVertical: 20,
      alignItems: 'center'
  },
  emptyText: {
      fontSize: 14,
      fontWeight: '500'
  }
});
