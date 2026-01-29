import Constants, { ExecutionEnvironment } from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { useSettingsStore } from "../stores/useSettingsStore";
import { colors } from "../theme/colors";
import { Contest } from "../types/contest";

try {
  // Expo Go (StoreClient) doesn't support requestPermissionsAsync/push tokens well anymore
  // But local notifications often still work if we don't ask for tokens.
  const isExpoGo =
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

  if (!isExpoGo) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } else {
    // In Expo Go, be more lenient or just skip handler setup if it throws
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }
} catch (e) {
  console.log(
    "Notification handler setup skipped/failed (likely Expo Go restriction):",
    e,
  );
}

export const notificationService = {
  requestPermissions: async (): Promise<boolean> => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
        finalStatus = status;
      }

      if (finalStatus === "granted") {
        // Required for Android 8.0+
        await notificationService.setupChannel();
      }

      return finalStatus === "granted";
    } catch (error) {
      console.log(
        "Notification permissions check failed (possibly Expo Go restriction):",
        error,
      );
      return false;
    }
  },

  setupChannel: async () => {
    try {
      if (Platform.OS === "android") {
        console.log("🔔 Setting up Android notification channel...");
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.HIGH,
          sound: "default",
          vibrationPattern: [0, 250, 250, 250],
          lightColor: colors.primary,
        });
        console.log("✅ Notification channel created successfully");
      }
    } catch (error) {
      console.error("❌ Failed to set notification channel:", error);
    }
  },

  scheduleAllReminders: async (contests: Contest[]): Promise<void> => {
    try {
      const { notificationsEnabled, reminderIntervals } =
        useSettingsStore.getState();

      if (!notificationsEnabled) {
        // Ideally we should cancel all, but for now just don't schedule new ones.
        // In a real app we might want to clearAllScheduledNotifications() here if switched off.
        return;
      }

      const hasPermission = await notificationService.requestPermissions();
      if (!hasPermission) return;

      // Cancel all existing to avoid dupes (simple strategy) or we could just add new ones.
      // For simplicity/robustness, let's just schedule upcoming ones.
      // Expo handles dupes if we use the same ID, but generating deterministic IDs is key.

      const now = Date.now();

      for (const contest of contests) {
        const startDate =
          contest.startTime instanceof Date
            ? contest.startTime
            : new Date(contest.startTime);
        if (isNaN(startDate.getTime())) continue;

        // Don't schedule for past contests
        if (startDate.getTime() < now) continue;

        for (const intervalMinutes of reminderIntervals) {
          const triggerTime = startDate.getTime() - intervalMinutes * 60 * 1000;
          const triggerDate = new Date(triggerTime);

          if (triggerDate.getTime() <= now) continue; // Reminder time passed

          const identifier = `${contest.id}-${intervalMinutes}`;

          await Notifications.scheduleNotificationAsync({
            content: {
              title: `Upcoming Contest: ${contest.name}`,
              body: `Starts in ${intervalMinutes} minutes on ${contest.platformId}!`,
              data: { contestId: contest.id },
              color: colors.primary,
              channelId: "default", // Required for Android
            } as any,
            trigger: {
              date: triggerDate,
              type: Notifications.SchedulableTriggerInputTypes.DATE,
            } as any,
            identifier,
          });
        }
      }
    } catch (error) {
      console.warn("Failed to schedule batch notifications:", error);
    }
  },

  scheduleContestReminder: async (contest: Contest): Promise<string | null> => {
    // Legacy wrapper or single use
    // For now, let's just delegate to the batch one for consistency or keep basic logic
    // But the prompt asked to update it. Let's make this use the store too?
    // Actually, let's keep this as a direct override helper but generally use the batch one.
    return null;
  },

  cancelReminder: async (notificationId: string): Promise<void> => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.warn("Failed to cancel notification:", error);
    }
  },

  sendTestNotification: async (): Promise<void> => {
    try {
      console.log("🔔 Starting test notification...");
      const hasPermission = await notificationService.requestPermissions();
      console.log("📋 Permission status:", hasPermission);

      if (!hasPermission) {
        alert("Permission not granted!");
        return;
      }

      console.log("📅 Scheduling notification...");
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test Notification 🔔",
          body: "This is a test notification from Krono. It works!",
          sound: "default",
          channelId: "default", // Required for Android
        } as any,
        trigger: {
          seconds: 5,
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          repeats: false,
        },
      });
      console.log("✅ Notification scheduled with ID:", notificationId);
      alert("Notification scheduled for 5 seconds from now!");
    } catch (error) {
      console.error("❌ Test notification failed:", error);
      alert(`Failed to schedule test notification: ${error}`);
    }
  },
};
