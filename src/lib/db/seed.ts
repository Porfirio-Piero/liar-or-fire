// Seed script for Liar-or-Fire v2
// Run with: npx tsx src/lib/db/seed.ts

import Database from "better-sqlite3";
import { join } from "path";
import { randomUUID } from "crypto";

const dbPath = join(process.cwd(), "liar-or-fire.db");
const db = new Database(dbPath);

// Enable WAL mode
db.pragma("journal_mode = WAL");

console.log("🌱 Seeding database...");

// Seed categories
const categories = [
  { id: randomUUID(), name: "Tech & Gadgets", slug: "tech", icon: "💻", color: "#3b82f6" },
  { id: randomUUID(), name: "Gaming", slug: "gaming", icon: "🎮", color: "#10b981" },
  { id: randomUUID(), name: "Fashion", slug: "fashion", icon: "👗", color: "#ec4899" },
  { id: randomUUID(), name: "Food & Drinks", slug: "food", icon: "🍕", color: "#f97316" },
  { id: randomUUID(), name: "Beauty", slug: "beauty", icon: "💄", color: "#f43f5e" },
  { id: randomUUID(), name: "Fitness", slug: "fitness", icon: "💪", color: "#06b6d4" },
  { id: randomUUID(), name: "Travel", slug: "travel", icon: "✈️", color: "#0ea5e9" },
  { id: randomUUID(), name: "Finance", slug: "finance", icon: "💰", color: "#22c55e" },
  { id: randomUUID(), name: "Entertainment", slug: "entertainment", icon: "🎬", color: "#a855f7" },
  { id: randomUUID(), name: "Home & Living", slug: "home", icon: "🏠", color: "#f59e0b" },
  { id: randomUUID(), name: "Automotive", slug: "automotive", icon: "🚗", color: "#64748b" },
  { id: randomUUID(), name: "Scam Reports", slug: "scam", icon: "🚨", color: "#ef4444" },
];

const insertCategory = db.prepare(`
  INSERT INTO categories (id, name, slug, icon, color)
  VALUES (@id, @name, @slug, @icon, @color)
`);

for (const category of categories) {
  try {
    insertCategory.run(category);
    console.log(`✅ Created category: ${category.name}`);
  } catch (e) {
    console.log(`⏭️ Category already exists: ${category.name}`);
  }
}

// Seed sample posts
const samplePosts = [
  {
    id: randomUUID(),
    userId: "demo-user-1",
    categoryId: categories[0].id,
    type: "product",
    title: "Apple Vision Pro - Is it worth $3,499?",
    description: "I've been testing the Vision Pro for 2 weeks. Here's my honest take...",
    imageUrl: "https://images.unsplash.com/photo-1617802690992-15d93263d4a9?w=800",
    price: "$3,499",
    brand: "Apple",
    fireVotes: 234,
    liarVotes: 89,
    trashVotes: 12,
    totalVotes: 335,
    commentCount: 156,
    viewCount: 5421,
    isFeatured: 1,
  },
  {
    id: randomUUID(),
    userId: "demo-user-2",
    categoryId: categories[2].id,
    type: "product",
    title: "Stanley Cup Dupe - $40 vs $45",
    description: "Found this Stanley cup dupe on Amazon. Is it as good as the original?",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
    price: "$40",
    brand: "Generic",
    fireVotes: 567,
    liarVotes: 234,
    trashVotes: 45,
    totalVotes: 846,
    commentCount: 89,
    viewCount: 3254,
  },
  {
    id: randomUUID(),
    userId: "demo-user-3",
    categoryId: categories[11].id,
    type: "scam",
    title: "⚠️ WARNING: Fake iPhone 15 Pro listings on Facebook Marketplace",
    description: "I almost got scammed buying an iPhone on Facebook Marketplace. The seller claimed it was new but sent me a fake...",
    imageUrl: "https://images.unsplash.com/photo-1592767365432-6930c345d53b?w=800",
    isScamReport: 1,
    fireVotes: 892,
    liarVotes: 23,
    trashVotes: 12,
    totalVotes: 927,
    commentCount: 234,
    viewCount: 12543,
    isFeatured: 1,
  },
];

const insertPost = db.prepare(`
  INSERT INTO posts (
    id, user_id, category_id, type, title, description, image_url, price, brand,
    is_scam_report, fire_votes, liar_votes, trash_votes, total_votes, 
    comment_count, view_count, is_featured
  ) VALUES (
    @id, @userId, @categoryId, @type, @title, @description, @imageUrl, @price, @brand,
    @isScamReport, @fireVotes, @liarVotes, @trashVotes, @totalVotes,
    @commentCount, @viewCount, @isFeatured
  )
`);

for (const post of samplePosts) {
  try {
    insertPost.run({
      ...post,
      isScamReport: post.isScamReport || 0,
      isFeatured: post.isFeatured || 0,
    });
    console.log(`✅ Created post: ${post.title}`);
  } catch (e) {
    console.log(`⏭️ Post already exists: ${post.title}`);
  }
}

// Create demo user
const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (id, clerk_id, username, email, xp, level, streak_days)
  VALUES (@id, @clerkId, @username, @email, @xp, @level, @streakDays)
`);

const demoUsers = [
  { id: "demo-user-1", clerkId: "demo1", username: "techreviewer", email: "demo1@example.com", xp: 1250, level: 3, streakDays: 7 },
  { id: "demo-user-2", clerkId: "demo2", username: "budgetfinder", email: "demo2@example.com", xp: 890, level: 2, streakDays: 3 },
  { id: "demo-user-3", clerkId: "demo3", username: "scamwatcher", email: "demo3@example.com", xp: 2100, level: 5, streakDays: 14 },
];

for (const user of demoUsers) {
  try {
    insertUser.run(user);
    console.log(`✅ Created user: ${user.username}`);
  } catch (e) {
    console.log(`⏭️ User already exists: ${user.username}`);
  }
}

console.log("✅ Database seeded successfully!");
console.log(`📊 Categories: ${categories.length}`);
console.log(`📊 Posts: ${samplePosts.length}`);
console.log(`📊 Users: ${demoUsers.length}`);

db.close();