import axios from 'axios';

const BASE_URL = 'https://www.codechef.com';

export const codechefApi = {
  /**
   * Returns information about upcoming contests.
   * Uses CodeChef's internal API.
   */
  getContestList: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/list/contests/all`, {
        params: {
          sort_by: 'START',
          sorting_order: 'asc',
          offset: 0,
          mode: 'all'
        },
        headers: {
          // Standard headers to look like a browser if needed, though often not strictly required for this endpoint
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json',
        }
      });
      
      // The API returns { present_contests: [], future_contests: [], past_contests: [] }
      const present = response.data.present_contests || [];
      const future = response.data.future_contests || [];
      
      return [...present, ...future];
    } catch (error) {
      console.error('CodeChef getContestList error:', error);
      throw error;
    }
  },

  /**
   * Returns information about a user.
   * Since there is no official public API, this scrapes the user profile page.
   * Fallback to basic info if scraping is blocked.
   */
  getUserInfo: async (handle: string) => {
    try {
      // NOTE: This is a scraper. It may break if CodeChef changes their UI.
      // We rely on simple string matching (Regex) to avoid heavy DOM parsers.
      const response = await axios.get(`${BASE_URL}/users/${handle}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html',
        }
      });

      const html = response.data as string;
      
      // Extract data using Regex
      // 1. Rating
      const ratingMatch = html.match(/<div class="rating-number">(\d+)<\/div>/);
      const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 0;

      // 2. Max Rating (Usually in <small>(Highest Rating 1234)</small>)
      const maxRatingMatch = html.match(/\(Highest Rating (\d+)\)/);
      const maxRating = maxRatingMatch ? parseInt(maxRatingMatch[1], 10) : rating;

      // 3. Stars (e.g. "3★")
      const starsMatch = html.match(/<span class="rating">(\d+).?<\/span>/) || html.match(/class="rating"[^>]*>(\d+).?<\/div>/);
      // CodeChef structure is often <div class="rating-star">...<span>3★</span>...</div>
      // Let's try to match the star count more broadly usually it's just a number in the "rating-star" block
      // Actually, standard profile has <div class="rating-star">...<span>7★</span>...</div>
      
      // 4. Rank (Global and Country)
      // <strong>Global Rank:</strong> 123</a>
      const globalRankMatch = html.match(/Global Rank:<\/strong>\s*(\d+)/i);
      const globalRank = globalRankMatch ? globalRankMatch[1] : undefined;

      // 5. Problems Solved
      // usually inside <section class="problems-solved"> ... (Total: 450) ... </section>
      // Or in standard text: Fully Solved (123)
      const solvedMatch = html.match(/Fully Solved \s*\((\d+)\)/);
      const problemsSolved = solvedMatch ? parseInt(solvedMatch[1], 10) : 0;

      // 6. Name and Avatar
      const avatarMatch = html.match(/<img src="([^"]+)"[^>]*class="user-img/); // Heuristic
      // Often default avatar if not found
      
      // 7. Name
      // <h1>Meet Thakur</h1> or similar
      const nameMatch = html.match(/<h1[^>]*>(?:<span[^>]*>)?([^<]+)(?:<\/span>)?<\/h1>/);

      return {
        handle,
        rating,
        maxRating,
        rank: globalRank,
        problemsSolved,
        avatar: avatarMatch ? avatarMatch[1] : undefined,
        name: nameMatch ? nameMatch[1].trim() : handle,
      };

    } catch (error) {
      console.error('CodeChef getUserInfo error:', error);
      // If we fail (e.g. 403), return null so the store can handle it gracefully
      throw error;
    }
  }
};
