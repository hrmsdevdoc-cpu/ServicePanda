# OneSignal iOS Setup - Complete Guide

## ✅ What's Been Configured

### 1. Package Installation

- ✅ `react-native-onesignal` package installed (v5.2.13)
- ✅ iOS pods installed successfully
- ✅ OneSignalXCFramework integrated

### 2. iOS Native Configuration

- ✅ AppDelegate.mm updated with OneSignal initialization
- ✅ OneSignal import added
- ✅ App ID configured: `a3f5070d-9c46-44cd-8b0a-259df155ae94`
- ✅ Notification handlers added

### 3. Info.plist Configuration

- ✅ Background modes enabled
- ✅ Remote notifications enabled
- ✅ Background processing enabled
- ✅ Background fetch enabled

### 4. OneSignal Service

- ✅ Service updated for v5 API compatibility
- ✅ Proper initialization flow
- ✅ External user ID handling
- ✅ Permission request handling

## 🧪 Testing OneSignal

### 1. Run the iOS App

```bash
cd /Users/cdp/Desktop/ServicePanda/ServicePandaProvider
npx react-native run-ios
```

### 2. Check Console Logs

Look for these logs in the console:

- `✅ OneSignal initialized with App ID: a3f5070d-9c46-44cd-8b0a-259df155ae94`
- `🔔 OneSignal notification permission granted!`
- `👤 External User ID set: provider-1`

### 3. Test Notification Permissions

The app will automatically request notification permissions when OneSignal initializes.

### 4. Send Test Notification

1. Go to [OneSignal Dashboard](https://app.onesignal.com)
2. Select your app: `ServicePanda Provider`
3. Go to Messages > New Push
4. Send a test notification to all users or specific segments

## 🔧 OneSignal Dashboard Configuration

### App Settings

- **App ID**: `a3f5070d-9c46-44cd-8b0a-259df155ae94`
- **Bundle ID**: `com.servicepandaprovider`
- **Platform**: iOS

### APNs Certificate Setup

1. Go to OneSignal Dashboard > Settings > Platforms
2. Select iOS
3. Upload your APNs certificate or use APNs Auth Key
4. Configure for Production/Development as needed

## 📱 Device Registration

### How It Works

1. App launches and initializes OneSignal
2. OneSignal requests notification permissions
3. Device gets registered with OneSignal
4. Device appears in OneSignal dashboard
5. You can send targeted notifications

### External User ID

- Each provider gets a unique external user ID: `provider-{providerId}`
- This allows targeting specific providers
- Stored in AsyncStorage as `providerId`

## 🐛 Troubleshooting

### Common Issues

#### 1. OneSignal Not Initializing

**Symptoms**: No OneSignal logs in console
**Solution**:

- Check if pods are installed: `cd ios && pod install`
- Clean and rebuild: `npx react-native run-ios --reset-cache`

#### 2. Permission Denied

**Symptoms**: Permission status shows as denied
**Solution**:

- Go to iOS Settings > ServicePanda Provider > Notifications
- Enable notifications manually

#### 3. Device Not Appearing in Dashboard

**Symptoms**: Device doesn't show up in OneSignal dashboard
**Solution**:

- Check internet connection
- Verify App ID is correct
- Check console for error messages

#### 4. Notifications Not Received

**Symptoms**: Test notifications not appearing
**Solution**:

- Verify APNs certificate is uploaded
- Check if device is registered
- Test on physical device (not simulator)

### Debug Commands

```bash
# Check OneSignal setup
node test-onesignal-ios.js

# Clean and rebuild
npx react-native run-ios --reset-cache

# Check pods
cd ios && pod install
```

## 📊 Monitoring

### OneSignal Dashboard

- **Players**: View registered devices
- **Messages**: Send and track notifications
- **Analytics**: View delivery and engagement stats

### Console Logs

Look for these key logs:

- `✅ OneSignal initialized`
- `🔔 Permission granted`
- `👤 User ID: [device-id]`
- `📱 Notification received`

## 🚀 Production Setup

### 1. APNs Certificate

- Generate production APNs certificate
- Upload to OneSignal dashboard
- Test with production build

### 2. App Store Configuration

- Ensure push notifications capability is enabled
- Test on TestFlight before release

### 3. Monitoring

- Set up OneSignal webhooks for delivery tracking
- Monitor notification delivery rates
- Track user engagement

## 📝 Next Steps

1. **Test the current setup** by running the iOS app
2. **Verify device registration** in OneSignal dashboard
3. **Send test notifications** to confirm delivery
4. **Integrate with your backend** for automated notifications
5. **Set up production APNs certificate** for App Store release

## 🔗 Useful Links

- [OneSignal React Native Documentation](https://documentation.onesignal.com/docs/react-native-sdk)
- [OneSignal Dashboard](https://app.onesignal.com)
- [iOS Push Notifications Guide](https://developer.apple.com/documentation/usernotifications)

---

**Status**: ✅ OneSignal iOS integration is complete and ready for testing!
