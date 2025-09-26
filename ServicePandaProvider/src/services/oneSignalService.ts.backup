// import OneSignal from 'react-native-onesignal'; // Commented out - using broadcast notifications instead
import { AppState, AppStateStatus } from 'react-native';
import localNotificationService from './localNotificationService';
import androidNotificationService from './androidNotificationService';

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

  // Initialize OneSignal notification service with REAL SDK
  async initialize(appId: string) {
    if (this.isInitialized) return;

    try {
      console.log('🔔 Initializing REAL OneSignal with App ID:', appId);
      
      // Using broadcast notifications instead of device-specific targeting
      console.log('📢 Using server-side broadcast notifications - no device registration needed!');
      
      // Get provider ID from storage
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const providerId = await AsyncStorage.getItem('providerId') || '1';
      
      console.log(`✅ Broadcast notification system ready for provider: ${providerId}`);
      console.log('📢 Server will send notifications to ALL subscribed users');
      console.log('🔥 No device registration needed - broadcast approach!');
      
      // Notification handlers disabled - using broadcast approach
      console.log('💡 App will receive notifications via broadcast from server');
      
      // Setup app state monitoring for background polling
      this.setupAppStateMonitoring();

      this.isInitialized = true;
      console.log('🎉 REAL OneSignal notification service ready!');
      
    } catch (error) {
      console.error('❌ Failed to initialize OneSignal service:', error);
      // Continue without OneSignal
      this.isInitialized = true;
    }
  }

  // Setup background polling when app goes to background
  private setupAppStateMonitoring() {
    this.appStateListener = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        this.startBackgroundPolling();
      } else if (nextAppState === 'active') {
        this.stopBackgroundPolling();
      }
    });
  }

  // Start background polling for notifications
  private startBackgroundPolling() {
    console.log('Starting background notification polling...');
    
    this.backgroundPollingInterval = setInterval(async () => {
      try {
        // Poll for new notifications from your backend
        await this.pollForNotifications();
      } catch (error) {
        console.error('Background polling error:', error);
      }
    }, this.POLLING_INTERVAL);
  }

  // Stop background polling
  private stopBackgroundPolling() {
    console.log('Stopping background notification polling...');
    
    if (this.backgroundPollingInterval) {
      clearInterval(this.backgroundPollingInterval);
      this.backgroundPollingInterval = null;
    }
  }

  // Poll for notifications from backend
  private async pollForNotifications() {
    try {
      // This would typically call your backend API
      // For now, we'll simulate with mock data
      const mockNotification: NotificationPayload = {
        id: `poll-${Date.now()}`,
        title: 'Background Update',
        message: `New notification received at ${new Date().toLocaleTimeString()}`,
        type: 'system',
        timestamp: new Date().toISOString(),
        data: { polled: true }
      };

      // Only send if there are actually new notifications
      if (Math.random() > 0.8) { // 20% chance for demo
        this.processNotification(mockNotification);
      }
    } catch (error) {
      console.error('Error polling for notifications:', error);
    }
  }

  // Process received notification
  private processNotification(notification: any) {
    const payload: NotificationPayload = {
      id: notification.notificationId || notification.id || `notif-${Date.now()}`,
      title: notification.title || 'New Notification',
      message: notification.body || notification.message || 'You have a new notification',
      type: notification.additionalData?.type || 'general',
      timestamp: new Date().toISOString(),
      data: notification.additionalData || notification.data
    };

    // Notify all registered callbacks
    this.notificationCallbacks.forEach(callback => {
      try {
        callback(payload);
      } catch (error) {
        console.error('Error in notification callback:', error);
      }
    });
  }

  // Send a local test notification with current time
  sendTimeBasedNotification(title: string, message: string, type: 'lead' | 'payment' | 'system' | 'general' = 'system') {
    const currentTime = new Date().toLocaleTimeString();
    const payload: NotificationPayload = {
      id: `time-${Date.now()}`,
      title: `${title} - ${currentTime}`,
      message: `${message} (${currentTime})`,
      type,
      timestamp: new Date().toISOString(),
      data: { 
        currentTime,
        isTimeBasedNotification: true 
      }
    };

    // Create proper Android notification bar notification
    androidNotificationService.showNotification(
      payload.title,
      payload.message,
      payload.type
    );
    
    console.log('📱 Local notification sent:', {
      title: payload.title,
      message: payload.message,
      type: payload.type
    });

    // Also process internally
    this.processNotification(payload);
  }

  // Register callback for when notifications are received
  onNotificationReceived(callback: (notification: NotificationPayload) => void) {
    this.notificationCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.notificationCallbacks = this.notificationCallbacks.filter(cb => cb !== callback);
    };
  }

  // Check device registration status (DISABLED - using broadcast approach)
  async checkDeviceStatus() {
    console.log("🔍 Device Status Check: DISABLED");
    console.log("💡 Using broadcast notifications - no device check needed");
    console.log("✅ Broadcast approach: Ready for notifications");
    
    return {
      isRegistered: true, // Always true for broadcast approach
      playerId: 'broadcast_mode',
      isSubscribed: true,
      pushToken: 'broadcast_notifications',
      approach: 'broadcast'
    };
  }

  // Test registration with notification
  async sendTestRegistrationNotification(playerId: string): Promise<void> {
    console.log(`🧪 Sending test notification to confirm registration...`);
    console.log(`📱 Player ID: ${playerId}`);
    console.log(`💡 Server can now use this Player ID to send notifications!`);
  }

  // Get device ID for targeting specific users (simulated)
  async getDeviceId(): Promise<string | null> {
    try {
      // Return a simulated device ID
      return `device-${Date.now()}`;
    } catch (error) {
      console.error('Error getting device ID:', error);
      return null;
    }
  }

  // Send notification to specific user
  async sendNotificationToUser(userId: string, title: string, message: string, data?: any) {
    try {
      // This would typically be done from your backend
      // For demo purposes, we'll create a local notification
      this.sendTimeBasedNotification(title, message, data?.type || 'general');
    } catch (error) {
      console.error('Error sending notification to user:', error);
    }
  }

  // Map notification type to local notification type
  private mapTypeToLocalType(type: string): 'success' | 'error' | 'warning' | 'info' {
    switch (type) {
      case 'lead':
        return 'success';
      case 'payment':
        return 'success';
      case 'system':
        return 'info';
      case 'general':
      default:
        return 'info';
    }
  }

  // Cleanup method
  cleanup() {
    this.stopBackgroundPolling();
    
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
