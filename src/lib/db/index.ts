import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "./schema";

// Get database URL
const databaseUrl = process.env.DATABASE_URL;

// Create database connection
let db: ReturnType<typeof drizzle>;

if (databaseUrl) {
  const pool = new Pool({ connectionString: databaseUrl });
  db = drizzle(pool, { schema });
} else {
  // Mock database for development without DATABASE_URL
  // This returns empty arrays for all queries
  db = drizzle({} as any, { schema });
  console.warn("⚠️ No DATABASE_URL found. Using mock database.");
}

export { db };
export * from "./schema";