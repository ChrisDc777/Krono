import { format } from 'date-fns';
import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, List, Text, useTheme } from 'react-native-paper';
import { Contest } from '../../types/contest';

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
               <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>{emptyMessage}</Text>
          </View>
      );
  }

  return (
    <View style={styles.container}>
      {displayedContests.map((contest) => {
        const startTime = new Date(contest.startTime);
        return (
          <Card 
            key={contest.id} 
            style={styles.card} 
            mode="elevated" 
            elevation={2}
            onPress={() => contest.url && Linking.openURL(contest.url)}
          >
            <Card.Content style={styles.cardContent}>
              <View style={styles.iconContainer}>
                 <List.Icon icon="trophy-outline" color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="titleMedium" numberOfLines={1}>{contest.name}</Text>
                <Text variant="bodySmall" style={{ color: colors.secondary }}>
                   {contest.platformId} • {format(startTime, 'MMM d, HH:mm')}
                </Text>
              </View>
              <View>
                 <Text variant="labelSmall" style={{ color: colors.tertiary }}>
                    {(() => {
                        const totalMinutes = Math.round(contest.durationSeconds / 60);
                        const hours = Math.floor(totalMinutes / 60);
                        const minutes = totalMinutes % 60;
                        if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
                        if (hours > 0) return `${hours}h`;
                        return `${minutes}m`;
                    })()}
                 </Text>
              </View>
            </Card.Content>
          </Card>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
     gap: 12,
     paddingHorizontal: 20 // Added padding to align with other sections
  },
  card: {
    marginBottom: 0
  },
  cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
  },
  iconContainer: {
      justifyContent: 'center',
      alignItems: 'center'
  },
  emptyContainer: {
      paddingVertical: 20,
      alignItems: 'center'
  }
});

