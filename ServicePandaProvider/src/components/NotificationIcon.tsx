const React = require('react');
const { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } = require('react-native');
const { IconButton } = require('react-native-paper');
const { colors } = require('../utils/theme');
// Import vector icons
const Icon = require('react-native-vector-icons/MaterialIcons').default;

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
  const [showPreview, setShowPreview] = React.useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const badgeScale = React.useRef(new Animated.Value(0)).current;
  const previewOpacity = React.useRef(new Animated.Value(0)).current;
  const previewTimer = React.useRef(null);

  // Pulse animation for unread notifications
  React.useEffect(() => {
    if (unreadCount > 0) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
    }
  }, [unreadCount]);

  // Badge animation
  React.useEffect(() => {
    if (unreadCount > 0) {
      Animated.spring(badgeScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(badgeScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [unreadCount]);

  // Auto-hide notification preview
  React.useEffect(() => {
    if (latestNotification && unreadCount > 0) {
      // Show preview with fade in animation
      setShowPreview(true);
      Animated.timing(previewOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Clear any existing timer
      if (previewTimer.current) {
        clearTimeout(previewTimer.current);
      }

      // Set timer to hide preview after 4 seconds
      previewTimer.current = setTimeout(() => {
        Animated.timing(previewOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowPreview(false);
        });
      }, 4000);
    } else {
      // Hide preview immediately if no notification
      setShowPreview(false);
      Animated.timing(previewOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    // Cleanup timer on unmount
    return () => {
      if (previewTimer.current) {
        clearTimeout(previewTimer.current);
      }
    };
  }, [latestNotification, unreadCount]);

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

  const handlePress = () => {
    // Scale animation on press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress();
  };

  const handlePreviewPress = () => {
    // Hide preview immediately when tapped
    if (previewTimer.current) {
      clearTimeout(previewTimer.current);
    }
    
    Animated.timing(previewOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowPreview(false);
    });
    
    // Also trigger the main notification press
    onPress();
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.iconContainer,
          {
            transform: [
              { scale: scaleAnim },
              { scale: pulseAnim },
            ],
          },
        ]}
      >
        <TouchableOpacity
          onPress={handlePress}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Icon 
            name="notifications" 
            size={size} 
            color={unreadCount > 0 ? "#EF4444" : "#6B7280"} 
            style={styles.bellIcon} 
          />
        </TouchableOpacity>
        
        {unreadCount > 0 && (
          <Animated.View 
            style={[
              styles.badge,
              {
                transform: [{ scale: badgeScale }],
              },
            ]}
          >
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </Animated.View>
        )}
      </Animated.View>
      
      {/* Latest notification preview */}
      {showPreview && latestNotification && unreadCount > 0 && (
        <TouchableOpacity
          onPress={handlePreviewPress}
          activeOpacity={0.8}
        >
          <Animated.View 
            style={[
              styles.previewContainer,
              {
                opacity: previewOpacity,
              },
            ]}
          >
            <Text style={styles.previewTitle} numberOfLines={1}>
              {latestNotification.title}
            </Text>
            <Text style={styles.previewMessage} numberOfLines={2}>
              {latestNotification.message}
            </Text>
            <Text style={styles.previewTime}>
              {formatTime(latestNotification.timestamp)}
            </Text>
          </Animated.View>
        </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  previewContainer: {
    position: 'absolute',
    top: 50,
    right: 0,
    width: 280,
    height: 80,
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
