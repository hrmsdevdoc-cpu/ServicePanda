import { Pool, neonConfig } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import ws from "ws";

// Load environment variables
dotenv.config();

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const client = await pool.connect();
    console.log('Database connection successful');
    
    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    console.log('Users table exists:', tableCheck.rows[0].exists);
    
    if (tableCheck.rows[0].exists) {
      // Check users table structure
      const structure = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'users'
        ORDER BY ordinal_position;
      `);
      
      console.log('Users table structure:');
      structure.rows.forEach(row => {
        console.log(`  ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
      });
      
      // Check if there are any users
      const userCount = await client.query('SELECT COUNT(*) FROM users');
      console.log('Number of users in database:', userCount.rows[0].count);
      
      // Try to insert a test user
      const testUser = {
        id: 'test_user_' + Date.now(),
        email: 'test@example.com',
        password: 'test_hash',
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '1234567890'
      };
      
      try {
        const insertResult = await client.query(`
          INSERT INTO users (id, email, password, first_name, last_name, phone_number)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id, email, first_name, last_name
        `, [testUser.id, testUser.email, testUser.password, testUser.firstName, testUser.lastName, testUser.phoneNumber]);
        
        console.log('Test user inserted successfully:', insertResult.rows[0]);
        
        // Clean up test user
        await client.query('DELETE FROM users WHERE id = $1', [testUser.id]);
        console.log('Test user cleaned up');
        
      } catch (insertError) {
        console.error('Error inserting test user:', insertError.message);
      }
    }
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('Database test failed:', error);
  }
}

testDatabase(); 