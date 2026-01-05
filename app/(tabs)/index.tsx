import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, FAB, IconButton, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileCard } from '../../src/components/ui/ProfileCard';
import { TimelineItem } from '../../src/components/ui/TimelineItem';
import { useContestStore } from '../../src/stores/useContestStore';
import { useProfileStore } from '../../src/stores/useProfileStore';
import { colors } from '../../src/theme/colors';

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
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}</Text>
          <Text style={styles.headerTitle}>Dashboard</Text>
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
          <RefreshControl refreshing={isContestLoading} onRefresh={handleSync} tintColor={colors.primary} />
        }
      >
        {/* Profile Statistics Carousel */}
        <View style={styles.profilesSection}>
          {profiles.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="card-account-details-outline" size={48} color={colors.text.muted} />
              <Text style={styles.emptyText}>Track your progress</Text>
              <Text style={styles.emptySubText}>Add your coding profiles to get started</Text>
              <FAB
                icon="plus"
                label="Connect Profile"
                style={styles.connectButton}
                color={colors.text.inverse}
                onPress={handleGoToSettings}
                small
              />
            </View>
          ) : (
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.profileList}
                decelerationRate="fast"
                snapToInterval={styles.profileList.paddingHorizontal}
            >
              {profiles.map(profile => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
              <View style={styles.addCardPlaceholder}>
                   <IconButton icon="plus" onPress={handleGoToSettings} iconColor={colors.text.muted} size={30} />
                   <Text style={styles.addText}>Add</Text>
              </View>
            </ScrollView>
          )}
        </View>

        {/* Timeline Section */}
        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          
          {isContestLoading && upcomingContests.length === 0 ? (
             <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} />
          ) : upcomingContests.length === 0 ? (
            <View style={styles.emptyTimeline}>
                 <Text style={styles.emptyText}>No upcoming contests.</Text>
            </View>
          ) : (
            <View style={styles.timelineContainer}>
              {upcomingContests.slice(0, 10).map((contest, index) => (
                <TimelineItem 
                    key={contest.id} 
                    contest={contest} 
                    isLast={index === 9 || index === upcomingContests.length - 1} 
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button for Sync */}
      {!isContestLoading && (
        <FAB
          icon="refresh"
          style={styles.fab}
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
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginBottom: 0,
  },
  date: {
      fontSize: 12,
      color: colors.text.muted,
      fontWeight: 'bold',
      letterSpacing: 1,
      marginBottom: 2
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
  },
  content: {
    paddingBottom: 80,
  },
  profilesSection: {
    marginBottom: 32,
  },
  profileList: {
    paddingHorizontal: 24,
    paddingVertical: 10
  },
  addCardPlaceholder: {
      width: 80,
      height: 170,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 24
  },
  addText: {
      color: colors.text.muted,
      fontSize: 12,
      marginTop: -10
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginHorizontal: 24,
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubText: {
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20
  },
  connectButton: {
      backgroundColor: colors.primary,
  },
  timelineSection: {
      paddingHorizontal: 24,
  },
  sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text.primary,
      marginBottom: 20,
  },
  timelineContainer: {
     // Container for timeline items
  },
  emptyTimeline: {
      paddingVertical: 20
  },
  fab: {
    position: 'absolute',
    margin: 24,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: 16,
  },
});
