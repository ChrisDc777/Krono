import { format, isSameDay, isTomorrow } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { Linking, RefreshControl, ScrollView, SectionList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Appbar, Card, Chip, List, Text, useTheme } from 'react-native-paper';
import { useContestStore } from '../../src/stores/useContestStore';
import { Contest } from '../../src/types/contest';
import { PLATFORMS, PlatformId } from '../../src/types/platform';

export default function ContestsScreen() {
  const { colors, isDarkMode } = useTheme();
  const { upcomingContests, loadContests, syncContests, isLoading } = useContestStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId | 'all'>('all');

  useEffect(() => {
    loadContests();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await syncContests();
    setRefreshing(false);
  };

  // Filter and Group Data
  const sections = useMemo(() => {
    const filtered = upcomingContests.filter(contest => {
      const matchesPlatform = selectedPlatform === 'all' || contest.platformId === selectedPlatform;
      return matchesPlatform;
    });

    const today: Contest[] = [];
    const tomorrow: Contest[] = [];
    const thisWeek: Contest[] = [];
    const upcoming: Contest[] = [];

    const now = new Date();

    filtered.forEach(contest => {
      const startDate = new Date(contest.startTime);
      if (isNaN(startDate.getTime())) return;
      
      if (isSameDay(startDate, now)) {
        today.push(contest);
      } else if (isTomorrow(startDate)) {
        tomorrow.push(contest);
      } else {
        const diffTime = Math.abs(startDate.getTime() - now.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        if (diffDays <= 7) {
            thisWeek.push(contest);
        } else {
            upcoming.push(contest);
        }
      }
    });

    const result = [];
    if (today.length > 0) result.push({ title: 'Today', data: today });
    if (tomorrow.length > 0) result.push({ title: 'Tomorrow', data: tomorrow });
    if (thisWeek.length > 0) result.push({ title: 'This Week', data: thisWeek });
    if (upcoming.length > 0) result.push({ title: 'Later', data: upcoming });

    return result;
  }, [upcomingContests, selectedPlatform]);

  const renderContestItem = ({ item }: { item: Contest }) => {
     const startDate = new Date(item.startTime);
     const totalMinutes = Math.round(item.durationSeconds / 60);
     const hours = Math.floor(totalMinutes / 60);
     const minutes = totalMinutes % 60;
     const durationText = hours > 0 
        ? (minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`) 
        : `${minutes}m`;
        
     const platformColor = PLATFORMS[item.platformId]?.color || colors.primary;

     return (
        <Card 
            style={[styles.card, { borderColor: colors.outlineVariant }]} 
            mode="outlined"
            onPress={() => item.url && Linking.openURL(item.url)}
        >
            <Card.Content style={styles.cardContent}>
              <View style={[styles.iconContainer, { backgroundColor: platformColor + '15' }]}>
                 <List.Icon icon="trophy-outline" color={platformColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="titleMedium" numberOfLines={1}>{item.name}</Text>
                <Text variant="bodySmall" style={{ color: colors.secondary }}>
                   {item.platformId} • {format(startDate, 'HH:mm')}
                </Text>
              </View>
              <View>
                 <Chip textStyle={{ fontSize: 11 }} style={{ backgroundColor: colors.surfaceVariant }} compact>{durationText}</Chip>
              </View>
            </Card.Content>
        </Card>
     );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header elevated mode="center-aligned" style={{ backgroundColor: colors.surface }}>
        <Appbar.Content title="Schedule" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      {/* Chips Filter */}
      <View style={{ backgroundColor: colors.surface, paddingBottom: 12 }}>
         <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.chipsContainer}
         >
          <Chip
            selected={selectedPlatform === 'all'}
            onPress={() => setSelectedPlatform('all')}
            style={styles.chip}
            showSelectedOverlay
            mode="outlined"
          >
            All
          </Chip>
          {Object.values(PLATFORMS).map(platform => (
            <Chip
              key={platform.id}
              selected={selectedPlatform === platform.id}
              onPress={() => setSelectedPlatform(platform.id)}
              style={[styles.chip, selectedPlatform === platform.id && { borderColor: platform.color, backgroundColor: platform.color + '20' }]}
              textStyle={selectedPlatform === platform.id ? { color: platform.color, fontWeight: 'bold' } : {}}
              showSelectedOverlay
              mode="outlined"
            >
              {platform.name}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderContestItem}
        renderSectionHeader={({ section: { title } }) => (
          <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
             <Text variant="titleMedium" style={{ color: colors.primary, fontWeight: 'bold' }}>{title}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
                <Text variant="bodyLarge" style={{ color: colors.onSurfaceVariant }}>No contests found.</Text>
            </View>
          ) : (
            <ActivityIndicator style={{ marginTop: 20 }} color={colors.primary} />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chipsContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
      marginRight: 8
  },
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  card: {
      marginBottom: 12,
      backgroundColor: 'transparent'
  },
  cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 12
  },
  iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 40,
      height: 40,
      borderRadius: 20
  },
  emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 60
  }
});
