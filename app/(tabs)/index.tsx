import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, IconButton, Text } from 'react-native-paper';
import { useContestStore } from '../../src/stores/useContestStore';
import { useProfileStore } from '../../src/stores/useProfileStore';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { PLATFORMS } from '../../src/types/platform';
import { formatContestTime, formatDuration } from '../../src/utils/dateUtils';

export default function DashboardScreen() {
  const { profiles, loadProfiles, addProfile, isLoading: isProfileLoading } = useProfileStore();
  const { upcomingContests, loadContests, syncContests, isLoading: isContestLoading } = useContestStore();

  useEffect(() => {
    loadProfiles();
    loadContests();
  }, []);

  const handleAddDemoProfile = () => {
    // Demo action
    addProfile('codeforces', 'tourist');
  };

  const handleSync = () => {
    syncContests();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Krono</Text>
        <IconButton
          icon="refresh"
          iconColor={colors.primary}
          size={24}
          onPress={handleSync}
          disabled={isContestLoading}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profiles</Text>
          {profiles.length === 0 ? (
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.emptyText}>No profiles connected yet.</Text>
                <Button 
                  mode="contained" 
                  onPress={handleAddDemoProfile}
                  style={styles.button}
                  loading={isProfileLoading}
                >
                  Add Codeforces Profile
                </Button>
              </Card.Content>
            </Card>
          ) : (
            profiles.map(profile => (
              <Card key={profile.id} style={styles.card}>
                <Card.Content style={styles.profileRow}>
                  <View>
                    <Text style={styles.platformName}>{PLATFORMS[profile.platformId].name}</Text>
                    <Text style={styles.username}>{profile.displayName}</Text>
                  </View>
                  <View style={styles.stats}>
                    <Text style={styles.rating}>{profile.rating}</Text>
                    <Text style={styles.rank}>{profile.rank}</Text>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </View>

        {/* Upcoming Contests Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Contests</Text>
          {isContestLoading && upcomingContests.length === 0 ? (
            <ActivityIndicator animating={true} color={colors.primary} />
          ) : upcomingContests.length === 0 ? (
            <Text style={styles.emptyText}>No upcoming contests found.</Text>
          ) : (
            upcomingContests.slice(0, 5).map(contest => (
              <Card key={contest.id} style={styles.contestCard}>
                <Card.Content>
                  <View style={styles.contestHeader}>
                    <Text style={[styles.platformTag, { color: PLATFORMS[contest.platformId].color }]}>
                      {PLATFORMS[contest.platformId].name}
                    </Text>
                    <Text style={styles.time}>{formatContestTime(contest.startTime)}</Text>
                  </View>
                  <Text style={styles.contestName} numberOfLines={1}>{contest.name}</Text>
                  <Text style={styles.duration}>Duration: {formatDuration(contest.durationSeconds)}</Text>
                </Card.Content>
              </Card>
            ))
          )}
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: typography.size.xxl,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 15,
  },
  card: {
    backgroundColor: colors.surface,
    marginBottom: 10,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  platformName: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  username: {
    fontSize: typography.size.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  stats: {
    alignItems: 'flex-end',
  },
  rating: {
    fontSize: typography.size.xl,
    fontWeight: 'bold',
    color: colors.accent,
  },
  rank: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
  },
  emptyText: {
    color: colors.text.secondary,
    textAlign: 'center',
    marginVertical: 10,
  },
  button: {
    marginTop: 10,
  },
  contestCard: {
    backgroundColor: colors.surface,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  contestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  platformTag: {
    fontSize: typography.size.xs,
    fontWeight: 'bold',
  },
  time: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  contestName: {
    fontSize: typography.size.md,
    fontWeight: 'medium',
    color: colors.text.primary,
    marginBottom: 5,
  },
  duration: {
    fontSize: typography.size.xs,
    color: colors.text.disabled,
  },
});
