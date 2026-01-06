import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { ContestList } from '../../src/components/contests/ContestList';
import { ProfileCarousel } from '../../src/components/profile/ProfileCarousel';
import { useTheme } from '../../src/hooks/useTheme';
import { useContestStore } from '../../src/stores/useContestStore';
import { useProfileStore } from '../../src/stores/useProfileStore';
import { typography } from '../../src/theme/typography';

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { profiles, loadProfiles, refreshProfiles, isLoading: isProfileLoading } = useProfileStore();
  const { upcomingContests, loadContests, syncContests, isLoading: isContestLoading } = useContestStore();

  useEffect(() => {
    loadProfiles();
    loadContests();
  }, []);

  const handleSync = async () => {
    // specific order: sync profiles first, then contests
    refreshProfiles(); 
    syncContests();
  };

  const isLoading = isProfileLoading || isContestLoading;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  date: {
      fontSize: 12,
      color: colors.text.muted,
      fontWeight: 'bold',
      letterSpacing: 2,
      marginBottom: 0,
      textTransform: 'uppercase'
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text.primary,
    letterSpacing: -1
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
      width: 100,
      height: 260, // Match ProfileCard height
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed'
  },
  addText: {
      color: colors.text.muted,
      fontSize: 12,
      marginTop: 8,
      fontWeight: 'bold',
      textTransform: 'uppercase'
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginHorizontal: 24,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  emptyText: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 16,
    textTransform: 'uppercase'
  },
  emptySubText: {
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
    fontSize: 12
  },
  connectButton: {
      backgroundColor: colors.primary,
      borderRadius: 0 
  },
  timelineSection: {
      paddingHorizontal: 24,
  },
  sectionTitle: {
      fontSize: 20,
      fontWeight: '900',
      color: colors.text.primary,
      marginBottom: 20,
      letterSpacing: 1
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
    borderRadius: 8,
  },
});
