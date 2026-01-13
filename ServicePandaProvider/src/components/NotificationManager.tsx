const React = require('react');
const { View, StyleSheet } = require('react-native');
const NotificationToast = require('./NotificationToast');
const NotificationList = require('./NotificationList');
const NotificationIcon = require('./NotificationIcon');
const notificationService = require('../services/notificationService');

interface NotificationManagerProps {
  children: React.ReactNode;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({ children }) => {
  const [notifications, setNotifications] = React.useState([]);
  const [currentToast, setCurrentToast] = React.useState(null);
  const [showNotificationList, setShowNotificationList] = React.useState(false);

  // Load notifications on mount
  React.useEffect(() => {
    setNotifications(notificationService.getNotifications());

    // Subscribe to notification updates
    const unsubscribeNotifications = notificationService.addNotificationListener((newNotifications) => {
      setNotifications(newNotifications);
    });

    // Subscribe to toast updates
    const unsubscribeToasts = notificationService.addToastListener((toast) => {
      setCurrentToast(toast);
    });

    return () => {
      unsubscribeNotifications();
      unsubscribeToasts();
    };
  }, []);

  const handleNotificationPress = async (notification) => {
    // Mark as read
    notificationService.markAsRead(notification.id);
    
    // Handle action if needed
    if (notification.actionUrl) {
      // Navigate to action URL
      console.log('Navigate to:', notification.actionUrl);
    }
  };

  const handleMarkAllAsRead = async () => {
    notificationService.markAllAsRead();
  };

  const handleToastClose = () => {
    if (currentToast) {
      notificationService.removeToast(currentToast.id);
    }
  };

  const handleToastPress = () => {
    if (currentToast?.onPress) {
      currentToast.onPress();
    }
    handleToastClose();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const latestNotification = notifications.find(n => !n.isRead);

  return (
    <View style={styles.container}>
      {children}
      
      {/* Notification Icon - you can place this in your header */}
      <View style={styles.notificationIconContainer}>
        <NotificationIcon
          unreadCount={unreadCount}
          onPress={() => setShowNotificationList(true)}
          latestNotification={latestNotification}
        />
      </View>

      {/* Toast Notification */}
      {currentToast && (
        <NotificationToast
          visible={!!currentToast}
          type={currentToast.type}
          title={currentToast.title}
          message={currentToast.message}
          duration={currentToast.duration}
          actionText={currentToast.actionText}
          onPress={handleToastPress}
          onClose={handleToastClose}
        />
      )}

      {/* Notification List Modal */}
      <NotificationList
        visible={showNotificationList}
        notifications={notifications}
        onClose={() => setShowNotificationList(false)}
        onNotificationPress={handleNotificationPress}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notificationIconContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 100,
  },
});

module.exports = NotificationManager;
