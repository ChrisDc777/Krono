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
      clistApi
        .getAccountInfo(profile.platformId, profile.username)
        .then((acc) => {
          if (acc) setContestCount(acc.n_contests);
        });
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
        {/* Header with platform color */}
        <View style={[styles.header, { backgroundColor: platformColor }]}>
          {/* Close button */}
          <Pressable
            onPress={onDismiss}
            style={styles.closeButton}
            hitSlop={12}
          >
            <MaterialCommunityIcons
              name="close"
              size={22}
              color={onPlatformColor}
            />
          </Pressable>

          {/* Watermark */}
          <View style={styles.watermark}>
            <MaterialCommunityIcons
              name={(platformConfig?.icon as any) || "code-tags"}
              size={120}
              color={onPlatformColor}
              style={{ opacity: 0.08 }}
            />
          </View>

          {/* Profile info */}
          <View style={styles.headerContent}>
            <View
              style={[
                styles.platformBadge,
                { backgroundColor: "rgba(255,255,255,0.2)" },
              ]}
            >
              <MaterialCommunityIcons
                name={(platformConfig?.icon as any) || "code-tags"}
                size={14}
                color={onPlatformColor}
              />
              <Text
                style={{
                  color: onPlatformColor,
                  fontWeight: "800",
                  fontSize: 10,
                  marginLeft: 4,
                }}
              >
                {platformConfig?.name?.toUpperCase()}
              </Text>
            </View>

            <Text
              variant="displaySmall"
              style={{
                fontWeight: "900",
                color: onPlatformColor,
                letterSpacing: -1,
                marginTop: 12,
              }}
            >
              {profile.rating ?? "Unrated"}
            </Text>

            {profile.rank ? (
              <Text
                variant="titleSmall"
                style={{
                  color: onPlatformColor,
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  opacity: 0.9,
                  marginTop: 2,
                }}
              >
                {profile.rank}
              </Text>
            ) : null}

            <Text
              variant="bodyMedium"
              style={{
                color: onPlatformColor,
                opacity: 0.7,
                fontWeight: "600",
                marginTop: 4,
              }}
            >
              @{profile.username}
            </Text>
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
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.04)",
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 28,
    position: "relative",
    overflow: "hidden",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.15)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  watermark: {
    position: "absolute",
    right: -20,
    bottom: -20,
    transform: [{ rotate: "-10deg" }],
  },
  headerContent: {
    marginTop: 8,
  },
  platformBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
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
