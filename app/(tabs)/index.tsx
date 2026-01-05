import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, FAB, IconButton, Text } from 'react-native-paper';
import { PlatformBadge } from '../../src/components/ui/PlatformBadge';
import { SleekCard } from '../../src/components/ui/SleekCard';
import { useContestStore } from '../../src/stores/useContestStore';
import { useProfileStore } from '../../src/stores/useProfileStore';
import { colors } from '../../src/theme/colors';
import { formatContestTime, formatDuration } from '../../src/utils/dateUtils';

export default function DashboardScreen() {
  const router = useRouter();
  const { profiles, loadProfiles, isLoading: isProfileLoading } = useProfileStore();
  const { upcomingContests, loadContests, syncContests, isLoading: isContestLoading } = useContestStore();

  useEffect(() => {
    loadProfiles();
    loadContests();
  }, []);

  const handleGoToSettings = () => {
    router.push('/settings');
  };

  const handleSync = () => {
    syncContests();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Krono</Text>
          <Text style={styles.headerSubtitle}>Master your coding timeline</Text>
        </View>
        <IconButton
          icon="cog"
          iconColor={colors.text.secondary}
          size={24}
          onPress={handleGoToSettings}
        />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isContestLoading} onRefresh={handleSync} tintColor={colors.primary} />
        }
      >
        {/* Profile Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Status</Text>
          {profiles.length === 0 ? (
            <SleekCard variant="bordered" style={styles.emptyState}>
              <MaterialCommunityIcons name="account-plus" size={40} color={colors.text.muted} />
              <Text style={styles.emptyText}>Link profiles to track progress</Text>
              <FAB
                icon="plus"
                label="Connect"
                style={styles.fab}
                color={colors.background}
                onPress={handleGoToSettings}
                small
              />
            </SleekCard>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.profileList}>
              {profiles.map(profile => (
                <SleekCard key={profile.id} style={styles.profileCard}>
                  <View style={styles.profileHeader}>
                    <PlatformBadge platformId={profile.platformId} size="sm" />
                    {profile.rank && <Text style={styles.profileRank}>{profile.rank}</Text>}
                  </View>
                  <View style={styles.profileBody}>
                    <Text style={styles.profileRating}>{profile.rating}</Text>
                    <Text style={styles.profileLabel}>RATING</Text>
                  </View>
                  <Text style={styles.profileName} numberOfLines={1}>{profile.displayName}</Text>
                </SleekCard>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Upcoming Contests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming</Text>
            {isContestLoading && <ActivityIndicator size="small" color={colors.primary} />}
          </View>
          
          {upcomingContests.length === 0 ? (
            <Text style={styles.emptyText}>No contests found. Pull to refresh.</Text>
          ) : (
            upcomingContests.slice(0, 7).map(contest => (
              <SleekCard key={contest.id} style={styles.contestCard}>
                <View style={styles.contestRow}>
                  <View style={styles.contestDateBox}>
                    <Text style={styles.dateDay}>{contest.startTime.getDate()}</Text>
                    <Text style={styles.dateMonth}>{contest.startTime.toLocaleString('default', { month: 'short' }).toUpperCase()}</Text>
                  </View>
                  
                  <View style={styles.contestInfo}>
                    <Text style={styles.contestName} numberOfLines={1}>{contest.name}</Text>
                    <View style={styles.contestMeta}>
                      <PlatformBadge platformId={contest.platformId} size="sm" />
                      <Text style={styles.contestTime}> • {formatContestTime(contest.startTime)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.durationBadge}>
                    <MaterialCommunityIcons name="clock-outline" size={12} color={colors.text.secondary} />
                    <Text style={styles.durationText}>{formatDuration(contest.durationSeconds)}</Text>
                  </View>
                </View>
              </SleekCard>
            ))
          )}
        </View>
      </ScrollView>

      {/* Quick Sync Button */}
      {!isContestLoading && (
        <FAB
          icon="refresh"
          style={styles.syncFab}
          onPress={handleSync}
          color={colors.text.primary}
        />
      )}
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
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: -4,
  },
  content: {
    paddingBottom: 80,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  profileList: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  profileCard: {
    width: 140,
    marginRight: 12,
    height: 140,
    justifyContent: 'space-between',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileRank: {
    fontSize: 10,
    color: colors.secondary,
    backgroundColor: `${colors.secondary}15`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  profileBody: {
    alignItems: 'center',
    marginVertical: 10,
  },
  profileRating: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  profileLabel: {
    fontSize: 10,
    color: colors.text.muted,
    letterSpacing: 1,
    marginTop: 4,
  },
  profileName: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    borderStyle: 'dashed',
    borderColor: colors.text.disabled,
  },
  emptyText: {
    color: colors.text.secondary,
    marginTop: 8,
    marginBottom: 16,
  },
  fab: {
    backgroundColor: colors.primary,
  },
  syncFab: {
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surfaceHighlight,
  },
  // Contest Styles
  contestCard: {
    marginBottom: 12,
    padding: 12,
  },
  contestRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contestDateBox: {
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 12,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dateDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text.muted,
  },
  contestInfo: {
    flex: 1,
  },
  contestName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 6,
  },
  contestMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contestTime: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  durationText: {
    fontSize: 10,
    color: colors.text.secondary,
    marginLeft: 4,
  }
});
