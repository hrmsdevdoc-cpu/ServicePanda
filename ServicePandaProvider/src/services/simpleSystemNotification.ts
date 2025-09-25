import { Platform, ToastAndroid, Alert, Vibration } from 'react-native';

class SimpleSystemNotification {
  
  // Send notification that mimics Android system notification bar
  sendSystemNotification(title: string, message: string, type: string = 'general') {
    if (Platform.OS !== 'android') {
      console.log('❌ Not Android platform');
      return;
    }

    console.log('🔔 Sending system-style notification...');
    
    const emoji = this.getEmoji(type);
    const currentTime = new Date().toLocaleTimeString();
    
    // Step 1: Vibrate like system notification
    Vibration.vibrate([0, 250, 100, 250]);
    
    // Step 2: Show toast at TOP (simulates notification banner)
    ToastAndroid.showWithGravityAndOffset(
      `🐼 ServicePanda: ${title}`,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      0,
      50
    );
    
    console.log('✅ System-style notification sent!');
    
    // Step 3: Show another toast with time
    setTimeout(() => {
      ToastAndroid.showWithGravityAndOffset(
        `${emoji} ${message} - ${currentTime}`,
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
        0,
        0
      );
    }, 1000);
    
    // Step 4: Log detailed info for debugging
    console.log('📱 Notification details:', {
      title: title,
      message: message,
      type: type,
      time: currentTime,
      emoji: emoji
    });
  }

  // Customer request notification
  sendCustomerRequest(message: string, location?: string) {
    const title = 'New Customer Request';
    const fullMessage = location ? `${message} in ${location}` : message;
    this.sendSystemNotification(title, fullMessage, 'lead');
  }

  // Payment notification
  sendPaymentReceived(amount: string, description: string) {
    const title = 'Payment Received';
    const message = `${description} - $${amount}`;
    this.sendSystemNotification(title, message, 'payment');
  }

  // System notification
  sendSystemAlert(title: string, message: string) {
    this.sendSystemNotification(title, message, 'system');
  }

  private getEmoji(type: string): string {
    switch (type) {
      case 'lead': return '🎯';
      case 'payment': return '💰';
      case 'system': return '⚙️';
      default: return '🔔';
    }
  }
}

const simpleSystemNotification = new SimpleSystemNotification();

export default simpleSystemNotification;
