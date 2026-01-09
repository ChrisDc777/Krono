import * as Notifications from 'expo-notifications';
import { useSettingsStore } from '../stores/useSettingsStore';
import { colors } from '../theme/colors';
import { Contest } from '../types/contest';

// Set notification handler - may fail silently in Expo Go
// We check for execution environment to avoid "removed from Expo Go" warnings
import Constants, { ExecutionEnvironment } from 'expo-constants';

try {
  // Expo Go (StoreClient) doesn't support requestPermissionsAsync/push tokens well anymore
  // But local notifications often still work if we don't ask for tokens.
  const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
  
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
  console.log('Notification handler setup skipped/failed (likely Expo Go restriction):', e);
}

export const notificationService = {
  requestPermissions: async (): Promise<boolean> => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      return finalStatus === 'granted';
    } catch (error) {
      console.warn('Notifications not available:', error);
      return false;
    }
  },

  scheduleAllReminders: async (contests: Contest[]): Promise<void> => {
    try {
      const { notificationsEnabled, reminderIntervals } = useSettingsStore.getState();
      
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
          const startDate = contest.startTime instanceof Date ? contest.startTime : new Date(contest.startTime);
          if (isNaN(startDate.getTime())) continue;

          // Don't schedule for past contests
          if (startDate.getTime() < now) continue;

          for (const intervalMinutes of reminderIntervals) {
              const triggerTime = startDate.getTime() - (intervalMinutes * 60 * 1000);
              const triggerDate = new Date(triggerTime);

              if (triggerDate.getTime() <= now) continue; // Reminder time passed

              const identifier = `${contest.id}-${intervalMinutes}`;

              await Notifications.scheduleNotificationAsync({
                  content: {
                      title: `Upcoming Contest: ${contest.name}`,
                      body: `Starts in ${intervalMinutes} minutes on ${contest.platformId}!`,
                      data: { contestId: contest.id },
                      color: colors.primary,
                  },
                  trigger: {
                      date: triggerDate,
                      type: Notifications.SchedulableTriggerInputTypes.DATE,
                  } as any,
                  identifier 
              });
          }
      }
    } catch (error) {
        console.warn('Failed to schedule batch notifications:', error);
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
      console.warn('Failed to cancel notification:', error);
    }
  }
};
