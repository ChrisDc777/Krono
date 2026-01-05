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
    // Check if already exists in store
    const id = `${platform}:${handle}`;
    if (get().profiles.find(p => p.id === id)) {
      return; 
    }

    set({ isLoading: true, error: null });

    try {
      let newProfile: UnifiedProfile | null = null;

      if (platform === 'codeforces') {
        const { codeforcesApi } = await import('../api/codeforces');
        const { normalizeCodeforcesProfile } = await import('../services/dataNormalizer');

        // Fetch data in parallel
        const [userInfo, ratingHistory, submissions] = await Promise.all([
          codeforcesApi.getUserInfo(handle),
          codeforcesApi.getUserRating(handle).catch(() => []), // Handle might have no history
          codeforcesApi.getUserSubmissions(handle).catch(() => [])
        ]);

        newProfile = normalizeCodeforcesProfile(userInfo, ratingHistory, submissions);
      } 
      // Add other platforms here...

      if (newProfile) {
        await saveProfile(newProfile);
        set(state => ({ 
          profiles: [...state.profiles, newProfile],
          isLoading: false
        }));
      } else {
        throw new Error(`Platform ${platform} not yet implemented`);
      }

    } catch (error: any) {
      console.error('Failed to add profile:', error);
      set({ 
        error: error.message || 'Failed to add profile', 
        isLoading: false 
      });
    }
  },

  refreshProfile: async (id: string) => {
    // TODO: Implement actual refresh logic 
  },

  refreshAllProfiles: async () => {
    const { profiles, refreshProfile } = get();
    await Promise.all(profiles.map(p => refreshProfile(p.id)));
  }
}));
