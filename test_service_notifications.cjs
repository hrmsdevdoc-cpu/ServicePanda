// Test notifications with service category names
const testServiceNotifications = async () => {
  try {
    console.log('🧪 Testing notifications with service category names...');
    
    const appId = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
    const restApiKey = 'os_v2_app_up2qodm4izcm3cykewo7cvnossbylenoajculv4dkp4bz42fwbct55k5alljhd2qrvf2vnr7pvfen5aajjokeet7ibwxv4ug2wnzsni';
    
    // Test 1: Price Drop with Service Name
    console.log('📝 Test 1: Price Drop with Plumbing service...');
    const priceDropPayload = {
      app_id: appId,
      included_segments: ['All'],
      headings: { en: '🔥 PRICE DROP ALERT! 💸' },
      contents: { en: '💰 Plumbing lead price dropped to $75! Limited time offer - grab it now!' },
      data: {
        type: 'price_drop',
        category: 'price_drop',
        priority: 'high',
        action: 'view_offer',
        newPrice: 75,
        serviceCategory: 'Plumbing'
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
      console.log('✅ Price Drop notification with Plumbing service sent!');
    }
    
    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 2: Lead Expired with Service Name
    console.log('📝 Test 2: Lead Expired with Electrical service...');
    const expiredPayload = {
      app_id: appId,
      included_segments: ['All'],
      headings: { en: '⏰ LEAD OFFER EXPIRED' },
      contents: { en: '❌ Your Electrical lead offer has expired and moved to the next provider.' },
      data: {
        type: 'lead_expired',
        category: 'lead_expired',
        priority: 'medium',
        action: 'view_offers',
        serviceCategory: 'Electrical'
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
      console.log('✅ Lead Expired notification with Electrical service sent!');
    }
    
    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 3: New Request with Service Name
    console.log('📝 Test 3: New Request with Cleaning service...');
    const newRequestPayload = {
      app_id: appId,
      included_segments: ['All'],
      headings: { en: '🆕 NEW CUSTOMER REQUEST! 🛎️' },
      contents: { en: '📍 Cleaning needed in Melbourne\n"Deep clean my house urgently!"' },
      data: {
        type: 'customer_request',
        category: 'new_request',
        priority: 'high',
        action: 'view_request',
        serviceCategory: 'Cleaning'
      }
    };
    
    const newRequestResponse = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`
      },
      body: JSON.stringify(newRequestPayload)
    });
    
    if (newRequestResponse.ok) {
      console.log('✅ New Request notification with Cleaning service sent!');
    }
    
    console.log('🎉 All service notifications tested!');
    console.log('📱 Check your device - you should see service names in notifications!');
    console.log('📋 Examples:');
    console.log('   - "Plumbing lead price dropped to $75!"');
    console.log('   - "Your Electrical lead offer has expired"');
    console.log('   - "Cleaning needed in Melbourne"');
    
  } catch (error) {
    console.error('❌ Error testing service notifications:', error);
  }
};

testServiceNotifications();



