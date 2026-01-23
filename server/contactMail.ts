import { sendEmail } from './emailService';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

/**
 * Send contact form submission email to support team
 * @param formData Contact form data
 * @returns Promise<boolean> indicating success
 */
export async function sendContactFormEmail(formData: ContactFormData): Promise<boolean> {
  try {
    console.log('sendContactFormEmail called with:', formData);
    const { name, email, phone, message } = formData;
    const supportEmail = 'hrms.devdoc@gmail.com';
    const subject = `New Contact Form Submission from ${name}`;
    
    const textContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
${message}

---
This message was sent from the ServicePanda contact form.
    `.trim();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>New Contact Form Submission</title>
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
            padding: 30px;
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
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
          }
          .field {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f9fafb;
            border-left: 4px solid #3b82f6;
            border-radius: 4px;
          }
          .field-label {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 5px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .field-value {
            color: #4b5563;
            font-size: 16px;
          }
          .message-box {
            background-color: #f0f9ff;
            border: 1px solid #bae6fd;
            padding: 20px;
            border-radius: 6px;
            margin-top: 10px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #6b7280;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🐼 ServicePanda</div>
            <p style="margin: 0; color: #6b7280;">New Contact Form Submission</p>
          </div>

          <div class="field">
            <div class="field-label">Name</div>
            <div class="field-value">${name}</div>
          </div>

          <div class="field">
            <div class="field-label">Email</div>
            <div class="field-value">
              <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
            </div>
          </div>

          <div class="field">
            <div class="field-label">Phone</div>
            <div class="field-value">
              <a href="tel:${phone}" style="color: #3b82f6; text-decoration: none;">${phone}</a>
            </div>
          </div>

          <div class="field">
            <div class="field-label">Message</div>
            <div class="message-box">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>

          <div class="footer">
            <p>This message was sent from the ServicePanda contact form.</p>
            <p>Please respond to the customer at: <a href="mailto:${email}">${email}</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await sendEmail({
      to: supportEmail,
      subject: subject,
      text: textContent,
      html: htmlContent
    });
  } catch (error) {
    console.error('Error sending contact form email:', error);
    return false;
  }
}

/**
 * Send confirmation email to user after contact form submission
 * @param formData Contact form data
 * @returns Promise<boolean> indicating success
 */
export async function sendContactConfirmationEmail(formData: ContactFormData): Promise<boolean> {
  try {
    const { name, email, message } = formData;
    
    const confirmationText = `
Thank you for contacting ServicePanda!

Hi ${name},

We've received your message and our support team will get back to you within 24 hours.

Your message:
${message}

If you have any urgent inquiries, please call us at 07 5606 0808.

Best regards,
ServicePanda Support Team
    `.trim();

    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Thank You for Contacting Us</title>
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
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
          }
          .success-badge {
            background-color: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            display: inline-block;
            margin-bottom: 20px;
          }
          .message-box {
            background-color: #f0f9ff;
            border-left: 4px solid #0ea5e9;
            padding: 20px;
            border-radius: 4px;
            margin: 20px 0;
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
            <div class="success-badge">Message Received ✓</div>
          </div>

          <h2 style="color: #1f2937;">Thank you for contacting us, ${name}!</h2>
          
          <p>We've received your message and our support team will get back to you within 24 hours.</p>
          
          <div class="message-box">
            <strong>Your message:</strong>
            <p style="margin-top: 10px;">${message.replace(/\n/g, '<br>')}</p>
          </div>

          <p>If you have any urgent inquiries, please call us at <strong>07 5606 0808</strong>.</p>
          
          <div class="footer">
            <p>Best regards,<br><strong>ServicePanda Support Team</strong></p>
            <p style="margin-top: 20px;">
              Email: <a href="mailto:support@servicepanda.com.au">support@servicepanda.com.au</a><br>
              Phone: 07 5606 0808<br>
              Working Hours: Monday-Friday 9:00 AM - 6:00 PM
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await sendEmail({
      to: email,
      subject: 'Thank you for contacting ServicePanda',
      text: confirmationText,
      html: confirmationHtml
    });
  } catch (error) {
    console.error('Error sending contact confirmation email:', error);
    return false;
  }
}

/**
 * Process contact form submission - sends email to support and confirmation to user
 * @param formData Contact form data
 * @returns Promise<{ success: boolean; message: string; note?: string }>
 */
export async function processContactForm(formData: ContactFormData): Promise<{ success: boolean; message: string; note?: string }> {
  try {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      return {
        success: false,
        message: 'All fields are required'
      };
    }

    // Validate name length (max 50 characters)
    if (formData.name.trim().length > 50) {
      return {
        success: false,
        message: 'Name must be 50 characters or less'
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        success: false,
        message: 'Invalid email format'
      };
    }

    // Validate phone length (max 12 characters)
    const phoneDigits = formData.phone.replace(/\D/g, ''); // Remove non-digits for validation
    if (phoneDigits.length > 12) {
      return {
        success: false,
        message: 'Phone number must be 12 digits or less'
      };
    }

    // Validate message length (max 300 characters)
    if (formData.message.trim().length > 300) {
      return {
        success: false,
        message: 'Message must be 300 characters or less'
      };
    }

    // Try to send email to support team
    console.log('Attempting to send email to support team...');
    const emailSent = await sendContactFormEmail(formData);
    console.log('Email sent result:', emailSent);

    if (emailSent) {
      // Send confirmation email to user
      console.log('Sending confirmation email to user...');
      await sendContactConfirmationEmail(formData);
      console.log('Confirmation email sent');

      return {
        success: true,
        message: 'Your message has been sent successfully. We\'ll get back to you soon!'
      };
    } else {
      // If Mailgun is not configured, log it
      console.warn('Mailgun not configured - contact form submission received but email not sent');
      console.log('Contact form submission:', formData);
      
      return {
        success: true,
        message: 'Your message has been received. We\'ll get back to you soon!',
        note: 'Email service not configured - message logged for manual review'
      };
    }
  } catch (error: any) {
    console.error('Error processing contact form:', error);
    console.error('Error stack:', error.stack);
    return {
      success: false,
      message: error.message || 'Failed to send message. Please try again later.'
    };
  }
}
