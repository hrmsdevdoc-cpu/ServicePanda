import { storage } from './storage';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Send email using Mailgun API
 * @param options Email options including to, subject, text, and html content
 * @returns Promise<boolean> indicating success
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Get Mailgun credentials from database
    const mailgunKeys = await storage.getDecryptedMailgunKeys();
    
    if (!mailgunKeys) {
      console.error('Mailgun not configured - missing API keys');
      return false;
    }

    const { apiKey, domain } = mailgunKeys;
    
    // Prepare form data for Mailgun API
    const formData = new FormData();
    formData.append('from', `ServicePanda <noreply@${domain}>`);
    formData.append('to', options.to);
    formData.append('subject', options.subject);
    formData.append('text', options.text);
    formData.append('html', options.html);

    // Send email via Mailgun API
    const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mailgun API error:', response.status, errorText);
      return false;
    }

    const result = await response.json();
    console.log('Email sent successfully:', result.id);
    return true;

  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Send password reset email with secure token
 * @param email User's email address
 * @param resetToken Secure reset token
 * @returns Promise<boolean> indicating success
 */
export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  const textContent = `
    Password Reset Request

    You have requested a password reset for your ServicePanda account.

    Click the following link to reset your password:
    ${resetUrl}

    This link will expire in 1 hour for security reasons.

    If you didn't request this password reset, please ignore this email.

    Best regards,
    ServicePanda Team
  `;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Password Reset - ServicePanda</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f7f7f7;
        }
        .container {
          background-color: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e2e8f0;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .reset-button {
          display: inline-block;
          padding: 14px 28px;
          background-color: #3b82f6;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          margin: 20px 0;
          text-align: center;
        }
        .reset-button:hover {
          background-color: #2563eb;
        }
        .warning {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🐼 ServicePanda</div>
          <p style="margin: 0; color: #6b7280;">Australian Service Marketplace</p>
        </div>

        <h2 style="color: #1f2937; margin-bottom: 20px;">Password Reset Request</h2>
        
        <p>You have requested a password reset for your ServicePanda account.</p>
        
        <p>Click the button below to reset your password:</p>
        
        <div style="text-align: center;">
          <a href="${resetUrl}" class="reset-button">Reset My Password</a>
        </div>
        
        <div class="warning">
          <strong>⏰ Security Notice:</strong> This link will expire in 1 hour for security reasons.
        </div>
        
        <p>If you're having trouble clicking the button, copy and paste this URL into your web browser:</p>
        <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 14px;">
          ${resetUrl}
        </p>
        
        <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
        
        <div class="footer">
          <p>Best regards,<br>ServicePanda Team</p>
          <p style="margin-top: 20px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: 'Password Reset - ServicePanda',
    text: textContent.trim(),
    html: htmlContent
  });
}