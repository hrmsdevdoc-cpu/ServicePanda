// Using built-in fetch (Node.js 18+)

interface NotificationPayload {
  title: string;
  message: string;
  type: 'customer_request' | 'payment' | 'service_update' | 'system';
  data?: any;
}

interface ProviderDevice {
  providerId: number;
  deviceToken?: string;
  platform: 'android' | 'ios';
  appVersion?: string;
  isActive: boolean;
}

class ProviderNotificationService {
  private apiUrl: string;

  constructor() {
    // Using FCM (Firebase Cloud Messaging) for real push notifications
    // This will work with the React Native app's notification service
    this.apiUrl = process.env.PROVIDER_APP_NOTIFICATION_URL || 'https://fcm.googleapis.com/fcm/send';
  }

  // Send notification to specific provider
  async sendNotificationToProvider(
    providerId: number, 
    notification: NotificationPayload
  ): Promise<boolean> {
    try {
      console.log(`🔔 Sending REAL notification to provider ${providerId}:`, notification.title);

      // PRIORITY 1: Send real push notification via OneSignal (works when app closed!)
      console.log(`🚀 FORCING OneSignal API call for provider ${providerId}`);
      const pushResult = await this.sendPushNotificationIfAvailable(providerId, notification);
      
      // PRIORITY 2: Store for polling (backup for when app is open)
      const storeResult = await this.storeNotificationInDatabase(providerId, notification);
      
      // PRIORITY 3: In-app notification (only when app is open)
      const inAppResult = await this.sendInAppNotification(providerId, notification);

      console.log(`📊 Notification results for provider ${providerId}:`);
      console.log(`   - OneSignal Push: ${pushResult ? '✅' : '❌'}`);
      console.log(`   - Stored for polling: ${storeResult ? '✅' : '❌'}`);
      console.log(`   - In-app: ${inAppResult ? '✅' : '❌'}`);

      // Return success if at least push or storage worked
      if (pushResult || storeResult) {
        console.log(`✅ Notification sent successfully to provider ${providerId}`);
        return true;
      } else {
        console.error(`❌ Both push and storage failed for provider ${providerId}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error sending notification to provider ${providerId}:`, error);
      return false;
    }
  }

  // Send notification to multiple providers
  async sendNotificationToProviders(
    providerIds: number[], 
    notification: NotificationPayload
  ): Promise<{ success: number; failed: number }> {
    console.log(`🔔 Sending notifications to ${providerIds.length} providers:`, notification.title);
    
    let successCount = 0;
    let failedCount = 0;

    // Send notifications in parallel for better performance
    const promises = providerIds.map(async (providerId) => {
      const success = await this.sendNotificationToProvider(providerId, notification);
      if (success) {
        successCount++;
      } else {
        failedCount++;
      }
    });

    await Promise.all(promises);

    console.log(`📊 Notification results: ${successCount} successful, ${failedCount} failed`);
    return { success: successCount, failed: failedCount };
  }

  // Send customer request notification to eligible providers
  async notifyProvidersOfNewRequest(
    requestId: number,
    categoryName: string,
    customerLocation: string,
    description: string,
    eligibleProviders: Array<{ providerId: number; firstName: string; lastName: string }>
  ): Promise<void> {
    console.log(`🛎️ Notifying ${eligibleProviders.length} providers of new customer request #${requestId}`);

    const notification: NotificationPayload = {
      title: 'New Customer Request Available! 🛎️',
      message: `${categoryName} needed in ${customerLocation}\n"${description.substring(0, 100)}${description.length > 100 ? '...' : ''}"`,
      type: 'customer_request',
      data: {
        requestId,
        categoryName,
        customerLocation,
        description,
        timestamp: new Date().toISOString(),
        priority: 'high'
      }
    };

    const providerIds = eligibleProviders.map(p => p.providerId);
    await this.sendNotificationToProviders(providerIds, notification);

    // Log the notification event
    console.log(`📝 Logged notification for request ${requestId} to providers:`, 
      eligibleProviders.map(p => `${p.firstName} ${p.lastName} (${p.providerId})`).join(', ')
    );
  }

  // Send payment confirmation notification
  async notifyProviderOfPayment(
    providerId: number,
    amount: number,
    customerName: string,
    serviceName: string
  ): Promise<void> {
    const notification: NotificationPayload = {
      title: 'Payment Received! 💰',
      message: `You received $${amount} from ${customerName} for ${serviceName}`,
      type: 'payment',
      data: {
        amount,
        customerName,
        serviceName,
        timestamp: new Date().toISOString()
      }
    };

    await this.sendNotificationToProvider(providerId, notification);
  }

  // Send service update notification
  async notifyProviderOfServiceUpdate(
    providerId: number,
    status: string,
    details: string
  ): Promise<void> {
    const notification: NotificationPayload = {
      title: 'Service Update 🔄',
      message: `${status}: ${details}`,
      type: 'service_update',
      data: {
        status,
        details,
        timestamp: new Date().toISOString()
      }
    };

    await this.sendNotificationToProvider(providerId, notification);
  }

  // Simulate notification sending (replace with real implementation)
  private async simulateNotificationSend(
    providerId: number, 
    notification: NotificationPayload
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));

