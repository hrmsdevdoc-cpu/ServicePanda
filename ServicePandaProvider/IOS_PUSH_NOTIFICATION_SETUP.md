# iOS Push Notification Setup Guide for ServicePandaProvider

This guide will help you configure push notifications for iOS using OneSignal in the ServicePandaProvider app.

## Prerequisites

- Xcode 14.0 or later
- iOS 16.0 or later
- Apple Developer Account
- OneSignal App ID: `a3f5070d-9c46-44cd-8b0a-259df155ae94`

## Step 1: Install Dependencies

Run the following command to install the OneSignal pod:

```bash
cd ios
pod install
```

## Step 2: Configure Xcode Project

### 2.1 Enable Push Notifications Capability

1. Open `ServicePandaProvider.xcworkspace` in Xcode
2. Select the `ServicePandaProvider` target
3. Go to "Signing & Capabilities" tab
4. Click the "+ Capability" button
5. Add "Push Notifications" capability

### 2.2 Configure Background Modes

1. In the same "Signing & Capabilities" tab
2. Add "Background Modes" capability if not already present
3. Check the following options:
   - ✅ Background processing
   - ✅ Remote notifications

### 2.3 Configure App Groups (Optional)

If you need to share data between the app and notification extensions:

1. Add "App Groups" capability
2. Create a new group: `group.com.servicepandaprovider.notifications`
3. Enable the group for your app

## Step 3: Configure Apple Push Notification Service (APNs)

### 3.1 Create APNs Certificate or Key

1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Navigate to "Certificates, Identifiers & Profiles"
3. Go to "Keys" section
4. Click "+" to create a new key
5. Name it "ServicePandaProvider Push Key"
6. Check "Apple Push Notifications service (APNs)"
7. Click "Continue" and "Register"
8. Download the `.p8` file and note the Key ID

### 3.2 Configure OneSignal Dashboard

1. Go to [OneSignal Dashboard](https://app.onesignal.com/)
2. Select your app
3. Go to "Settings" > "Platforms" > "iOS"
4. Upload your APNs certificate or configure with your key:
   - **Key ID**: From step 3.1
   - **Team ID**: Your Apple Developer Team ID
   - **Bundle ID**: `com.servicepandaprovider`
   - **Key File**: Upload the `.p8` file

## Step 4: Update Bundle Identifier

Make sure your bundle identifier matches what you configured in OneSignal:

1. In Xcode, select the project
2. Go to "General" tab
3. Set Bundle Identifier to: `com.servicepandaprovider`

## Step 5: Configure Provisioning Profile

1. In Apple Developer Portal, create a new provisioning profile
2. Select "iOS App Development" or "App Store" (for production)
3. Select your App ID
4. Select your development/distribution certificate
5. Select your device(s)
6. Download and install the provisioning profile

## Step 6: Test Push Notifications

### 6.1 Build and Run

1. Clean build folder (Cmd+Shift+K)
2. Build the project (Cmd+B)
3. Run on device (Cmd+R)

### 6.2 Test Notification Permission

The app will automatically request notification permissions on first launch. Check the console for:

```
✅ iOS notification permission granted!
✅ OneSignal initialized successfully for iOS
```

### 6.3 Send Test Notification

1. Go to OneSignal Dashboard
2. Go to "Messages" > "New Push"
3. Create a test message
4. Send to "All Users" or specific segments
5. Check if notification appears on device

## Step 7: Troubleshooting

### Common Issues

1. **"No valid 'aps-environment' entitlement"**

   - Make sure Push Notifications capability is enabled
   - Check that your provisioning profile includes push notifications

2. **"Invalid bundle identifier"**

   - Ensure bundle ID matches OneSignal configuration
   - Check provisioning profile includes correct bundle ID

3. **Notifications not appearing**

   - Check device notification settings
   - Verify APNs certificate/key is correctly configured
   - Check OneSignal dashboard for delivery status

4. **Build errors**
   - Run `cd ios && pod install` to update dependencies
   - Clean build folder and rebuild
   - Check that OneSignal pod is properly installed

### Debug Steps

1. Check Xcode console for OneSignal logs
2. Verify device is registered in OneSignal dashboard
3. Test with OneSignal's test notification feature
4. Check iOS Settings > Notifications > ServicePanda Provider

## Step 8: Production Deployment

### 8.1 App Store Configuration

1. Create App Store provisioning profile
2. Configure production APNs certificate/key
3. Update OneSignal with production credentials
4. Test thoroughly before submission

### 8.2 App Store Connect

1. Enable push notifications in App Store Connect
2. Add privacy description for notifications
3. Submit for review

## Files Modified

The following files have been updated for iOS push notification support:

- `ios/ServicePandaProvider/AppDelegate.mm` - Added OneSignal initialization
- `ios/ServicePandaProvider/Info.plist` - Added background modes
- `ios/Podfile` - Added OneSignal pod
- `src/services/iosNotificationService.ts` - iOS-specific notification handling
- `src/services/oneSignalService.ts` - Updated for iOS support

## Support

If you encounter issues:

1. Check OneSignal documentation: https://documentation.onesignal.com/
2. Review Apple's push notification guide: https://developer.apple.com/documentation/usernotifications
3. Check Xcode console for detailed error messages
4. Verify all certificates and provisioning profiles are valid

## Next Steps

After completing this setup:

1. Test notifications on multiple devices
2. Implement notification handling logic in your app
3. Set up notification categories and actions
4. Configure notification scheduling and targeting
5. Monitor notification delivery and engagement metrics
