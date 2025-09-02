const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function createPotentialProvidersTables() {
  try {
    console.log('Creating potential providers tables...\n');

    // Create potential_providers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS potential_providers (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR NOT NULL,
        last_name VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        phone VARCHAR NOT NULL,
        business_name VARCHAR,
        business_abn VARCHAR,
        address TEXT NOT NULL,
        state VARCHAR NOT NULL,
        city VARCHAR NOT NULL,
        postcode VARCHAR NOT NULL,
        service_categories TEXT,
        source VARCHAR DEFAULT 'manual',
        import_id VARCHAR,
        import_name VARCHAR,
        status VARCHAR DEFAULT 'new',
        priority VARCHAR DEFAULT 'medium',
        assigned_to VARCHAR,
        notes TEXT,
        next_follow_up_date TIMESTAMP,
        last_contact_date TIMESTAMP,
        last_contact_type VARCHAR,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ potential_providers table created');

    // Create potential_provider_tasks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS potential_provider_tasks (
        id SERIAL PRIMARY KEY,
        potential_provider_id INTEGER REFERENCES potential_providers(id) NOT NULL,
        task_type VARCHAR NOT NULL,
        status VARCHAR DEFAULT 'pending',
        title VARCHAR NOT NULL,
        description TEXT,
        scheduled_date TIMESTAMP,
        completed_date TIMESTAMP,
        assigned_to VARCHAR,
        result VARCHAR,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ potential_provider_tasks table created');

    // Create potential_provider_communications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS potential_provider_communications (
        id SERIAL PRIMARY KEY,
        potential_provider_id INTEGER REFERENCES potential_providers(id) NOT NULL,
        communication_type VARCHAR NOT NULL,
        direction VARCHAR NOT NULL,
        subject VARCHAR,
        content TEXT NOT NULL,
        status VARCHAR DEFAULT 'sent',
        sent_by VARCHAR NOT NULL,
        sent_at TIMESTAMP DEFAULT NOW(),
        delivered_at TIMESTAMP,
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ potential_provider_communications table created');

    console.log('\n🎉 All potential providers tables created successfully!');

  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
  } finally {
    await pool.end();
  }
}

createPotentialProvidersTables();
