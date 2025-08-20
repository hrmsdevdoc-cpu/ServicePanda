import { storage } from './storage';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
  cc?: string;
  bcc?: string;
}

/**
 * Send email using Mailgun API
 * @param options Email options including to, subject, text, and html content
 * @returns Promise<boolean> indicating success
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    console.log('sendEmail called with options:', options);
    
    // Get Mailgun credentials from database
    const mailgunKeys = await storage.getDecryptedMailgunKeys();
    
    if (!mailgunKeys) {
      console.error('Mailgun not configured - missing API keys');
      return false;
    }

    const { apiKey, domain, domainSendingKey } = mailgunKeys;
    console.log('Mailgun keys retrieved - domain:', domain, 'apiKey present:', !!apiKey);
    
    // Prepare form data for Mailgun API using URLSearchParams (Node.js compatible)
    const formData = new URLSearchParams();
    formData.append('from', `ServicePanda <noreply@${domain}>`);
    formData.append('to', options.to);
    if (options.cc) {
      formData.append('cc', options.cc);
    }
    if (options.bcc) {
      formData.append('bcc', options.bcc);
    }
    formData.append('subject', options.subject);
    formData.append('text', options.text);
    formData.append('html', options.html);

    console.log('Form data prepared:', formData.toString());
    console.log('Making request to Mailgun API...');

    // Send email via Mailgun API
    const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    console.log('Mailgun API response status:', response.status);
    console.log('Mailgun API response headers:', Object.fromEntries(response.headers.entries()));

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
 * Send welcome email to new service provider after Step 1 completion
 * @param email Provider's email address
 * @param firstName Provider's first name
 * @returns Promise<boolean> indicating success
 */
export async function sendProviderWelcomeEmail(email: string, firstName: string): Promise<boolean> {
  const baseUrl = process.env.REPLIT_DOMAINS
    ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
    : process.env.FRONTEND_URL || 'http://localhost:3000';
  const loginUrl = `${baseUrl}/provider-login`;

  const textContent = `Welcome to ServicePanda!\n\nHi ${firstName},\n\nYour provider account has been created. Visit ${loginUrl} to complete your application.\n\nServicePanda Team`;
  const htmlContent = `<p>Welcome to ServicePanda!</p><p>Hi ${firstName},</p><p>Your provider account has been created. <a href="${loginUrl}">Complete your application</a>.</p><p>ServicePanda Team</p>`;

  return await sendEmail({
    to: email,
    subject: 'Welcome to ServicePanda',
    text: textContent,
    html: htmlContent
  });
}

/**
 * Send application completion confirmation email to provider
 * @param email Provider's email address
 * @param firstName Provider's first name
 * @returns Promise<boolean> indicating success
 */
