const { Client } = require('pg');
require('dotenv').config();

async function checkCampaignTable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://servicepanda:servicepanda@8954@13.201.64.152:5432/servicepanda'
  });

  try {
    await client.connect();
    console.log('🔗 Connected to database');

    // Check if sms_campaigns table exists
    console.log('1. Checking if sms_campaigns table exists...');
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'sms_campaigns'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ sms_campaigns table exists');
      
      // Check table structure
      const structure = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'sms_campaigns' 
        ORDER BY ordinal_position;
      `);
      console.log('📋 Table structure:');
      structure.rows.forEach(row => {
        console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
      
      // Check if there are any campaigns
      const campaigns = await client.query('SELECT COUNT(*) as count FROM sms_campaigns');
      console.log(`📊 Total campaigns: ${campaigns.rows[0].count}`);
      
    } else {
      console.log('❌ sms_campaigns table does NOT exist');
      console.log('💡 You need to create the table first using the SQL query I provided earlier');
    }

    // Check potential_customers table
    console.log('\n2. Checking potential_customers table...');
    const customersCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'potential_customers'
      );
    `);
    
    if (customersCheck.rows[0].exists) {
      console.log('✅ potential_customers table exists');
      const customers = await client.query('SELECT COUNT(*) as count FROM potential_customers');
      console.log(`📊 Total customers: ${customers.rows[0].count}`);
      
      // Check if your test number exists
      const testCustomer = await client.query(`
        SELECT id, name, phone, sms_delivery_status 
        FROM potential_customers 
        WHERE phone LIKE '%0485901942%' OR phone LIKE '%485901942%'
      `);
      
      if (testCustomer.rows.length > 0) {
        console.log('✅ Your test number found in customers:');
        testCustomer.rows.forEach(customer => {
          console.log(`  - ID: ${customer.id}, Name: ${customer.name}, Phone: ${customer.phone}, SMS Status: ${customer.sms_delivery_status}`);
        });
      } else {
        console.log('❌ Your test number (0485901942) not found in potential_customers');
        console.log('💡 You need to add your number to the customers table to test campaigns');
      }
    } else {
      console.log('❌ potential_customers table does NOT exist');
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
  }
}

checkCampaignTable();
