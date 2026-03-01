import { MaterialCommunityIcons } from "@expo/vector-icons"; // Added Icon
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
    Linking,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from "react-native"; // Added Linking
import { Appbar, Surface, Text, useTheme } from "react-native-paper"; // Added Surface, ActivityIndicator
import { ActivityHeatmap } from "../../src/components/charts/ActivityHeatmap";
import { RatingChart } from "../../src/components/charts/RatingChart";
import { ErrorBoundary } from "../../src/components/common/ErrorBoundary";
import {
    DashboardSkeleton,
    Skeleton,
} from "../../src/components/common/SkeletonLoader";
import { ContestList } from "../../src/components/contests/ContestList";
import { ProfileCarousel } from "../../src/components/profile/ProfileCarousel";
import { useContestStore } from "../../src/stores/useContestStore";
import { usePotdStore } from "../../src/stores/usePotdStore"; // Added store
import { useProfileStore } from "../../src/stores/useProfileStore";

// Difficulty → color mapping for POTD badges
const getDifficultyColor = (difficulty?: string): string => {
  const d = (difficulty || "").toLowerCase();
  if (d.includes("easy") || d.includes("basic") || d.includes("school"))
    return "#22C55E";
  if (d.includes("medium") || d.includes("intermediate")) return "#F59E0B";
  if (d.includes("hard") || d.includes("advanced")) return "#EF4444";
  return "#71717A"; // default gray
};

