import { pgTable, uuid, text, timestamp, integer, boolean, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Categories
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon"),
  color: text("color").default("#8b5cf6"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Users (managed by Clerk)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(),
  username: text("username").notNull().unique(),
  email: text("email").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  karma: integer("karma").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Posts
export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  categoryId: uuid("category_id").references(() => categories.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  productUrl: text("product_url"),
  price: text("price"),
  brand: text("brand"),
  fireVotes: integer("fire_votes").default(0),
  liarVotes: integer("liar_votes").default(0),
  trashVote: integer("trash_votes").default(0),
  totalVotes: integer("total_votes").default(0),
  commentCount: integer("comment_count").default(0),
  isPinned: boolean("is_pinned").default(false),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Comments
export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").references(() => posts.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  parentId: uuid("parent_id"),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  fireVotes: integer("fire_votes").default(0),
  liarVotes: integer("liar_votes").default(0),
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

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
}));

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  votes: many(votes),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
  comments: many(comments),
  votes: many(votes),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  replies: many(comments, {
    relationName: "parentComment",
  }),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  user: one(users, {
    fields: [votes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [votes.postId],
    references: [posts.id],
  }),
  comment: one(comments, {
    fields: [votes.commentId],
    references: [comments.id],
  }),
}));