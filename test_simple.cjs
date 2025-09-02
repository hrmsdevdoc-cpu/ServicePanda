const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_VriYIgl69eLd@ep-divine-paper-afbqojt6.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require',
});

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    const result = await pool.query('SELECT NOW()');
    console.log('Database connected successfully:', result.rows[0]);
    
    // Check service categories
    const categories = await pool.query('SELECT COUNT(*) as count FROM service_categories');
    console.log('Service categories count:', categories.rows[0].count);
    
    // Get some categories
    const sampleCategories = await pool.query('SELECT id, name, active FROM service_categories LIMIT 5');
    console.log('Sample categories:');
    sampleCategories.rows.forEach(cat => {
      console.log(`- ${cat.name} (ID: ${cat.id}, Active: ${cat.active})`);
    });
    
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await pool.end();
  }
}

testDatabase(); 