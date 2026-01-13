import { db } from './dist/server/db.js';
import { australianRegions, australianStates } from './dist/shared/schema.js';

async function addSampleRegions() {
  try {
    console.log('🏗️ Adding sample Australian regions...\n');

    // First, get the state IDs
    const states = await db.select().from(australianStates);
    console.log('📋 Found states:', states.map(s => `${s.name} (ID: ${s.id})`));

    const stateMap = {};
    states.forEach(state => {
      stateMap[state.name] = state.id;
    });

    // Sample regions for each state
    const sampleRegions = [
      // New South Wales
      { name: 'Sydney - Inner West', code: '10101', stateName: 'New South Wales' },
      { name: 'Sydney - Eastern Suburbs', code: '10102', stateName: 'New South Wales' },
      { name: 'Sydney - Northern Beaches', code: '10103', stateName: 'New South Wales' },
      { name: 'Sydney - South West', code: '10104', stateName: 'New South Wales' },
      { name: 'Sydney - Outer West and Blue Mountains', code: '10105', stateName: 'New South Wales' },
      { name: 'Central Coast', code: '10106', stateName: 'New South Wales' },
      { name: 'Newcastle and Lake Macquarie', code: '10107', stateName: 'New South Wales' },
      { name: 'Hunter Valley', code: '10108', stateName: 'New South Wales' },
      { name: 'Illawarra', code: '10109', stateName: 'New South Wales' },
      { name: 'Richmond - Tweed', code: '10110', stateName: 'New South Wales' },
      { name: 'Mid North Coast', code: '10111', stateName: 'New South Wales' },
      { name: 'Northern NSW', code: '10112', stateName: 'New South Wales' },
      { name: 'Central West', code: '10113', stateName: 'New South Wales' },
      { name: 'Southern Highlands and Shoalhaven', code: '10114', stateName: 'New South Wales' },
      { name: 'Capital Region', code: '10115', stateName: 'New South Wales' },
      { name: 'Riverina', code: '10116', stateName: 'New South Wales' },
      { name: 'Murray', code: '10117', stateName: 'New South Wales' },
      { name: 'Far West and Orana', code: '10118', stateName: 'New South Wales' },

      // Victoria
      { name: 'Melbourne - Inner', code: '20101', stateName: 'Victoria' },
      { name: 'Melbourne - Inner East', code: '20102', stateName: 'Victoria' },
      { name: 'Melbourne - Inner South', code: '20103', stateName: 'Victoria' },
      { name: 'Melbourne - Inner West', code: '20104', stateName: 'Victoria' },
      { name: 'Melbourne - North East', code: '20105', stateName: 'Victoria' },
      { name: 'Melbourne - North West', code: '20106', stateName: 'Victoria' },
      { name: 'Melbourne - Outer East', code: '20107', stateName: 'Victoria' },
      { name: 'Melbourne - South East', code: '20108', stateName: 'Victoria' },
      { name: 'Melbourne - West', code: '20109', stateName: 'Victoria' },
      { name: 'Mornington Peninsula', code: '20110', stateName: 'Victoria' },
      { name: 'Geelong', code: '20111', stateName: 'Victoria' },
      { name: 'Ballarat', code: '20112', stateName: 'Victoria' },
      { name: 'Bendigo', code: '20113', stateName: 'Victoria' },
      { name: 'Shepparton', code: '20114', stateName: 'Victoria' },
      { name: 'Latrobe - Gippsland', code: '20115', stateName: 'Victoria' },
      { name: 'Hume', code: '20116', stateName: 'Victoria' },
      { name: 'Warrnambool and South West', code: '20117', stateName: 'Victoria' },
      { name: 'Barwon - West', code: '20118', stateName: 'Victoria' },

      // Queensland
      { name: 'Brisbane - Inner City', code: '30101', stateName: 'Queensland' },
      { name: 'Brisbane - East', code: '30102', stateName: 'Queensland' },
      { name: 'Brisbane - North', code: '30103', stateName: 'Queensland' },
      { name: 'Brisbane - South', code: '30104', stateName: 'Queensland' },
      { name: 'Brisbane - West', code: '30105', stateName: 'Queensland' },
      { name: 'Brisbane - Outer East', code: '30106', stateName: 'Queensland' },
      { name: 'Brisbane - Outer South', code: '30107', stateName: 'Queensland' },
      { name: 'Brisbane - Outer West', code: '30108', stateName: 'Queensland' },
      { name: 'Gold Coast', code: '30109', stateName: 'Queensland' },
      { name: 'Sunshine Coast', code: '30110', stateName: 'Queensland' },
      { name: 'Toowoomba', code: '30111', stateName: 'Queensland' },
      { name: 'Townsville', code: '30112', stateName: 'Queensland' },
      { name: 'Cairns', code: '30113', stateName: 'Queensland' },
      { name: 'Ipswich', code: '30114', stateName: 'Queensland' },
      { name: 'Logan - Beaudesert', code: '30115', stateName: 'Queensland' },
      { name: 'Moreton Bay - North', code: '30116', stateName: 'Queensland' },
      { name: 'Moreton Bay - South', code: '30117', stateName: 'Queensland' },
      { name: 'Redland', code: '30118', stateName: 'Queensland' },
      { name: 'Wide Bay', code: '30119', stateName: 'Queensland' },
      { name: 'Darling Downs - Maranoa', code: '30120', stateName: 'Queensland' },
      { name: 'Central Queensland', code: '30121', stateName: 'Queensland' },
      { name: 'Mackay - Isaac - Whitsunday', code: '30122', stateName: 'Queensland' },
      { name: 'Northern', code: '30123', stateName: 'Queensland' },
      { name: 'Far North', code: '30124', stateName: 'Queensland' },
      { name: 'Outback - North', code: '30125', stateName: 'Queensland' },
      { name: 'Outback - South', code: '30126', stateName: 'Queensland' },

      // Western Australia
      { name: 'Perth - Inner', code: '40101', stateName: 'Western Australia' },
      { name: 'Perth - North East', code: '40102', stateName: 'Western Australia' },
      { name: 'Perth - North West', code: '40103', stateName: 'Western Australia' },
      { name: 'Perth - South East', code: '40104', stateName: 'Western Australia' },
      { name: 'Perth - South West', code: '40105', stateName: 'Western Australia' },
      { name: 'Perth - Outer North East', code: '40106', stateName: 'Western Australia' },
      { name: 'Perth - Outer North West', code: '40107', stateName: 'Western Australia' },
      { name: 'Perth - Outer South East', code: '40108', stateName: 'Western Australia' },
      { name: 'Perth - Outer South West', code: '40109', stateName: 'Western Australia' },
      { name: 'Mandurah', code: '40110', stateName: 'Western Australia' },
      { name: 'Bunbury', code: '40111', stateName: 'Western Australia' },
      { name: 'Geraldton', code: '40112', stateName: 'Western Australia' },
      { name: 'Kalgoorlie - Boulder', code: '40113', stateName: 'Western Australia' },
      { name: 'Albany', code: '40114', stateName: 'Western Australia' },
      { name: 'Busselton', code: '40115', stateName: 'Western Australia' },
      { name: 'Warren - Blackwood', code: '40116', stateName: 'Western Australia' },
      { name: 'Wheat Belt - North', code: '40117', stateName: 'Western Australia' },
      { name: 'Wheat Belt - South', code: '40118', stateName: 'Western Australia' },
      { name: 'Outback - North', code: '40119', stateName: 'Western Australia' },
      { name: 'Outback - South', code: '40120', stateName: 'Western Australia' },

      // South Australia
      { name: 'Adelaide - Central and Hills', code: '50101', stateName: 'South Australia' },
      { name: 'Adelaide - North', code: '50102', stateName: 'South Australia' },
      { name: 'Adelaide - South', code: '50103', stateName: 'South Australia' },
      { name: 'Adelaide - West', code: '50104', stateName: 'South Australia' },
      { name: 'Adelaide - Outer North', code: '50105', stateName: 'South Australia' },
      { name: 'Adelaide - Outer South', code: '50106', stateName: 'South Australia' },
      { name: 'Adelaide - Hills', code: '50107', stateName: 'South Australia' },
      { name: 'Barossa - Light - Lower North', code: '50108', stateName: 'South Australia' },
      { name: 'Yorke - Lower North', code: '50109', stateName: 'South Australia' },
      { name: 'Murray and Mallee', code: '50110', stateName: 'South Australia' },
      { name: 'Fleurieu - Kangaroo Island', code: '50111', stateName: 'South Australia' },
      { name: 'Limestone Coast', code: '50112', stateName: 'South Australia' },
      { name: 'Eyre Peninsula and South West', code: '50113', stateName: 'South Australia' },
      { name: 'Outback', code: '50114', stateName: 'South Australia' },

      // Tasmania
      { name: 'Greater Hobart', code: '60101', stateName: 'Tasmania' },
      { name: 'Southern Tasmania', code: '60102', stateName: 'Tasmania' },
      { name: 'Northern Tasmania', code: '60103', stateName: 'Tasmania' },
      { name: 'West and North West', code: '60104', stateName: 'Tasmania' },
      { name: 'South East', code: '60105', stateName: 'Tasmania' },

      // Australian Capital Territory
      { name: 'Australian Capital Territory', code: '70101', stateName: 'Australian Capital Territory' },

      // Northern Territory
      { name: 'Darwin', code: '80101', stateName: 'Northern Territory' },
      { name: 'Northern Territory - Outback', code: '80102', stateName: 'Northern Territory' },
    ];

    console.log(`\n📝 Adding ${sampleRegions.length} regions...`);

    let addedCount = 0;
    for (const region of sampleRegions) {
      const stateId = stateMap[region.stateName];
      if (!stateId) {
        console.warn(`⚠️ State not found: ${region.stateName}`);
        continue;
      }

      try {
        await db.insert(australianRegions).values({
          name: region.name,
          code: region.code,
          stateId: stateId,
        });
        addedCount++;
        console.log(`✅ Added: ${region.name} (${region.stateName})`);
      } catch (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`⏭️ Skipped (exists): ${region.name}`);
        } else {
          console.error(`❌ Error adding ${region.name}:`, error.message);
        }
      }
    }

    console.log(`\n🎉 Successfully added ${addedCount} regions!`);
    
    // Verify the regions were added
    const totalRegions = await db.select().from(australianRegions);
    console.log(`\n📊 Total regions in database: ${totalRegions.length}`);
    
    // Show regions by state
    const regionsByState = {};
    totalRegions.forEach(region => {
      const stateName = states.find(s => s.id === region.stateId)?.name || 'Unknown';
      if (!regionsByState[stateName]) {
        regionsByState[stateName] = [];
      }
      regionsByState[stateName].push(region.name);
    });

    console.log('\n📋 Regions by state:');
    Object.keys(regionsByState).forEach(stateName => {
      console.log(`\n${stateName}: ${regionsByState[stateName].length} regions`);
      regionsByState[stateName].slice(0, 3).forEach(regionName => {
        console.log(`  - ${regionName}`);
      });
      if (regionsByState[stateName].length > 3) {
        console.log(`  ... and ${regionsByState[stateName].length - 3} more`);
      }
    });

  } catch (error) {
    console.error('❌ Error adding sample regions:', error);
  } finally {
    process.exit(0);
  }
}

addSampleRegions();
