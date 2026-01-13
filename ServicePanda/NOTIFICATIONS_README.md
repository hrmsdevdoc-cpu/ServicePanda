# Notification System Implementation

This document describes the notification system implemented in the ServicePandaProvider React Native app.

## Features

- **Notification Icon**: Bell icon with unread count badge in the header
- **Notification List**: Modal that displays all notifications
- **Read/Unread Status**: Different visual designs for read vs unread notifications
- **Notification Types**: Support for info, success, warning, and error notifications
- **Categories**: Lead, payment, system, and general notification categories
- **Real-time Updates**: Notifications refresh when pulling down on dashboard
- **Navigation Integration**: Clicking notifications navigates to relevant screens

## Components

### 1. NotificationIcon (`src/components/NotificationIcon.tsx`)
- Displays a bell icon with unread count badge
- Positioned in the top-right of the header
- Shows red badge with count for unread notifications
- Handles tap events to open notification list

### 2. NotificationList (`src/components/NotificationList.tsx`)
- Modal component that displays all notifications
- Shows unread notifications first, then read ones
- Different styling for read vs unread notifications
- "Mark All as Read" button for bulk operations
- Empty state when no notifications exist

### 3. NotificationService (`src/services/notifications.ts`)
- Handles API calls for notification operations
- Provides mock data for development/testing
- Methods: `getNotifications()`, `markAsRead()`, `markAllAsRead()`

## Usage

### In DashboardScreen
The notification system is integrated into the main dashboard:

```tsx
// Notification state
const [notificationsVisible, setNotificationsVisible] = React.useState(false);
const [notifications, setNotifications] = React.useState([]);

// Fetch notifications on mount
React.useEffect(() => {
  const fetchNotifications = async () => {
    const fetchedNotifications = await notificationService.getNotifications();
    setNotifications(fetchedNotifications);
  };
  fetchNotifications();
}, []);

// Handle notification press
const handleNotificationPress = async (notification) => {
  await notificationService.markAsRead(notification.id);
  // Update local state and handle navigation
};
```

### Header Integration
The notification icon is added to the header:

```tsx
<View style={styles.header}>
  {/* Menu button and logo */}
  <NotificationIcon
    unreadCount={unreadNotificationsCount}
    onPress={() => setNotificationsVisible(true)}
    size={24}
  />
</View>
```

### Notification List Modal
The notification list is rendered at the bottom of the component:

```tsx
<NotificationList
  visible={notificationsVisible}
  notifications={notifications}
  onClose={() => setNotificationsVisible(false)}
  onNotificationPress={handleNotificationPress}
  onMarkAllAsRead={handleMarkAllAsRead}
/>
```

## Styling

### Read vs Unread Notifications
- **Unread**: Blue background (`colors.primaryContainer`), bold title, dark text
- **Read**: White background, muted colors, lighter text

### Notification Types
- **Info**: ℹ️ Blue color
- **Success**: ✅ Green color  
- **Warning**: ⚠️ Orange color
- **Error**: ❌ Red color

### Badge Styling
- Red background with white text
- Positioned top-right of bell icon
- Shows count or "99+" for large numbers

## API Integration

The system is designed to work with a backend API:

```typescript
// GET /api/provider/notifications
// PUT /api/provider/notifications/:id/read
// PUT /api/provider/notifications/read-all
```

Currently uses mock data for development, but can easily be switched to real API calls.

## Future Enhancements

- Push notifications support
- Notification preferences/settings
- Notification sound/vibration
- Notification history pagination
- Real-time WebSocket updates
- Notification templates
- Email/SMS notification integration

## Testing

To test the notification system:

1. Run the app and navigate to Dashboard
2. Tap the bell icon in the header
3. View the notification list
4. Tap individual notifications to mark as read
5. Use "Mark All as Read" button
6. Pull down to refresh and see notifications update

The system includes sample notifications for testing:
- New lead available (unread)
- Payment successful (unread)  
- Lead expired (read)
- System maintenance (read)
