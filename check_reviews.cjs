const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:IgOOJDuqNJEelGTGCGedMKCUCaEhGKRm@autorack.proxy.rlwy.net:11100/railway',
  ssl: { rejectUnauthorized: false }
});

async function checkReviews() {
  try {
    console.log('🔍 Checking customers and reviews...\n');

    // Get all customers
    const customersResult = await pool.query(`
      SELECT id, email, first_name, last_name 
      FROM users 
      WHERE email LIKE '%customer%' OR email LIKE '%example%'
      ORDER BY id
    `);
    
    console.log('👥 Customers in database:');
    customersResult.rows.forEach(customer => {
      console.log(`   ${customer.id}: ${customer.email} (${customer.first_name} ${customer.last_name})`);
    });

    // Get all reviews with customer info
    const reviewsResult = await pool.query(`
      SELECT cr.id, cr.customer_id, cr.overall_rating, cr.review_text, 
             u.email, u.first_name as customer_name,
             sp.first_name as provider_name, sp.last_name as provider_last_name
      FROM customer_reviews cr
      JOIN users u ON cr.customer_id = u.id
      JOIN service_providers sp ON cr.provider_id = sp.id
      ORDER BY cr.id
    `);
    
    console.log('\n⭐ Reviews in database:');
    if (reviewsResult.rows.length === 0) {
      console.log('   No reviews found!');
    } else {
      reviewsResult.rows.forEach(review => {
        console.log(`   Review ${review.id}: ${review.customer_name} (${review.email}) → ${review.provider_name} ${review.provider_last_name} - ${review.overall_rating}/5 stars`);
        console.log(`      "${review.review_text?.substring(0, 60)}..."`);
      });
    }

    // Check if customer1@example.com has reviews
    const customer1Reviews = await pool.query(`
      SELECT cr.*, u.email 
      FROM customer_reviews cr 
      JOIN users u ON cr.customer_id = u.id 
      WHERE u.email = 'customer1@example.com'
    `);
    
    console.log(`\n📧 Reviews for customer1@example.com: ${customer1Reviews.rows.length} found`);
    if (customer1Reviews.rows.length > 0) {
      customer1Reviews.rows.forEach(review => {
        console.log(`   Review ${review.id}: ${review.overall_rating}/5 stars`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

checkReviews();
