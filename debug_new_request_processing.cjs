const https = require('https');

async function debugNewRequestProcessing() {
  console.log('🔍 DEBUGGING NEW REQUEST PROCESSING\n');

  try {
    // Step 1: Check recent service requests
    console.log('📋 Step 1: Creating a service request and checking immediate processing...');
    
    const testRequest = {
      customerId: 'debug-' + Date.now(),
      categoryId: 1, // House cleaning (category with eligible providers)
      description: `DEBUG TEST: ${new Date().toISOString()} - House cleaning needed to test immediate notification processing.`,
      postcode: '4000', // Postcode that has eligible providers
      suburb: 'Brisbane City',
      propertyType: 'house',
      urgency: 'urgent',
      budget: 400,
      status: 'active'
    };

    const createResult = await makeApiRequest('POST', '/api/customer/service-requests', testRequest);
    
    if (createResult.status === 200 || createResult.status === 201) {
      console.log('✅ Service request created successfully!');
      console.log('📊 Request details:');
      console.log(`   Category: 1 (House Cleaning)`);
      console.log(`   Postcode: 4000 (Has 1 eligible provider)`);
      console.log(`   Status: active`);
      
      console.log('\n🔍 What should happen in server logs:');
      console.log('1. "Starting automatic lead distribution for request [ID]"');
      console.log('2. "Finding eligible providers for category 1, postcode 4000"');
      console.log('3. "Found 1 providers via postcode coverage"');
      console.log('4. "🔔 Sending notifications to 1 providers"');
      console.log('5. "📱 Notifications sent to 1 providers for request [ID]"');
      
      console.log('\n⏰ Timeline:');
      console.log('- IMMEDIATE: initializeLeadDistribution() should be called');
      console.log('- IMMEDIATE: Notifications should be sent');
      console.log('- Next 30 seconds: Provider app should receive notification');
      
    } else {
      console.log('❌ Failed to create service request');
    }

    // Step 2: Check if manual trigger works
    console.log('\n🔧 Step 2: Testing manual lead processing trigger...');
    
    const triggerResult = await makeApiRequest('POST', '/api/admin/trigger-lead-processing', {
      testMode: true,
      force: true
    });
    
    console.log(`Manual trigger status: ${triggerResult.status}`);
    
    console.log('\n📊 Expected Server Log Pattern:');
    console.log('=====================================');
    console.log('✅ WORKING PATTERN:');
    console.log('   "Starting automatic lead distribution for request [ID]"');
    console.log('   "Finding eligible providers for category 1, postcode 4000"');
    console.log('   "Found 1 providers via postcode coverage"');
    console.log('   "🔔 Sending REAL notification to provider 1: New Customer Request Available!"');
    console.log('   "📱 Notifications sent to 1 providers for request [ID]"');
    console.log('   "📨 Notification added for provider 1: New Customer Request Available!"');
    console.log('');
    console.log('❌ CURRENT PATTERN (Missing notifications):');
    console.log('   "Finding eligible providers..." ← Only this is happening');
    console.log('   "Expired leads processing completed" ← Wrong cron job');
    console.log('');
    console.log('🎯 SOLUTION:');
    console.log('   Need to ensure createServiceRequest() calls initializeLeadDistribution()');
    console.log('   OR cron job should process new requests, not just expired ones');

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

async function makeApiRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      hostname: 'api.servicepanda.com.au',
      port: 443,
      path: endpoint,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        try {
          const parsedData = responseData ? JSON.parse(responseData) : {};
          resolve({ status: res.statusCode, data: parsedData });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData, raw: true });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

debugNewRequestProcessing();
