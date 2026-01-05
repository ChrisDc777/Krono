import axios from 'axios';

const KENKOOO_BASE_URL = 'https://kenkoooo.com/atcoder/atcoder-api';
const ATCODER_BASE_URL = 'https://atcoder.jp';

export const atcoderApi = {
  /**
   * Returns information about upcoming contests.
   * Uses Kenkoooo's resources/contests.json
   */
  getContestList: async () => {
    try {
      const response = await axios.get('https://kenkoooo.com/atcoder/resources/contests.json');
      const allContests = response.data;
      
      // Filter for future contests
      const nowSeconds = Math.floor(Date.now() / 1000);
      let upcoming = allContests.filter((c: any) => c.start_epoch_second > nowSeconds);
      
      // If no upcoming contests (e.g. user is in the future relative to API data), 
      // generate synthetic forecasts based on the last known contest.
      if (upcoming.length === 0 && allContests.length > 0) {
        // Sort by start time to find the absolute last one
        const sorted = [...allContests].sort((a: any, b: any) => a.start_epoch_second - b.start_epoch_second);
        const lastContest = sorted[sorted.length - 1];
        
        // Only generate if the last contest is somewhat recent (or we are just ahead of it)
        // Let's generate 4 weeks of contests
        const forecasts = [];
        let nextStart = lastContest.start_epoch_second;
        let lastIdNum = parseInt(lastContest.id.replace(/\D/g, '')) || 0;
        let idPrefix = lastContest.id.replace(/[0-9]/g, '') || 'abc';
        
        // Ensure we start after NOW
        while (nextStart <= nowSeconds) {
            nextStart += 7 * 24 * 60 * 60; // Add 7 days
            lastIdNum++;
        }

        for (let i = 0; i < 5; i++) {
            forecasts.push({
                id: `${idPrefix}${lastIdNum + i}`,
                start_epoch_second: nextStart + (i * 7 * 24 * 60 * 60),
                duration_second: lastContest.duration_second || 6000,
                title: `(Forecast) ${lastContest.title.replace(/[0-9]+/g, (lastIdNum + i).toString())}`,
                rate_change: lastContest.rate_change
            });
        }
        upcoming = forecasts;
      }
      
      return upcoming;
    } catch (error) {
      console.error('AtCoder getContestList error:', error);
      throw error;
    }
  },

  /**
   * Returns information about a user.
   * Combines data from AtCoder's hidden history API and Kenkoooo's V2 user info API.
   */
  getUserInfo: async (handle: string) => {
    try {
      // Fetch in parallel
      const [historyResponse, kenkooooResponse] = await Promise.allSettled([
        axios.get(`${ATCODER_BASE_URL}/users/${handle}/history/json`),
        axios.get(`${KENKOOO_BASE_URL}/v2/user_info?user=${handle}`)
      ]);

      // Process History (for Rating and Max Rating)
      let rating = 0;
      let maxRating = 0;
      let historyData: any[] = [];
      
      if (historyResponse.status === 'fulfilled' && historyResponse.value.data) {
        historyData = historyResponse.value.data;
        if (Array.isArray(historyData) && historyData.length > 0) {
          // Get current rating from the last entry
          // AtCoder history is usually sorted by date
          const lastEntry = historyData[historyData.length - 1];
          rating = lastEntry.NewRating;
          
          // Calculate max rating
          maxRating = historyData.reduce((max, entry) => Math.max(max, entry.NewRating), 0);
        }
      } else if (historyResponse.status === 'rejected') {
        console.warn('AtCoder history fetch failed:', historyResponse.reason);
        // If history fails (e.g. 404), user might not exist or has no history
      }

      // Process Kenkoooo Data (for Problems Solved)
      let problemsSolved = 0;
      if (kenkooooResponse.status === 'fulfilled' && kenkooooResponse.value.data) {
        problemsSolved = kenkooooResponse.value.data.accepted_count || 0;
      }

      // If both failed, throw error
      if (historyResponse.status === 'rejected' && kenkooooResponse.status === 'rejected') {
        throw new Error('Failed to fetch AtCoder user data');
      }

      return {
        handle,
        rating,
        maxRating,
        problemsSolved,
        // AtCoder doesn't provide a simple avatar URL without scraping the HTML page. 
        // We can leave it undefined for now or use a default.
        avatar: undefined, 
        rank: undefined // Global rank is hard to get via API
      };

    } catch (error) {
      console.error('AtCoder getUserInfo error:', error);
      throw error;
    }
  }
};
