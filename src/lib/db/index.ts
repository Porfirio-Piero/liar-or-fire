// Database configuration for Liar-or-Fire
// Uses PostgreSQL (Neon) in production, falls back to mock for development

import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "./schema";

// Check for database URL
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("⚠️ No DATABASE_URL found. Using mock database.");
  // Return mock db that logs operations
  export const db = {
    select: () => ({ from: () => ({ where: () => [], orderBy: () => [] }) }),
    insert: () => ({ values: () => ({ returning: () => [] }) }),
    update: () => ({ set: () => ({ where: () => ({ returning: () => [] }) }) }),
    delete: () => ({ where: () => [] }),
  };
} else {
  // Use Neon PostgreSQL
  const pool = new Pool({ connectionString: databaseUrl });
  export const db = drizzle(pool, { schema });
}

export * from "./schema";