# SMS Implementation for ServicePanda Admin Panel

This document explains how to set up and use the SMS functionality for sending messages to potential customers in the admin panel.

## 🚀 Features Implemented

- **Individual SMS**: Send SMS to a single potential customer
- **Bulk SMS**: Send SMS to multiple potential customers at once
- **Template Messages**: Pre-written professional SMS templates
- **Custom Messages**: Send personalized SMS content
- **SMS Tracking**: Track delivery status (not_sent, 1st_sent, 2nd_sent)
- **Rate Limiting**: Maximum of 2 SMS per customer
- **Admin Authentication**: Secure endpoints requiring admin login

## 📋 Prerequisites

1. **Dialpad SMS API Account**: You need a Dialpad account with SMS capabilities
2. **API Credentials**: Your Dialpad API key and endpoint URL
3. **Node.js Environment**: The backend server must be running

## ⚙️ Setup Instructions

### 1. Environment Variables

Create or update your `.env` file in the root directory with:

```bash
# SMS API Configuration
SMS_API_URL=https://dialpad.com/api/v2/sms
SMS_API_KEY=your_dialpad_api_key_here

# Other existing configurations...
DATABASE_URL=your_database_url
NODE_ENV=development
```

### 2. Install Dependencies

The SMS service requires `axios` for HTTP requests:

```bash
npm install axios
```

### 3. Verify Installation

Run the test script to verify your SMS service configuration:

```bash
node test_sms_service.cjs
```

## 🔌 API Endpoints

### 1. Send Individual SMS
**POST** `/api/admin/potential-customers/:id/send-sms`

Send SMS to a specific potential customer.

**Request Body:**
```json
{
  "customMessage": "Optional custom message (if not provided, template will be used)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "SMS 1st_sent sent successfully to John Doe",
  "smsType": "1st_sent",
  "customerId": 123
}
```

### 2. Send Bulk SMS
**POST** `/api/admin/potential-customers/send-sms`

Send SMS to multiple potential customers.

**Request Body:**
```json
{
  "customerIds": [123, 124, 125]
}
```

**Response:**
```json
{
  "count": 3
}
```

### 3. SMS Service Status
**GET** `/api/admin/sms/status`

Check SMS service configuration and status.

**Response:**
```json
{
  "configured": true,
  "provider": "Dialpad",
  "fromNumber": "+61452229882"
}
```

## 📱 SMS Templates

### First SMS Template
```
Hi [Customer Name]! 👋 

ServicePanda here! We noticed you might be looking for reliable service providers in your area.

We have pre-screened, verified professionals ready to help with your needs. Would you like to learn more about our services?

Reply YES to get started, or visit our website for more info.

Best regards,
ServicePanda Team
```

### Second SMS Template (Follow-up)
```
Hi [Customer Name]! 

Just following up on our previous message about ServicePanda's verified service providers.

We're here to connect you with trusted professionals in your area. No obligation, just quality service connections.

Reply YES to learn more, or call us directly.

ServicePanda Team
```

## 🎯 How to Use in Admin Panel

### 1. Individual SMS Button
- Navigate to **Potential Customers** page
- Click the **"Send SMS"** button next to any customer
- The system will automatically:
  - Determine if it's the 1st or 2nd SMS
  - Send the appropriate template message
  - Update the SMS delivery status
  - Show success/error feedback

### 2. Bulk SMS
- Select multiple customers using checkboxes
- Use the bulk SMS functionality to send to all selected customers
- Each customer will receive the appropriate SMS based on their current status

### 3. SMS Status Tracking
- **Not Sent**: Customer hasn't received any SMS yet
- **1st Sent**: First SMS has been sent
- **2nd Sent**: Second (follow-up) SMS has been sent
- **Maximum Reached**: No more SMS can be sent to this customer

## 🔒 Security Features

- **Admin Authentication**: All SMS endpoints require admin login
- **Rate Limiting**: Maximum 2 SMS per customer to prevent spam
- **Input Validation**: Phone number and message validation
- **Error Handling**: Comprehensive error handling and logging

## 🐛 Troubleshooting

### Common Issues

1. **"SMS API not configured"**
   - Check your `.env` file has the correct SMS_API_URL and SMS_API_KEY
   - Restart the server after updating environment variables

2. **"Failed to send SMS"**
   - Verify your Dialpad API key is valid
   - Check if you have sufficient SMS credits
   - Ensure the phone number format is correct (should include country code)

3. **"Maximum SMS limit reached"**
   - This is normal behavior - customers can only receive 2 SMS
   - Check the customer's SMS delivery status

### Debug Steps

1. **Check SMS Service Status:**
   ```bash
   GET /api/admin/sms/status
   ```

2. **Verify Environment Variables:**
   ```bash
   node test_sms_service.cjs
   ```

3. **Check Server Logs:**
   - Look for SMS-related log messages in your server console
   - Check for any error messages related to the SMS service

## 📊 SMS Delivery Status

The system automatically tracks SMS delivery status:

- **not_sent** → **1st_sent** (after first SMS)
- **1st_sent** → **2nd_sent** (after second SMS)
- **2nd_sent** → No more SMS allowed

## 🔄 Integration with Existing System

The SMS functionality integrates seamlessly with your existing:

- **Potential Customers Management**: Import, view, and manage customer data
- **Admin Authentication**: Secure access control
- **Database Schema**: SMS status tracking in the database
- **Admin Panel UI**: Native integration with the existing interface

## 📈 Future Enhancements

Potential improvements you could add:

1. **SMS Templates Management**: Admin-configurable message templates
2. **SMS Scheduling**: Send SMS at specific times
3. **Delivery Reports**: Track SMS delivery and read receipts
4. **A/B Testing**: Test different message variations
5. **Analytics Dashboard**: SMS performance metrics

## 🆘 Support

If you encounter issues:

1. Check the server logs for error messages
2. Verify your Dialpad API credentials
3. Test the SMS service status endpoint
4. Ensure your environment variables are properly set

---

**Note**: This implementation follows the same pattern as your Laravel code but adapted for Node.js/Express. The SMS service is designed to be easily extensible for future requirements.

