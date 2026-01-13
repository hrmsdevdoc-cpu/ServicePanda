#!/usr/bin/env node

// Debug actual customer request notification flow
console.log('🔍 Debugging Actual Customer Request Notification Flow...');
console.log('=' .repeat(60));

async function debugCustomerRequestFlow() {
  try {
    // Step 1: Check server endpoints
    console.log('📡 Step 1: Testing server endpoints...');
    
    const healthResponse = await fetch('http://localhost:3000/api/health');
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Server health OK');
      console.log(`   Timestamp: ${healthData.timestamp}`);
    } else {
      console.log('❌ Server health failed');
      return;
    }

    // Step 2: Test service categories endpoint
    console.log('\n📋 Step 2: Testing service categories...');
    try {
      const categoriesResponse = await fetch('http://localhost:3000/api/service-categories');
      if (categoriesResponse.ok) {
        const categories = await categoriesResponse.json();
        console.log(`✅ Service categories loaded: ${categories.length} categories`);
        console.log(`   First category: ${categories[0]?.name} (ID: ${categories[0]?.id})`);
      } else {
        console.log('❌ Service categories failed');
        return;
      }
    } catch (error) {
      console.log('❌ Categories error:', error.message);
      return;
    }

    // Step 3: Check if we can create a simple test customer
    console.log('\n👤 Step 3: Testing customer creation/login...');
    
    // Try to create test customer
    const testCustomerData = {
      email: 'debug@customer.com',
      password: 'password123',
      firstName: 'Debug',
      lastName: 'Customer',
      phone: '+1234567890',
      userType: 'customer'
    };

    console.log('🔧 Creating debug customer...');
    const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testCustomerData)
    });

    let authToken;
    if (registerResponse.ok || registerResponse.status === 400) {
      // Login whether register succeeded or customer already exists
      console.log('📝 Logging in debug customer...');
      const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'debug@customer.com',
          password: 'password123'
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        authToken = loginData.token;
        console.log('✅ Debug customer logged in successfully');
      } else {
        console.log('❌ Debug customer login failed');
        return;
      }
    } else {
      console.log('❌ Debug customer creation failed');
      return;
    }

    // Step 4: Create actual service request
    console.log('\n🛎️ Step 4: Creating actual service request...');
    
    const serviceRequestData = {
      categoryId: 1, // Use category ID 1
      description: 'DEBUG: Real customer request to test notification flow - ' + new Date().toLocaleTimeString(),
      suburb: 'Debug Area',
      postcode: '4000', // Use postcode that should have providers
      contactPhone: '+1234567890',
      preferredDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      urgency: 'medium'
    };

    console.log('📤 Sending real service request...');
    console.log(`   Category ID: ${serviceRequestData.categoryId}`);
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

    console.log(`   Request status: ${requestResponse.status}`);
    
    if (requestResponse.ok) {
      const requestData = await requestResponse.json();
      console.log('✅ Service request created successfully!');
      console.log(`📋 Request ID: ${requestData.request?.id || 'ID not found'}`);
      console.log(`📋 Response: ${JSON.stringify(requestData, null, 2)}`);
      
      console.log('\n⚡ CRITICAL: NOW WATCH YOUR SERVER CONSOLE!');
      console.log('🔍 You should see these messages immediately:');
      console.log('   ▶️ "Starting automatic lead distribution for request [ID]"');
      console.log('   ▶️ "🛎️ Notifying X providers of new customer request"');
      console.log('   ▶️ "🚀 SENDING REAL ONESIGNAL PUSH NOTIFICATION"');
      console.log('   ▶️ "🔧 OneSignal service loaded: object"');
      console.log('   ▶️ "✅ ONESIGNAL PUSH SENT! ID: [notification-id]"');
      
      console.log('\n❌ If you DON\'T see these messages:');
      console.log('   - Lead distribution might not be triggered');
      console.log('   - No eligible providers found');
      console.log('   - Server notification code not executing');
      
      console.log('\n📱 Also check provider devices for notification!');
      
    } else {
      const errorText = await requestResponse.text();
      console.log('❌ Service request failed!');
      console.log(`   Status: ${requestResponse.status}`);
      console.log(`   Error: ${errorText}`);
      
      // Check if it's HTML response
      if (errorText.includes('<!DOCTYPE')) {
        console.log('⚠️ Server returning HTML instead of JSON API response');
        console.log('💡 This suggests API routing issue or server not properly running');
      }
    }

  } catch (error) {
    console.error('\n❌ Debug failed:', error.message);
    console.log('\n🔧 Possible issues:');
    console.log('   1. Server not running properly');
    console.log('   2. API routes not configured');
    console.log('   3. Database connection issues');
    console.log('   4. Authentication problems');
  }
}

// Run debug
debugCustomerRequestFlow();
