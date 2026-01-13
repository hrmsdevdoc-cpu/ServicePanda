import { Platform, Alert, ToastAndroid, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WorkingNotification {
  id: string;
  title: string;
  message: string;
  type: 'lead' | 'payment' | 'system' | 'general';
  timestamp: string;
  isRead: boolean;
}

class WorkingNotificationService {
  private isInitialized = false;
  private notifications: WorkingNotification[] = [];

  // Initialize the notification service
  initialize() {
    if (this.isInitialized) return;

    console.log('📱 Initializing Working Notification Service...');

    // Load stored notifications
    this.loadStoredNotifications();

    this.isInitialized = true;
    console.log('✅ Working Notification Service initialized successfully');
  }

  // Show notification that appears prominently
  async showNotification(title: string, message: string, type: 'lead' | 'payment' | 'system' | 'general' = 'general') {
    if (!this.isInitialized) {
      this.initialize();
    }

    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString();
    const formattedDate = currentTime.toLocaleDateString();
    
    const emoji = this.getNotificationEmoji(type);
    const enhancedMessage = `${message}\n\n⏰ Received: ${formattedDate} at ${formattedTime}`;

    const notification: WorkingNotification = {
      id: Date.now().toString(),
      title,
      message: enhancedMessage,
      type,
      timestamp: currentTime.toISOString(),
      isRead: false
    };

    // Store notification
    this.notifications.unshift(notification);
    await this.saveNotifications();

    console.log('📱 Showing ServicePanda notification:', {
      title: `${emoji} ${title}`,
      message: enhancedMessage,
      type,
      time: formattedTime
    });

    // Show notification with immediate visibility
    this.displayNotificationToUser(title, enhancedMessage, emoji);

    return notification.id;
  }

  // Display notification to user with multiple methods for maximum visibility
  private displayNotificationToUser(title: string, message: string, emoji: string) {
    // Method 1: Toast at top of screen (immediate)
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravityAndOffset(
        `🐼 ${title}`,
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        0,
        50
      );
    }

    // Method 2: Alert dialog (acts like tapping notification)
    setTimeout(() => {
      Alert.alert(
        '🐼 ServicePanda Provider',
        `${emoji} ${title}\n\n${message}`,
        [
          {
            text: 'Open App',
            onPress: () => {
              console.log('📱 User opened app from notification');
              // Here you could navigate to relevant screen
            },
          },
          {
            text: 'View All',
            onPress: () => {
              console.log('📱 User wants to view all notifications');
              // Navigate to notifications screen
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
    }, 1500);

    console.log('✅ Notification displayed successfully');
  }

  // Customer request notification
  async sendCustomerRequestNotification(customerMessage: string, location?: string) {
    const title = 'New Customer Request';
    const message = location 
      ? `${customerMessage} in ${location}`
      : customerMessage;

    return this.showNotification(title, message, 'lead');
  }

  // Payment notification
  async sendPaymentNotification(amount: string, description: string) {
    const title = 'Payment Received';
    const message = `${description} - $${amount}`;
    
    return this.showNotification(title, message, 'payment');
  }

  // System notification
  async sendSystemNotification(title: string, message: string) {
    return this.showNotification(title, message, 'system');
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

  // Load stored notifications
  private async loadStoredNotifications() {
    try {
      const stored = await AsyncStorage.getItem('working_notifications');
      if (stored) {
        this.notifications = JSON.parse(stored);
        console.log(`📱 Loaded ${this.notifications.length} stored notifications`);
      }
    } catch (error) {
      console.error('📱 Failed to load stored notifications:', error);
      this.notifications = [];
    }
  }

  // Save notifications to storage
  private async saveNotifications() {
    try {
      // Keep only last 100 notifications
      const trimmed = this.notifications.slice(0, 100);
      await AsyncStorage.setItem('working_notifications', JSON.stringify(trimmed));
      console.log('📱 Notifications saved to storage');
    } catch (error) {
      console.error('📱 Failed to save notifications:', error);
    }
  }

  // Get all notifications
  getAllNotifications(): WorkingNotification[] {
    return [...this.notifications];
  }

  // Get unread notifications count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  // Mark notification as read
  async markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      await this.saveNotifications();
      console.log('📱 Notification marked as read');
    }
  }

  // Mark all notifications as read
  async markAllAsRead() {
    this.notifications.forEach(n => n.isRead = true);
    await this.saveNotifications();
    console.log('📱 All notifications marked as read');
  }

  // Clear all notifications
  async clearAll() {
    this.notifications = [];
    await AsyncStorage.removeItem('working_notifications');
    console.log('📱 All notifications cleared');
  }

  // Get notifications by type
  getNotificationsByType(type: string): WorkingNotification[] {
    return this.notifications.filter(n => n.type === type);
  }

  // NOTE: For actual Android system notifications (in notification bar),
  // you would need one of these solutions:
  // 1. Firebase Cloud Messaging (FCM) - for remote notifications
  // 2. react-native-push-notification with proper native linking
  // 3. @react-native-async-storage/async-storage + expo-notifications (if using Expo)
  // 4. Custom native Android module
  // 
  // This service provides immediate working notifications that simulate
  // the notification experience until proper system integration is set up.
}

// Create singleton instance
const workingNotificationService = new WorkingNotificationService();

export default workingNotificationService;
export type { WorkingNotification };
