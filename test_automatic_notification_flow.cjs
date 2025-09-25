const https = require('https');

// Test the complete automatic notification flow
async function testCompleteNotificationFlow() {
  console.log('🧪 TESTING COMPLETE AUTOMATIC NOTIFICATION FLOW\n');
  console.log('This test simulates: Customer creates request → Server processes → Providers get notifications\n');

  try {
    // Step 1: Create a new service request (this triggers automatic notifications)
    console.log('📝 Step 1: Creating new service request...');
    
    const serviceRequest = {
      customerId: 'auto-test-' + Date.now(),
      categoryId: 1, // House Cleaning
      description: 'AUTO TEST: House cleaning needed urgently for provider notification testing. This should trigger real notifications to all eligible providers.',
      postcode: '4000',
      suburb: 'Brisbane City',
      propertyType: 'house',
      urgency: 'urgent',
      budget: 250,
      status: 'active'
    };

    const createRequestResult = await makeApiRequest('POST', '/api/customer/service-requests', serviceRequest);
    
    if (createRequestResult.status === 200 || createRequestResult.status === 201) {
      console.log('✅ Service request created successfully!');
      console.log('🔄 This should automatically trigger lead distribution and notifications');
    } else {
      console.log('❌ Failed to create service request:', createRequestResult.status);
      return;
    }

    // Step 2: Wait a moment for processing
    console.log('\n⏳ Step 2: Waiting 3 seconds for automatic processing...');
    await sleep(3000);

    // Step 3: Check notification bridge stats
    console.log('\n📊 Step 3: Checking notification bridge status...');
    
    const statsResult = await makeApiRequest('GET', '/api/provider/notifications/stats');
    
    if (statsResult.status === 200 && !statsResult.raw) {
      console.log('✅ Notification Bridge Stats:');
      console.log(JSON.stringify(statsResult.data, null, 2));
      
      if (statsResult.data.totalPendingNotifications > 0) {
        console.log(`🎉 SUCCESS: ${statsResult.data.totalPendingNotifications} notifications are pending delivery!`);
      } else {
        console.log('⚠️  No pending notifications found');
      }
    } else {
      console.log('❌ Failed to get notification stats');
    }

    // Step 4: Test polling for notifications (simulate provider app)
    console.log('\n📱 Step 4: Testing notification polling (simulating provider app)...');
    
    const pollResult = await makeApiRequest('GET', '/api/provider/notifications/poll', null, {
      'x-provider-id': '1'
    });
    
    if (pollResult.status === 200 && !pollResult.raw) {
      const notifications = pollResult.data.notifications || [];
      console.log(`📨 Polling result: ${notifications.length} notifications received`);
      
      if (notifications.length > 0) {
        console.log('🎉 SUCCESS: Provider would receive these notifications:');
        notifications.forEach((notif, index) => {
          console.log(`  ${index + 1}. ${notif.title}`);
          console.log(`     ${notif.message}`);
          console.log(`     Type: ${notif.type}, Time: ${notif.timestamp}`);
        });
      } else {
        console.log('⚠️  No notifications received by provider');
      }
    } else {
      console.log('❌ Failed to poll for notifications');
    }

    // Step 5: Test manual trigger to verify system is working
    console.log('\n🔧 Step 5: Testing manual notification trigger...');
    
    const manualTrigger = await makeApiRequest('POST', '/api/admin/trigger-lead-processing', {
      testMode: true,
      force: true
    });
    
    console.log(`Manual trigger status: ${manualTrigger.status}`);

    // Summary
    console.log('\n📋 COMPLETE NOTIFICATION FLOW TEST RESULTS:');
    console.log('=========================================');
    
    console.log('\n✅ WHAT WAS TESTED:');
    console.log('  • Service request creation');
    console.log('  • Automatic lead distribution');
    console.log('  • Notification bridge functionality');
    console.log('  • Provider notification polling');
    
    console.log('\n🎯 NEXT STEPS FOR YOU:');
    console.log('1. Open ServicePandaProvider app');
    console.log('2. Go to notification panel');
    console.log('3. Notifications should automatically appear within 30 seconds');
    console.log('4. Manual test buttons should also work immediately');
    
    console.log('\n🔔 EXPECTED BEHAVIOR:');
    console.log('  • App polls server every 30 seconds');
    console.log('  • New requests trigger immediate notifications');
    console.log('  • Notifications appear in Android notification bar');
    
    console.log('\n📱 TO VERIFY ON MOBILE:');
    console.log('  • Keep app open for 30 seconds');
    console.log('  • Should see toast: "📱 Received notification from server"');
    console.log('  • Should see system notification in notification bar');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

async function makeApiRequest(method, endpoint, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      hostname: 'api.servicepanda.com.au',
      port: 443,
      path: endpoint,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers
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
          resolve({ status: res.statusCode, data: responseData, raw: true });
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the test
testCompleteNotificationFlow();
