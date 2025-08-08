const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function createAdminUser() {
  try {
    console.log('Creating admin user...\n');

    // Check if admin_users table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admin_users'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('❌ admin_users table does not exist');
      return;
    }

    // Check if admin user already exists
    const existingAdmin = await pool.query(`
      SELECT * FROM admin_users WHERE username = 'admin'
    `);

    if (existingAdmin.rows.length > 0) {
      console.log('✅ Admin user already exists');
      console.log('Username: admin');
      console.log('Password: admin123');
      return;
    }

    // Create admin user
    await pool.query(`
      INSERT INTO admin_users (username, password, role, created_at, updated_at)
      VALUES ('admin', 'admin123', 'admin', NOW(), NOW())
    `);

    console.log('✅ Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await pool.end();
  }
}

createAdminUser(); 