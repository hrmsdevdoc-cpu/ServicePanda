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
  private restApiKey = process.env.ONESIGNAL_REST_API_KEY || "os_v2_app_6zf7asvroregfj5umk4nspyvtoi4yl4hrd3u7suvnwraxsu43zmjjgzlysqusuxf7gjgfkjzgwpunhz4m3yflqr4fz7kfitlcxxsexy";
  private apiUrl = "https://onesignal.com/api/v1/notifications";

  // Manual device mapping for testing (replace with database lookup in production)
  private getDeviceIdForProvider(providerId: number): string | null {
    const deviceMapping: Record<number, string> = {
      1: '3e08404b-8fd6-4b71-af49-f6f207b79243', // Latest OneSignal ID with provider-1
      2: '3bb2d266-4fbe-459a-8216-739b28db0a91', // Latest OneSignal ID 
      3: '0a21c9be-2a45-40bf-b9a3-b2b70d78da27', // Older OneSignal ID
      4: '0e88a6e5-4efc-4317-8902-bc9629d83d1b', // Older OneSignal ID
      // Add more providers as they register their devices
    };
    
    console.log(`📱 Looking for device ID for provider ${providerId}`);
    const deviceId = deviceMapping[providerId];
    if (deviceId) {
      console.log(`✅ Found device ID for provider ${providerId}: ${deviceId}`);
    } else {
      console.log(`❌ No device ID found for provider ${providerId}, using broadcast`);
    }
    return deviceId || null;
  }

  // Get external user IDs for dynamic targeting
  private getExternalUserIds(providerId: number): string[] {
    // Handle both old random IDs (from dashboard) and new consistent IDs
    const externalUserIdMapping: Record<number, string[]> = {
      1: [
        'provider-1',                    // New consistent ID (working!)
        `provider-${providerId}`,        // Alternative format
      ],
      2: [
        'provider-17591447767118-8arad', // Current ID from dashboard
        `provider-${providerId}`,        // Alternative format
        `provider-2`                     // Consistent format
      ],
      3: [
        'provider-1759142062541-y7p5z', // Old random ID from dashboard
        `provider-${providerId}`,        // Alternative format
      ],
      4: [
        'provider-1759141887918-7tqdv', // Old random ID from dashboard  
        `provider-${providerId}`,        // Alternative format
      ],
    };
    
    const externalIds = externalUserIdMapping[providerId] || [
      `provider-${providerId}`,
      `provider-${providerId}`
    ];
    
    console.log(`👤 External user IDs for provider ${providerId}:`, externalIds);
    return externalIds;
  }

  // Send push notification to provider using OneSignal
  async sendToProvider(providerId: number, notification: OneSignalNotification): Promise<OneSignalResult> {
    try {
      console.log(`📤 Sending OneSignal push notification to provider ${providerId}`);

      // Get device ID and external user IDs for this provider
      const deviceId = this.getDeviceIdForProvider(providerId);
      const externalUserIds = this.getExternalUserIds(providerId);
      console.log(`📱 Device ID for provider ${providerId}: ${deviceId || 'Not found'}`);
      console.log(`👤 External User IDs for provider ${providerId}:`, externalUserIds);

      // Create payload with multiple targeting strategies
      const payload = {
        app_id: this.appId,
        
        // STRATEGY 1: Target by specific OneSignal player ID (most reliable)
        ...(deviceId ? { include_player_ids: [deviceId] } : {}),
        
        // STRATEGY 2: Target by external user IDs (includes dynamic IDs from dashboard)
        ...(!deviceId ? { include_external_user_ids: externalUserIds } : {}),
        
        // STRATEGY 3: Fallback to all subscribed users if no specific targeting
        ...(!deviceId && (!externalUserIds || externalUserIds.length === 0) ? { included_segments: ["Subscribed Users"] } : {}),
        
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

      // Enhanced logging for debugging targeting strategy
      console.log(`🎯 Targeting Strategy for Provider ${providerId}:`);
      if (payload.include_player_ids) {
        console.log(`   ✅ Using PLAYER ID targeting: ${payload.include_player_ids.join(', ')}`);
      } else if (payload.include_external_user_ids) {
        console.log(`   ✅ Using EXTERNAL USER ID targeting: ${payload.include_external_user_ids.join(', ')}`);
      } else if (payload.included_segments) {
        console.log(`   ✅ Using SEGMENT targeting: ${payload.included_segments.join(', ')}`);
      }
      
      console.log(`🔔 OneSignal payload:`, JSON.stringify(payload, null, 2));

      // Real OneSignal API call with fetch polyfill
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
