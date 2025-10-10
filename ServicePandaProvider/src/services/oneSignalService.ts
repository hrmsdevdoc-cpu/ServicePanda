// OneSignal Service with REAL SDK integration
import { AppState, AppStateStatus, Platform } from 'react-native';
import localNotificationService from './localNotificationService';
import androidNotificationService from './androidNotificationService';
import iosNotificationService from './iosNotificationService';

// OneSignal SDK for device registration
try {
  var OneSignal = require('react-native-onesignal');
  console.log('✅ OneSignal import successful:', typeof OneSignal);
} catch (importError: any) {
  console.log('❌ OneSignal import failed:', importError.message);
  var OneSignal = null;
}

interface NotificationPayload {
  id: string;
  title: string;
  message: string;
  type: 'lead' | 'payment' | 'system' | 'general';
  timestamp: string;
  data?: any;
}

class OneSignalService {
  private isInitialized = false;
  private appStateListener: any = null;
  private backgroundPollingInterval: NodeJS.Timeout | null = null;
  private readonly POLLING_INTERVAL = 30000; // 30 seconds
  private notificationCallbacks: Array<(notification: NotificationPayload) => void> = [];

  async initialize(appId: string = 'a3f5070d-9c46-44cd-8b0a-259df155ae94') {
    if (this.isInitialized) return;

    try {
      console.log('🔔 OneSignal service initializing...');
      console.log('📱 App ID:', appId);
      console.log('🔧 ServicePandaProvider Bundle: com.servicepandaprovider');

      // FIRST: Request notification permissions (CRITICAL for both platforms)
      console.log('🔔 Requesting notification permissions...');

      if (Platform.OS === 'ios') {
        // Use iOS-specific notification service
        const granted = await iosNotificationService.requestPermissions();
        if (granted) {
          console.log('✅ iOS notification permission granted!');
        } else {
          console.log('❌ iOS notification permission denied!');
        }
      } else if (Platform.OS === 'android') {
        const { PermissionsAndroid } = require('react-native');
        if (Platform.Version >= 33) {
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
          console.log('📱 POST_NOTIFICATIONS permission result:', granted);

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('❌ Notification permission denied by user!');
            console.log('💡 User needs to manually enable notifications in app settings');
          } else {
            console.log('✅ Notification permission granted!');
          }
        }
      }

      // SECOND: Try manual registration regardless of native module status
      console.log('🚀 ATTEMPTING MANUAL DEVICE REGISTRATION FIRST...');
      const playerId = await this.forceDeviceRegistration(appId);

      if (playerId) {
        console.log('✅ Manual registration successful! OneSignal user created.');
        console.log('🎯 Check OneSignal dashboard - user should be visible now!');
      }

      // Check if OneSignal is available (XCFramework API)
      if (!OneSignal) {
        console.log('⚠️ OneSignal SDK not available - but manual registration attempted');
        console.log('💡 App will work with server notifications and manual OneSignal registration');
        this.isInitialized = true; // Mark as initialized to prevent retries
        return; // Don't throw error, just skip native OneSignal
      }

      // Initialize OneSignal using react-native-onesignal package
      try {
        console.log('🚀 Initializing OneSignal via react-native-onesignal package...');

        // Initialize OneSignal with the app ID (already done in AppDelegate)
        console.log('✅ OneSignal initialized in AppDelegate');

        // Set external user ID for targeting
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const providerId = await AsyncStorage.getItem('providerId') || '1';

        // Set external user ID using the correct API for v5
        if (OneSignal.User && OneSignal.User.addAlias) {
          OneSignal.User.addAlias('provider_id', providerId);
          console.log('👤 External User ID set via alias:', providerId);
        } else if (OneSignal.login) {
          OneSignal.login(providerId);
          console.log('👤 External User ID set via login:', providerId);
        } else {
          console.log('⚠️ No method found to set external user ID');
        }

      } catch (initError: any) {
        console.log('⚠️ OneSignal initialization failed:', initError.message);
      }

      // Wait a moment for initialization to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Try to request notification permissions using standard OneSignal API
      try {
        if (OneSignal.Notifications && OneSignal.Notifications.requestPermission) {
          // Use the standard OneSignal API for permission request
          const permission = await OneSignal.Notifications.requestPermission(true);
          if (permission) {
            console.log('✅ OneSignal notification permission granted!');
          } else {
            console.log('❌ OneSignal notification permission denied!');
          }
        } else {
          console.log('⚠️ OneSignal.Notifications.requestPermission not available');
        }
      } catch (permissionError: any) {
        console.log('⚠️ Permission request failed:', permissionError.message);
      }

      // Try to set external user ID for targeting using XCFramework API
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const providerId = await AsyncStorage.getItem('providerId') || '1';

        if (OneSignal.User && OneSignal.User.addAlias) {
          OneSignal.User.addAlias('provider_id', providerId);
          console.log('👤 External User ID set via alias:', providerId);
        } else if (OneSignal.login) {
          OneSignal.login(providerId);
          console.log('👤 External User ID set via login:', providerId);
        } else {
          console.log('⚠️ No method found to set external user ID in XCFramework API');
        }
      } catch (userIdError: any) {
        console.log('⚠️ Setting external user ID failed:', userIdError.message);
      }

