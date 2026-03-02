import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
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
    useTheme,
} from "react-native-paper";
import { notificationService } from "../../src/services/notificationService";
import { useOnboardingStore } from "../../src/stores/useOnboardingStore";
import { useProfileStore } from "../../src/stores/useProfileStore";
import { useSettingsStore } from "../../src/stores/useSettingsStore";
import { useThemeStore } from "../../src/stores/useThemeStore";
import { PLATFORMS, PlatformId } from "../../src/types/platform";

export default function SettingsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { profiles, addProfile, removeProfile, isLoading } = useProfileStore();
  const { resetOnboarding } = useOnboardingStore();
  const {
    notificationsEnabled,
    backgroundSyncEnabled,
    toggleNotifications,
    toggleBackgroundSync,
  } = useSettingsStore();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId | null>(
    null,
  );
  const [username, setUsername] = useState("");

  const handleAddProfile = async () => {
    if (!selectedPlatform || !username.trim()) {
      return;
    }
    await addProfile(selectedPlatform, username.trim());
    setDialogVisible(false);
    setUsername("");
    setSelectedPlatform(null);
  };

  const openAddDialog = (platform: PlatformId) => {
    setSelectedPlatform(platform);
    setDialogVisible(true);
  };

  // Get platforms that haven't been added yet
  const availablePlatforms = Object.values(PLATFORMS).filter(
    (platform) => !profiles.some((p) => p.platformId === platform.id),
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header
        style={{ backgroundColor: colors.background, elevation: 0 }}
      >
        <Appbar.Content title="Settings" titleStyle={{ fontWeight: "800" }} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Appearance */}
        <View style={styles.sectionContainer}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Appearance
          </Text>
          <Card style={styles.card} mode="elevated" elevation={1}>
            <List.Item
              title="Dark Mode"
              left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
              right={() => (
                <Switch value={isDarkMode} onValueChange={toggleTheme} />
              )}
            />
          </Card>
        </View>

        {/* Notifications */}
        <View style={styles.sectionContainer}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Notifications
          </Text>
          <Card style={styles.card} mode="elevated" elevation={1}>
            <List.Item
              title="Enable Notifications"
              left={(props) => <List.Icon {...props} icon="bell-outline" />}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={toggleNotifications}
                />
              )}
            />
            <Divider />
            <View style={{ padding: 16 }}>
              <Button
                mode="outlined"
                icon="bell-ring"
                onPress={() => notificationService.sendTestNotification()}
              >
                Send Test Notification
              </Button>
            </View>
          </Card>
        </View>

        {/* Sync */}
        <View style={styles.sectionContainer}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Sync
          </Text>
          <Card style={styles.card} mode="elevated" elevation={1}>
            <List.Item
              title="Background Sync"
              description="Periodically fetch contests"
              left={(props) => <List.Icon {...props} icon="sync" />}
              right={() => (
                <Switch
                  value={backgroundSyncEnabled}
                  onValueChange={toggleBackgroundSync}
                />
              )}
            />
          </Card>
        </View>

        {/* Connected Profiles */}
        <View style={styles.sectionContainer}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Connected Profiles
          </Text>
          <Surface style={styles.settingsCard} elevation={1}>
            <View style={styles.profileList}>
              {profiles.length === 0 ? (
                <Text
                  variant="bodyMedium"
                  style={{
                    fontStyle: "italic",
                    color: colors.outline,
                    textAlign: "center",
                    marginVertical: 12,
                  }}
                >
                  No profiles connected yet.
                </Text>
              ) : (
                profiles.map((profile) => {
                  const platformConfig = PLATFORMS[profile.platformId];
                  let platformColor = platformConfig?.color || colors.primary;
                  if (profile.platformId === "atcoder" && !isDarkMode) {
                    platformColor = "#000000";
                  }

                  return (
                    <View
                      key={profile.id}
                      style={[
                        styles.profileRow,
                        { borderLeftColor: platformColor },
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          variant="titleSmall"
                          style={{ fontWeight: "bold" }}
                        >
                          {profile.username}
                        </Text>
                        <Text
                          variant="bodySmall"
                          style={{ color: colors.secondary }}
                        >
                          {platformConfig?.name} •{" "}
                          <Text
                            style={{ fontWeight: "700", color: platformColor }}
                          >
                            {profile.rating || "Unrated"}
                          </Text>
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
        <View style={styles.sectionContainer}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Add Profile
          </Text>
          <View style={styles.grid}>
            {availablePlatforms.map((platform) => {
              let platformColor = platform.color;
              if (platform.id === "atcoder" && !isDarkMode) {
                platformColor = "#000000";
              }
              return (
                <Card
                  key={platform.id}
                  style={[styles.platformCard, { borderColor: platformColor }]}
                  onPress={() => openAddDialog(platform.id)}
                  mode="outlined"
                >
                  <Card.Content style={styles.platformCardContent}>
                    <View
                      style={[
                        styles.iconBox,
                        { backgroundColor: platformColor + "20" },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={(platform.icon as any) || "code-tags"}
                        size={20}
                        color={platformColor}
                      />
                    </View>
                    <Text
                      variant="labelLarge"
                      style={{ marginTop: 6, fontWeight: "bold" }}
                    >
                      {platform.name}
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={{ color: colors.outline, fontSize: 10 }}
                    >
                      Connect
                    </Text>
                  </Card.Content>
                </Card>
              );
            })}
          </View>
        </View>

        {/* About */}
        <View style={styles.sectionContainer}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            About
          </Text>
          <Card style={styles.card} mode="elevated" elevation={1}>
            <List.Item
              title="Replay Walkthrough"
              description="See the intro guide again"
              left={(props) => (
                <List.Icon {...props} icon="book-open-page-variant-outline" />
              )}
              onPress={async () => {
                await resetOnboarding();
                router.replace("/onboarding" as any);
              }}
            />
          </Card>
        </View>

        <View style={styles.footer}>
          <Text variant="bodySmall" style={{ color: colors.outline }}>
            v1.1.0 • Krono
          </Text>
          <Text
            variant="bodySmall"
            style={{ color: colors.outline, marginTop: 4 }}
          >
            Made with ❤️ by Meet
          </Text>
        </View>
      </ScrollView>

      {/* Add Profile Dialog */}
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
          style={{ backgroundColor: colors.surface }}
        >
          <Dialog.Title>
            Connect {selectedPlatform ? PLATFORMS[selectedPlatform].name : ""}
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ marginBottom: 12 }}>
              Enter your handle to sync stats.
            </Text>
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
            <Button
              onPress={handleAddProfile}
              loading={isLoading}
              disabled={!username.trim()}
            >
              Connect
            </Button>
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
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  card: {
    paddingVertical: 0,
    borderRadius: 16,
    overflow: "hidden",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  platformCard: {
    width: "48%",
    marginBottom: 0,
    borderRadius: 16,
  },
  platformCardContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 20,
    opacity: 0.5,
  },
  sectionContainer: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontWeight: "700",
    marginBottom: 10,
    marginLeft: 2,
    textTransform: "uppercase",
    fontSize: 11,
    letterSpacing: 0.8,
    opacity: 0.5,
  },
  settingsCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  profileList: {
    padding: 0,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.05)",
    borderLeftWidth: 4,
    backgroundColor: "transparent",
  },
});
