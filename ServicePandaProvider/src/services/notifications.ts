const apiService = require('./api');
const { storage } = require('../utils/storage');

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
  category?: 'lead' | 'payment' | 'system' | 'general';
  metadata?: any;
}

class NotificationService {
  private readNotificationIds: Set<number> = new Set();
  private readonly READ_NOTIFICATIONS_KEY = 'read_notifications';

  constructor() {
    this.loadReadNotifications();
  }

  private async loadReadNotifications(): Promise<void> {
    try {
      const stored = await storage.getItem(this.READ_NOTIFICATIONS_KEY);
      if (stored) {
        const readIds = JSON.parse(stored);
        this.readNotificationIds = new Set(readIds);
      }
    } catch (error) {
      console.error('Error loading read notifications:', error);
    }
  }

  private async saveReadNotifications(): Promise<void> {
    try {
      const readIds = Array.from(this.readNotificationIds);
      await storage.setItem(this.READ_NOTIFICATIONS_KEY, JSON.stringify(readIds));
    } catch (error) {
      console.error('Error saving read notifications:', error);
    }
  }

  private async cleanupOldReadNotifications(): Promise<void> {
    try {
      // Keep only the last 100 read notification IDs to prevent storage bloat
      if (this.readNotificationIds.size > 100) {
        const readIds = Array.from(this.readNotificationIds);
        const recentIds = readIds.slice(-100);
        this.readNotificationIds = new Set(recentIds);
        await this.saveReadNotifications();
      }
    } catch (error) {
      console.error('Error cleaning up old read notifications:', error);
    }
  }

  async getNotifications(): Promise<Notification[]> {
    console.log('🔍 DEBUG: getNotifications called');
    
    try {
      // Get notifications from multiple sources
      const [activities, serverNotifications] = await Promise.allSettled([
        // Source 1: Activities (price drops, expired offers, etc.)
        apiService.getActivity(),
        // Source 2: Server notifications (new customer requests) 
        this.getServerNotifications()
      ]);

      let allNotifications: Notification[] = [];

      // Process activity-based notifications (price drops, etc.)
      if (activities.status === 'fulfilled' && activities.value) {
        const activityNotifications = this.convertActivitiesToNotifications(activities.value);
        allNotifications.push(...activityNotifications);
        // console.log(`📊 Found ${activityNotifications.length} activity-based notifications`);
      }

      // Process server notifications (new requests)
      if (serverNotifications.status === 'fulfilled' && serverNotifications.value) {
        allNotifications.push(...serverNotifications.value);
        // console.log(`📡 Found ${serverNotifications.value.length} server notifications`);
      }

      // Sort by timestamp (newest first)
      allNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      console.log(`🔔 NOTIFICATION SERVICE DEBUG:`);
      console.log(`  Total notifications: ${allNotifications.length}`);
      console.log(`  Unread notifications: ${allNotifications.filter(n => !n.isRead).length}`);
      console.log(`  Read notification IDs: ${Array.from(this.readNotificationIds).length}`);
      return allNotifications;

    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to mock data without throwing error
      return this.getMockNotifications();
    }
  }

  // Get notifications from server (new customer requests)
  private async getServerNotifications(): Promise<Notification[]> {
    try {
      const response = await fetch(`${require('./api').API_BASE_URL}/api/provider/notifications/poll`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-provider-id': '1',
        }
      });

      if (!response.ok) {
        return [];
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return [];
      }

      const data = await response.json();
      const serverNotifs = data.notifications || [];
      
