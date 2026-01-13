/**
 * Test different OneSignal API authorization formats
 * The issue might be in how we're formatting the Authorization header
 */

console.log('🔍 Testing OneSignal API Authorization Formats...');
console.log('⏰ Time:', new Date().toLocaleString());
console.log('');

const ONESIGNAL_APP_ID = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
const ONESIGNAL_REST_API_KEY = 'os_v2_app_up2qodm4izcm3cykewo7cvnosrtodbs2i5ce3r5zeusbxh5utqy7iys7bhaffdnt65vsy4ql6p5beykzl62ahn2jdgifjshulo2hkky';

async function testAuthFormats() {
  console.log('🔑 Testing Different Authorization Header Formats');
  console.log('');
  
  const testPayload = {
    app_id: ONESIGNAL_APP_ID,
    include_player_ids: ['bf78a978-b759-48b9-a4b2-94d4b7647d02'],
    headings: { en: '🔧 Auth Test' },
    contents: { 
      en: `Authorization format test!\n\nTime: ${new Date().toLocaleTimeString()}\n\nTesting API authentication...`
    },
    data: {
      testType: 'auth-format-test',
      timestamp: Date.now()
    }
  };
  
  // Test 1: Current format (Basic with API key)
  console.log('📱 TEST 1: Basic Auth with API Key (Current Method)');
  console.log('🔑 Authorization: Basic ' + ONESIGNAL_REST_API_KEY.substring(0, 20) + '...');
  
  try {
    const response1 = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
      },
      body: JSON.stringify(testPayload)
    });
    
    const result1 = await response1.json();
    
    console.log(`   📊 Status: ${response1.status}`);
    if (response1.ok) {
      console.log('   ✅ SUCCESS! This format works!');
      console.log(`   📊 Recipients: ${result1.recipients || 0}`);
      console.log(`   🆔 Notification ID: ${result1.id}`);
    } else {
      console.log('   ❌ Failed with error:', result1);
    }
  } catch (error) {
    console.log('   💥 Error:', error.message);
  }
  
  console.log('');
  
  // Test 2: Bearer token format
  console.log('📱 TEST 2: Bearer Token Format');
  console.log('🔑 Authorization: Bearer ' + ONESIGNAL_REST_API_KEY.substring(0, 20) + '...');
  
  try {
    const response2 = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ONESIGNAL_REST_API_KEY}`
      },
      body: JSON.stringify(testPayload)
    });
    
    const result2 = await response2.json();
    
    console.log(`   📊 Status: ${response2.status}`);
    if (response2.ok) {
      console.log('   ✅ SUCCESS! Bearer format works!');
      console.log(`   📊 Recipients: ${result2.recipients || 0}`);
      console.log(`   🆔 Notification ID: ${result2.id}`);
    } else {
      console.log('   ❌ Failed with error:', result2);
    }
  } catch (error) {
    console.log('   💥 Error:', error.message);
  }
  
  console.log('');
  
  // Test 3: Check if we need to encode the API key in Base64
  console.log('📱 TEST 3: Base64 Encoded API Key');
  const encodedKey = Buffer.from(ONESIGNAL_REST_API_KEY).toString('base64');
  console.log('🔑 Authorization: Basic ' + encodedKey.substring(0, 20) + '...');
  
  try {
    const response3 = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedKey}`
      },
      body: JSON.stringify(testPayload)
    });
    
    const result3 = await response3.json();
    
    console.log(`   📊 Status: ${response3.status}`);
    if (response3.ok) {
      console.log('   ✅ SUCCESS! Base64 encoding works!');
      console.log(`   📊 Recipients: ${result3.recipients || 0}`);
      console.log(`   🆔 Notification ID: ${result3.id}`);
    } else {
      console.log('   ❌ Failed with error:', result3);
    }
  } catch (error) {
    console.log('   💥 Error:', error.message);
  }
  
  console.log('');
  
  // Test 4: Try direct API key in header
  console.log('📱 TEST 4: Direct API Key Header');
  console.log('🔑 Authorization: ' + ONESIGNAL_REST_API_KEY.substring(0, 20) + '...');
  
  try {
    const response4 = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ONESIGNAL_REST_API_KEY
      },
      body: JSON.stringify(testPayload)
    });
    
    const result4 = await response4.json();
    
    console.log(`   📊 Status: ${response4.status}`);
    if (response4.ok) {
      console.log('   ✅ SUCCESS! Direct API key works!');
      console.log(`   📊 Recipients: ${result4.recipients || 0}`);
      console.log(`   🆔 Notification ID: ${result4.id}`);
    } else {
      console.log('   ❌ Failed with error:', result4);
    }
  } catch (error) {
    console.log('   💥 Error:', error.message);
  }
  
  console.log('');
  console.log('🎯 API AUTHORIZATION TEST COMPLETE!');
  console.log('');
  console.log('💡 If any test shows SUCCESS, use that authorization format!');
}

testAuthFormats();
