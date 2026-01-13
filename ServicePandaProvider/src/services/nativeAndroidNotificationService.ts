import { NativeModules, Platform, ToastAndroid } from 'react-native';

class NativeAndroidNotificationService {
  private isInitialized = false;

  // Initialize notification service
  initialize() {
    if (this.isInitialized || Platform.OS !== 'android') {
      console.log('❌ Not Android or already initialized');
      return;
    }

    console.log('🔔 Initializing Native Android Notification Service...');
    this.isInitialized = true;
    console.log('✅ Native Android Notification Service ready!');
  }

  // Send notification to Android system
  async sendSystemNotification(title: string, message: string, data?: any) {
    if (!this.isInitialized) {
      this.initialize();
    }

    if (Platform.OS !== 'android') {
      console.log('❌ Not Android platform');
      return;
    }

    console.log('🔔 Sending native Android notification...');

    try {
      // Method 1: Try using native Android notification module if available
      if (NativeModules.AndroidNotificationModule) {
        console.log('📱 Using custom native Android notification module');
        const result = await NativeModules.AndroidNotificationModule.showNotification({
          title: `🐼 ${title}`,
          message: message,
          type: 'notification',
          timestamp: Date.now(),
          data: data || {}
        });
        console.log('✅ Native notification result:', result);
        return;
      }

      // Method 2: Fallback - Create visible notification using multiple methods
      this.createVisibleNotification(title, message);

    } catch (error) {
      console.error('❌ Error sending native notification:', error);
      // Final fallback
      this.createVisibleNotification(title, message);
    }
  }

  // Create visible notification using available React Native methods
  private createVisibleNotification(title: string, message: string) {
    const notificationText = `🐼 ${title}`;
    const fullMessage = `${message}`;

    // Toast notification (shows immediately)
    ToastAndroid.showWithGravityAndOffset(
      `${notificationText}\n${fullMessage}`,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      0,
      100
    );

    console.log('✅ Visible notification created!');
  }

  // Send customer request notification
  sendCustomerRequest(customerName: string, service: string, location: string) {
    const title = 'New Customer Request 🛎️';
    const message = `${customerName} needs ${service}\n📍 ${location}`;
    
    this.sendSystemNotification(title, message, {
      type: 'customer_request',
      customerName,
      service,
      location,
      timestamp: new Date().toISOString(),
    });
  }

  // Send payment notification
  sendPaymentReceived(amount: number, customerName: string) {
    const title = 'Payment Received 💰';
    const message = `₹${amount} received from ${customerName}`;
    
    this.sendSystemNotification(title, message, {
      type: 'payment',
      amount,
      customerName,
      timestamp: new Date().toISOString(),
    });
  }

  // Send test notification
  sendTestNotification() {
    const currentTime = new Date().toLocaleTimeString();
    const title = 'Test Notification ✅';
    const message = `This notification was sent at ${currentTime}`;
    
    this.sendSystemNotification(title, message, {
      type: 'test',
      timestamp: new Date().toISOString(),
    });
  }

  // Send service update
  sendServiceUpdate(status: string, details: string) {
    const title = 'Service Update 🔄';
    const message = `${status}\n${details}`;
    
    this.sendSystemNotification(title, message, {
      type: 'service_update',
      status,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  // Clear notifications (placeholder)
  clearAllNotifications() {
    console.log('🔔 Notifications cleared (visible ones will auto-dismiss)');
  }

  // Check permissions (placeholder)
  checkPermissions() {
    const permissions = {
      alert: true,
      badge: true,
      sound: true,
      notification: Platform.OS === 'android',
    };
    console.log('📱 Native notification permissions:', permissions);
    return permissions;
  }
}

// Export singleton instance
const nativeAndroidNotificationService = new NativeAndroidNotificationService();
export default nativeAndroidNotificationService;
