import { AppState } from 'react-native';
import oneSignalService, { NotificationPayload } from './oneSignalService';
import androidNotificationService from './androidNotificationService';
import simpleNotificationService from './simpleNotificationService';
import workingNotificationService from './workingNotificationService';
import systemNotificationService from './systemNotificationService';

interface TimeBasedNotification {
  id: string;
  title: string;
  message: string;
  type: 'lead' | 'payment' | 'system' | 'general';
  intervalMinutes: number;
  enabled: boolean;
  lastTriggered?: Date;
}

interface NotificationSchedule {
  id: string;
  name: string;
  notifications: TimeBasedNotification[];
  enabled: boolean;
}

class RealTimeNotificationService {
  private isRunning = false;
  private schedules: NotificationSchedule[] = [];
  private intervalId: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL = 60000; // Check every minute
  private listeners: Array<(notification: NotificationPayload) => void> = [];

  constructor() {
    this.initializeDefaultSchedules();
  }

  // Initialize with default notification schedules
  private initializeDefaultSchedules() {
    this.schedules = [
      {
        id: 'customer-requests',
        name: 'Customer Request Updates',
        enabled: true,
        notifications: [
          {
            id: 'new-requests-check',
            title: 'New Customer Requests',
            message: 'Checking for new customer service requests in your area',
            type: 'lead',
            intervalMinutes: 5, // Every 5 minutes
            enabled: true
          },
          {
            id: 'urgent-requests',
            title: 'Urgent Service Request',
            message: 'High-priority customer request needs immediate attention',
            type: 'lead',
            intervalMinutes: 15, // Every 15 minutes
            enabled: true
          }
        ]
      },
      {
        id: 'system-updates',
        name: 'System Status Updates',
        enabled: true,
        notifications: [
          {
            id: 'system-heartbeat',
            title: 'System Status',
            message: 'ServicePanda system is running smoothly',
            type: 'system',
            intervalMinutes: 30, // Every 30 minutes
            enabled: true
          },
          {
            id: 'daily-summary',
            title: 'Daily Activity Summary',
            message: 'Your daily activity and earnings summary is ready',
            type: 'general',
            intervalMinutes: 1440, // Once per day (1440 minutes)
            enabled: true
          }
        ]
      }
    ];
  }

  // Start the real-time notification service (TEMPORARILY DISABLED)
  start() {
    console.log('⚠️ Real-time notification service DISABLED to avoid spam');
    console.log('Only manual test button will work now');
    this.isRunning = false; // Keep it stopped
    return;
    
    // OLD CODE (commented out):
    // if (this.isRunning) {
    //   console.log('Real-time notification service is already running');
    //   return;
    // }
    // console.log('Starting real-time notification service...');
    // this.isRunning = true;
    // this.intervalId = setInterval(() => {
    //   this.checkAndTriggerNotifications();
    // }, this.CHECK_INTERVAL);
    // this.checkAndTriggerNotifications();
  }

