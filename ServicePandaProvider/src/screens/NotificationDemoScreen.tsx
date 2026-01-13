const React = require('react');
const {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} = require('react-native');
const { colors } = require('../utils/theme');
const NotificationToast = require('../components/NotificationToast');
const NotificationList = require('../components/NotificationList');
const NotificationIcon = require('../components/NotificationIcon');
const notificationService = require('../services/notificationService');

const NotificationDemoScreen = () => {
  const [notifications, setNotifications] = React.useState([]);
  const [showNotificationList, setShowNotificationList] = React.useState(false);
  const [currentToast, setCurrentToast] = React.useState(null);

  React.useEffect(() => {
    // Load initial notifications
    setNotifications(notificationService.getNotifications());

    // Subscribe to updates
    const unsubscribe = notificationService.addNotificationListener((newNotifications) => {
      setNotifications(newNotifications);
    });

    const unsubscribeToast = notificationService.addToastListener((toast) => {
      setCurrentToast(toast);
    });

    return () => {
      unsubscribe();
      unsubscribeToast();
    };
  }, []);

  const handleNotificationPress = async (notification) => {
    notificationService.markAsRead(notification.id);
    Alert.alert('Notification Pressed', `You pressed: ${notification.title}`);
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

  // Demo functions
  const showSuccessToast = () => {
    notificationService.showSuccess(
      'Success!',
      'Your action was completed successfully',
      { category: 'system' }
    );
  };

  const showErrorToast = () => {
    notificationService.showError(
      'Error!',
      'Something went wrong. Please try again.',
      { category: 'system' }
    );
  };

  const showWarningToast = () => {
    notificationService.showWarning(
      'Warning!',
      'Please check your internet connection',
      { category: 'general' }
    );
  };

  const showInfoToast = () => {
    notificationService.showInfo(
      'Info',
      'New features are available in the app',
      { category: 'general' }
    );
  };

  const addSampleNotification = () => {
    notificationService.addNotification({
      title: 'New Demo Notification',
      message: 'This is a sample notification created for testing purposes',
      type: 'info',
      category: 'general',
      priority: 'medium',
    });
  };

  const addHighPriorityNotification = () => {
    notificationService.addNotification({
      title: 'URGENT: High Priority Alert',
      message: 'This is a high priority notification that will show a toast',
      type: 'error',
      category: 'system',
      priority: 'high',
    });
  };

  const clearAllNotifications = () => {
    notificationService.clearAllNotifications();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const latestNotification = notifications.find(n => !n.isRead);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Notification Demo</Text>
          <Text style={styles.subtitle}>Test all notification components</Text>
        </View>

        {/* Notification Icon Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Icon</Text>
          <View style={styles.iconDemo}>
            <NotificationIcon
              unreadCount={unreadCount}
              onPress={() => setShowNotificationList(true)}
              latestNotification={latestNotification}
              size={24}
            />
            <Text style={styles.iconLabel}>
              {unreadCount} unread notifications
            </Text>
          </View>
        </View>

        {/* Toast Notifications Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Toast Notifications</Text>
          <View style={styles.buttonGrid}>
            <TouchableOpacity style={[styles.demoButton, styles.successButton]} onPress={showSuccessToast}>
              <Text style={styles.buttonText}>Success Toast</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.demoButton, styles.errorButton]} onPress={showErrorToast}>
              <Text style={styles.buttonText}>Error Toast</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.demoButton, styles.warningButton]} onPress={showWarningToast}>
              <Text style={styles.buttonText}>Warning Toast</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.demoButton, styles.infoButton]} onPress={showInfoToast}>
              <Text style={styles.buttonText}>Info Toast</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notification Management Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Management</Text>
          <View style={styles.buttonGrid}>
            <TouchableOpacity style={[styles.demoButton, styles.primaryButton]} onPress={addSampleNotification}>
              <Text style={styles.buttonText}>Add Sample</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.demoButton, styles.urgentButton]} onPress={addHighPriorityNotification}>
              <Text style={styles.buttonText}>Add Urgent</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.demoButton, styles.secondaryButton]} onPress={clearAllNotifications}>
              <Text style={styles.buttonText}>Clear All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.demoButton, styles.secondaryButton]} onPress={() => setShowNotificationList(true)}>
              <Text style={styles.buttonText}>View All</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{notifications.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{unreadCount}</Text>
              <Text style={styles.statLabel}>Unread</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{notifications.filter(n => n.isRead).length}</Text>
              <Text style={styles.statLabel}>Read</Text>
            </View>
          </View>
        </View>
      </ScrollView>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  iconDemo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLabel: {
    marginLeft: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  demoButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  successButton: {
    backgroundColor: colors.success,
  },
  errorButton: {
    backgroundColor: colors.error,
  },
  warningButton: {
    backgroundColor: colors.warning,
  },
  infoButton: {
    backgroundColor: colors.info,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  urgentButton: {
    backgroundColor: '#ff6b6b',
  },
  secondaryButton: {
    backgroundColor: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
});

module.exports = NotificationDemoScreen;
