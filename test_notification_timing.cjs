const fetch = (await import('node-fetch')).default;

console.log('🚀 Testing Notification Timing Improvements...\n');

async function testNotificationTiming() {
  try {
    const startTime = Date.now();
    
    // Test 1: Create customer request
    console.log('1️⃣ Creating customer request...');
    const customerRequestResponse = await fetch('http://localhost:3000/api/service-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token-customer-1'
      },
      body: JSON.stringify({
        categoryId: 1,
        description: 'Test timing - urgent plumbing needed immediately',
        preferredDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        urgency: 'high',
        budget: 500,
        suburb: 'Melbourne',
        postcode: '3000'
      })
    });

    if (!customerRequestResponse.ok) {
      const errorText = await customerRequestResponse.text();
      console.log(`❌ Customer request failed: ${customerRequestResponse.status} - ${errorText}`);
      return;
    }

    const requestResult = await customerRequestResponse.json();
    const requestTime = Date.now();
    console.log(`✅ Customer request created in ${requestTime - startTime}ms`);
    console.log(`   Request ID: ${requestResult.id}`);

    // Test 2: Check if leads appear immediately for provider
    console.log('\n2️⃣ Checking provider leads immediately...');
    const leadsResponse = await fetch('http://localhost:3000/api/provider/leads', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token-provider-1'
      }
    });

    if (leadsResponse.ok) {
      const leads = await leadsResponse.json();
      const checkTime = Date.now();
      console.log(`✅ Provider leads checked in ${checkTime - requestTime}ms`);
      console.log(`   Total leads: ${leads.length}`);
      console.log(`   Pending leads: ${leads.filter(l => l.status === 'pending').length}`);
      
      const newLeads = leads.filter(l => l.status === 'pending');
      if (newLeads.length > 0) {
        console.log('🎉 SUCCESS: New leads detected immediately!');
        console.log('   New leads:', newLeads.map(l => ({ id: l.requestId, category: l.categoryName, urgency: l.urgency })));
      } else {
        console.log('⚠️ No new leads detected - may need to wait for processing');
      }
    }

    // Test 3: Check notifications
    console.log('\n3️⃣ Checking notifications...');
    const notificationResponse = await fetch('http://localhost:3000/api/provider/notifications/poll', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-provider-id': '1'
      }
    });

    if (notificationResponse.ok) {
      const notifications = await notificationResponse.json();
      const notificationTime = Date.now();
      console.log(`✅ Notifications checked in ${notificationTime - requestTime}ms`);
      console.log(`   Notifications: ${notifications.notifications?.length || 0}`);
      
      if (notifications.notifications && notifications.notifications.length > 0) {
        console.log('🔔 Notifications received:', notifications.notifications.map(n => n.title));
      }
    }

    const totalTime = Date.now() - startTime;
    console.log(`\n⏱️ Total test time: ${totalTime}ms`);
    
    console.log('\n📊 Timing Improvements Made:');
    console.log('   - Cron job: 5 minutes → 1 minute');
    console.log('   - Long poll timeout: 30 seconds → 10 seconds');
    console.log('   - Provider app: 30-second refetch interval');
    console.log('   - Customer request → Lead distribution: Immediate');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testNotificationTiming();
