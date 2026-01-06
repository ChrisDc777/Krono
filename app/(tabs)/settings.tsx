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
import { typography } from '../../src/theme/typography';
import { PLATFORMS, PlatformId } from '../../src/types/platform';

export default function SettingsScreen() {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { profiles, addProfile, removeProfile, isLoading } = useProfileStore();
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
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Settings</Text>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Appearance</Text>
          <Card style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
             <List.Item
              title="Dark Mode"
              description="Switch between light and dark themes"
              titleStyle={{ color: colors.text.primary }}
              descriptionStyle={{ color: colors.text.secondary }}
              right={() => <Switch value={isDarkMode} onValueChange={toggleTheme} color={colors.primary} />}
            />
          </Card>
        </View>

        {/* Connected Profiles Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Connected Profiles</Text>
          {profiles.length === 0 ? (
            <Card style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Card.Content>
                <Text style={[styles.emptyText, { color: colors.text.secondary }]}>No profiles connected yet.</Text>
              </Card.Content>
            </Card>
          ) : (
            profiles.map(profile => (
              <Card key={profile.id} style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.secondary }]}>
                <Card.Content style={styles.profileRow}>
                  <View style={styles.profileInfo}>
                    <Text style={[styles.platformBadge, { color: PLATFORMS[profile.platformId].color }]}>
                      {PLATFORMS[profile.platformId].name}
                    </Text>
                    <Text style={[styles.username, { color: colors.text.primary }]}>{profile.username}</Text>
                  </View>
                  <View style={styles.profileStats}>
                    <Text style={[styles.rating, { color: colors.accent }]}>{profile.rating}</Text>
                    <Text style={[styles.solvedCount, { color: colors.text.secondary }]}>{profile.problemsSolved} solved</Text>
                  </View>
                  <IconButton 
                    icon="delete" 
                    size={20} 
                    iconColor={colors.status.error}
                    onPress={() => handleDeleteProfile(profile.id, profile.username)}
                  />
                </Card.Content>
              </Card>
            ))
          )}
        </View>

        {/* Add Profile Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Add Platform</Text>
          <View style={styles.platformGrid}>
            {availablePlatforms.map(platform => (
              <Card 
                key={platform.id} 
                style={[styles.platformCard, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.accent }]}
                onPress={() => openAddModal(platform.id)}
              >
                <Card.Content style={styles.platformCardContent}>
                  <Text style={[styles.platformName, { color: platform.color }]}>
                    {platform.name}
                  </Text>
                  <IconButton icon="plus" size={20} iconColor={colors.primary} />
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Notifications</Text>
          <Card style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <List.Item
              title="Contest Reminders"
              description="Get notified before contests start"
              titleStyle={{ color: colors.text.primary }}
              descriptionStyle={{ color: colors.text.secondary }}
              right={() => <Switch value={true} color={colors.primary} />}
            />
            <Divider style={{ backgroundColor: colors.surfaceHighlight }} />
            <List.Item
              title="15 minutes before"
              titleStyle={{ color: colors.text.primary }}
              right={() => <Switch value={true} color={colors.primary} />}
            />
            <Divider style={{ backgroundColor: colors.surfaceHighlight }} />
            <List.Item
              title="1 hour before"
              titleStyle={{ color: colors.text.primary }}
              right={() => <Switch value={false} color={colors.primary} />}
            />
            <Divider style={{ backgroundColor: colors.surfaceHighlight }} />
            <List.Item
              title="1 day before"
              titleStyle={{ color: colors.text.primary }}
              right={() => <Switch value={false} color={colors.primary} />}
            />
          </Card>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>About</Text>
          <Card style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Card.Content>
              <Text style={[styles.appName, { color: colors.primary }]}>Krono</Text>
              <Text style={[styles.appTagline, { color: colors.text.secondary }]}>Never miss a contest again.</Text>
              <Text style={[styles.version, { color: colors.text.disabled }]}>Version 1.0.0</Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {/* Add Profile Modal */}
      <Portal>
        <Modal 
          visible={modalVisible} 
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
            Add {selectedPlatform ? PLATFORMS[selectedPlatform].name : ''} Profile
          </Text>
          <TextInput
            label="Username / Handle"
            value={username}
            onChangeText={setUsername}
            style={[styles.input, { backgroundColor: colors.background }]}
            mode="outlined"
            outlineColor={colors.surfaceHighlight}
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
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleAddProfile}
              loading={isLoading}
              disabled={!username.trim()}
              buttonColor={colors.primary}
              textColor={colors.text.inverse}
            >
              Add
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
    paddingTop: 50,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: typography.size.xxl,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  card: {
    borderRadius: 4,
    borderWidth: 2,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    marginBottom: 4,
    marginRight: 4
  },
  profileCard: {
    marginBottom: 16, 
    borderRadius: 4,
    borderWidth: 2,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    marginRight: 4
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  platformBadge: {
    fontSize: typography.size.xs,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    fontSize: typography.size.lg,
    fontWeight: 'bold',
  },
  profileStats: {
    alignItems: 'flex-end',
  },
  rating: {
    fontSize: typography.size.xl,
    fontWeight: 'bold',
  },
  solvedCount: {
    fontSize: typography.size.xs,
  },
  emptyText: {
    textAlign: 'center',
  },
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  platformCard: {
    width: '48%',
    borderRadius: 4,
    borderWidth: 2,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    marginBottom: 10,
    marginRight: 4
  },
  platformCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  platformName: {
    fontWeight: 'bold',
  },
  appName: {
    fontSize: typography.size.xl,
    fontWeight: 'bold',
  },
  appTagline: {
    fontSize: typography.size.md,
    marginTop: 4,
  },
  version: {
    fontSize: typography.size.sm,
    marginTop: 10,
  },
  modal: {
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: typography.size.lg,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
});
