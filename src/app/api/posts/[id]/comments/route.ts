import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { comments, users, posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type Params = Promise<{ id: string }>;

// GET /api/posts/[id]/comments - Get comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;

    const results = await db
      .select({
        id: comments.id,
        content: comments.content,
        imageUrl: comments.imageUrl,
        fireVotes: comments.fireVotes,
        liarVotes: comments.liarVotes,
        createdAt: comments.createdAt,
        parentId: comments.parentId,
        authorId: users.id,
        authorUsername: users.username,
        authorAvatar: users.avatar,
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.postId, id))
      .orderBy(comments.createdAt);

    return NextResponse.json({ comments: results });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST /api/posts/[id]/comments - Create a comment
export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { content, imageUrl, parentId } = body;

    // Get or create user
    const existingUsers = await db.select().from(users).where(eq(users.clerkId, userId));
    let user = existingUsers[0];
    
    if (!user) {
      const newUsers = await db.insert(users).values({
        clerkId: userId,
        username: `user_${Date.now()}`,
        email: "",
      }).returning();
      user = newUsers[0];
    }

    const newComments = await db.insert(comments).values({
      postId: id,
      userId: user.id,
      content,
      imageUrl,
      parentId,
    }).returning();

    // Update post comment count (simple increment)
    const currentPosts = await db.select().from(posts).where(eq(posts.id, id));
    if (currentPosts[0]) {
      await db
        .update(posts)
        .set({ commentCount: (currentPosts[0].commentCount ?? 0) + 1 })
        .where(eq(posts.id, id));
    }

    return NextResponse.json({ comment: newComments[0] });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}