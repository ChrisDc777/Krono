import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
    Linking,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { Appbar, Surface, Text, useTheme } from "react-native-paper";
import { ErrorBoundary } from "../../src/components/common/ErrorBoundary";
import {
    DashboardSkeleton,
    Skeleton,
} from "../../src/components/common/SkeletonLoader";
import { ContestList } from "../../src/components/contests/ContestList";
import { ProfileCarousel } from "../../src/components/profile/ProfileCarousel";
import { useContestStore } from "../../src/stores/useContestStore";
import { usePotdStore } from "../../src/stores/usePotdStore";
import { useProfileStore } from "../../src/stores/useProfileStore";

// Difficulty → color mapping
const getDifficultyColor = (difficulty?: string): string => {
  const d = (difficulty || "").toLowerCase();
  if (d.includes("easy") || d.includes("basic") || d.includes("school"))
    return "#22C55E";
  if (d.includes("medium") || d.includes("intermediate")) return "#F59E0B";
  if (d.includes("hard") || d.includes("advanced")) return "#EF4444";
  return "#71717A";
};

// Time-based greeting
const getGreeting = (): string => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

export default function DashboardScreen() {
  const router = useRouter();
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
  const { leetcode, refreshPotd, isLoading: isPotdLoading } = usePotdStore();

  useEffect(() => {
    loadProfiles();
    loadContests();
    refreshPotd();
  }, []);

  const handleSync = async () => {
    refreshProfiles();
    refreshPotd();
    syncContests();
  };

  const isLoading = isProfileLoading || isContestLoading || isPotdLoading;

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
          style={{
            backgroundColor: colors.background,
            elevation: 0,
          }}
        >
          <Appbar.Content title="" />
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
        {/* Transparent header — only settings icon */}
        <Appbar.Header
          style={{
            backgroundColor: colors.background,
            elevation: 0,
          }}
        >
          <Appbar.Content title="" />
          <Appbar.Action
            icon="cog-outline"
            onPress={() => router.push("/settings")}
          />
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
          {/* Greeting */}
          <View style={styles.greeting}>
            <Text
              variant="headlineMedium"
              style={{
                fontWeight: "800",
                color: colors.onSurface,
                letterSpacing: -0.5,
              }}
            >
              {getGreeting()} 👋
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: colors.onSurfaceVariant,
                marginTop: 4,
              }}
            >
              Here's your coding snapshot
            </Text>
          </View>

          {/* Profiles — tap a card to see detailed stats */}
          {profiles.length > 0 ? (
            <View style={styles.section}>
              <Text
                variant="labelMedium"
                style={[styles.label, { color: colors.onSurfaceVariant }]}
              >
                YOUR PROFILES
              </Text>
              <ProfileCarousel profiles={profiles} />
            </View>
          ) : (
            <View style={styles.section}>
              <Surface
                style={[
                  styles.connectCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: dark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.06)",
                  },
                ]}
                elevation={0}
                onTouchEnd={() => router.push("/settings")}
              >
                <View
                  style={[
                    styles.connectIcon,
                    {
                      backgroundColor: colors.primary + "12",
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="account-plus-outline"
                    size={22}
                    color={colors.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="titleSmall" style={{ fontWeight: "700" }}>
                    Connect a Profile
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{
                      color: colors.onSurfaceVariant,
                      marginTop: 2,
                    }}
                  >
                    LeetCode, Codeforces, CodeChef...
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color={colors.outline}
                />
              </Surface>
            </View>
          )}

          {/* Daily Challenge */}
          <View style={styles.section}>
            <Text
              variant="labelMedium"
              style={[styles.label, { color: colors.onSurfaceVariant }]}
            >
              DAILY CHALLENGE
            </Text>
            <View style={{ paddingHorizontal: 24 }}>
              {/* LeetCode */}
              <Surface
                style={[
                  styles.potdCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: dark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.05)",
                  },
                ]}
                elevation={0}
                onTouchEnd={() =>
                  leetcode?.url && Linking.openURL(leetcode.url)
                }
              >
                <View
                  style={[styles.potdBrand, { backgroundColor: "#FFA11615" }]}
                >
                  <MaterialCommunityIcons
                    name="code-tags"
                    size={14}
                    color="#FFA116"
                  />
                  <Text
                    style={{
                      color: "#FFA116",
                      fontWeight: "800",
                      marginLeft: 4,
                      fontSize: 10,
                    }}
                  >
                    LEETCODE
                  </Text>
                </View>
                <View style={styles.potdBody}>
                  {isPotdLoading && !leetcode ? (
                    <View style={{ gap: 8 }}>
                      <Skeleton width="85%" height={14} />
                      <Skeleton width="40%" height={12} />
                    </View>
                  ) : (
                    <>
                      <Text
                        variant="bodyMedium"
                        numberOfLines={2}
                        style={{
                          fontWeight: "600",
                          lineHeight: 20,
                        }}
                      >
                        {leetcode?.title || "No problem today"}
                      </Text>
                      <View
                        style={[
                          styles.diffBadge,
                          {
                            backgroundColor:
                              getDifficultyColor(leetcode?.difficulty) + "18",
                          },
                        ]}
                      >
                        <Text
                          style={{
                            color: getDifficultyColor(leetcode?.difficulty),
                            fontWeight: "700",
                            fontSize: 10,
                          }}
                        >
                          {leetcode?.difficulty || "—"}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </Surface>
            </View>
          </View>

          {/* Upcoming Contests */}
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Text
                variant="labelMedium"
                style={[
                  styles.label,
                  {
                    color: colors.onSurfaceVariant,
                    flex: 1,
                    marginBottom: 0,
                  },
                ]}
              >
                UPCOMING CONTESTS
              </Text>
              {otherContests.length > 3 && (
                <Text
                  variant="labelMedium"
                  style={{
                    color: colors.primary,
                    fontWeight: "600",
                  }}
                  onPress={() => router.push("/contests")}
                >
                  See all
                </Text>
              )}
            </View>
            <ContestList
              contests={otherContests}
              emptyMessage="No contests in the next 7 days."
              limit={3}
            />
          </View>
        </ScrollView>
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
  greeting: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 28,
  },
  section: {
    marginBottom: 32,
  },
  label: {
    paddingHorizontal: 24,
    marginBottom: 14,
    fontWeight: "700",
    letterSpacing: 0.8,
    fontSize: 11,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  connectCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
  connectIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  potdRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
  },
  potdCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  potdBrand: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  potdBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 4,
    gap: 8,
  },
  diffBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
});
