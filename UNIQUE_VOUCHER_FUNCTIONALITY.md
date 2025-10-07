# Unique Voucher Campaign Functionality

## Overview
This implementation adds the ability to generate **unique voucher codes for each individual customer** when executing SMS campaigns, instead of using a single voucher code for all customers.

## Key Features

### 1. **Unique Voucher Generation**
- Each customer receives a randomly generated 6-character voucher code (e.g., "ABC123", "XYZ789")
- Voucher codes are generated using alphanumeric characters (A-Z, 0-9)
- No two customers will receive the same voucher code

### 2. **Personalized Message Templates**
- Support for placeholders in SMS messages:
  - `{customerName}` - Replaced with the actual customer's name
  - `{voucherCode}` - Replaced with the unique voucher code for that customer
  - `{voucherAmount}` - Replaced with the voucher amount (e.g., "30")

### 3. **Enhanced Campaign Management**
- **"Send Campaign" button** added to campaign table
- Campaigns can be executed with unique vouchers for all targeted customers
- Real-time tracking of campaign execution status
- Detailed results showing which customers received unique vouchers

## How It Works

### 1. **Campaign Creation**
When creating a campaign, you can use placeholders in your message template:
```
Hello {customerName}! Welcome to ServicePanda. 
Here's your unique voucher: {voucherCode} worth ${voucherAmount}. 
Reply STOP to unsubscribe.
```

### 2. **Campaign Execution**
When you click "Send Campaign":
1. The system identifies all customers matching your campaign criteria
2. For each customer, it generates a unique voucher code
3. It personalizes the message with:
   - Customer's actual name
   - Their unique voucher code
   - The voucher amount
4. Sends the personalized SMS to each customer

### 3. **Example Output**
If you have 3 customers (John, Sarah, Mike), they might receive:

**John receives:**
```
Hello John! Welcome to ServicePanda. 
Here's your unique voucher: ABC123 worth $30. 
Reply STOP to unsubscribe.
```

**Sarah receives:**
```
Hello Sarah! Welcome to ServicePanda. 
Here's your unique voucher: XYZ789 worth $30. 
Reply STOP to unsubscribe.
```

**Mike receives:**
```
Hello Mike! Welcome to ServicePanda. 
Here's your unique voucher: DEF456 worth $30. 
Reply STOP to unsubscribe.
```

## Technical Implementation

### Backend Changes

#### 1. **SMS Service Enhancement** (`server/smsService.ts`)
- Added `generateVoucherCode()` method for unique code generation
- Added `sendSmsWithVoucher()` method for personalized SMS sending
- Enhanced message template processing with placeholder replacement

#### 2. **New API Endpoint** (`server/routes.ts`)
- **POST** `/api/admin/campaigns/execute`
- Processes campaigns with unique vouchers
- Returns detailed results for each customer

### Frontend Changes

#### 1. **Campaign Management** (`client/src/pages/admin/AdminPotentialCustomers.tsx`)
- Added "Send Campaign" button to campaign table
- Enhanced message template with placeholder support
- Added campaign execution mutation
- Updated UI to show voucher code is for reference only

#### 2. **User Interface Updates**
- Placeholder examples in message templates
- Clear indication that voucher codes are unique per customer
- Helpful text explaining placeholder usage

## Usage Instructions

### 1. **Create a Campaign**
1. Go to the SMS Campaigns tab
2. Click "Add New Campaign"
3. Fill in campaign details
4. In the message field, use placeholders:
   ```
   Hello {customerName}! Your voucher {voucherCode} is worth ${voucherAmount}
   ```
5. Set voucher amount (this will be the same for all customers)
6. Select target audience (states, regions, customer statuses)

### 2. **Execute Campaign**
1. Find your campaign in the campaigns table
2. Click "Send Campaign" button
3. The system will:
   - Generate unique vouchers for each customer
   - Send personalized SMS messages
   - Update campaign status to "Sent"
   - Show execution results

### 3. **Monitor Results**
- View campaign execution results in real-time
- See which customers received unique vouchers
- Track success/failure rates
- Review individual customer details

## Benefits

1. **Enhanced Personalization**: Each customer feels special with their unique voucher
2. **Better Tracking**: Individual voucher codes allow for precise tracking
3. **Reduced Fraud**: Unique codes prevent voucher sharing between customers
4. **Improved Analytics**: Track which specific vouchers are used
5. **Professional Appearance**: Personalized messages look more professional

## Testing

A test script is provided (`test_unique_vouchers.cjs`) to verify the functionality:
```bash
node test_unique_vouchers.cjs
```

This will test the campaign execution with unique vouchers and display the results.

## Migration Notes

- Existing campaigns will continue to work as before
- New campaigns can use the unique voucher functionality
- The voucher code field in campaign creation is now for reference only
- All actual voucher codes are generated dynamically during execution
