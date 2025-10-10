# Xcode Capabilities Setup Guide for ServicePandaProvider

This guide will help you configure the required capabilities in Xcode for push notifications and background processing.

## Required Capabilities

### 1. Push Notifications

- **Purpose**: Receive push notifications from OneSignal
- **Required for**: Real-time lead notifications, payment updates, system alerts

### 2. Background Modes

- **Purpose**: Process notifications and perform background tasks
- **Required for**: Background app refresh, remote notifications, background processing

## Step-by-Step Configuration

### Step 1: Open Xcode Project

1. Navigate to the `ios` folder in your project
2. Open `ServicePandaProvider.xcworkspace` (NOT .xcodeproj)
3. Wait for Xcode to load the project

### Step 2: Select Target

1. In the project navigator, click on the project name at the top
2. Select the `ServicePandaProvider` target (not the project)
3. Click on the "Signing & Capabilities" tab

### Step 3: Add Push Notifications Capability

1. Click the "+ Capability" button
2. Search for "Push Notifications"
3. Click on "Push Notifications" to add it
4. Verify it appears in the capabilities list

### Step 4: Add Background Modes Capability

1. Click the "+ Capability" button again
2. Search for "Background Modes"
3. Click on "Background Modes" to add it
4. Check the following options:
   - ✅ **Background processing** - For background app refresh
   - ✅ **Remote notifications** - For push notifications
   - ✅ **Background fetch** - For periodic background updates

### Step 5: Configure App Groups (Optional)

If you need to share data between the app and notification extensions:

1. Click the "+ Capability" button
2. Search for "App Groups"
3. Click on "App Groups" to add it
4. Click the "+" button to add a new group
5. Enter: `group.com.servicepandaprovider.notifications`
6. Click "OK"

### Step 6: Verify Bundle Identifier

1. In the "General" tab, verify the Bundle Identifier is: `com.servicepandaprovider`
2. If it's different, update it to match your OneSignal configuration

### Step 7: Configure Provisioning Profile

1. In the "Signing & Capabilities" tab
2. Select your development team
3. Choose "Automatically manage signing" or manually select a provisioning profile
4. Ensure the provisioning profile includes push notifications capability

## Visual Guide

### Capabilities Tab Should Look Like This:

```
Signing & Capabilities
├── Push Notifications ✅
├── Background Modes ✅
│   ├── Background processing ✅
│   ├── Remote notifications ✅
│   └── Background fetch ✅
└── App Groups (Optional)
    └── group.com.servicepandaprovider.notifications
```

## Verification Checklist

- [ ] Push Notifications capability added
- [ ] Background Modes capability added
- [ ] Background processing enabled
- [ ] Remote notifications enabled
- [ ] Background fetch enabled
- [ ] Bundle identifier is correct
- [ ] Provisioning profile includes push notifications
- [ ] Development team is selected
- [ ] Code signing is working

## Common Issues and Solutions

### Issue: "No valid 'aps-environment' entitlement"

**Solution**:

1. Ensure Push Notifications capability is enabled
2. Check that your provisioning profile includes push notifications
3. Re-download and install the provisioning profile

### Issue: "Invalid bundle identifier"

**Solution**:

1. Verify bundle ID matches OneSignal configuration
2. Check provisioning profile includes correct bundle ID
3. Update OneSignal dashboard if bundle ID changed

### Issue: Background modes not working

**Solution**:

1. Ensure Background Modes capability is enabled
2. Check that specific background modes are selected
3. Verify app is properly configured for background execution

### Issue: Code signing errors

**Solution**:

1. Select correct development team
2. Enable "Automatically manage signing"
3. Clean build folder and rebuild
4. Check Apple Developer account status

## Testing the Configuration

### 1. Build and Run

1. Clean build folder (Cmd+Shift+K)
2. Build the project (Cmd+B)
3. Run on a physical iOS device (not simulator)

### 2. Test Notifications

1. Launch the app
2. Grant notification permissions when prompted
3. Check Xcode console for OneSignal logs
4. Send test notification from OneSignal dashboard

### 3. Test Background Modes

1. Put app in background
2. Send push notification
3. Verify notification appears
4. Check background processing works

## Production Deployment

### 1. App Store Connect

1. Enable push notifications in App Store Connect
2. Add privacy description for notifications
3. Submit for review

### 2. Production Certificates

1. Create production APNs certificate
2. Update OneSignal with production credentials
3. Test thoroughly before release

## Files Modified

The following files have been updated for proper iOS capabilities:

- `ios/ServicePandaProvider/Info.plist` - Added background modes and notification settings
- `ios/ServicePandaProvider/AppDelegate.mm` - Added notification handlers and background processing
- `src/services/iosNotificationService.ts` - iOS-specific notification handling
- `ios/Podfile` - Added OneSignal pod

## Support

If you encounter issues:

1. Check Apple's documentation on capabilities
2. Verify OneSignal configuration
3. Check Xcode console for detailed error messages
4. Ensure all certificates and provisioning profiles are valid

## Next Steps

After completing this setup:

1. Test notifications on multiple devices
2. Implement notification handling logic
3. Set up notification categories and actions
4. Configure background processing tasks
5. Monitor notification delivery and engagement
