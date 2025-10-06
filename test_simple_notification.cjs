// Simple notification test
const sendNotification = async () => {
  const appId = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
  const restApiKey = 'os_v2_app_up2qodm4izcm3cykewo7cvnossbylenoajculv4dkp4bz42fwbct55k5alljhd2qrvf2vnr7pvfen5aajjokeet7ibwxv4ug2wnzsni';
  
  const payload = {
    app_id: appId,
    included_segments: ['All'],
    headings: { en: 'Test Notification' },
    contents: { en: 'This is a simple broadcast notification!' },
    data: { test: true }
  };
  
  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`
      },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Notification sent successfully!');
      console.log('📦 Notification ID:', result.id);
    } else {
      console.log('❌ Notification failed:', result);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

sendNotification();