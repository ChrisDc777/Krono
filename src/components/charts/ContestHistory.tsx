import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import { clistApi } from "../../api/clist";
import { UnifiedProfile } from "../../types/user";
import { Skeleton } from "../common/SkeletonLoader";

interface ContestHistoryProps {
  profiles: UnifiedProfile[];
}

interface ContestEntry {
  event: string;
  date: string;
  place: number;
  ratingChange: number | null;
  newRating: number | null;
}

/**
 * Shows recent contest participation history fetched from clist.by.
 * Uses cached data from the clist API module to avoid duplicate calls.
 */
export function ContestHistory({ profiles }: ContestHistoryProps) {
  const { colors, dark } = useTheme();
  const [entries, setEntries] = useState<ContestEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profiles.length === 0) return;

    const profile = profiles[0];
    setIsLoading(true);
    setEntries([]);

    clistApi
      .getRecentContests(profile.platformId, profile.username, 20)
      .then((stats) => {
        const mapped: ContestEntry[] = stats.map((s) => ({
          event: s.event || "Contest",
          date: s.date || "",
          place: s.place || 0,
          ratingChange: s.rating_change,
          newRating: s.new_rating,
        }));
        setEntries(mapped);
      })
      .catch((e) => {
        console.warn("[ContestHistory] fetch failed:", e);
      })
      .finally(() => setIsLoading(false));
  }, [profiles]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Skeleton width="100%" height={200} borderRadius={16} />
      </View>
    );
  }

  if (entries.length === 0) return null;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <View style={styles.container}>
      <Surface
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
          },
        ]}
        elevation={0}
      >
        {entries.map((entry, i) => (
          <View
            key={i}
            style={[
              styles.row,
              i < entries.length - 1 && {
                borderBottomWidth: 0.5,
                borderBottomColor: dark
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
          >
            {/* Rank badge */}
            <View
              style={[
                styles.rankBadge,
                {
                  backgroundColor: dark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.04)",
                },
              ]}
            >
              <Text
                style={{
                  fontWeight: "800",
                  fontSize: 11,
                  color: colors.onSurfaceVariant,
                }}
              >
                #{entry.place}
              </Text>
            </View>

            {/* Event + date */}
            <View style={styles.eventInfo}>
              <Text
                variant="bodySmall"
                numberOfLines={1}
                style={{
                  fontWeight: "600",
                  color: colors.onSurface,
                }}
              >
                {entry.event}
              </Text>
              <Text
                variant="labelSmall"
                style={{
                  color: colors.onSurfaceVariant,
                  marginTop: 1,
                  fontSize: 10,
                }}
              >
                {formatDate(entry.date)}
              </Text>
            </View>

            {/* Rating change */}
            {entry.ratingChange !== null ? (
              <View style={styles.ratingChange}>
                <MaterialCommunityIcons
                  name={
                    entry.ratingChange >= 0
                      ? "arrow-up-bold"
                      : "arrow-down-bold"
                  }
                  size={12}
                  color={entry.ratingChange >= 0 ? "#22C55E" : "#EF4444"}
                />
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: 12,
                    color: entry.ratingChange >= 0 ? "#22C55E" : "#EF4444",
                    marginLeft: 2,
                  }}
                >
                  {entry.ratingChange > 0
                    ? `+${entry.ratingChange}`
                    : entry.ratingChange}
                </Text>
              </View>
            ) : (
              <Text
                style={{
                  fontSize: 11,
                  color: colors.outline,
                  fontWeight: "500",
                }}
              >
                —
              </Text>
            )}
          </View>
        ))}
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  rankBadge: {
    width: 36,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  eventInfo: {
    flex: 1,
  },
  ratingChange: {
    flexDirection: "row",
    alignItems: "center",
  },
});
