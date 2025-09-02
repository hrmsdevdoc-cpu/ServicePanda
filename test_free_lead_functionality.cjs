const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function testFreeLeadFunctionality() {
  try {
    console.log('🧪 Testing Free Lead Functionality\n');

    // 1. Check current lead settings
    console.log('1️⃣ Checking current lead settings...');
    const leadSettings = await pool.query(`
      SELECT free_leads_enabled, first_three_lead_behavior
      FROM lead_settings 
      LIMIT 1
    `);
    
    if (leadSettings.rows.length > 0) {
      const settings = leadSettings.rows[0];
      console.log(`   freeLeadsEnabled: ${settings.free_leads_enabled}`);
      console.log(`   firstThreeLeadBehavior: ${settings.first_three_lead_behavior}`);
    } else {
      console.log('   No lead settings found');
    }

    // 2. Check new provider's free leads status
    console.log('\n2️⃣ Checking new provider (abhay gupta) free leads status...');
    const newProvider = await pool.query(`
      SELECT id, first_name, last_name, first_leads_free_used
      FROM service_providers 
      WHERE first_name = 'abhay' AND last_name = 'gupta'
      LIMIT 1
    `);
    
    if (newProvider.rows.length > 0) {
      const provider = newProvider.rows[0];
      console.log(`   Provider: ${provider.first_name} ${provider.last_name}`);
      console.log(`   Free leads used: ${provider.first_leads_free_used || 0}/3`);
      console.log(`   Can get free leads: ${(provider.first_leads_free_used || 0) < 3 ? 'YES' : 'NO'}`);
    } else {
      console.log('   New provider not found');
    }

    // 3. Test the free lead logic
    console.log('\n3️⃣ Testing free lead logic...');
    const testProviderId = newProvider.rows[0]?.id;
    
    if (testProviderId) {
      // Simulate the free lead check logic
      const leadSettingsResult = await pool.query(`
        SELECT free_leads_enabled FROM lead_settings LIMIT 1
      `);
      
      const freeLeadsEnabled = leadSettingsResult.rows[0]?.free_leads_enabled !== false;
      console.log(`   Free leads enabled in settings: ${freeLeadsEnabled}`);
      
      const providerResult = await pool.query(`
        SELECT first_leads_free_used FROM service_providers WHERE id = $1
      `, [testProviderId]);
      
      if (providerResult.rows.length > 0) {
        const freeLeadsUsed = providerResult.rows[0].first_leads_free_used || 0;
        const canGetFreeLead = freeLeadsEnabled && freeLeadsUsed < 3;
        
        console.log(`   Provider free leads used: ${freeLeadsUsed}/3`);
        console.log(`   Can get free lead: ${canGetFreeLead ? 'YES' : 'NO'}`);
        
        if (canGetFreeLead) {
          console.log('   ✅ Provider should get free lead');
        } else {
          console.log('   ❌ Provider should pay for lead');
        }
      }
    }

    // 4. Check recent leads and their offers
    console.log('\n4️⃣ Checking recent leads...');
    const recentLeads = await pool.query(`
      SELECT sr.id, sr.postcode, sr.category_id, sr.status, sr.created_at,
             sc.name as category_name
      FROM service_requests sr
      JOIN service_categories sc ON sr.category_id = sc.id
      ORDER BY sr.created_at DESC
      LIMIT 3
    `);
    
    console.log('Recent leads:');
    for (const lead of recentLeads.rows) {
      console.log(`   Lead ${lead.id}: ${lead.category_name} in ${lead.postcode} (${lead.status})`);
      
      // Check offers for this lead
      const offers = await pool.query(`
        SELECT lo.id, lo.provider_id, lo.offer_type, lo.status, lo.created_at,
               sp.first_name, sp.last_name, sp.first_leads_free_used
        FROM lead_offers lo
        JOIN service_providers sp ON lo.provider_id = sp.id
        WHERE lo.request_id = $1
        ORDER BY lo.sort_order
      `, [lead.id]);
      
      console.log(`     Offers for Lead ${lead.id}:`);
      offers.rows.forEach(offer => {
        const freeLeadsUsed = offer.first_leads_free_used || 0;
        const isNewProvider = freeLeadsUsed < 3;
        console.log(`       ${offer.first_name} ${offer.last_name}: ${offer.offer_type} - ${offer.status} (Free leads used: ${freeLeadsUsed}/3)${isNewProvider ? ' [NEW PROVIDER]' : ''}`);
      });
    }

    // 5. Test admin toggle functionality
    console.log('\n5️⃣ Testing admin toggle functionality...');
    
    // Test with free leads enabled
    console.log('   Testing with free leads ENABLED:');
    const testWithEnabled = await simulateFreeLeadCheck(testProviderId, true);
    console.log(`     Result: ${testWithEnabled ? 'FREE LEAD' : 'PAID LEAD'}`);
    
    // Test with free leads disabled
    console.log('   Testing with free leads DISABLED:');
    const testWithDisabled = await simulateFreeLeadCheck(testProviderId, false);
    console.log(`     Result: ${testWithDisabled ? 'FREE LEAD' : 'PAID LEAD'}`);

    console.log('\n✅ Free lead functionality test completed!');
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

async function simulateFreeLeadCheck(providerId, freeLeadsEnabled) {
  try {
    const provider = await pool.query(`
      SELECT first_leads_free_used FROM service_providers WHERE id = $1
    `, [providerId]);
    
    if (provider.rows.length === 0) return false;
    
    const freeLeadsUsed = provider.rows[0].first_leads_free_used || 0;
    return freeLeadsEnabled && freeLeadsUsed < 3;
  } catch (error) {
    console.error('Error in simulateFreeLeadCheck:', error);
    return false;
  }
}

testFreeLeadFunctionality(); 