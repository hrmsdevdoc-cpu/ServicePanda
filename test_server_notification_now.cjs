#!/usr/bin/env node

// Test server notification flow now that external user IDs are manually set
console.log('🧪 Testing Server Notification Flow After Manual External ID Setup...');
console.log('=' .repeat(70));

async function testServerNotificationFlow() {
  try {
    // Test direct customer request → server notification flow
    console.log('📋 Step 1: Testing customer login...');
    
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@customer.com',
        password: 'password123'
      })
    });

    let authToken;
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      authToken = loginData.token;
      console.log('✅ Customer login successful');
    } else {
      console.log('⚠️ Customer login failed, creating test customer...');
      
      const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@customer.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'Customer',
          phone: '+1234567890',
          userType: 'customer'
        })
      });
      
      if (registerResponse.ok) {
        console.log('✅ Test customer created');
        const loginResponse2 = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@customer.com',
            password: 'password123'
          })
        });
        
        const loginData = await loginResponse2.json();
        authToken = loginData.token;
      } else {
        throw new Error('Failed to create test customer');
      }
    }

    // Get service categories
    console.log('\n📋 Step 2: Getting service categories...');
    const categoriesResponse = await fetch('http://localhost:3000/api/service-categories');
    const categories = await categoriesResponse.json();
    const testCategory = categories[0];
    console.log(`✅ Using category: ${testCategory.name} (ID: ${testCategory.id})`);

    // Create service request - THIS SHOULD NOW TRIGGER WORKING NOTIFICATIONS
    console.log('\n🛎️ Step 3: Creating service request to trigger server notifications...');
    
    const serviceRequestData = {
      categoryId: testCategory.id,
      description: 'TESTING MANUAL EXTERNAL ID FIX - ' + new Date().toLocaleTimeString(),
      suburb: 'Test Area',
      postcode: '4000', // Make sure this has eligible providers
      contactPhone: '+1234567890',
      preferredDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      urgency: 'medium'
    };

    console.log('📤 Sending service request...');
    console.log(`   Category: ${testCategory.name}`);
    console.log(`   Postcode: ${serviceRequestData.postcode}`);
    console.log(`   Description: ${serviceRequestData.description.substring(0, 50)}...`);

    const requestResponse = await fetch('http://localhost:3000/api/service-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(serviceRequestData)
    });

    if (requestResponse.ok) {
      const requestData = await requestResponse.json();
      console.log('✅ Service request created successfully!');
      console.log(`📋 Request ID: ${requestData.request.id}`);
      
      console.log('\n⚡ CRITICAL: Watch your SERVER CONSOLE immediately!');
      console.log('🔍 Look for these messages (should appear within 5 seconds):');
      console.log('   ▶️ "Starting automatic lead distribution for request [ID]"');
      console.log('   ▶️ "🛎️ Notifying X providers of new customer request"');
      console.log('   ▶️ "🚀 SENDING REAL ONESIGNAL PUSH NOTIFICATION to provider 1"');
      console.log('   ▶️ "🔧 OneSignal service loaded: object"');
      console.log('   ▶️ "✅ ONESIGNAL PUSH SENT! ID: [notification-id]"');
      
      console.log('\n📱 ALSO: Check your provider devices for notifications!');
      console.log('   - Should receive notification within 30 seconds');
      console.log('   - Title: "New Customer Request Available! 🛎️"');
      console.log(`   - Message: "${testCategory.name} needed in Test Area, 4000"`);
      
      console.log('\n🌐 Check OneSignal Dashboard:');
      console.log('   URL: https://dashboard.onesignal.com/apps/a3f5070d-9c46-44cd-8b0a-259df155ae94/push');
      console.log('   Look for NEW notification with proper targeting');
      
      // Wait a bit and give results
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('\n📊 Test Results:');
      console.log('✅ Customer request created successfully');
      console.log('✅ External user IDs manually set (provider-1, provider-2)');
      console.log('✅ Server should now be able to target these IDs');
      console.log('⏳ Check server logs and devices for notification delivery');
      
    } else {
      const errorText = await requestResponse.text();
      console.log('❌ Service request failed:', errorText);
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

// Run the test
testServerNotificationFlow();
