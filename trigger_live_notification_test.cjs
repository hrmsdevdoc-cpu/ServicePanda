const https = require('https');

async function triggerLiveNotificationTest() {
  console.log('🧪 TRIGGERING LIVE NOTIFICATION TEST\n');
  console.log('Server logs show notification system is WORKING! Let\'s trigger it...\n');

  try {
    // Create a new service request to trigger notifications
    console.log('📝 Creating new service request to trigger notifications...');
    
    const currentTime = new Date().toISOString();
    const testRequest = {
      customerId: 'live-notif-test-' + Date.now(),
      categoryId: 1, // House cleaning
      description: `LIVE NOTIFICATION TEST: Emergency house cleaning needed urgently! Created at ${currentTime}. This should trigger real notifications to all eligible providers.`,
      postcode: '4000',
      suburb: 'Brisbane City',
      propertyType: 'house',
      urgency: 'urgent',
      budget: 350,
      status: 'active'
    };

    const result = await makeApiRequest('POST', '/api/customer/service-requests', testRequest);
    
    if (result.status === 200 || result.status === 201) {
      console.log('✅ NEW SERVICE REQUEST CREATED!');
      console.log('🔄 This should trigger automatic lead distribution...');
      console.log('⏰ Cron job should process this within 1-2 minutes...');
      console.log('📱 Provider app should receive notification automatically!');
      
      console.log('\n🎯 WATCH FOR THESE IN YOUR PROVIDER APP:');
      console.log('1. App polls every 30 seconds automatically');
      console.log('2. Should receive notification: "New Customer Request Available! 🛎️"');
      console.log('3. Should appear in Android notification bar');
      
      console.log('\n📊 ALSO WATCH SERVER LOGS FOR:');
      console.log('- "📱 Notifications sent to X providers for request [ID]"');
      console.log('- "📱 Delivered X notifications to provider 1"');
      console.log('- GET /api/provider/notifications/poll with notifications array');
      
      console.log('\n⏱️ TIMING:');
      console.log('- Wait 1-2 minutes for cron to process');
      console.log('- Then provider app will automatically receive notification');
      
    } else {
      console.log('❌ Failed to create service request:', result.status);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
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

triggerLiveNotificationTest();
