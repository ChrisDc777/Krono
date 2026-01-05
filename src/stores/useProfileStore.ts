import { create } from 'zustand';
import { getAllProfiles, saveProfile } from '../database/repositories/profileRepository';
import { PlatformId } from '../types/platform';
import { UnifiedProfile } from '../types/user';

interface ProfileState {
  profiles: UnifiedProfile[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadProfiles: () => Promise<void>;
  addProfile: (platform: PlatformId, handle: string) => Promise<void>;
  refreshProfile: (id: string) => Promise<void>;
  refreshAllProfiles: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profiles: [],
  isLoading: false,
  error: null,

  loadProfiles: async () => {
    set({ isLoading: true });
    try {
      const profiles = await getAllProfiles();
      set({ profiles, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load profiles', isLoading: false });
    }
  },

  addProfile: async (platform: PlatformId, handle: string) => {
    // Placeholder: Fetch from API integration later
    // For now we'll just simulate adding a user
    
    // Check if already exists
    const id = `${platform}:${handle}`;
    if (get().profiles.find(p => p.id === id)) {
      return; 
    }

    // TODO: Call actual API here
    const newProfile: UnifiedProfile = {
      id,
      platformId: platform,
      username: handle,
      displayName: handle, // Default
      rating: 0,
      maxRating: 0,
      problemsSolved: 0,
      totalSubmissions: 0,
      badges: [],
      lastUpdated: new Date(),
      isStale: false
    };

    await saveProfile(newProfile);
    set(state => ({ profiles: [...state.profiles, newProfile] }));
  },

  refreshProfile: async (id: string) => {
    // TODO: Implement actual refresh logic 
  },

  refreshAllProfiles: async () => {
    const { profiles, refreshProfile } = get();
    await Promise.all(profiles.map(p => refreshProfile(p.id)));
  }
}));
