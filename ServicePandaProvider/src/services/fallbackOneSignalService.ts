// Fallback OneSignal Service - Works without native module
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationPayload {
  id: string;
  title: string;
  message: string;
  type: 'lead' | 'payment' | 'system' | 'general';
  data?: any;
}

class FallbackOneSignalService {
  private isInitialized = false;
  private appId = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
  private notificationCallbacks: Array<(notification: NotificationPayload) => void> = [];

  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('🔄 FALLBACK OneSignal service initializing...');
      console.log('📱 App ID:', this.appId);
      console.log('⚠️ Using fallback service - native module not available');
      
      // Step 1: Request notification permissions
      await this.requestNotificationPermissions();
      
      // Step 2: Register device manually (HTTP only)
      await this.registerDeviceManually();
      
      this.isInitialized = true;
      console.log('✅ FALLBACK OneSignal service initialized!');
      
    } catch (error) {
      console.error('❌ Fallback OneSignal initialization failed:', error);
      throw error;
    }
  }

  private async requestNotificationPermissions() {
    console.log('🔔 Requesting notification permissions...');
    const { Platform, PermissionsAndroid } = require('react-native');
    
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'ServicePanda Notifications',
          message: 'Allow ServicePanda to send you important notifications about your service requests.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        throw new Error('Notification permission denied by user');
      }
      console.log('✅ Notification permission granted!');
    }
  }

  private async registerDeviceManually() {
    console.log('📱 Registering device manually (HTTP only)...');
    
    try {
      // Get provider ID
      const providerId = await AsyncStorage.getItem('providerId') || '1';
      const externalUserId = `provider-${providerId}`;
      
      console.log('🆔 Using external user ID:', externalUserId);

      // Get real push token
      let pushToken = null;
      try {
        const PushNotification = require('react-native-push-notification').default;
        pushToken = await new Promise((resolve) => {
          PushNotification.configure({
            onRegister: function (token) {
              resolve(token.token);
            },
            onRegistrationError: function (err) {
              console.error('Push token error:', err);
              resolve(null);
            },
            requestPermissions: false,
          });
        });
      } catch (pushError) {
        console.log('⚠️ Could not get push token, using fallback');
        pushToken = this.generateFallbackToken();
      }

      if (!pushToken) {
        pushToken = this.generateFallbackToken();
      }

      console.log('📱 Using push token:', pushToken?.substring(0, 20) + '...');

      // Manual registration payload with PROPER external user ID
      const registrationPayload = {
        app_id: this.appId,
        device_type: 1, // Android
        identifier: pushToken,
        device_model: 'ServicePandaProvider-Fallback',
        device_os: '13.0',
        timezone_id: 'Asia/Karachi',
        language: 'en',
        sdk: '050213',
        notification_types: 1, // Subscribed
        external_user_id: externalUserId, // CRITICAL: This sets the external user ID
        tags: {
          provider_id: providerId,
          app_version: '1.1.0',
          registration_method: 'fallback'
        }
      };
      
      console.log('🆔 CRITICAL: Setting external_user_id to:', externalUserId);
      console.log('📱 This allows targeting with provider-1, provider-2, etc.');

      console.log('📡 Sending manual registration to OneSignal...');
      
      const response = await fetch('https://onesignal.com/api/v1/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationPayload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Manual registration successful!');
        console.log('👤 Player ID:', result.id);
        
        await AsyncStorage.setItem('oneSignalPlayerId', result.id);
        return result.id;
      } else {
        const error = await response.text();
        console.error('❌ Manual registration failed:', error);
        throw new Error('Manual registration failed');
      }
      
    } catch (error) {
      console.error('❌ Manual registration error:', error);
      throw error;
    }
  }

  private generateFallbackToken(): string {
    const { Platform } = require('react-native');
    const timestamp = Date.now();
    return `sp-fallback-${Platform.OS}-${timestamp}`;
  }

  // Public methods
  async sendTestNotification(providerId: string) {
    console.log('🧪 Sending test notification to provider:', providerId);
    
    try {
      const payload = {
        app_id: this.appId,
        include_external_user_ids: [`provider-${providerId}`],
        headings: { en: '🧪 Fallback Test' },
        contents: { 
          en: `Fallback test notification sent at ${new Date().toLocaleTimeString()}\n\nUsing HTTP-only registration (no native module)`
        },
        data: {
          type: 'test',
          providerId: providerId,
          fallback: true
        }
      };

      const response = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic os_v2_app_up2qodm4izcm3cykewo7cvnosrtodbs2i5ce3r5zeusbxh5utqy7iys7bhaffdnt65vsy4ql6p5beykzl62ahn2jdgifjshulo2hkky'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Fallback test notification sent successfully!');
        console.log('📊 Recipients:', result.recipients);
        return { success: true, recipients: result.recipients };
      } else {
        console.error('❌ Fallback test notification failed:', result);
        return { success: false, error: result };
      }
      
    } catch (error) {
      console.error('❌ Fallback test notification error:', error);
      return { success: false, error: error.message };
    }
  }

  onNotificationReceived(callback: (notification: NotificationPayload) => void) {
    this.notificationCallbacks.push(callback);
    console.log('📝 Notification callback registered (fallback mode)');
    
    return () => {
      const index = this.notificationCallbacks.indexOf(callback);
      if (index > -1) {
        this.notificationCallbacks.splice(index, 1);
      }
    };
  }

  async getRegistrationStatus() {
    try {
      const playerId = await AsyncStorage.getItem('oneSignalPlayerId');
      const providerId = await AsyncStorage.getItem('providerId');
      
      return {
        isRegistered: !!playerId,
        playerId: playerId,
        providerId: providerId,
        externalUserId: providerId ? `provider-${providerId}` : null,
        fallbackMode: true
      };
    } catch (error) {
      return {
        isRegistered: false,
        error: error.message,
        fallbackMode: true
      };
    }
  }
}

export const fallbackOneSignalService = new FallbackOneSignalService();
export default fallbackOneSignalService;
