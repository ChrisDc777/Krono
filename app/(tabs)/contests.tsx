
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format, isSameDay, isTomorrow } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { Linking, RefreshControl, ScrollView, SectionList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Appbar, Chip, Surface, Text, useTheme } from 'react-native-paper';
import { useContestStore } from '../../src/stores/useContestStore';
import { Contest } from '../../src/types/contest';
import { PLATFORMS, PlatformId } from '../../src/types/platform';

export default function ContestsScreen() {
  const { colors, dark } = useTheme();
  const isDarkMode = dark;
  const { upcomingContests, loadContests, syncContests, isLoading } = useContestStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId | 'all'>('all');

  useEffect(() => {
    loadContests();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await syncContests();
    setRefreshing(false);
  };

  // Filter and Group Data
  const sections = useMemo(() => {
    const filtered = upcomingContests.filter(contest => {
      const matchesPlatform = selectedPlatform === 'all' || contest.platformId === selectedPlatform;
      return matchesPlatform;
    });

    const today: Contest[] = [];
    const tomorrow: Contest[] = [];
    const thisWeek: Contest[] = [];
    const upcoming: Contest[] = [];

    const now = new Date();

    filtered.forEach(contest => {
      const startDate = new Date(contest.startTime);
      if (isNaN(startDate.getTime())) return;
      
      if (isSameDay(startDate, now)) {
        today.push(contest);
      } else if (isTomorrow(startDate)) {
        tomorrow.push(contest);
      } else {
        const diffTime = Math.abs(startDate.getTime() - now.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        if (diffDays <= 7) {
            thisWeek.push(contest);
        } else {
            upcoming.push(contest);
        }
      }
    });

    const result = [];
    if (today.length > 0) result.push({ title: 'Today', data: today });
    if (tomorrow.length > 0) result.push({ title: 'Tomorrow', data: tomorrow });
    if (thisWeek.length > 0) result.push({ title: 'This Week', data: thisWeek });
    if (upcoming.length > 0) result.push({ title: 'Later', data: upcoming });

    return result;
  }, [upcomingContests, selectedPlatform]);

  const renderContestItem = ({ item }: { item: Contest }) => {
     const startDate = new Date(item.startTime);
     const totalMinutes = Math.round(item.durationSeconds / 60);
     const hours = Math.floor(totalMinutes / 60);
     const minutes = totalMinutes % 60;
     const durationText = hours > 0  ? (minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`) : `${minutes}m`;
        
     const platformConfig = PLATFORMS[item.platformId];
     let platformColor = platformConfig?.color || colors.primary;
     
     if (item.platformId === 'atcoder' && !isDarkMode) {
         platformColor = '#000000';
     }

     return (
          <Surface 
            style={[
                styles.card, 
                { 
                    backgroundColor: colors.surface,
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)'
                }
            ]} 
            elevation={2}
          >
             {/* Left Tint Bar */}
             <View style={[styles.tintBar, { backgroundColor: platformColor }]} />

             {/* Watermark - Small for list view */}
             <View style={styles.watermarkContainer}>
                  <MaterialCommunityIcons 
                      name={platformConfig?.icon as any || 'trophy-outline'} 
                      size={60} 
                      color={platformColor} 
                      style={{ opacity: 0.05 }}
                  />
             </View>

             <View style={styles.contentContainer} onTouchEnd={() => item.url && Linking.openURL(item.url)}>
                <View style={{ flex: 1, gap: 4 }}>
                   {/* Header Row */}
                   <View style={styles.row}>
                        <View style={[styles.platformPill, { backgroundColor: platformColor + '15' }]}>
                            <MaterialCommunityIcons name={platformConfig?.icon as any} size={10} color={platformColor} />
                            <Text style={{ marginLeft: 4, color: platformColor, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>
                                {item.platformId}
                            </Text>
                        </View>
                        <Text variant="labelSmall" style={{ color: colors.outline }}>
                            {format(startDate, 'HH:mm')}
                        </Text>
                   </View>

                   <Text variant="titleMedium" numberOfLines={1} style={{ fontWeight: 'bold', color: colors.onSurface }}>
                       {item.name}
                   </Text>
                </View>

                {/* Right Side: Duration Pill */}
                <View style={styles.durationPill}>
                     <MaterialCommunityIcons name="clock-outline" size={12} color={colors.secondary} />
                     <Text variant="labelSmall" style={{ marginLeft: 4, color: colors.secondary, fontWeight: '600' }}>
                        {durationText}
                     </Text>
                </View>
             </View>
          </Surface>
     );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header elevated mode="center-aligned" style={{ backgroundColor: colors.surface }}>
        <Appbar.Content title="Schedule" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      {/* Chips Filter */}
      <View style={{ backgroundColor: colors.surface }}>
         <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.chipsContainer}
         >
          <Chip
            selected={selectedPlatform === 'all'}
            onPress={() => setSelectedPlatform('all')}
            style={[
                styles.chip,
                selectedPlatform === 'all' ? { backgroundColor: colors.onSurface } : { backgroundColor: colors.surfaceVariant, borderWidth: 0 }
            ]}
            textStyle={{
                color: selectedPlatform === 'all' ? colors.surface : colors.onSurfaceVariant,
                fontWeight: '700'
            }}
            showSelectedOverlay
          >
            All
          </Chip>
           {Object.values(PLATFORMS).map(platform => {
             let platformColor = platform.color;
             if (platform.id === 'atcoder' && !isDarkMode) {
                 platformColor = '#000000';
             }
             const isSelected = selectedPlatform === platform.id;
             return (
            <Chip
              key={platform.id}
              selected={isSelected}
              onPress={() => setSelectedPlatform(platform.id)}
              style={[
                  styles.chip, 
                  isSelected ? { backgroundColor: platformColor } : { backgroundColor: colors.surfaceVariant, borderWidth: 0 }
              ]}
              textStyle={{
                  color: isSelected ? '#FFFFFF' : colors.onSurfaceVariant,
                  fontWeight: isSelected ? '700' : '500'
              }}
              showSelectedOverlay
            >
              {platform.name}
            </Chip>
             );
          })}
        </ScrollView>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderContestItem}
        renderSectionHeader={({ section: { title } }) => (
          <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
             <Text variant="labelLarge" style={{ color: colors.outline, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>{title}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
                <Text variant="bodyLarge" style={{ color: colors.onSurfaceVariant }}>No contests found.</Text>
            </View>
          ) : (
            <ActivityIndicator style={{ marginTop: 20 }} color={colors.primary} />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chipsContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16, // Extra padding for shadow
    gap: 8,
  },
  chip: {
      marginRight: 8
  },
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  card: {
      marginBottom: 12,
      borderRadius: 12,
      overflow: 'hidden',
      position: 'relative',
      borderWidth: 1, // Start border width
      // Shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
  },
  tintBar: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      zIndex: 2
  },
  watermarkContainer: {
      position: 'absolute',
      right: -10,
      bottom: -10,
      zIndex: 1,
      transform: [{ rotate: '-10deg' }]
  },
  contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      paddingLeft: 18, // Space for tint bar
      gap: 12,
      zIndex: 2,
  },
  row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
  },
  platformPill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
  },
  durationPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.03)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8
  },
  emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 60
  }
});
