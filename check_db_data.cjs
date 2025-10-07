const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/servicepanda'
});

async function checkPotentialCustomers() {
  try {
    console.log('🔍 Checking potential_customers table');
    console.log('=====================================');
    
    // Get all customers
    const result = await pool.query('SELECT * FROM public.potential_customers ORDER BY id ASC');
    
    console.log(`\n📊 Total customers: ${result.rows.length}`);
    console.log('\n📋 All customers:');
    console.log('ID | Name | State | City | Region | Email | Phone');
    console.log('---|------|-------|------|--------|-------|------');
    
    result.rows.forEach(customer => {
      console.log(`${customer.id} | ${customer.name} | ${customer.state} | ${customer.city} | ${customer.region || 'NULL'} | ${customer.email} | ${customer.phone}`);
    });
    
    // Check Queensland customers specifically
    console.log('\n🏴 Queensland customers:');
    const qldCustomers = result.rows.filter(c => c.state === 'QLD');
    console.log(`Found ${qldCustomers.length} QLD customers:`);
    qldCustomers.forEach(customer => {
      console.log(`ID: ${customer.id}, Name: ${customer.name}, City: ${customer.city}, Region: "${customer.region || 'NULL'}"`);
    });
    
    // Check Brisbane - East specifically
    console.log('\n🏙️ Brisbane - East customers:');
    const brisbaneEastCustomers = result.rows.filter(c => c.region === 'Brisbane - East');
    console.log(`Found ${brisbaneEastCustomers.length} Brisbane - East customers:`);
    brisbaneEastCustomers.forEach(customer => {
      console.log(`ID: ${customer.id}, Name: ${customer.name}, State: ${customer.state}, City: ${customer.city}, Region: "${customer.region}"`);
    });
    
    // Check all unique regions
    console.log('\n🌍 All unique regions:');
    const uniqueRegions = [...new Set(result.rows.map(c => c.region).filter(r => r))];
    uniqueRegions.forEach((region, index) => {
      console.log(`${index + 1}. "${region}"`);
    });
    
    // Check regions containing "Brisbane"
    console.log('\n🏙️ Regions containing "Brisbane":');
    const brisbaneRegions = uniqueRegions.filter(r => r.toLowerCase().includes('brisbane'));
    brisbaneRegions.forEach((region, index) => {
      console.log(`${index + 1}. "${region}"`);
    });
    
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  } finally {
    await pool.end();
  }
}

checkPotentialCustomers();
