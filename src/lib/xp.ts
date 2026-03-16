// XP Utilities for Liar-or-Fire v2

import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { XP_VALUES, calculateLevel } from "./gamification";

export type XpReason = keyof typeof XP_VALUES;

export async function awardXp(
  userId: string,
  amount: number,
  reason: XpReason,
  referenceId?: string
): Promise<{ newXp: number; newLevel: number; leveledUp: boolean }> {
  // Get current user
  const existingUsers = await db.select().from(users).where(eq(users.id, userId));
  const user = existingUsers[0];
  
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
  
  return {
    newXp,
    newLevel,
    leveledUp,
  };
}

export async function updateStreak(userId: string): Promise<{ currentStreak: number; longestStreak: number; streakBonus: number }> {
  const existingUsers = await db.select().from(users).where(eq(users.id, userId));
  const user = existingUsers[0];
  
  if (!user) {
    throw new Error("User not found");
  }
  
  const today = new Date().toISOString().split('T')[0];
  
  let currentStreak = user.streakDays ?? 0;
  let longestStreak = user.longestStreak ?? 0;
  
  // Simple streak logic: increment if new day
  // In production, this would check lastActionDate from a separate streaks table
  currentStreak += 1;
  longestStreak = Math.max(longestStreak, currentStreak);
  
  // Update user
  await db
    .update(users)
    .set({
      streakDays: currentStreak,
      longestStreak,
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