import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema-sqlite";
import { join } from "path";

// Create database file in project root
const dbPath = join(process.cwd(), "liar-or-fire.db");
const sqlite = new Database(dbPath);

// Enable WAL mode for better performance
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });

// Initialize tables
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
  CREATE INDEX IF NOT NOT EXISTS idx_posts_category_id ON posts(category_id);
  CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
  CREATE INDEX IF NOT EXISTS idx_votes_post_id ON votes(post_id);
  CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
`);

// Seed initial categories
const seedCategories = sqlite.prepare(`
  INSERT OR IGNORE INTO categories (id, name, slug, icon, color)
  VALUES 
    ('cat_tech', 'Tech & Gadgets', 'tech', '💻', '#3b82f6'),
    ('cat_gaming', 'Gaming', 'gaming', '🎮', '#10b981'),
    ('cat_fashion', 'Fashion', 'fashion', '👗', '#ec4899'),
    ('cat_food', 'Food & Drinks', 'food', '🍕', '#f97316'),
    ('cat_beauty', 'Beauty', 'beauty', '💄', '#f43f5e'),
    ('cat_fitness', 'Fitness', 'fitness', '💪', '#06b6d4'),
    ('cat_travel', 'Travel', 'travel', '✈️', '#0ea5e9'),
    ('cat_finance', 'Finance', 'finance', '💰', '#22c55e'),
    ('cat_entertainment', 'Entertainment', 'entertainment', '🎬', '#a855f7'),
    ('cat_home', 'Home & Living', 'home', '🏠', '#f59e0b'),
    ('cat_automotive', 'Automotive', 'automotive', '🚗', '#64748b'),
    ('cat_scam', 'Scam Reports', 'scam', '🚨', '#ef4444')
`);

try {
  seedCategories.run();
} catch (e) {
  // Categories already seeded
}

console.log("✅ SQLite database initialized at:", dbPath);