const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { serviceRequests, leadOffers, serviceProviders, users, serviceCategories } = require('./shared/schema');
const { eq } = require('drizzle-orm');

// Database connection
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/servicepanda';
const client = postgres(connectionString);
const db = drizzle(client);

async function checkLeadsData() {
  try {
    console.log('Checking leads data in database...\n');

    // Check service requests (leads)
    const requests = await db.select().from(serviceRequests);
    console.log(`Service Requests (Leads): ${requests.length}`);
    if (requests.length > 0) {
      console.log('Sample requests:');
      requests.slice(0, 3).forEach((req, i) => {
        console.log(`  ${i + 1}. ID: ${req.id}, Category: ${req.categoryId}, Status: ${req.status}, Customer: ${req.customerId}`);
      });
    }

    // Check lead offers
    const offers = await db.select().from(leadOffers);
    console.log(`\nLead Offers: ${offers.length}`);
    if (offers.length > 0) {
      console.log('Sample offers:');
      offers.slice(0, 3).forEach((offer, i) => {
        console.log(`  ${i + 1}. ID: ${offer.id}, Request: ${offer.requestId}, Provider: ${offer.providerId}, Status: ${offer.status}, Type: ${offer.offerType}`);
      });
    }

    // Check service providers
    const providers = await db.select().from(serviceProviders);
    console.log(`\nService Providers: ${providers.length}`);
    if (providers.length > 0) {
      console.log('Sample providers:');
      providers.slice(0, 3).forEach((provider, i) => {
        console.log(`  ${i + 1}. ID: ${provider.id}, Name: ${provider.firstName} ${provider.lastName}, Email: ${provider.email}`);
      });
    }

    // Check if there are any leads for provider ID 1
    if (providers.length > 0) {
      const providerId = providers[0].id;
      console.log(`\nChecking leads for provider ID ${providerId}...`);
      
      const providerLeads = await db
        .select()
        .from(leadOffers)
        .where(eq(leadOffers.providerId, providerId));
      
      console.log(`Provider ${providerId} has ${providerLeads.length} lead offers`);
      
      if (providerLeads.length > 0) {
        console.log('Lead offers for this provider:');
        providerLeads.forEach((offer, i) => {
          console.log(`  ${i + 1}. Request: ${offer.requestId}, Status: ${offer.status}, Type: ${offer.offerType}`);
        });
      }
    }

  } catch (error) {
    console.error('Error checking leads data:', error);
  } finally {
    await client.end();
  }
}

checkLeadsData();
