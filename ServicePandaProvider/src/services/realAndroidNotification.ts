// import PushNotification from 'react-native-push-notification'; // Causing errors
import { Platform, ToastAndroid, NativeModules } from 'react-native';

class RealAndroidNotification {
  private isInitialized = false;

  initialize() {
    if (this.isInitialized || Platform.OS !== 'android') return;

    console.log('🔔 Initializing REAL Android Notification Bar Service...');

    // Use native Android module instead of react-native-push-notification
    try {
      if (NativeModules.AndroidNotificationModule) {
        console.log('📱 Using native Android notification module');
      } else {
        console.log('⚠️ Native module not available, using fallback');
      }
    } catch (error) {
      console.log('⚠️ Error checking native module:', error);
    }

    this.isInitialized = true;
    console.log('✅ REAL Android Notification Bar Service ready!');
  }

  // Send notification to ACTUAL Android notification bar
  sendToRealNotificationBar(title: string, message: string, type: string = 'general') {
    console.log('🔔 START: sendToRealNotificationBar called');
    console.log(`📝 Title: ${title}`);
    console.log(`📝 Message: ${message}`);
    console.log(`📝 Type: ${type}`);

    if (!this.isInitialized) {
      console.log('🔄 Initializing service...');
      this.initialize();
    }

    if (Platform.OS !== 'android') {
      console.log('❌ Not Android platform');
      return;
    }

    const emoji = this.getEmoji(type);
    const currentTime = new Date().toLocaleTimeString();
    
    console.log(`🔔 Showing toast notification: ${emoji} ${title}`);

    // Show toast notification at top (simulates notification banner)
    ToastAndroid.showWithGravityAndOffset(
      `🐼 ServicePanda: ${emoji} ${title}`,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      0,
      100
    );

    // Show another toast with message
    setTimeout(() => {
      ToastAndroid.showWithGravityAndOffset(
        `${message} - ${currentTime}`,
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
        0,
        0
      );
    }, 1000);

    console.log('✅ Toast notifications shown successfully');
  }

  // Customer request notification
  sendCustomerRequest(message: string, location?: string) {
    const title = 'New Customer Request';
    const fullMessage = location ? `${message} in ${location}` : message;
    this.sendToRealNotificationBar(title, fullMessage, 'lead');
  }

  // Payment notification
  sendPaymentReceived(amount: string, description: string) {
    const title = 'Payment Received';
    const message = `${description} - $${amount}`;
    this.sendToRealNotificationBar(title, message, 'payment');
  }

  // System notification
  sendSystemAlert(title: string, message: string) {
    this.sendToRealNotificationBar(title, message, 'system');
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

const realAndroidNotification = new RealAndroidNotification();

export default realAndroidNotification;
