import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import {
    Button,
    Card,
    Divider,
    IconButton,
    List,
    Modal,
    Portal,
    Switch,
    Text,
    TextInput
} from 'react-native-paper';
import { useTheme } from '../../src/hooks/useTheme';
import { useProfileStore } from '../../src/stores/useProfileStore';
import { useSettingsStore } from '../../src/stores/useSettingsStore';
import { PLATFORMS, PlatformId } from '../../src/types/platform';

export default function SettingsScreen() {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { profiles, addProfile, removeProfile, isLoading } = useProfileStore();
  const { 
      notificationsEnabled, 
      reminderIntervals, 
      backgroundSyncEnabled,
      toggleNotifications, 
      toggleInterval, 
      toggleBackgroundSync 
  } = useSettingsStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId | null>(null);
  const [username, setUsername] = useState('');

  const handleAddProfile = async () => {
    if (!selectedPlatform || !username.trim()) {
      Alert.alert('Error', 'Please select a platform and enter a username');
      return;
    }

    await addProfile(selectedPlatform, username.trim());
    setModalVisible(false);
    setUsername('');
    setSelectedPlatform(null);
  };

  const handleDeleteProfile = (id: string, username: string) => {
    Alert.alert(
      'Remove Profile',
      `Are you sure you want to remove ${username}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeProfile(id) }
      ]
    );
  };

  const openAddModal = (platform: PlatformId) => {
    setSelectedPlatform(platform);
    setModalVisible(true);
  };

  // Get platforms that haven't been added yet
  const availablePlatforms = Object.values(PLATFORMS).filter(
    platform => !profiles.some(p => p.platformId === platform.id)
  );



  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Header for Settings */}
        <View style={styles.header}>
             <Text style={[styles.headerLabel, { color: colors.text.secondary }]}>PREFERENCES</Text>
             <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Settings</Text>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>APPEARANCE</Text>
          <View style={[styles.cardGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
             <List.Item
              title="Dark Mode"
              description="Switch between light and dark themes"
              titleStyle={{ color: colors.text.primary, fontWeight: '700' }}
              descriptionStyle={{ color: colors.text.secondary }}
              right={() => <Switch value={isDarkMode} onValueChange={toggleTheme} color={colors.primary} />}
            />
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>NOTIFICATIONS</Text>
          <View style={[styles.cardGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <List.Item
              title="Contest Reminders"
              description="Get notified before contests start"
              titleStyle={{ color: colors.text.primary, fontWeight: '700' }}
              descriptionStyle={{ color: colors.text.secondary }}
              right={() => <Switch value={notificationsEnabled} onValueChange={toggleNotifications} color={colors.primary} />}
            />
            <Divider style={{ backgroundColor: colors.border, height: 1 }} />
            <List.Item
              title="15 minutes before"
              titleStyle={{ color: colors.text.primary, fontWeight: '600', fontSize: 13 }}
              right={() => <Switch value={reminderIntervals.includes(15)} onValueChange={() => toggleInterval(15)} color={colors.primary} disabled={!notificationsEnabled} />}
            />
            <Divider style={{ backgroundColor: colors.border, height: 1 }} />
            <List.Item
              title="1 hour before"
              titleStyle={{ color: colors.text.primary, fontWeight: '600', fontSize: 13 }}
              right={() => <Switch value={reminderIntervals.includes(60)} onValueChange={() => toggleInterval(60)} color={colors.primary} disabled={!notificationsEnabled} />}
            />
             <Divider style={{ backgroundColor: colors.border, height: 1 }} />
            <List.Item
              title="Background Sync"
              description="Check for new contests periodically"
              titleStyle={{ color: colors.text.primary, fontWeight: '700', fontSize: 13 }}
              descriptionStyle={{ color: colors.text.secondary }}
              right={() => <Switch value={backgroundSyncEnabled} onValueChange={toggleBackgroundSync} color={colors.primary} />}
            />
          </View>
        </View>

        {/* Connected Profiles Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>CONNECTED PROFILES</Text>
          {profiles.length === 0 ? (
            <View style={[styles.emptyCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <Text style={[styles.emptyText, { color: colors.text.secondary }]}>No profiles connected yet.</Text>
            </View>
          ) : (
            profiles.map(profile => (
              <View key={profile.id} style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.primary }]}>
                  <View style={styles.profileRow}>
                    <View style={styles.profileInfo}>
                        <View style={[styles.platformBadge, { backgroundColor: PLATFORMS[profile.platformId].color }]}>
                            <Text style={[styles.platformBadgeText, { color: '#FFF' }]}>
                                {PLATFORMS[profile.platformId].name.toUpperCase()}
                            </Text>
                        </View>
                        <Text style={[styles.username, { color: colors.text.primary }]}>@{profile.username}</Text>
                    </View>
                    <View style={styles.profileStats}>
                        <Text style={[styles.rating, { color: PLATFORMS[profile.platformId].color }]}>{profile.rating || '-'}</Text>
                        <Text style={[styles.solvedCount, { color: colors.text.secondary }]}>RATING</Text>
                    </View>
                  </View>
                  <Divider style={{ marginVertical: 10, backgroundColor: colors.surfaceHighlight }} />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                       <Text style={{ color: colors.text.secondary, fontSize: 12, fontWeight: '700' }}>
                           {profile.problemsSolved} Problems Solved
                       </Text>
                       <IconButton 
                        icon="delete-outline" 
                        size={20} 
                        iconColor={colors.status.error}
                        onPress={() => handleDeleteProfile(profile.id, profile.username)}
                        style={{ margin: 0 }}
                      />
                  </View>
              </View>
            ))
          )}
        </View>

        {/* Add Profile Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>ADD PROFILE</Text>
          <View style={styles.platformGrid}>
            {availablePlatforms.map(platform => (
              <Card 
                key={platform.id} 
                style={[
                    styles.platformCard, 
                    { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.border }
                ]}
                onPress={() => openAddModal(platform.id)}
              >
                <Card.Content style={styles.platformCardContent}>
                  <Text style={[styles.platformName, { color: platform.color }]}>
                    {platform.name}
                  </Text>
                  <IconButton icon="plus" size={20} iconColor={colors.text.primary} />
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>

        {/* App Info Footer */}
        <View style={styles.footer}>
           <Text style={[styles.appName, { color: colors.primary }]}>KRONO</Text>
           <Text style={[styles.version, { color: colors.text.disabled }]}>v1.0.0 • Built with Expo</Text>
        </View>
        
      </ScrollView>

      {/* Add Profile Modal */}
      <Portal>
        <Modal 
          visible={modalVisible} 
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={[
              styles.modal, 
              { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.primary }
          ]}
        >
          <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
            Link {selectedPlatform ? PLATFORMS[selectedPlatform].name : ''}
          </Text>
          <Text style={{ color: colors.text.secondary, marginBottom: 20 }}>
              Enter your username to sync stats.
          </Text>
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            style={[styles.input, { backgroundColor: colors.background }]}
            mode="outlined"
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            textColor={colors.text.primary}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View style={styles.modalActions}>
            <Button 
              mode="text" 
              onPress={() => setModalVisible(false)}
              textColor={colors.text.secondary}
              labelStyle={{ fontWeight: '700' }}
            >
              CANCEL
            </Button>
            <Button 
              mode="contained" 
              onPress={handleAddProfile}
              loading={isLoading}
              disabled={!username.trim()}
              buttonColor={colors.primary}
              textColor={colors.text.inverse}
              style={{ borderRadius: 4 }}
              labelStyle={{ fontWeight: '700' }}
            >
              CONNECT
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 60, // Safe area equivalent
    paddingBottom: 40,
  },
  header: {
      marginBottom: 30
  },
  headerLabel: {
      fontSize: 12,
      fontWeight: '900',
      letterSpacing: 2,
      marginBottom: 4
  },
  headerTitle: {
      fontSize: 42, // Massive
      fontWeight: '900',
      lineHeight: 42,
      letterSpacing: -1
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 12,
    letterSpacing: 1.5,
    opacity: 0.7
  },
  cardGroup: {
      borderRadius: 8,
      borderWidth: 2,
      overflow: 'hidden',
      
      // Hard Shadow
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 0,
  },
  emptyCard: {
      padding: 20,
      borderRadius: 8,
      borderWidth: 2,
      borderStyle: 'dashed',
      alignItems: 'center'
  },
  profileCard: {
    marginBottom: 16, 
    borderRadius: 8,
    borderWidth: 2,
    padding: 16,
    
    // Hard Shadow
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileInfo: {
    flex: 1,
  },
  platformBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8
  },
  platformBadgeText: {
      fontSize: 10,
      fontWeight: '900',
      letterSpacing: 0.5
  },
  username: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  profileStats: {
    alignItems: 'flex-end',
  },
  rating: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -1
  },
  solvedCount: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 2
  },
  emptyText: {
    textAlign: 'center',
  },
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  platformCard: {
    width: '48%',
    borderRadius: 8,
    borderWidth: 2,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    marginBottom: 4,
  },
  platformCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  platformName: {
    fontWeight: '900',
    fontSize: 14
  },
  footer: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
      opacity: 0.5
  },
  appName: {
      fontSize: 16,
      fontWeight: '900',
      letterSpacing: 2
  },
  version: {
      fontSize: 12,
      marginTop: 4
  },
  modal: {
    padding: 24,
    margin: 20,
    borderRadius: 12,
    borderWidth: 2,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
    letterSpacing: -0.5
  },
  input: {
    marginBottom: 20,
    height: 50,
    fontSize: 16
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
});
