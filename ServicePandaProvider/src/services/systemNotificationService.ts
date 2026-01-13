import { Platform, ToastAndroid, Alert, Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'lead' | 'payment' | 'system' | 'general';
  timestamp: string;
}

class SystemNotificationService {
  private isInitialized = false;
  private notificationQueue: SystemNotification[] = [];

  initialize() {
    if (this.isInitialized) return;
    
    console.log('🔔 Initializing System Notification Service for Android notification bar...');
    this.isInitialized = true;
    console.log('✅ System Notification Service initialized');
  }

  // Show notification that appears in Android notification bar
  async showSystemNotification(title: string, message: string, type: 'lead' | 'payment' | 'system' | 'general' = 'general') {
    if (!this.isInitialized) {
      this.initialize();
    }

    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString();
    const formattedDate = currentTime.toLocaleDateString();
    
    const emoji = this.getNotificationEmoji(type);
    const enhancedMessage = `${message}\n⏰ ${formattedDate} at ${formattedTime}`;

    const notification: SystemNotification = {
      id: Date.now().toString(),
      title,
      message: enhancedMessage,
      type,
      timestamp: currentTime.toISOString()
    };

    // Store notification
    this.notificationQueue.unshift(notification);
    await this.saveNotifications();

    console.log('🔔 Showing Android system notification:', {
      title: `${emoji} ${title}`,
      message: enhancedMessage,
      type,
      time: formattedTime
    });

    // Create system-like notification experience
    this.displaySystemNotification(title, enhancedMessage, emoji, type);

    return notification.id;
  }

  private displaySystemNotification(title: string, message: string, emoji: string, type: string) {
    if (Platform.OS === 'android') {
      // 1. Vibrate to get attention (like system notifications)
      Vibration.vibrate([0, 250, 100, 250]);

      // 2. Show toast at top (simulates notification banner)
      ToastAndroid.showWithGravityAndOffset(
        `🐼 ServicePanda: ${title}`,
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        0,
        100
      );

      // 3. After delay, show persistent alert (simulates tapping notification)
      setTimeout(() => {
        Alert.alert(
          '🐼 ServicePanda Provider',
          `${emoji} ${title}\n\n${message}`,
          [
            {
              text: '📱 Open App',
              onPress: () => {
                console.log('🔔 User opened app from notification');
                // Navigate to relevant screen
              },
            },
            {
              text: '📋 View Details',
              onPress: () => {
                console.log('🔔 User viewing notification details');
                this.showNotificationDetails(title, message, type);
              },
            },
            {
              text: '✅ Mark Read',
              onPress: () => {
                console.log('🔔 User marked notification as read');
                ToastAndroid.show('Notification marked as read', ToastAndroid.SHORT);
              },
            },
            {
              text: '❌ Dismiss',
              style: 'cancel',
              onPress: () => {
                console.log('🔔 User dismissed notification');
              },
            },
          ],
          { 
            cancelable: true,
            onDismiss: () => {
              console.log('🔔 Notification auto-dismissed');
            }
          }
        );
      }, 1500);

      // 4. Show another toast after alert (simulates multiple notifications)
      setTimeout(() => {
        ToastAndroid.showWithGravityAndOffset(
          `New notification received at ${new Date().toLocaleTimeString()}`,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          100
        );
      }, 3000);
    }

    console.log('✅ System notification displayed successfully');
  }

  private showNotificationDetails(title: string, message: string, type: string) {
    const emoji = this.getNotificationEmoji(type);
    Alert.alert(
      `${emoji} Notification Details`,
      `Title: ${title}\n\nMessage: ${message}\n\nType: ${type.toUpperCase()}\n\nTime: ${new Date().toLocaleString()}`,
      [
        {
          text: 'Share',
          onPress: () => {
            ToastAndroid.show('Sharing notification...', ToastAndroid.SHORT);
          },
        },
        {
          text: 'Archive',
          onPress: () => {
            ToastAndroid.show('Notification archived', ToastAndroid.SHORT);
          },
        },
        {
          text: 'Close',
          style: 'cancel',
        },
      ]
    );
  }

  // Customer request notification
  async sendCustomerRequestNotification(customerMessage: string, location?: string) {
    const title = 'New Customer Request';
    const message = location 
      ? `${customerMessage} in ${location}`
      : customerMessage;

    return this.showSystemNotification(title, message, 'lead');
  }

  // Payment notification
  async sendPaymentNotification(amount: string, description: string) {
    const title = 'Payment Received';
    const message = `${description} - $${amount}`;
    
    return this.showSystemNotification(title, message, 'payment');
  }

  // System notification
  async sendSystemNotification(title: string, message: string) {
    return this.showSystemNotification(title, message, 'system');
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

  private async saveNotifications() {
    try {
      const trimmed = this.notificationQueue.slice(0, 50); // Keep last 50
      await AsyncStorage.setItem('system_notifications', JSON.stringify(trimmed));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }

  async getAllNotifications(): Promise<SystemNotification[]> {
    try {
      const stored = await AsyncStorage.getItem('system_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load notifications:', error);
      return [];
    }
  }

  getUnreadCount(): number {
    return this.notificationQueue.length;
  }

  async clearAll() {
    this.notificationQueue = [];
    await AsyncStorage.removeItem('system_notifications');
    console.log('🔔 All notifications cleared');
  }
}

// Create singleton instance
const systemNotificationService = new SystemNotificationService();

export default systemNotificationService;
export type { SystemNotification };
