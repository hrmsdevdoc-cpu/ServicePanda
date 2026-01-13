const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://servicepanda:servicepanda@8954@13.201.64.152:5432/servicepanda',
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting team_tasks table migration...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'create_team_tasks_table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL
    await client.query(sql);
    
    console.log('✅ team_tasks table created successfully!');
    console.log('📊 Sample data inserted for testing');
    
    // Verify the table was created
    const result = await client.query(`
      SELECT COUNT(*) as count 
      FROM team_tasks
    `);
    
    console.log(`📈 Total tasks in database: ${result.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the migration
runMigration()
  .then(() => {
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });
