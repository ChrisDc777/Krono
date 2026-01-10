import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
    Appbar,
    Button,
    Card,
    Dialog,
    Divider,
    IconButton,
    List,
    Portal,
    Surface,
    Switch,
    Text,
    TextInput,
    useTheme
} from 'react-native-paper';
import { useProfileStore } from '../../src/stores/useProfileStore';
import { useSettingsStore } from '../../src/stores/useSettingsStore';
import { useThemeStore } from '../../src/stores/useThemeStore';
import { PLATFORMS, PlatformId } from '../../src/types/platform';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { profiles, addProfile, removeProfile, isLoading } = useProfileStore();
  const { 
      notificationsEnabled, 
      reminderIntervals, 
      backgroundSyncEnabled,
      toggleNotifications, 
      toggleInterval, 
      toggleBackgroundSync 
  } = useSettingsStore();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId | null>(null);
  const [username, setUsername] = useState('');

  const handleAddProfile = async () => {
    if (!selectedPlatform || !username.trim()) {
      return;
    }
    await addProfile(selectedPlatform, username.trim());
    setDialogVisible(false);
    setUsername('');
    setSelectedPlatform(null);
  };

  const openAddDialog = (platform: PlatformId) => {
    setSelectedPlatform(platform);
    setDialogVisible(true);
  };

  // Get platforms that haven't been added yet
  const availablePlatforms = Object.values(PLATFORMS).filter(
    platform => !profiles.some(p => p.platformId === platform.id)
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header elevated mode="center-aligned" style={{ backgroundColor: colors.surface }}>
        <Appbar.Content title="Settings" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Appearance */}
        <List.Section>
           <List.Subheader>Appearance</List.Subheader>
           <Card style={styles.card} mode="elevated" elevation={1}>
             <List.Item
                title="Dark Mode"
                left={props => <List.Icon {...props} icon="theme-light-dark" />}
                right={() => <Switch value={isDarkMode} onValueChange={toggleTheme} />}
             />
           </Card>
        </List.Section>
        
        {/* Notifications */}
        <List.Section>
           <List.Subheader>Notifications</List.Subheader>
           <Card style={styles.card} mode="elevated" elevation={1}>
             <List.Item
                title="Enable Notifications"
                left={props => <List.Icon {...props} icon="bell-outline" />}
                right={() => <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />}
             />
             <Divider />
             <List.Item
                title="15 min before"
                left={props => <List.Icon {...props} icon="clock-outline" />}
                right={() => <Switch value={reminderIntervals.includes(15)} onValueChange={() => toggleInterval(15)} disabled={!notificationsEnabled} />}
             />
             <Divider />
             <List.Item
                title="1 hour before"
                left={props => <List.Icon {...props} icon="clock-time-one-outline" />}
                right={() => <Switch value={reminderIntervals.includes(60)} onValueChange={() => toggleInterval(60)} disabled={!notificationsEnabled} />}
             />
           </Card>
        </List.Section>

        {/* Sync */}
        <List.Section>
           <List.Subheader>Sync</List.Subheader>
           <Card style={styles.card} mode="elevated" elevation={1}>
             <List.Item
                title="Background Sync"
                description="Periodically fetch contests"
                left={props => <List.Icon {...props} icon="sync" />}
                right={() => <Switch value={backgroundSyncEnabled} onValueChange={toggleBackgroundSync} />}
             />
           </Card>
        </List.Section>

        {/* Connected Profiles */}
        <View style={styles.sectionContainer}>
           <Text variant="titleMedium" style={styles.sectionTitle}>Connected Profiles</Text>
           <Surface style={styles.settingsCard} elevation={1}>
            <View style={styles.profileList}>
              {profiles.length === 0 ? (
                  <Text variant="bodyMedium" style={{ fontStyle: 'italic', color: colors.outline, textAlign: 'center', marginVertical: 12 }}>
                    No profiles connected yet.
                  </Text>
              ) : (
                 profiles.map((profile) => {
                    const platformConfig = PLATFORMS[profile.platformId];
                    let platformColor = platformConfig?.color || colors.primary;
                    if (profile.platformId === 'atcoder' && !isDarkMode) {
                         platformColor = '#000000';
                    }

                    return (
                     <View key={profile.id} style={[styles.profileRow, { borderLeftColor: platformColor }]}>
                        <View style={{ flex: 1 }}>
                            <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>{profile.username}</Text>
                            <Text variant="bodySmall" style={{ color: colors.secondary }}>
                                {platformConfig?.name} • <Text style={{ fontWeight: '700', color: platformColor }}>{profile.rating || 'Unrated'}</Text>
                            </Text>
                        </View>
                        <IconButton 
                            icon="trash-can-outline" 
                            size={20} 
                            iconColor={colors.error}
                            onPress={() => removeProfile(profile.id)} 
                        />
                     </View>
                    );
                 })
              )}
            </View>
           </Surface>
        </View>

        {/* Add Profile */}
        <List.Section>
           <List.Subheader>Add Profile</List.Subheader>
           <View style={styles.grid}>
             {availablePlatforms.map(platform => {
                 let platformColor = platform.color;
                 if (platform.id === 'atcoder' && !isDarkMode) {
                     platformColor = '#000000';
                 }
                 return (
                 <Card 
                    key={platform.id} 
                    style={[styles.platformCard, { borderColor: platformColor }]} 
                    onPress={() => openAddDialog(platform.id)} 
                    mode="outlined"
                 >
                     <Card.Content style={styles.platformCardContent}>
                         <View style={[styles.iconBox, { backgroundColor: platformColor + '20' }]}>
                            <MaterialCommunityIcons name={platform.icon as any || 'code-tags'} size={20} color={platformColor} />
                         </View>
                         <Text variant="labelLarge" style={{ marginTop: 6, fontWeight: 'bold' }}>{platform.name}</Text>
                         <Text variant="bodySmall" style={{ color: colors.outline, fontSize: 10 }}>Connect</Text>
                     </Card.Content>
                 </Card>
             )})}
           </View>
        </List.Section>

        <View style={styles.footer}>
             <Text variant="bodySmall" style={{ color: colors.outline }}>v1.0.0 • Krono</Text>
             <Text variant="bodySmall" style={{ color: colors.outline, marginTop: 4 }}>Made with ❤️ by Meet</Text>
        </View>

      </ScrollView>

      {/* Add Profile Dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)} style={{ backgroundColor: colors.surface }}>
          <Dialog.Title>Connect {selectedPlatform ? PLATFORMS[selectedPlatform].name : ''}</Dialog.Title>
          <Dialog.Content>
             <Text variant="bodyMedium" style={{ marginBottom: 12 }}>Enter your handle to sync stats.</Text>
             <TextInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                mode="outlined"
                autoCapitalize="none"
             />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleAddProfile} loading={isLoading} disabled={!username.trim()}>Connect</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
    paddingHorizontal: 16
  },
  card: {
      paddingVertical: 0
  },
  grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12
  },
  platformCard: {
      width: '48%',
      marginBottom: 0,
      borderRadius: 16
  },
  platformCardContent: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8
  },
  iconBox: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
  },
  footer: {
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 20
  },
  sectionContainer: {
      marginBottom: 24,
  },
  sectionTitle: {
      fontWeight: '700',
      marginBottom: 8,
      marginLeft: 4,
      textTransform: 'uppercase',
      fontSize: 12,
      letterSpacing: 1,
      opacity: 0.6
  },
  settingsCard: {
      borderRadius: 16,
      overflow: 'hidden',
  },
  profileList: {
      padding: 0
  },
  profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 0.5,
      borderBottomColor: 'rgba(0,0,0,0.05)',
      borderLeftWidth: 4,
      backgroundColor: 'transparent'
  },
});
