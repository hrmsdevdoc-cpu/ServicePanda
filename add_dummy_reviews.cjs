const { Pool } = require('pg');
require('dotenv').config();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:IgOOJDuqNJEelGTGCGedMKCUCaEhGKRm@autorack.proxy.rlwy.net:11100/railway',
  ssl: { rejectUnauthorized: false }
});

// Sample review data with variety
const sampleReviews = [
  {
    overallRating: 5,
    qualityRating: 5,
    professionalismRating: 5,
    timelinessRating: 4,
    valueRating: 5,
    reviewText: "Excellent service! The technician was very professional and fixed my HVAC system quickly. Would definitely recommend and use again.",
    isPublic: true
  },
  {
    overallRating: 4,
    qualityRating: 4,
    professionalismRating: 5,
    timelinessRating: 4,
    valueRating: 4,
    reviewText: "Great plumbing work. Arrived on time and explained everything clearly. Fair pricing for quality work.",
    isPublic: true
  },
  {
    overallRating: 5,
    qualityRating: 5,
    professionalismRating: 5,
    timelinessRating: 5,
    valueRating: 4,
    reviewText: "Outstanding electrical work! Very thorough and safety-conscious. Cleaned up after the job too.",
    isPublic: true
  },
  {
    overallRating: 4,
    qualityRating: 4,
    professionalismRating: 4,
    timelinessRating: 3,
    valueRating: 4,
    reviewText: "Good cleaning service overall. Took a bit longer than expected but the results were worth it.",
    isPublic: true
  },
  {
    overallRating: 5,
    qualityRating: 5,
    professionalismRating: 5,
    timelinessRating: 5,
    valueRating: 5,
    reviewText: "Perfect carpentry work! Built exactly what I wanted and finished ahead of schedule. Highly recommended!",
    isPublic: true
  },
  {
    overallRating: 4,
    qualityRating: 4,
    professionalismRating: 4,
    timelinessRating: 4,
    valueRating: 3,
    reviewText: "Good landscaping service. The team worked hard and the garden looks great. A bit pricey but quality work.",
    isPublic: true
  },
  {
    overallRating: 3,
    qualityRating: 3,
    professionalismRating: 4,
    timelinessRating: 2,
    valueRating: 3,
    reviewText: "Decent painting job but took longer than promised. Communication could have been better.",
    isPublic: true
  },
  {
    overallRating: 5,
    qualityRating: 5,
    professionalismRating: 5,
    timelinessRating: 5,
    valueRating: 5,
    reviewText: "Amazing appliance repair! Fixed my washing machine in no time. Very knowledgeable and friendly technician.",
    isPublic: true
  },
  {
    overallRating: 4,
    qualityRating: 4,
    professionalismRating: 5,
    timelinessRating: 4,
    valueRating: 4,
    reviewText: "Professional cleaning service. Attention to detail was impressive. Will book again for sure.",
    isPublic: true
  },
  {
    overallRating: 5,
    qualityRating: 5,
    professionalismRating: 4,
    timelinessRating: 5,
    valueRating: 5,
    reviewText: "Excellent HVAC maintenance service. Very thorough inspection and great advice for future care.",
    isPublic: true
  }
];

