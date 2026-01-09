import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
    Appbar,
    Avatar,
    Button,
    Card,
    Dialog,
    Divider,
    IconButton,
    List,
    Portal,
    Switch,
    Text,
    TextInput,
    useTheme
} from 'react-native-paper';
import { useProfileStore } from '../../src/stores/useProfileStore';
import { useSettingsStore } from '../../src/stores/useSettingsStore';
import { PLATFORMS, PlatformId } from '../../src/types/platform';

export default function SettingsScreen() {
  const { colors } = useTheme();
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
        <List.Section>
           <List.Subheader>Connected Profiles</List.Subheader>
           <Card style={styles.card} mode="elevated" elevation={1}>
             {profiles.length === 0 ? (
                 <List.Item title="No profiles connected" titleStyle={{ fontStyle: 'italic', color: colors.outline }} />
             ) : (
                profiles.map((profile, index) => (
                    <React.Fragment key={profile.id}>
                        <List.Item
                            title={profile.username}
                            description={`${profile.platformId} • ${profile.rating || 'Unrated'}`}
                            left={props => (
                                <Avatar.Icon {...props} size={40} icon="account" style={{ backgroundColor: colors.secondaryContainer }} color={colors.onSecondaryContainer} />
                            )}
                            right={props => (
                                <IconButton {...props} icon="delete-outline" iconColor={colors.error} onPress={() => removeProfile(profile.id)} />
                            )}
                        />
                        {index < profiles.length - 1 && <Divider />}
                    </React.Fragment>
                ))
             )}
           </Card>
        </List.Section>

        {/* Add Profile */}
        <List.Section>
           <List.Subheader>Add Profile</List.Subheader>
           <View style={styles.grid}>
             {availablePlatforms.map(platform => (
                 <Card 
                    key={platform.id} 
                    style={[styles.platformCard, { borderColor: platform.color }]} 
                    onPress={() => openAddDialog(platform.id)} 
                    mode="outlined"
                 >
                     <Card.Content style={styles.platformCardContent}>
                         <View style={[styles.iconBox, { backgroundColor: platform.color + '20' }]}>
                            <MaterialCommunityIcons name={platform.icon as any || 'code-tags'} size={28} color={platform.color} />
                         </View>
                         <Text variant="titleMedium" style={{ marginTop: 12, fontWeight: 'bold' }}>{platform.name}</Text>
                         <Text variant="bodySmall" style={{ color: colors.outline }}>Connect</Text>
                     </Card.Content>
                 </Card>
             ))}
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
      paddingVertical: 12
  },
  iconBox: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
  },
  footer: {
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 20
  }
});
