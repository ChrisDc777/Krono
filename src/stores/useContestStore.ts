import { create } from 'zustand';
import { getUpcomingContests, saveContest, saveContests } from '../database/repositories/contestRepository';
import { Contest } from '../types/contest';

interface ContestState {
  upcomingContests: Contest[];
  isLoading: boolean;
  error: string | null;
  lastSyncTime: Date | null;
  
  // Actions
  loadContests: () => Promise<void>;
  syncContests: () => Promise<void>;
  toggleReminder: (contestId: string, enable: boolean) => Promise<void>;
}

export const useContestStore = create<ContestState>((set, get) => ({
  upcomingContests: [],
  isLoading: false,
  error: null,
  lastSyncTime: null,

  loadContests: async () => {
    set({ isLoading: true });
    try {
      const contests = await getUpcomingContests();
      set({ upcomingContests: contests, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load contests', isLoading: false });
    }
  },

  syncContests: async () => {
    set({ isLoading: true, error: null });
    try {
      // 1. Fetch from Codeforces
      const { codeforcesApi } = await import('../api/codeforces');
      const { normalizeCodeforcesContest } = await import('../services/dataNormalizer');
      
      const cfContestsRaw = await codeforcesApi.getContestList();
      const cfContests = cfContestsRaw.map(normalizeCodeforcesContest);

      // 2. Add other platforms...

      // 3. Save to DB (local cache)
      await saveContests(cfContests);
      
      // 4. Reload from DB to get the sorted, filtered list
      const upcoming = await getUpcomingContests();
      
      set({ 
        upcomingContests: upcoming, 
        isLoading: false, 
        lastSyncTime: new Date() 
      });
    } catch (error: any) {
      console.error('Failed to sync contests:', error);
      set({ 
        error: error.message || 'Failed to sync contests', 
        isLoading: false 
      });
    }
  },

  toggleReminder: async (contestId: string, enable: boolean) => {
    const { upcomingContests } = get();
    const contest = upcomingContests.find(c => c.id === contestId);
    
    if (contest) {
      let updatedContest = { ...contest };
      
      // Load Notification Service dynamically
      const { notificationService } = await import('../services/notificationService');

      if (enable) {
        // Schedule
        const notificationId = await notificationService.scheduleContestReminder(contest);
        // Note: In a real app we'd track multiple reminders. 
        // For simplicity, we just assume one reminder at 15m before.
        updatedContest.reminderSet = true;
        // logic to save notificationId to contest...
      } else {
        // Cancel logic here if we saved the ID
        updatedContest.reminderSet = false;
      }

      await saveContest(updatedContest);
      
      set(state => ({
        upcomingContests: state.upcomingContests.map(c => 
          c.id === contestId ? updatedContest : c
        )
      }));
    }
  }
}));
