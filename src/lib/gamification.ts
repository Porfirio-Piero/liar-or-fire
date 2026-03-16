// Gamification utilities for Liar-or-Fire v2

export const XP_VALUES = {
  POST_CREATE: 10,
  POST_FIRE_VOTE: 2,
  COMMENT: 5,
  SHARE: 15,
  SCAM_REPORT_VERIFIED: 100,
  DAILY_STREAK: 25,
  INVITE_FRIEND: 50,
  LEVEL_UP_BONUS: 100,
} as const;

export const LEVELS = [
  { level: 1, xpRequired: 0, title: "Newbie", icon: "🌱" },
  { level: 2, xpRequired: 100, title: "Fire Starter", icon: "🔥" },
  { level: 3, xpRequired: 500, title: "Flame Keeper", icon: "🧯" },
  { level: 4, xpRequired: 1000, title: "Fire Expert", icon: "⚡" },
  { level: 5, xpRequired: 2500, title: "Liar Hunter", icon: "🎯" },
  { level: 6, xpRequired: 5000, title: "Scam Detective", icon: "🕵️" },
  { level: 7, xpRequired: 10000, title: "Truth Master", icon: "👁️" },
  { level: 8, xpRequired: 25000, title: "Fire Lord", icon: "👑" },
  { level: 9, xpRequired: 50000, title: "Legendary", icon: "⭐" },
  { level: 10, xpRequired: 100000, title: "Mythic", icon: "🌟" },
] as const;

export const BADGES = [
  { id: "first-fire", name: "First Fire", description: "Cast your first fire vote", icon: "🔥", xpRequired: 0, category: "engagement" },
  { id: "first-liar", name: "Liar Liar", description: "Cast your first liar vote", icon: "🤥", xpRequired: 0, category: "engagement" },
  { id: "first-trash", name: "Trash Talker", description: "Cast your first trash vote", icon: "🗑️", xpRequired: 0, category: "engagement" },
  { id: "photo-evidence", name: "Photo Evidence", description: "Upload image with post", icon: "📸", xpRequired: 0, category: "engagement" },
  { id: "video-proof", name: "Video Proof", description: "Upload video with post", icon: "🎥", xpRequired: 0, category: "engagement" },
  { id: "scam-hunter", name: "Scam Hunter", description: "Submit verified scam report", icon: "🛡️", xpRequired: 0, category: "scam_hunter" },
  { id: "verified", name: "Verified", description: "Get verified seller badge", icon: "✅", xpRequired: 0, category: "marketplace" },
  { id: "trending", name: "Trending", description: "Have a post hit trending", icon: "🏆", xpRequired: 0, category: "engagement" },
  { id: "chatterbox", name: "Chatterbox", description: "Leave 100 comments", icon: "💬", xpRequired: 0, category: "social" },
  { id: "sharp-eye", name: "Sharp Eye", description: "Correctly identify 50 scams", icon: "🎯", xpRequired: 0, category: "scam_hunter" },
] as const;

export function calculateLevel(xp: number): { level: number; title: string; icon: string; xpToNext: number } {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      const nextLevel = LEVELS[i + 1];
      return {
        level: LEVELS[i].level,
        title: LEVELS[i].title,
        icon: LEVELS[i].icon,
        xpToNext: nextLevel ? nextLevel.xpRequired - xp : 0,
      };
    }
  }
  return { level: 1, title: "Newbie", icon: "🌱", xpToNext: 100 };
}

export function calculateFirePercentage(fireVotes: number, totalVotes: number): number {
  if (totalVotes === 0) return 0;
  return Math.round((fireVotes / totalVotes) * 100);
}

export function calculateScamScore(firePercentage: number, reportCount: number, aiScore: number): number {
  // Scam score: 0-100, higher = more likely scam
  // Lower fire percentage = more likely scam
  // More reports = more likely scam
  // AI score = additional confidence
  const fireFactor = (100 - firePercentage) * 0.4;
  const reportFactor = Math.min(reportCount * 10, 40);
  const aiFactor = aiScore * 0.2;
  return Math.round(fireFactor + reportFactor + aiFactor);
}

export function getStreakMultiplier(streakDays: number): number {
  // Bonus XP for streaks
  if (streakDays >= 30) return 3;
  if (streakDays >= 14) return 2;
  if (streakDays >= 7) return 1.5;
  if (streakDays >= 3) return 1.25;
  return 1;
}