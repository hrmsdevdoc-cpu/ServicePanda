import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { colors } from '../utils/theme';

interface CurrentTimeNotificationProps {
  visible: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onPress?: () => void;
  onClose?: () => void;
  showCurrentTime?: boolean;
  autoHide?: boolean;
  duration?: number;
}

const CurrentTimeNotification: React.FC<CurrentTimeNotificationProps> = ({
  visible,
  title,
  message,
  type = 'info',
  onPress,
  onClose,
  showCurrentTime = true,
  autoHide = true,
  duration = 5000,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [slideAnim] = useState(new Animated.Value(-100));
  const [isVisible, setIsVisible] = useState(false);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle visibility animation
  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();

      // Auto hide if enabled
      if (autoHide) {
        const hideTimer = setTimeout(() => {
          hideNotification();
        }, duration);

        return () => clearTimeout(hideTimer);
      }
    } else {
      hideNotification();
    }
  }, [visible]);

  const hideNotification = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
      onClose?.();
    });
  };

  const getNotificationColor = () => {
    switch (type) {
      case 'success':
        return '#10B981';
      case 'error':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      case 'info':
      default:
        return '#3B82F6';
    }
  };

  const getNotificationIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return '🔔';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          borderLeftColor: getNotificationColor(),
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.icon}>{getNotificationIcon()}</Text>
            <Text style={styles.title}>{title}</Text>
          </View>
          {showCurrentTime && (
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
              <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.message}>{message}</Text>
        
        {showCurrentTime && (
          <View style={styles.timestampContainer}>
            <Text style={styles.timestampLabel}>Received at:</Text>
            <Text style={[styles.timestampValue, { color: getNotificationColor() }]}>
              {formatTime(currentTime)} on {formatDate(currentTime)}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.closeButton} onPress={hideNotification}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  timeContainer: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: 'monospace',
  },
  dateText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  timestampLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 6,
  },
  timestampValue: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  closeButton: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  closeText: {
    fontSize: 20,
    color: colors.textSecondary,
    fontWeight: '300',
  },
});

export default CurrentTimeNotification;
