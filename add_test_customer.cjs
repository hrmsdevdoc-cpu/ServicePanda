const { Pool } = require('pg');
require('dotenv').config();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/servicepanda'
});

async function addTestCustomer() {
  const client = await pool.connect();
  
  try {
    console.log('🧪 Adding test potential customer for SMS testing...\n');
    
    // Test customer data
    const testCustomer = {
      name: 'Puneet Verma',
      email: 'hrms.devdoc@gmail.com',
      phone: '+918077158797',
      state: 'Test State',
      city: 'Test City',
      address: 'Dummy Address for Testing',
      importId: 'test-sms-' + Date.now(),
      importName: 'SMS Test Customer'
    };
    
    console.log('Customer Data:', testCustomer);
    
    // Insert the test customer
    const query = `
      INSERT INTO potential_customers 
      (name, email, phone, state, city, address, import_id, import_name, sms_delivery_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'not_sent')
      RETURNING id, name, phone, sms_delivery_status
    `;
    
    const values = [
      testCustomer.name,
      testCustomer.email,
      testCustomer.phone,
      testCustomer.state,
      testCustomer.city,
      testCustomer.address,
      testCustomer.importId,
      testCustomer.importName
    ];
    
    const result = await client.query(query, values);
    
    console.log('\n✅ Test customer added successfully!');
    console.log('Customer ID:', result.rows[0].id);
    console.log('Name:', result.rows[0].name);
    console.log('Phone:', result.rows[0].phone);
    console.log('SMS Status:', result.rows[0].sms_delivery_status);
    
    console.log('\n📱 Now you can:');
    console.log('1. Go to Admin Panel > Potential Customers');
    console.log('2. Find "Puneet Verma" in the list');
    console.log('3. Click "Send SMS" button to test');
    console.log('4. Or use API: POST /api/admin/potential-customers/' + result.rows[0].id + '/send-sms');
    
  } catch (error) {
    console.error('❌ Error adding test customer:', error.message);
    
    if (error.code === '42P01') {
      console.log('\n💡 The potential_customers table might not exist yet.');
      console.log('Please run your database migrations first.');
    }
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the function
addTestCustomer().catch(console.error);
