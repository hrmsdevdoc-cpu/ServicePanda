const { Client } = require('pg');

async function checkProviderTerms() {
  console.log('🔍 Checking provider terms acceptance in database...');

  const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_VriYIgl69eLd@ep-divine-paper-afbqojt6.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require'
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Check the specific provider
    const result = await client.query(`
      SELECT 
        id, 
        email, 
        "firstName", 
        "lastName", 
        status, 
        "documentsUploaded", 
        "termsAccepted", 
        "providerStatus",
        "createdAt",
        "updatedAt"
      FROM service_providers 
      WHERE email = 'hrms.devdoc@gmail.com'
    `);

    if (result.rows.length > 0) {
      const provider = result.rows[0];
      console.log('\n📊 Provider Data from Database:');
      console.log(JSON.stringify(provider, null, 2));
      
      console.log('\n🔍 Key Fields:');
      console.log('  - documentsUploaded:', provider.documentsUploaded);
      console.log('  - termsAccepted:', provider.termsAccepted);
      console.log('  - status:', provider.status);
      console.log('  - providerStatus:', provider.providerStatus);
      
      // Check if we need to update termsAccepted
      if (provider.termsAccepted === false && provider.status === 'approved') {
        console.log('\n⚠️  Provider is approved but terms not accepted!');
        console.log('💡 This might be why they can\'t access the dashboard.');
      }
    } else {
      console.log('❌ Provider not found');
    }

  } catch (error) {
    console.error('💥 Database error:', error);
  } finally {
    await client.end();
  }
}

checkProviderTerms();
