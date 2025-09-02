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
  private logs: Array<{
    id: number;
    recipientType: 'customer' | 'provider' | 'potential_customer' | 'potential_provider';
    recipientId?: number;
    recipientPhone: string;
    recipientName?: string;
    message: string;
    direction: 'inbound' | 'outbound';
    status: 'sent' | 'delivered' | 'failed' | 'read';
    smsType?: '1st_sent' | '2nd_sent' | 'custom' | 'notification';
    sentBy?: string;
    sentAt: string;
    deliveredAt?: string;
    readAt?: string;
    apiResponse?: any;
  }> = [];

  constructor() {
    // Use provided credentials directly if env not set
    const providedApiKey = '3prDbqty5SVg6sVEeVPXzupjyUVnZUTFG75CrmPXK4rB76hP4LuE4HvVKMqutFt44bEffSPV6jAuntpGh3kgSKn3Mu9Rd2ZHL7Vc';
    const providedApiUrl = 'https://dialpad.com/api/v2/sms';

    this.apiKey = process.env.SMS_API_KEY || providedApiKey;
    this.apiUrl = process.env.SMS_API_URL || providedApiUrl;
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
    console.log('[SMS] Preparing request to Dialpad. To:', data.sendTo, 'From:', this.fromNumber);

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
      console.log('[SMS] Dialpad response status:', response.status);
      console.log('[SMS] Dialpad response data:', response.data);
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
        error: error?.message,
        status: error?.response?.status,
        response: error?.response?.data,
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
   * Build template text for potential customer outreach
   */
  buildPotentialCustomerTemplateMessage(
    customerName: string,
    smsType: '1st_sent' | '2nd_sent'
  ): string {
    if (smsType === '1st_sent') {
      return `Hi ${customerName}! 👋 \n\nServicePanda here! We noticed you might be looking for reliable service providers in your area.\n\nWe have pre-screened, verified professionals ready to help with your needs. Would you like to learn more about our services?\n\nReply YES to get started, or visit our website for more info.\n\nBest regards,\nServicePanda Team`;
    }
    return `Hi ${customerName}! \n\nJust following up on our previous message about ServicePanda's verified service providers.\n\nWe're here to connect you with trusted professionals in your area. No obligation, just quality service connections.\n\nReply YES to learn more, or call us directly.\n\nServicePanda Team`;
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

  /**
   * In-memory log helpers so messages appear immediately in Admin UI
   */
  recordOutbound(params: {
    recipientType: 'customer' | 'provider' | 'potential_customer' | 'potential_provider';
    recipientId?: number;
    recipientPhone: string;
    recipientName?: string;
    message: string;
    smsType?: '1st_sent' | '2nd_sent' | 'custom' | 'notification';
    sentBy?: string;
    status?: 'sent' | 'delivered' | 'failed' | 'read';
    apiResponse?: any;
  }) {
    const entry = {
      id: Date.now(),
      recipientType: params.recipientType,
      recipientId: params.recipientId,
      recipientPhone: params.recipientPhone,
      recipientName: params.recipientName,
      message: params.message,
      direction: 'outbound' as const,
      status: params.status || 'sent',
      smsType: params.smsType,
      sentBy: params.sentBy,
      sentAt: new Date().toISOString(),
      apiResponse: params.apiResponse,
    };
    this.logs.push(entry);
  }

  getLogs() {
    // return newest first
    return [...this.logs].sort((a, b) => (a.sentAt < b.sentAt ? 1 : -1));
  }
}

// Export singleton instance
export const smsService = new SmsService();