export async function sendProviderApplicationSubmittedEmail(email: string, firstName: string): Promise<boolean> {
  const textContent = `
    Application Submitted Successfully!

    Hi ${firstName},

    Thank you for completing and submitting your ServicePanda application!

    What happens next:
    - Our team will review your application within the next 24 hours
    - We'll verify your documents and service area details
    - Once approved, you'll receive a confirmation email
    - You'll then be able to access your first 3 leads for FREE!

    We appreciate your patience during the review process. We'll be in touch soon with an update on your application status.

    Thank you for choosing ServicePanda!
    ServicePanda Team
  `;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Application Submitted - ServicePanda</title>
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
        .status-badge {
          background-color: #3b82f6;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          display: inline-block;
          margin-bottom: 20px;
        }
        .review-process {
          background-color: #f0f9ff;
          border-left: 4px solid #0ea5e9;
          padding: 20px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .timeline {
          margin: 20px 0;
        }
        .timeline-item {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          padding: 10px;
          background-color: #f8fafc;
          border-radius: 6px;
        }
        .timeline-icon {
          width: 24px;
          height: 24px;
          background-color: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          font-size: 12px;
          color: white;
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
          <div class="status-badge">Application Submitted</div>
        </div>

        <h2 style="color: #1f2937; margin-bottom: 10px;">Hi ${firstName}!</h2>
        
        <p>Thank you for completing and submitting your ServicePanda application!</p>
        
        <div class="review-process">
          <h3 style="margin-top: 0; color: #1f2937;">⏱️ Review Process (24 Hours)</h3>
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-icon">✓</div>
              <div>
                <strong>Application Received</strong><br>
                <small>Your application is now in our review queue</small>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-icon">🔍</div>
              <div>
                <strong>Document Verification</strong><br>
                <small>We'll verify your license, insurance, and police check</small>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-icon">📍</div>
              <div>
                <strong>Service Area Review</strong><br>
                <small>Confirming your coverage areas and service categories</small>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-icon">🎉</div>
              <div>
                <strong>Approval Notification</strong><br>
                <small>You'll receive confirmation and can start earning immediately!</small>
              </div>
            </div>
          </div>
        </div>
        
        <p style="background-color: #dcfce7; border-left: 4px solid #22c55e; padding: 15px; border-radius: 4px;">
          <strong>🎁 Get Ready:</strong> Once approved, you'll receive your first 3 leads absolutely FREE to help you get started!
        </p>
        
        <p>We appreciate your patience during the review process. We'll be in touch soon with an update on your application status.</p>
        
        <div class="footer">
          <p>Thank you for choosing ServicePanda!<br><strong>ServicePanda Team</strong></p>
          <p style="margin-top: 20px;">
            Questions about your application? Contact our support team.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: '✅ Application Submitted - Under Review (24hrs) - ServicePanda',
    text: textContent.trim(),
    html: htmlContent
  });
}

/**
 * Send approval congratulations email to provider
 * @param email Provider's email address
 * @param firstName Provider's first name
 * @returns Promise<boolean> indicating success
 */
