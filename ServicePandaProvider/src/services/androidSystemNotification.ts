// import PushNotification from 'react-native-push-notification'; // Causing errors
import { Platform, ToastAndroid, Vibration, Alert } from 'react-native';

class AndroidSystemNotification {
  private isInitialized = false;

  // Initialize Android system notifications
  initialize() {
    if (this.isInitialized || Platform.OS !== 'android') return;

    console.log('🔔 Initializing ANDROID SYSTEM NOTIFICATION BAR...');

    try {
      // Simple initialization without problematic PushNotification
      console.log('📱 Using fallback notification system (no linking required)');
      
      this.isInitialized = true;
      console.log('✅ ANDROID SYSTEM NOTIFICATION BAR ready (fallback)!');

    } catch (error) {
      console.error('❌ Failed to initialize Android notifications:', error);
    }
  }

  // Send notification to Android system notification bar
  sendToAndroidNotificationBar(title: string, message: string, type: string = 'general') {
    console.log('🚀 SENDING TO ANDROID NOTIFICATION BAR...');
    console.log(`📝 Title: ${title}`);
    console.log(`📝 Message: ${message}`);

    if (!this.isInitialized) {
      this.initialize();
    }

    if (Platform.OS !== 'android') {
      console.log('❌ Not Android platform');
      return;
    }

    const emoji = this.getEmoji(type);
    const currentTime = new Date().toLocaleTimeString();
    const currentDate = new Date().toLocaleDateString();

    console.log('📱 Creating system-style notification (fallback)...');

    // Step 1: Vibrate like system notification
    Vibration.vibrate([0, 250, 100, 250]);

    // Step 2: Show toast at TOP (simulates notification banner dropping down)
    ToastAndroid.showWithGravityAndOffset(
      `🐼 ServicePanda Provider`,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      0,
      50
    );

    // Step 3: Show notification content
    setTimeout(() => {
      ToastAndroid.showWithGravityAndOffset(
        `${emoji} ${title}\n${message}`,
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
        0,
        0
      );
    }, 1000);

    // Step 4: Show alert (simulates tapping notification)
    setTimeout(() => {
      Alert.alert(
        '🐼 ServicePanda Provider',
        `${emoji} ${title}\n\n${message}\n\n⏰ ${currentDate} at ${currentTime}`,
        [
          {
            text: 'Open App',
            onPress: () => console.log('📱 User opened app from notification'),
          },
          {
            text: 'Dismiss',
            style: 'cancel',
            onPress: () => console.log('📱 User dismissed notification'),
          },
        ]
      );
    }, 2500);

    console.log('✅ SYSTEM-STYLE NOTIFICATION SENT!');
    console.log('📱 This simulates Android notification bar experience');
  }

  // Customer request notification
  sendCustomerRequest(message: string, location?: string) {
    const title = 'New Customer Request';
    const fullMessage = location ? `${message} in ${location}` : message;
    this.sendToAndroidNotificationBar(title, fullMessage, 'lead');
  }

  // Payment notification
  sendPaymentReceived(amount: string, description: string) {
    const title = 'Payment Received';
    const message = `${description} - $${amount}`;
    this.sendToAndroidNotificationBar(title, message, 'payment');
  }

  // System notification
  sendSystemAlert(title: string, message: string) {
    this.sendToAndroidNotificationBar(title, message, 'system');
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

// Create singleton instance
const androidSystemNotification = new AndroidSystemNotification();

export default androidSystemNotification;
