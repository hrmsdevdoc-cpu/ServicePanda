# OneSignal Push Notifications Setup for iOS

This guide will help you set up OneSignal push notifications for your ServicePanda iOS app.

## Prerequisites

1. OneSignal account (sign up at [onesignal.com](https://onesignal.com))
2. Apple Developer account
3. Xcode installed on your Mac

## Step 1: Create OneSignal App

1. Go to [OneSignal Dashboard](https://app.onesignal.com)
2. Click "New App/Website"
3. Choose "Apple iOS" as the platform
4. Enter your app name: "ServicePanda"
5. Click "Next: Configure Your Platform"

## Step 2: Configure iOS App

1. **Bundle ID**: Enter your app's bundle identifier (e.g., `com.yourcompany.servicepanda`)
2. **APNs Auth Key**: Upload your Apple Push Notification service key (.p8 file)
   - Go to Apple Developer Console
   - Navigate to Certificates, Identifiers & Profiles
   - Go to Keys section
   - Create a new key with Apple Push Notifications service (APNs) enabled
   - Download the .p8 file and upload it to OneSignal
3. **Team ID**: Enter your Apple Developer Team ID
4. Click "Save & Continue"

## Step 3: Get Your OneSignal App ID

1. After creating your app, you'll see your OneSignal App ID
2. Copy this App ID - you'll need it for the next step

## Step 4: Update Configuration

1. Open `src/config/oneSignalConfig.ts`
2. Replace `YOUR_ONESIGNAL_APP_ID` with your actual OneSignal App ID:

```typescript
export const ONESIGNAL_CONFIG = {
  IOS_APP_ID: "your-actual-onesignal-app-id-here",
  // ... rest of config
};
```

## Step 5: Update AppDelegate.mm

1. Open `ios/ServicePanda/AppDelegate.mm`
2. Replace `YOUR_ONESIGNAL_APP_ID` with your actual OneSignal App ID:

```objc
[OneSignal initialize:@"your-actual-onesignal-app-id-here" withLaunchOptions:launchOptions];
```

## Step 6: Install Dependencies

Run the following commands in your project root:

```bash
# Install OneSignal dependencies
npm install react-native-onesignal

# For iOS, install pods
cd ios
pod install
cd ..
```

## Step 7: Configure Xcode Project

1. Open `ios/ServicePanda.xcworkspace` in Xcode
2. Select your project in the navigator
3. Go to "Signing & Capabilities" tab
4. Add "Push Notifications" capability
5. Add "Background Modes" capability and enable "Remote notifications"

## Step 8: Test Push Notifications

1. Build and run your app on a physical iOS device (push notifications don't work on simulator)
2. Check the console logs for OneSignal initialization messages
3. Test sending a notification from OneSignal dashboard

## Step 9: Server Integration (Optional)

To send notifications from your server, you can use OneSignal's REST API:

```javascript
// Example server-side notification sending
const OneSignal = require("onesignal-node");

const client = new OneSignal.Client("your-app-id", "your-rest-api-key");

const notification = {
  contents: { en: "New service request available!" },
  include_external_user_ids: ["customer-123"],
  data: {
    type: "service_request",
    requestId: "req-456",
  },
};

client.createNotification(notification);
```

## Troubleshooting

### Common Issues

1. **"OneSignal App ID not configured" warning**

   - Make sure you've updated both `oneSignalConfig.ts` and `AppDelegate.mm` with your actual App ID

2. **Push notifications not received**

   - Ensure you're testing on a physical device, not simulator
   - Check that push notifications are enabled in device settings
   - Verify your APNs certificate is valid

3. **Build errors**

   - Run `cd ios && pod install` to update dependencies
   - Clean and rebuild your project

4. **Permission denied**
   - Make sure you've added the necessary permissions in `Info.plist`
   - Check that the user has granted notification permissions

### Debug Steps

1. Check console logs for OneSignal initialization messages
2. Verify device token is being generated
3. Test with OneSignal's test notification feature
4. Check OneSignal dashboard for delivery statistics

## Features Included

- ✅ Push notification registration
- ✅ User identification and tagging
- ✅ Notification click handling
- ✅ Foreground notification display
- ✅ Background notification processing
- ✅ User logout cleanup
- ✅ Platform-specific configuration

## Next Steps

1. Set up your OneSignal app and get your App ID
2. Update the configuration files
3. Test on a physical device
4. Integrate with your server for sending notifications
5. Customize notification categories and handling

For more information, visit the [OneSignal React Native documentation](https://documentation.onesignal.com/docs/react-native-sdk).
