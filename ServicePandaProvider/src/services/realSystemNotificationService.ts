import PushNotification from 'react-native-push-notification';
import { Platform, PermissionsAndroid } from 'react-native';

class RealSystemNotificationService {
  private isInitialized = false;

  // Initialize the notification service for REAL system notifications
  async initialize() {
    if (this.isInitialized || Platform.OS !== 'android') {
      console.log('❌ Not Android or already initialized');
      return;
    }

    console.log('🔔 Initializing REAL Android System Notification Service...');

    try {
      // Request notification permission for Android 13+
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        console.log('📱 POST_NOTIFICATIONS permission:', granted);
      }

      // Configure PushNotification for REAL system notifications
      PushNotification.configure({
        // Called when token is generated
        onRegister: function (token) {
          console.log('📱 NOTIFICATION TOKEN:', token);
        },

        // Called when notification is received (when app is open)
        onNotification: function (notification) {
          console.log('📱 NOTIFICATION RECEIVED:', notification);
          
          // Handle notification tap
          if (notification.userInteraction) {
            console.log('📱 User tapped notification');
          }
        },

        // Called when there's an error
        onRegistrationError: function (err) {
          console.error('📱 NOTIFICATION REGISTRATION ERROR:', err);
        },

        // Permissions
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },

        // Don't pop initial notification to avoid errors
        popInitialNotification: false,
        
        // Request permissions (Android doesn't need this but keep for compatibility)
        requestPermissions: Platform.OS === 'ios',
      });

      // Create notification channel for Android (REQUIRED for system notifications)
      PushNotification.createChannel(
        {
          channelId: 'servicepanda-system', // UNIQUE channel ID
          channelName: 'ServicePanda Notifications', 
          channelDescription: 'Customer requests, payments, and updates',
          importance: 4, // HIGH importance for system notifications
          vibrate: true,
          vibration: 300,
          playSound: true,
          soundName: 'default',
        },
        (created) => {
          console.log(`📱 Notification channel created: ${created}`);
        }
      );

      this.isInitialized = true;
      console.log('✅ REAL Android System Notification Service ready!');
      
    } catch (error) {
      console.error('❌ Error initializing system notifications:', error);
    }
  }

  // Send REAL system notification to Android notification bar
  sendSystemNotification(title: string, message: string, data?: any) {
    if (!this.isInitialized) {
      this.initialize();
    }

    if (Platform.OS !== 'android') {
      console.log('❌ Not Android platform');
      return;
    }

    console.log('🔔 Sending REAL system notification...');

    try {
      const notificationId = Math.floor(Math.random() * 1000000);
      
      PushNotification.localNotification({
        /* Required for system notification bar */
        channelId: 'servicepanda-system',
        id: notificationId,
        title: title,
        message: message,
        
        /* Android system notification properties */
        ticker: '🐼 ServicePanda Provider',
        showWhen: true,
        autoCancel: true,
        largeIcon: 'ic_launcher',
        smallIcon: 'ic_notification',
        bigText: message,
        subText: 'ServicePanda Provider',
        
        /* Appearance */
        color: '#3B82F6',
        priority: 'high',
        visibility: 'public',
        importance: 'high',
        
        /* Behavior */
        vibrate: true,
        vibration: 300,
        playSound: true,
        soundName: 'default',
        
        /* Make sure it shows in notification bar */
        ignoreInForeground: false, // Show even when app is open
        invokeApp: true,
        
        /* Actions */
        actions: ['View', 'Dismiss'],
        
        /* Data */
        userInfo: data || {
          type: 'notification',
          timestamp: new Date().toISOString(),
        },
        
        /* Time */
        when: Date.now(),
        usesChronometer: false,
        timeoutAfter: null,
        
        /* Additional */
        number: 1,
        onlyAlertOnce: false,
      });

      console.log(`✅ REAL system notification sent! ID: ${notificationId}`);
      
    } catch (error) {
      console.error('❌ Error sending system notification:', error);
    }
  }

  // Send customer request notification (like Zomato order)
  sendCustomerRequest(customerName: string, service: string, location: string) {
    const title = 'New Customer Request 🛎️';
    const message = `${customerName} needs ${service}\n📍 ${location}`;
    
    this.sendSystemNotification(title, message, {
      type: 'customer_request',
      customerName,
      service,
      location,
      timestamp: new Date().toISOString(),
      priority: 'high',
    });
  }

  // Send payment notification (like banking app)
  sendPaymentReceived(amount: number, customerName: string) {
    const title = 'Payment Received 💰';
    const message = `₹${amount} received from ${customerName}`;
    
    this.sendSystemNotification(title, message, {
      type: 'payment',
      amount,
      customerName,
      timestamp: new Date().toISOString(),
      priority: 'high',
    });
  }

  // Send service update (like delivery apps)
  sendServiceUpdate(status: string, details: string) {
    const title = 'Service Update 🔄';
    const message = `${status}\n${details}`;
    
    this.sendSystemNotification(title, message, {
      type: 'service_update',
      status,
      details,
      timestamp: new Date().toISOString(),
      priority: 'normal',
    });
  }

  // Send test notification (to verify system notifications work)
  sendTestSystemNotification() {
    const currentTime = new Date().toLocaleTimeString();
    const title = 'Test System Notification ✅';
    const message = `This should appear in your notification bar!\nSent at: ${currentTime}`;
    
    this.sendSystemNotification(title, message, {
      type: 'test',
      timestamp: new Date().toISOString(),
      priority: 'normal',
    });
  }

  // Clear all notifications
  clearAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
    console.log('🔔 All system notifications cleared');
  }

  // Cancel specific notification
  cancelNotification(notificationId: number) {
    PushNotification.cancelLocalNotification(notificationId.toString());
    console.log(`🔔 Notification ${notificationId} cancelled`);
  }

  // Check notification permissions
  checkPermissions() {
    PushNotification.checkPermissions((permissions) => {
      console.log('📱 Current permissions:', permissions);
      return permissions;
    });
  }
}

// Export singleton instance
const realSystemNotificationService = new RealSystemNotificationService();
export default realSystemNotificationService;
