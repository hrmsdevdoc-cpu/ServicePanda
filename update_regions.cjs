const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/servicepanda'
});

async function updateRegions() {
  try {
    console.log('🔄 Updating regions for potential customers...\n');

    // City to region mapping
    const cityToRegionMap = {
      // NSW regions
      'sydney': 'Sydney - Inner West',
      'newcastle': 'Sydney - Inner West',
      'wollongong': 'Sydney - Eastern Suburbs',
      'parramatta': 'Sydney - Inner West',
      'liverpool': 'Sydney - Inner West',
      'penrith': 'Sydney - Inner West',
      'blacktown': 'Sydney - Inner West',
      'sutherland': 'Sydney - Eastern Suburbs',
      'cronulla': 'Sydney - Eastern Suburbs',
      'bondi': 'Sydney - Eastern Suburbs',
      'manly': 'Sydney - Northern Beaches',
      'dee why': 'Sydney - Northern Beaches',
      'northern beaches': 'Sydney - Northern Beaches',
      'campbelltown': 'Sydney - South West',
      'fairfield': 'Sydney - South West',
      'bankstown': 'Sydney - South West',
      
      // VIC regions
      'melbourne': 'Melbourne - Inner',
      'geelong': 'Melbourne - Inner',
      'frankston': 'Melbourne - Inner',
      'dandenong': 'Melbourne - Inner',
      'box hill': 'Melbourne - Inner East',
      'camberwell': 'Melbourne - Inner East',
      'hawthorn': 'Melbourne - Inner East',
      'st kilda': 'Melbourne - Inner South',
      'brighton': 'Melbourne - Inner South',
      'south melbourne': 'Melbourne - Inner South',
      'bundoora': 'Melbourne - North East',
      'heidelberg': 'Melbourne - North East',
      'greensborough': 'Melbourne - North East',
      
      // QLD regions
      'brisbane': 'Brisbane - Inner City',
      'gold coast': 'Brisbane - Inner City',
      'surfers paradise': 'Brisbane - Inner City',
      'southport': 'Brisbane - Inner City',
      'logan': 'Brisbane - East',
      'springwood': 'Brisbane - East',
      'beenleigh': 'Brisbane - East',
      'cairns': 'Brisbane - North',
      'townsville': 'Brisbane - North',
      'mackay': 'Brisbane - North',
      'rockhampton': 'Brisbane - North',
      'toowoomba': 'Brisbane - South',
      'ipswich': 'Brisbane - South',
      'redcliffe': 'Brisbane - South',
      
      // WA regions
      'perth': 'Perth - Inner',
      'fremantle': 'Perth - Inner',
      'joondalup': 'Perth - Inner',
      'armadale': 'Perth - North East',
      'gosnells': 'Perth - North East',
      'kwinana': 'Perth - North East',
      
      // SA regions
      'adelaide': 'Adelaide - Central',
      'mount barker': 'Adelaide - Central',
      'gawler': 'Adelaide - North',
      'elizabeth': 'Adelaide - North',
      'salisbury': 'Adelaide - North',
      
      // TAS regions
      'hobart': 'Hobart',
      'launceston': 'Hobart',
      'devonport': 'Hobart',
      'burnie': 'Hobart',
      
      // NT regions
      'darwin': 'Darwin',
      'alice springs': 'Darwin',
      'katherine': 'Darwin',
      'palmerston': 'Darwin',
      
      // ACT regions
      'canberra': 'Australian Capital Territory',
      'queanbeyan': 'Australian Capital Territory',
      'goulburn': 'Australian Capital Territory',
    };

    // Get all potential customers
    const customersResult = await pool.query('SELECT id, city FROM potential_customers WHERE region IS NULL');
    console.log(`📊 Found ${customersResult.rows.length} customers without region data`);

    let updatedCount = 0;
    let skippedCount = 0;

    // Update each customer
    for (const customer of customersResult.rows) {
      const cityKey = customer.city.toLowerCase().trim();
      const regionName = cityToRegionMap[cityKey];
      
      if (regionName) {
        await pool.query(
          'UPDATE potential_customers SET region = $1 WHERE id = $2',
          [regionName, customer.id]
        );
        updatedCount++;
        console.log(`✅ Updated customer ${customer.id} (${customer.city}) → ${regionName}`);
      } else {
        skippedCount++;
        console.log(`⚠️  Skipped customer ${customer.id} (${customer.city}) - no region mapping found`);
      }
    }

    console.log('\n📈 Summary:');
    console.log(`- Total customers processed: ${customersResult.rows.length}`);
    console.log(`- Successfully updated: ${updatedCount}`);
    console.log(`- Skipped (no mapping): ${skippedCount}`);
    console.log(`- Success rate: ${Math.round((updatedCount / customersResult.rows.length) * 100)}%`);

    // Verify the update
    const verifyResult = await pool.query('SELECT COUNT(*) as total, COUNT(region) as with_region FROM potential_customers');
    const stats = verifyResult.rows[0];
    console.log(`\n🔍 Verification:`);
    console.log(`- Total customers: ${stats.total}`);
    console.log(`- Customers with region: ${stats.with_region}`);
    console.log(`- Percentage with region: ${Math.round((stats.with_region / stats.total) * 100)}%`);

  } catch (error) {
    console.error('❌ Error updating regions:', error);
  } finally {
    await pool.end();
  }
}

updateRegions();
