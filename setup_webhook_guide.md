# SMS Webhook Setup Guide

## 1. Expose Your Local Server

### Option A: Using ngrok (Recommended for testing)
```bash
# Install ngrok
npm install -g ngrok

# Expose your local server (port 3000)
ngrok http 3000
```

This will give you a URL like: `https://abc123.ngrok.io`

### Option B: Deploy to Production
Deploy your server to a cloud service (AWS, DigitalOcean, etc.) to get a permanent URL.

## 2. Set Webhook URL in Dialpad Dashboard

1. **Login to Dialpad Dashboard**
2. **Go to Settings → Integrations → Webhooks**
3. **Add New Webhook:**
   - **URL:** `https://your-domain.com/api/sms/webhook`
   - **Events:** Select "SMS Received" or "Incoming SMS"
   - **Method:** POST
   - **Status:** Active

## 3. Test the Webhook

### Test with curl:
```bash
curl -X POST https://your-domain.com/api/sms/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "from": "0485901942",
    "to": "+1234567890", 
    "body": "STOP",
    "messageId": "test-123"
  }'
```

### Expected Response:
```json
{
  "message": "SMS received successfully"
}
```

## 4. How It Works

1. **Customer replies** to your SMS
2. **Dialpad receives** the reply
3. **Dialpad sends webhook** to your server
4. **Your server stores** the message in database
5. **SMS chat shows** the reply automatically

## 5. Webhook Payload Format

Dialpad will send this JSON to your webhook:

```json
{
  "from": "0485901942",        // Customer's phone number
  "to": "+1234567890",         // Your Dialpad number
  "body": "STOP",              // Customer's reply message
  "messageId": "msg_123456",   // Unique message ID
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 6. Security Considerations

- Add webhook signature verification
- Use HTTPS only
- Validate incoming data
- Rate limiting
