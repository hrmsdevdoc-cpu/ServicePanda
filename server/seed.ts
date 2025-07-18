import { storage } from "./storage";

const serviceCategories = [
  // Most common 8 services
  {
    id: 1,
    name: "Domestic Cleaning",
    description: "Professional home cleaning services",
    icon: "home",
    active: true,
    popular: true,
  },
  {
    id: 2,
    name: "Bond Cleaning",
    description: "End of lease cleaning services",
    icon: "key",
    active: true,
    popular: true,
  },
  {
    id: 3,
    name: "Carpet Cleaning",
    description: "Professional carpet and upholstery cleaning",
    icon: "sofa",
    active: true,
    popular: true,
  },
  {
    id: 4,
    name: "Pest Control",
    description: "Pest inspection and treatment services",
    icon: "bug",
    active: true,
    popular: true,
  },
  {
    id: 5,
    name: "Gardening",
    description: "Garden maintenance and landscaping",
    icon: "sprout",
    active: true,
    popular: true,
  },
  {
    id: 6,
    name: "Removals",
    description: "Professional moving and removal services",
    icon: "truck",
    active: true,
    popular: true,
  },
  {
    id: 7,
    name: "Handyman",
    description: "General handyman and repair services",
    icon: "wrench",
    active: true,
    popular: true,
  },
  {
    id: 8,
    name: "Electrical",
    description: "Licensed electrical services",
    icon: "zap",
    active: true,
    popular: true,
  },
  // Additional services
  {
    id: 9,
    name: "Plumbing",
    description: "Professional plumbing services and repairs",
    icon: "wrench",
    active: true,
    popular: false,
  },
  {
    id: 10,
    name: "Air Conditioning",
    description: "AC installation, repair and maintenance",
    icon: "snowflake",
    active: true,
    popular: false,
  },
  {
    id: 11,
    name: "Painting",
    description: "Interior and exterior painting services",
    icon: "paintbrush",
    active: true,
    popular: false,
  },
  {
    id: 12,
    name: "Roofing",
    description: "Roof repairs and installations",
    icon: "home",
    active: true,
    popular: false,
  },
  {
    id: 13,
    name: "Security Systems",
    description: "Security system installation and monitoring",
    icon: "shield-check",
    active: true,
    popular: false,
  },
  {
    id: 14,
    name: "Pool Maintenance",
    description: "Pool cleaning and maintenance services",
    icon: "waves",
    active: true,
    popular: false,
  },
  {
    id: 15,
    name: "Window Cleaning",
    description: "Professional window cleaning services",
    icon: "square",
    active: true,
    popular: false,
  },
  {
    id: 16,
    name: "Appliance Repair",
    description: "Repair services for home appliances",
    icon: "settings",
    active: true,
    popular: false,
  },
  {
    id: 17,
    name: "Locksmith",
    description: "Lock installation and emergency lockout services",
    icon: "key",
    active: true,
    popular: false,
  },
  {
    id: 18,
    name: "Solar Installation",
    description: "Solar panel installation and maintenance",
    icon: "sun",
    active: true,
    popular: false,
  },
  {
    id: 19,
    name: "Gutter Cleaning",
    description: "Gutter cleaning and maintenance services",
    icon: "home",
    active: true,
    popular: false,
  },
  {
    id: 20,
    name: "Tree Services",
    description: "Tree removal, pruning and stump grinding",
    icon: "tree-pine",
    active: true,
    popular: false,
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
        console.log(`Created service category: ${category.name}`);
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