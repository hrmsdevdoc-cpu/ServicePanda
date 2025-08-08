import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

neonConfig.webSocketConstructor = ws;

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL not set. Using fallback configuration for development.");
  process.env.DATABASE_URL = 'postgresql://postgres:password@localhost:5432/servicepanda';
}

let pool: Pool;
let db: any;

try {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
  console.log("✅ Database connection established");
} catch (error) {
  console.warn("⚠️  Database connection failed. Running in development mode without database.");
  console.warn("   To fix this, either:");
  console.warn("   1. Install PostgreSQL and start it");
  console.warn("   2. Set up a Neon database and update DATABASE_URL");
  console.warn("   3. Use a local SQLite database for development");
  
  // Create a mock database for development
  db = {
    // Mock methods that return empty results
    select: () => ({ from: () => Promise.resolve([]) }),
    insert: () => ({ values: () => Promise.resolve([]) }),
    update: () => ({ set: () => ({ where: () => Promise.resolve([]) }) }),
    delete: () => ({ where: () => Promise.resolve([]) }),
  };
  
  pool = null as any;
}

export { pool, db };