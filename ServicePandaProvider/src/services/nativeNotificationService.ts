import { NativeModules, Platform } from 'react-native';

interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'lead' | 'payment' | 'system' | 'general';
  timestamp: string;
}

class NativeNotificationService {
  private isInitialized = false;

  // Initialize the service
  initialize() {
    if (this.isInitialized) return;
    
    console.log('📱 Initializing Native Notification Service for Android system notifications');
    this.isInitialized = true;
  }

  // Show notification in Android system notification panel
  showSystemNotification(title: string, message: string, type: 'lead' | 'payment' | 'system' | 'general' = 'general') {
    if (!this.isInitialized) {
      this.initialize();
    }

    if (Platform.OS !== 'android') {
      console.log('📱 System notifications only supported on Android');
      return;
    }

    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString();
    const formattedDate = currentTime.toLocaleDateString();
    
    // Enhanced message with current time
    const enhancedMessage = `${message}\n\n⏰ ${formattedDate} at ${formattedTime}`;
    const emoji = this.getNotificationEmoji(type);

    console.log('📱 Attempting to show Android system notification:', {
      title: `${emoji} ${title}`,
      message: enhancedMessage,
      type,
      time: formattedTime
    });

    // Use our custom native Android notification module
    try {
      if (NativeModules.NotificationModule) {
        console.log('📱 Using native Android notification module');
        NativeModules.NotificationModule.showNotification({
          title: title,
          message: message,
          sound: true,
          vibrate: true,
        });
        console.log('✅ Android system notification sent successfully');
      } else {
        console.log('⚠️ Native notification module not available, using fallback');
        this.createFallbackNotification(title, enhancedMessage, emoji);
      }
    } catch (error) {
      console.error('📱 Error showing system notification:', error);
      this.createFallbackNotification(title, enhancedMessage, emoji);
    }
  }

  // Fallback method to create notification-like experience
  private createFallbackNotification(title: string, message: string, emoji: string) {
    // Since we can't directly access Android notification system without proper setup,
    // let's create a simulation that looks like system notifications
    console.log('📱 Using fallback notification method');
    
    // This would typically require native Android code or Expo
    // For now, we'll log what the notification would look like
    console.log(`
📱 ANDROID SYSTEM NOTIFICATION SIMULATION:
┌─────────────────────────────────────────┐
│ 🐼 ServicePanda Provider    ${new Date().toLocaleTimeString()} │
│ ${emoji} ${title}                              │
│ ${message}                              │
└─────────────────────────────────────────┘
    `);
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

  // Send customer request notification to system tray
  sendCustomerRequestToSystemTray(customerMessage: string, location?: string) {
    const title = 'New Customer Request';
    const message = location 
      ? `${customerMessage} in ${location}`
      : customerMessage;

    this.showSystemNotification(title, message, 'lead');
  }

  // Send payment notification to system tray
  sendPaymentToSystemTray(amount: string, description: string) {
    const title = 'Payment Received';
    const message = `${description} - $${amount}`;
    
    this.showSystemNotification(title, message, 'payment');
  }

  // Send system notification to system tray
  sendSystemToSystemTray(title: string, message: string) {
    this.showSystemNotification(title, message, 'system');
  }
}

// Create singleton instance
const nativeNotificationService = new NativeNotificationService();

export default nativeNotificationService;
