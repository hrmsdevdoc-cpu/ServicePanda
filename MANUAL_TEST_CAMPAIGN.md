# Manual Test - Create Campaign

Since you're already logged into the admin panel in your browser, let's test it there!

## Step-by-Step Test

### 1. Open Browser Console
- Press **F12** to open Developer Tools
- Go to **Console** tab

### 2. Run This JavaScript Code

Copy and paste this into your browser console (while on the admin panel page):

```javascript
// Test campaign creation
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

fetch('/api/admin/sms/campaigns', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify(campaignData)
})
.then(response => {
  console.log('Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ SUCCESS! Campaign created:', data);
  alert('Campaign created successfully! ID: ' + data.id);
})
.catch(error => {
  console.error('❌ Error:', error);
  alert('Error creating campaign: ' + error.message);
});
```

### 3. Check the Result

You should see either:
- ✅ **Success**: "Campaign created successfully! ID: X"
- ❌ **Error**: The specific error message that's causing the issue

---

## OR: Use the UI (Easiest Way!)

Just use the admin panel interface:

### 1. Go to Potential Customers → SMS Campaigns tab

### 2. Click "Create New Campaign"

### 3. Fill in the form:

**Campaign Name:**
```
Test Voucher Campaign
```

**Message:**
```
Hello {customerName}! Welcome to ServicePanda your friendly Service Provider app, click here to download the app https://tinurl/123 as per our first launch, here is a $20.00 voucher for your first job with us. Voucher '{voucherCode}'.

If you do not wish to receive any sms, please reply STOP
```

**Voucher Amount:**
```
20
```

**Target States:** Select at least one (e.g., Queensland)

**Target Statuses:** Select at least one (e.g., New)

### 4. Click "Create Campaign"

---

## What to Look For

### If it WORKS:
- Toast notification: "Campaign Created"
- Campaign appears in the list
- Status shows "Draft"

### If it FAILS:
- Toast notification will show the ERROR MESSAGE
- Check browser console (F12) for detailed error
- Send me that error message and I'll fix it!

---

## Did You Restart the Server?

**IMPORTANT**: The fix I made requires the server to be restarted!

In your terminal where the server is running:
1. Press **Ctrl+C** to stop
2. Run **`npm run dev`** to restart
3. Wait for "Server running on port 3000" or similar message
4. Then try creating the campaign again

---

Let me know what happens! 🚀

