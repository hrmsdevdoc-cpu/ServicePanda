// OneSignal API service for sending push notifications from server
// Using built-in fetch (Node.js 18+) or polyfill

interface OneSignalNotification {
  title: string;
  message: string;
  data?: any;
}

interface OneSignalResult {
  success: boolean;
  error?: string;
  id?: string;
}

class OneSignalAdminService {
  private appId = "f64bf04a-b174-4862-a7b4-62b8d93f159b"; // Your OneSignal App ID
  private restApiKey = process.env.ONESIGNAL_REST_API_KEY || "os_v2_app_6zf7asvroregfj5umk4nspyvtoi4yl4hrd3u7suvnwraxsu43zmjjgzlysqusuxf7gjgfkjzgwpunhz4m3yflqr4fz7kfitlcxxsexy";
  private apiUrl = "https://onesignal.com/api/v1/notifications";

  // Send push notification to provider using OneSignal
  async sendToProvider(providerId: number, notification: OneSignalNotification): Promise<OneSignalResult> {
    try {
      console.log(`📤 Sending OneSignal push notification to provider ${providerId}`);

      // Try multiple targeting methods to ensure delivery
      const payload = {
        app_id: this.appId,
        // Method 1: Target by external user ID (provider ID)
        include_external_user_ids: [providerId.toString()],
        // Method 2: ALSO target all subscribed users as fallback
        included_segments: ["Subscribed Users"],
        
        headings: { en: notification.title },
        contents: { en: notification.message },
        data: notification.data || {},
        
        // Android specific settings
        priority: 10,
        android_sound: "default",
        android_vibration_pattern: [1000, 1000],
        
        // Make sure it works when app is closed
        content_available: true,
        apns_push_type_override: "background"
      };

      console.log(`🔔 OneSignal payload:`, JSON.stringify(payload, null, 2));

      // Real OneSignal API call with actual REST API key
      console.log(`🔑 Using OneSignal REST API key: ${this.restApiKey.substring(0, 20)}...`);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${this.restApiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OneSignal API error: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log(`✅ OneSignal notification sent:`, result);
      return { success: true, id: result.id };

    } catch (error) {
      console.error('❌ OneSignal push notification failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send to multiple providers
  async sendToMultipleProviders(
    providerIds: number[], 
    notification: OneSignalNotification
  ): Promise<{ successful: number; failed: number }> {
    let successful = 0;
    let failed = 0;

    console.log(`📤 Sending OneSignal push to ${providerIds.length} providers`);

    for (const providerId of providerIds) {
      const result = await this.sendToProvider(providerId, notification);
      if (result.success) {
        successful++;
      } else {
        failed++;
      }
    }

    console.log(`✅ OneSignal results: ${successful} successful, ${failed} failed`);
    return { successful, failed };
  }

  // Test notification method
  async sendTestNotification(providerId: number): Promise<OneSignalResult> {
    return await this.sendToProvider(providerId, {
      title: "Test Notification from Server",
      message: `This is a test push notification sent directly from the server at ${new Date().toLocaleTimeString()}`,
      data: {
        test: true,
        timestamp: new Date().toISOString()
      }
    });
  }
}

// Export singleton instance
export const oneSignalAdminService = new OneSignalAdminService();
export default oneSignalAdminService;
