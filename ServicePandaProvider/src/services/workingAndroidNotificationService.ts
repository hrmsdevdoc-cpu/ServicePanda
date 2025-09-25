import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

class WorkingAndroidNotificationService {
  private isInitialized = false;

  // Initialize the notification service
  initialize() {
    if (this.isInitialized || Platform.OS !== 'android') {
      console.log('❌ Not Android or already initialized');
      return;
    }

    console.log('🔔 Initializing Working Android Notification Service...');

    try {
      // Configure PushNotification with error handling
      PushNotification.configure({
      // Called when token is generated (optional)
      onRegister: function (token) {
        console.log('📱 TOKEN:', token);
      },

      // Called when a remote notification is received while app is in foreground
      onNotification: function (notification) {
        console.log('📱 NOTIFICATION:', notification);
        // You can handle notification tap here
      },

      // IOS ONLY (optional): Called when a remote notification is received while app is in background
      onRemoteNotification: function (notification) {
        console.log('📱 REMOTE NOTIFICATION:', notification);
      },

        // Should the initial notification be popped automatically
        popInitialNotification: false, // Set to false to avoid getInitialNotification error

        // For Android only: false = Firebase sends notifications, true = local notifications
        requestPermissions: false,
      });

      // Create notification channel for Android (Required for Android 8.0+)
      PushNotification.createChannel(
        {
          channelId: 'servicepanda-channel', // (required)
          channelName: 'ServicePanda Provider', // (required)
          channelDescription: 'Notifications for ServicePanda Provider app', // (optional) default: undefined.
          importance: 4, // (optional) default: 4. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
          playSound: true, // (optional) default: true
          soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it.
        },
        (created) => console.log(`📱 createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
      );

      this.isInitialized = true;
      console.log('✅ Working Android Notification Service initialized!');
    } catch (error) {
      console.error('❌ Error initializing notification service:', error);
      // Fall back to simple initialization
      this.isInitialized = true;
    }
  }

  // Send a local notification to Android notification bar
  sendNotificationToBar(title: string, message: string, data?: any) {
    if (!this.isInitialized) {
      this.initialize();
    }

    if (Platform.OS !== 'android') {
      console.log('❌ Not Android platform');
      return;
    }

    console.log('🔔 Sending notification to Android bar...');

    try {
      PushNotification.localNotification({
      /* Android Only Properties */
      channelId: 'servicepanda-channel', // (required) channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the custom channel.
      ticker: '🐼 ServicePanda Provider', // (optional)
      showWhen: true, // (optional) default: true
      autoCancel: true, // (optional) default: true
      largeIcon: 'ic_launcher', // (optional) default: "ic_launcher". Use "" to hide the large icon.
      largeIconUrl: undefined, // (optional) default: undefined
      smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" to hide the small icon.
      bigText: message, // (optional) default: "message" prop
      subText: 'ServicePanda Provider', // (optional) default: none
      bigPictureUrl: undefined, // (optional) default: undefined
      bigLargeIcon: undefined, // (optional) default: undefined
      bigLargeIconUrl: undefined, // (optional) default: undefined
      color: '#3B82F6', // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      priority: 'high', // (optional) set notification priority, default: high
      visibility: 'public', // (optional) set notification visibility, default: private
      importance: 'high', // (optional) set notification importance, default: high
      allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
      ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
      shortcutId: 'shortcut-id', // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
      onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false
      
      when: null, // (optional) Add a timestamp (Unix timestamp value in milliseconds) pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
      usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Implies `showWhen=true`, default: false.
      timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null
      
      messageId: 'google:message_id', // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module. 
      
      actions: ['View', 'Dismiss'], // (Android only) See the doc for notification actions to know more
      invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
      
      /* iOS and Android properties */
      id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      title: title, // (optional)
      message: message, // (required)
      picture: undefined, // (optional) Display an picture with the notification, alias of `bigPictureUrl` for Android. default: undefined
      userInfo: data || {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
      playSound: true, // (optional) default: true
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it.
        number: 1, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
        repeatType: undefined, // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
      });

      console.log('✅ Notification sent to Android bar!');
    } catch (error) {
      console.error('❌ Error sending notification:', error);
      // Show fallback alert if notification fails
      console.log('🔔 Fallback: Using console log instead of notification');
    }
  }

  // Send customer request notification
  sendCustomerRequestNotification(customerName: string, service: string, location: string) {
    const title = 'نیا کسٹمر درخواست!';
    const message = `${customerName} نے ${service} کے لیے درخواست کی ہے\n📍 ${location}`;
    
    this.sendNotificationToBar(title, message, {
      type: 'customer_request',
      customerName,
      service,
      location,
      timestamp: new Date().toISOString(),
    });
  }

  // Send payment received notification
  sendPaymentNotification(amount: number, customerName: string) {
    const title = 'Payment Received!';
    const message = `You received $${amount} from ${customerName}`;
    
    this.sendNotificationToBar(title, message, {
      type: 'payment',
      amount,
      customerName,
      timestamp: new Date().toISOString(),
    });
  }

  // Send test notification
  sendTestNotification() {
    const title = 'Test Notification';
    const message = `This is a test notification sent at ${new Date().toLocaleTimeString()}`;
    
    this.sendNotificationToBar(title, message, {
      type: 'test',
      timestamp: new Date().toISOString(),
    });
  }

  // Clear all notifications
  clearAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
    console.log('🔔 All notifications cleared');
  }

  // Check if notifications are enabled
  checkPermissions(callback: (permissions: any) => void) {
    PushNotification.checkPermissions(callback);
  }
}

// Export singleton instance
const workingAndroidNotificationService = new WorkingAndroidNotificationService();
export default workingAndroidNotificationService;
