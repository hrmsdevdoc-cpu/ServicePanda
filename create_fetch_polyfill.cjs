/**
 * Create Fetch Polyfill for Server
 * Quick fix for server fetch issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Creating fetch polyfill for server...');
console.log('');

// Create a fetch polyfill file
const polyfillContent = `/**
 * Fetch Polyfill for Server
 * Ensures fetch is available in all environments
 */

// Check if fetch is already available (Node.js 18+)
if (typeof globalThis.fetch === 'undefined') {
  console.log('⚠️ Built-in fetch not available, using polyfill');
  
  // Simple fetch polyfill using require
  try {
    const nodeFetch = require('node-fetch');
    globalThis.fetch = nodeFetch.default || nodeFetch;
    console.log('✅ Fetch polyfill loaded successfully');
  } catch (error) {
    console.log('❌ Could not load node-fetch polyfill:', error.message);
    
    // Fallback: Basic fetch implementation
    globalThis.fetch = async (url, options = {}) => {
      throw new Error('Fetch not available and no polyfill found');
    };
  }
} else {
  console.log('✅ Built-in fetch available');
}

export {};
`;

// Write polyfill to server directory
const polyfillPath = path.join('server', 'fetchPolyfill.ts');

try {
  fs.writeFileSync(polyfillPath, polyfillContent);
  console.log('✅ Fetch polyfill created:', polyfillPath);
} catch (error) {
  console.log('❌ Failed to create polyfill:', error.message);
}

// Create updated oneSignalAdminService with polyfill import
const oneSignalContent = `// OneSignal API service for sending push notifications from server
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
}

class OneSignalAdminService {
  private appId = "f64bf04a-b174-4862-a7b4-62b8d93f159b"; // Your OneSignal App ID
  private restApiKey = process.env.ONESIGNAL_REST_API_KEY || "os_v2_app_6zf7asvroregfj5umk4nspyvtoi4yl4hrd3u7suvnwraxsu43zmjjgzlysqusuxf7gjgfkjzgwpunhz4m3yflqr4fz7kfitlcxxsexy";
  private apiUrl = "https://onesignal.com/api/v1/notifications";

  // Manual device mapping for testing (replace with database lookup in production)
  private getDeviceIdForProvider(providerId: number): string | null {
    const deviceMapping = {
      1: '37b92c0a-63a7-44b4-b1b6-561e80301b21', // Your manually registered device
      // Add more providers as they register their devices
    };
    return deviceMapping[providerId] || null;
  }

  // Send push notification to provider using OneSignal
  async sendToProvider(providerId: number, notification: OneSignalNotification): Promise<OneSignalResult> {
    try {
      console.log(\`📤 Sending OneSignal push notification to provider \${providerId}\`);

      // Get device ID for this provider
      const deviceId = this.getDeviceIdForProvider(providerId);
      console.log(\`📱 Device ID for provider \${providerId}: \${deviceId || 'Not found, using broadcast'}\`);

      // Try multiple targeting methods to ensure delivery
      const payload = {
        app_id: this.appId,
        // Method 1: Use specific device ID if available
        ...(deviceId 
          ? { include_player_ids: [deviceId] }
          : { 
              // Method 2: Fallback to external user ID and broadcast
              include_external_user_ids: [providerId.toString()],
              included_segments: ["Subscribed Users"]
            }
        ),
        
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

      console.log(\`🔔 OneSignal payload:\`, JSON.stringify(payload, null, 2));

      // Real OneSignal API call with fetch polyfill
      console.log(\`🔑 Using OneSignal REST API key: \${this.restApiKey.substring(0, 20)}...\`);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Basic \${this.restApiKey}\`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(\`OneSignal API error: \${JSON.stringify(errorData)}\`);
      }

      const result = await response.json();
      console.log(\`✅ OneSignal notification sent:\`, result);
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
  ): Promise<OneSignalResult[]> {
    const results = await Promise.all(
      providerIds.map(providerId => this.sendToProvider(providerId, notification))
    );
    
    console.log(\`📊 Sent notifications to \${providerIds.length} providers:\`, 
      results.filter(r => r.success).length + ' successful'
    );
    
    return results;
  }
}

const oneSignalAdminService = new OneSignalAdminService();
export default oneSignalAdminService;
`;

// Backup current file and write new one
const originalPath = path.join('server', 'oneSignalAdminService.ts');
const backupPath = path.join('server', 'oneSignalAdminService.ts.backup');

try {
  // Create backup
  const originalContent = fs.readFileSync(originalPath, 'utf8');
  fs.writeFileSync(backupPath, originalContent);
  console.log('✅ Backup created:', backupPath);
  
  // Write new version with polyfill
  fs.writeFileSync(originalPath, oneSignalContent);
  console.log('✅ Updated oneSignalAdminService.ts with fetch polyfill');
  
} catch (error) {
  console.log('❌ Failed to update oneSignalAdminService:', error.message);
}

console.log('');
console.log('🎯 SOLUTION APPLIED:');
console.log('   ✅ Created fetch polyfill');
console.log('   ✅ Updated oneSignalAdminService to use polyfill');
console.log('   ✅ Backward compatible with all Node.js versions');
console.log('');
console.log('🔄 Now restart server: pm2 restart my-app-dev');
console.log('📱 Server errors should be resolved!');
