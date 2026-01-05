import * as Notifications from 'expo-notifications';
import { colors } from '../theme/colors';
import { Contest } from '../types/contest';

// Set notification handler - may fail silently in Expo Go
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch (e) {
  console.warn('Notification handler not available (Expo Go limitation)');
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

  scheduleContestReminder: async (contest: Contest): Promise<string | null> => {
    try {
      const hasPermission = await notificationService.requestPermissions();
      if (!hasPermission) return null;

      // Schedule for 15 minutes before
      const triggerDate = new Date(contest.startTime.getTime() - 15 * 60 * 1000);
      
      // Don't schedule if already passed
      if (triggerDate.getTime() < Date.now()) return null;

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: `Upcoming Contest: ${contest.name}`,
          body: `Starts in 15 minutes on ${contest.platformId}!`,
          data: { contestId: contest.id },
          color: colors.primary,
        },
        trigger: {
          date: triggerDate,
          type: Notifications.SchedulableTriggerInputTypes.DATE,
        } as any,
      });

      return id;
    } catch (error) {
      console.warn('Failed to schedule notification (Expo Go limitation):', error);
      return null;
    }
  },

  cancelReminder: async (notificationId: string): Promise<void> => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.warn('Failed to cancel notification:', error);
    }
  }
};
