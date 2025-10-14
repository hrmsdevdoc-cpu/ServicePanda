const { Client } = require('pg');
require('dotenv').config();

async function checkAdminUser() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://servicepanda:servicepanda@8954@13.201.64.152:5432/servicepanda'
  });

  try {
    await client.connect();
    console.log('🔗 Connected to database');

    // Check if admin_users table exists
    console.log('1. Checking admin_users table...');
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admin_users'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ admin_users table exists');
      
      // Check admin users
      const adminUsers = await client.query('SELECT * FROM admin_users');
      console.log(`📊 Total admin users: ${adminUsers.rows.length}`);
      
      if (adminUsers.rows.length > 0) {
        console.log('\n👤 Admin Users:');
        adminUsers.rows.forEach((user, index) => {
          console.log(`   ${index + 1}. Username: ${user.username}`);
          console.log(`      Role: ${user.role}`);
          console.log(`      Created: ${user.created_at}`);
          console.log(`      Password Hash: ${user.password.substring(0, 20)}...`);
          console.log('');
        });
        
        // Test password with the stored hash
        console.log('2. Testing password validation...');
        const adminUser = adminUsers.rows[0];
        const testPassword = 'admin123';
        
        // Check if password is plaintext or hashed
        if (adminUser.password === testPassword) {
          console.log('✅ Password is stored as plaintext - should work');
        } else if (adminUser.password.includes('.')) {
          console.log('✅ Password is hashed with scrypt');
        } else if (adminUser.password.startsWith('$2')) {
          console.log('✅ Password is hashed with bcrypt');
        } else {
          console.log('❓ Unknown password format');
        }
        
      } else {
        console.log('❌ No admin users found');
      }
      
    } else {
      console.log('❌ admin_users table does NOT exist');
      console.log('💡 You need to create the admin_users table first');
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
  }
}

checkAdminUser();
