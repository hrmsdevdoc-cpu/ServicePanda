import { NativeModules, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

class AndroidSystemNotificationService {
  private isInitialized = false;

  initialize() {
    if (this.isInitialized || Platform.OS !== 'android') return;

    console.log('🔔 Initializing Android System Notification Bar Service...');

    // Configure push notifications for Android system bar
    PushNotification.configure({
      onRegister: function(token) {
        console.log('📱 Android notification token:', token);
      },
      
      onNotification: function(notification) {
        console.log('📱 System notification received:', notification);
      },

      onRegistrationError: function(err) {
        console.error('📱 Android notification registration error:', err);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: false, // Android doesn't need this
    });

    // Create notification channel for Android 8.0+
    PushNotification.createChannel(
      {
        channelId: 'servicepanda-notifications',
        channelName: 'ServicePanda Provider',
        channelDescription: 'Customer requests and payments',
        playSound: true,
        soundName: 'default',
        importance: 4, // High importance
        vibrate: true,
      },
      (created) => {
        console.log(`📱 Android notification channel created: ${created}`);
      }
    );

    this.isInitialized = true;
    console.log('✅ Android System Notification Bar Service ready!');
  }

  // Send notification to Android notification bar (like Zomato, Facebook)
  sendToSystemNotificationBar(title: string, message: string, type: 'lead' | 'payment' | 'system' = 'lead') {
    if (!this.isInitialized) {
      this.initialize();
    }

    const emoji = this.getEmoji(type);
    const currentTime = new Date().toLocaleTimeString();
    
    console.log(`🔔 Sending to Android notification bar: ${title}`);

    // Send to Android system notification bar
    PushNotification.localNotification({
      channelId: 'servicepanda-notifications',
      title: `🐼 ServicePanda Provider`,
      message: `${emoji} ${title}\n${message}`,
      bigText: `${emoji} ${title}\n\n${message}\n\n⏰ Received at ${currentTime}`,
      subText: `ServicePanda • ${currentTime}`,
      
      // Android specific settings
      autoCancel: true,
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      color: this.getNotificationColor(type),
      vibrate: true,
      vibration: 300,
      priority: 'high',
      visibility: 'public',
      importance: 'high',
      
      // Make sure it appears in notification bar
      ignoreInForeground: false,
      invokeApp: true,
      
      // Actions
      actions: ['View', 'Dismiss'],
      
      // Data
      userInfo: {
        type: type,
        timestamp: new Date().toISOString(),
        source: 'ServicePanda'
      },
      
      // Sound and vibration
      playSound: true,
      soundName: 'default',
      number: 1,
    });

    console.log('✅ Notification sent to Android system notification bar!');
  }

  // Customer request notification
  sendCustomerRequest(message: string, location?: string) {
    const title = 'New Customer Request';
    const fullMessage = location ? `${message} in ${location}` : message;
    this.sendToSystemNotificationBar(title, fullMessage, 'lead');
  }

  // Payment notification  
  sendPaymentReceived(amount: string, description: string) {
    const title = 'Payment Received';
    const message = `${description} - $${amount}`;
    this.sendToSystemNotificationBar(title, message, 'payment');
  }

  // System notification
  sendSystemAlert(title: string, message: string) {
    this.sendToSystemNotificationBar(title, message, 'system');
  }

  private getEmoji(type: string): string {
    switch (type) {
      case 'lead': return '🎯';
      case 'payment': return '💰';
      case 'system': return '⚙️';
      default: return '🔔';
    }
  }

  private getNotificationColor(type: string): string {
    switch (type) {
      case 'lead': return '#FF6B35';
      case 'payment': return '#00C853';
      case 'system': return '#2196F3';
      default: return '#FF9800';
    }
  }
}

const androidSystemNotificationService = new AndroidSystemNotificationService();

export default androidSystemNotificationService;
