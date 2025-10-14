# Unique Voucher Creation for SMS Campaigns

## Overview
This implementation automatically creates **unique voucher codes** for each recipient when sending SMS campaigns with a voucher amount specified.

## Problem Solved
Previously, SMS campaigns would show empty voucher codes like:
```
Voucher ''
```

Now, each recipient receives their own unique 6-digit voucher code:
```
Voucher 'ABC123'
Voucher 'XYZ789'
Voucher 'QWE456'
```

## Implementation Details

### 1. SMS Service (`server/smsService.ts`)

Added three new methods:

#### `generateVoucherCode()` - Private Method
- Generates a random 6-character alphanumeric code
- Uses characters: `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`
- Excludes similar-looking characters (0, O, I, 1, etc.)

#### `createVoucher(voucherAmount, adminName)` - Public Method
- Creates a voucher in the database with:
  - Unique 6-digit code
  - Specified dollar value
  - 30-day expiry from creation
  - Status: 'active'
- Handles duplicate code collisions (retries up to 10 times)
- Returns: `{ code: string, value: number }`

#### `sendSmsWithVoucher(phone, customerName, messageTemplate, voucherAmount, options)` - Public Method
- Creates a unique voucher
- Replaces placeholders in message template:
  - `{customerName}` → actual customer name
  - `{voucherCode}` → generated voucher code
  - `{voucherAmount}` → voucher dollar value
- Sends SMS with the voucher code
- Returns: `{ success: boolean, voucherCode?: string, message?: string }`

### 2. Campaign Storage (`server/storage.ts`)

Modified `sendSmsCampaign()` method:

#### Logic Flow:
1. **Check if campaign has voucherAmount > 0**
   - If YES → Use `sendSmsWithVoucher()` to create unique voucher per recipient
   - If NO → Send regular SMS without voucher

2. **For campaigns with vouchers:**
   ```typescript
   const voucherResult = await smsService.sendSmsWithVoucher(
     customer.phone,
     customer.name,
     campaign.message,
     Number(campaign.voucherAmount),
     {
       customerId: customer.id,
       adminName: adminName || 'admin',
       smsType: 'campaign'
     }
   );
   ```

3. **Result includes:**
   - Success/failure status
   - Unique voucher code (if successful)
   - Final message sent to customer

## Usage

### Creating a Campaign with Vouchers

1. **Create SMS Campaign** with a `voucherAmount`:
   ```json
   {
     "name": "Welcome Campaign",
     "message": "Hello {customerName}! Here is your ${voucherAmount} voucher: {voucherCode}",
     "voucherAmount": 20,
     "targetAudience": "selected"
   }
   ```

2. **Send Campaign** to recipients:
   ```json
   {
     "campaignId": 123,
     "customerIds": [1, 2, 3],
     "adminName": "admin"
   }
   ```

3. **Results** include voucher codes:
   ```json
   {
     "successCount": 3,
     "failureCount": 0,
     "results": [
       {
         "customerId": 1,
         "name": "John Doe",
         "phone": "+61412345678",
         "status": "sent",
         "voucherCode": "ABC123"
       },
       {
         "customerId": 2,
         "name": "Jane Smith",
         "phone": "+61487654321",
         "status": "sent",
         "voucherCode": "XYZ789"
       }
     ]
   }
   ```

## Message Template Placeholders

Use these placeholders in your campaign message:

| Placeholder | Description | Example |
|------------|-------------|---------|
| `{customerName}` | Recipient's name | "Emma Wilson" |
| `{voucherCode}` | Unique voucher code | "ABC123" |
| `{voucherAmount}` | Voucher dollar value | "20" |

### Example Template:
```
Hello {customerName}! Welcome to ServicePanda your friendly Service Provider app, 
click here to download the app https://tinurl/123 as per our first launch, 
here is a ${voucherAmount}.00 voucher for your first job with us. 
Voucher '{voucherCode}'.

If you do not wish to receive any sms, please reply STOP
```

### Output for Emma Wilson:
```
Hello Emma Wilson! Welcome to ServicePanda your friendly Service Provider app, 
click here to download the app https://tinurl/123 as per our first launch, 
here is a $20.00 voucher for your first job with us. 
Voucher 'ABC123'.

If you do not wish to receive any sms, please reply STOP
```

## Database Schema

Vouchers are stored in the `provider_vouchers` table:

```sql
CREATE TABLE provider_vouchers (
  id SERIAL PRIMARY KEY,
  code VARCHAR(6) UNIQUE NOT NULL,  -- Unique 6-digit code
  value DECIMAL(10, 2) NOT NULL,    -- Dollar value
  description TEXT,
  status VARCHAR(20) DEFAULT 'active',  -- 'active', 'redeemed', 'expired'
  expiry_date TIMESTAMP NOT NULL,       -- 30 days from creation
  redeemed_by INTEGER,                  -- Provider ID who redeemed
  redeemed_at TIMESTAMP,
  created_by VARCHAR DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Voucher Management

### View All Vouchers
```
GET /api/admin/vouchers
```

### Voucher Lifecycle
1. **Created** - When campaign is sent
2. **Active** - Available for redemption (30 days)
3. **Redeemed** - Provider uses voucher
4. **Expired** - 30 days passed without redemption

## Testing

Run the test script to verify the implementation:

```bash
node test_voucher_sms_campaign.cjs
```

This test will:
1. Login as admin
2. Create a test campaign with voucher amount
3. Send to multiple recipients
4. Verify each recipient gets a unique voucher code
5. Display all generated voucher codes

## Benefits

✅ **Unique Codes** - Each customer gets their own voucher  
✅ **Automatic Creation** - No manual voucher creation needed  
✅ **Trackable** - All vouchers logged in database  
✅ **Expiry Date** - Vouchers expire after 30 days  
✅ **Collision Handling** - Automatic retry if duplicate code generated  
✅ **Campaign Results** - Voucher codes included in send results  

## Technical Notes

- **Thread-safe** - Database unique constraint prevents duplicates
- **Retry Logic** - Up to 10 attempts if code collision occurs
- **Character Set** - Excludes confusing characters (0/O, 1/I, etc.)
- **Backwards Compatible** - Campaigns without `voucherAmount` work as before
- **Error Handling** - Failed voucher creation doesn't crash campaign

## Future Enhancements

Potential improvements:
- [ ] Custom expiry dates per campaign
- [ ] Voucher usage tracking
- [ ] Provider-specific vouchers
- [ ] Voucher redemption notifications
- [ ] Bulk voucher generation
- [ ] Voucher analytics dashboard

