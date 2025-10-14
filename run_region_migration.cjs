import { db } from './dist/server/db.js';
import { sql } from 'drizzle-orm';

async function runMigration() {
  try {
    console.log('🔄 Running migration to add regionId to potential_customers...\n');

    // Add regionId column
    console.log('1. Adding region_id column...');
    await db.execute(sql`ALTER TABLE potential_customers ADD COLUMN region_id INTEGER REFERENCES australian_regions(id)`);
    console.log('✅ Column added successfully');

    // Create index
    console.log('2. Creating index...');
    await db.execute(sql`CREATE INDEX idx_potential_customers_region_id ON potential_customers(region_id)`);
    console.log('✅ Index created successfully');

    // Update existing customers with region mapping
    console.log('3. Updating existing customers with region mapping...');
    
    // NSW regions
    await db.execute(sql`UPDATE potential_customers SET region_id = 1 WHERE state = 'NSW' AND (city ILIKE '%sydney%' OR city ILIKE '%newcastle%')`);
    await db.execute(sql`UPDATE potential_customers SET region_id = 2 WHERE state = 'NSW' AND city ILIKE '%wollongong%'`);
    
    // VIC regions
    await db.execute(sql`UPDATE potential_customers SET region_id = 5 WHERE state = 'VIC' AND (city ILIKE '%melbourne%' OR city ILIKE '%geelong%')`);
    
    // QLD regions
    await db.execute(sql`UPDATE potential_customers SET region_id = 9 WHERE state = 'QLD' AND (city ILIKE '%brisbane%' OR city ILIKE '%gold coast%')`);
    await db.execute(sql`UPDATE potential_customers SET region_id = 11 WHERE state = 'QLD' AND (city ILIKE '%cairns%' OR city ILIKE '%townsville%')`);
    
    // WA regions
    await db.execute(sql`UPDATE potential_customers SET region_id = 13 WHERE state = 'WA' AND (city ILIKE '%perth%' OR city ILIKE '%fremantle%')`);
    
    // SA regions
    await db.execute(sql`UPDATE potential_customers SET region_id = 15 WHERE state = 'SA' AND city ILIKE '%adelaide%'`);
    
    // TAS regions
    await db.execute(sql`UPDATE potential_customers SET region_id = 17 WHERE state = 'TAS' AND (city ILIKE '%hobart%' OR city ILIKE '%launceston%')`);
    
    // NT regions
    await db.execute(sql`UPDATE potential_customers SET region_id = 18 WHERE state = 'NT' AND (city ILIKE '%darwin%' OR city ILIKE '%alice springs%')`);
    
    // ACT regions
    await db.execute(sql`UPDATE potential_customers SET region_id = 19 WHERE state = 'ACT' AND city ILIKE '%canberra%'`);

    console.log('✅ Region mapping completed');

    // Check results
    console.log('4. Checking results...');
    const result = await db.execute(sql`SELECT COUNT(*) as total, COUNT(region_id) as with_region FROM potential_customers`);
    console.log('📊 Migration results:', result.rows[0]);

    console.log('\n🎉 Migration completed successfully!');
    console.log('💡 Potential customers now have region information for better filtering.');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

runMigration();
