import { isSameDay, isTomorrow } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { RefreshControl, SectionList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Chip, Searchbar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TimelineItem } from '../../src/components/ui/TimelineItem';
import { useContestStore } from '../../src/stores/useContestStore';
import { colors } from '../../src/theme/colors';
import { Contest } from '../../src/types/contest';
import { PLATFORMS, PlatformId } from '../../src/types/platform';

export default function ContestsScreen() {
  const { upcomingContests, loadContests, syncContests, isLoading } = useContestStore();
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

  // Filter and Group Data
  const sections = useMemo(() => {
    const filtered = upcomingContests.filter(contest => {
      const matchesPlatform = selectedPlatform === 'all' || contest.platformId === selectedPlatform;
      const matchesSearch = contest.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPlatform && matchesSearch;
    });

    const today: Contest[] = [];
    const tomorrow: Contest[] = [];
    const thisWeek: Contest[] = [];
    const upcoming: Contest[] = [];

    const now = new Date();

    filtered.forEach(contest => {
      const startDate = new Date(contest.startTime);
      if (isSameDay(startDate, now)) {
        today.push(contest);
      } else if (isTomorrow(startDate)) {
        tomorrow.push(contest);
      } else {
        // Simple heuristic for "This Week" (next 7 days)
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
  }, [upcomingContests, selectedPlatform, searchQuery]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
         <Text style={styles.headerTitle}>Contests</Text>
         <Text style={styles.headerSubtitle}>Upcoming schedule</Text>
      </View>

      <View style={styles.filterSection}>
        <Searchbar
          placeholder="Search..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          placeholderTextColor={colors.text.secondary}
          iconColor={colors.text.secondary}
          inputStyle={{ color: colors.text.primary, minHeight: 40 }}
          theme={{ colors: { onSurfaceVariant: colors.text.secondary } }} // Fix cancel icon color
        />
        <View style={styles.chipsContainer}>
          <Chip
            selected={selectedPlatform === 'all'}
            onPress={() => setSelectedPlatform('all')}
            style={[styles.chip, selectedPlatform === 'all' && styles.chipSelected]}
            textStyle={{ color: selectedPlatform === 'all' ? colors.text.inverse : colors.text.primary }}
            showSelectedOverlay
          >
            All
          </Chip>
          {Object.values(PLATFORMS).map(platform => (
            <Chip
              key={platform.id}
              selected={selectedPlatform === platform.id}
              onPress={() => setSelectedPlatform(platform.id)}
              style={[styles.chip, selectedPlatform === platform.id && { backgroundColor: platform.color }]}
              textStyle={{ 
                  color: selectedPlatform === platform.id 
                    ? (platform.id === 'atcoder' ? '#000' : '#FFF') 
                    : colors.text.primary,
                  fontWeight: selectedPlatform === platform.id ? 'bold' : 'normal'
              }}
              showSelectedOverlay
            >
              {platform.name}
            </Chip>
          ))}
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item, section, index }) => (
            <View style={{ paddingHorizontal: 20 }}>
                <TimelineItem 
                    contest={item} 
                    isLast={index === section.data.length - 1} 
                />
            </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No contests found matching criteria.</Text>
            </View>
          ) : (
            <ActivityIndicator style={{ marginTop: 20 }} color={colors.primary} />
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
  },
  headerSubtitle: {
      fontSize: 14,
      color: colors.text.secondary,
      marginTop: -2,
  },
  filterSection: {
      paddingHorizontal: 20,
      paddingBottom: 10
  },
  searchBar: {
    backgroundColor: colors.surface,
    elevation: 0,
    borderWidth: 1,
    borderColor: colors.border,
    height: 46,
    marginBottom: 12
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    height: 32
  },
  chipSelected: {
      backgroundColor: colors.text.primary,
      borderWidth: 0
  },
  listContent: {
    paddingBottom: 40,
  },
  sectionHeader: {
    backgroundColor: colors.background, 
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  emptyContainer: {
      alignItems: 'center',
      marginTop: 60
  },
  emptyText: {
      color: colors.text.muted
  }
});
