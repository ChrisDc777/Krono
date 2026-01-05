import React, { useEffect, useMemo } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Card, SegmentedButtons, Text } from 'react-native-paper';
import { useProfileStore } from '../../src/stores/useProfileStore';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { PLATFORMS } from '../../src/types/platform';

const { width: screenWidth } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const { profiles, loadProfiles } = useProfileStore();
  const [selectedView, setSelectedView] = React.useState('overview');

  useEffect(() => {
    loadProfiles();
  }, []);

  // Aggregate stats across all platforms
  const aggregateStats = useMemo(() => {
    const stats = {
      totalSolved: 0,
      totalSubmissions: 0,
      highestRating: 0,
      platformCount: profiles.length,
    };

    profiles.forEach(profile => {
      stats.totalSolved += profile.problemsSolved;
      stats.totalSubmissions += profile.totalSubmissions;
      if (profile.rating > stats.highestRating) {
        stats.highestRating = profile.rating;
      }
    });

    return stats;
  }, [profiles]);

  // Platform breakdown data
  const platformBreakdown = useMemo(() => {
    return profiles.map(profile => ({
      platform: PLATFORMS[profile.platformId].name,
      color: PLATFORMS[profile.platformId].color,
      solved: profile.problemsSolved,
      rating: profile.rating,
    }));
  }, [profiles]);

  if (profiles.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Data Yet</Text>
          <Text style={styles.emptyText}>
            Add profiles in Settings to see your analytics here.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Analytics</Text>

        {/* View Selector */}
        <SegmentedButtons
          value={selectedView}
          onValueChange={setSelectedView}
          buttons={[
            { value: 'overview', label: 'Overview' },
            { value: 'platforms', label: 'Platforms' },
          ]}
          style={styles.segmentedButtons}
        />

        {selectedView === 'overview' && (
          <>
            {/* Aggregate Stats Cards */}
            <View style={styles.statsGrid}>
              <Card style={styles.statCard}>
                <Card.Content>
                  <Text style={styles.statValue}>{aggregateStats.totalSolved}</Text>
                  <Text style={styles.statLabel}>Problems Solved</Text>
                </Card.Content>
              </Card>
              <Card style={styles.statCard}>
                <Card.Content>
                  <Text style={styles.statValue}>{aggregateStats.highestRating}</Text>
                  <Text style={styles.statLabel}>Highest Rating</Text>
                </Card.Content>
              </Card>
              <Card style={styles.statCard}>
                <Card.Content>
                  <Text style={styles.statValue}>{aggregateStats.platformCount}</Text>
                  <Text style={styles.statLabel}>Platforms</Text>
                </Card.Content>
              </Card>
              <Card style={styles.statCard}>
                <Card.Content>
                  <Text style={styles.statValue}>{aggregateStats.totalSubmissions}</Text>
                  <Text style={styles.statLabel}>Total Submissions</Text>
                </Card.Content>
              </Card>
            </View>

            {/* Problems by Platform */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Problems Solved by Platform</Text>
              <Card style={styles.chartCard}>
                <Card.Content>
                  {platformBreakdown.map((item, index) => (
                    <View key={index} style={styles.barRow}>
                      <Text style={styles.barLabel}>{item.platform}</Text>
                      <View style={styles.barContainer}>
                        <View 
                          style={[
                            styles.bar, 
                            { 
                              width: `${Math.min((item.solved / Math.max(...platformBreakdown.map(p => p.solved), 1)) * 100, 100)}%`,
                              backgroundColor: item.color 
                            }
                          ]} 
                        />
                      </View>
                      <Text style={styles.barValue}>{item.solved}</Text>
                    </View>
                  ))}
                </Card.Content>
              </Card>
            </View>

            {/* Ratings Comparison */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rating Comparison</Text>
              <Card style={styles.chartCard}>
                <Card.Content>
                  {platformBreakdown.map((item, index) => (
                    <View key={index} style={styles.ratingRow}>
                      <View style={[styles.ratingDot, { backgroundColor: item.color }]} />
                      <Text style={styles.ratingPlatform}>{item.platform}</Text>
                      <Text style={styles.ratingValue}>{item.rating}</Text>
                    </View>
                  ))}
                </Card.Content>
              </Card>
            </View>
          </>
        )}

        {selectedView === 'platforms' && (
          <>
            {profiles.map(profile => (
              <Card key={profile.id} style={styles.platformDetailCard}>
                <Card.Content>
                  <View style={styles.platformHeader}>
                    <Text style={[styles.platformName, { color: PLATFORMS[profile.platformId].color }]}>
                      {PLATFORMS[profile.platformId].name}
                    </Text>
                    <Text style={styles.platformUsername}>@{profile.username}</Text>
                  </View>
                  
                  <View style={styles.platformStats}>
                    <View style={styles.platformStat}>
                      <Text style={styles.platformStatValue}>{profile.rating}</Text>
                      <Text style={styles.platformStatLabel}>Rating</Text>
                    </View>
                    <View style={styles.platformStat}>
                      <Text style={styles.platformStatValue}>{profile.maxRating}</Text>
                      <Text style={styles.platformStatLabel}>Max Rating</Text>
                    </View>
                    <View style={styles.platformStat}>
                      <Text style={styles.platformStatValue}>{profile.problemsSolved}</Text>
                      <Text style={styles.platformStatLabel}>Solved</Text>
                    </View>
                  </View>

                  {profile.rank && (
                    <View style={styles.rankBadge}>
                      <Text style={styles.rankText}>{profile.rank}</Text>
                    </View>
                  )}
                </Card.Content>
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: typography.size.xxl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 20,
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: colors.surface,
    width: '48%',
  },
  statValue: {
    fontSize: typography.size.xxl,
    fontWeight: 'bold',
    color: colors.accent,
  },
  statLabel: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  chartCard: {
    backgroundColor: colors.surface,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  barLabel: {
    color: colors.text.primary,
    width: 80,
    fontSize: typography.size.sm,
  },
  barContainer: {
    flex: 1,
    height: 20,
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 10,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 10,
  },
  barValue: {
    color: colors.text.secondary,
    width: 40,
    textAlign: 'right',
    fontSize: typography.size.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  ratingPlatform: {
    flex: 1,
    color: colors.text.primary,
  },
  ratingValue: {
    color: colors.accent,
    fontWeight: 'bold',
    fontSize: typography.size.lg,
  },
  platformDetailCard: {
    backgroundColor: colors.surface,
    marginBottom: 15,
  },
  platformHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  platformName: {
    fontSize: typography.size.lg,
    fontWeight: 'bold',
  },
  platformUsername: {
    color: colors.text.secondary,
  },
  platformStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  platformStat: {
    alignItems: 'center',
  },
  platformStatValue: {
    fontSize: typography.size.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  platformStatLabel: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
  },
  rankBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'center',
  },
  rankText: {
    color: colors.text.primary,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: typography.size.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
