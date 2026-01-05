import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { SegmentedButtons, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SleekCard } from '../../src/components/ui/SleekCard';
import { useProfileStore } from '../../src/stores/useProfileStore';
import { colors } from '../../src/theme/colors';
import { PLATFORMS } from '../../src/types/platform';

// Victory Native (new alpha/beta) API might be different, using standard SVG based Victory Native syntax
// Wait, 'victory-native' v41 is actually the old one based on react-native-svg (VictoryPie, VictoryChart, etc)
// But 'victory-native' v41 export is named exports like VictoryPie.
// Let's check imports carefully. Typically: import { VictoryPie, VictoryChart, ... } from "victory-native";

import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryPie } from 'victory-native';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const { profiles, loadProfiles } = useProfileStore();
  const [selectedView, setSelectedView] = useState('overview');

  useEffect(() => {
    loadProfiles();
  }, []);

  // Aggregate stats
  const aggregateStats = useMemo(() => {
    return profiles.reduce((acc, profile) => ({
      totalSolved: acc.totalSolved + profile.problemsSolved,
      totalSubmissions: acc.totalSubmissions + profile.totalSubmissions,
      highestRating: Math.max(acc.highestRating, profile.rating),
      platformCount: acc.platformCount + 1,
    }), { totalSolved: 0, totalSubmissions: 0, highestRating: 0, platformCount: 0 });
  }, [profiles]);

  // Platform breakdown for charts
  const pieData = useMemo(() => {
    return profiles.map(p => ({
      x: PLATFORMS[p.platformId].name,
      y: p.problemsSolved,
      fill: PLATFORMS[p.platformId].color,
      label: `${p.problemsSolved}`
    })).filter(d => d.y > 0);
  }, [profiles]);

  const barData = useMemo(() => {
    return profiles.map(p => ({
      platform: PLATFORMS[p.platformId].name,
      rating: p.rating,
      fill: PLATFORMS[p.platformId].color
    })).filter(d => d.rating > 0);
  }, [profiles]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
         <Text style={styles.headerTitle}>Analytics</Text>
         <Text style={styles.headerSubtitle}>Performance insights</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* View Switcher */}
        <SegmentedButtons
          value={selectedView}
          onValueChange={setSelectedView}
          buttons={[
            { value: 'overview', label: 'Overview' },
            { value: 'details', label: 'Details' },
          ]}
          style={styles.segmentedButtons}
          theme={{ colors: { secondaryContainer: colors.primary, onSecondaryContainer: colors.text.primary } }}
        />

        {selectedView === 'overview' && (
          <View style={{ gap: 20 }}>
            {/* Main Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                 <Text style={styles.statValue}>{aggregateStats.totalSolved}</Text>
                 <Text style={styles.statLabel}>Total Solved</Text>
                 <MaterialCommunityIcons name="check-circle-outline" size={20} color={colors.status.success} style={styles.statIcon} />
              </View>
              
              <View style={styles.statBox}>
                 <Text style={styles.statValue}>{aggregateStats.highestRating}</Text>
                 <Text style={styles.statLabel}>Best Rating</Text>
                 <MaterialCommunityIcons name="trophy-outline" size={20} color={colors.accent} style={styles.statIcon} />
              </View>
            </View>

            {/* Problem Distribution Chart */}
            <SleekCard style={styles.chartCard} variant="bordered">
              <Text style={styles.cardTitle}>Problem Distribution</Text>
              {pieData.length > 0 ? (
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <VictoryPie
                      data={pieData}
                      width={screenWidth - 80}
                      height={280}
                      innerRadius={60}
                      style={{
                        labels: { fill: colors.text.secondary, fontSize: 12, fontWeight: 'bold' },
                        data: { fill: ({ datum }) => datum.fill }
                      }}
                      padAngle={2}
                    />
                </View>
              ) : (
                <Text style={styles.noDataText}>No solved problems data available.</Text>
              )}
            </SleekCard>

            {/* Rating Comparison Chart */}
            <SleekCard style={styles.chartCard} variant="bordered">
               <Text style={styles.cardTitle}>Current Ratings</Text>
               {barData.length > 0 ? (
                 <View style={{ marginLeft: -20, marginTop: 10 }}>
                    <VictoryChart 
                        width={screenWidth - 40} 
                        height={250} 
                        domainPadding={{ x: 30 }}
                    >
                        <VictoryAxis 
                            style={{ 
                                tickLabels: { fill: colors.text.secondary, fontSize: 10, angle: 0 }, 
                                axis: { stroke: colors.border }
                            }} 
                        />
                        <VictoryAxis 
                            dependentAxis 
                            style={{ 
                                tickLabels: { fill: colors.text.secondary, fontSize: 10 },
                                grid: { stroke: colors.border, strokeDasharray: '4, 4' },
                                axis: { stroke: 'transparent' } 
                            }} 
                        />
                        <VictoryBar
                            data={barData}
                            x="platform"
                            y="rating"
                            style={{ data: { fill: ({ datum }) => datum.fill, width: 25 } }}
                            cornerRadius={{ top: 6 }}
                            animate={{ duration: 1000 }}
                            labels={({ datum }) => datum.rating}
                            labelComponent={<VictoryLabel dy={-10} style={{ fill: colors.text.primary, fontSize: 10 }} />}
                        />
                    </VictoryChart>
                 </View>
               ) : (
                 <Text style={styles.noDataText}>No rating data available.</Text>
               )}
            </SleekCard>
          </View>
        )}

        {selectedView === 'details' && (
           <View style={{ gap: 16 }}>
               {profiles.map(profile => (
                   <SleekCard key={profile.id} style={styles.detailCard}>
                       <View style={styles.detailHeader}>
                           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                               <MaterialCommunityIcons name={PLATFORMS[profile.platformId].icon as any} size={24} color={PLATFORMS[profile.platformId].color} />
                               <Text style={[styles.platformName, { color: PLATFORMS[profile.platformId].color }]}>{PLATFORMS[profile.platformId].name}</Text>
                           </View>
                           <Text style={styles.detailUsername}>@{profile.username}</Text>
                       </View>

                       <View style={styles.detailStatsRow}>
                            <View style={styles.detailStatItem}>
                                <Text style={styles.detailValue}>{profile.rating}</Text>
                                <Text style={styles.detailLabel}>Rating</Text>
                            </View>
                             <View style={styles.divider} />
                             <View style={styles.detailStatItem}>
                                <Text style={styles.detailValue}>{profile.maxRating}</Text>
                                <Text style={styles.detailLabel}>Max</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.detailStatItem}>
                                <Text style={styles.detailValue}>{profile.problemsSolved}</Text>
                                <Text style={styles.detailLabel}>Solved</Text>
                            </View>
                       </View>
                   </SleekCard>
               ))}
           </View>
        )}
      </ScrollView>
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
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
  },
  headerSubtitle: {
      fontSize: 14,
      color: colors.text.secondary,
      marginTop: -2,
      marginBottom: 10
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  segmentedButtons: {
    marginBottom: 24,
  },
  statsGrid: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20
  },
  statBox: {
      flex: 1,
      borderRadius: 4, // Sharp
      padding: 16,
      alignItems: 'flex-start',
      position: 'relative',
      borderWidth: 2, // Thick
      borderColor: colors.border,
      backgroundColor: colors.surface,
      // Hard Shadow - Cyan
      shadowColor: colors.secondary,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 0,
      marginTop: 4,
      marginRight: 4,
      marginBottom: 8
  },
  statValue: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.text.primary,
      marginBottom: 4
  },
  statLabel: {
      fontSize: 12,
      color: colors.text.secondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5
  },
  statIcon: {
      position: 'absolute',
      right: 12,
      top: 12,
      opacity: 0.8
  },
  chartCard: {
      padding: 16,
      marginBottom: 20,
      alignItems: 'center'
  },
  cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text.primary,
      alignSelf: 'flex-start',
      marginBottom: 10
  },
  noDataText: {
      color: colors.text.muted,
      marginTop: 20,
      marginBottom: 20,
      fontStyle: 'italic'
  },
  detailCard: {
      padding: 16,
  },
  detailHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: 12
  },
  platformName: {
      fontSize: 14,
      fontWeight: 'bold',
      textTransform: 'uppercase'
  },
  detailUsername: {
      fontSize: 12,
      color: colors.text.muted
  },
  detailStatsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
  },
  detailStatItem: {
      alignItems: 'center',
      flex: 1
  },
  detailValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text.primary,
      marginBottom: 2
  },
  detailLabel: {
      fontSize: 10,
      color: colors.text.secondary,
      textTransform: 'uppercase'
  },
  divider: {
      width: 1,
      height: 24,
      backgroundColor: colors.border
  }
});

