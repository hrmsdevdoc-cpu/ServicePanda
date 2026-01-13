const https = require('https');

async function testNotificationSystem() {
  console.log('🧪 Quick Test: Check if notification issue is fixed\n');

  try {
    // Test service request creation to verify server is working
    const testRequest = {
      customerId: 'quick-test-' + Date.now(),
      categoryId: 1,
      description: 'Quick test notification trigger',
      postcode: '4000',
      suburb: 'Brisbane',
      propertyType: 'house',
      urgency: 'normal',
      budget: 100,
      status: 'active'
    };

    const postData = JSON.stringify(testRequest);
    
    const options = {
      hostname: 'api.servicepanda.com.au',
      port: 443,
      path: '/api/customer/service-requests',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const result = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data }));
      });
      
      req.on('error', reject);
      req.write(postData);
      req.end();
    });

    console.log(`✅ Service Request Status: ${result.status}`);
    
    if (result.status === 200 || result.status === 201) {
      console.log('🎯 New service request created successfully!');
      console.log('⏰ Cron job should process this and send notifications');
      console.log('📱 Check your provider app in 2-3 minutes for automatic notification');
      
      console.log('\n🔥 IMMEDIATE TEST IN APP:');
      console.log('1. Open ServicePandaProvider app');
      console.log('2. Find "🔔 Notifications" panel (should be fixed now)');
      console.log('3. Tap "🛎️ Customer Request" button');
      console.log('4. Should show toast notification (no more errors!)');
    } else {
      console.log('❌ Request failed with status:', result.status);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testNotificationSystem();
