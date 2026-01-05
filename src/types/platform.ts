export type PlatformId =
  | "codeforces"
  | "leetcode"
  | "codechef"
  | "atcoder";

export interface Platform {
  id: PlatformId;
  name: string;
  icon: string; // Icon name or URL
  color: string; // Brand color
  baseUrl: string;
}

export const PLATFORMS: Record<PlatformId, Platform> = {
  codeforces: {
    id: "codeforces",
    name: "Codeforces",
    icon: "code-braces", // Material Community Icon
    color: "#1f8dd6",
    baseUrl: "https://codeforces.com",
  },
  leetcode: {
    id: "leetcode",
    name: "LeetCode",
    icon: "code-tags",
    color: "#ffa116",
    baseUrl: "https://leetcode.com",
  },
  codechef: {
    id: "codechef",
    name: "CodeChef",
    icon: "chef-hat",
    color: "#5b4638",
    baseUrl: "https://www.codechef.com",
  },
  atcoder: {
    id: "atcoder",
    name: "AtCoder",
    icon: "alpha-a-circle",
    color: "#FFFFFF",
    baseUrl: "https://atcoder.jp",
  },

};
