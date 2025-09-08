const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function runMigrations() {
  try {
    console.log('🔍 Running PostgreSQL migrations...\n');

    // List of migration files in order
    const migrationFiles = [
      '0000_absurd_rumiko_fujikawa.sql',
      '0001_giant_tattoo.sql', 
      '0002_cute_doctor_faustus.sql',
      '0003_email_management.sql',
      '0004_notification_system.sql'
    ];

    for (const fileName of migrationFiles) {
      const filePath = path.join(__dirname, 'migrations', fileName);
      
      if (fs.existsSync(filePath)) {
        console.log(`📄 Running migration: ${fileName}`);
        
        try {
          const sql = fs.readFileSync(filePath, 'utf8');
          
          // Split by semicolon and execute each statement
          const statements = sql.split(';').filter(stmt => stmt.trim());
          
          for (const statement of statements) {
            if (statement.trim()) {
              await pool.query(statement);
            }
          }
          
          console.log(`✅ Migration ${fileName} completed`);
        } catch (error) {
          console.log(`⚠️  Migration ${fileName} failed: ${error.message}`);
          // Continue with other migrations
        }
      } else {
        console.log(`❌ Migration file not found: ${fileName}`);
      }
    }

    console.log('\n🎉 Migration process completed!');
    
    // Check if admin_users table exists now
    const adminTableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admin_users'
      );
    `);
    
    if (adminTableCheck.rows[0].exists) {
      console.log('✅ admin_users table exists');
      
      // Check if admin user exists
      const adminUsers = await pool.query('SELECT * FROM admin_users WHERE username = $1', ['admin']);
      
      if (adminUsers.rows.length === 0) {
        console.log('📝 Creating admin user...');
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash('123456', 10);
        
        await pool.query(`
          INSERT INTO admin_users (username, email, password, first_name, last_name, role)
          VALUES ('admin', 'admin@servicepanda.com.au', $1, 'Admin', 'User', 'super_admin')
        `, [hashedPassword]);
        
        console.log('✅ Admin user created!');
        console.log('📋 Admin Login Credentials:');
        console.log('   Username: admin');
        console.log('   Email: admin@servicepanda.com.au');
        console.log('   Password: 123456');
      } else {
        console.log('✅ Admin user already exists');
      }
    }

  } catch (error) {
    console.error('❌ Error running migrations:', error.message);
  } finally {
    await pool.end();
  }
}

runMigrations();

