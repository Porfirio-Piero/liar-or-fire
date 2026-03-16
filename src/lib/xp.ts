// XP Utilities for Liar-or-Fire v2

import { db } from "./db";
import { users, xpTransactions } from "./db/schema";
import { eq } from "drizzle";
import { XP_VALUES, calculateLevel } from "./gamification";

export type XpReason = keyof typeof XP_VALUES;

export async function awardXp(
  userId: string,
  amount: number,
  reason: XpReason,
  referenceId?: string
): Promise<{ newXp: number; newLevel: number; leveledUp: boolean }> {
  // Get current user
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  
  if (!user) {
    throw new Error("User not found");
  }
  
  const currentXp = user.xp ?? 0;
  const currentLevel = user.level ?? 1;
  const newXp = currentXp + amount;
  
  // Calculate new level
  const { level: newLevel } = calculateLevel(newXp);
  const leveledUp = newLevel > currentLevel;
  
  // Update user XP and level
  await db
    .update(users)
    .set({
      xp: newXp,
      level: newLevel,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
  
  // Record transaction
  await db.insert(xpTransactions).values({
    userId,
    amount,
    reason,
    referenceId,
  });
  
  return {
    newXp,
    newLevel,
    leveledUp,
  };
}

export async function getXpHistory(userId: string, limit: number = 50) {
  const transactions = await db
    .select()
    .from(xpTransactions)
    .where(eq(xpTransactions.userId, userId))
    .orderBy(xpTransactions.createdAt)
    .limit(limit);
  
  return transactions;
}

export async function updateStreak(userId: string): Promise<{ currentStreak: number; longestStreak: number; streakBonus: number }> {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  
  if (!user) {
    throw new Error("User not found");
  }
  
  const today = new Date().toISOString().split('T')[0];
  const lastActive = user.lastActive?.toISOString().split('T')[0];
  const lastActionDate = user.lastActive;
  
  let currentStreak = user.streakDays ?? 0;
  let longestStreak = user.longestStreak ?? 0;
  
  if (lastActive) {
    const daysSinceLastActive = Math.floor(
      (Date.now() - lastActionDate!.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLastActive === 1) {
      // Continued streak
      currentStreak += 1;
    } else if (daysSinceLastActive > 1) {
      // Streak broken
      currentStreak = 1;
    }
    // If same day, no change
  } else {
    // First action
    currentStreak = 1;
  }
  
  longestStreak = Math.max(longestStreak, currentStreak);
  
  // Update user
  await db
    .update(users)
    .set({
      streakDays: currentStreak,
      longestStreak,
      lastActive: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
  
  // Calculate streak bonus
  const streakBonus = currentStreak >= 7 ? XP_VALUES.DAILY_STREAK * 2 : XP_VALUES.DAILY_STREAK;
  
  return {
    currentStreak,
    longestStreak,
    streakBonus,
  };
}