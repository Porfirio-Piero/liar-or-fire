import { pgTable, uuid, text, timestamp, integer, boolean, varchar, decimal, jsonb, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================
// CORE TABLES
// ============================================

// Users
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(),
  username: text("username").notNull().unique(),
  displayName: text("display_name"),
  avatar: text("avatar"),
  banner: text("banner"),
  bio: text("bio"),
  website: text("website"),
  xp: integer("xp").default(0),
  level: integer("level").default(1),
  streakDays: integer("streak_days").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastActive: timestamp("last_active").defaultNow(),
  isVerified: boolean("is_verified").default(false),
  isSeller: boolean("is_seller").default(false),
  sellerRating: decimal("seller_rating", { precision: 3, scale: 2 }),
  totalSales: integer("total_sales").default(0),
  fireScore: integer("fire_score").default(0), // Total fire votes received
  scamReportsSubmitted: integer("scam_reports_submitted").default(0),
  scamReportsVerified: integer("scam_reports_verified").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Categories
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
  color: text("color").default("#8b5cf6"),
  parentId: uuid("parent_id").references(() => categories.id),
  sortOrder: integer("sort_order").default(0),
  postCount: integer("post_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Posts (Rateable Items - Products, Videos, Scam Reports, Polls)
export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  categoryId: uuid("category_id").references(() => categories.id).notNull(),
  
  // Post type
  type: varchar("type", { length: 20 }).notNull(), // 'product', 'video', 'scam', 'poll'
  
  // Content
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"), // Rich text for longer posts
  
  // Media
  mediaUrls: jsonb("media_urls").$type<string[]>().default([]),
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  
  // Product info
  productUrl: text("product_url"),
  price: decimal("price", { precision: 10, scale: 2 }),
  currency: text("currency").default("USD"),
  brand: text("brand"),
  condition: text("condition"), // 'new', 'like_new', 'good', 'fair', 'poor'
  
  // Scam report fields
  isScamReport: boolean("is_scam_report").default(false),
  scamType: text("scam_type"), // 'website', 'seller', 'product', 'phone', 'email', 'marketplace'
  scamWebsiteUrl: text("scam_website_url"),
  scamSellerName: text("scam_seller_name"),
  scamSellerPhone: text("scam_seller_phone"),
  scamSellerEmail: text("scam_seller_email"),
  scamMarketplace: text("scam_marketplace"),
  scamEvidenceUrls: jsonb("scam_evidence_urls").$type<string[]>().default([]),
  
  // AI Analysis
  aiScamScore: decimal("ai_scam_score", { precision: 5, scale: 2 }), // 0-100
  aiConfidence: decimal("ai_confidence", { precision: 5, scale: 4 }), // 0-1
  aiSummary: text("ai_summary"),
  aiAnalysis: jsonb("ai_analysis").$type<Record<string, any>>(),
  
  // Poll fields
  pollQuestion: text("poll_question"),
  pollOptions: jsonb("poll_options").$type<{ text: string; votes: number }[]>().default([]),
  pollEndsAt: timestamp("poll_ends_at"),
  
  // Engagement
  fireVotes: integer("fire_votes").default(0),
  liarVotes: integer("liar_votes").default(0),
  trashVotes: integer("trash_votes").default(0),
  totalVotes: integer("total_votes").default(0),
  commentCount: integer("comment_count").default(0),
  viewCount: integer("view_count").default(0),
  shareCount: integer("share_count").default(0),
  
  // Status
  isTrending: boolean("is_trending").default(false),
  isPinned: boolean("is_pinned").default(false),
  isFeatured: boolean("is_featured").default(false),
  isVerified: boolean("is_verified").default(false),
  status: varchar("status", { length: 20 }).default("active"), // 'active', 'hidden', 'removed'
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Votes
export const votes = pgTable("votes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  postId: uuid("post_id").references(() => posts.id),
  commentId: uuid("comment_id").references(() => comments.id),
  voteType: varchar("vote_type", { length: 10 }).notNull(), // 'fire', 'liar', 'trash'
  createdAt: timestamp("created_at").defaultNow(),
});

// Comments
export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").references(() => posts.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  parentId: uuid("parent_id").references((): typeof comments => comments.id),
  content: text("content").notNull(),
  mediaUrl: text("media_url"),
  fireVotes: integer("fire_votes").default(0),
  liarVotes: integer("liar_votes").default(0),
  isVerified: boolean("is_verified").default(false),
  status: varchar("status", { length: 20 }).default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Follows
export const follows = pgTable("follows", {
  followerId: uuid("follower_id").references(() => users.id).notNull(),
  followingId: uuid("following_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  pk: { columns: [table.followerId, table.followingId], unique: true },
}));

// Badges
export const badges = pgTable("badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").notNull(),
  color: text("color").default("#8b5cf6"),
  xpRequired: integer("xp_required").default(0),
  category: text("category"), // 'engagement', 'social', 'marketplace', 'scam_hunter'
  createdAt: timestamp("created_at").defaultNow(),
});

