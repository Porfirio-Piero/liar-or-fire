// Database configuration for Liar-or-Fire v2
// Supports both SQLite (local) and PostgreSQL (production)

import { drizzle } from "drizzle-orm/better-sqlite3";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import Database from "better-sqlite3";
import { join } from "path";
import * as schema from "./schema-sqlite";

const isDevelopment = !process.env.DATABASE_URL;

// SQLite for local development
function getSQLiteDb() {
  const dbPath = join(process.cwd(), "liar-or-fire.db");
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  return drizzle(sqlite, { schema });
}

// PostgreSQL for production (Neon)
function getNeonDb() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return drizzleNeon(pool, { schema });
}

// Export the appropriate database connection
export const db = isDevelopment ? getSQLiteDb() : getNeonDb();

// Initialize SQLite tables if local
if (isDevelopment) {
  const sqlite = new Database(join(process.cwd(), "liar-or-fire.db"));
  sqlite.pragma("journal_mode = WAL");

  // Create tables
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      clerk_id TEXT NOT NULL UNIQUE,
      username TEXT NOT NULL UNIQUE,
      display_name TEXT,
      email TEXT NOT NULL,
      avatar TEXT,
      bio TEXT,
      website TEXT,
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      streak_days INTEGER DEFAULT 0,
      longest_streak INTEGER DEFAULT 0,
      is_verified INTEGER DEFAULT 0,
      is_seller INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      icon TEXT,
      color TEXT DEFAULT '#8b5cf6',
      created_at INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      category_id TEXT NOT NULL REFERENCES categories(id),
      type TEXT NOT NULL DEFAULT 'product',
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      video_url TEXT,
      thumbnail_url TEXT,
      product_url TEXT,
      price TEXT,
      brand TEXT,
      is_scam_report INTEGER DEFAULT 0,
      fire_votes INTEGER DEFAULT 0,
      liar_votes INTEGER DEFAULT 0,
      trash_votes INTEGER DEFAULT 0,
      total_votes INTEGER DEFAULT 0,
      comment_count INTEGER DEFAULT 0,
      view_count INTEGER DEFAULT 0,
      is_trending INTEGER DEFAULT 0,
      is_pinned INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL REFERENCES posts(id),
      user_id TEXT NOT NULL REFERENCES users(id),
      parent_id TEXT REFERENCES comments(id),
      content TEXT NOT NULL,
      image_url TEXT,
      fire_votes INTEGER DEFAULT 0,
      liar_votes INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS votes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      post_id TEXT REFERENCES posts(id),
      comment_id TEXT REFERENCES comments(id),
      vote_type TEXT NOT NULL,
      created_at INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
    CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);
    CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
    CREATE INDEX IF NOT EXISTS idx_votes_post_id ON votes(post_id);
    CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
  `);

  // Seed initial categories
  const categories = [
    { id: "cat_tech", name: "Tech & Gadgets", slug: "tech", icon: "💻", color: "#3b82f6" },
    { id: "cat_gaming", name: "Gaming", slug: "gaming", icon: "🎮", color: "#10b981" },
    { id: "cat_fashion", name: "Fashion", slug: "fashion", icon: "👗", color: "#ec4899" },
    { id: "cat_food", name: "Food & Drinks", slug: "food", icon: "🍕", color: "#f97316" },
    { id: "cat_beauty", name: "Beauty", slug: "beauty", icon: "💄", color: "#f43f5e" },
    { id: "cat_fitness", name: "Fitness", slug: "fitness", icon: "💪", color: "#06b6d4" },
    { id: "cat_travel", name: "Travel", slug: "travel", icon: "✈️", color: "#0ea5e9" },
    { id: "cat_finance", name: "Finance", slug: "finance", icon: "💰", color: "#22c55e" },
    { id: "cat_entertainment", name: "Entertainment", slug: "entertainment", icon: "🎬", color: "#a855f7" },
    { id: "cat_home", name: "Home & Living", slug: "home", icon: "🏠", color: "#f59e0b" },
    { id: "cat_automotive", name: "Automotive", slug: "automotive", icon: "🚗", color: "#64748b" },
    { id: "cat_scam", name: "Scam Reports", slug: "scam", icon: "🚨", color: "#ef4444" },
  ];

  const insertCategory = sqlite.prepare("INSERT OR IGNORE INTO categories (id, name, slug, icon, color) VALUES (?, ?, ?, ?, ?)");
  for (const cat of categories) {
    insertCategory.run(cat.id, cat.name, cat.slug, cat.icon, cat.color);
  }

  sqlite.close();
  console.log("✅ SQLite database initialized");
}

export * from "./schema-sqlite";