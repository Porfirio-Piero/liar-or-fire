import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { posts, users, categories } from "@/lib/db/schema";
import { eq, desc, sql, and } from "drizzle-orm";

type Params = Promise<{ id: string }>;

// GET /api/posts - Get all posts with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "hot";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = db
      .select({
        id: posts.id,
        title: posts.title,
        description: posts.description,
        imageUrl: posts.imageUrl,
        productUrl: posts.productUrl,
        price: posts.price,
        brand: posts.brand,
        fireVotes: posts.fireVotes,
        liarVotes: posts.liarVotes,
        trashVotes: posts.trashVotes,
        totalVotes: posts.totalVotes,
        commentCount: posts.commentCount,
        isVerified: posts.isVerified,
        createdAt: posts.createdAt,
        categoryId: posts.categoryId,
        categoryName: categories.name,
        categoryIcon: categories.icon,
        categoryColor: categories.color,
        authorId: users.id,
        authorUsername: users.username,
        authorAvatar: users.avatar,
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .innerJoin(categories, eq(posts.categoryId, categories.id));

    // Apply category filter
    if (category && category !== "all") {
      query = query.where(eq(posts.categoryId, category));
    }

    // Apply sorting
    if (sort === "hot") {
      query = query.orderBy(desc(posts.totalVotes));
    } else if (sort === "new") {
      query = query.orderBy(desc(posts.createdAt));
    } else if (sort === "top") {
      query = query.orderBy(desc(posts.fireVotes));
    }

    const results = await query.limit(limit).offset(offset);

    // Calculate fire percentage for each post
    const postsWithPercentage = results.map((post) => ({
      ...post,
      firePercentage: post.totalVotes > 0 
        ? Math.round((post.fireVotes / post.totalVotes) * 100) 
        : 0,
    }));

    return NextResponse.json({ posts: postsWithPercentage });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, categoryId, imageUrl, productUrl, price, brand } = body;

    // Get or create user
    let [user] = await db.select().from(users).where(eq(users.clerkId, userId));
    
    if (!user) {
      [user] = await db.insert(users).values({
        clerkId: userId,
        username: `user_${Date.now()}`,
        email: "",
      }).returning();
    }

    const [post] = await db.insert(posts).values({
      userId: user.id,
      title,
      description,
      categoryId,
      imageUrl,
      productUrl,
      price,
      brand,
    }).returning();

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}