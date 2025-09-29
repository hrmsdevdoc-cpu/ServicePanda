/**
 * Fix OneSignal for Real Device
 * Proper OneSignal SDK setup for device registration
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing OneSignal for real device registration...');
console.log('');

// Updated OneSignal Service with proper SDK setup
const fixedOneSignalService = `// OneSignal Service with REAL SDK integration
import { AppState, AppStateStatus } from 'react-native';
import localNotificationService from './localNotificationService';
import androidNotificationService from './androidNotificationService';

// REAL OneSignal import (enable this for production)
import OneSignal from 'react-native-onesignal';

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
      console.log('🔔 Initializing REAL OneSignal SDK for device registration...');
      console.log('📱 App ID:', appId);
      
      // STEP 1: Initialize OneSignal with App ID
      OneSignal.setAppId(appId);
      console.log('✅ OneSignal App ID set');
      
      // STEP 2: Request notification permissions
      console.log('📱 Requesting notification permissions...');
      const permissionStatus = await OneSignal.promptForPushNotificationsWithUserResponse();
      console.log('🔔 Permission status:', permissionStatus);
      
      // STEP 3: Get provider ID and set external user ID
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const providerId = await AsyncStorage.getItem('providerId') || '1';
      
      OneSignal.setExternalUserId(providerId);
      console.log(\`👤 External User ID set: \${providerId}\`);
      
      // STEP 4: Setup notification handlers
      OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
        console.log('📱 Foreground notification received:', notificationReceivedEvent);
        const notification = notificationReceivedEvent.getNotification();
        
        // Show notification in foreground
        notificationReceivedEvent.complete(notification);
      });

      OneSignal.setNotificationOpenedHandler(notification => {
        console.log('📱 Notification opened:', notification);
        // Handle notification tap
      });
      
      // STEP 5: Wait and check device status
      setTimeout(async () => {
        try {
          const deviceState = await OneSignal.getDeviceState();
          console.log('📊 DEVICE REGISTRATION STATUS:');
          console.log('   - Is Subscribed:', deviceState.isSubscribed);
          console.log('   - Player ID:', deviceState.userId);
          console.log('   - Push Token:', deviceState.pushToken ? 'Present' : 'Missing');
          
          if (deviceState.isSubscribed && deviceState.userId) {
            console.log('🎉 SUCCESS: Device registered with OneSignal!');
            console.log(\`🔑 Player ID: \${deviceState.userId}\`);
            console.log('📱 Device will appear in OneSignal dashboard');
            console.log('🔔 Push notifications will work when app is closed');
          } else {
            console.log('⚠️ Device NOT fully registered');
            console.log('💡 Check app permissions and OneSignal setup');
          }
        } catch (error) {
          console.log('❌ Error checking device state:', error);
        }
      }, 3000);
      
      // Setup app state monitoring
      this.setupAppStateMonitoring();
      
      this.isInitialized = true;
      console.log('✅ OneSignal service initialized successfully!');
      
    } catch (error) {
      console.error('❌ OneSignal initialization failed:', error);
      console.log('💡 Falling back to polling notifications');
      
      // Fallback to polling approach
      this.setupFallbackPolling();
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
    } catch (error) {
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
      console.log(\`📱 App state changed to: \${nextAppState}\`);
      
      if (nextAppState === 'background') {
        console.log('📱 App went to background - push notifications should work');
      } else if (nextAppState === 'active') {
        console.log('📱 App became active - checking for missed notifications');
      }
    });
  }

  // Check device registration status
  async checkDeviceStatus() {
    try {
      const deviceState = await OneSignal.getDeviceState();
      
      console.log("🔍 Current Device Status:");
      console.log("   - Is Subscribed:", deviceState.isSubscribed);
      console.log("   - Player ID:", deviceState.userId);
      console.log("   - Push Token:", deviceState.pushToken ? 'Present' : 'Missing');
      
      return {
        isRegistered: deviceState.isSubscribed && deviceState.userId,
        playerId: deviceState.userId,
        isSubscribed: deviceState.isSubscribed,
        pushToken: deviceState.pushToken
      };
    } catch (error) {
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
    console.log(\`🧪 Device registered with Player ID: \${playerId}\`);
    console.log(\`💡 Server can now send targeted notifications!\`);
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
`;

// Write the fixed service
const servicePath = path.join('ServicePandaProvider', 'src', 'services', 'oneSignalService.ts');

try {
  // Backup current file
  const currentContent = fs.readFileSync(servicePath, 'utf8');
  fs.writeFileSync(servicePath + '.backup', currentContent);
  console.log('✅ Backup created');
  
  // Write fixed version
  fs.writeFileSync(servicePath, fixedOneSignalService);
  console.log('✅ OneSignal service updated with proper SDK integration');
  
} catch (error) {
  console.log('❌ Failed to update service:', error.message);
}

console.log('');
console.log('🎯 FIXES APPLIED:');
console.log('   ✅ Real OneSignal SDK import enabled');
console.log('   ✅ Proper device registration flow');
console.log('   ✅ Permission prompts added');
console.log('   ✅ Device status checking');
console.log('   ✅ Background notification support');
console.log('');
console.log('🔄 REBUILD APP:');
console.log('   cd ServicePandaProvider');
console.log('   npx react-native run-android --device');
console.log('');
console.log('📱 After rebuild, device should register with OneSignal!');

console.log('');
console.log('⚠️ MAKE SURE:');
console.log('   1. OneSignal SDK is installed: npm install react-native-onesignal');
console.log('   2. App has notification permissions');
console.log('   3. Google Play Services working on device');
console.log('   4. Internet connection available');
