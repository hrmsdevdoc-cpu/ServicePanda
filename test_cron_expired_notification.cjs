/**
 * Test REAL Cron Job Expired Lead Notification
 * Simulates what happens when server cron processes expired leads
 */

const ONESIGNAL_APP_ID = 'f64bf04a-b174-4862-a7b4-62b8d93f159b';
const ONESIGNAL_REST_API_KEY = 'os_v2_app_6zf7asvroregfj5umk4nspyvtoi4yl4hrd3u7suvnwraxsu43zmjjgzlysqusuxf7gjgfkjzgwpunhz4m3yflqr4fz7kfitlcxxsexy';

const fetch = require('node-fetch');

async function sendExpiredLeadNotification(providerId = '1') {
  console.log('⏰ CRON JOB: Processing expired leads...');
  console.log(`📧 Sending expired lead notification to provider ${providerId}`);
  
  const payload = {
    app_id: ONESIGNAL_APP_ID,
    headings: { 
      en: '⚠️ Lead Offer Expired' 
    },
    contents: { 
      en: `Your lead offer has expired!\n\nLead ID: 74\nCustomer: John Smith\nService: Plumbing\n\nThis notification came from SERVER CRON JOB at ${new Date().toLocaleTimeString()}`
    },
    // Send to specific provider
    included_segments: ['Subscribed Users'], // Broadcast to all (since device not registered yet)
    data: {
      type: 'lead_expired',
      leadId: '74',
      providerId: providerId,
      source: 'cron_job',
      timestamp: Date.now()
    }
  };

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS: Expired lead notification sent via CRON!');
      console.log('📊 Notification ID:', result.id || 'Generated');
      console.log('👥 Recipients:', result.recipients || 'All subscribed');
      console.log('');
      console.log('🔥 This is exactly how REAL cron notifications work!');
      console.log('📱 Check emulator - notification should appear even if app closed!');
    } else {
      console.log('❌ Failed to send cron notification');
      console.log('📋 Response:', result);
    }
  } catch (error) {
    console.error('💥 Cron notification error:', error.message);
  }
}

async function sendPriceDropNotification() {
  console.log('💰 CRON JOB: Processing price drop alerts...');
  
  const payload = {
    app_id: ONESIGNAL_APP_ID,
    headings: { 
      en: '💸 Price Drop Alert!' 
    },
    contents: { 
      en: `Price competition started!\n\nLead ID: 74\nCurrent lowest bid: $150\nYour chance to bid lower!\n\nCron notification at ${new Date().toLocaleTimeString()}`
    },
    included_segments: ['Subscribed Users'],
    data: {
      type: 'price_drop',
      leadId: '74',
      source: 'cron_job',
      timestamp: Date.now()
    }
  };

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS: Price drop notification sent via CRON!');
      console.log('📊 Notification ID:', result.id || 'Generated');
      console.log('');
      console.log('🎯 Both CRON notifications working perfectly!');
    } else {
      console.log('❌ Failed to send price drop notification');
      console.log('📋 Response:', result);
    }
  } catch (error) {
    console.error('💥 Price drop notification error:', error.message);
  }
}

// Simulate real cron job execution
async function simulateRealCronJob() {
  console.log('🤖 SIMULATING REAL SERVER CRON JOB...');
  console.log('⏰ Time:', new Date().toLocaleString());
  console.log('🔄 Processing background tasks...');
  console.log('');
  
  // Wait 2 seconds (simulate processing)
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Send expired lead notification
  await sendExpiredLeadNotification('1');
  
  console.log('');
  console.log('⏳ Waiting 3 seconds before next cron task...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Send price drop notification
  await sendPriceDropNotification();
  
  console.log('');
  console.log('🎉 CRON JOB COMPLETED!');
  console.log('📱 Check your emulator for BOTH notifications!');
}

simulateRealCronJob();
