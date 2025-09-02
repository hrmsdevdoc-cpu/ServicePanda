const React = require('react');
const { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Modal,
  Dimensions 
} = require('react-native');
const { colors } = require('../utils/theme');

const { width, height } = Dimensions.get('window');

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
  category?: 'lead' | 'payment' | 'system' | 'general';
}

interface NotificationListProps {
  visible: boolean;
  notifications: Notification[];
  onClose: () => void;
  onNotificationPress: (notification: Notification) => void;
  onMarkAllAsRead: () => void;
}

function NotificationList({ 
  visible, 
  notifications, 
  onClose, 
  onNotificationPress, 
  onMarkAllAsRead 
}: NotificationListProps) {
  const [isMarkingAllRead, setIsMarkingAllRead] = React.useState(false);
  const [markingAsReadIds, setMarkingAsReadIds] = React.useState(new Set());
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const readCount = notifications.filter(n => n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      case 'info':
      default:
        return colors.info;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleMarkAllAsReadWithLoading = async () => {
    setIsMarkingAllRead(true);
    try {
      await onMarkAllAsRead();
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  const handleNotificationPressWithLoading = async (notification: Notification) => {
    if (notification.isRead) {
      onNotificationPress(notification);
      return;
    }
    
    setMarkingAsReadIds((prev: any) => new Set(prev).add(notification.id));
    try {
      await onNotificationPress(notification);
    } finally {
      setMarkingAsReadIds((prev: any) => {
        const newSet = new Set(prev);
        newSet.delete(notification.id);
        return newSet;
      });
    }
  };

  const renderNotification = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationItem,
        notification.isRead ? styles.readNotification : styles.unreadNotification
      ]}
      onPress={() => handleNotificationPressWithLoading(notification)}
      activeOpacity={0.7}
      disabled={markingAsReadIds.has(notification.id)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationIconContainer}>
          <Text style={styles.notificationIcon}>
            {getNotificationIcon(notification.type)}
          </Text>
        </View>
        <View style={styles.notificationContent}>
          <Text style={[
            styles.notificationTitle,
            notification.isRead ? styles.readTitle : styles.unreadTitle
          ]}>
            {notification.title}
          </Text>
          <Text style={[
            styles.notificationMessage,
            notification.isRead ? styles.readMessage : styles.unreadMessage
          ]}>
            {notification.message}
          </Text>
          <Text style={styles.timestamp}>
            {formatTimestamp(notification.timestamp)}
          </Text>
        </View>
        {!notification.isRead && (
          <View style={[styles.unreadDot, { backgroundColor: getNotificationColor(notification.type) }]} />
        )}
        {markingAsReadIds.has(notification.id) && (
          <View style={styles.loadingIndicator}>
            <Text style={styles.loadingText}>...</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
          <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Dropdown Arrow */}
          <View style={styles.dropdownArrow} />
          
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerContent}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <View style={styles.notificationStats}>
                <Text style={styles.statText}>
                  {unreadCount} unread • {readCount} read
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {unreadCount > 0 && (
              <TouchableOpacity 
                style={[styles.markAllReadButton, isMarkingAllRead && styles.markAllReadButtonDisabled]} 
                onPress={handleMarkAllAsReadWithLoading}
                disabled={isMarkingAllRead}
              >
                <Text style={[styles.markAllReadText, isMarkingAllRead && styles.markAllReadTextDisabled]}>
                  {isMarkingAllRead ? 'Marking...' : 'Mark All as Read'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Notifications List */}
          <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
            {notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>🔔</Text>
                <Text style={styles.emptyStateTitle}>No notifications yet</Text>
                <Text style={styles.emptyStateMessage}>
                  You're all caught up! New notifications will appear here.
                </Text>
              </View>
            ) : (
              <>
                {/* Unread notifications first */}
                {notifications.filter(n => !n.isRead).map(renderNotification)}
                
                {/* Read notifications */}
                {notifications.filter(n => n.isRead).map(renderNotification)}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    maxHeight: height * 0.98,
    minHeight: height * 0.8,
    marginTop: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerContent: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 3,
  },
  notificationStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  actionButtons: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  markAllReadButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primary,
    borderRadius: 16,
  },
  markAllReadText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  markAllReadButtonDisabled: {
    backgroundColor: colors.borderLight,
    opacity: 0.6,
  },
  markAllReadTextDisabled: {
    color: colors.textSecondary,
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  readNotification: {
    backgroundColor: colors.surface,
  },
  unreadNotification: {
    backgroundColor: colors.primaryContainer,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIconContainer: {
    marginRight: 10,
    marginTop: 1,
  },
  notificationIcon: {
    fontSize: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 3,
  },
  readTitle: {
    color: colors.textSecondary,
  },
  unreadTitle: {
    color: colors.text,
  },
  notificationMessage: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 6,
  },
  readMessage: {
    color: colors.textTertiary,
  },
  unreadMessage: {
    color: colors.textSecondary,
  },
  timestamp: {
    fontSize: 10,
    color: colors.textTertiary,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 6,
    marginTop: 6,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  dropdownArrow: {
    position: 'absolute',
    top: -8,
    right: 20,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.surface,
  },
  loadingIndicator: {
    marginLeft: 8,
    marginTop: 8,
  },
  loadingText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
});

module.exports = NotificationList;
