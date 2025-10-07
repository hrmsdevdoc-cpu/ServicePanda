const { Client } = require('pg');
require('dotenv').config();

async function createSmsCampaignsTable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/servicepanda'
  });

  try {
    await client.connect();
    console.log('🔗 Connected to database');

    // Create sms_campaigns table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS "sms_campaigns" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" varchar NOT NULL,
        "message" text NOT NULL,
        "voucher_code" varchar,
        "voucher_amount" decimal(10,2),
        "selected_states" jsonb NOT NULL,
        "selected_regions" jsonb,
        "selected_statuses" jsonb NOT NULL,
        "scheduled_at" timestamp,
        "status" varchar(20) DEFAULT 'draft' NOT NULL,
        "total_sent" integer DEFAULT 0,
        "sent_at" timestamp,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      );
    `;

    await client.query(createTableQuery);
    console.log('✅ Created sms_campaigns table');

    // Create indexes
    const createIndexesQuery = `
      CREATE INDEX IF NOT EXISTS "idx_sms_campaigns_status" ON "sms_campaigns"("status");
      CREATE INDEX IF NOT EXISTS "idx_sms_campaigns_created_at" ON "sms_campaigns"("created_at");
    `;

    await client.query(createIndexesQuery);
    console.log('✅ Created indexes');

    // Insert sample data
    const insertSampleDataQuery = `
      INSERT INTO "sms_campaigns" (
        "name", 
        "message", 
        "voucher_code", 
        "voucher_amount", 
        "selected_states", 
        "selected_statuses", 
        "status", 
        "total_sent"
      ) VALUES 
      (
        'QLD Launch Campaign',
        'Welcome to ServicePanda! Get 20% off your first service booking. Use code QLD20 to redeem. Book now at servicepanda.com.au',
        'QLD20',
        20.00,
        '["Queensland"]',
        '["New"]',
        'sent',
        150
      ),
      (
        'NSW Winter Special',
        'Beat the winter blues! 30% off all home services this month. Limited time offer - book today!',
        'WINTER30',
        30.00,
        '["New South Wales"]',
        '["New", "Contacted"]',
        'scheduled',
        0
      ),
      (
        'VIC Follow-up Campaign',
        'Hi! We noticed you haven''t booked a service yet. Here''s a special 25% discount just for you. Don''t miss out!',
        'VIC25',
        25.00,
        '["Victoria"]',
        '["New"]',
        'draft',
        0
      )
      ON CONFLICT DO NOTHING;
    `;

    await client.query(insertSampleDataQuery);
    console.log('✅ Inserted sample data');

    console.log('🎉 SMS campaigns table created successfully!');

  } catch (error) {
    console.error('❌ Error creating table:', error);
  } finally {
    await client.end();
  }
}

createSmsCampaignsTable();
