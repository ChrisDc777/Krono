import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FAB, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ContestList } from '../../src/components/contests/ContestList';
import { ProfileCarousel } from '../../src/components/profile/ProfileCarousel';
import { useTheme } from '../../src/hooks/useTheme';
import { useContestStore } from '../../src/stores/useContestStore';
import { useProfileStore } from '../../src/stores/useProfileStore';

export default function DashboardScreen() {
  const router = useRouter();
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.date, { color: colors.text.muted }]}>{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}</Text>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Dashboard</Text>
        </View>
        <IconButton
          icon="cog-outline"
          iconColor={colors.text.primary}
          size={26}
          onPress={handleGoToSettings}
        />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
                refreshing={isLoading} 
                onRefresh={handleSync} 
                tintColor={colors.primary} 
          />
        }
      >
        {/* Profile Statistics Carousel */}
        <View style={styles.profilesSection}>
          {profiles.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <MaterialCommunityIcons name="card-account-details-outline" size={48} color={colors.text.muted} />
              <Text style={[styles.emptyText, { color: colors.text.primary }]}>Track your progress</Text>
              <Text style={[styles.emptySubText, { color: colors.text.secondary }]}>Add your coding profiles to get started</Text>
              <FAB
                icon="plus"
                label="Connect Profile"
                style={[styles.connectButton, { backgroundColor: colors.primary }]}
                color={colors.text.inverse}
                onPress={handleGoToSettings}
                small
              />
            </View>
          ) : (
            <View>
              <ProfileCarousel profiles={profiles} />
              <View style={styles.addCardContainer}>
                    {/* Placeholder for "Add" button if we want it next to carousel, or just leave FAB below */}
              </View>
            </View>
          )}
        </View>

        {/* Timeline Section */}
        <View style={styles.timelineSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Timeline</Text>
          
          <ContestList 
             contests={upcomingContests} 
             emptyMessage="No upcoming contests found. Pull to refresh!"
             limit={5}
          />
        </View>
      </ScrollView>

      {/* Floating Action Button for Sync */}
      {!isContestLoading && (
        <FAB
          icon="refresh"
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={handleSync}
          color={colors.text.inverse}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  date: {
      fontSize: 12,
      fontWeight: 'bold',
      letterSpacing: 2,
      marginBottom: 0,
      textTransform: 'uppercase'
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1
  },
  content: {
    paddingBottom: 80,
  },
  profilesSection: {
    marginBottom: 32,
  },
  addCardContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginHorizontal: 24,
    borderWidth: 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 16,
    textTransform: 'uppercase'
  },
  emptySubText: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
    fontSize: 12
  },
  connectButton: {
      borderRadius: 0 
  },
  timelineSection: {
      paddingHorizontal: 24,
  },
  sectionTitle: {
      fontSize: 20,
      fontWeight: '900',
      marginBottom: 20,
      letterSpacing: 1
  },
  fab: {
    position: 'absolute',
    margin: 24,
    right: 0,
    bottom: 0,
    borderRadius: 8,
  },
});