async function addDummyReviews() {
  try {
    console.log('🔍 Starting to add dummy reviews...');

    // Get existing customers
    console.log('📋 Fetching existing customers...');
    const customersResult = await pool.query('SELECT id, first_name, last_name, email FROM users LIMIT 5');
    const customers = customersResult.rows;
    
    if (customers.length === 0) {
      console.log('❌ No customers found! Please create some customers first.');
      return;
    }
    
    console.log(`✅ Found ${customers.length} customers`);

    // Get existing providers
    console.log('📋 Fetching existing providers...');
    const providersResult = await pool.query('SELECT id, first_name, last_name, email FROM service_providers LIMIT 10');
    const providers = providersResult.rows;
    
    if (providers.length === 0) {
      console.log('❌ No providers found! Please create some providers first.');
      return;
    }
    
    console.log(`✅ Found ${providers.length} providers`);

    // Get existing service requests
    console.log('📋 Fetching existing service requests...');
    const requestsResult = await pool.query('SELECT id, customer_id, category_id, description FROM service_requests LIMIT 15');
    const requests = requestsResult.rows;
    
    if (requests.length === 0) {
      console.log('❌ No service requests found! Please create some service requests first.');
      return;
    }
    
    console.log(`✅ Found ${requests.length} service requests`);

    // Check if reviews already exist
    console.log('🔍 Checking for existing reviews...');
    const existingReviewsResult = await pool.query('SELECT id, overall_rating, review_text FROM customer_reviews LIMIT 5');
    const existingReviews = existingReviewsResult.rows;
    
    if (existingReviews.length > 0) {
      console.log(`⚠️  Found ${existingReviews.length} existing reviews. Showing existing data:`);
      console.log('💡 Existing reviews:');
      existingReviews.forEach((review, index) => {
        console.log(`   ${index + 1}. Rating: ${review.overall_rating}/5 - "${review.review_text?.substring(0, 50)}..."`);
      });
      return;
    }

    // Create reviews for existing service requests
    console.log('📝 Creating dummy reviews...');

    // Create up to 10 reviews, ensuring we don't exceed available data
    const maxReviews = Math.min(10, requests.length, sampleReviews.length);
    
    for (let i = 0; i < maxReviews; i++) {
      const request = requests[i];
      const customer = customers[i % customers.length];
      const provider = providers[i % providers.length];
      const reviewTemplate = sampleReviews[i];

      // Insert review using raw SQL
      const insertQuery = `
        INSERT INTO customer_reviews (
          customer_id, provider_id, request_id, 
          overall_rating, quality_rating, professionalism_rating, 
          timeliness_rating, value_rating, review_text, is_public
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id, overall_rating, review_text
      `;
      
      const values = [
        customer.id,
        provider.id,
        request.id,
        reviewTemplate.overallRating,
        reviewTemplate.qualityRating,
        reviewTemplate.professionalismRating,
        reviewTemplate.timelinessRating,
        reviewTemplate.valueRating,
        reviewTemplate.reviewText,
        reviewTemplate.isPublic
      ];

      const result = await pool.query(insertQuery, values);
      const insertedReview = result.rows[0];
      
      console.log(`📝 Review ${i + 1}: ${customer.first_name} → ${provider.first_name} ${provider.last_name} (${insertedReview.overall_rating}/5)`);
    }
    
    console.log(`✅ Successfully created ${maxReviews} dummy reviews!`);
    
    // Get review summary
    console.log('\n📊 Review Summary:');
    const summaryResult = await pool.query(`
      SELECT overall_rating, COUNT(*) as count 
      FROM customer_reviews 
      GROUP BY overall_rating 
      ORDER BY overall_rating DESC
    `);
    
    summaryResult.rows.forEach(row => {
      const stars = '⭐'.repeat(row.overall_rating);
      console.log(`   ${stars} ${row.overall_rating} stars: ${row.count} reviews`);
    });

    // Show some example reviews
    console.log('\n📋 Sample Reviews:');
    const sampleResult = await pool.query(`
      SELECT cr.overall_rating, cr.review_text, u.first_name as customer_name, sp.first_name as provider_name
      FROM customer_reviews cr
      JOIN users u ON cr.customer_id = u.id
      JOIN service_providers sp ON cr.provider_id = sp.id
      LIMIT 3
    `);
    
    sampleResult.rows.forEach((review, index) => {
      console.log(`   ${index + 1}. ${review.overall_rating}/5 stars (${review.customer_name} → ${review.provider_name}): "${review.review_text?.substring(0, 80)}..."`);
    });

  } catch (error) {
    console.error('❌ Error adding dummy reviews:', error);
    throw error;
  } finally {
    console.log('🔚 Closing database connection...');
    await pool.end();
  }
}

// Run the script
if (require.main === module) {
  addDummyReviews()
    .then(() => {
      console.log('✅ Dummy reviews script completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Failed to add dummy reviews:', error);
      process.exit(1);
    });
}

module.exports = { addDummyReviews };
