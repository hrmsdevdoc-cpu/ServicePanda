import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';

const BackgroundJob = async (taskData) => {
  console.log('[BACKGROUND] ServicePanda background job started');
  
  try {
    // Get provider ID from storage
    const providerId = await AsyncStorage.getItem('providerId') || '1';
    
    // Check for notifications from server
    const response = await fetch('https://api.servicepanda.com.au/api/provider/notifications/poll', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-provider-id': providerId,
      }
    });

    if (response.ok) {
      const data = await response.json();
      const notifications = data.notifications || [];
      
      console.log(`[BACKGROUND] Found ${notifications.length} notifications`);
      
      // Show each notification in the system tray
      notifications.forEach((notification, index) => {
        PushNotification.localNotification({
          channelId: 'servicepanda-system',
          id: Date.now() + index,
          title: notification.title || 'ServicePanda',
          message: notification.message || 'New notification',
          userInfo: notification.data || {},
          playSound: true,
          soundName: 'default',
          importance: 'high',
          priority: 'high',
          vibrate: true,
          vibration: 300,
          ongoing: false,
          autoCancel: true,
        });
      });
    }
  } catch (error) {
    console.error('[BACKGROUND] Error checking notifications:', error);
  }
  
  console.log('[BACKGROUND] ServicePanda background job completed');
  return Promise.resolve();
};

export default BackgroundJob;
