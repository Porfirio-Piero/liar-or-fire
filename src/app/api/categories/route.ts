import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const results = await db.select().from(categories);
    return NextResponse.json({ categories: results });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST /api/categories - Create a category (admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description, icon, color } = body;

    const [category] = await db.insert(categories).values({
      name,
      slug,
      description,
      icon,
      color,
    }).returning();

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}