import { Contest, ContestPhase } from '../types/contest';
import { Submission, SubmissionVerdict } from '../types/submission';
import { UnifiedProfile } from '../types/user';

export const normalizeCodeforcesProfile = (
  userInfo: any, 
  ratingHistory: any[], 
  submissions: any[]
): UnifiedProfile => {
  const user = userInfo[0]; // Codeforces API returns an array
  
  // Calculate problems solved (unique accepted problems)
  const solvedProblems = new Set();
  submissions.forEach(sub => {
    if (sub.verdict === 'OK') {
      solvedProblems.add(`${sub.problem.contestId}-${sub.problem.index}`);
    }
  });

  return {
    id: `codeforces:${user.handle}`,
    platformId: 'codeforces',
    username: user.handle,
    displayName: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.handle,
    avatar: user.avatar,
    
    rating: user.rating || 0,
    maxRating: user.maxRating || 0,
    rank: user.rank,
    
    problemsSolved: solvedProblems.size,
    totalSubmissions: submissions.length,
    
    badges: [], // Codeforces doesn't have badges in API
    
    lastUpdated: new Date(),
    isStale: false
  };
};

export const normalizeCodeforcesContest = (cfContest: any): Contest => {
  const startTime = new Date(cfContest.startTimeSeconds * 1000);
  const duration = cfContest.durationSeconds;
  const endTime = new Date(startTime.getTime() + duration * 1000);
  const now = new Date();

  let phase: ContestPhase = 'upcoming';
  if (cfContest.phase === 'FINISHED') phase = 'finished';
  else if (cfContest.phase === 'CODING') phase = 'running';

  return {
    id: `codeforces:${cfContest.id}`,
    externalId: cfContest.id.toString(),
    platformId: 'codeforces',
    name: cfContest.name,
    startTime,
    endTime,
    durationSeconds: duration,
    url: `https://codeforces.com/contest/${cfContest.id}`,
    isRated: true, // Most CF contests are rated, simplifying assumption
    phase,
    reminderSet: false,
    scheduledReminders: []
  };
};

export const normalizeCodeforcesSubmission = (submission: any): Submission => {
  let verdict: SubmissionVerdict = 'OTHER';
  switch (submission.verdict) {
    case 'OK': verdict = 'AC'; break;
    case 'WRONG_ANSWER': verdict = 'WA'; break;
    case 'TIME_LIMIT_EXCEEDED': verdict = 'TLE'; break;
    case 'MEMORY_LIMIT_EXCEEDED': verdict = 'MLE'; break;
    case 'RUNTIME_ERROR': verdict = 'RTE'; break;
    case 'COMPILATION_ERROR': verdict = 'CE'; break;
  }

  return {
    id: `codeforces:${submission.id}`,
    platformId: 'codeforces',
    problemName: `${submission.problem.index} - ${submission.problem.name}`,
    problemUrl: `https://codeforces.com/contest/${submission.contestId}/problem/${submission.problem.index}`,
    verdict,
    language: submission.programmingLanguage,
    submittedAt: new Date(submission.creationTimeSeconds * 1000),
    timeConsumedMillis: submission.timeConsumedMillis,
    memoryConsumedBytes: submission.memoryConsumedBytes,
  };
};

// ==================== LEETCODE NORMALIZERS ====================

export const normalizeLeetCodeProfile = (
  userData: any,
  contestData: any
): UnifiedProfile => {
  // Calculate total problems solved from acSubmissionNum
  const acStats = userData?.submitStats?.acSubmissionNum || [];
  const totalSolved = acStats.find((s: any) => s.difficulty === 'All')?.count || 0;
  
  // Get total submissions
  const totalStats = userData?.submitStats?.totalSubmissionNum || [];
  const totalSubmissions = totalStats.find((s: any) => s.difficulty === 'All')?.count || 0;

  // Contest rating info
  const contestRating = contestData?.ranking?.rating || 0;
  const globalRanking = contestData?.ranking?.globalRanking;

  return {
    id: `leetcode:${userData.username}`,
    platformId: 'leetcode',
    username: userData.username,
    displayName: userData.profile?.realName || userData.username,
    avatar: userData.profile?.userAvatar,
    
    rating: Math.round(contestRating),
    maxRating: Math.round(contestRating), // LeetCode doesn't expose max rating easily
    rank: globalRanking ? `#${globalRanking}` : undefined,
    
    problemsSolved: totalSolved,
    totalSubmissions: totalSubmissions,
    
    badges: [], // Could parse from profile if needed
    
    lastUpdated: new Date(),
    isStale: false
  };
};

export const normalizeLeetCodeContest = (lcContest: any): Contest => {
  const startTime = new Date(lcContest.startTime * 1000);
  const durationSeconds = lcContest.duration;
  const endTime = new Date(startTime.getTime() + durationSeconds * 1000);
  const now = new Date();

  let phase: ContestPhase = 'upcoming';
  if (now > endTime) phase = 'finished';
  else if (now >= startTime && now <= endTime) phase = 'running';

  return {
    id: `leetcode:${lcContest.titleSlug}`,
    externalId: lcContest.titleSlug,
    platformId: 'leetcode',
    name: lcContest.title,
    startTime,
    endTime,
    durationSeconds,
    url: `https://leetcode.com/contest/${lcContest.titleSlug}`,
    isRated: true,
    phase,
    reminderSet: false,
    scheduledReminders: []
  };
};
