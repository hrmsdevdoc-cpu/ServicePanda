# 🔥 Firebase Cloud Messaging (FCM) Setup for Background Notifications

## 🎯 **Problem**: 
Notifications only work when app is open. Need background notifications like WhatsApp/Zomato.

## ✅ **Solution**: Firebase Cloud Messaging (FCM)

### **How FCM Works:**
```
Customer creates request
    ↓
Server sends FCM push notification
    ↓
Google/Firebase delivers to device
    ↓
Notification appears even if app is closed! 🔔
```

## 🚀 **Implementation Steps:**

### **Step 1: Firebase Project Setup**
1. Go to https://console.firebase.google.com/
2. Create new project: "ServicePandaProvider"
3. Add Android app with package name: `com.servicepandaprovider`
4. Download `google-services.json`

### **Step 2: Android Configuration**
```bash
# Place google-services.json in:
ServicePandaProvider/android/app/google-services.json
```

```xml
<!-- Add to android/build.gradle -->
dependencies {
    classpath 'com.google.gms:google-services:4.3.15'
}

<!-- Add to android/app/build.gradle -->
apply plugin: 'com.google.gms.google-services'
```

### **Step 3: React Native Code**
```typescript
// Enhanced notificationApiService.ts
import messaging from '@react-native-firebase/messaging';

class NotificationApiService {
  async initialize() {
    // Request permission
    const authStatus = await messaging().requestPermission();
    
    // Get FCM token
    const fcmToken = await messaging().getToken();
    console.log('FCM Token:', fcmToken);
    
    // Send token to server
    await this.sendTokenToServer(fcmToken);
    
    // Handle background messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background message:', remoteMessage);
    });
    
    // Handle foreground messages
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground message:', remoteMessage);
      this.showLocalNotification(remoteMessage);
    });
  }
}
```

### **Step 4: Server Integration**
```typescript
// server/fcmService.ts
import admin from 'firebase-admin';

class FCMService {
  async sendNotificationToProvider(providerId: number, notification: any) {
    // Get provider's FCM token from database
    const token = await this.getProviderFCMToken(providerId);
    
    // Send push notification
    const message = {
      token: token,
      notification: {
        title: notification.title,
        body: notification.message,
      },
      data: {
        type: notification.type,
        requestId: notification.requestId.toString(),
      },
    };
    
    await admin.messaging().send(message);
  }
}
```

## 🎯 **Benefits of FCM:**
- ✅ Works when app is closed
- ✅ Works when phone is sleeping  
- ✅ Reliable delivery via Google servers
- ✅ Used by WhatsApp, Zomato, Facebook
- ✅ No battery drain from polling
