import { create } from 'zustand';
import { codechefApi } from '../api/codechef';
import { codeforcesApi } from '../api/codeforces';
import { leetcodeApi } from '../api/leetcode';
import { deleteAllProfiles, deleteProfile, getAllProfiles, saveProfile } from '../database/repositories/profileRepository';
import { normalizeCodeChefProfile, normalizeCodeforcesProfile, normalizeLeetCodeProfile } from '../services/dataNormalizer';
import { PlatformId } from '../types/platform';
import { UnifiedProfile } from '../types/user';

interface ProfileState {
  profiles: UnifiedProfile[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadProfiles: () => Promise<void>;
  addProfile: (platform: PlatformId, handle: string) => Promise<void>;
  removeProfile: (id: string) => Promise<void>;
  clearAllProfiles: () => Promise<void>;
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
        // Fetch data in parallel
        const [userInfo, ratingHistory, submissions] = await Promise.all([
          codeforcesApi.getUserInfo(handle),
          codeforcesApi.getUserRating(handle).catch(() => []),
          codeforcesApi.getUserSubmissions(handle, 5000).catch(() => [])
        ]);

        newProfile = normalizeCodeforcesProfile(userInfo, ratingHistory, submissions);
      } else if (platform === 'leetcode') {
        // Fetch profile and contest data in parallel
        const [userData, contestData] = await Promise.all([
          leetcodeApi.getUserProfile(handle),
          leetcodeApi.getUserContestRanking(handle).catch(() => ({ ranking: null, history: [] }))
        ]);

        if (!userData) {
          throw new Error('User not found on LeetCode');
        }

        newProfile = normalizeLeetCodeProfile(userData, contestData);
      } else if (platform === 'codechef') {
        // Scrape user data
        const userData = await codechefApi.getUserInfo(handle);
        if (!userData || !userData.rating) {
           // If scraping completely fails or returns empty data, we might throw or return partial
           // userData is guaranteed to be an object from our api wrapper, but rating might be 0
           if (!userData.name && !userData.rating) throw new Error('User not found or profile hidden');
        }
        newProfile = normalizeCodeChefProfile(userData);
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

  removeProfile: async (id: string) => {
    try {
      await deleteProfile(id);
      set(state => ({
        profiles: state.profiles.filter(p => p.id !== id)
      }));
    } catch (error) {
      console.error('Failed to remove profile:', error);
    }
  },

  clearAllProfiles: async () => {
    try {
      await deleteAllProfiles();
      set({ profiles: [] });
    } catch (error) {
      console.error('Failed to clear profiles:', error);
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


