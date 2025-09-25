// import OneSignal from 'react-native-onesignal'; // Commented out to avoid native linking issues
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

  // Initialize notification service (without OneSignal for now)
  async initialize(appId: string) {
    if (this.isInitialized) return;

    try {
      console.log('Initializing notification service with App ID:', appId);
      
      // Initialize Android notification service
      androidNotificationService.initialize();
      
      // Setup app state monitoring for background polling
      this.setupAppStateMonitoring();

      this.isInitialized = true;
      console.log('Notification service initialized successfully');
      
      // Send a welcome notification to test the system
      setTimeout(() => {
        this.sendTimeBasedNotification(
          'ServicePanda Provider Ready',
          'Real-time customer notifications are now active!',
          'system'
        );
      }, 3000);
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
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
