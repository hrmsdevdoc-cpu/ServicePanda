import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  AppState,
  AppStateStatus,
} from 'react-native';
import CurrentTimeNotification from './CurrentTimeNotification';
import realTimeNotificationService from '../services/realTimeNotificationService';
import oneSignalService, { NotificationPayload } from '../services/oneSignalService';
import simpleNotificationService from '../services/simpleNotificationService';

interface RealTimeNotificationControllerProps {
  children: React.ReactNode;
  oneSignalAppId?: string;
}

interface ActiveNotification {
  id: string;
  payload: NotificationPayload;
  timestamp: Date;
}

const RealTimeNotificationController: React.FC<RealTimeNotificationControllerProps> = ({
  children,
  oneSignalAppId = 'a3f5070d-9c46-44cd-8b0a-259df155ae94', // ServicePandaProvider OneSignal App ID
}) => {
  const [activeNotifications, setActiveNotifications] = useState<ActiveNotification[]>([]);
  const [isServiceRunning, setIsServiceRunning] = useState(false);
  const appState = useRef(AppState.currentState);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Initialize services on mount
  useEffect(() => {
    initializeServices();
    
    return () => {
      cleanup();
    };
  }, []);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  const initializeServices = async () => {
    try {
      // Initialize notification service
      console.log('🔄 Initializing notification services...');
      
      // Primary notification system: OneSignal (most reliable)
      console.log('🔔 Primary: OneSignal push notifications');
      console.log('💡 Secondary: Local notification services (if available)');

      // Try to initialize OneSignal first (main notification system)
      try {
        await oneSignalService.initialize(oneSignalAppId);
        console.log('✅ OneSignal service initialized (primary)');
      } catch (error) {
        console.log('⚠️ OneSignal failed, but continuing with fallbacks...');
      }

      // Secondary: Try local notification services (optional)
      try {
        // Initialize simple notification service (no native dependencies)
        await simpleNotificationService.initialize();
        console.log('✅ Simple notification service initialized (secondary)');
      } catch (error) {
        console.log('⚠️ Simple notification service failed, skipping...');
      }

      // Tertiary: Try system notifications if available
      try {
        // Initialize real system notification service (requires proper linking)
        const realSystemNotificationService = await import('../services/realSystemNotificationService');
        await realSystemNotificationService.default.initialize();
        console.log('✅ Real system notifications initialized (tertiary)');
      } catch (error) {
        console.log('⚠️ System notifications unavailable:', error.message || 'Linking issue');
        console.log('💡 Run: npx react-native run-android to fix linking');
      }

      // Quaternary: API polling service
      try {
        // Initialize notification API service for server polling
        const notificationApiService = await import('../services/notificationApiService');
        notificationApiService.default.initialize();
        console.log('✅ API notification service initialized (quaternary)');
      } catch (error) {
        console.log('⚠️ API notification service failed, skipping...');
      }

      // Quinary: Device registration (best effort)
      try {
        // Register device for push notifications
        const deviceRegistrationService = await import('../services/deviceRegistrationService');
        await deviceRegistrationService.default.registerDeviceForNotifications();
        console.log('✅ Device registered for push notifications (quinary)');
      } catch (error) {
        console.log('⚠️ Device registration failed, skipping...');
      }

      // Check device registration status after initialization
      setTimeout(async () => {
        try {
          const deviceStatus = await oneSignalService.checkDeviceStatus();
          if (deviceStatus.isRegistered) {
            console.log('🎉 Device is registered and ready for push notifications!');
          } else {
            console.log('⚠️ Device not registered with OneSignal - push notifications will not work');
          }
        } catch (error) {
          console.log('Could not check device status');
        }
      }, 3000);

      // Setup notification listeners
      const unsubscribeOneSignal = oneSignalService.onNotificationReceived(handleNotificationReceived);
      const unsubscribeRealTime = realTimeNotificationService.addListener(handleNotificationReceived);

      // Start real-time service
      realTimeNotificationService.start();
      setIsServiceRunning(true);

      console.log('✅ All notification services initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize notification services:', error);
      // Don't show alert, just continue with basic functionality
      console.log('⚠️ Continuing with basic notification functionality...');
      
      // Still start the real-time service even if OneSignal fails
      try {
        const unsubscribeRealTime = realTimeNotificationService.addListener(handleNotificationReceived);
        realTimeNotificationService.start();
        setIsServiceRunning(true);
        console.log('✅ Basic notification service started');
      } catch (basicError) {
        console.error('❌ Failed to start basic notification service:', basicError);
      }
    }
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log('📱 App has come to the foreground');
      // App came to foreground - restart services if needed
      if (!isServiceRunning) {
        realTimeNotificationService.start();
        setIsServiceRunning(true);
      }
    } else if (nextAppState.match(/inactive|background/)) {
      console.log('📱 App has gone to the background');
      // App went to background - services will continue running
    }

    appState.current = nextAppState;
  };

  const handleNotificationReceived = (payload: NotificationPayload) => {
    console.log('🔔 New notification received:', payload.title);

    const newNotification: ActiveNotification = {
      id: payload.id,
      payload,
      timestamp: new Date(),
    };

    // Add to active notifications (limit to 3 visible at once)
    setActiveNotifications(prev => {
      const updated = [newNotification, ...prev.slice(0, 2)];
      return updated;
    });

    // Auto-remove after 10 seconds if not manually closed
    setTimeout(() => {
      removeNotification(payload.id);
    }, 10000);
  };

  const removeNotification = (notificationId: string) => {
    setActiveNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleNotificationPress = (notification: ActiveNotification) => {
    console.log('👆 Notification pressed:', notification.payload.title);
    
    // Handle navigation based on notification type
    if (notification.payload.type === 'lead') {
      // Navigate to leads screen
      console.log('Navigating to leads...');
    } else if (notification.payload.type === 'payment') {
      // Navigate to payment screen
      console.log('Navigating to payments...');
    }

    // Remove the notification
    removeNotification(notification.id);
  };

  const cleanup = () => {
    console.log('🧹 Cleaning up notification services...');
    realTimeNotificationService.stop();
    oneSignalService.cleanup();
    setIsServiceRunning(false);
  };

  return (
    <View style={styles.container}>
      {children}
      
      {/* Render active notifications */}
      {activeNotifications.map((notification, index) => (
        <CurrentTimeNotification
          key={notification.id}
          visible={true}
          title={notification.payload.title}
          message={notification.payload.message}
          type={getNotificationType(notification.payload.type)}
          onPress={() => handleNotificationPress(notification)}
          onClose={() => removeNotification(notification.id)}
          showCurrentTime={true}
          autoHide={false} // Manual control for better UX
          style={{
            top: 60 + (index * 120), // Stack notifications vertically
            zIndex: 1000 - index, // Ensure proper layering
          }}
        />
      ))}

      {/* Debug info (remove in production) */}
      {__DEV__ && (
        <View style={styles.debugContainer}>
          <View style={styles.debugInfo}>
            <View style={styles.debugRow}>
              <View style={styles.statusIndicator} />
              <View>
                <Text style={styles.debugTextSmall}>
                  Service: {isServiceRunning ? 'Running' : 'Stopped'}
                </Text>
                <Text style={styles.debugTextSmall}>
                  Time: {currentTime.toLocaleTimeString()}
                </Text>
                <Text style={styles.debugTextSmall}>
                  Active: {activeNotifications.length}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

// Helper function to convert notification type
const getNotificationType = (type: string): 'success' | 'error' | 'warning' | 'info' => {
  switch (type) {
    case 'lead':
      return 'success';
    case 'payment':
      return 'success';
    case 'system':
      return 'info';
    case 'general':
    default:
      return 'info';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  debugContainer: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    zIndex: 999,
  },
  debugInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    padding: 8,
  },
  debugRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  debugTextSmall: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'monospace',
  },
});

export default RealTimeNotificationController;
