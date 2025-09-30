#!/usr/bin/env node

// Test real customer request to trigger notifications after the fix
console.log('🧪 Testing Real Customer Request → OneSignal Flow');
console.log('=' .repeat(60));

async function testRealCustomerRequest() {
  try {
    // Step 1: Login as customer
    console.log('\n📝 Step 1: Login as customer...');
    
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@customer.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      // Try to create customer if login fails
      console.log('ℹ️ Customer not found, creating test customer...');
      
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
        // Login again
        const loginResponse2 = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@customer.com',
            password: 'password123'
          })
        });
        
        if (!loginResponse2.ok) {
          throw new Error('Failed to login after registration');
        }
        
        const loginData = await loginResponse2.json();
        var authToken = loginData.token;
      } else {
        throw new Error('Failed to create test customer');
      }
    } else {
      const loginData = await loginResponse.json();
      var authToken = loginData.token;
    }
    
    console.log('✅ Customer logged in successfully');

    // Step 2: Get service categories
    console.log('\n📋 Step 2: Get service categories...');
    const categoriesResponse = await fetch('http://localhost:3000/api/service-categories');
    const categories = await categoriesResponse.json();
    
    if (!categories || categories.length === 0) {
      throw new Error('No service categories found');
    }
    
    const testCategory = categories[0];
    console.log(`✅ Using category: ${testCategory.name} (ID: ${testCategory.id})`);

    // Step 3: Create service request (THIS SHOULD TRIGGER NOTIFICATIONS!)
    console.log('\n🛎️ Step 3: Creating service request...');
    console.log('⚡ This should trigger the FIXED OneSignal notification flow!');
    
    const serviceRequestData = {
      categoryId: testCategory.id,
      description: 'Test request to verify FIXED OneSignal notifications - ' + new Date().toLocaleTimeString(),
      suburb: 'Test Area',
      postcode: '4000', // Use postcode that has providers
      contactPhone: '+1234567890',
      preferredDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      urgency: 'medium'
    };

    console.log('📤 Sending service request with data:', {
      category: testCategory.name,
      postcode: serviceRequestData.postcode,
      description: serviceRequestData.description.substring(0, 50) + '...'
    });

    const requestResponse = await fetch('http://localhost:3000/api/service-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(serviceRequestData)
    });

    if (!requestResponse.ok) {
      const errorText = await requestResponse.text();
      throw new Error(`Service request failed: ${requestResponse.status} - ${errorText}`);
    }

    const requestData = await requestResponse.json();
    console.log('✅ Service request created successfully!');
    console.log(`📋 Request ID: ${requestData.request.id}`);

    // Step 4: Monitor for notifications
    console.log('\n⏳ Step 4: Monitoring server logs...');
    console.log('🔍 WATCH YOUR SERVER CONSOLE for these messages:');
    console.log('   1. "Starting automatic lead distribution for request [ID]"');
    console.log('   2. "🛎️ Notifying X providers of new customer request"');
    console.log('   3. "🚀 SENDING REAL ONESIGNAL PUSH NOTIFICATION to provider X"');
    console.log('   4. "🔧 OneSignal service loaded: object" ← THIS IS THE FIX!');
    console.log('   5. "✅ ONESIGNAL PUSH SENT! ID: [notification-id]" ← SUCCESS!');
    
    console.log('\n📊 Step 5: Check OneSignal Dashboard');
    console.log('🌐 URL: https://dashboard.onesignal.com/apps/a3f5070d-9c46-44cd-8b0a-259df155ae94/push');
    console.log('🔍 Look for NEW notification with:');
    console.log(`   - Title: "New Customer Request Available! 🛎️"`);
    console.log(`   - Message: "${testCategory.name} needed in Test Area, 4000"`);
    console.log(`   - Status: "Delivered" (not "Failed")`);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\n🎉 Test completed!');
    console.log('📋 If you see the success messages in server logs, the fix worked!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure server is running');
    console.log('   2. Check if test customer exists');
    console.log('   3. Verify service categories are available');
  }
}

// Run the test
testRealCustomerRequest();
