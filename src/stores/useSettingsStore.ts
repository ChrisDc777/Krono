import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SettingsState {
  notificationsEnabled: boolean;
  backgroundSyncEnabled: boolean;

  toggleNotifications: (enabled: boolean) => void;
  toggleBackgroundSync: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notificationsEnabled: true,
      backgroundSyncEnabled: true,

      toggleNotifications: (enabled) => set({ notificationsEnabled: enabled }),

      toggleBackgroundSync: (enabled) =>
        set({ backgroundSyncEnabled: enabled }),
    }),
    {
      name: "krono-settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
