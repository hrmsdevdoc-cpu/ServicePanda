const React = require('react');
const { View, Text, TouchableOpacity, StyleSheet } = require('react-native');
const { IconButton } = require('react-native-paper');
const { colors } = require('../utils/theme');

interface NotificationIconProps {
  unreadCount: number;
  onPress: () => void;
  size?: number;
}

function NotificationIcon({ unreadCount, onPress, size = 24 }: NotificationIconProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <IconButton
          icon="bell"
          size={size + 8}
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
});

module.exports = NotificationIcon;
