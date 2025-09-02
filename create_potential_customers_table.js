const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createPotentialCustomersTable() {
  try {
    const client = await pool.connect();
    
    console.log('Creating potential_customers table...');
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS "potential_customers" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" varchar NOT NULL,
        "email" varchar NOT NULL,
        "phone" varchar NOT NULL,
        "state" varchar NOT NULL,
        "city" varchar NOT NULL,
        "address" text NOT NULL,
        "import_id" varchar NOT NULL,
        "import_name" varchar NOT NULL,
        "sms_delivery_status" varchar(20) DEFAULT 'not_sent',
        "first_sms_sent_at" timestamp,
        "second_sms_sent_at" timestamp,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      );
    `;
    
    await client.query(createTableSQL);
    console.log('✅ potential_customers table created successfully!');
    
    client.release();
  } catch (error) {
    console.error('❌ Error creating table:', error);
  } finally {
    await pool.end();
  }
}

createPotentialCustomersTable(); 