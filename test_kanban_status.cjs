const { Client } = require('pg');
require('dotenv').config();

async function testKanbanStatus() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://servicepanda:servicepanda@8954@13.201.64.152:5432/servicepanda'
  });

  try {
    await client.connect();
    console.log('🔗 Connected to database');

    // Get all customers with their SMS status
    console.log('📱 Checking customers for Kanban view...');
    const customers = await client.query(`
      SELECT id, name, phone, sms_delivery_status, 
             first_sms_sent_at, second_sms_sent_at
      FROM potential_customers 
      ORDER BY id
    `);
    
    console.log(`\n📊 Found ${customers.rows.length} customers:\n`);
    
    // Group customers by SMS status
    const statusGroups = {
      'not_sent': [],
      '1st_sent': [],
      '2nd_sent': [],
      'unsubscribed': []
    };
    
    customers.rows.forEach((customer) => {
      const status = customer.sms_delivery_status || 'not_sent';
      if (statusGroups[status]) {
        statusGroups[status].push(customer);
      }
    });
    
    // Display Kanban columns
    Object.entries(statusGroups).forEach(([status, customers]) => {
      const statusNames = {
        'not_sent': 'New',
        '1st_sent': '1st SMS Sent',
        '2nd_sent': '2nd SMS Sent',
        'unsubscribed': 'Unsubscribed'
      };
      
      console.log(`📋 ${statusNames[status]} (${customers.length} customers):`);
      if (customers.length === 0) {
        console.log('   No customers in this status');
      } else {
        customers.forEach(customer => {
          console.log(`   - ${customer.name} (${customer.phone})`);
        });
      }
      console.log('');
    });
    
    console.log('🎯 Expected Kanban View:');
    console.log('   - New: Customers who haven\'t received any SMS');
    console.log('   - 1st SMS Sent: Customers who received 1 SMS');
    console.log('   - 2nd SMS Sent: Customers who received 2 SMS');
    console.log('   - Unsubscribed: Customers who unsubscribed');

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
  }
}

testKanbanStatus();
