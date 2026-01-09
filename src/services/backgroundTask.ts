import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { useContestStore } from '../stores/useContestStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { notificationService } from './notificationService';

export const BACKGROUND_SYNC_TASK = 'BACKGROUND_SYNC_TASK';

TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    const { backgroundSyncEnabled } = useSettingsStore.getState();
    if (!backgroundSyncEnabled) {
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    console.log('[BackgroundFetch] Starting contest sync...');
    
    // 1. Fetch latest contests
    // We use the store's sync action which handles DB + API logic
    const { syncContests, upcomingContests } = useContestStore.getState();
    await syncContests();

    // 2. Schedule reminders for the newly fetched data
    // We re-read the store to get the latest list (syncContests updates the store)
    // Note: upcomingContests might not be immediately updated in the same closure if using hook selectors, 
    // but getState() gets the fresh state.
    const latestContests = useContestStore.getState().upcomingContests;
    
    if (latestContests.length > 0) {
        await notificationService.scheduleAllReminders(latestContests);
        console.log(`[BackgroundFetch] Scheduled reminders for ${latestContests.length} contests.`);
        return BackgroundFetch.BackgroundFetchResult.NewData;
    }

    return BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    console.error('[BackgroundFetch] Failed to sync:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const registerBackgroundTask = async () => {
    try {
        const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);
        if (!isRegistered) {
            await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
                minimumInterval: 60 * 60 * 6, // 6 hours
                stopOnTerminate: false, // Continue even if app is closed (Android)
                startOnBoot: true, // Restart on boot (Android)
            });
            console.log('[BackgroundFetch] Task registered');
        }
    } catch (e) {
        // Just log in dev, don't warn loudly as this is expected in Expo Go
        console.log('Background fetch registration failed (Normal in Expo Go):', e);
    }
};
