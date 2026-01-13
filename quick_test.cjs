// Quick OneSignal test
const payload = {
  app_id: 'f64bf04a-b174-4862-a7b4-62b8d93f159b',
  headings: { en: 'Device Registration Test' },
  contents: { en: 'Testing if server notifications work. Time: ' + new Date().toLocaleTimeString() },
  included_segments: ['Subscribed Users']
};

fetch('https://onesignal.com/api/v1/notifications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic os_v2_app_6zf7asvroregfj5umk4nspyvtoi4yl4hrd3u7suvnwraxsu43zmjjgzlysqusuxf7gjgfkjzgwpunhz4m3yflqr4fz7kfitlcxxsexy'
  },
  body: JSON.stringify(payload)
}).then(r => r.json()).then(result => {
  console.log('✅ Server API working:', result.id ? 'YES' : 'NO');
  console.log('💡 Focus on device registration in app logs');
}).catch(err => console.log('❌ Error:', err.message));
