import { Alert, Platform } from 'react-native';

interface SimpleNotification {
  id: string;
  title: string;
  message: string;
  type: 'lead' | 'payment' | 'system' | 'general';
  timestamp: string;
}

class SimpleNotificationService {
  private notifications: SimpleNotification[] = [];
  private isInitialized = false;

  initialize() {
    if (this.isInitialized) return;
    
    console.log('📱 Initializing Simple Notification Service...');
    this.isInitialized = true;
    console.log('✅ Simple Notification Service initialized');
  }

  // Show notification that simulates Android notification bar experience
  async showNotification(title: string, message: string, type: 'lead' | 'payment' | 'system' | 'general' = 'general') {
    if (!this.isInitialized) {
      this.initialize();
    }

    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString();
    const formattedDate = currentTime.toLocaleDateString();
    
    const emoji = this.getNotificationEmoji(type);
    const enhancedMessage = `${message}\n\n⏰ Received: ${formattedDate} at ${formattedTime}`;

    // Store notification
    const notification: SimpleNotification = {
      id: Date.now().toString(),
      title,
      message: enhancedMessage,
      type,
      timestamp: currentTime.toISOString()
    };

    this.notifications.unshift(notification);

    console.log('📱 Showing ServicePanda notification:', {
      title: `${emoji} ${title}`,
      message: enhancedMessage,
      type,
      time: formattedTime
    });

    // Simulate Android notification behavior
    return this.simulateAndroidNotification(title, enhancedMessage, emoji);
  }

  private async simulateAndroidNotification(title: string, message: string, emoji: string): Promise<string> {
    return new Promise((resolve) => {
      // Show notification-style alert immediately
      Alert.alert(
        `🐼 ServicePanda Provider`,
        `${emoji} ${title}\n\n${message}`,
        [
          {
            text: 'Open App',
            onPress: () => {
              console.log('📱 User opened app from notification');
              resolve('opened');
            },
          },
          {
            text: 'View Details',
            onPress: () => {
              console.log('📱 User tapped View Details');
              resolve('viewed');
            },
          },
          {
            text: 'Dismiss',
            style: 'cancel',
            onPress: () => {
              console.log('📱 User dismissed notification');
              resolve('dismissed');
            },
          },
        ],
        { 
          cancelable: true,
          onDismiss: () => {
            console.log('📱 Notification auto-dismissed');
            resolve('auto-dismissed');
          }
        }
      );
    });
  }

  private getNotificationEmoji(type: string): string {
    switch (type) {
      case 'lead':
        return '🎯';
      case 'payment':
        return '💰';
      case 'system':
        return '⚙️';
      case 'general':
      default:
        return '🔔';
    }
  }

  // Customer request notification
  sendCustomerRequestNotification(customerMessage: string, location?: string) {
    const title = 'New Customer Request';
    const message = location 
      ? `${customerMessage} in ${location}`
      : customerMessage;

    return this.showNotification(title, message, 'lead');
  }

  // Payment notification
  sendPaymentNotification(amount: string, description: string) {
    const title = 'Payment Received';
    const message = `${description} - $${amount}`;
    
    return this.showNotification(title, message, 'payment');
  }

  // System notification
  sendSystemNotification(title: string, message: string) {
    return this.showNotification(title, message, 'system');
  }

  // Get all notifications
  getAllNotifications(): SimpleNotification[] {
    return [...this.notifications];
  }

  // Get unread notifications count
  getUnreadCount(): number {
    return this.notifications.length;
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    console.log('📱 All notifications cleared');
  }

  // For real Android system notifications, you would need:
  // 1. Properly configured react-native-push-notification with auto-linking
  // 2. OR use Expo with expo-notifications
  // 3. OR create custom native Android module
  // 4. OR use Firebase Cloud Messaging (FCM)
  
  // This service provides immediate working notifications that simulate
  // the Android notification experience until proper setup is completed
}

// Create singleton instance
const simpleNotificationService = new SimpleNotificationService();

export default simpleNotificationService;
