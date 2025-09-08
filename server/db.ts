import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL not set. Using fallback configuration for development.");
  process.env.DATABASE_URL='postgresql://neondb_owner:npg_VriYIgl69eLd@ep-divine-paper-afbqojt6.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require'
}

let pool: Pool;
let db: any;

try {
  // Configure SSL based on the database URL
  const sslConfig = process.env.DATABASE_URL?.includes('neon.tech') 
    ? { rejectUnauthorized: false } 
    : process.env.DATABASE_URL?.includes('13.201.64.152')
    ? { rejectUnauthorized: false }
    : false;
    
  pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: sslConfig
  });
  db = drizzle(pool, { schema });
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