import axios from 'axios';

interface SmsData {
  sendTo: string;
  chatMessage: string;
  adminId?: number;
  adminName?: string;
  customerId?: number;
  smsType?: '1st_sent' | '2nd_sent';
}

interface DialpadSmsResponse {
  id?: string;
  status?: string;
  error?: string;
}

export class SmsService {
  private apiKey: string;
  private apiUrl: string;
  private fromNumber: string;

  constructor() {
    this.apiKey = process.env.SMS_API_KEY || '';
    this.apiUrl = process.env.SMS_API_URL || '';
    this.fromNumber = '+61452229882'; // Default from number
    
    if (!this.apiKey || !this.apiUrl) {
      console.warn('SMS API credentials not configured. SMS functionality will be disabled.');
    }
  }

  /**
   * Send SMS using Dialpad API (equivalent to sendDailPadSMS in Laravel)
   */
  private async sendDialpadSms(data: SmsData): Promise<boolean> {
    if (!this.apiKey || !this.apiUrl) {
      console.error('SMS API not configured');
      return false;
    }

    try {
      const response = await axios.post(
        `${this.apiUrl}?apikey=${encodeURIComponent(this.apiKey)}`,
        {
          infer_country_code: false,
          text: data.chatMessage,
          to_numbers: [data.sendTo],
          from_number: this.fromNumber,
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      const responseData: DialpadSmsResponse = response.data;

      if (responseData.id && responseData.id.trim() !== '') {
        console.log('SMS sent successfully:', {
          id: responseData.id,
          to: data.sendTo,
          message: data.chatMessage.substring(0, 50) + '...',
        });

        // Here you could save SMS details to database if needed
        // await this.saveSmsDetails(data, responseData);

        return true;
      } else {
        console.error('Dialpad SMS API response error:', responseData);
        return false;
      }
    } catch (error: any) {
      console.error('Dialpad SMS API request failed:', {
        error: error.message,
        to: data.sendTo,
        message: data.chatMessage.substring(0, 50) + '...',
      });
      return false;
    }
  }

  /**
   * Public method to send SMS (equivalent to send_sms in Laravel)
   */
  async sendSms(mobile: string, message: string, options?: {
    adminId?: number;
    adminName?: string;
    customerId?: number;
    smsType?: '1st_sent' | '2nd_sent';
  }): Promise<boolean> {
    const smsData: SmsData = {
      sendTo: mobile,
      chatMessage: message,
      ...options,
    };

    return this.sendDialpadSms(smsData);
  }

  /**
   * Send SMS to potential customer with appropriate message template
   */
  async sendSmsToPotentialCustomer(
    customerPhone: string,
    customerName: string,
    smsType: '1st_sent' | '2nd_sent',
    options?: {
      adminId?: number;
      adminName?: string;
      customerId?: number;
    }
  ): Promise<boolean> {
    let message: string;

    if (smsType === '1st_sent') {
      message = `Hi ${customerName}! 👋 

ServicePanda here! We noticed you might be looking for reliable service providers in your area.

We have pre-screened, verified professionals ready to help with your needs. Would you like to learn more about our services?

Reply YES to get started, or visit our website for more info.

Best regards,
ServicePanda Team`;
    } else {
      message = `Hi ${customerName}! 

Just following up on our previous message about ServicePanda's verified service providers.

We're here to connect you with trusted professionals in your area. No obligation, just quality service connections.

Reply YES to learn more, or call us directly.

ServicePanda Team`;
    }

    return this.sendSms(customerPhone, message, {
      ...options,
      smsType,
    });
  }

  /**
   * Check if SMS service is properly configured
   */
  isConfigured(): boolean {
    return !!(this.apiKey && this.apiUrl);
  }

  /**
   * Get SMS service status
   */
  getStatus(): { configured: boolean; provider: string; fromNumber: string } {
    return {
      configured: this.isConfigured(),
      provider: 'Dialpad',
      fromNumber: this.fromNumber,
    };
  }
}

// Export singleton instance
export const smsService = new SmsService();
