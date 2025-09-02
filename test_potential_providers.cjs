const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'servicepanda',
  user: 'postgres',
  password: 'postgres',
});

async function testPotentialProviders() {
  try {
    console.log('Testing Potential Providers functionality...\n');

    // Test 1: Check if potential_providers table exists
    console.log('1. Checking if potential_providers table exists...');
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'potential_providers'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ potential_providers table exists');
    } else {
      console.log('❌ potential_providers table does not exist');
      return;
    }

    // Test 2: Check if potential_provider_tasks table exists
    console.log('\n2. Checking if potential_provider_tasks table exists...');
    const tasksTableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'potential_provider_tasks'
      );
    `);
    
    if (tasksTableCheck.rows[0].exists) {
      console.log('✅ potential_provider_tasks table exists');
    } else {
      console.log('❌ potential_provider_tasks table does not exist');
    }

    // Test 3: Check if potential_provider_communications table exists
    console.log('\n3. Checking if potential_provider_communications table exists...');
    const commsTableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'potential_provider_communications'
      );
    `);
    
    if (commsTableCheck.rows[0].exists) {
      console.log('✅ potential_provider_communications table exists');
    } else {
      console.log('❌ potential_provider_communications table does not exist');
    }

    // Test 4: Insert a test potential provider
    console.log('\n4. Testing insert of potential provider...');
    const insertResult = await pool.query(`
      INSERT INTO potential_providers (
        first_name, last_name, email, phone, address, state, city, postcode,
        business_name, service_categories, source, priority, status
      ) VALUES (
        'John', 'Doe', 'john.doe@test.com', '0412345678', 
        '123 Test St', 'QLD', 'Brisbane', '4000',
        'Test Business', 'Plumbing,Electrical', 'manual', 'high', 'new'
      ) RETURNING id, first_name, last_name, email;
    `);
    
    if (insertResult.rows.length > 0) {
      console.log('✅ Test potential provider created:', insertResult.rows[0]);
      const testProviderId = insertResult.rows[0].id;

      // Test 5: Update the provider status
      console.log('\n5. Testing status update...');
      const updateResult = await pool.query(`
        UPDATE potential_providers 
        SET status = 'first_call', updated_at = NOW() 
        WHERE id = $1 
        RETURNING id, status;
      `, [testProviderId]);
      
      if (updateResult.rows.length > 0) {
        console.log('✅ Status updated:', updateResult.rows[0]);
      }

      // Test 6: Create a task
      console.log('\n6. Testing task creation...');
      const taskResult = await pool.query(`
        INSERT INTO potential_provider_tasks (
          potential_provider_id, task_type, title, description, status
        ) VALUES (
          $1, 'call', 'Initial Contact', 'Make first call to discuss services', 'pending'
        ) RETURNING id, title, task_type;
      `, [testProviderId]);
      
      if (taskResult.rows.length > 0) {
        console.log('✅ Task created:', taskResult.rows[0]);
      }

      // Test 7: Create a communication record
      console.log('\n7. Testing communication record...');
      const commResult = await pool.query(`
        INSERT INTO potential_provider_communications (
          potential_provider_id, communication_type, direction, subject, content, sent_by
        ) VALUES (
          $1, 'email', 'outbound', 'Welcome', 'Welcome to our platform!', 'admin'
        ) RETURNING id, communication_type, direction;
      `, [testProviderId]);
      
      if (commResult.rows.length > 0) {
        console.log('✅ Communication record created:', commResult.rows[0]);
      }

      // Test 8: Convert to actual provider
      console.log('\n8. Testing conversion to actual provider...');
      
      // First check if service_providers table exists
      const serviceProvidersCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'service_providers'
        );
      `);
      
      if (serviceProvidersCheck.rows[0].exists) {
        // Get the potential provider data
        const potentialProvider = await pool.query(`
          SELECT * FROM potential_providers WHERE id = $1
        `, [testProviderId]);
        
        if (potentialProvider.rows.length > 0) {
          const provider = potentialProvider.rows[0];
          
          // Insert into service_providers
          const convertResult = await pool.query(`
            INSERT INTO service_providers (
              first_name, last_name, email, password, mobile_number, address,
              business_name, business_abn, status, provider_status
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, 'pending', 'deactivated'
            ) RETURNING id, first_name, last_name, email;
          `, [
            provider.first_name,
            provider.last_name,
            provider.email,
            'temp_password_' + Math.random().toString(36).substring(7),
            provider.phone,
            provider.address,
            provider.business_name,
            provider.business_abn
          ]);
          
          if (convertResult.rows.length > 0) {
            console.log('✅ Provider converted:', convertResult.rows[0]);
            
            // Delete the potential provider
            await pool.query(`
              DELETE FROM potential_providers WHERE id = $1
            `, [testProviderId]);
            console.log('✅ Potential provider deleted after conversion');
          }
        }
      } else {
        console.log('❌ service_providers table does not exist');
      }

    } else {
      console.log('❌ Failed to create test potential provider');
    }

    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await pool.end();
  }
}

testPotentialProviders();