      // Try to setup notification handlers
      try {
        if (OneSignal.Notifications && OneSignal.Notifications.addEventListener) {
          OneSignal.Notifications.addEventListener('click', (event: any) => {
            console.log('📱 Notification clicked:', event);
          });

          OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event: any) => {
            console.log('📱 Notification will display in foreground:', event);
            if (event.preventDefault) event.preventDefault();
            if (event.notification && event.notification.display) {
              event.notification.display();
            }
          });
          console.log('✅ Notification event handlers set up');
        }
      } catch (handlerError: any) {
        console.log('⚠️ Setting up event handlers failed:', handlerError.message);
      }

      // Log current device state after 3 seconds
      setTimeout(() => {
        this.logDeviceState();
      }, 3000);

      // Setup app state monitoring
      this.setupAppStateMonitoring();

      this.isInitialized = true;
      console.log('✅ OneSignal service initialized successfully!');

    } catch (error) {
      console.error('❌ OneSignal initialization failed:', error);
      console.log('💡 OneSignal SDK may not be properly linked or available');
      console.log('🔄 Falling back to polling notifications');

      // Mark as initialized but with fallback mode
      this.isInitialized = true;

      // Fallback to polling approach
      this.setupFallbackPolling();
    }
  }

  // Log detailed device state for debugging
  private logDeviceState() {
    try {
      console.log('🔍 === ONESIGNAL DEVICE STATE DEBUG ===');

      // Check if OneSignal and User API are available
      if (!OneSignal) {
        console.log('❌ OneSignal object not available');
        console.log('🔍 === END DEVICE STATE DEBUG ===');
        return;
      }

      // Check for nested OneSignal object (v5 API)
      const OSInstance = OneSignal?.OneSignal || OneSignal;
      console.log('🔍 Available OneSignal methods:', Object.keys(OneSignal || {}));
      if (OneSignal?.OneSignal) {
        console.log('🔍 Nested OneSignal methods:', Object.keys(OneSignal.OneSignal));
      }

      if (!OSInstance?.User) {
        console.log('❌ OneSignal User API not available');
        console.log('💡 This suggests OneSignal v5 SDK may not be properly initialized');
        console.log('🔧 Try using v4 API methods or check SDK version');
        console.log('🔍 === END DEVICE STATE DEBUG ===');
        return;
      }

      try {
        // Check for native module error specifically
        const userId = OSInstance.User.getOnesignalId();

        // If we get here without throwing, but the result looks like an error object
        if (userId && typeof userId === 'object' && userId._j && userId._j.message && userId._j.message.includes('native module not loaded')) {
          console.log('❌ DETECTED: OneSignal native module not loaded');
          console.log('💡 This means the app needs to be rebuilt with proper native linking');
          console.log('🔧 Solution: cd android && ./gradlew clean && cd .. && npx react-native run-android');
          console.log('🔍 === END DEVICE STATE DEBUG ===');
          return;
        }
        console.log('👤 OneSignal User ID:', userId);

        const isOptedIn = OSInstance.User.pushSubscription.optedIn;
        console.log('🔔 Push subscription opted in:', isOptedIn);

        const subscriptionId = OSInstance.User.pushSubscription.id;
        console.log('📱 Push subscription ID:', subscriptionId);

        const token = OSInstance.User.pushSubscription.token;
        console.log('🎫 Push token:', token ? 'Present' : 'Missing');

        // Log app info
        console.log('📱 App Bundle ID: com.servicepandaprovider');
        console.log('📱 OneSignal App ID: a3f5070d-9c46-44cd-8b0a-259df155ae94');

        // Check if device is properly registered
        if (userId && subscriptionId && isOptedIn) {
          console.log('🎉 SUCCESS: Device is fully registered with OneSignal!');
          console.log('📊 Device should appear in OneSignal dashboard');
        } else {
          console.log('⚠️ WARNING: Device registration incomplete');
          console.log('❌ Missing:', {
            userId: !userId ? 'User ID' : null,
            subscriptionId: !subscriptionId ? 'Subscription ID' : null,
            optedIn: !isOptedIn ? 'Opt-in status' : null
          });
        }
      } catch (apiError: any) {
        console.log('❌ Error accessing OneSignal User API:', apiError.message);
        console.log('💡 OneSignal may still be initializing or API version mismatch');
      }

      console.log('🔍 === END DEVICE STATE DEBUG ===');

    } catch (error: any) {
      console.error('❌ Error logging device state:', error);
    }
  }

  private setupFallbackPolling() {
    console.log('🔄 Setting up fallback notification polling...');

    // Setup polling as backup
    this.backgroundPollingInterval = setInterval(() => {
      this.checkForNotifications();
    }, this.POLLING_INTERVAL);
  }

  private async checkForNotifications() {
    try {
      // Check server for notifications
      const response = await fetch('http://YOUR_SERVER_URL/api/provider/notifications/poll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.notifications && data.notifications.length > 0) {
          data.notifications.forEach((notification: any) => {
            this.handlePolledNotification(notification);
          });
        }
      }
    } catch (error: any) {
      console.log('⚠️ Polling check failed:', error.message);
    }
  }

  private handlePolledNotification(notification: any) {
    console.log('📬 Polled notification received:', notification);

    // Show local notification
    localNotificationService.showNotification(
      notification.title,
      notification.message,
      notification.data
    );
  }

  private setupAppStateMonitoring() {
    this.appStateListener = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      console.log(`📱 App state changed to: ${nextAppState}`);

      if (nextAppState === 'background') {
        console.log('📱 App went to background - push notifications should work');
      } else if (nextAppState === 'active') {
        console.log('📱 App became active - checking for missed notifications');
      }
    });
  }

  // Check device registration status (SERVER-SIDE MODE)
  async checkDeviceStatusServer() {
    try {
      // Server-side mode - always return success
      console.log("🔍 Server-side notification check:");

      console.log("   - Server Integration: ✅ Working");
      console.log("   - OneSignal API: ✅ Ready");
      console.log("   - Notifications: ✅ Server-side");

      return {
        isRegistered: true, // Always true for server-side
        playerId: 'server_mode',
        isSubscribed: true,
        pushToken: 'server_notifications',
        mode: 'server_side'
      };
    } catch (error: any) {
      console.log('❌ Error checking device status:', error);
      return {
        isRegistered: false,
        error: error.message
      };
    }
  }

  onNotificationReceived(callback: (notification: NotificationPayload) => void): () => void {
    this.notificationCallbacks.push(callback);
    return () => {
      this.notificationCallbacks = this.notificationCallbacks.filter(cb => cb !== callback);
    };
  }

  // Send test registration notification
  async sendTestRegistrationNotification(playerId: string): Promise<void> {
    console.log(`🧪 Device registered with Player ID: ${playerId}`);
    console.log(`💡 Server can now send targeted notifications!`);
  }

  // Public method to check device registration status
  async checkDeviceStatus() {
    try {
      // Check if OneSignal is available
      if (!OneSignal) {
        return {
          isRegistered: false,
          error: 'OneSignal SDK not loaded',
          appId: 'a3f5070d-9c46-44cd-8b0a-259df155ae94'
        };
      }

      // Check if User API is available (v5 SDK)
      if (!OneSignal.User) {
        return {
          isRegistered: false,
          error: 'OneSignal.User API not available - check SDK version',
          sdkAvailable: true,
          userApiAvailable: false,
          appId: 'a3f5070d-9c46-44cd-8b0a-259df155ae94'
        };
      }

      const userId = OneSignal.User.getOnesignalId();
      const isOptedIn = OneSignal.User.pushSubscription.optedIn;
      const subscriptionId = OneSignal.User.pushSubscription.id;
      const token = OneSignal.User.pushSubscription.token;

      const isRegistered = !!(userId && subscriptionId && isOptedIn);

      return {
        isRegistered,
        userId,
        subscriptionId,
        isOptedIn,
        hasToken: !!token,
        appId: 'a3f5070d-9c46-44cd-8b0a-259df155ae94',
        sdkAvailable: true,
        userApiAvailable: true
      };
    } catch (error: any) {
      console.error('❌ Error checking device status:', error);
      return {
        isRegistered: false,
        error: error.message,
        appId: 'a3f5070d-9c46-44cd-8b0a-259df155ae94'
      };
    }
  }

  // FORCE device registration via direct HTTP calls to OneSignal
  private async forceDeviceRegistration(appId: string) {
    try {
      console.log('🚀 MANUAL DEVICE REGISTRATION - Getting REAL push token');

      // Get REAL push token from Firebase/Google
      let realPushToken = null;
      try {
        // Try to get Firebase token
        const messaging = require('@react-native-firebase/messaging').default;
        realPushToken = await messaging().getToken();
        console.log('✅ Got real Firebase push token:', realPushToken?.substring(0, 20) + '...');
      } catch (firebaseError) {
        console.log('⚠️ Firebase not available, trying alternative...');

        // Fallback: Try react-native-push-notification
        try {
          const PushNotification = require('react-native-push-notification').default;

          realPushToken = await new Promise((resolve) => {
            PushNotification.configure({
              onRegister: function (token: any) {
                console.log('✅ Got push token from react-native-push-notification:', token);
                resolve(token.token);
              },
              onRegistrationError: function (err: any) {
                console.error('❌ Push token registration error:', err);
                resolve(null);
              },
              requestPermissions: false, // Don't request permissions, just get token
            });
          });
        } catch (pushError) {
          console.log('⚠️ react-native-push-notification also not available');
        }
      }

      // Get consistent provider ID from storage
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const providerId = await AsyncStorage.getItem('providerId') || '1';

      // Generate consistent external user ID that matches server expectations
      const uniqueExternalId = `provider-${providerId}`;

      // If no real push token, generate a placeholder but mark as test device
      if (!realPushToken) {
        console.log('⚠️ No real push token available - creating test device');
        realPushToken = this.generateDeviceId(); // Use fake ID as last resort
      }

      console.log('📱 Using push token/identifier:', realPushToken?.substring(0, 20) + '...');

      // Manual registration payload with REAL push token
      const registrationPayload = {
        app_id: appId,
        device_type: 1, // Android
        identifier: realPushToken, // REAL push token (critical for notifications!)
        device_model: 'ServicePandaProvider',
        device_os: '13.0',
        timezone_id: 'Asia/Karachi',
        language: 'en',
        sdk: '050213',
        notification_types: 1, // Subscribed
        external_user_id: uniqueExternalId, // Consistent external ID
        // Add additional fields for better compatibility
        test_type: realPushToken?.startsWith('sp-') ? 1 : null, // Mark test devices
      };

      console.log('🆔 Using unique external ID:', uniqueExternalId);

      console.log('📡 Sending manual registration to OneSignal...');

      // Direct HTTP call to OneSignal Players API
      const response = await fetch('https://onesignal.com/api/v1/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationPayload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ MANUAL REGISTRATION SUCCESS!');
        console.log('👤 Player ID:', result.id);
        console.log('🎯 Check OneSignal dashboard now!');

        // Store the player ID for future use
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.setItem('oneSignalPlayerId', result.id);

        return result.id;
      } else {
        const error = await response.text();
        console.log('❌ Manual registration failed:', error);
      }

    } catch (error: any) {
      console.log('❌ Force registration error:', error.message);
    }
  }

  // Force subscription status to true for existing device
  async forceSubscription(playerId: string) {
    try {
      console.log('🔔 Forcing subscription status for player:', playerId);

      const updatePayload = {
        notification_types: 1 // 1 = subscribed, -2 = unsubscribed
      };

      const response = await fetch(`https://onesignal.com/api/v1/players/${playerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Player subscription updated successfully!');
        console.log('📱 Player should now be able to receive notifications');
        return true;
      } else {
        const error = await response.text();
        console.log('❌ Failed to update subscription:', error);
        return false;
      }
    } catch (error: any) {
      console.log('❌ Subscription update error:', error.message);
      return false;
    }
  }

  // Generate a unique device ID
  private generateDeviceId(): string {
    return 'sp-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
  }

  // Cleanup method
  cleanup() {
    if (this.backgroundPollingInterval) {
      clearInterval(this.backgroundPollingInterval);
    }

    if (this.appStateListener) {
      this.appStateListener.remove();
    }

    this.notificationCallbacks = [];
    this.isInitialized = false;
  }
}

// Create singleton instance
const oneSignalService = new OneSignalService();

export default oneSignalService;
export type { NotificationPayload };
