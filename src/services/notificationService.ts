import * as Notifications from 'expo-notifications';
import { colors } from '../theme/colors';
import { Contest } from '../types/contest';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notificationService = {
  requestPermissions: async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      return false;
    }
    return true;
  },

  scheduleContestReminder: async (contest: Contest): Promise<string | null> => {
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
      } as any, // Cast to any to bypass strict type check for now if version mismatch
    });

    return id;
  },

  cancelReminder: async (notificationId: string) => {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
};
