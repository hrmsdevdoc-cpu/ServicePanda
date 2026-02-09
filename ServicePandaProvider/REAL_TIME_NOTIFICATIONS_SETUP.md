# Real-Time Notifications Setup Guide

## Overview
This implementation adds a comprehensive real-time notification system with current time display to the ServicePandaProvider app using OneSignal for push notifications and a custom background polling system.

## Features Implemented

### 1. OneSignal Integration (`src/services/oneSignalService.ts`)
- **Push Notifications**: Handles foreground and background notifications
- **Background Polling**: Continues checking for updates when app is minimized
- **Device Targeting**: Can send notifications to specific users
- **Real-time Processing**: Processes notifications with current timestamps

### 2. Real-Time Notification Service (`src/services/realTimeNotificationService.ts`)
- **Scheduled Notifications**: Configurable time-based notification schedules
- **Current Time Display**: Shows exact time when notifications are received
- **Background Processing**: Runs continuously to check for new notifications
- **Customizable Intervals**: Different notification types with different frequencies

### 3. Current Time Notification Component (`src/components/CurrentTimeNotification.tsx`)
- **Live Time Display**: Shows current time that updates every second
- **Visual Design**: Beautiful notification cards with time stamps
- **Interactive**: Tap to handle, auto-hide functionality
- **Type-based Styling**: Different colors for different notification types

### 4. Real-Time Controller (`src/components/RealTimeNotificationController.tsx`)
- **Service Management**: Initializes and manages all notification services
- **App State Handling**: Responds to foreground/background app changes
- **Notification Queue**: Manages multiple simultaneous notifications
- **Debug Information**: Shows service status in development mode

### 5. Control Panel (`src/components/NotificationControlPanel.tsx`)
- **Live Management**: Real-time control over notification schedules
- **Test Functionality**: Send test notifications with current time
- **Schedule Toggle**: Enable/disable specific notification types
- **Status Monitoring**: View service status and next notification times

## Setup Instructions

### 1. OneSignal Account Setup
1. Create a free account at [OneSignal.com](https://onesignal.com)
2. Create a new app for your React Native project
3. Get your OneSignal App ID from the dashboard
4. Replace `"your-onesignal-app-id"` in the code with your actual App ID

### 2. Android Configuration
Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.VIBRATE" />
```

### 3. iOS Configuration
Add to `ios/ServicePandaProvider/Info.plist`:
```xml
<key>UIBackgroundModes</key>
<array>
    <string>remote-notification</string>
    <!-- Optional: only include if you actually use BGTaskScheduler -->
    <!-- <string>processing</string> -->
    <!-- Optional: only include if you implement background fetch -->
    <!-- <string>fetch</string> -->
</array>
```

### 4. Update OneSignal App ID
In `ServicePandaProvider/App.tsx`, update the OneSignal App ID:
```tsx
<RealTimeNotificationController oneSignalAppId="YOUR_ACTUAL_ONESIGNAL_APP_ID">
```

## Usage

### Access the Control Panel
1. Open the app and navigate to the Dashboard
2. Look for the settings icon (⚙️) next to the notification bell
3. Tap the settings icon to open the Notification Control Panel

### Test Notifications
1. In the Control Panel, tap "Send Test Notification"
2. You'll see a notification with the current time
3. The notification will show when it was received

### Configure Schedules
1. Use the toggles in the Control Panel to enable/disable notification types
2. Customer requests check every 5 minutes by default
3. System status updates every 30 minutes
4. All times can be customized in the code

### View Active Notifications
1. The Control Panel shows all active notification schedules
2. See when each notification was last triggered
3. See when the next notification will trigger

## Notification Types

### Customer Request Notifications
- **New Requests Check**: Every 5 minutes
- **Urgent Requests**: Every 15 minutes
- Shows current time when customer requests are received

### System Notifications
- **System Heartbeat**: Every 30 minutes
- **Daily Summary**: Once per day
- Provides system status with timestamps

## Customization

### Add New Notification Types
1. Edit `realTimeNotificationService.ts`
2. Add new notification objects to the schedules array
3. Configure title, message, type, and interval

### Modify Time Intervals
1. Open the Control Panel in the app
2. Or edit the `intervalMinutes` values in the service code
3. Times are in minutes (5 = 5 minutes, 1440 = 24 hours)

### Change Notification Appearance
1. Edit `CurrentTimeNotification.tsx` for visual changes
2. Modify colors, fonts, and layout
3. Add new notification types with custom styling

## Troubleshooting

### Notifications Not Appearing
1. Check OneSignal App ID is correct
2. Ensure device has notification permissions
3. Check app is not in "Do Not Disturb" mode
4. Verify service is running in Control Panel

### Background Processing Issues
1. Ensure app has background app refresh enabled
2. Check battery optimization settings on Android
3. iOS may limit background processing after some time

### Time Display Issues
1. Time updates every second automatically
2. Uses device's local time zone
3. Format can be customized in the component

## Development Notes

### Debug Mode
- In development, a debug indicator shows in the bottom right
- Shows service status, current time, and active notification count
- Remove `__DEV__` checks for production builds

### Performance Considerations
- Background polling is limited to every 60 seconds minimum
- Notification queue is limited to 3 active notifications
- Old notifications auto-hide after 10 seconds

### Testing
- Use the Control Panel to send test notifications
- Check console logs for detailed service information
- Monitor app performance with background tasks active

## Future Enhancements

### Possible Additions
1. **Push Notification Scheduling**: Schedule notifications for specific times
2. **Location-based Notifications**: Trigger based on user location
3. **Custom Sound Support**: Different sounds for different notification types
4. **Rich Media**: Images and actions in notifications
5. **Analytics**: Track notification engagement metrics

### Backend Integration
1. Connect to your actual API for real customer requests
2. Implement server-side notification triggers
3. Add user preference management
4. Create notification history and analytics

## Support

For issues or questions:
1. Check the Control Panel for service status
2. Review console logs for error messages
3. Ensure all permissions are granted
4. Test with simple notifications first before complex schedules

---

This implementation provides a complete real-time notification system with current time display that works both in foreground and background, giving users immediate updates about customer requests and system status.