      // Simulate 95% success rate
      const success = Math.random() > 0.05;
      
      if (success) {
        // In real implementation, this would be a POST to Firebase/OneSignal
        console.log(`📱 [SIMULATED] Notification sent to provider ${providerId}:`, {
          title: notification.title,
          message: notification.message.substring(0, 50) + '...',
          type: notification.type
        });
        return { success: true };
      } else {
        return { success: false, error: 'Simulated network error' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get provider device information (to be implemented with real database)
  private async getProviderDevices(providerId: number): Promise<ProviderDevice[]> {
    // This would query your database for provider's registered devices
    // For now, return mock data
    return [
      {
        providerId,
        deviceToken: 'mock_token_' + providerId,
        platform: 'android',
        appVersion: '1.2.0',
        isActive: true
      }
    ];
  }

  // Send push notification via Firebase (to be implemented)
  private async sendFirebaseNotification(
    deviceToken: string, 
    notification: NotificationPayload
  ): Promise<boolean> {
    // This would use Firebase Admin SDK to send push notifications
    // Implementation would depend on your Firebase setup
    console.log('🔥 Firebase notification would be sent here to:', deviceToken);
    return true;
  }

  // Send in-app notification via notification bridge
  private async sendInAppNotification(
    providerId: number, 
    notification: NotificationPayload
  ): Promise<boolean> {
    try {
      // Import here to avoid circular dependencies
      const { notificationBridge } = await import('./notificationBridge');
      
      // Send notification through the bridge
      notificationBridge.addNotification(providerId, notification);
      console.log(`🔗 Real-time notification sent to provider ${providerId} via bridge`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send in-app notification:', error);
      return false;
    }
  }

  // Store notification in database for polling
  private async storeNotificationInDatabase(
    providerId: number, 
    notification: NotificationPayload
  ): Promise<boolean> {
    try {
      // Store notification in the notification bridge for real-time polling
      console.log(`💾 Storing notification for polling by provider ${providerId}:`, notification.title);
      
      const { notificationBridge } = await import('./notificationBridge');
      
      // Add to notification bridge so polling API can find it
      notificationBridge.addNotification(providerId, {
        title: notification.title,
        message: notification.message,
        type: notification.type,
        data: notification.data
      });
      
      console.log(`✅ Notification added to bridge for provider ${providerId}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to store notification in bridge:', error);
      return false;
    }
  }

  // Send push notification via external service (simulated)
  private async sendPushNotificationIfAvailable(
    providerId: number, 
    notification: NotificationPayload
  ): Promise<boolean> {
    try {
      console.log(`🚀 Sending external push notification to provider ${providerId}`);
      
      // Send push notification via external service (e.g., Firebase Admin, OneSignal, etc.)
      const pushResult = await this.sendExternalPushNotification(providerId, notification);
      
      if (pushResult.success) {
        console.log(`✅ External push notification sent to provider ${providerId}`);
        return true;
      } else {
        console.log(`⚠️ External push failed for provider ${providerId}: ${pushResult.error}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Failed to send external push notification:', error);
      return false;
    }
  }

  // Send push notification via OneSignal (works when app is closed!)
  private async sendExternalPushNotification(
    providerId: number, 
    notification: NotificationPayload
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🚀 SENDING REAL ONESIGNAL PUSH NOTIFICATION to provider ${providerId}`);
      console.log(`📋 Title: ${notification.title}`);
      console.log(`📋 Message: ${notification.message}`);
      
      // Import OneSignal service and FORCE the API call
      const oneSignalAdminServiceModule = await import('./oneSignalAdminService');
      const oneSignalAdminService = oneSignalAdminServiceModule.default;
      
      if (!oneSignalAdminService) {
        throw new Error('OneSignal admin service not available');
      }
      
      console.log(`🔥 Calling OneSignal API directly...`);
      console.log(`🔧 OneSignal service loaded:`, typeof oneSignalAdminService);
      const pushResult = await oneSignalAdminService.sendToProvider(providerId, {
        title: notification.title,
        message: notification.message,
        data: notification.data
      });

      console.log(`📡 OneSignal API Response:`, pushResult);

      if (pushResult.success) {
        console.log(`✅ ONESIGNAL PUSH SENT! ID: ${pushResult.id}`);
        return { success: true };
      } else {
        console.log(`❌ ONESIGNAL PUSH FAILED: ${pushResult.error}`);
        return { success: false, error: pushResult.error };
      }
      
    } catch (error) {
      console.error('❌ CRITICAL ERROR in OneSignal push:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const providerNotificationService = new ProviderNotificationService();
export default providerNotificationService;
