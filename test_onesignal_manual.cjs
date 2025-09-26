/**
 * Manual OneSignal Test
 * OneSignal dashboard se manually add kar rahe hain user
 */

console.log('📱 Manual OneSignal Test Setup');
console.log('');
console.log('🎯 STEPS to test notifications:');
console.log('');
console.log('1. OneSignal dashboard mein jao: https://app.onesignal.com');
console.log('2. "Audience" → "Users" mein jao');
console.log('3. "Add User" button click karo');
console.log('4. Test user add karo with email/phone');
console.log('5. Phir ye script run karo');
console.log('');

async function sendToTestUser() {
  console.log('🧪 Sending test notification...');
  
  // Ye notification sabko milega jo bhi subscribe hai
  const payload = {
    app_id: 'f64bf04a-b174-4862-a7b4-62b8d93f159b',
    headings: { en: '🎯 Manual Test Working!' },
    contents: { 
      en: `Bhai manual test successful hai!\n\nNotification system ready!\n\nTime: ${new Date().toLocaleTimeString()}\n\nProduction mein properly device subscribe karege!`
    },
    // Target everyone (if any users exist)
    included_segments: ['Subscribed Users'],
    // Also target by email if you added test user
    // include_email_tokens: ['test@example.com']
  };

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic os_v2_app_6zf7asvroregfj5umk4nspyvtoi4yl4hrd3u7suvnwraxsu43zmjjgzlysqusuxf7gjgfkjzgwpunhz4m3yflqr4fz7kfitlcxxsexy'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Manual test notification sent!');
      console.log('📊 Result:', {
        id: result.id,
        recipients: result.recipients || 'Processing...'
      });
      console.log('');
      console.log('🎉 Notification system WORKING!');
      console.log('💡 Production mein proper device registration karege');
    } else {
      console.log('❌ Manual test failed:', result);
    }
  } catch (error) {
    console.log('💥 Error:', error.message);
  }
}

console.log('⏳ Waiting 5 seconds for you to add test user...');
setTimeout(() => {
  sendToTestUser();
}, 5000);
