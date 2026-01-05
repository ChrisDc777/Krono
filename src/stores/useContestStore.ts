import { create } from 'zustand';
import { getUpcomingContests, saveContest } from '../database/repositories/contestRepository';
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
    set({ isLoading: true });
    try {
      // TODO: Call API to fetch contests
      // For now, doing nothing
      
      const contests = await getUpcomingContests();
      set({ upcomingContests: contests, isLoading: false, lastSyncTime: new Date() });
    } catch (error) {
      set({ error: 'Failed to sync contests', isLoading: false });
    }
  },

  toggleReminder: async (contestId: string, enable: boolean) => {
    const { upcomingContests } = get();
    const contest = upcomingContests.find(c => c.id === contestId);
    
    if (contest) {
      const updatedContest = { ...contest, reminderSet: enable };
      await saveContest(updatedContest);
      
      set(state => ({
        upcomingContests: state.upcomingContests.map(c => 
          c.id === contestId ? updatedContest : c
        )
      }));
      
      // TODO: Schedule/Cancel Local Notification
    }
  }
}));
