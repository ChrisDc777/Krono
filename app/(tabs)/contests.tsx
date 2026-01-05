import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Chip, IconButton, Searchbar, Text } from 'react-native-paper';
import { useContestStore } from '../../src/stores/useContestStore';
import { colors } from '../../src/theme/colors';
import { Contest } from '../../src/types/contest';
import { PLATFORMS, PlatformId } from '../../src/types/platform';
import { formatContestTime, formatDuration } from '../../src/utils/dateUtils';

export default function ContestsScreen() {
  const { upcomingContests, loadContests, syncContests, toggleReminder, isLoading } = useContestStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadContests();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await syncContests();
    setRefreshing(false);
  };

  const filteredContests = upcomingContests.filter(contest => {
    const matchesPlatform = selectedPlatform === 'all' || contest.platformId === selectedPlatform;
    const matchesSearch = contest.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const renderItem = ({ item }: { item: Contest }) => {
    const handleToggleReminder = () => {
      toggleReminder(item.id, !item.reminderSet);
    };

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={[styles.platformName, { color: PLATFORMS[item.platformId].color }]}>
              {PLATFORMS[item.platformId].name}
            </Text>
            <Text style={styles.startTime}>{formatContestTime(item.startTime)}</Text>
          </View>
          <Text style={styles.contestName}>{item.name}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.duration}>Duration: {formatDuration(item.durationSeconds)}</Text>
            <View style={styles.footerActions}>
              {item.isRated && <Chip compact style={styles.ratedChip}>Rated</Chip>}
              <IconButton
                icon={item.reminderSet ? 'bell' : 'bell-outline'}
                iconColor={item.reminderSet ? colors.accent : colors.text.secondary}
                size={20}
                onPress={handleToggleReminder}
                style={styles.reminderButton}
              />
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Searchbar
          placeholder="Search contests"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          placeholderTextColor={colors.text.secondary}
          iconColor={colors.text.secondary}
          inputStyle={{ color: colors.text.primary }}
        />
        <View style={styles.chipsContainer}>
          <Chip
            selected={selectedPlatform === 'all'}
            onPress={() => setSelectedPlatform('all')}
            style={styles.chip}
            showSelectedOverlay
          >
            All
          </Chip>
          {Object.values(PLATFORMS).map(platform => (
            <Chip
              key={platform.id}
              selected={selectedPlatform === platform.id}
              onPress={() => setSelectedPlatform(platform.id)}
              style={styles.chip}
              showSelectedOverlay
            >
              {platform.name}
            </Chip>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredContests}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.emptyText}>No contests found matching your criteria.</Text>
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
    backgroundColor: colors.background,
    paddingTop: 50,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  searchBar: {
    backgroundColor: colors.surface,
    marginBottom: 10,
    elevation: 0,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.surfaceHighlight,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.surface,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  platformName: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  startTime: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  contestName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duration: {
    color: colors.text.disabled,
    fontSize: 12,
  },
  ratedChip: {
    height: 24,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  emptyText: {
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 50,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reminderButton: {
    margin: 0,
  },
});
