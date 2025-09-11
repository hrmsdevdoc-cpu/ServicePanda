const React = require('react');
const { View, Text, TouchableOpacity, StyleSheet } = require('react-native');
const { IconButton } = require('react-native-paper');
const { colors } = require('../utils/theme');

interface NotificationIconProps {
  unreadCount: number;
  onPress: () => void;
  size?: number;
  latestNotification?: {
    title: string;
    message: string;
    timestamp: string;
  };
}

function NotificationIcon({ unreadCount, onPress, size = 20, latestNotification }: NotificationIconProps) {
  const formatTime = (timestamp: string) => {
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

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <IconButton
          icon="bell"
          size={size}
          iconColor={colors.text}
          onPress={onPress}
          style={styles.iconButton}
        />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </View>
      
      {/* Latest notification preview */}
      {latestNotification && unreadCount > 0 && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle} numberOfLines={1}>
            {latestNotification.title}
          </Text>
          <Text style={styles.previewMessage} numberOfLines={2}>
            {latestNotification.message}
          </Text>
          <Text style={styles.previewTime}>
            {formatTime(latestNotification.timestamp)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 16,
  },
  iconContainer: {
    position: 'relative',
  },
  iconButton: {
    margin: 0,
    backgroundColor: colors.surface,
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  badgeText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  previewContainer: {
    position: 'absolute',
    top: 50,
    right: 0,
    width: 280,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
    zIndex: 1000,
  },
  previewTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  previewMessage: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 14,
    marginBottom: 4,
  },
  previewTime: {
    fontSize: 10,
    color: colors.textTertiary,
  },
});

module.exports = NotificationIcon;