export async function sendProviderApprovalEmail(email: string, firstName: string): Promise<boolean> {
  const baseUrl = process.env.REPLIT_DOMAINS 
    ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
    : process.env.FRONTEND_URL || 'http://localhost:3000';
  const dashboardUrl = `${baseUrl}/provider-dashboard`;
  
  const textContent = `
    Congratulations! You're All Set!

    Hi ${firstName},

    GREAT NEWS! Your ServicePanda application has been approved!

    You're now an official ServicePanda partner and ready to start earning. Here's what you can do right now:

    ✅ Access Your Dashboard: ${dashboardUrl}
    ✅ Your First 3 Leads are FREE
    ✅ Start Receiving Customer Requests
    ✅ Manage Your Services and Areas
    ✅ Track Your Earnings

    Next Steps:
    1. Log into your provider dashboard
    2. Review your profile and make any updates
    3. Start browsing available leads in your area
    4. Purchase leads that match your services
    5. Contact customers and grow your business!

    Remember: Your first 3 leads are completely FREE to help you get started.

    Welcome to the ServicePanda family! We're excited to help you grow your business.

    ServicePanda Team
  `;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Approved! Welcome to ServicePanda</title>
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
        .approval-badge {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 12px 20px;
          border-radius: 25px;
          font-size: 16px;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        .benefits {
          background-color: #f0fdf4;
          border-left: 4px solid #22c55e;
          padding: 25px;
          margin: 25px 0;
          border-radius: 4px;
        }
        .benefit-item {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          font-weight: 500;
        }
        .benefit-item:before {
          content: "✅";
          margin-right: 10px;
          font-size: 14px;
        }
        .next-steps {
          background-color: #eff6ff;
          border: 1px solid #dbeafe;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .step {
          margin-bottom: 8px;
          padding-left: 20px;
          position: relative;
        }
        .step:before {
          content: counter(step-counter);
          counter-increment: step-counter;
          position: absolute;
          left: 0;
          top: 2px;
          background-color: #3b82f6;
          color: white;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          font-size: 11px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .next-steps {
          counter-reset: step-counter;
        }
        .dashboard-button {
          display: inline-block;
          padding: 15px 30px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
          text-align: center;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .free-leads {
          background-color: #fef3c7;
          border: 2px solid #f59e0b;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin: 25px 0;
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
          <div class="approval-badge">🎉 APPROVED! You're All Set!</div>
        </div>

        <h2 style="color: #1f2937; margin-bottom: 10px;">Congratulations ${firstName}!</h2>
        
        <p><strong>GREAT NEWS!</strong> Your ServicePanda application has been approved!</p>
        
        <p>You're now an official ServicePanda partner and ready to start earning.</p>
        
        <div class="benefits">
          <h3 style="margin-top: 0; color: #1f2937;">What You Can Do Right Now:</h3>
          <div class="benefit-item">Access Your Professional Dashboard</div>
          <div class="benefit-item">Your First 3 Leads are FREE</div>
          <div class="benefit-item">Start Receiving Customer Requests</div>
          <div class="benefit-item">Manage Your Services and Coverage Areas</div>
          <div class="benefit-item">Track Your Earnings and Performance</div>
        </div>

        <div style="text-align: center;">
          <a href="${dashboardUrl}" class="dashboard-button">Access Your Dashboard Now</a>
        </div>
        
        <div class="next-steps">
          <h3 style="margin-top: 0; color: #1f2937;">Your Next Steps:</h3>
          <div class="step">Log into your provider dashboard</div>
          <div class="step">Review your profile and make any updates needed</div>
          <div class="step">Start browsing available leads in your area</div>
          <div class="step">Purchase leads that match your services</div>
          <div class="step">Contact customers and grow your business!</div>
        </div>
        
        <div class="free-leads">
          <h3 style="margin-top: 0; color: #92400e;">🎁 Special Welcome Offer</h3>
          <p style="margin-bottom: 0; font-weight: 500;">Your first 3 leads are completely FREE to help you get started!</p>
        </div>
        
        <p>Welcome to the ServicePanda family! We're excited to help you grow your business and connect with customers across Australia.</p>
        
        <div class="footer">
          <p>Ready to start earning?<br><strong>ServicePanda Team</strong></p>
          <p style="margin-top: 20px;">
            Need help getting started? Contact our support team anytime.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: '🎉 Congratulations! Your ServicePanda Application is Approved',
    text: textContent.trim(),
    html: htmlContent
  });
}

/**
 * Send password reset email with secure token
 * @param email User's email address
 * @param resetToken Secure reset token
 * @returns Promise<boolean> indicating success
 */
export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
  // Use the first Replit domain if available, otherwise fallback to localhost for development
  const baseUrl = process.env.REPLIT_DOMAINS 
    ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
    : process.env.FRONTEND_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
  
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

/**
 * Send customer feedback request email after job completion
 * @param customerEmail Customer's email address
 * @param customerName Customer's name
 * @param providerName Service provider's name
 * @param serviceType Type of service completed
 * @param suburb Location where service was performed
 * @returns Promise<boolean> indicating success
 */
export async function sendCustomerFeedbackEmail(
  customerEmail: string, 
  customerName: string, 
  providerName: string, 
  serviceType: string, 
  suburb: string,
  reviewToken: string
): Promise<boolean> {
  const baseUrl = process.env.REPLIT_DOMAINS
    ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
    : process.env.FRONTEND_URL || 'http://localhost:3000';
  const reviewUrl = `${baseUrl}/review-submission?token=${reviewToken}`;

  const textContent = `How was your service?\n\nHi ${customerName},\n\nPlease share feedback for ${providerName} (${serviceType}) in ${suburb}.\n${reviewUrl}\n\nThank you,\nServicePanda Team`;
  const htmlContent = `<p><strong>How was your service?</strong></p><p>Hi ${customerName},</p><p>Please share feedback for <strong>${providerName}</strong> (${serviceType}) in ${suburb}.</p><p><a href="${reviewUrl}">Share your experience</a></p><p>Thank you,<br/>ServicePanda Team</p>`;

  return await sendEmail({
    to: customerEmail,
    subject: `How was your ${serviceType} service? - ServicePanda`,
    text: textContent,
    html: htmlContent
  });
}