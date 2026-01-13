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

async function checkCronAndNotifications() {
  try {
    console.log('🔍 Checking Cron Job & Notification System Status\n');

    // Step 1: Check API health and server status
    console.log('📡 Step 1: Checking server status...');
    try {
      const healthResponse = await makeApiRequest('GET', '/api/health');
      console.log(`✅ Server Status: ${healthResponse.status}`);
      if (healthResponse.data && healthResponse.data.message) {
        console.log(`📊 Server Message: ${healthResponse.data.message}`);
      }
    } catch (error) {
      console.log('❌ Server health check failed:', error.message);
    }

    // Step 2: Check recent service requests
    console.log('\n📋 Step 2: Checking recent service requests...');
    try {
      const requestsResponse = await makeApiRequest('GET', '/api/admin/recent-requests');
      console.log(`Status: ${requestsResponse.status}`);
      
      if (requestsResponse.status === 200 && requestsResponse.data) {
        console.log('Recent requests found');
      }
    } catch (error) {
      console.log('❌ Could not fetch recent requests');
    }

    // Step 3: Check cron job status
    console.log('\n⏰ Step 3: Checking cron job status...');
    try {
      const cronResponse = await makeApiRequest('GET', '/api/admin/cron-status');
      console.log(`Cron Status: ${cronResponse.status}`);
      
      if (cronResponse.data) {
        console.log('Cron job info:', JSON.stringify(cronResponse.data, null, 2));
      }
    } catch (error) {
      console.log('❌ Could not fetch cron status');
    }

    // Step 4: Check lead distribution logs
    console.log('\n📊 Step 4: Checking lead distribution...');
    try {
      const leadsResponse = await makeApiRequest('GET', '/api/admin/lead-distribution');
      console.log(`Lead Distribution Status: ${leadsResponse.status}`);
    } catch (error) {
      console.log('❌ Could not fetch lead distribution status');
    }

    // Step 5: Check notification service integration
    console.log('\n🔔 Step 5: Checking notification service...');
    try {
      const notificationResponse = await makeApiRequest('GET', '/api/admin/notification-status');
      console.log(`Notification Service Status: ${notificationResponse.status}`);
    } catch (error) {
      console.log('❌ Could not fetch notification service status');
    }

    // Step 6: Manual trigger test
    console.log('\n🧪 Step 6: Testing manual notification trigger...');
    try {
      const triggerResponse = await makeApiRequest('POST', '/api/admin/trigger-notifications', {
        testMode: true,
        message: 'Test notification from cron check'
      });
      console.log(`Manual Trigger Status: ${triggerResponse.status}`);
      
      if (triggerResponse.data) {
        console.log('Trigger Response:', JSON.stringify(triggerResponse.data, null, 2));
      }
    } catch (error) {
      console.log('❌ Could not trigger manual notification');
    }

    console.log('\n🔍 DIAGNOSIS:');
    console.log('📱 You can see notifications in the app list, which means:');
    console.log('   ✅ Requests are being created successfully');
    console.log('   ✅ Data is reaching the database');
    console.log('   ✅ App can fetch and display notifications');
    
    console.log('\n❌ Missing: Real-time system notifications, which means:');
    console.log('   • Cron job might not be processing lead distribution');
    console.log('   • Notification service integration might be incomplete');
    console.log('   • Provider notification service might not be called');

    console.log('\n🔧 SOLUTIONS:');
    console.log('1. 📱 Test Manual Notification:');
    console.log('   • Open provider app');
    console.log('   • Go to "🔔 Notifications" panel');
    console.log('   • Tap "🛎️ Customer Request" - should work');

    console.log('\n2. 🛠️ Check Server Integration:');
    console.log('   • Verify cron job is running on live server');
    console.log('   • Check if providerNotificationService is deployed');
    console.log('   • Ensure lead distribution calls notification service');

    console.log('\n3. ⚡ Quick Fix Options:');
    console.log('   • Add manual trigger endpoint on server');
    console.log('   • Test notification service separately');
    console.log('   • Check server logs for notification calls');

    console.log('\n📱 IMMEDIATE TEST:');
    console.log('Open provider app → Tap "🛎️ Customer Request" button');
    console.log('This should show toast notification regardless of server integration');

  } catch (error) {
    console.error('❌ Check failed:', error.message);
  }
}

// Run the check
checkCronAndNotifications();
