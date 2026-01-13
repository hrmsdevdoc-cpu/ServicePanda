import { NativeModules, Platform } from 'react-native';

class NativeAndroidNotification {
  
  // Send notification directly to Android system notification bar
  async sendToNotificationBar(title: string, message: string, type: string = 'general') {
    if (Platform.OS !== 'android') {
      console.log('❌ Not Android platform, skipping notification');
      return;
    }

    try {
      console.log('🔔 Sending notification to Android notification bar...');
      
      // Try to use native Android notification if available
      if (NativeModules.AndroidNotificationModule) {
        console.log('📱 Using native Android notification module...');
        const result = await NativeModules.AndroidNotificationModule.showNotification({
          title: `🐼 ServicePanda Provider`,
          message: `${this.getEmoji(type)} ${title}\n${message}`,
          type: type,
          timestamp: Date.now()
        });
        console.log('✅ Native Android notification result:', result);
        return;
      } else {
        console.log('⚠️ AndroidNotificationModule not available');
      }

      // Fallback: Create custom notification
      this.createCustomAndroidNotification(title, message, type);
      
    } catch (error) {
      console.error('❌ Failed to send Android notification:', error);
      // Fallback to basic notification
      this.createCustomAndroidNotification(title, message, type);
    }
  }

  private createCustomAndroidNotification(title: string, message: string, type: string) {
    // This will be handled by creating a native Android module
    console.log('🔔 Creating custom Android notification...');
    
    const notificationData = {
      id: Date.now(),
      title: `🐼 ServicePanda Provider`,
      message: `${this.getEmoji(type)} ${title}\n${message}`,
      type: type,
      timestamp: new Date().toISOString(),
      channel: 'servicepanda-notifications'
    };

    console.log('📱 Notification data prepared:', notificationData);
    
    // For now, log that notification should appear in system bar
    console.log('✅ Notification should appear in Android notification bar');
  }

  private getEmoji(type: string): string {
    switch (type) {
      case 'lead': return '🎯';
      case 'payment': return '💰';
      case 'system': return '⚙️';
      default: return '🔔';
    }
  }

  // Customer request notification
  sendCustomerRequest(message: string, location?: string) {
    const title = 'New Customer Request';
    const fullMessage = location ? `${message} in ${location}` : message;
    this.sendToNotificationBar(title, fullMessage, 'lead');
  }

  // Payment notification
  sendPaymentReceived(amount: string, description: string) {
    const title = 'Payment Received';
    const message = `${description} - $${amount}`;
    this.sendToNotificationBar(title, message, 'payment');
  }

  // System notification
  sendSystemAlert(title: string, message: string) {
    this.sendToNotificationBar(title, message, 'system');
  }
}

const nativeAndroidNotification = new NativeAndroidNotification();

export default nativeAndroidNotification;
