import { drizzle } from "drizzle-orm/better-sqlite3";
import { sqliteTable, text, integer, blob } from "drizzle-orm/better-sqlite3-columns";
import { relations } from "drizzle-orm";

// Users
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  username: text("username").notNull().unique(),
  displayName: text("display_name"),
  email: text("email").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  website: text("website"),
  xp: integer("xp").default(0),
  level: integer("level").default(1),
  streakDays: integer("streak_days").default(0),
  longestStreak: integer("longest_streak").default(0),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  isSeller: integer("is_seller", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Categories
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon"),
  color: text("color").default("#8b5cf6"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Posts
export const posts = sqliteTable("posts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  categoryId: text("category_id").notNull().references(() => categories.id),
  type: text("type").notNull().default("product"),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  productUrl: text("product_url"),
  price: text("price"),
  brand: text("brand"),
  isScamReport: integer("is_scam_report", { mode: "boolean" }).default(false),
  fireVotes: integer("fire_votes").default(0),
  liarVotes: integer("liar_votes").default(0),
  trashVotes: integer("trash_votes").default(0),
  totalVotes: integer("total_votes").default(0),
  commentCount: integer("comment_count").default(0),
  viewCount: integer("view_count").default(0),
  isTrending: integer("is_trending", { mode: "boolean" }).default(false),
  isPinned: integer("is_pinned", { mode: "boolean" }).default(false),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Comments
export const comments = sqliteTable("comments", {
  id: text("id").primaryKey(),
  postId: text("post_id").notNull().references(() => posts.id),
  userId: text("user_id").notNull().references(() => users.id),
  parentId: text("parent_id").references((): typeof comments => comments.id),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  fireVotes: integer("fire_votes").default(0),
  liarVotes: integer("liar_votes").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Votes
export const votes = sqliteTable("votes", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  postId: text("post_id").references(() => posts.id),
  commentId: text("comment_id").references(() => comments.id),
  voteType: text("vote_type").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  votes: many(votes),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
  category: one(categories, { fields: [posts.categoryId], references: [categories.id] }),
  comments: many(comments),
  votes: many(votes),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  parent: one(comments, { fields: [comments.parentId], references: [comments.id] }),
  replies: many(comments, { relationName: "replies" }),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  user: one(users, { fields: [votes.userId], references: [users.id] }),
  post: one(posts, { fields: [votes.postId], references: [posts.id] }),
  comment: one(comments, { fields: [votes.commentId], references: [comments.id] }),
}));