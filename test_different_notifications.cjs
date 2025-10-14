// Test different notification types
const testNotifications = async () => {
  try {
    console.log('🧪 Testing different notification types...');
    
    const appId = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
    const restApiKey = 'os_v2_app_up2qodm4izcm3cykewo7cvnossbylenoajculv4dkp4bz42fwbct55k5alljhd2qrvf2vnr7pvfen5aajjokeet7ibwxv4ug2wnzsni';
    
    // Test 1: New Customer Request
    console.log('📝 Test 1: New Customer Request...');
    const requestPayload = {
      app_id: appId,
      included_segments: ['All'],
      headings: { en: '🆕 NEW CUSTOMER REQUEST! 🛎️' },
      contents: { en: '📍 Plumbing needed in Sydney\n"Fix my broken pipe urgently!"' },
      data: {
        type: 'customer_request',
        category: 'new_request',
        priority: 'high',
        action: 'view_request'
      }
    };
    
    const requestResponse = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`
      },
      body: JSON.stringify(requestPayload)
    });
    
    if (requestResponse.ok) {
      console.log('✅ New Customer Request notification sent!');
    }
    
    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 2: Price Drop Alert
    console.log('📝 Test 2: Price Drop Alert...');
    const priceDropPayload = {
      app_id: appId,
      included_segments: ['All'],
      headings: { en: '🔥 PRICE DROP ALERT! 💸' },
      contents: { en: '💰 Lead price dropped to $50! Limited time offer - grab it now!' },
      data: {
        type: 'price_drop',
        category: 'price_drop',
        priority: 'high',
        action: 'view_offer',
        newPrice: 50
      }
    };
    
    const priceDropResponse = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`
      },
      body: JSON.stringify(priceDropPayload)
    });
    
    if (priceDropResponse.ok) {
      console.log('✅ Price Drop Alert notification sent!');
    }
    
    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 3: Lead Expired
    console.log('📝 Test 3: Lead Expired...');
    const expiredPayload = {
      app_id: appId,
      included_segments: ['All'],
      headings: { en: '⏰ LEAD OFFER EXPIRED' },
      contents: { en: '❌ Your lead offer has expired and moved to the next provider.' },
      data: {
        type: 'lead_expired',
        category: 'lead_expired',
        priority: 'medium',
        action: 'view_offers'
      }
    };
    
    const expiredResponse = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`
      },
      body: JSON.stringify(expiredPayload)
    });
    
    if (expiredResponse.ok) {
      console.log('✅ Lead Expired notification sent!');
    }
    
    console.log('🎉 All notification types tested!');
    console.log('📱 Check your device - you should see 3 different notifications with clear identification!');
    
  } catch (error) {
    console.error('❌ Error testing notifications:', error);
  }
};

testNotifications();

