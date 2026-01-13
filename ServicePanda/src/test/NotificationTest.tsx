const React = require('react');
const { View, Text, TouchableOpacity, StyleSheet, Alert } = require('react-native');
const NotificationList = require('../components/NotificationList');
const notificationService = require('../services/notifications');

const NotificationTest = () => {
  const [notifications, setNotifications] = React.useState([]);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
      console.log('Loaded notifications:', data);
    } catch (error) {
      console.error('Error loading notifications:', error);
      Alert.alert('Error', 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationPress = async (notification: any) => {
    try {
      await notificationService.markAsRead(notification.id);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
      Alert.alert('Notification', `Clicked: ${notification.title}`);
    } catch (error) {
      console.error('Error handling notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      Alert.alert('Success', 'All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  React.useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Test</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => setShowNotifications(true)}
      >
        <Text style={styles.buttonText}>
          Show Notifications ({notifications.length})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={loadNotifications}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Loading...' : 'Reload Notifications'}
        </Text>
      </TouchableOpacity>

      <NotificationList
        visible={showNotifications}
        notifications={notifications}
        onClose={() => setShowNotifications(false)}
        onNotificationPress={handleNotificationPress}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

module.exports = NotificationTest;
