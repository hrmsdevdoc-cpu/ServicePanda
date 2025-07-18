import { storage } from "./storage";

const serviceCategories = [
  {
    id: 1,
    name: "domestic-cleaning",
    displayName: "Domestic Cleaning",
    description: "Professional home cleaning services",
    iconName: "home",
    isActive: true,
  },
  {
    id: 2,
    name: "bond-cleaning",
    displayName: "Bond Cleaning",
    description: "End of lease cleaning services",
    iconName: "key",
    isActive: true,
  },
  {
    id: 3,
    name: "carpet-cleaning",
    displayName: "Carpet Cleaning",
    description: "Professional carpet and upholstery cleaning",
    iconName: "sofa",
    isActive: true,
  },
  {
    id: 4,
    name: "pest-control",
    displayName: "Pest Control",
    description: "Pest inspection and treatment services",
    iconName: "bug",
    isActive: true,
  },
  {
    id: 5,
    name: "gardening",
    displayName: "Gardening",
    description: "Garden maintenance and landscaping",
    iconName: "sprout",
    isActive: true,
  },
  {
    id: 6,
    name: "removals",
    displayName: "Removals",
    description: "Professional moving and removal services",
    iconName: "truck",
    isActive: true,
  },
  {
    id: 7,
    name: "handyman",
    displayName: "Handyman",
    description: "General handyman and repair services",
    iconName: "wrench",
    isActive: true,
  },
  {
    id: 8,
    name: "electrician",
    displayName: "Electrical",
    description: "Licensed electrical services",
    iconName: "zap",
    isActive: true,
  },
];

const australianStates = [
  { id: 1, name: "NSW", fullName: "New South Wales" },
  { id: 2, name: "VIC", fullName: "Victoria" },
  { id: 3, name: "QLD", fullName: "Queensland" },
  { id: 4, name: "WA", fullName: "Western Australia" },
  { id: 5, name: "SA", fullName: "South Australia" },
  { id: 6, name: "TAS", fullName: "Tasmania" },
  { id: 7, name: "ACT", fullName: "Australian Capital Territory" },
  { id: 8, name: "NT", fullName: "Northern Territory" },
];

const sampleSuburbs = [
  // Sydney, NSW
  { postcode: "2000", suburb: "Sydney", state: "NSW" },
  { postcode: "2001", suburb: "Sydney", state: "NSW" },
  { postcode: "2010", suburb: "Surry Hills", state: "NSW" },
  { postcode: "2020", suburb: "Mascot", state: "NSW" },
  { postcode: "2060", suburb: "North Sydney", state: "NSW" },
  { postcode: "2150", suburb: "Parramatta", state: "NSW" },
  
  // Melbourne, VIC
  { postcode: "3000", suburb: "Melbourne", state: "VIC" },
  { postcode: "3001", suburb: "Melbourne", state: "VIC" },
  { postcode: "3008", suburb: "Docklands", state: "VIC" },
  { postcode: "3141", suburb: "South Yarra", state: "VIC" },
  { postcode: "3182", suburb: "St Kilda", state: "VIC" },
  
  // Brisbane, QLD
  { postcode: "4000", suburb: "Brisbane", state: "QLD" },
  { postcode: "4001", suburb: "Brisbane", state: "QLD" },
  { postcode: "4101", suburb: "South Brisbane", state: "QLD" },
  { postcode: "4169", suburb: "Kangaroo Point", state: "QLD" },
  
  // Perth, WA
  { postcode: "6000", suburb: "Perth", state: "WA" },
  { postcode: "6004", suburb: "East Perth", state: "WA" },
  { postcode: "6050", suburb: "Mount Lawley", state: "WA" },
  
  // Adelaide, SA
  { postcode: "5000", suburb: "Adelaide", state: "SA" },
  { postcode: "5006", suburb: "North Adelaide", state: "SA" },
];

export async function seedDatabase() {
  try {
    console.log("Starting database seeding...");
    
    // Seed service categories
    console.log("Seeding service categories...");
    for (const category of serviceCategories) {
      try {
        await storage.createServiceCategory(category);
        console.log(`Created service category: ${category.displayName}`);
      } catch (error) {
        console.log(`Service category ${category.displayName} already exists or error occurred`);
      }
    }
    
    // Seed Australian states
    console.log("Seeding Australian states...");
    for (const state of australianStates) {
      try {
        await storage.createAustralianState(state);
        console.log(`Created state: ${state.fullName}`);
      } catch (error) {
        console.log(`State ${state.fullName} already exists or error occurred`);
      }
    }
    
    // Seed sample suburbs
    console.log("Seeding sample suburbs...");
    for (const suburb of sampleSuburbs) {
      try {
        await storage.createSuburb(suburb);
        console.log(`Created suburb: ${suburb.suburb}, ${suburb.state} ${suburb.postcode}`);
      } catch (error) {
        console.log(`Suburb ${suburb.suburb} already exists or error occurred`);
      }
    }
    
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run seeding
seedDatabase().then(() => {
  console.log("Seeding process finished");
  process.exit(0);
});