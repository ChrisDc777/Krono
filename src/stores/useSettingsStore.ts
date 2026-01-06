import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingsState {
  notificationsEnabled: boolean;
  reminderIntervals: number[]; // e.g., [15, 60] for 15m and 1h
  backgroundSyncEnabled: boolean;
  
  toggleNotifications: (enabled: boolean) => void;
  toggleInterval: (minutes: number) => void;
  toggleBackgroundSync: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notificationsEnabled: true,
      reminderIntervals: [15], // Default 15 minutes before
      backgroundSyncEnabled: true,

      toggleNotifications: (enabled) => set({ notificationsEnabled: enabled }),
      
      toggleInterval: (minutes) => set((state) => {
        const exists = state.reminderIntervals.includes(minutes);
        if (exists) {
            return { reminderIntervals: state.reminderIntervals.filter(m => m !== minutes) };
        } else {
            return { reminderIntervals: [...state.reminderIntervals, minutes] };
        }
      }),

      toggleBackgroundSync: (enabled) => set({ backgroundSyncEnabled: enabled }),
    }),
    {
      name: 'krono-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
