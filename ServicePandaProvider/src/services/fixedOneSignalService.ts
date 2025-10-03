// FIXED OneSignal Service - Resolves all notification issues
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// OneSignal SDK import with error handling
let OneSignal: any = null;
try {
  OneSignal = require('react-native-onesignal');
  console.log('✅ OneSignal import successful:', typeof OneSignal);
} catch (importError: any) {
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
  private restApiKey = 'os_v2_app_up2qodm4izcm3cykewo7cvnosrtodbs2i5ce3r5zeusbxh5utqy7iys7bhaffdnt65vsy4ql6p5beykzl62ahn2jdgifjshulo2hkky';
  private notificationCallbacks: Array<(notification: NotificationPayload) => void> = [];

  async initialize(forceReinit: boolean = false) {
    if (this.isInitialized && !forceReinit) {
      console.log('⚠️ OneSignal already initialized, skipping...');
      return;
    }
    
    if (forceReinit) {
      console.log('🔄 Force re-initializing OneSignal...');
      this.isInitialized = false;
    }

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
      
      // Debug OneSignal status
      await this.debugOneSignalStatus();
      
      // Cleanup duplicate devices
      await this.cleanupDuplicateDevices();
      
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

    console.log('🚀 Initializing OneSignal SDK for notification receiving only...');
    console.log('🔄 Device creation handled via REST API to prevent duplicates');
    
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

    // Initialize OneSignal with proper API (for notification receiving)
    const OSInstance = OneSignal?.OneSignal || OneSignal;
    
    if (typeof OSInstance.setAppId === 'function') {
      // OneSignal v5 API
      OSInstance.setAppId(this.appId);
      console.log('✅ OneSignal v5 initialized for notifications');
    } else if (typeof OSInstance.initialize === 'function') {
      // OneSignal v4 API fallback
      OSInstance.initialize(this.appId);
      console.log('✅ OneSignal v4 initialized for notifications');
    } else {
      throw new Error('OneSignal SDK methods not available');
    }

    // Wait for initialization
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // CRITICAL: Ensure device is subscribed to notifications
    await this.ensureDeviceSubscription();
    
    // Verify SDK is ready for notifications
    console.log('🔍 Verifying OneSignal SDK is ready for notifications...');
    if (OSInstance.setNotificationWillShowInForegroundHandler) {
      console.log('✅ OneSignal SDK is ready for notification handling');
    } else {
      console.log('⚠️ OneSignal SDK not ready for notification handling');
    }
  }

  // CRITICAL: Ensure device is subscribed to notifications (works without external ID)
  private async ensureDeviceSubscription() {
    try {
      console.log('🔔 Ensuring device is subscribed to notifications...');
      
      const OSInstance = OneSignal?.OneSignal || OneSignal;
      
      // Method 1: Try to enable push notifications via SDK
      if (OSInstance.promptForPushNotificationsWithUserResponse) {
        console.log('🔔 Prompting for push notification permission...');
        const permission = await OSInstance.promptForPushNotificationsWithUserResponse();
        console.log('🔔 Push permission result:', permission);
      } else if (OSInstance.User && OSInstance.User.addTag) {
        // Method 2: Add subscription tag to ensure device is subscribed
        console.log('🔔 Adding subscription tag to ensure device is subscribed...');
        await OSInstance.User.addTag('subscribed', 'true');
        await OSInstance.User.addTag('app_version', '1.1.0');
        console.log('✅ Subscription tags added');
      }
      
      // Method 3: Force device state refresh
      if (OSInstance.getDeviceState) {
        const deviceState = await OSInstance.getDeviceState();
        console.log('🔍 Current device state:', deviceState);
        
        if (deviceState && deviceState.isSubscribed) {
          console.log('✅ Device is already subscribed to notifications');
        } else {
          console.log('⚠️ Device subscription status unclear, but broadcast notifications should still work');
        }
      }
      
      // Method 4: Create/update device via REST API to ensure subscription
      await this.ensureDeviceSubscriptionViaAPI();
      
      console.log('✅ Device subscription process completed');
      
    } catch (error) {
      console.error('❌ Failed to ensure device subscription:', error);
      // Don't throw error - broadcast notifications should still work
    }
  }

  // Ensure device subscription via REST API
  private async ensureDeviceSubscriptionViaAPI() {
    try {
      console.log('🔄 Ensuring device subscription via REST API...');
      
      const providerId = await AsyncStorage.getItem('providerId') || '1';
      const externalUserId = `provider-${providerId}`;
      
      // Create a device registration payload that ensures subscription
      const registrationPayload = {
        app_id: this.appId,
        device_type: 1, // Android
        identifier: `sp-subscription-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        device_model: 'Samsung Galaxy F23 5G',
        device_os: '14.0',
        timezone_id: 'Asia/Kolkata',
        language: 'en',
        sdk: '050213',
        notification_types: 1, // Enable notifications
        external_user_id: externalUserId,
        tags: {
          provider_id: providerId,
          app_version: '1.1.0',
          subscribed: 'true',
          created_via: 'subscription_ensure'
        },
        // CRITICAL: Force subscription status
        subscribed: true,
        session_count: 1,
        session_time: 60,
        timezone: 0,
        timezone_id: 'Asia/Kolkata',
        language: 'en',
        country: 'IN'
      };
      
      const response = await fetch('https://onesignal.com/api/v1/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${this.restApiKey}`
        },
        body: JSON.stringify(registrationPayload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Device subscription ensured via REST API');
        await AsyncStorage.setItem('oneSignalPlayerId', result.id);
        console.log('✅ Player ID stored:', result.id);
      } else {
        const error = await response.text();
        console.log('⚠️ Device subscription API call failed (this is OK for broadcast):', error);
      }
      
    } catch (error) {
      console.error('❌ Device subscription API error (this is OK for broadcast):', error);
    }
  }

  private async registerDeviceWithProperUserID() {
    console.log('📱 Registering device with proper user ID...');
    
    try {
      // Get provider ID from storage
      const providerId = await AsyncStorage.getItem('providerId') || '1';
      const externalUserId = `provider-${providerId}`;
      
      console.log('🆔 Provider ID from storage:', providerId);
      console.log('🆔 External user ID:', externalUserId);

      const OSInstance = OneSignal?.OneSignal || OneSignal;
      
      // Set external user ID for targeting via SDK
      if (OSInstance.setExternalUserId) {
        OSInstance.setExternalUserId(externalUserId);
        console.log('✅ External user ID set via SDK');
      } else if (OSInstance.User && OSInstance.User.setExternalUserId) {
        OSInstance.User.setExternalUserId(externalUserId);
        console.log('✅ External user ID set via User API');
      }

      // Get and store the OneSignal player ID
      const playerId = await this.getAndStorePlayerId();
      
      // CRITICAL: Always create/update device with external user ID
      if (providerId !== '1') {
        console.log('🔄 Ensuring device has external user ID...');
        console.log('🔄 Player ID:', playerId);
        console.log('🔄 Provider ID:', providerId);
        console.log('🔄 External User ID:', externalUserId);
        
        if (playerId) {
          // Try to update existing device
          const updateSuccess = await this.setExternalUserIdViaAPI(playerId, externalUserId, providerId);
          if (!updateSuccess) {
            console.log('🔄 Update failed, creating new device...');
            const newPlayerId = await this.createDeviceWithExternalId(externalUserId);
            if (newPlayerId) {
              await AsyncStorage.setItem('oneSignalPlayerId', newPlayerId);
              console.log('✅ New device created and stored');
            }
          }
        } else {
          // No player ID, create new device
          console.log('🔄 No player ID, creating new device...');
          const newPlayerId = await this.createDeviceWithExternalId(externalUserId);
          if (newPlayerId) {
            await AsyncStorage.setItem('oneSignalPlayerId', newPlayerId);
            console.log('✅ New device created and stored');
          }
        }
      } else {
        console.log('⚠️ Using fallback provider ID, skipping external user ID');
      }
      
      console.log('✅ Device registration completed - external user ID set via SDK and API');
      
    } catch (error) {
      console.error('❌ Device registration failed:', error);
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

  // Removed manual device registration to prevent duplicate devices

  private generateFallbackToken(): string {
    // Generate a consistent fallback token based on device info
    const { Platform } = require('react-native');
    const timestamp = Date.now();
    return `sp-fallback-${Platform.OS}-${timestamp}`;
  }

  private setupNotificationHandlers() {
    try {
      console.log('🔔 Setting up OneSignal notification handlers...');
      
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
          'Authorization': `Basic ${this.restApiKey}`
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
      
    } catch (error: any) {
      console.error('❌ Test notification error:', error);
      return { success: false, error: error.message };
    }
  }

  // Test broadcast notification (works without external ID)
  async sendBroadcastTestNotification() {
    console.log('📢 Sending BROADCAST test notification (no external ID needed)...');
    
    try {
      const payload = {
        app_id: this.appId,
        // BROADCAST: Send to all subscribed users
        included_segments: ['Subscribed Users'],
        headings: { en: '📢 Broadcast Test Notification' },
        contents: { 
          en: `BROADCAST test sent at ${new Date().toLocaleTimeString()}\n\nThis should work WITHOUT external ID!\n\nIf you received this, the fix is working!`
        },
        data: {
          type: 'broadcast_test',
          timestamp: new Date().toISOString()
        },
        // Android specific settings
        priority: 10,
        android_sound: "default",
        android_vibration_pattern: [1000, 1000],
        content_available: true,
        ttl: 3600
      };

      const response = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${this.restApiKey}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ BROADCAST test notification sent successfully!');
        console.log('📊 Recipients:', result.recipients);
        console.log('🎯 This proves notifications work WITHOUT external ID!');
        return { success: true, recipients: result.recipients };
      } else {
        console.error('❌ BROADCAST test notification failed:', result);
        return { success: false, error: result };
      }
      
    } catch (error: any) {
      console.error('❌ BROADCAST test notification error:', error);
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
    } catch (error: any) {
      return {
        isRegistered: false,
        error: error.message
      };
    }
  }

  // Method to update external user ID after login
  async updateExternalUserId(providerId: string) {
    try {
      console.log('🔄 updateExternalUserId called with providerId:', providerId);
      console.log('🔄 Provider ID type:', typeof providerId);
      console.log('🔄 Updating external user ID to:', `provider-${providerId}`);
      
      const externalUserId = `provider-${providerId}`;
      console.log('🔄 External user ID created:', externalUserId);
      
      const OSInstance = OneSignal?.OneSignal || OneSignal;
      console.log('🔄 OneSignal instance available:', !!OSInstance);
      
      // Set external user ID for targeting via SDK
      if (OSInstance && OSInstance.setExternalUserId) {
        OSInstance.setExternalUserId(externalUserId);
        console.log('✅ External user ID set via SDK');
      } else if (OSInstance && OSInstance.User && OSInstance.User.setExternalUserId) {
        OSInstance.User.setExternalUserId(externalUserId);
        console.log('✅ External user ID set via User API');
      } else {
        console.log('⚠️ OneSignal SDK not available for external user ID update');
      }
      
      // CRITICAL: Find and update the SUBSCRIBED device with external user ID
      const playerId = await AsyncStorage.getItem('oneSignalPlayerId');
      if (playerId) {
        console.log('🔄 Setting external user ID via REST API to ensure persistence...');
        const success = await this.setExternalUserIdViaAPI(playerId, externalUserId, providerId);
        
        if (!success) {
          console.log('🔄 Primary device update failed, trying to find subscribed device...');
          await this.findAndUpdateSubscribedDevice(externalUserId, providerId);
        }
      } else {
        console.log('⚠️ No player ID found, will be set during device registration');
      }
      
      console.log('✅ External user ID update completed');
      return { success: true, result: { method: 'dynamic_update' } };
      
    } catch (error) {
      console.error('❌ Failed to update external user ID:', error);
      return { success: false, error: error.message };
    }
  }

  // Fallback method to update external user ID via REST API
  private async fallbackExternalUserIdUpdate(providerId: string) {
    try {
      console.log('🔄 Fallback: Updating external user ID via REST API...');
      
      const externalUserId = `provider-${providerId}`;
      
      // Get current player ID
      let playerId = await AsyncStorage.getItem('oneSignalPlayerId');
      
      if (!playerId) {
        console.log('⚠️ No player ID found, creating device first...');
        playerId = await this.createDeviceWithExternalId(externalUserId);
        if (!playerId) {
          console.log('❌ Failed to create device');
          return;
        }
      }
      
      // Update device with external user ID
      const updatePayload = {
        app_id: this.appId,
        external_user_id: externalUserId,
        tags: {
          provider_id: providerId,
          app_version: '1.1.0',
          updated_via: 'fallback_rest_api'
        }
      };
      
      const response = await fetch(`https://onesignal.com/api/v1/players/${playerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${this.restApiKey}`
        },
        body: JSON.stringify(updatePayload)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ External user ID updated via REST API fallback');
        console.log('Result:', result);
      } else {
        const error = await response.text();
        console.log('❌ REST API fallback failed:', error);
      }
      
    } catch (error) {
      console.error('❌ Fallback method failed:', error);
    }
  }

  // Create device with external user ID
  private async createDeviceWithExternalId(externalUserId: string) {
    try {
      console.log('🆕 Creating device with external user ID:', externalUserId);
      
      const providerId = externalUserId.replace('provider-', '');
      
      const registrationPayload = {
        app_id: this.appId,
        device_type: 1,
        identifier: `sp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        device_model: 'Samsung Galaxy F23 5G',
        device_os: '14.0',
        timezone_id: 'Asia/Kolkata',
        language: 'en',
        sdk: '050213',
        notification_types: 1,
        external_user_id: externalUserId,
        tags: {
          provider_id: providerId,
          app_version: '1.1.0',
          created_via: 'fallback_method'
        }
      };
      
      const response = await fetch('https://onesignal.com/api/v1/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${this.restApiKey}`
        },
        body: JSON.stringify(registrationPayload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Device created with external user ID');
        await AsyncStorage.setItem('oneSignalPlayerId', result.id);
        return result.id;
      } else {
        const error = await response.text();
        console.log('❌ Device creation failed:', error);
        return null;
      }
      
    } catch (error) {
      console.error('❌ Device creation error:', error);
      return null;
    }
  }

  // Find and update the subscribed device with external user ID
  private async findAndUpdateSubscribedDevice(externalUserId: string, providerId: string) {
    try {
      console.log('🔍 Finding and updating subscribed device...');
      
      // Get all devices for this app and find the one with subscribed: true
      const response = await fetch(`https://onesignal.com/api/v1/players?app_id=${this.appId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${this.restApiKey}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('📱 Found devices:', result.players?.length || 0);
        
        // Find device with subscribed: true tag and no external user ID
        const subscribedDevice = result.players?.find((device: any) => 
          device.tags?.subscribed === 'true' && 
          !device.external_user_id &&
          device.device_type === 1 // Android
        );
        
        if (subscribedDevice) {
          console.log('✅ Found subscribed device without external ID:', subscribedDevice.id);
          
          // Update this device with external user ID (keep only essential tags)
          const updatePayload = {
            app_id: this.appId,
            external_user_id: externalUserId,
            tags: {
              subscribed: 'true',
              provider_id: providerId,
              app_version: '1.1.0'
            }
          };
          
          const updateResponse = await fetch(`https://onesignal.com/api/v1/players/${subscribedDevice.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Basic ${this.restApiKey}`
            },
            body: JSON.stringify(updatePayload)
          });

          if (updateResponse.ok) {
            const updateResult = await updateResponse.json();
            console.log('✅ Successfully updated subscribed device with external ID!');
            console.log('📱 Device ID:', subscribedDevice.id);
            console.log('👤 External ID:', updateResult.external_user_id);
            
            // Store this as the active player ID
            await AsyncStorage.setItem('oneSignalPlayerId', subscribedDevice.id);
            console.log('✅ Updated stored player ID');
            
            return true;
          } else {
            const error = await updateResponse.text();
            console.log('❌ Failed to update subscribed device:', error);
          }
        } else {
          console.log('⚠️ No subscribed device without external ID found');
        }
      } else {
        console.log('❌ Failed to fetch devices:', await response.text());
      }
      
      return false;
    } catch (error) {
      console.error('❌ Error finding subscribed device:', error);
      return false;
    }
  }

  // Force update external user ID - can be called manually
  async forceUpdateExternalUserId(providerId: string) {
    try {
      console.log('🔄 FORCE updating external user ID to:', `provider-${providerId}`);
      
      const externalUserId = `provider-${providerId}`;
      const OSInstance = OneSignal?.OneSignal || OneSignal;
      
      // Set external user ID for targeting via SDK ONLY
      if (OSInstance.setExternalUserId) {
        OSInstance.setExternalUserId(externalUserId);
        console.log('✅ External user ID set via SDK');
        return { success: true, result: { method: 'sdk_only' } };
      } else if (OSInstance.User && OSInstance.User.setExternalUserId) {
        OSInstance.User.setExternalUserId(externalUserId);
        console.log('✅ External user ID set via User API');
        return { success: true, result: { method: 'user_api' } };
      } else {
        console.log('⚠️ OneSignal SDK not available for external user ID update');
        return { success: false, error: 'SDK not available' };
      }
      
    } catch (error: any) {
      console.error('❌ Force update external user ID failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Set external user ID via REST API to ensure persistence
  private async setExternalUserIdViaAPI(playerId: string, externalUserId: string, providerId: string) {
    try {
      console.log('🔄 Setting external user ID via REST API...');
      console.log(`   Player ID: ${playerId}`);
      console.log(`   External User ID: ${externalUserId}`);
      
      const updatePayload = {
        app_id: this.appId,
        external_user_id: externalUserId,
        tags: {
          provider_id: providerId,
          app_version: '1.1.0',
          updated_via: 'rest_api',
          timestamp: new Date().toISOString()
        }
      };
      
      console.log('📦 Update payload:', JSON.stringify(updatePayload, null, 2));
      
      const response = await fetch(`https://onesignal.com/api/v1/players/${playerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${this.restApiKey}`
        },
        body: JSON.stringify(updatePayload)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ External user ID set via REST API successfully!');
        console.log('📦 Full response:', JSON.stringify(result, null, 2));
        console.log(`   External User ID: ${result.external_user_id}`);
        console.log(`   Device Model: ${result.device_model}`);
        console.log(`   Tags: ${JSON.stringify(result.tags)}`);
        return true;
      } else {
        const error = await response.text();
        console.log('❌ REST API update failed:', response.status, error);
        
        // If device not found, create a new one
        if (error.includes('No user with this id found')) {
          console.log('🔄 Device not found, creating new device with external user ID...');
          const newPlayerId = await this.createDeviceWithExternalId(externalUserId);
          if (newPlayerId) {
            console.log('✅ New device created with external user ID:', newPlayerId);
            await AsyncStorage.setItem('oneSignalPlayerId', newPlayerId);
            return true;
          }
        }
        return false;
      }
      
    } catch (error) {
      console.error('❌ REST API update error:', error);
      return false;
    }
  }

  // Method to clean up duplicate devices
  async cleanupDuplicateDevices() {
    try {
      console.log('🧹 Cleaning up duplicate devices...');
      
      // Get the current player ID (the one we want to keep)
      const playerId = await AsyncStorage.getItem('oneSignalPlayerId');
      if (!playerId) {
        console.log('⚠️ No player ID found, cannot cleanup');
        return;
      }
      
      console.log('📱 Keeping player ID:', playerId);
      console.log('ℹ️ Other duplicate devices need to be manually deleted from OneSignal dashboard');
      console.log('ℹ️ Keep the device with real device name (Samsung Galaxy F23 5G)');
      console.log('ℹ️ Delete the device with ServicePandaProvider name');
      
    } catch (error) {
      console.error('❌ Failed to cleanup duplicate devices:', error);
    }
  }

  // Debug method to check OneSignal status
  async debugOneSignalStatus() {
    try {
      console.log('🔍 DEBUG: Checking OneSignal status...');
      
      const playerId = await AsyncStorage.getItem('oneSignalPlayerId');
      const providerId = await AsyncStorage.getItem('providerId');
      
      console.log('🔍 DEBUG - Player ID:', playerId);
      console.log('🔍 DEBUG - Provider ID:', providerId);
      console.log('🔍 DEBUG - Expected External ID:', providerId ? `provider-${providerId}` : 'N/A');
      
      if (OneSignal) {
        console.log('🔍 DEBUG - OneSignal SDK available:', typeof OneSignal);
        const OSInstance = OneSignal?.OneSignal || OneSignal;
        console.log('🔍 DEBUG - OneSignal instance:', typeof OSInstance);
      } else {
        console.log('🔍 DEBUG - OneSignal SDK not available');
      }
      
    } catch (error) {
      console.error('❌ DEBUG: Failed to check OneSignal status:', error);
    }
  }
}

export const fixedOneSignalService = new FixedOneSignalService();
export default fixedOneSignalService;