  // Stop the service
  stop() {
    if (!this.isRunning) {
      return;
    }

    console.log('Stopping real-time notification service...');
    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Check all schedules and trigger notifications if needed
  private checkAndTriggerNotifications() {
    const now = new Date();
    console.log(`🕐 Checking notifications at ${now.toLocaleTimeString()}`);

    this.schedules.forEach(schedule => {
      if (!schedule.enabled) return;

      schedule.notifications.forEach(notification => {
        if (!notification.enabled) return;

        const shouldTrigger = this.shouldTriggerNotification(notification, now);
        if (shouldTrigger) {
          this.triggerNotification(notification, now);
        }
      });
    });
  }

  // Determine if a notification should be triggered
  private shouldTriggerNotification(notification: TimeBasedNotification, now: Date): boolean {
    if (!notification.lastTriggered) {
      return true; // First time, always trigger
    }

    const timeSinceLastTrigger = now.getTime() - notification.lastTriggered.getTime();
    const intervalMs = notification.intervalMinutes * 60 * 1000;

    return timeSinceLastTrigger >= intervalMs;
  }

  // Trigger a specific notification
  private triggerNotification(notification: TimeBasedNotification, now: Date) {
    const currentTime = now.toLocaleTimeString();
    const currentDate = now.toLocaleDateString();
    
    console.log(`🔔 Triggering notification: ${notification.title} at ${currentTime}`);

    // Create enhanced message with current time
    const enhancedMessage = `${notification.message} - ${currentDate} at ${currentTime}`;
    
    // Create notification payload
    const payload: NotificationPayload = {
      id: `${notification.id}-${now.getTime()}`,
      title: notification.title,
      message: enhancedMessage,
      type: notification.type,
      timestamp: now.toISOString(),
      data: {
        scheduleId: notification.id,
        triggeredAt: currentTime,
        triggeredDate: currentDate,
        isRealTime: true
      }
    };

    // DISABLED ALL OTHER NOTIFICATIONS - Only test button will work
    console.log('⚠️ Real-time notifications temporarily disabled to avoid spam');
    
    // Comment out all notification services to stop spam
    // systemNotificationService.showSystemNotification(notification.title, enhancedMessage, notification.type);
    // workingNotificationService.showNotification(notification.title, enhancedMessage, notification.type);
    // simpleNotificationService.showNotification(notification.title, enhancedMessage, notification.type);
    // oneSignalService.sendTimeBasedNotification(notification.title, enhancedMessage, notification.type);
    // androidNotificationService.showNotification(notification.title, enhancedMessage, notification.type);

    // Notify local listeners
    this.notifyListeners(payload);

    // Update last triggered time
    notification.lastTriggered = now;

    // Log for debugging
    console.log(`✅ Notification sent: ${notification.title} - Next in ${notification.intervalMinutes} minutes`);
  }

  // Notify all registered listeners
  private notifyListeners(notification: NotificationPayload) {
    this.listeners.forEach(listener => {
      try {
        listener(notification);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });
  }

  // Register a listener for real-time notifications
  addListener(listener: (notification: NotificationPayload) => void) {
    this.listeners.push(listener);
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Manually trigger a test notification with current time
  sendTestNotification(title: string = 'Test Notification', message: string = 'This is a test notification') {
    const now = new Date();
    const currentTime = now.toLocaleTimeString();
    const currentDate = now.toLocaleDateString();

    const testNotification: TimeBasedNotification = {
      id: 'manual-test',
      title: `${title} - ${currentTime}`,
      message: `${message} sent on ${currentDate} at ${currentTime}`,
      type: 'system',
      intervalMinutes: 0,
      enabled: true
    };

    this.triggerNotification(testNotification, now);
  }

  // Get current schedule status
  getScheduleStatus() {
    return {
      isRunning: this.isRunning,
      schedules: this.schedules,
      nextCheckIn: this.isRunning ? `${Math.ceil(this.CHECK_INTERVAL / 1000)} seconds` : 'Stopped',
      currentTime: new Date().toLocaleTimeString()
    };
  }

  // Enable/disable a specific schedule
  toggleSchedule(scheduleId: string, enabled: boolean) {
    const schedule = this.schedules.find(s => s.id === scheduleId);
    if (schedule) {
      schedule.enabled = enabled;
      console.log(`Schedule "${schedule.name}" ${enabled ? 'enabled' : 'disabled'}`);
    }
  }

  // Enable/disable a specific notification
  toggleNotification(scheduleId: string, notificationId: string, enabled: boolean) {
    const schedule = this.schedules.find(s => s.id === scheduleId);
    if (schedule) {
      const notification = schedule.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.enabled = enabled;
        console.log(`Notification "${notification.title}" ${enabled ? 'enabled' : 'disabled'}`);
      }
    }
  }

  // Update notification interval
  updateNotificationInterval(scheduleId: string, notificationId: string, intervalMinutes: number) {
    const schedule = this.schedules.find(s => s.id === scheduleId);
    if (schedule) {
      const notification = schedule.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.intervalMinutes = intervalMinutes;
        console.log(`Notification "${notification.title}" interval updated to ${intervalMinutes} minutes`);
      }
    }
  }

  // Get all active notifications with their next trigger times
  getActiveNotifications() {
    const now = new Date();
    const active: Array<{
      id: string;
      title: string;
      type: string;
      intervalMinutes: number;
      nextTriggerIn: string;
      lastTriggered?: string;
    }> = [];

    this.schedules.forEach(schedule => {
      if (!schedule.enabled) return;

      schedule.notifications.forEach(notification => {
        if (!notification.enabled) return;

        let nextTriggerIn = 'Now';
        if (notification.lastTriggered) {
          const timeSinceLastTrigger = now.getTime() - notification.lastTriggered.getTime();
          const intervalMs = notification.intervalMinutes * 60 * 1000;
          const timeUntilNext = Math.max(0, intervalMs - timeSinceLastTrigger);
          
          if (timeUntilNext > 0) {
            const minutes = Math.ceil(timeUntilNext / (60 * 1000));
            nextTriggerIn = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
          }
        }

        active.push({
          id: notification.id,
          title: notification.title,
          type: notification.type,
          intervalMinutes: notification.intervalMinutes,
          nextTriggerIn,
          lastTriggered: notification.lastTriggered?.toLocaleTimeString()
        });
      });
    });

    return active;
  }
}

// Create singleton instance
const realTimeNotificationService = new RealTimeNotificationService();

export default realTimeNotificationService;
export type { TimeBasedNotification, NotificationSchedule };
