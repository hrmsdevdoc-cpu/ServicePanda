const axios = require('axios');

async function runMigration() {
  try {
    console.log('🔄 Running migration to add regionId to potential customers...\n');

    const response = await axios.post('http://localhost:3000/api/admin/migrate/add-region-to-customers', {}, {
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': 'your-admin-token-here' // Replace with actual admin token
      }
    });

    console.log('✅ Migration completed successfully!');
    console.log('📊 Results:');
    console.log(`- Total customers: ${response.data.stats.totalCustomers}`);
    console.log(`- Customers with region: ${response.data.stats.customersWithRegion}`);
    console.log(`- Percentage mapped: ${response.data.stats.percentage}%`);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

runMigration();
