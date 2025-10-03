// OneSignal API service for sending push notifications from server
// Import fetch polyfill to ensure compatibility
import './fetchPolyfill';

interface OneSignalNotification {
  title: string;
  message: string;
  data?: any;
}

interface OneSignalResult {
  success: boolean;
  error?: string;
  id?: string;
  recipients?: number;
  errors?: any[];
}

class OneSignalAdminService {
  private appId = "a3f5070d-9c46-44cd-8b0a-259df155ae94"; // Your OneSignal App ID
  private restApiKey = process.env.ONESIGNAL_REST_API_KEY || "os_v2_app_up2qodm4izcm3cykewo7cvnossbylenoajculv4dkp4bz42fwbct55k5alljhd2qrvf2vnr7pvfen5aajjokeet7ibwxv4ug2wnzsni";
  private apiUrl = "https://onesignal.com/api/v1/notifications";

  // DEPRECATED: Old static device mapping - now using dynamic external user IDs
  // This method is kept for backward compatibility but not used
  private getDeviceIdForProvider(providerId: number): string | null {
    console.log(`⚠️ Using dynamic external user ID instead of static device mapping for provider ${providerId}`);
    return null; // Always use external user ID targeting
  }

  // Get external user IDs for dynamic targeting
  private getExternalUserIds(providerId: number): string[] {
    // DYNAMIC: Always use consistent format - no static mapping needed
    const externalIds = [`provider-${providerId}`];
    
    console.log(`👤 External user IDs for provider ${providerId}:`, externalIds);
    console.log(`✅ Using dynamic external ID: provider-${providerId}`);
    return externalIds;
  }

  // Send push notification to provider using OneSignal
  async sendToProvider(providerId: number, notification: OneSignalNotification): Promise<OneSignalResult> {
    try {
      console.log(`📤 Sending OneSignal push notification to provider ${providerId}`);

      // DYNAMIC: Use external user IDs for reliable targeting
      const externalUserIds = this.getExternalUserIds(providerId);
      console.log(`👤 Using dynamic external user IDs for provider ${providerId}:`, externalUserIds);

      // Create payload with TARGETED delivery (works with external ID)
      const payload = {
        app_id: this.appId,
        
        // TARGETED STRATEGY: Use external user ID for reliable delivery
        include_external_user_ids: [`provider-${providerId}`],
        
        headings: { en: notification.title },
        contents: { en: notification.message },
        data: notification.data || {},
        
        // Android specific settings
        priority: 10,
        android_sound: "default",
        android_vibration_pattern: [1000, 1000],
        
        // Make sure it works when app is closed
        content_available: true,
        
        // Additional settings to ensure delivery
        send_after: new Date().toISOString(),
        ttl: 3600, // 1 hour TTL
        
        // Remove apns_push_type_override - let OneSignal handle it automatically
      };



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
      
      // Enhanced result logging
      if (result.recipients) {
        console.log(`📊 Notification delivered to ${result.recipients} recipients`);
      }
      if (result.errors && result.errors.length > 0) {
        console.log(`⚠️ Some errors occurred:`, result.errors);
      }
      
      return { 
        success: true, 
        id: result.id,
        recipients: result.recipients || 0,
        errors: result.errors || []
      };

    } catch (error) {
      console.error('❌ OneSignal push notification failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { success: false, error: errorMessage };
    }
  }

  // Send to multiple providers
  async sendToMultipleProviders(
    providerIds: number[], 
    notification: OneSignalNotification
  ): Promise<OneSignalResult[]> {
    const results = await Promise.all(
      providerIds.map(providerId => this.sendToProvider(providerId, notification))
    );
    
    console.log(`📊 Sent notifications to ${providerIds.length} providers:`, 
      results.filter(r => r.success).length + ' successful'
    );
    
    return results;
  }
}

const oneSignalAdminService = new OneSignalAdminService();
export default oneSignalAdminService;
