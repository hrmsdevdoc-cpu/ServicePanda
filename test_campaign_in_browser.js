// Copy and paste this ENTIRE code into your browser console (F12)
// Make sure you're on the admin panel page and logged in

console.log('🧪 Testing Campaign Creation...\n');

const campaignData = {
  name: 'Test Voucher Campaign ' + Date.now(),
  message: `Hello {customerName}! Welcome to ServicePanda your friendly Service Provider app, click here to download the app https://tinurl/123 as per our first launch, here is a $20.00 voucher for your first job with us. Voucher '{voucherCode}'.

If you do not wish to receive any sms, please reply STOP`,
  voucherCode: null,
  voucherAmount: 20,
  selectedStates: ['Queensland', 'New South Wales'],
  selectedRegions: null,
  selectedStatuses: ['New'],
  scheduledAt: null,
  status: 'draft'
};

console.log('📋 Campaign Data:', campaignData);

fetch('/api/admin/sms/campaigns', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify(campaignData)
})
.then(response => {
  console.log('📊 Response Status:', response.status);
  return response.json().then(data => ({
    status: response.status,
    data: data
  }));
})
.then(result => {
  if (result.status === 201 || result.status === 200) {
    console.log('✅ SUCCESS! Campaign created!');
    console.log('📄 Campaign Details:', result.data);
    alert('✅ Campaign created successfully!\n\nID: ' + result.data.id + '\nName: ' + result.data.name);
  } else {
    console.error('❌ Failed with status:', result.status);
    console.error('📋 Error Response:', result.data);
    alert('❌ Error: ' + (result.data.error || result.data.message || 'Unknown error'));
  }
})
.catch(error => {
  console.error('❌ Network Error:', error);
  alert('❌ Network Error: ' + error.message);
});

