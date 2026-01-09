import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, FAB, Surface, Text, useTheme } from 'react-native-paper';
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
            <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: colors.onSurface }}>
                Hello, Coder! 👋
            </Text>
            <Text variant="bodyLarge" style={{ color: colors.secondary }}>
                {upcomingContests.length} contests coming up.
            </Text>
        </View>

        {/* Profiles Section */}
        <View style={styles.sectionContainer}>
             <View style={styles.sectionHeader}>
                <Text variant="titleLarge" style={{ fontWeight: 'bold', color: colors.onSurface }}>Profiles</Text>
            </View>
            <View style={styles.profilesWrapper}>
             {profiles.length === 0 ? (
                <Surface style={[styles.emptyState, { backgroundColor: colors.surfaceVariant }]} elevation={0}>
                <MaterialCommunityIcons name="card-account-details-outline" size={40} color={colors.onSurfaceVariant} />
                <Text variant="bodyLarge" style={{ marginVertical: 8, fontWeight: '600' }}>No Profiles Connected</Text>
                <Button mode="text" onPress={handleGoToSettings}>Connect Now</Button>
                </Surface>
             ) : (
                <ProfileCarousel profiles={profiles} />
             )}
            </View>
        </View>

        {/* Hero: Next Contest (Smaller/Compact) */}
        {nextContest && (
            <View style={styles.heroSection}>
                <Surface style={[styles.heroCard, { backgroundColor: colors.primaryContainer }]} elevation={2}>
                    <View style={styles.heroHeader}>
                        <Text variant="labelMedium" style={{ color: colors.onPrimaryContainer, opacity: 0.7, fontWeight: 'bold' }}>UP NEXT</Text>
                        <MaterialCommunityIcons name="clock-outline" size={18} color={colors.onPrimaryContainer} />
                    </View>
                    
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 }}>
                         <View style={{ flex: 1, marginRight: 8 }}>
                            <Text variant="titleLarge" style={{ color: colors.onPrimaryContainer, fontWeight: 'bold' }} numberOfLines={2}>
                                {nextContest.name}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                <MaterialCommunityIcons name="code-tags" size={16} color={colors.onPrimaryContainer} />
                                <Text variant="bodyMedium" style={{ color: colors.onPrimaryContainer }}>{nextContest.platformId}</Text>
                            </View>
                         </View>
                         
                         <Button 
                            mode="contained" 
                            buttonColor={colors.primary} 
                            textColor={colors.onPrimary}
                            compact
                            onPress={() => { /* Navigate */}}
                        >
                            View
                        </Button>
                    </View>
                </Surface>
            </View>
        )}

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
      {!isContestLoading && (
        <FAB
          icon="refresh"
          style={[styles.fab, { backgroundColor: colors.tertiaryContainer }]}
          color={colors.onTertiaryContainer}
          onPress={handleSync}
        />
      )}
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginHorizontal: 20,
    borderRadius: 16,
  },
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 0,
  },
});
