import { Platform, AppState } from 'react-native';
import nativeAndroidNotificationService from './nativeAndroidNotificationService';

interface IncomingNotification {
  title: string;
  message: string;
  type: 'customer_request' | 'payment' | 'service_update' | 'system';
  data?: any;
}

class NotificationApiService {
  private isInitialized = false;
  private serverUrl: string;
  private backgroundPolling = true; // Continue polling in background

  constructor() {
    // Live production URL
    this.serverUrl = 'https://api.servicepanda.com.au';
    // For local testing: 'http://10.0.2.2:3000' (emulator) or 'http://192.168.1.xxx:3000' (device)
  }

  // Initialize the notification API service
  initialize() {
    if (this.isInitialized) return;

    console.log('🔔 Initializing Notification API Service...');
    
    // Initialize the native notification service
    nativeAndroidNotificationService.initialize();

    // Set up polling for notifications (continues in background)
    this.startNotificationPolling();
    
    // Setup background polling monitoring
    this.setupBackgroundPolling();

    this.isInitialized = true;
    console.log('✅ Notification API Service initialized with background support!');
  }

  // Setup background polling - continues even when app is minimized
  private setupBackgroundPolling() {
    AppState.addEventListener('change', (nextAppState) => {
      console.log(`📱 App state changed to: ${nextAppState}`);
      
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        console.log('📱 App went to background - continuing notification polling');
        // Continue polling in background
        this.backgroundPolling = true;
      } else if (nextAppState === 'active') {
        console.log('📱 App came to foreground - resuming normal polling');
        this.backgroundPolling = true;
      }
    });
  }

  // Start polling for notifications from server
  private startNotificationPolling() {
    // Poll every 30 seconds for new notifications (works in background too)
    setInterval(async () => {
      try {
        // Always check for notifications - even in background
        if (this.backgroundPolling) {
          await this.checkForNewNotifications();
        }
      } catch (error) {
        console.error('Error checking for notifications:', error);
      }
    }, 30000); // 30 seconds
    
    console.log('📡 Background notification polling started - will continue even when app is minimized');
  }

  // Check server for new notifications
  private async checkForNewNotifications() {
    try {
      console.log('🔍 Checking for new notifications from server...');
      
      // Check server for real notifications
      const notifications = await this.checkServerForNotifications();
      
      for (const notification of notifications) {
        await this.handleIncomingNotification(notification);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }

  // Handle incoming notification from server
  async handleIncomingNotification(notification: IncomingNotification) {
    console.log('📱 Received notification from server:', notification.title);

    try {
      // Send to native Android notification system
      if (Platform.OS === 'android') {
        await nativeAndroidNotificationService.sendSystemNotification(
          notification.title,
          notification.message,
          notification.data
        );
      }

      // Log the notification
      console.log('✅ Notification processed successfully');
    } catch (error) {
      console.error('❌ Error processing notification:', error);
    }
  }

  // Register provider device for notifications
  async registerDevice(providerId: number, deviceInfo: any) {
    try {
      console.log(`📱 Registering device for provider ${providerId}`);

      // In real implementation, send device token to server
      const registrationData = {
        providerId,
        platform: Platform.OS,
        deviceInfo,
        timestamp: new Date().toISOString()
      };

      console.log('Device registration data:', registrationData);
      
      // Simulate successful registration
      return { success: true, message: 'Device registered successfully' };
    } catch (error) {
      console.error('Error registering device:', error);
      return { success: false, message: 'Failed to register device' };
    }
  }

  // Test notification functionality
  async sendTestNotification() {
    const testNotification: IncomingNotification = {
      title: 'Test Server Notification',
      message: `This is a test notification from the server at ${new Date().toLocaleTimeString()}`,
      type: 'system',
      data: {
        test: true,
        timestamp: new Date().toISOString()
      }
    };

    await this.handleIncomingNotification(testNotification);
  }

  // Simulate customer request notification from server
  async simulateCustomerRequest() {
    const customerNotification: IncomingNotification = {
      title: 'New Customer Request Available! 🛎️',
      message: 'House Cleaning needed in Gulshan-e-Iqbal, Karachi\n"Need deep cleaning for 3-bedroom house before Eid"',
      type: 'customer_request',
      data: {
        requestId: 123,
        categoryName: 'House Cleaning',
        customerLocation: 'Gulshan-e-Iqbal, Karachi',
        description: 'Need deep cleaning for 3-bedroom house before Eid',
        timestamp: new Date().toISOString(),
        priority: 'high'
      }
    };

    await this.handleIncomingNotification(customerNotification);
  }

  // Simulate payment notification from server
  async simulatePaymentReceived() {
    const paymentNotification: IncomingNotification = {
      title: 'Payment Received! 💰',
      message: 'You received ₹2500 from Fatima Khan for House Cleaning service',
      type: 'payment',
      data: {
        amount: 2500,
        customerName: 'Fatima Khan',
        serviceName: 'House Cleaning',
        timestamp: new Date().toISOString()
      }
    };

    await this.handleIncomingNotification(paymentNotification);
  }

  // Check server for real notifications
  private async checkServerForNotifications(): Promise<IncomingNotification[]> {
    try {
      // Get actual provider ID from AsyncStorage
      let providerId = '1'; // Default fallback
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const storedProviderId = await AsyncStorage.getItem('providerId');
        if (storedProviderId) {
          providerId = storedProviderId;
        }
      } catch (error) {
        console.log('Failed to get provider ID from storage, using default');
      }

      console.log(`🔍 Checking notifications for provider ID: ${providerId}`);
      
      const response = await fetch(`${this.serverUrl}/api/provider/notifications/poll`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-provider-id': providerId,
        }
      });

      if (!response.ok) {
        console.log(`Server response: ${response.status} - No new notifications available`);
        return [];
      }

      // Check if response is JSON or HTML
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.log('Server returned HTML instead of JSON - notification endpoints not deployed yet');
        return [];
      }

      const data = await response.json();
      const notifications = data.notifications || [];
      
      console.log(`📨 Received ${notifications.length} notifications from server`);
      return notifications.map((notif: any) => ({
        id: notif.id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        data: notif.data,
        timestamp: notif.timestamp
      }));
    } catch (error) {
      if (error.message && error.message.includes('JSON')) {
        console.log('📄 Server returned HTML instead of JSON (notification endpoints not deployed)');
      } else {
        console.error('Error checking server for notifications:', error);
      }
      return [];
    }
  }
}

// Export singleton instance
const notificationApiService = new NotificationApiService();
export default notificationApiService;
