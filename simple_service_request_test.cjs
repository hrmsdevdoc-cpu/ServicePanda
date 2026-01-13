const https = require('https');

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

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = responseData ? JSON.parse(responseData) : {};
          resolve({ status: res.statusCode, data: parsedData });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (postData) {
      req.write(postData);
    }

    req.end();
  });
}

async function createTestServiceRequest() {
  try {
    console.log('🧪 Creating Test Service Request for Provider Notifications\n');

    // Service request data
    const serviceRequest = {
      // Customer info
      customerId: 'test-customer-001',
      customerEmail: 'customer1@example.com',
      customerPhone: '+61400123456',
      
      // Service details
      categoryId: 1, // House Cleaning
      description: 'Need urgent house cleaning for 3-bedroom apartment in Brisbane CBD. Deep cleaning required including kitchen, bathrooms, and living areas before Eid celebration. Property is located near Queen Street Mall.',
      
      // Location
      postcode: '4000',
      suburb: 'Brisbane City',
      address: '4000 Brisbane',
      propertyType: 'apartment',
      
      // Preferences
      urgency: 'urgent',
      budget: 250,
      preferredDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      
      // Status
      status: 'active'
    };

    console.log('📝 Service Request Details:');
    console.log(`   📧 Customer: ${serviceRequest.customerEmail}`);
    console.log(`   🏠 Service: House Cleaning`);
    console.log(`   📍 Location: ${serviceRequest.suburb}, ${serviceRequest.postcode}`);
    console.log(`   💰 Budget: $${serviceRequest.budget}`);
    console.log(`   ⚡ Urgency: ${serviceRequest.urgency}`);
    console.log(`   📅 Preferred Date: ${new Date(serviceRequest.preferredDate).toLocaleDateString()}`);

    // Try different endpoints that might work
    const endpoints = [
      '/api/service-requests',
      '/api/customer/service-requests', 
      '/api/requests',
      '/api/leads',
      '/api/customer/requests'
    ];

    let success = false;

    for (const endpoint of endpoints) {
      try {
        console.log(`\n🔗 Trying endpoint: ${endpoint}`);
        
        const response = await makeApiRequest('POST', endpoint, serviceRequest);
        
        console.log(`📊 Status: ${response.status}`);
        
        if (response.status === 200 || response.status === 201) {
          console.log('✅ SUCCESS! Service request created!');
          console.log(`📋 Response:`, JSON.stringify(response.data, null, 2));
          
          const requestId = response.data.id || response.data.requestId || response.data.leadId;
          if (requestId) {
            console.log(`\n🆔 Request ID: ${requestId}`);
          }
          
          success = true;
          break;
        } else if (response.status === 401) {
          console.log('🔐 Requires authentication');
        } else if (response.status === 404) {
          console.log('❌ Endpoint not found');
        } else {
          console.log(`❌ Failed: ${response.status}`);
          if (response.data) {
            console.log(`📋 Error:`, JSON.stringify(response.data, null, 2));
          }
        }
        
      } catch (error) {
        console.log(`❌ Error: ${error.message}`);
      }
    }

    if (success) {
      console.log('\n🎯 NOTIFICATION FLOW TRIGGERED!');
      console.log('\n⏰ What happens next:');
      console.log('   1. ✅ Service request saved to database');
      console.log('   2. 🕐 Cron job runs every 5 minutes');
      console.log('   3. 🔍 System finds eligible providers in Brisbane (4000)');
      console.log('   4. 📱 Notifications sent to provider apps');
      console.log('   5. 🛎️ Providers receive real-time notifications');
      
      console.log('\n📱 Check Provider App:');
      console.log('   • Open ServicePandaProvider app');
      console.log('   • Wait 5-10 minutes for cron processing');
      console.log('   • Check notification bar for new notifications');
      console.log('   • Should see: "New Customer Request Available! 🛎️"');
      
    } else {
      console.log('\n⚠️  Could not create service request via API');
      console.log('\n🔧 Alternative Test Methods:');
      console.log('1. 📱 Manual Test: Open provider app → Tap "🛎️ Customer Request" button');
      console.log('2. 🌐 Web Test: Create request via website');
      console.log('3. 💾 Database Test: Insert directly into database');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
createTestServiceRequest();
