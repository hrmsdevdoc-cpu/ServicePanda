import { db } from "./db";
import { australianRegions, australianSuburbs } from "@shared/schema";
import { eq } from "drizzle-orm";

// SA4 Regions data from Australian Bureau of Statistics
const regionData = [
  // New South Wales
  { name: "Sydney - City and Inner South", code: "12701", stateId: 1 },
  { name: "Sydney - Eastern Suburbs", code: "12702", stateId: 1 },
  { name: "Sydney - Inner South West", code: "12703", stateId: 1 },
  { name: "Sydney - Inner West", code: "12704", stateId: 1 },
  { name: "Sydney - North Sydney and Hornsby", code: "12705", stateId: 1 },
  { name: "Sydney - Northern Beaches", code: "12706", stateId: 1 },
  { name: "Sydney - Parramatta", code: "12707", stateId: 1 },
  { name: "Sydney - Ryde", code: "12708", stateId: 1 },
  { name: "Sydney - South West", code: "12709", stateId: 1 },
  { name: "Sydney - Sutherland", code: "12710", stateId: 1 },
  { name: "Sydney - Baulkham Hills and Hawkesbury", code: "12711", stateId: 1 },
  { name: "Sydney - Blacktown", code: "12712", stateId: 1 },
  { name: "Sydney - Outer South West", code: "12713", stateId: 1 },
  { name: "Sydney - Outer West and Blue Mountains", code: "12714", stateId: 1 },
  { name: "Newcastle and Lake Macquarie", code: "11101", stateId: 1 },
  { name: "Central Coast", code: "11102", stateId: 1 },
  { name: "Illawarra", code: "11103", stateId: 1 },
  { name: "Southern Highlands and Shoalhaven", code: "11104", stateId: 1 },
  { name: "Mid North Coast", code: "11201", stateId: 1 },
  { name: "Northern Rivers", code: "11202", stateId: 1 },
  { name: "Richmond - Tweed", code: "11203", stateId: 1 },
  
  // Victoria
  { name: "Melbourne - Inner", code: "20601", stateId: 2 },
  { name: "Melbourne - Inner East", code: "20602", stateId: 2 },
  { name: "Melbourne - Inner South", code: "20603", stateId: 2 },
  { name: "Melbourne - North East", code: "20604", stateId: 2 },
  { name: "Melbourne - North West", code: "20605", stateId: 2 },
  { name: "Melbourne - Outer East", code: "20606", stateId: 2 },
  { name: "Melbourne - South East", code: "20607", stateId: 2 },
  { name: "Melbourne - West", code: "20608", stateId: 2 },
  { name: "Mornington Peninsula", code: "20609", stateId: 2 },
  { name: "Geelong", code: "21801", stateId: 2 },
  { name: "Ballarat", code: "21802", stateId: 2 },
  { name: "Bendigo", code: "21803", stateId: 2 },
  { name: "Latrobe Valley", code: "21804", stateId: 2 },
  
  // Queensland
  { name: "Brisbane - City", code: "30701", stateId: 3 },
  { name: "Brisbane - East", code: "30702", stateId: 3 },
  { name: "Brisbane - North", code: "30703", stateId: 3 },
  { name: "Brisbane - South", code: "30704", stateId: 3 },
  { name: "Brisbane - West", code: "30705", stateId: 3 },
  { name: "Ipswich", code: "30706", stateId: 3 },
  { name: "Logan - Beaudesert", code: "30707", stateId: 3 },
  { name: "Moreton Bay - North", code: "30708", stateId: 3 },
  { name: "Moreton Bay - South", code: "30709", stateId: 3 },
  { name: "Gold Coast", code: "30504", stateId: 3 },
  { name: "Sunshine Coast", code: "31601", stateId: 3 },
  { name: "Toowoomba", code: "31901", stateId: 3 },
  { name: "Cairns", code: "31801", stateId: 3 },
  { name: "Townsville", code: "31802", stateId: 3 },
  
  // Western Australia
  { name: "Perth - Inner", code: "50501", stateId: 5 },
  { name: "Perth - North East", code: "50502", stateId: 5 },
  { name: "Perth - North West", code: "50503", stateId: 5 },
  { name: "Perth - South East", code: "50504", stateId: 5 },
  { name: "Perth - South West", code: "50505", stateId: 5 },
  { name: "Mandurah", code: "50506", stateId: 5 },
  { name: "Bunbury", code: "59901", stateId: 5 },
  
  // South Australia
  { name: "Adelaide - Central and Hills", code: "40101", stateId: 4 },
  { name: "Adelaide - North", code: "40102", stateId: 4 },
  { name: "Adelaide - South", code: "40103", stateId: 4 },
  { name: "Adelaide - West", code: "40104", stateId: 4 },
  { name: "Barossa - Yorke - Mid North", code: "49901", stateId: 4 },
  
  // Tasmania  
  { name: "Hobart", code: "60101", stateId: 6 },
  { name: "Launceston and North East", code: "69901", stateId: 6 },
  { name: "South East", code: "69902", stateId: 6 },
  { name: "West and North West", code: "69903", stateId: 6 },
  
  // Northern Territory
  { name: "Darwin", code: "70101", stateId: 7 },
  { name: "Northern Territory - Outback", code: "79901", stateId: 7 },
  
  // Australian Capital Territory
  { name: "Australian Capital Territory", code: "80101", stateId: 8 },
];

export async function seedRegions() {
  console.log("🌏 Starting to seed Australian regions...");
  
  try {
    // Check if regions already exist
    const existingRegions = await db.select().from(australianRegions).limit(1);
    
    if (existingRegions.length > 0) {
      console.log("✅ Regions already seeded, skipping...");
      return;
    }
    
    // Insert regions
    console.log("📍 Inserting SA4 regions...");
    await db.insert(australianRegions).values(regionData);
    
    console.log(`✅ Successfully seeded ${regionData.length} Australian regions!`);
    
    // Note: We'll need to update existing suburbs with regionId later
    // This would require a correspondence mapping from ABS data
    console.log("📝 Note: Suburb-to-region mapping will be added in a future update");
    
  } catch (error) {
    console.error("❌ Error seeding regions:", error);
    throw error;
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedRegions()
    .then(() => {
      console.log("🎉 Region seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Region seeding failed:", error);
      process.exit(1);
    });
}