export default function DashboardScreen() {
  const router = useRouter();
  /* Use Paper's hook which returns our MD3 theme structure */
  const { colors, dark } = useTheme();

  const {
    profiles,
    loadProfiles,
    refreshProfiles,
    isLoading: isProfileLoading,
  } = useProfileStore();
  const {
    upcomingContests,
    loadContests,
    syncContests,
    isLoading: isContestLoading,
  } = useContestStore();
  const {
    leetcode,
    gfg,
    refreshPotd,
    isLoading: isPotdLoading,
  } = usePotdStore(); // Destructure POTD

  useEffect(() => {
    loadProfiles();
    loadContests();
    refreshPotd(); // Initial fetch
  }, []);

  const handleGoToSettings = () => {
    router.push("/settings");
  };

  const handleSync = async () => {
    // specific order: sync profiles first, then contests
    refreshProfiles();
    refreshPotd(); // Sync POTD
    syncContests();
  };

  const isLoading = isProfileLoading || isContestLoading || isPotdLoading;

  // Filter contests: upcoming within next 7 days
  const sevenDaysFromNow = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const otherContests =
    upcomingContests.length > 0
      ? upcomingContests.filter((c) => {
          const t =
            c.startTime instanceof Date
              ? c.startTime.getTime()
              : new Date(c.startTime).getTime();
          return t <= sevenDaysFromNow;
        })
      : [];

  if (isLoading && profiles.length === 0 && upcomingContests.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Appbar.Header
          elevated
          mode="center-aligned"
          style={{ backgroundColor: colors.surface }}
        >
          <Appbar.Content
            title="Dashboard"
            titleStyle={{ fontWeight: "bold" }}
          />
          <Appbar.Action
            icon="cog-outline"
            onPress={() => router.push("/settings")}
          />
        </Appbar.Header>
        <DashboardSkeleton />
      </View>
    );
  }

  return (
    <ErrorBoundary fallbackTitle="Dashboard Error">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Appbar.Header
          elevated
          mode="center-aligned"
          style={{ backgroundColor: colors.surface }}
        >
          <Appbar.Content
            title="Dashboard"
            titleStyle={{ fontWeight: "bold" }}
          />
          <Appbar.Action
            icon="cog-outline"
            onPress={() => router.push("/settings")}
          />
        </Appbar.Header>

        <ScrollView
          contentContainerStyle={[styles.content, { paddingTop: 20 }]}
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
          {/* Profiles Section */}
          {profiles.length > 0 ? (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons
                  name="account-group"
                  size={20}
                  color={colors.onSurface}
                  style={{ marginRight: 8 }}
                />
                <Text
                  variant="titleLarge"
                  style={{ fontWeight: "bold", color: colors.onSurface }}
                >
                  Profiles
                </Text>
              </View>
              <View style={styles.profilesWrapper}>
                <ProfileCarousel profiles={profiles} />
              </View>
            </View>
          ) : (
            <View style={styles.sectionContainer}>
              <Surface
                style={[styles.emptyState, { backgroundColor: colors.surface }]}
                elevation={1}
                onTouchEnd={() => router.push("/settings")}
              >
                <View
                  style={[
                    styles.emptyIconBox,
                    { backgroundColor: colors.primary + "15" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="account-plus"
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                    Connect Profiles
                  </Text>
                  <Text variant="bodySmall" style={{ color: colors.secondary }}>
                    Sync stats from LeetCode, CodeForces...
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={colors.outline}
                />
              </Surface>
            </View>
          )}

          {/* Rating History */}
          {profiles.length > 0 && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons
                  name="chart-line"
                  size={20}
                  color={colors.onSurface}
                  style={{ marginRight: 8 }}
                />
                <Text
                  variant="titleLarge"
                  style={{ fontWeight: "bold", color: colors.onSurface }}
                >
                  Rating History
                </Text>
              </View>
              <RatingChart profiles={profiles} />
            </View>
          )}

          {/* Activity Heatmap */}
          {profiles.length > 0 && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons
                  name="fire"
                  size={20}
                  color={colors.onSurface}
                  style={{ marginRight: 8 }}
                />
                <Text
                  variant="titleLarge"
                  style={{ fontWeight: "bold", color: colors.onSurface }}
                >
                  Activity
                </Text>
              </View>
              <ActivityHeatmap profiles={profiles} />
            </View>
          )}

          {/* Problem of the Day Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={20}
                color={colors.onSurface}
                style={{ marginRight: 8 }}
              />
              <Text
                variant="titleLarge"
                style={{ fontWeight: "bold", color: colors.onSurface }}
              >
                Daily Challenge
              </Text>
            </View>
            <View style={styles.potdRow}>
              {/* LeetCode Card */}
              <Surface
                style={[
                  styles.potdCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: dark
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(0,0,0,0.05)",
                    borderWidth: 1,
                  },
                ]}
                elevation={2}
                onTouchEnd={() =>
                  leetcode?.url && Linking.openURL(leetcode.url)
                }
              >
                <View
                  style={[styles.potdHeader, { backgroundColor: "#FFA116" }]}
                >
                  <MaterialCommunityIcons
                    name="code-tags"
                    size={16}
                    color="white"
                  />
                  <Text
                    variant="labelSmall"
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      marginLeft: 4,
                    }}
                  >
                    LEETCODE
                  </Text>
                </View>
                <View style={styles.potdContent}>
                  {isPotdLoading && !leetcode ? (
                    <View style={{ gap: 8 }}>
                      <Skeleton width="80%" height={16} />
                      <Skeleton width="40%" height={12} />
                    </View>
                  ) : (
                    <>
                      <Text
                        variant="titleSmall"
                        numberOfLines={2}
                        style={{ fontWeight: "bold" }}
                      >
                        {leetcode?.title || "Loading..."}
                      </Text>
                      <View
                        style={[
                          styles.difficultyBadge,
                          {
                            backgroundColor:
                              getDifficultyColor(leetcode?.difficulty) + "20",
                          },
                        ]}
                      >
                        <Text
                          variant="labelSmall"
                          style={{
                            color: getDifficultyColor(leetcode?.difficulty),
                            fontWeight: "700",
                            fontSize: 10,
                          }}
                        >
                          {leetcode?.difficulty || "Easy"}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </Surface>

              {/* GFG Card */}
              <Surface
                style={[
                  styles.potdCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: dark
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(0,0,0,0.05)",
                    borderWidth: 1,
                  },
                ]}
                elevation={2}
                onTouchEnd={() => gfg?.url && Linking.openURL(gfg.url)}
              >
                <View
                  style={[styles.potdHeader, { backgroundColor: "#2F8D46" }]}
                >
                  <MaterialCommunityIcons name="xml" size={16} color="white" />
                  <Text
                    variant="labelSmall"
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      marginLeft: 4,
                    }}
                  >
                    GFG
                  </Text>
                </View>
                <View style={styles.potdContent}>
                  {isPotdLoading && !gfg ? (
                    <View style={{ gap: 8 }}>
                      <Skeleton width="80%" height={16} />
                      <Skeleton width="40%" height={12} />
                    </View>
                  ) : (
                    <>
                      <Text
                        variant="titleSmall"
                        numberOfLines={2}
                        style={{ fontWeight: "bold" }}
                      >
                        {gfg?.title || "Loading..."}
                      </Text>
                      <View
                        style={[
                          styles.difficultyBadge,
                          {
                            backgroundColor:
                              getDifficultyColor(gfg?.difficulty) + "20",
                          },
                        ]}
                      >
                        <Text
                          variant="labelSmall"
                          style={{
                            color: getDifficultyColor(gfg?.difficulty),
                            fontWeight: "700",
                            fontSize: 10,
                          }}
                        >
                          {gfg?.difficulty || "Unknown"}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </Surface>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="calendar-clock"
                size={20}
                color={colors.onSurface}
                style={{ marginRight: 8 }}
              />
              <Text
                variant="titleLarge"
                style={{ fontWeight: "bold", color: colors.onSurface, flex: 1 }}
              >
                Upcoming
              </Text>
              {otherContests.length > 0 && (
                <Text
                  variant="labelMedium"
                  style={{ color: colors.primary, fontWeight: "600" }}
                  onPress={() => router.push("/contests")}
                >
                  View All →
                </Text>
              )}
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
    </ErrorBoundary>
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
    paddingBottom: 16,
  },
  heroSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  heroCard: {
    borderRadius: 20, // Slightly tighter radius
    padding: 16, // Reduced padding from 20
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // Removed heroFooter as it's inline now
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  profilesWrapper: {
    // ProfileCarousel has its own padding
  },
  emptyState: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 16,
    gap: 16,
  },
  emptyIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  potdRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
  },
  potdCard: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    height: 110,
  },
  potdHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  potdContent: {
    padding: 12,
    justifyContent: "center",
    flex: 1,
  },
  difficultyBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
});