// User Badges
export const userBadges = pgTable("user_badges", {
  userId: uuid("user_id").references(() => users.id).notNull(),
  badgeId: uuid("badge_id").references(() => badges.id).notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
}, (table) => ({
  pk: { columns: [table.userId, table.badgeId], unique: true },
}));

// Streaks
export const streaks = pgTable("streaks", {
  userId: uuid("user_id").references(() => users.id).primaryKey(),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastActionDate: date("last_action_date"),
  lastVoteDate: date("last_vote_date"),
  lastPostDate: date("last_post_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  type: varchar("type", { length: 30 }).notNull(), // 'fire_vote', 'liar_vote', 'comment', 'follow', 'badge', 'scam_verified', etc.
  title: text("title").notNull(),
  body: text("body"),
  data: jsonb("data").$type<Record<string, any>>(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Marketplace Listings
export const listings = pgTable("listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  sellerId: uuid("seller_id").references(() => users.id).notNull(),
  postId: uuid("post_id").references(() => posts.id),
  title: text("title").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }),
  currency: text("currency").default("USD"),
  condition: varchar("condition", { length: 20 }).default("new"),
  mediaUrls: jsonb("media_urls").$type<string[]>().default([]),
  isFeatured: boolean("is_featured").default(false),
  isVerified: boolean("is_verified").default(false),
  status: varchar("status", { length: 20 }).default("active"), // 'active', 'sold', 'reserved', 'removed'
  viewCount: integer("view_count").default(0),
  inquiryCount: integer("inquiry_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// XP Transactions
export const xpTransactions = pgTable("xp_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(),
  reason: varchar("reason", { length: 50 }).notNull(), // 'post', 'vote', 'comment', 'badge', etc.
  referenceId: uuid("reference_id"), // Post/Comment/Badge ID
  createdAt: timestamp("created_at").defaultNow(),
});

// Daily Challenges
export const challenges = pgTable("challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  type: varchar("type", { length: 20 }).notNull(), // 'vote', 'post', 'comment', 'share'
  requirement: integer("requirement").default(1),
  xpReward: integer("xp_reward").default(10),
  badgeId: uuid("badge_id").references(() => badges.id),
  isActive: boolean("is_active").default(true),
  startsAt: timestamp("starts_at"),
  endsAt: timestamp("ends_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Challenges
export const userChallenges = pgTable("user_challenges", {
  userId: uuid("user_id").references(() => users.id).notNull(),
  challengeId: uuid("challenge_id").references(() => challenges.id).notNull(),
  progress: integer("progress").default(0),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  pk: { columns: [table.userId, table.challengeId], unique: true },
}));

// ============================================
// RELATIONS
// ============================================

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  votes: many(votes),
  followers: many(follows, { relationName: "following" }),
  following: many(follows, { relationName: "follower" }),
  badges: many(userBadges),
  notifications: many(notifications),
  listings: many(listings),
  xpTransactions: many(xpTransactions),
  challenges: many(userChallenges),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
  category: one(categories, { fields: [posts.categoryId], references: [categories.id] }),
  comments: many(comments),
  votes: many(votes),
  listing: one(listings, { fields: [posts.id], references: [listings.postId] }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, { fields: [categories.parentId], references: [categories.id] }),
  children: many(categories, { relationName: "children" }),
  posts: many(posts),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  parent: one(comments, { fields: [comments.parentId], references: [comments.id] }),
  replies: many(comments, { relationName: "replies" }),
  votes: many(votes),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  user: one(users, { fields: [votes.userId], references: [users.id] }),
  post: one(posts, { fields: [votes.postId], references: [posts.id] }),
  comment: one(comments, { fields: [votes.commentId], references: [comments.id] }),
}));

export const listingsRelations = relations(listings, ({ one }) => ({
  seller: one(users, { fields: [listings.sellerId], references: [users.id] }),
  post: one(posts, { fields: [listings.postId], references: [posts.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, { fields: [userBadges.userId], references: [users.id] }),
  badge: one(badges, { fields: [userBadges.badgeId], references: [badges.id] }),
}));

export const streaksRelations = relations(streaks, ({ one }) => ({
  user: one(users, { fields: [streaks.userId], references: [users.id] }),
}));

export const xpTransactionsRelations = relations(xpTransactions, ({ one }) => ({
  user: one(users, { fields: [xpTransactions.userId], references: [users.id] }),
}));

export const challengesRelations = relations(challenges, ({ one }) => ({
  badge: one(badges, { fields: [challenges.badgeId], references: [badges.id] }),
}));

export const userChallengesRelations = relations(userChallenges, ({ one }) => ({
  user: one(users, { fields: [userChallenges.userId], references: [users.id] }),
  challenge: one(challenges, { fields: [userChallenges.challengeId], references: [challenges.id] }),
}));