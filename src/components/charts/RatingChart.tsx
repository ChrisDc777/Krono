import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import { codeforcesApi } from "../../api/codeforces";
import { leetcodeApi } from "../../api/leetcode";
import { PlatformId, PLATFORMS } from "../../types/platform";
import { UnifiedProfile } from "../../types/user";
import { Skeleton } from "../common/SkeletonLoader";

interface RatingPoint {
  date: number; // timestamp ms
  rating: number;
  label?: string; // contest name
}

interface RatingChartProps {
  profiles: UnifiedProfile[];
}

const CHART_HEIGHT = 160;
const CHART_PADDING = 16;

/**
 * Minimal rating history chart using pure RN Views (no Victory dependency needed).
 * Draws a polyline-approximation using positioned dots and a gradient bg.
 */
export function RatingChart({ profiles }: RatingChartProps) {
  const { colors, dark } = useTheme();
  const [historyMap, setHistoryMap] = useState<Record<string, RatingPoint[]>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(false);

  const screenWidth = Dimensions.get("window").width - 40; // minus padding

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    const result: Record<string, RatingPoint[]> = {};

    for (const profile of profiles) {
      try {
        if (profile.platformId === "codeforces") {
          const data = await codeforcesApi.getUserRating(profile.username);
          if (Array.isArray(data) && data.length > 0) {
            result[profile.platformId] = data.map((d: any) => ({
              date: d.ratingUpdateTimeSeconds * 1000,
              rating: d.newRating,
              label: d.contestName,
            }));
          }
        } else if (profile.platformId === "leetcode") {
          const data = await leetcodeApi.getUserContestRanking(
            profile.username,
          );
          if (data?.history && Array.isArray(data.history)) {
            const attended = data.history.filter((h: any) => h.attended);
            if (attended.length > 0) {
              result[profile.platformId] = attended.map((h: any) => ({
                date: h.contest.startTime * 1000,
                rating: Math.round(h.rating),
                label: h.contest.title,
              }));
            }
          }
        }
        // AtCoder — already fetched via history JSON in getUserInfo, but
        // we'd need a separate call. Skip for now since the API already
        // gives current rating in profile.
      } catch (e) {
        console.warn(`[RatingChart] Failed to fetch ${profile.platformId}:`, e);
      }
    }

    setHistoryMap(result);
    setIsLoading(false);
  }, [profiles]);

  useEffect(() => {
    if (profiles.length > 0) {
      fetchHistory();
    }
  }, [profiles.length]);

  const platformKeys = Object.keys(historyMap) as PlatformId[];

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Skeleton width="100%" height={CHART_HEIGHT} borderRadius={12} />
      </View>
    );
  }

  if (platformKeys.length === 0) return null;

  return (
    <View style={styles.container}>
      {platformKeys.map((platformId) => {
        const points = historyMap[platformId];
        if (!points || points.length < 2) return null;

        const platformConfig = PLATFORMS[platformId];
        let color = platformConfig?.color || colors.primary;
        if (platformId === "atcoder" && !dark) color = "#000";

        // Compute bounds
        const ratings = points.map((p) => p.rating);
        const minR = Math.min(...ratings);
        const maxR = Math.max(...ratings);
        const rangeR = maxR - minR || 1;

        const chartWidth = screenWidth - CHART_PADDING * 2;

        return (
          <Surface
            key={platformId}
            style={[
              styles.chartCard,
              {
                backgroundColor: colors.surface,
                borderColor: dark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
            elevation={1}
          >
            {/* Header */}
            <View style={styles.chartHeader}>
              <View style={[styles.platformDot, { backgroundColor: color }]} />
              <Text variant="labelMedium" style={{ fontWeight: "700" }}>
                {platformConfig?.name} Rating
              </Text>
              <Text
                variant="labelSmall"
                style={{
                  marginLeft: "auto",
                  color: colors.outline,
                }}
              >
                {points[points.length - 1].rating}
              </Text>
            </View>

            {/* Chart area */}
            <View style={[styles.chartArea, { height: CHART_HEIGHT }]}>
              {/* Horizontal grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
                <View
                  key={pct}
                  style={[
                    styles.gridLine,
                    {
                      bottom: pct * (CHART_HEIGHT - 20),
                      backgroundColor: dark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.04)",
                    },
                  ]}
                />
              ))}

              {/* Data points + connecting lines */}
              {points.map((point, i) => {
                const x = (i / (points.length - 1)) * chartWidth;
                const y =
                  ((point.rating - minR) / rangeR) * (CHART_HEIGHT - 30);

                return (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      {
                        left: x + CHART_PADDING - 3,
                        bottom: y + 5,
                        backgroundColor: color,
                      },
                    ]}
                  />
                );
              })}

              {/* Connecting lines using Views */}
              {points.slice(0, -1).map((point, i) => {
                const next = points[i + 1];
                const x1 =
                  (i / (points.length - 1)) * chartWidth + CHART_PADDING;
                const x2 =
                  ((i + 1) / (points.length - 1)) * chartWidth + CHART_PADDING;
                const y1 =
                  ((point.rating - minR) / rangeR) * (CHART_HEIGHT - 30) + 5;
                const y2 =
                  ((next.rating - minR) / rangeR) * (CHART_HEIGHT - 30) + 5;

                const dx = x2 - x1;
                const dy = y2 - y1;
                const length = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(-dy, dx) * (180 / Math.PI); // negative because bottom-based

                return (
                  <View
                    key={`line-${i}`}
                    style={{
                      position: "absolute",
                      left: x1,
                      bottom: y1,
                      width: length,
                      height: 2,
                      backgroundColor: color,
                      opacity: 0.6,
                      transform: [{ rotate: `${angle}deg` }],
                      transformOrigin: "left bottom",
                    }}
                  />
                );
              })}
            </View>

            {/* Min/Max labels */}
            <View style={styles.chartFooter}>
              <Text variant="labelSmall" style={{ color: colors.outline }}>
                Low: {minR}
              </Text>
              <Text variant="labelSmall" style={{ color: colors.outline }}>
                Peak: {maxR}
              </Text>
            </View>
          </Surface>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 12,
  },
  chartCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  platformDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  chartArea: {
    position: "relative",
    overflow: "hidden",
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
  },
  dot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chartFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
});
