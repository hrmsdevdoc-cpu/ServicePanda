// Test the complete customer request flow
import fetch from 'node-fetch';

async function testCustomerRequestFlow() {
  console.log('🧪 Testing complete customer request flow...');
  
  // Test 1: Create a customer service request
  console.log('1️⃣ Creating customer service request...');
  
  const serviceRequest = {
    customerId: 'test-customer-123',
    categoryId: 1, // Assuming category 1 exists
    description: 'Test service request for notification testing',
    suburb: 'Sydney',
    postcode: '2000',
    preferredDate: new Date().toISOString(),
    status: 'active'
  };
  
  try {
    const response = await fetch('http://localhost:3000/api/service-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(serviceRequest)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Service request created:', result);
      console.log('📱 Check your provider app for notification!');
    } else {
      const error = await response.text();
      console.log('❌ Service request creation failed:', error);
    }
  } catch (error) {
    console.log('❌ Server not running or error:', error.message);
    console.log('💡 Make sure your server is running on localhost:3000');
  }
  
  // Test 2: Direct notification test (fallback)
  console.log('2️⃣ Testing direct notification as fallback...');
  
  const appId = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
  const restApiKey = 'os_v2_app_up2qodm4izcm3cykewo7cvnossbylenoajculv4dkp4bz42fwbct55k5alljhd2qrvf2vnr7pvfen5aajjokeet7ibwxv4ug2wnzsni';
  
  const notificationPayload = {
    app_id: appId,
    include_external_user_ids: ['provider-6'],
    headings: { en: '🛎️ New Customer Request!' },
    contents: { 
      en: `Test service request created!\n\nDescription: Test service request for notification testing\nLocation: Sydney, 2000\n\nThis simulates a real customer request!`
    },
    data: {
      type: 'customer_request',
      requestId: 'test-123',
      categoryName: 'Test Service',
      customerLocation: 'Sydney, 2000',
      description: 'Test service request for notification testing',
      timestamp: new Date().toISOString(),
      priority: 'high'
    },
    priority: 10,
    android_sound: "default",
    android_vibration_pattern: [1000, 1000],
    content_available: true
  };
  
  const notificationResponse = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${restApiKey}`
    },
    body: JSON.stringify(notificationPayload)
  });

  const notificationResult = await notificationResponse.json();
  
  if (notificationResponse.ok) {
    console.log('✅ Direct notification sent successfully!');
    console.log('📱 Notification ID:', notificationResult.id);
    console.log('📱 Check your device for the notification!');
  } else {
    console.log('❌ Direct notification failed:', notificationResult);
  }
  
  console.log('✅ Test completed!');
  console.log('📋 Summary:');
  console.log('   - If server is running: Check if customer request triggers notification');
  console.log('   - Direct notification: Should work and reach your device');
  console.log('   - Check your provider app for notifications!');
}

testCustomerRequestFlow().catch(console.error);
