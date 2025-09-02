const { Client } = require('pg');

async function fixProviderTerms() {
  console.log('🔧 Fixing provider terms acceptance...');

  const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_VriYIgl69eLd@ep-divine-paper-afbqojt6.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require'
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Update the provider's termsAccepted to true
    const result = await client.query(`
      UPDATE service_providers 
      SET terms_accepted = true, updated_at = NOW()
      WHERE email = 'hrms.devdoc@gmail.com'
      RETURNING id, email, first_name, last_name, status, documents_uploaded, terms_accepted, provider_status
    `);

    if (result.rows.length > 0) {
      const provider = result.rows[0];
      console.log('\n✅ Provider updated successfully!');
      console.log('📊 Updated Provider Data:');
      console.log(JSON.stringify(provider, null, 2));
      
      console.log('\n🔍 Key Fields:');
      console.log('  - documents_uploaded:', provider.documents_uploaded);
      console.log('  - terms_accepted:', provider.terms_accepted);
      console.log('  - status:', provider.status);
      console.log('  - provider_status:', provider.provider_status);
      
      // Test the mobile app logic
      const needsStepCompletion = (provider.documents_uploaded === false) || 
                                 (provider.terms_accepted === false) || 
                                 (provider.status === 'pending') ||
                                 (provider.provider_status === 'deactivated');
      
      console.log('\n🧮 Mobile App Logic Test:');
      console.log('  - needsStepCompletion:', needsStepCompletion);
      console.log('  - Will show profile setup dialog:', needsStepCompletion);
      console.log('  - Will navigate to dashboard:', !needsStepCompletion);
      
      if (!needsStepCompletion) {
        console.log('\n🎉 SUCCESS! Provider should now be able to access the dashboard!');
      }
    } else {
      console.log('❌ Provider not found or update failed');
    }

  } catch (error) {
    console.error('💥 Database error:', error);
  } finally {
    await client.end();
  }
}

fixProviderTerms();
