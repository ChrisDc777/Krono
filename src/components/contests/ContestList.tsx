import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import React from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import { ActivityIndicator, Surface, Text, useTheme } from "react-native-paper";
import { useContestStore } from "../../stores/useContestStore";
import { Contest } from "../../types/contest";
import { PLATFORMS } from "../../types/platform";

interface ContestListProps {
  contests: Contest[];
  emptyMessage?: string;
  limit?: number;
  isLoading?: boolean;
}

export const ContestList: React.FC<ContestListProps> = ({
  contests,
  emptyMessage = "No contests found.",
  limit,
  isLoading = false,
}) => {
  const { colors, dark } = useTheme();
  const { toggleReminder } = useContestStore();
  // Map 'dark' property to 'isDarkMode' variable for compatibility with existing logic
  const isDarkMode = dark;

  const displayedContests = limit ? contests.slice(0, limit) : contests;

  if (isLoading) {
    return (
      <ActivityIndicator
        size="small"
        color={colors.primary}
        style={{ marginTop: 20 }}
      />
    );
  }

  if (contests.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="calendar-remove"
          size={40}
          color={colors.onSurfaceVariant}
          style={{ opacity: 0.5, marginBottom: 8 }}
        />
        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {displayedContests.map((contest) => {
        const startTime = new Date(contest.startTime);
        const platformConfig = PLATFORMS[contest.platformId];
        let platformColor = platformConfig?.color || colors.primary;

        // AtCoder Light Mode Visibility Fix
        if (contest.platformId === "atcoder" && !isDarkMode) {
          platformColor = "#000000";
        }

        const totalMinutes = Math.round(contest.durationSeconds / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const durationText =
          hours > 0
            ? minutes > 0
              ? `${hours}h ${minutes}m`
              : `${hours}h`
            : `${minutes}m`;

        return (
          <Surface
            key={contest.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: dark
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(0,0,0,0.08)",
              },
            ]}
            elevation={0}
            mode="flat"
          >
            {/* Left Tint Bar */}
            <View
              style={[
                styles.tintBar,
                { backgroundColor: platformColor, opacity: 0.8 },
              ]}
            />

            <View style={styles.contentContainer}>
              {/* Header: Platform & Date */}
              <View style={styles.row}>
                <View
                  style={[
                    styles.platformPill,
                    { backgroundColor: platformColor + "15" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={platformConfig?.icon as any}
                    size={12}
                    color={platformColor}
                  />
                  <Text
                    style={{
                      marginLeft: 4,
                      color: platformColor,
                      fontSize: 10,
                      fontWeight: "700",
                      textTransform: "uppercase",
                    }}
                  >
                    {contest.platformId}
                  </Text>
                </View>
                <Text variant="labelSmall" style={{ color: colors.secondary }}>
                  {format(startTime, "MMM d, HH:mm")}
                </Text>
              </View>

              {/* Title */}
              <Text
                variant="titleMedium"
                style={{
                  fontWeight: "bold",
                  marginVertical: 8,
                  color: colors.onSurface,
                }}
                numberOfLines={2}
              >
                {contest.name}
              </Text>

              {/* Footer: Duration */}
              <View style={styles.row}>
                <View style={styles.durationPill}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={12}
                    color={colors.secondary}
                  />
                  <Text
                    variant="labelSmall"
                    style={{
                      marginLeft: 4,
                      color: colors.secondary,
                      fontWeight: "600",
                    }}
                  >
                    {durationText}
                  </Text>
                </View>
              </View>

              {/* Action Bar */}
              <View
                style={[
                  styles.actionBar,
                  {
                    borderTopColor: dark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.05)",
                  },
                ]}
              >
                <Pressable
                  style={[
                    styles.registerBtn,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={() => contest.url && Linking.openURL(contest.url)}
                >
                  <MaterialCommunityIcons
                    name="open-in-new"
                    size={14}
                    color={colors.onPrimary}
                  />
                  <Text
                    style={{
                      color: colors.onPrimary,
                      fontSize: 13,
                      fontWeight: "700",
                      marginLeft: 6,
                    }}
                  >
                    Register Now
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.reminderBtn,
                    {
                      backgroundColor: contest.reminderSet
                        ? colors.primary + "15"
                        : colors.surfaceVariant,
                    },
                  ]}
                  onPress={() =>
                    toggleReminder(contest.id, !contest.reminderSet)
                  }
                >
                  <MaterialCommunityIcons
                    name={contest.reminderSet ? "bell-ring" : "bell-outline"}
                    size={18}
                    color={
                      contest.reminderSet
                        ? colors.primary
                        : colors.onSurfaceVariant
                    }
                  />
                </Pressable>
              </View>
            </View>
          </Surface>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1.5,
    marginBottom: 0,
  },
  tintBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    zIndex: 2,
  },
  contentContainer: {
    padding: 16,
    paddingLeft: 20,
    zIndex: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  platformPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  durationPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.03)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  registerBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
  reminderBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
