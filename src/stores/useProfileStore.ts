import { create } from "zustand";
import { atcoderApi } from "../api/atcoder";
import { codechefApi } from "../api/codechef";
import { codeforcesApi } from "../api/codeforces";
import { leetcodeApi } from "../api/leetcode";
import {
    deleteAllProfiles,
    deleteProfile,
    getAllProfiles,
    saveProfile,
} from "../database/repositories/profileRepository";
import {
    normalizeAtCoderProfile,
    normalizeCodeChefProfile,
    normalizeCodeforcesProfile,
    normalizeLeetCodeProfile,
} from "../services/dataNormalizer";
import { PlatformId } from "../types/platform";
import { UnifiedProfile } from "../types/user";

// Cache duration: 15 minutes
const CACHE_TTL_MS = 15 * 60 * 1000;

interface ProfileState {
  profiles: UnifiedProfile[];
  isLoading: boolean;
  error: string | null;
  lastRefreshedAt: number | null; // Unix timestamp of last refresh

  // Actions
  loadProfiles: () => Promise<void>;
  addProfile: (platform: PlatformId, handle: string) => Promise<void>;
  removeProfile: (id: string) => Promise<void>;
  removeAllProfiles: () => Promise<void>;
  refreshProfiles: (force?: boolean) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profiles: [],
  isLoading: false,
  error: null,
  lastRefreshedAt: null,

  loadProfiles: async () => {
    set({ isLoading: true });
    try {
      const profiles = await getAllProfiles();
      set({ profiles, isLoading: false });
    } catch (error) {
      set({ error: "Failed to load profiles", isLoading: false });
    }
  },

  addProfile: async (platform: PlatformId, handle: string) => {
    set({ isLoading: true, error: null });

    try {
      let newProfile: UnifiedProfile;

      if (platform === "codeforces") {
        // Fetch data in parallel
        const [userInfo, ratingHistory, submissions] = await Promise.all([
          codeforcesApi.getUserInfo(handle),
          codeforcesApi.getUserRating(handle).catch(() => []),
          codeforcesApi.getUserSubmissions(handle, 5000).catch(() => []),
        ]);

        newProfile = normalizeCodeforcesProfile(
          userInfo,
          ratingHistory,
          submissions,
        );
      } else if (platform === "leetcode") {
        // Get user profile including stats
        const userData = await leetcodeApi.getUserProfile(handle);

        if (!userData) {
          throw new Error("User not found");
        }

        // Get contest ranking
        let contestData = null;
        try {
          contestData = await leetcodeApi.getUserContestRanking(handle);
        } catch (e) {
          console.warn("Failed to fetch LeetCode contest ranking", e);
        }

        newProfile = normalizeLeetCodeProfile(userData, contestData);
      } else if (platform === "codechef") {
        // Scrape user data
        const userData = await codechefApi.getUserInfo(handle);
        if (!userData || !userData.rating) {
          // If scraping completely fails or returns empty data
          if (!userData.name && !userData.rating)
            throw new Error("User not found or profile hidden");
        }
        newProfile = normalizeCodeChefProfile(userData);
      } else if (platform === "atcoder") {
        const userData = await atcoderApi.getUserInfo(handle);
        // Basic validation: must have handle in result
        if (!userData || !userData.handle) {
          throw new Error(
            "User not found. Note: AtCoder API is case-sensitive.",
          );
        }
        newProfile = normalizeAtCoderProfile(userData);
      } else {
        throw new Error("Platform not implemented yet");
      }

      await saveProfile(newProfile);

      // Reload from DB to ensure sync
      const profiles = await getAllProfiles();
      set({ profiles, isLoading: false, lastRefreshedAt: Date.now() });
    } catch (error: any) {
      console.error("Add Profile Error:", error);
      set({
        error: error.message || "Failed to add profile",
        isLoading: false,
      });
    }
  },

  removeProfile: async (id: string) => {
    try {
      await deleteProfile(id);
      set((state) => ({
        profiles: state.profiles.filter((p) => p.id !== id),
      }));
    } catch (error) {
      console.error("Failed to remove profile:", error);
    }
  },

  removeAllProfiles: async () => {
    try {
      await deleteAllProfiles();
      set({ profiles: [], lastRefreshedAt: null });
    } catch (error) {
      console.error("Failed to clear profiles:", error);
    }
  },

  refreshProfiles: async (force = false) => {
    const { lastRefreshedAt, profiles } = get();

    // Skip if recently refreshed (within CACHE_TTL_MS) and not forced
    if (
      !force &&
      lastRefreshedAt &&
      Date.now() - lastRefreshedAt < CACHE_TTL_MS
    ) {
      console.log("Profile stats cached — skipping refresh");
      return;
    }

    if (profiles.length === 0) return;

    set({ isLoading: true });

    try {
      // Create an array of promises to fetch updated data for each profile
      await Promise.all(
        profiles.map(async (profile) => {
          try {
            const { platformId, username } = profile;
            let newProfile: UnifiedProfile | null = null;

            if (platformId === "codeforces") {
              const [userInfo, ratingHistory, submissions] = await Promise.all([
                codeforcesApi.getUserInfo(username),
                codeforcesApi.getUserRating(username).catch(() => []),
                codeforcesApi
                  .getUserSubmissions(username, 5000)
                  .catch(() => []),
              ]);
              newProfile = normalizeCodeforcesProfile(
                userInfo,
                ratingHistory,
                submissions,
              );
            } else if (platformId === "leetcode") {
              const userData = await leetcodeApi.getUserProfile(username);
              if (userData) {
                const contestData = await leetcodeApi
                  .getUserContestRanking(username)
                  .catch(() => null);
                newProfile = normalizeLeetCodeProfile(userData, contestData);
              }
            } else if (platformId === "codechef") {
              const userData = await codechefApi.getUserInfo(username);
              if (userData) {
                newProfile = normalizeCodeChefProfile(userData);
              }
            } else if (platformId === "atcoder") {
              const userData = await atcoderApi.getUserInfo(username);
              if (userData) {
                newProfile = normalizeAtCoderProfile(userData);
              }
            }

            if (newProfile) {
              await saveProfile(newProfile);
            }
          } catch (err) {
            console.error(`Failed to refresh profile ${profile.id}:`, err);
            // Continue with other profiles even if one fails
          }
        }),
      );

      // Reload updated data from DB
      const updatedProfiles = await getAllProfiles();
      set({
        profiles: updatedProfiles,
        isLoading: false,
        lastRefreshedAt: Date.now(),
      });
    } catch (error) {
      console.error("Global refresh error:", error);
      set({ isLoading: false });
    }
  },
}));
