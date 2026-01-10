import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { ContestList } from '../../src/components/contests/ContestList';
import { ProfileCarousel } from '../../src/components/profile/ProfileCarousel';
import { useContestStore } from '../../src/stores/useContestStore';
import { useProfileStore } from '../../src/stores/useProfileStore';

export default function DashboardScreen() {
  const router = useRouter();
  /* Use Paper's hook which returns our MD3 theme structure */
  const { colors } = useTheme();

  const { profiles, loadProfiles, refreshProfiles, isLoading: isProfileLoading } = useProfileStore();
  const { upcomingContests, loadContests, syncContests, isLoading: isContestLoading } = useContestStore();

  useEffect(() => {
    loadProfiles();
    loadContests();
  }, []);

  const handleGoToSettings = () => {
    router.push('/settings');
  };

  const handleSync = async () => {
    // specific order: sync profiles first, then contests
    refreshProfiles(); 
    syncContests();
  };

  const isLoading = isProfileLoading || isContestLoading;

  // Helper logic to find the very next contest
  const nextContest = upcomingContests.length > 0 ? upcomingContests[0] : null;

  // Filter other contests: upcoming (excluding first) within next 7 days
  const sevenDaysFromNow = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const otherContests = upcomingContests.length > 0 
    ? upcomingContests.slice(1).filter(c => {
        const t = c.startTime instanceof Date ? c.startTime.getTime() : new Date(c.startTime).getTime();
        return t <= sevenDaysFromNow;
    }) 
    : [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header elevated mode="center-aligned" style={{ backgroundColor: colors.surface }}>
        <Appbar.Content title="Dashboard" titleStyle={{ fontWeight: 'bold' }} />
        <Appbar.Action icon="cog-outline" onPress={() => router.push('/settings')} />
      </Appbar.Header>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
                refreshing={isLoading} 
                onRefresh={handleSync} 
                colors={[colors.primary]}
                tintColor={colors.primary} 
          />
        }
      >
        {/* Welcome / Header Section */}
        <View style={styles.headerSection}>
            <Text variant="displaySmall" style={{ fontWeight: '800', color: colors.onSurface, letterSpacing: -1 }}>
                Hello, Coder! 👋
            </Text>
            <Text variant="titleMedium" style={{ color: colors.secondary, marginTop: 4, fontWeight: '500' }}>
                You have {upcomingContests.length} battles ahead.
            </Text>
        </View>

        {/* Profiles Section */}
        {profiles.length > 0 && (
          <View style={styles.sectionContainer}>
               <View style={styles.sectionHeader}>
                  <Text variant="titleLarge" style={{ fontWeight: 'bold', color: colors.onSurface }}>Profiles</Text>
              </View>
              <View style={styles.profilesWrapper}>
                  <ProfileCarousel profiles={profiles} />
              </View>
          </View>
        )}

        {/* Hero: Next Contest (Smaller/Compact) */}


        {/* Other Contests List */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={{ fontWeight: 'bold', color: colors.onSurface }}>Upcoming</Text>
          </View>
          
          <ContestList 
             contests={otherContests} 
             emptyMessage="No contests in the next 7 days."
             limit={10}
          />
        </View>
      </ScrollView>

      {/* Floating Action Button for Sync */}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  headerSection: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 16
  },
  heroSection: {
      paddingHorizontal: 20,
      marginBottom: 24
  },
  heroCard: {
      borderRadius: 20, // Slightly tighter radius
      padding: 16, // Reduced padding from 20
  },
  heroHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
  },
  // Removed heroFooter as it's inline now
  sectionContainer: {
      marginBottom: 24
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  profilesWrapper: {
      // ProfileCarousel has its own padding
  },
  emptyState: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 16,
    gap: 16
  },
  emptyIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

});

