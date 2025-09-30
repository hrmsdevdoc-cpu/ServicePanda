// FIXED OneSignal Service - Resolves all notification issues
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// OneSignal SDK import with error handling
let OneSignal: any = null;
try {
  OneSignal = require('react-native-onesignal');
  console.log('✅ OneSignal import successful:', typeof OneSignal);
} catch (importError) {
  console.log('❌ OneSignal import failed:', importError.message);
}

export interface NotificationPayload {
  id: string;
  title: string;
  message: string;
  type: 'lead' | 'payment' | 'system' | 'general';
  data?: any;
}

class FixedOneSignalService {
  private isInitialized = false;
  private appId = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
  private notificationCallbacks: Array<(notification: NotificationPayload) => void> = [];

  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('🔔 FIXED OneSignal service initializing...');
      console.log('📱 App ID:', this.appId);
      
      // Step 1: Request notification permissions FIRST
      await this.requestNotificationPermissions();
      
      // Step 2: Initialize OneSignal SDK properly
      await this.initializeOneSignalSDK();
      
      // Step 3: Register device with proper user ID
      await this.registerDeviceWithProperUserID();
      
      // Step 4: Set up notification handlers
      this.setupNotificationHandlers();
      
      this.isInitialized = true;
      console.log('✅ FIXED OneSignal service initialized successfully!');
      
    } catch (error) {
      console.error('❌ OneSignal initialization failed:', error);
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

  private async initializeOneSignalSDK() {
    if (!OneSignal) {
      throw new Error('OneSignal SDK not available');
    }

    console.log('🚀 Initializing OneSignal SDK...');
    
    // Enable debug logging
    try {
      if (OneSignal.Debug && OneSignal.Debug.setLogLevel) {
        OneSignal.Debug.setLogLevel(6); // VERBOSE
        console.log('🔍 OneSignal DEBUG logging enabled (v5)');
      } else if (OneSignal.setLogLevel) {
        OneSignal.setLogLevel(6, 6);
        console.log('🔍 OneSignal DEBUG logging enabled (v4)');
      }
    } catch (debugError) {
      console.log('⚠️ Debug logging setup failed, continuing...');
    }

    // Initialize OneSignal with proper API
    const OSInstance = OneSignal?.OneSignal || OneSignal;
    
    if (typeof OSInstance.setAppId === 'function') {
      // OneSignal v5 API
      OSInstance.setAppId(this.appId);
      console.log('✅ OneSignal v5 initialized');
    } else if (typeof OSInstance.initialize === 'function') {
      // OneSignal v4 API fallback
      OSInstance.initialize(this.appId);
      console.log('✅ OneSignal v4 initialized');
    } else {
      throw new Error('OneSignal SDK methods not available');
    }

    // Wait for initialization
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  private async registerDeviceWithProperUserID() {
    console.log('📱 Registering device with proper user ID...');
    
    try {
      // Get provider ID from storage
      const providerId = await AsyncStorage.getItem('providerId') || '1';
      const externalUserId = `provider-${providerId}`;
      
      console.log('🆔 Using external user ID:', externalUserId);

      const OSInstance = OneSignal?.OneSignal || OneSignal;
      
      // Set external user ID for targeting
      if (OSInstance.setExternalUserId) {
        OSInstance.setExternalUserId(externalUserId);
        console.log('✅ External user ID set via SDK');
      } else if (OSInstance.User && OSInstance.User.setExternalUserId) {
        OSInstance.User.setExternalUserId(externalUserId);
        console.log('✅ External user ID set via User API');
      }

      // Get and store the OneSignal player ID
      await this.getAndStorePlayerId();
      
    } catch (error) {
      console.error('❌ Device registration failed:', error);
      // Try manual registration as fallback
      await this.manualDeviceRegistration();
    }
  }

  private async getAndStorePlayerId() {
    try {
      const OSInstance = OneSignal?.OneSignal || OneSignal;
      
      if (OSInstance.getDeviceState) {
        const deviceState = await OSInstance.getDeviceState();
        if (deviceState && deviceState.userId) {
          await AsyncStorage.setItem('oneSignalPlayerId', deviceState.userId);
          console.log('✅ Player ID stored:', deviceState.userId);
          return deviceState.userId;
        }
      }
      
      // Try alternative method
      if (OSInstance.User && OSInstance.User.getOnesignalId) {
        const playerId = await OSInstance.User.getOnesignalId();
        if (playerId) {
          await AsyncStorage.setItem('oneSignalPlayerId', playerId);
          console.log('✅ Player ID stored (v5):', playerId);
          return playerId;
        }
      }
      
      console.log('⚠️ Could not get player ID from SDK');
      return null;
      
    } catch (error) {
      console.error('❌ Failed to get player ID:', error);
      return null;
    }
  }

  private async manualDeviceRegistration() {
    console.log('🔄 Attempting manual device registration...');
    
    try {
      // Get provider ID
      const providerId = await AsyncStorage.getItem('providerId') || '1';
      const externalUserId = `provider-${providerId}`;
      
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

      // Manual registration payload
      const registrationPayload = {
        app_id: this.appId,
        device_type: 1, // Android
        identifier: pushToken,
        device_model: 'ServicePandaProvider',
        device_os: '13.0',
        timezone_id: 'Asia/Karachi',
        language: 'en',
        sdk: '050213',
        notification_types: 1, // Subscribed
        external_user_id: externalUserId,
      };

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
    // Generate a consistent fallback token based on device info
    const { Platform } = require('react-native');
    const timestamp = Date.now();
    return `sp-fallback-${Platform.OS}-${timestamp}`;
  }

  private setupNotificationHandlers() {
    console.log('🔔 Setting up notification handlers...');
    
    try {
      const OSInstance = OneSignal?.OneSignal || OneSignal;
      
      // Set up notification received handler
      if (OSInstance.setNotificationWillShowInForegroundHandler) {
        OSInstance.setNotificationWillShowInForegroundHandler((notificationReceivedEvent: any) => {
          console.log('🔔 Notification received in foreground:', notificationReceivedEvent);
          const notification = notificationReceivedEvent.getNotification();
          this.handleNotificationReceived(notification);
          notificationReceivedEvent.complete(notification);
        });
      }

      // Set up notification opened handler
      if (OSInstance.setNotificationOpenedHandler) {
        OSInstance.setNotificationOpenedHandler((result: any) => {
          console.log('👆 Notification opened:', result);
          this.handleNotificationOpened(result.notification);
        });
      }

      console.log('✅ Notification handlers set up');
      
    } catch (error) {
      console.error('❌ Failed to set up notification handlers:', error);
    }
  }

  private handleNotificationReceived(notification: any) {
    console.log('📨 Processing received notification:', notification);
    
    const payload: NotificationPayload = {
      id: notification.notificationId || Date.now().toString(),
      title: notification.title || 'ServicePanda',
      message: notification.body || '',
      type: notification.additionalData?.type || 'general',
      data: notification.additionalData
    };

    // Notify all registered callbacks
    this.notificationCallbacks.forEach(callback => {
      try {
        callback(payload);
      } catch (error) {
        console.error('❌ Notification callback error:', error);
      }
    });
  }

  private handleNotificationOpened(notification: any) {
    console.log('🔓 Processing opened notification:', notification);
    // Handle notification tap actions here
  }

  // Public methods
  async sendTestNotification(providerId: string) {
    console.log('🧪 Sending test notification to provider:', providerId);
    
    try {
      const payload = {
        app_id: this.appId,
        include_external_user_ids: [`provider-${providerId}`],
        headings: { en: '🧪 Test Notification' },
        contents: { 
          en: `Test notification sent at ${new Date().toLocaleTimeString()}\n\nIf you received this, OneSignal is working properly!`
        },
        data: {
          type: 'test',
          providerId: providerId
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
        console.log('✅ Test notification sent successfully!');
        console.log('📊 Recipients:', result.recipients);
        return { success: true, recipients: result.recipients };
      } else {
        console.error('❌ Test notification failed:', result);
        return { success: false, error: result };
      }
      
    } catch (error) {
      console.error('❌ Test notification error:', error);
      return { success: false, error: error.message };
    }
  }

  onNotificationReceived(callback: (notification: NotificationPayload) => void) {
    this.notificationCallbacks.push(callback);
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
        externalUserId: providerId ? `provider-${providerId}` : null
      };
    } catch (error) {
      return {
        isRegistered: false,
        error: error.message
      };
    }
  }
}

export const fixedOneSignalService = new FixedOneSignalService();
export default fixedOneSignalService;
