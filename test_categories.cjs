const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/servicepanda',
});

async function testServiceCategories() {
  try {
    console.log('Testing service categories...');
    
    // Check if table exists
    const tableCheck = await pool.query(`
      SELECT COUNT(*) as count FROM service_categories;
    `);
    
    console.log('Total service categories in database:', tableCheck.rows[0].count);
    
    // Get all categories
    const categories = await pool.query(`
      SELECT id, name, icon, active, popular FROM service_categories ORDER BY name;
    `);
    
    console.log('Service categories:');
    categories.rows.forEach(cat => {
      console.log(`- ${cat.name} (ID: ${cat.id}, Active: ${cat.active}, Popular: ${cat.popular})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

testServiceCategories(); 