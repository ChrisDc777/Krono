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
import { useProfileStore } from '../../src/stores/useProfileStore';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { PLATFORMS, PlatformId } from '../../src/types/platform';

export default function SettingsScreen() {
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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <Text style={styles.headerTitle}>Settings</Text>

        {/* Connected Profiles Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Profiles</Text>
          {profiles.length === 0 ? (
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.emptyText}>No profiles connected yet.</Text>
              </Card.Content>
            </Card>
          ) : (
            profiles.map(profile => (
              <Card key={profile.id} style={styles.profileCard}>
                <Card.Content style={styles.profileRow}>
                  <View style={styles.profileInfo}>
                    <Text style={[styles.platformBadge, { color: PLATFORMS[profile.platformId].color }]}>
                      {PLATFORMS[profile.platformId].name}
                    </Text>
                    <Text style={styles.username}>{profile.username}</Text>
                  </View>
                  <View style={styles.profileStats}>
                    <Text style={styles.rating}>{profile.rating}</Text>
                    <Text style={styles.solvedCount}>{profile.problemsSolved} solved</Text>
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
          <Text style={styles.sectionTitle}>Add Platform</Text>
          <View style={styles.platformGrid}>
            {availablePlatforms.map(platform => (
              <Card 
                key={platform.id} 
                style={styles.platformCard}
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
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Card style={styles.card}>
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
          <Text style={styles.sectionTitle}>About</Text>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.appName}>Krono</Text>
              <Text style={styles.appTagline}>Never miss a contest again.</Text>
              <Text style={styles.version}>Version 1.0.0</Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {/* Add Profile Modal */}
      <Portal>
        <Modal 
          visible={modalVisible} 
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>
            Add {selectedPlatform ? PLATFORMS[selectedPlatform].name : ''} Profile
          </Text>
          <TextInput
            label="Username / Handle"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
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
    backgroundColor: colors.background,
    paddingTop: 50,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: typography.size.xxl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 15,
  },
  card: {
    backgroundColor: colors.surface,
  },
  profileCard: {
    backgroundColor: colors.surface,
    marginBottom: 10,
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
    color: colors.text.primary,
  },
  profileStats: {
    alignItems: 'flex-end',
  },
  rating: {
    fontSize: typography.size.xl,
    fontWeight: 'bold',
    color: colors.accent,
  },
  solvedCount: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
  },
  emptyText: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  platformCard: {
    backgroundColor: colors.surface,
    width: '48%',
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
    color: colors.primary,
  },
  appTagline: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
    marginTop: 4,
  },
  version: {
    fontSize: typography.size.sm,
    color: colors.text.disabled,
    marginTop: 10,
  },
  modal: {
    backgroundColor: colors.surface,
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: typography.size.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
    backgroundColor: colors.background,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
});
