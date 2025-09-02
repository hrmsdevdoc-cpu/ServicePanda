const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/servicepanda',
});

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    const client = await pool.connect();
    console.log('Database connection successful');
    
    // Check if service_categories table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'service_categories'
      );
    `);
    
    console.log('Service categories table exists:', tableCheck.rows[0].exists);
    
    if (tableCheck.rows[0].exists) {
      // Check table structure
      const structureCheck = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'service_categories' 
        ORDER BY ordinal_position;
      `);
      
      console.log('Table structure:', structureCheck.rows);
      
      // Check if there are any records
      const countCheck = await client.query(`
        SELECT COUNT(*) as count FROM service_categories;
      `);
      
      console.log('Number of service categories:', countCheck.rows[0].count);
      
      // Get a few sample records
      const sampleCheck = await client.query(`
        SELECT * FROM service_categories LIMIT 3;
      `);
      
      console.log('Sample records:', sampleCheck.rows);
    }
    
    client.release();
    
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await pool.end();
  }
}

testDatabase(); 