      // Convert server notifications to app notification format
      return serverNotifs.map((notif: any) => ({
        id: parseInt(notif.id) || Date.now(),
        title: notif.title,
        message: notif.message,
        type: this.mapServerNotificationType(notif.type),
        isRead: false,
        timestamp: notif.timestamp || new Date().toISOString(),
        category: 'lead' as const,
        metadata: notif.data
      }));

    } catch (error) {
      // console.log('📄 Server notifications not available yet');
      return [];
    }
  }

  private mapServerNotificationType(serverType: string): 'info' | 'success' | 'warning' | 'error' {
    switch (serverType) {
      case 'customer_request': return 'info';
      case 'payment': return 'success';
      case 'urgent': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  }

  // Get all activities for counting (including offer_expired)
  async getAllActivitiesForCounting(): Promise<any[]> {
    try {
      const activities = await apiService.getActivity();
      return activities || [];
    } catch (error) {
      console.error('Error fetching activities for counting:', error);
      return [];
    }
  }

  async markAsRead(notificationId: number): Promise<boolean> {
    try {
      // Add to local read tracking
      this.readNotificationIds.add(notificationId);

      // Save to persistent storage
      await this.saveReadNotifications();

      // Cleanup old read notifications
      await this.cleanupOldReadNotifications();

      // Try to mark as read on server (this might fail for activity-based notifications)
      try {
        await apiService.put(`/api/provider/notifications/${notificationId}/read`);
      } catch (serverError) {
        // If server call fails, we still mark it as read locally
        console.log('Server notification marking failed, using local tracking only');
      }

      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  async markAllAsRead(): Promise<boolean> {
    try {

      // Get current notifications to mark them all as read locally
      const notifications = await this.getNotifications();

      notifications.forEach(notification => {
        this.readNotificationIds.add(notification.id);
      });


      // Save to persistent storage
      await this.saveReadNotifications();

      // Try to mark all as read on server
      try {
        await apiService.put('/api/provider/notifications/read-all');
      } catch (serverError) {
        // If server call fails, we still mark them as read locally
        console.log('Server mark all as read failed, using local tracking only');
      }

      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const response = await apiService.get('/api/provider/notifications/unread-count');
      return response.data?.count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  // Method to reset all read notifications (for testing)
  async resetReadNotifications(): Promise<void> {
    try {
      this.readNotificationIds.clear();
      await storage.removeItem(this.READ_NOTIFICATIONS_KEY);
      console.log('✅ All read notifications have been reset');
    } catch (error) {
      console.error('Error resetting read notifications:', error);
    }
  }

  // Method to clear old read notifications more aggressively
  async clearOldReadNotifications(): Promise<void> {
    try {
      // Keep only the last 20 read notification IDs
      const readIds = Array.from(this.readNotificationIds);
      if (readIds.length > 20) {
        const recentIds = readIds.slice(-20);
        this.readNotificationIds = new Set(recentIds);
        await this.saveReadNotifications();
        console.log(`🧹 Cleared ${readIds.length - 20} old read notifications`);
      }
    } catch (error) {
      console.error('Error clearing old read notifications:', error);
    }
  }

  // Debug method to check notification counts
  async debugNotificationCounts(): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const unreadCount = notifications.filter(n => !n.isRead).length;
      const totalCount = notifications.length;
      const readIdsCount = this.readNotificationIds.size;
      
      console.log('🔍 Notification Debug Info:');
      console.log(`  Total notifications: ${totalCount}`);
      console.log(`  Unread notifications: ${unreadCount}`);
      console.log(`  Read notifications: ${totalCount - unreadCount}`);
      console.log(`  Stored read IDs: ${readIdsCount}`);
      console.log(`  Read IDs: [${Array.from(this.readNotificationIds).join(', ')}]`);
    } catch (error) {
      console.error('Error debugging notification counts:', error);
    }
  }

  // Auto-mark old expired offers as read (older than 2 hours)
  async autoMarkOldExpiredOffersAsRead(): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const twoHoursAgo = new Date();
      twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);
      
      let markedCount = 0;
      notifications.forEach(notification => {
        // Mark old expired offers as read automatically (after 2 hours)
        if (notification.metadata?.activityType === 'offer_expired' && 
            new Date(notification.timestamp) < twoHoursAgo &&
            !notification.isRead) {
          this.readNotificationIds.add(notification.id);
          markedCount++;
        }
      });
      
      if (markedCount > 0) {
        await this.saveReadNotifications();
        console.log(`🧹 Auto-marked ${markedCount} old expired offers as read`);
      }
    } catch (error) {
      console.error('Error auto-marking old expired offers:', error);
    }
  }

  // Mark ALL expired offers as read (for cleanup)
  async markAllExpiredOffersAsRead(): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      
      let markedCount = 0;
      notifications.forEach(notification => {
        // Mark ALL expired offers as read
        if (notification.metadata?.activityType === 'offer_expired' && !notification.isRead) {
          this.readNotificationIds.add(notification.id);
          markedCount++;
        }
      });
      
      if (markedCount > 0) {
        await this.saveReadNotifications();
        console.log(`🧹 Marked ALL ${markedCount} expired offers as read`);
      }
    } catch (error) {
      console.error('Error marking all expired offers as read:', error);
    }
  }

  private convertActivitiesToNotifications(activities: any[]): Notification[] {
    // Include all activities in the notification list, but limit to recent ones for performance
    // Sort by timestamp (newest first) and take the most recent 50 activities
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())
      .slice(0, 50); // Reasonable limit for performance

    const notifications = sortedActivities.map((activity, index) => {
      const notificationId = activity.id || index + 1000;
      const isRead = this.readNotificationIds.has(notificationId);


      return {
        id: notificationId,
        title: this.getActivityTitle(activity.activityType),
        message: this.formatActivityMessage(activity),
        type: this.getActivityNotificationType(activity.activityType),
        isRead: isRead,
        timestamp: activity.timestamp || new Date().toISOString(),
        category: this.getActivityCategory(activity.activityType),
        metadata: {
          activityType: activity.activityType,
          leadId: activity.leadId,
          leadCost: activity.leadCost
        }
      };
    }).filter(notification => notification.title && notification.message); // Filter out empty notifications

    console.log(`📊 ACTIVITY CONVERSION DEBUG:`);
    console.log(`  Input activities: ${sortedActivities.length}`);
    console.log(`  Output notifications: ${notifications.length}`);
    console.log(`  Unread in output: ${notifications.filter(n => !n.isRead).length}`);
    
    return notifications;
  }

  private formatActivityMessage(activity: any): string {
    const baseMessage = activity.message || activity.description || 'No description available';

    // Add additional context based on activity type
    switch (activity.activityType) {
      case 'lead_purchased':
        return `✅ ${baseMessage}${activity.leadCost ? ` (Cost: $${activity.leadCost})` : ''}`;
      case 'new_offer':
        return `🎯 ${baseMessage}${activity.leadCost ? ` - $${activity.leadCost}` : ''}`;
      case 'price_drop':
        return `📉 ${baseMessage}${activity.leadCost ? ` - Now $${activity.leadCost}` : ''}`;
      case 'offer_expired':
        return `⏰ ${baseMessage}`; // Restore normal message format
      case 'lead_lost':
        return `❌ ${baseMessage}`;
      case 'lead_status_updated':
        return `📊 ${baseMessage}`;
      case 'payment_received':
        return `💰 ${baseMessage}${activity.amount ? ` - $${activity.amount}` : ''}`;
      case 'credit_added':
        return `🎁 ${baseMessage}${activity.amount ? ` - $${activity.amount}` : ''}`;
      case 'profile_approved':
        return `✅ ${baseMessage}`;
      case 'profile_rejected':
        return `⚠️ ${baseMessage}`;
      case 'service_area_updated':
        return `📍 ${baseMessage}`;
      case 'document_uploaded':
        return `📄 ${baseMessage}`;
      case 'rating_received':
        return `⭐ ${baseMessage}${activity.rating ? ` - ${activity.rating}/5 stars` : ''}`;
      default:
        return baseMessage;
    }
  }

  private getActivityTitle(activityType: string): string {
    switch (activityType) {
      case 'lead_purchased':
        return 'Lead Purchased Successfully';
      case 'lead_lost':
        return 'Lead No Longer Available';
      case 'offer_expired':
        return 'Lead Offer Expired'; // Restore normal title format
      case 'new_offer':
        return 'New Lead Available';
      case 'price_drop':
        return 'Lead Price Dropped';
      case 'lead_status_updated':
        return 'Lead Status Updated';
      case 'payment_received':
        return 'Payment Received';
      case 'credit_added':
        return 'Credit Added to Account';
      case 'profile_approved':
        return 'Profile Approved';
      case 'profile_rejected':
        return 'Profile Update Required';
      case 'service_area_updated':
        return 'Service Area Updated';
      case 'document_uploaded':
        return 'Document Uploaded';
      case 'rating_received':
        return 'New Customer Rating';
      default:
        return 'Activity Update';
    }
  }

  private getActivityNotificationType(activityType: string): 'info' | 'success' | 'warning' | 'error' {
    switch (activityType) {
      case 'lead_purchased':
      case 'payment_received':
      case 'credit_added':
      case 'profile_approved':
      case 'service_area_updated':
      case 'document_uploaded':
      case 'rating_received':
        return 'success';
      case 'lead_lost':
      case 'profile_rejected':
        return 'warning';
      case 'offer_expired':
        return 'info'; // Make offer_expired less prominent
      case 'new_offer':
      case 'price_drop':
      case 'lead_status_updated':
        return 'info';
      default:
        return 'info';
    }
  }

  private getActivityCategory(activityType: string): 'lead' | 'payment' | 'system' | 'general' {
    switch (activityType) {
      case 'lead_purchased':
      case 'lead_lost':
      case 'offer_expired':
      case 'new_offer':
      case 'price_drop':
      case 'lead_status_updated':
        return 'lead';
      case 'payment_received':
      case 'credit_added':
        return 'payment';
      case 'profile_approved':
      case 'profile_rejected':
      case 'service_area_updated':
      case 'document_uploaded':
      case 'rating_received':
        return 'system';
      default:
        return 'general';
    }
  }

  private getMockNotifications(): Notification[] {
    return [
      {
        id: 1,
        title: 'New Lead Available',
        message: 'A new plumbing lead is available in Brisbane City',
        type: 'info',
        isRead: false,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        category: 'lead'
      },
      {
        id: 2,
        title: 'Payment Successful',
        message: 'Your credit card payment of $50.00 has been processed',
        type: 'success',
        isRead: false,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        category: 'payment'
      },
      {
        id: 4,
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur tonight at 2 AM',
        type: 'info',
        isRead: true,
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'system'
      },
      {
        id: 5,
        title: 'New Service Category',
        message: 'Electrical services are now available in your area',
        type: 'info',
        isRead: false,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        category: 'system'
      },
      {
        id: 6,
        title: 'Credit Added',
        message: 'Your account has been credited with $100.00',
        type: 'success',
        isRead: false,
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        category: 'payment'
      },
      {
        id: 7,
        title: 'Profile Updated',
        message: 'Your business profile has been successfully updated',
        type: 'success',
        isRead: true,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'system'
      }
    ];
  }
}

module.exports = new NotificationService();
