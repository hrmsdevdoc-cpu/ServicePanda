const { Pool } = require('pg');
const { scrypt, randomBytes, timingSafeEqual } = require('crypto');
const { promisify } = require('util');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
}

async function checkDatabaseAndCreateUser() {
  try {
    // Check lead_settings table structure
    console.log('🔍 Checking lead_settings table structure...');
    const tableStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'lead_settings'
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Current lead_settings columns:');
    tableStructure.rows.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable}, default: ${col.column_default})`);
    });

    // Check if free_leads_enabled column exists
    const hasFreeLeadsColumn = tableStructure.rows.some(col => col.column_name === 'free_leads_enabled');
    
    if (!hasFreeLeadsColumn) {
      console.log('\n⚠️  free_leads_enabled column missing - adding it...');
      
      // Add the missing column
      await pool.query(`
        ALTER TABLE lead_settings 
        ADD COLUMN free_leads_enabled BOOLEAN DEFAULT true
      `);
      console.log('✅ Added free_leads_enabled column with default value true');
    } else {
      console.log('\n✅ free_leads_enabled column already exists');
    }

    // Check current lead settings
    console.log('\n📊 Current lead settings:');
    const currentSettings = await pool.query(`
      SELECT * FROM lead_settings LIMIT 1
    `);
    
    if (currentSettings.rows.length > 0) {
      const settings = currentSettings.rows[0];
      console.log('   Current settings:');
      Object.keys(settings).forEach(key => {
        console.log(`     ${key}: ${settings[key]}`);
      });
    } else {
      console.log('   No lead settings found - creating default...');
      await pool.query(`
        INSERT INTO lead_settings (free_leads_enabled, first_three_lead_behavior)
        VALUES (true, 'shared')
      `);
      console.log('✅ Created default lead settings');
    }

    // Create a test user with proper password hashing
    const testUserEmail = 'admin@servicepanda.com';
    const testPassword = 'admin123';
    
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id, email, first_name, last_name, password FROM users WHERE email = $1',
      [testUserEmail]
    );
    
    if (existingUser.rows.length > 0) {
      console.log('\n✅ Test user already exists:', {
        id: existingUser.rows[0].id,
        email: existingUser.rows[0].email,
        firstName: existingUser.rows[0].first_name,
        lastName: existingUser.rows[0].last_name,
        hasPassword: !!existingUser.rows[0].password
      });
      
      // If user exists but has no password, update it
      if (!existingUser.rows[0].password) {
        const hashedPassword = await hashPassword(testPassword);
        await pool.query(
          'UPDATE users SET password = $1 WHERE email = $2',
          [hashedPassword, testUserEmail]
        );
        console.log('Updated test user with password');
      }
    } else {
      // Create a new test user
      const hashedPassword = await hashPassword(testPassword);
      const createUserQuery = await pool.query(`
        INSERT INTO users (id, email, first_name, last_name, phone_number, password, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING id, email, first_name, last_name;
      `, [
        `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        testUserEmail, 
        'Admin', 
        'User', 
        '1234567890',
        hashedPassword
      ]);
      
      console.log('\n✅ Created test user:', createUserQuery.rows[0]);
    }
    
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Email: admin@servicepanda.com');
    console.log('Password: admin123');
    console.log('========================\n');
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDatabaseAndCreateUser();