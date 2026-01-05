export type PlatformId =
  | "codeforces"
  | "leetcode"
  | "codechef"
  | "atcoder"
  | "codingninjas"
  | "geeksforgeeks";

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
    color: "#000000",
    baseUrl: "https://atcoder.jp",
  },
  codingninjas: {
    id: "codingninjas",
    name: "Coding Ninjas",
    icon: "ninja",
    color: "#f66c24",
    baseUrl: "https://www.codingninjas.com",
  },
  geeksforgeeks: {
    id: "geeksforgeeks",
    name: "GeeksforGeeks",
    icon: "code-array",
    color: "#2f8d46",
    baseUrl: "https://www.geeksforgeeks.org",
  },
};
