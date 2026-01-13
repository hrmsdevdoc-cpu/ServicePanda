import { Platform, ToastAndroid, Alert } from 'react-native';

class SimpleAndroidNotificationService {
  private isInitialized = false;

  // Initialize the notification service
  initialize() {
    if (this.isInitialized || Platform.OS !== 'android') {
      console.log('❌ Not Android or already initialized');
      return;
    }

    console.log('🔔 Initializing Simple Android Notification Service...');

    try {
      // Simple initialization without problematic PushNotification
      this.isInitialized = true;
      console.log('✅ Simple Android Notification Service initialized!');
    } catch (error) {
      console.error('❌ Error initializing notification service:', error);
      this.isInitialized = false;
    }
  }

  // Send a notification using Toast (visible on screen)
  sendNotificationToBar(title: string, message: string, data?: any) {
    if (!this.isInitialized) {
      this.initialize();
    }

    if (Platform.OS !== 'android') {
      console.log('❌ Not Android platform');
      return;
    }

    console.log('🔔 Sending notification...');

    try {
      // Method 1: Toast notification (visible immediately)
      const notificationText = `🐼 ${title}\n${message}`;
      ToastAndroid.showWithGravityAndOffset(
        notificationText,
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        0,
        100
      );

      // Method 2: Alert notification (acts like notification tap)
      setTimeout(() => {
        Alert.alert(
          '🐼 ServicePanda Provider',
          `${title}\n\n${message}`,
          [
            {
              text: 'Open',
              onPress: () => {
                console.log('📱 User opened notification');
              },
            },
            {
              text: 'Dismiss',
              style: 'cancel',
              onPress: () => {
                console.log('📱 User dismissed notification');
              },
            },
          ],
          { 
            cancelable: true,
            onDismiss: () => {
              console.log('📱 Notification auto-dismissed');
            }
          }
        );
      }, 1000);

      console.log('✅ Notification sent successfully!');
    } catch (error) {
      console.error('❌ Error sending notification:', error);
      console.log('🔔 Fallback: Notification logged to console');
    }
  }

  // Send customer request notification
  sendCustomerRequestNotification(customerName: string, service: string, location: string) {
    const title = 'نیا کسٹمر درخواست!';
    const message = `${customerName} نے ${service} کے لیے درخواست کی ہے\n📍 ${location}`;
    
    this.sendNotificationToBar(title, message, {
      type: 'customer_request',
      customerName,
      service,
      location,
      timestamp: new Date().toISOString(),
    });
  }

  // Send payment received notification
  sendPaymentNotification(amount: number, customerName: string) {
    const title = 'Payment Received!';
    const message = `You received $${amount} from ${customerName}`;
    
    this.sendNotificationToBar(title, message, {
      type: 'payment',
      amount,
      customerName,
      timestamp: new Date().toISOString(),
    });
  }

  // Send test notification
  sendTestNotification() {
    const title = 'Test Notification';
    const message = `This is a test notification sent at ${new Date().toLocaleTimeString()}`;
    
    this.sendNotificationToBar(title, message, {
      type: 'test',
      timestamp: new Date().toISOString(),
    });
  }

  // Clear all notifications (placeholder)
  clearAllNotifications() {
    console.log('🔔 All notifications cleared (console only)');
  }

  // Check if notifications are enabled (placeholder)
  checkPermissions(callback: (permissions: any) => void) {
    const permissions = {
      alert: true,
      badge: true,
      sound: true,
    };
    console.log('📱 Checking notification permissions:', permissions);
    callback(permissions);
  }
}

// Export singleton instance
const simpleAndroidNotificationService = new SimpleAndroidNotificationService();
export default simpleAndroidNotificationService;
