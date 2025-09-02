const React = require('react');
const { View, Text, TouchableOpacity, StyleSheet } = require('react-native');
const { colors } = require('../utils/theme');

interface NotificationIconProps {
  unreadCount: number;
  onPress: () => void;
  size?: number;
}

function NotificationIcon({ unreadCount, onPress, size = 24 }: NotificationIconProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Text style={[styles.bellIcon, { fontSize: size }]}>🔔</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 16,
  },
  iconContainer: {
    position: 'relative',
  },
  bellIcon: {
    color: colors.text,
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
});

module.exports = NotificationIcon;
