const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:IgOOJDuqNJEelGTGCGedMKCUCaEhGKRm@autorack.proxy.rlwy.net:11100/railway',
  ssl: { rejectUnauthorized: false }
});

async function addCustomer1Reviews() {
  try {
    console.log('🔍 Adding reviews for customer1@example.com...\n');

    // Get customer1@example.com details
    const customer1Result = await pool.query(`
      SELECT id, email, first_name, last_name 
      FROM users 
      WHERE email = 'customer1@example.com'
    `);
    
    if (customer1Result.rows.length === 0) {
      console.log('❌ customer1@example.com not found!');
      return;
    }
    
    const customer1 = customer1Result.rows[0];
    console.log(`✅ Found customer: ${customer1.first_name} ${customer1.last_name} (${customer1.email})`);

    // Get some providers
    const providersResult = await pool.query(`
      SELECT id, first_name, last_name 
      FROM service_providers 
      LIMIT 5
    `);
    
    if (providersResult.rows.length === 0) {
      console.log('❌ No providers found!');
      return;
    }
    
    console.log(`✅ Found ${providersResult.rows.length} providers`);

    // Get some service requests  
    const requestsResult = await pool.query(`
      SELECT id, description 
      FROM service_requests 
      LIMIT 5
    `);
    
    if (requestsResult.rows.length === 0) {
      console.log('❌ No service requests found!');
      return;
    }
    
    console.log(`✅ Found ${requestsResult.rows.length} service requests`);

    // Create 3 reviews for customer1@example.com
    const reviewsToAdd = [
      {
        overallRating: 5,
        qualityRating: 5,
        professionalismRating: 5,
        timelinessRating: 5,
        valueRating: 4,
        reviewText: "Outstanding service! The technician from this company was incredibly professional and completed the work perfectly. Would definitely use again.",
        isPublic: true
      },
      {
        overallRating: 4,
        qualityRating: 4,
        professionalismRating: 5,
        timelinessRating: 3,
        valueRating: 4,
        reviewText: "Very good service overall. The work quality was excellent and the staff was professional. Only minor issue was they arrived a bit later than scheduled.",
        isPublic: true
      },
      {
        overallRating: 5,
        qualityRating: 5,
        professionalismRating: 5,
        timelinessRating: 5,
        valueRating: 5,
        reviewText: "Perfect experience from start to finish! Quick response, fair pricing, and excellent workmanship. Highly recommend this service provider.",
        isPublic: true
      }
    ];

    console.log('\n📝 Creating reviews for customer1@example.com...');
    
    for (let i = 0; i < reviewsToAdd.length && i < providersResult.rows.length && i < requestsResult.rows.length; i++) {
      const provider = providersResult.rows[i];
      const request = requestsResult.rows[i];
      const reviewTemplate = reviewsToAdd[i];

      const insertQuery = `
        INSERT INTO customer_reviews (
          customer_id, provider_id, request_id, 
          overall_rating, quality_rating, professionalism_rating, 
          timeliness_rating, value_rating, review_text, is_public
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id, overall_rating
      `;
      
      const values = [
        customer1.id,
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
      
      console.log(`   ✅ Review ${i + 1}: ${customer1.first_name} → ${provider.first_name} ${provider.last_name} (${insertedReview.overall_rating}/5 stars)`);
    }
    
    console.log(`\n🎉 Successfully created ${Math.min(reviewsToAdd.length, providersResult.rows.length, requestsResult.rows.length)} reviews for customer1@example.com!`);
    
    // Verify the reviews were created
    const verifyResult = await pool.query(`
      SELECT cr.id, cr.overall_rating, cr.review_text
      FROM customer_reviews cr
      JOIN users u ON cr.customer_id = u.id
      WHERE u.email = 'customer1@example.com'
      ORDER BY cr.id DESC
    `);
    
    console.log(`\n📊 Total reviews for customer1@example.com: ${verifyResult.rows.length}`);
    verifyResult.rows.forEach((review, index) => {
      console.log(`   ${index + 1}. ${review.overall_rating}/5 stars - "${review.review_text.substring(0, 50)}..."`);
    });

  } catch (error) {
    console.error('❌ Error adding reviews:', error);
  } finally {
    await pool.end();
  }
}

addCustomer1Reviews();
