import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { posts, votes, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

type Params = Promise<{ id: string }>;

// POST /api/posts/[id]/vote - Vote on a post
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
    const { voteType } = body; // 'fire', 'liar', 'trash'

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

    // Check if user already voted
    const existingVotes = await db
      .select()
      .from(votes)
      .where(and(eq(votes.userId, user.id), eq(votes.postId, id)));

    // Get current post
    const currentPosts = await db.select().from(posts).where(eq(posts.id, id));
    const post = currentPosts[0];

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    let fireVotes = post.fireVotes ?? 0;
    let liarVotes = post.liarVotes ?? 0;
    let trashVotes = post.trashVotes ?? 0;
    let totalVotes = post.totalVotes ?? 0;

    const existingVote = existingVotes[0];

    if (existingVote) {
      // Remove old vote
      if (existingVote.voteType === "fire") fireVotes--;
      else if (existingVote.voteType === "liar") liarVotes--;
      else if (existingVote.voteType === "trash") trashVotes--;
      totalVotes--;

      // If same vote type, remove vote entirely
      if (existingVote.voteType === voteType) {
        await db.delete(votes).where(eq(votes.id, existingVote.id));
      } else {
        // Update to new vote type
        await db.update(votes).set({ voteType }).where(eq(votes.id, existingVote.id));
        if (voteType === "fire") fireVotes++;
        else if (voteType === "liar") liarVotes++;
        else if (voteType === "trash") trashVotes++;
        totalVotes++;
      }
    } else {
      // Create new vote
      await db.insert(votes).values({
        userId: user.id,
        postId: id,
        voteType,
      });
      if (voteType === "fire") fireVotes++;
      else if (voteType === "liar") liarVotes++;
      else if (voteType === "trash") trashVotes++;
      totalVotes++;
    }

    // Update post
    const updatedPosts = await db
      .update(posts)
      .set({ fireVotes, liarVotes, trashVotes, totalVotes })
      .where(eq(posts.id, id))
      .returning();

    return NextResponse.json({ post: updatedPosts[0] });
  } catch (error) {
    console.error("Error voting on post:", error);
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}