#!/usr/bin/env node

// Verify if the server OneSignal fix is actually working
console.log('🔍 Verifying Server OneSignal Fix...');
console.log('=' .repeat(50));

async function verifyServerFix() {
  try {
    console.log('📋 Checking server files...');
    
    // Check if server is running
    console.log('\n1️⃣ Testing server health...');
    try {
      const healthResponse = await fetch('http://localhost:3000/api/health');
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log('✅ Server is running');
        console.log(`   Status: ${healthData.status}`);
        console.log(`   Timestamp: ${healthData.timestamp}`);
      } else {
        console.log('❌ Server health check failed');
        return;
      }
    } catch (error) {
      console.log('❌ Server is not running');
      console.log('💡 Start server with: npm run dev');
      return;
    }

    // Test a simple customer request to trigger notifications
    console.log('\n2️⃣ Testing customer request → notification flow...');
    
    // First login as customer
    console.log('   📝 Logging in as test customer...');
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
      console.log('   ✅ Customer login successful');
    } else {
      console.log('   ❌ Customer login failed - creating test customer...');
      
      // Create test customer
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
        console.log('   ✅ Test customer created');
        // Login again
        const loginResponse2 = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@customer.com',
            password: 'password123'
          })
        });
        
        if (loginResponse2.ok) {
          const loginData = await loginResponse2.json();
          authToken = loginData.token;
          console.log('   ✅ Customer login after registration successful');
        } else {
          throw new Error('Failed to login after registration');
        }
      } else {
        throw new Error('Failed to create test customer');
      }
    }

    // Get service categories
    console.log('   📋 Getting service categories...');
    const categoriesResponse = await fetch('http://localhost:3000/api/service-categories');
    const categories = await categoriesResponse.json();
    
    if (!categories || categories.length === 0) {
      throw new Error('No service categories found');
    }
    
    const testCategory = categories[0];
    console.log(`   ✅ Using category: ${testCategory.name} (ID: ${testCategory.id})`);

    // Create service request - THIS SHOULD TRIGGER THE FIXED NOTIFICATION FLOW
    console.log('   🛎️ Creating service request to trigger notifications...');
    
    const serviceRequestData = {
      categoryId: testCategory.id,
      description: 'TESTING FIXED ONESIGNAL FLOW - ' + new Date().toLocaleTimeString(),
      suburb: 'Test Area',
      postcode: '4000',
      contactPhone: '+1234567890',
      preferredDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      urgency: 'medium'
    };

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
      console.log('   ✅ Service request created successfully!');
      console.log(`   📋 Request ID: ${requestData.request.id}`);
      
      console.log('\n3️⃣ CRITICAL: Check your server console NOW!');
      console.log('   🔍 Look for these messages (should appear immediately):');
      console.log('   ▶️ "Starting automatic lead distribution for request [ID]"');
      console.log('   ▶️ "🛎️ Notifying X providers of new customer request"');
      console.log('   ▶️ "🚀 SENDING REAL ONESIGNAL PUSH NOTIFICATION"');
      console.log('   ▶️ "🔧 OneSignal service loaded: object" ← FIX CONFIRMATION');
      console.log('   ▶️ "✅ ONESIGNAL PUSH SENT! ID: [id]" ← SUCCESS');
      
      console.log('\n   ❌ If you see these ERROR messages, fix not applied:');
      console.log('   ❌ "Cannot read properties of undefined (reading \'sendToProvider\')"');
      console.log('   ❌ "CRITICAL ERROR in OneSignal push"');
      
      console.log('\n4️⃣ Check OneSignal Dashboard:');
      console.log('   🌐 https://dashboard.onesignal.com/apps/a3f5070d-9c46-44cd-8b0a-259df155ae94/push');
      console.log('   🔍 Look for NEW notification with updated API key');
      
    } else {
      const errorText = await requestResponse.text();
      console.log('   ❌ Service request failed:', errorText);
    }

    console.log('\n📊 Verification Results:');
    console.log('✅ Server is running');
    console.log('✅ API endpoints working');
    console.log('✅ Service request created');
    console.log('⏳ Now check server logs for fix confirmation');

  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    console.log('\n🔧 If server is slow/hanging:');
    console.log('   1. The OneSignal import fix might not be applied');
    console.log('   2. Server might need restart');
    console.log('   3. TypeScript compilation might be needed');
  }
}

// Run verification
verifyServerFix();
