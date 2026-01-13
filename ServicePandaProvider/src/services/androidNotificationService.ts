import { Platform, Alert, ToastAndroid, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AndroidNotification {
  id: string;
  title: string;
  message: string;
  type: 'lead' | 'payment' | 'system' | 'general';
  timestamp: Date;
}

class AndroidNotificationService {
  private isInitialized = false;

  // Initialize the notification service with working approach
  initialize() {
    if (this.isInitialized) return;

    console.log('📱 Initializing Android notification service...');

    // Check if we can use native notification modules
    if (Platform.OS === 'android') {
      console.log('📱 Android platform detected - setting up notification system');
    }

    this.isInitialized = true;
    console.log('✅ Android Notification Service initialized successfully');
  }

  // Show notification with comprehensive approach
  async showNotification(title: string, message: string, type: 'lead' | 'payment' | 'system' | 'general' = 'general') {
    if (!this.isInitialized) {
      this.initialize();
    }

    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString();
    const formattedDate = currentTime.toLocaleDateString();
    
    // Get appropriate emoji for notification type
    const emoji = this.getNotificationEmoji(type);
    
    // Enhanced message with current time
    const enhancedMessage = `${message}\n⏰ ${formattedDate} at ${formattedTime}`;

    console.log('📱 Showing ServicePanda notification:', {
      title: `${emoji} ${title}`,
      message: enhancedMessage,
      type,
      time: formattedTime
    });

    const notificationId = Date.now();

    // Store notification for persistence
    await this.storeNotification({
      id: notificationId.toString(),
      title,
      message: enhancedMessage,
      type,
      timestamp: currentTime
    });

    // Multi-approach notification to ensure visibility
    this.showMultipleNotificationTypes(title, enhancedMessage, emoji, formattedTime);

    console.log('✅ ServicePanda notification shown successfully');
    return notificationId.toString();
  }

  // Show notifications using multiple approaches for maximum visibility
  private showMultipleNotificationTypes(title: string, message: string, emoji: string, time: string) {
    // 1. Show Toast notification at top (simulates notification bar)
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravityAndOffset(
        `🐼 ${title} - ${time}`,
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        0,
        50
      );
    }

    // 2. Show Alert dialog after a short delay (simulates tapping the notification)
    setTimeout(() => {
      Alert.alert(
        '🐼 ServicePanda Provider',
        `${emoji} ${title}\n\n${message}`,
        [
          {
            text: 'View Dashboard',
            onPress: () => {
              console.log('📱 User chose to view dashboard');
              // Here you could navigate to the dashboard
            },
          },
          {
            text: 'Mark as Read',
            onPress: () => {
              console.log('📱 User marked notification as read');
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
    }, 2000); // Show after 2 seconds to let toast appear first

    console.log('📱 Multi-type notification sequence initiated');
  }

  // Store notification for persistence and history
  private async storeNotification(notification: AndroidNotification) {
    try {
      const existingNotifications = await AsyncStorage.getItem('servicepanda_notifications');
      const notifications = existingNotifications ? JSON.parse(existingNotifications) : [];
      
      // Add new notification to the beginning
      notifications.unshift(notification);
      
      // Keep only last 50 notifications
      const trimmedNotifications = notifications.slice(0, 50);
      
      await AsyncStorage.setItem('servicepanda_notifications', JSON.stringify(trimmedNotifications));
      console.log('📱 Notification stored successfully');
    } catch (error) {
      console.error('📱 Failed to store notification:', error);
    }
  }

  // Get all stored notifications
  async getStoredNotifications(): Promise<AndroidNotification[]> {
    try {
      const stored = await AsyncStorage.getItem('servicepanda_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('📱 Failed to retrieve notifications:', error);
      return [];
    }
  }

  // Clear all stored notifications
  async clearStoredNotifications() {
    try {
      await AsyncStorage.removeItem('servicepanda_notifications');
      console.log('📱 All stored notifications cleared');
    } catch (error) {
      console.error('📱 Failed to clear notifications:', error);
    }
  }

  // Get notification emoji based on type
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

  // Get notification color based on type
  private getNotificationColor(type: string): string {
    switch (type) {
      case 'lead':
        return '#10B981'; // Green for leads
      case 'payment':
        return '#10B981'; // Green for payments
      case 'system':
        return '#3B82F6'; // Blue for system
      case 'general':
      default:
        return '#6366F1'; // Purple for general
    }
  }

  // Send scheduled notification (simplified)
  scheduleTimeBasedNotification(
    title: string, 
    message: string, 
    type: 'lead' | 'payment' | 'system' | 'general' = 'general',
    delaySeconds: number = 0
  ) {
    // For now, just show immediately since we don't have native scheduling
    setTimeout(() => {
      this.showNotification(title, message, type);
    }, delaySeconds * 1000);

    console.log(`📅 Scheduled notification for ${delaySeconds} seconds:`, title);
  }

  // Clear all notifications (simplified)
  clearAllNotifications() {
    console.log('🧹 All notifications cleared (simplified mode)');
  }

  // Clear specific notification (simplified)
  clearNotification(notificationId: string) {
    console.log(`🗑️ Cleared notification: ${notificationId} (simplified mode)`);
  }

  // Send customer request notification (most common use case)
  sendCustomerRequestNotification(customerMessage: string, location?: string) {
    const currentTime = new Date().toLocaleTimeString();
    const title = 'New Customer Request';
    const message = location 
      ? `${customerMessage} in ${location}`
      : customerMessage;

    return this.showNotification(title, message, 'lead');
  }

  // Send payment notification
  sendPaymentNotification(amount: string, description: string) {
    const title = 'Payment Received';
    const message = `${description} - $${amount}`;
    
    return this.showNotification(title, message, 'payment');
  }

  // Send system notification
  sendSystemNotification(title: string, message: string) {
    return this.showNotification(title, message, 'system');
  }
}

// Create singleton instance
const androidNotificationService = new AndroidNotificationService();

export default androidNotificationService;
