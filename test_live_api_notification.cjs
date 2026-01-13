const https = require('https');

// Test customer details
const testCustomer = {
  email: 'customer1@example.com',
  password: '123456',
  address: '4000 Brisbane'
};

async function makeApiRequest(method, endpoint, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.servicepanda.com.au',
      port: 443,
      path: endpoint,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsedData });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testLiveNotificationFlow() {
  try {
    console.log('🧪 Testing LIVE API Notification Flow');
    console.log('🌐 API: https://api.servicepanda.com.au\n');

    // Step 1: Test API connection
    console.log('📡 Step 1: Testing API connection...');
    try {
      const healthCheck = await makeApiRequest('GET', '/api/health');
      console.log(`✅ API Status: ${healthCheck.status}`);
      if (healthCheck.data) {
        console.log(`📊 Response: ${JSON.stringify(healthCheck.data)}`);
      }
    } catch (error) {
      console.log('⚠️  Health check failed, continuing with main test...');
    }

    // Step 2: Customer login/registration
    console.log('\n👤 Step 2: Customer authentication...');
    console.log(`📧 Customer: ${testCustomer.email}`);
    console.log(`📍 Address: ${testCustomer.address}`);

    let authToken = null;
    
    // Try to login first
    try {
      const loginResponse = await makeApiRequest('POST', '/api/auth/login', {
        email: testCustomer.email,
        password: testCustomer.password
      });
      
      if (loginResponse.status === 200 && loginResponse.data.token) {
        authToken = loginResponse.data.token;
        console.log('✅ Customer login successful');
      } else {
        console.log('📝 Login failed, customer might need registration');
      }
    } catch (error) {
      console.log('⚠️  Login attempt failed, will try registration...');
    }

    // Step 3: Create service request
    console.log('\n🛠️  Step 3: Creating service request...');
    
    const serviceRequest = {
      categoryId: 1, // House Cleaning
      description: 'Need urgent house cleaning for 3-bedroom apartment in Brisbane. Deep cleaning required including kitchen, bathrooms, and living areas before Eid celebration.',
      postcode: '4000',
      suburb: 'Brisbane City',
      address: testCustomer.address,
      propertyType: 'apartment',
      urgency: 'urgent',
      budget: 250,
      preferredDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      contactEmail: testCustomer.email,
      contactPhone: '+61400123456'
    };

    console.log(`📝 Service Request Details:`);
    console.log(`   Service: House Cleaning`);
    console.log(`   Location: ${serviceRequest.suburb}, ${serviceRequest.postcode}`);
    console.log(`   Budget: $${serviceRequest.budget}`);
    console.log(`   Urgency: ${serviceRequest.urgency}`);

    try {
      const requestResponse = await makeApiRequest('POST', '/api/service-requests', serviceRequest, {
        'Authorization': authToken ? `Bearer ${authToken}` : undefined
      });

      console.log(`\n📊 API Response Status: ${requestResponse.status}`);
      console.log(`📋 Response Data:`, JSON.stringify(requestResponse.data, null, 2));

      if (requestResponse.status === 200 || requestResponse.status === 201) {
        console.log('\n✅ SUCCESS! Service request created successfully!');
        
        const requestId = requestResponse.data.id || requestResponse.data.requestId;
        if (requestId) {
          console.log(`🆔 Request ID: ${requestId}`);
        }

        // Step 4: Check notification trigger
        console.log('\n🔔 Step 4: Notification System Check');
        console.log('⏰ The cron job will now:');
        console.log('   1. ✅ Find this new request in database');
        console.log('   2. 🔍 Identify eligible providers in Brisbane (4000)');
        console.log('   3. 📱 Send notifications to provider apps');
        console.log('   4. 💰 Create lead offers for providers');
        
        console.log('\n⏰ Cron job runs every 5 minutes');
        console.log('📱 Check your provider app in 5-10 minutes for notifications!');
        
        console.log('\n🎯 Expected Provider Notification:');
        console.log('   Title: "New Customer Request Available! 🛎️"');
        console.log('   Message: "House Cleaning needed in Brisbane City, 4000"');
        console.log('   Description: "Need urgent house cleaning for 3-bedroom apartment..."');

      } else {
        console.log(`\n❌ Service request failed with status: ${requestResponse.status}`);
        console.log('📋 Response:', JSON.stringify(requestResponse.data, null, 2));
      }

    } catch (error) {
      console.error('❌ Error creating service request:', error.message);
    }

    // Step 5: Provider check
    console.log('\n👷 Step 5: Provider Notification Test');
    console.log('📱 To verify notifications are working:');
    console.log('   1. ✅ Open ServicePandaProvider app');
    console.log('   2. ⏰ Wait 5-10 minutes for cron job');
    console.log('   3. 🔔 Check notification bar for new notifications');
    console.log('   4. 🛎️ Tap "Customer Request" in test panel to simulate');

    console.log('\n🔧 Alternative Manual Test:');
    console.log('   • Open provider app dashboard');
    console.log('   • Scroll to "🔔 Notifications" panel');
    console.log('   • Tap "🛎️ Customer Request" button');
    console.log('   • Should see toast notification at top');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
console.log('🚀 Starting Live API Notification Test...\n');
testLiveNotificationFlow();
