import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { australianStates, australianSuburbs } from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

// Australian states mapping
const stateMapping: Record<string, number> = {
  'NSW': 1,  // New South Wales
  'VIC': 2,  // Victoria
  'QLD': 3,  // Queensland
  'WA': 4,   // Western Australia
  'SA': 5,   // South Australia
  'TAS': 6,  // Tasmania
  'NT': 7,   // Northern Territory
  'ACT': 8,  // Australian Capital Territory
};

async function seedPostcodes() {
  console.log('Starting postcode seeding...');
  
  try {
    // Download the CSV data
    const response = await fetch('https://raw.githubusercontent.com/matthewproctor/australianpostcodes/master/australian_postcodes.csv');
    const csvText = await response.text();
    
    console.log('Downloaded CSV data');
    
    // Parse CSV data
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    
    console.log('CSV headers:', headers);
    
    // Find column indices
    const postcodeIndex = headers.indexOf('postcode');
    const localityIndex = headers.indexOf('locality');
    const stateIndex = headers.indexOf('state');
    
    if (postcodeIndex === -1 || localityIndex === -1 || stateIndex === -1) {
      throw new Error('Required columns not found in CSV');
    }
    
    console.log(`Found columns - postcode: ${postcodeIndex}, locality: ${localityIndex}, state: ${stateIndex}`);
    
    // Check if we already have data
    const existingCount = await db.select().from(australianSuburbs);
    if (existingCount.length > 100) {
      console.log(`Database already has ${existingCount.length} suburbs. Skipping seed.`);
      return;
    }
    
    console.log('Database has limited suburb data, proceeding with full seed...');
    
    // Process data in batches
    const batchSize = 500;
    const suburbsToInsert = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      // Parse CSV line (handling quoted fields)
      const columns = [];
      let currentColumn = '';
      let insideQuotes = false;
      
      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        if (char === '"') {
          insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
          columns.push(currentColumn.trim());
          currentColumn = '';
        } else {
          currentColumn += char;
        }
      }
      columns.push(currentColumn.trim()); // Add the last column
      
      if (columns.length <= Math.max(postcodeIndex, localityIndex, stateIndex)) {
        continue; // Skip malformed lines
      }
      
      const postcode = columns[postcodeIndex]?.replace(/"/g, '').trim();
      const locality = columns[localityIndex]?.replace(/"/g, '').trim();
      const state = columns[stateIndex]?.replace(/"/g, '').trim();
      
      if (!postcode || !locality || !state || !stateMapping[state]) {
        continue; // Skip invalid entries
      }
      
      // Only include numeric postcodes (4 digits)
      if (!/^\d{4}$/.test(postcode)) {
        continue;
      }
      
      suburbsToInsert.push({
        postcode,
        suburb: locality,
        stateId: stateMapping[state],
      });
      
      // Insert in batches
      if (suburbsToInsert.length >= batchSize) {
        await db.insert(australianSuburbs).values(suburbsToInsert);
        console.log(`Inserted ${suburbsToInsert.length} suburbs (total processed: ${i})`);
        suburbsToInsert.length = 0; // Clear array
      }
    }
    
    // Insert remaining suburbs
    if (suburbsToInsert.length > 0) {
      await db.insert(australianSuburbs).values(suburbsToInsert);
      console.log(`Inserted final ${suburbsToInsert.length} suburbs`);
    }
    
    // Get final count
    const totalCount = await db.select().from(australianSuburbs);
    console.log(`Successfully seeded ${totalCount.length} Australian postcodes and suburbs!`);
    
  } catch (error) {
    console.error('Error seeding postcodes:', error);
    throw error;
  }
}

// Run the seeding
seedPostcodes()
  .then(() => {
    console.log('Postcode seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Postcode seeding failed:', error);
    process.exit(1);
  });

export { seedPostcodes };