import { Alert } from 'react-native';

interface LocalNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
}

class LocalNotificationService {
  private pendingNotifications: LocalNotification[] = [];
  private isShowingNotification = false;

  // Show a notification using React Native Alert (works without native linking)
  showNotification(title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    const notification: LocalNotification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date()
    };

    console.log('📱 Local Notification:', notification);

    // Add to queue
    this.pendingNotifications.push(notification);

    // Process queue immediately to show in dashboard
    this.processNotificationQueue();
  }

  private async processNotificationQueue() {
    if (this.isShowingNotification || this.pendingNotifications.length === 0) {
      return;
    }

    this.isShowingNotification = true;
    const notification = this.pendingNotifications.shift()!;

    // Get emoji based on type
    const emoji = this.getEmojiForType(notification.type);
    const currentTime = notification.timestamp.toLocaleTimeString();

    // Show using Alert (works without native dependencies)
    Alert.alert(
      `${emoji} ${notification.title}`,
      `${notification.message}\n\nReceived at: ${currentTime}`,
      [
        {
          text: 'OK',
          onPress: () => {
            this.isShowingNotification = false;
            // Process next notification after a delay
            setTimeout(() => this.processNotificationQueue(), 500);
          }
        }
      ],
      { cancelable: false }
    );
  }

  private getEmojiForType(type: string): string {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return '🔔';
    }
  }

  // Clear all pending notifications
  clearPendingNotifications() {
    this.pendingNotifications = [];
  }

  // Get pending notification count
  getPendingCount(): number {
    return this.pendingNotifications.length;
  }
}

// Create singleton instance
const localNotificationService = new LocalNotificationService();

export default localNotificationService;
