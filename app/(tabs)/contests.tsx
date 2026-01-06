import { isSameDay, isTomorrow } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, SectionList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Chip, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TimelineItem } from '../../src/components/ui/TimelineItem';
import { useTheme } from '../../src/hooks/useTheme';
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
    // ... rest of logic
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
  }, [upcomingContests, selectedPlatform]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Hero Header */}
      <View style={styles.heroHeader}>
         <View>
             <Text style={[styles.heroLabel, { color: colors.text.secondary }]}>SCHEDULE</Text>
             <Text style={[styles.heroTitle, { color: colors.text.primary }]}>Contests</Text>
         </View>
      </View>

      {/* Control Bar (Filter Only) */}
      <View style={styles.controlBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
          <Chip
            selected={selectedPlatform === 'all'}
            onPress={() => setSelectedPlatform('all')}
            style={[
                styles.chip, 
                { backgroundColor: colors.surface, borderColor: colors.border }, 
                selectedPlatform === 'all' && [styles.chipSelected, { backgroundColor: colors.text.primary, borderColor: colors.primary }]
            ]}
            textStyle={{ 
                color: selectedPlatform === 'all' ? colors.text.inverse : colors.text.primary,
                fontWeight: '700'
            }}
            showSelectedOverlay
          >
            All
          </Chip>
          {Object.values(PLATFORMS).map(platform => (
            <Chip
              key={platform.id}
              selected={selectedPlatform === platform.id}
              onPress={() => setSelectedPlatform(platform.id)}
              style={[
                  styles.chip, 
                  { backgroundColor: colors.surface, borderColor: colors.border }, 
                  selectedPlatform === platform.id && { backgroundColor: platform.color, borderColor: platform.color }
              ]}
              textStyle={{ 
                  color: selectedPlatform === platform.id 
                    ? (platform.id === 'atcoder' && isDarkMode ? '#000000' : '#FFFFFF') 
                    : colors.text.primary,
                  fontWeight: '700'
              }}
              showSelectedOverlay
            >
              {platform.name}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <SectionList
  // ... rest of list
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
          <View style={[styles.sectionHeader, { 
              backgroundColor: colors.background, 
              borderColor: colors.border 
          }]}>
            <View style={[styles.sectionTitleBadge, { backgroundColor: colors.text.primary }]}>
                <Text style={[styles.sectionTitle, { color: colors.text.inverse }]}>{title}</Text>
            </View>
            <View style={[styles.sectionLine, { backgroundColor: colors.border }]} />
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
                <Text style={[styles.emptyText, { color: colors.text.muted }]}>No contests found matching criteria.</Text>
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
  },
  heroHeader: {
      paddingHorizontal: 24,
      paddingVertical: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
  },
  heroLabel: {
      fontSize: 12,
      fontWeight: '900',
      letterSpacing: 2,
      marginBottom: 4
  },
  heroTitle: {
      fontSize: 42,
      fontWeight: '900',
      lineHeight: 42,
      letterSpacing: -1
  },
  controlBar: {
      paddingBottom: 20,
      zIndex: 10
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20
  },
  chip: {
    borderWidth: 2, // Thick
    height: 36,
    borderRadius: 8,
  },
  chipSelected: {
      borderWidth: 2,
  },
  listContent: {
    paddingBottom: 40,
    paddingTop: 10
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionTitleBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 4,
      marginRight: 12
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  sectionLine: {
      flex: 1,
      height: 2,
      borderRadius: 1
  },
  emptyContainer: {
      alignItems: 'center',
      marginTop: 60
  },
  emptyText: {
      fontWeight: '500'
  }
});
