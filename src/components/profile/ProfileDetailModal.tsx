import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { clistApi } from "../../api/clist";
import { leetcodeApi } from "../../api/leetcode";
import { PLATFORMS } from "../../types/platform";
import { UnifiedProfile } from "../../types/user";
import { ContestHistory } from "../charts/ContestHistory";
import { RatingChart } from "../charts/RatingChart";

interface ProfileDetailModalProps {
  profile: UnifiedProfile | null;
  visible: boolean;
  onDismiss: () => void;
}

export function ProfileDetailModal({
  profile,
  visible,
  onDismiss,
}: ProfileDetailModalProps) {
  const { colors, dark } = useTheme();
  const insets = useSafeAreaInsets();
  const [contestCount, setContestCount] = useState<number | null>(null);

  useEffect(() => {
    if (profile && visible) {
      setContestCount(null);

      if (profile.platformId === "leetcode") {
        // LeetCode: use its own GraphQL API (clist.by doesn't index LC)
        leetcodeApi
          .getUserContestRanking(profile.username)
          .then((data) => {
            if (data?.ranking?.attendedContestsCount != null) {
              setContestCount(data.ranking.attendedContestsCount);
            }
          })
          .catch(() => {});
      } else {
        // CF, AC, CC: use clist.by
        clistApi
          .getAccountInfo(profile.platformId, profile.username)
          .then((acc) => {
            if (acc) setContestCount(acc.n_contests);
          });
      }
    }
  }, [profile?.id, visible]);

  if (!profile) return null;

  const platformConfig = PLATFORMS[profile.platformId];
  let platformColor = platformConfig?.color || colors.primary;
  if (profile.platformId === "atcoder" && !dark) platformColor = "#000000";
  const onPlatformColor =
    profile.platformId === "atcoder" && dark ? "#000000" : "#FFFFFF";

  const stats = [
    {
      label: "Rating",
      value: profile.rating ?? "—",
      icon: "star-outline" as const,
    },
    {
      label: "Peak",
      value: profile.maxRating ?? "—",
      icon: "arrow-up-bold" as const,
    },
    {
      label: "Solved",
      value: profile.problemsSolved ?? 0,
      icon: "check-circle-outline" as const,
    },
    {
      label: "Contests",
      value: contestCount ?? "…",
      icon: "trophy-outline" as const,
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onDismiss}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top,
          },
        ]}
      >
        {/* Header — full platform color */}
        <View style={[styles.header, { backgroundColor: platformColor }]}>
          {/* Close button top-right */}
          <Pressable
            onPress={onDismiss}
            style={styles.closeButton}
            hitSlop={12}
          >
            <MaterialCommunityIcons
              name="close"
              size={18}
              color={onPlatformColor}
            />
          </Pressable>

          {/* Profile Row */}
          <View style={styles.profileRow}>
            {/* Left: Icon + Username + Rank */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                flex: 1,
              }}
            >
              <View
                style={[
                  styles.avatarCircle,
                  { backgroundColor: "rgba(255,255,255,0.2)" },
                ]}
              >
                <MaterialCommunityIcons
                  name={(platformConfig?.icon as any) || "code-tags"}
                  size={20}
                  color={onPlatformColor}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontWeight: "800",
                    color: onPlatformColor,
                    fontSize: 18,
                    letterSpacing: -0.3,
                  }}
                  numberOfLines={1}
                >
                  {profile.username}
                </Text>
                {profile.rank ? (
                  <Text
                    style={{
                      color: onPlatformColor,
                      opacity: 0.8,
                      fontWeight: "600",
                      fontSize: 12,
                      marginTop: 1,
                    }}
                  >
                    {profile.rank}
                  </Text>
                ) : null}
              </View>
            </View>

            {/* Right: Global Rank */}
            {profile.globalRank ? (
              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{
                    color: onPlatformColor,
                    fontWeight: "900",
                    fontSize: 20,
                  }}
                >
                  #{profile.globalRank.toLocaleString()}
                </Text>
                <Text
                  style={{
                    color: onPlatformColor,
                    opacity: 0.7,
                    fontSize: 10,
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Global Rank
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Scrollable content */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {stats.map((stat) => (
              <Surface
                key={stat.label}
                style={[
                  styles.statCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: dark
                      ? "rgba(255,255,255,0.12)"
                      : "rgba(0,0,0,0.08)",
                  },
                ]}
                elevation={0}
              >
                <MaterialCommunityIcons
                  name={stat.icon}
                  size={18}
                  color={colors.onSurfaceVariant}
                  style={{ marginBottom: 6 }}
                />
                <Text
                  variant="titleLarge"
                  style={{
                    fontWeight: "800",
                    color: colors.onSurface,
                  }}
                >
                  {stat.value}
                </Text>
                <Text
                  variant="labelSmall"
                  style={{
                    color: colors.onSurfaceVariant,
                    marginTop: 2,
                    textTransform: "uppercase",
                    fontSize: 9,
                    letterSpacing: 0.5,
                  }}
                >
                  {stat.label}
                </Text>
              </Surface>
            ))}
          </View>

          {/* Rating History */}
          <View style={styles.chartSection}>
            <Text
              variant="titleMedium"
              style={[styles.chartLabel, { color: colors.onSurfaceVariant }]}
            >
              Rating History
            </Text>
            <RatingChart profiles={[profile]} />
          </View>

          {/* Contest History */}
          <View style={styles.chartSection}>
            <Text
              variant="titleMedium"
              style={[styles.chartLabel, { color: colors.onSurfaceVariant }]}
            >
              Contest History
            </Text>
            <ContestHistory profiles={[profile]} />
          </View>

          {/* Extra bottom padding */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.15)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 8,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    flex: 1,
  },
  ratingBlock: {
    marginTop: 14,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 24,
    gap: 10,
  },
  statCard: {
    width: (Dimensions.get("window").width - 48 - 10) / 2 - 1,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
  },
  chartSection: {
    marginTop: 28,
  },
  chartLabel: {
    paddingHorizontal: 24,
    marginBottom: 14,
    fontWeight: "700",
    letterSpacing: 0.2,
    textTransform: "uppercase" as any,
    fontSize: 12,
  },
});
