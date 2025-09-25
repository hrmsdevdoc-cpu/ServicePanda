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
      // First try to get real notifications from the API
      const response = await apiService.get('/api/provider/notifications');
      if (response && response.length > 0) {
        return response;
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Continue to fallback instead of throwing
    }

    // If no real notifications, convert activity data to notifications
    try {
      const activities = await apiService.getActivity();
      return this.convertActivitiesToNotifications(activities);
    } catch (error) {
      console.error('Error fetching activities for notifications:', error);
      // Fallback to mock data without throwing error
      return this.getMockNotifications();
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
      console.log('NotificationService: Starting markAllAsRead');
      
      // Get current notifications to mark them all as read locally
      const notifications = await this.getNotifications();
      console.log('NotificationService: Current notifications before marking:', notifications.map(n => ({ id: n.id, isRead: n.isRead })));
      
      notifications.forEach(notification => {
        this.readNotificationIds.add(notification.id);
      });
      
      console.log('NotificationService: Read notification IDs after adding:', Array.from(this.readNotificationIds));
      
      // Save to persistent storage
      await this.saveReadNotifications();
      
      // Try to mark all as read on server
      try {
        await apiService.put('/api/provider/notifications/read-all');
      } catch (serverError) {
        // If server call fails, we still mark them as read locally
        console.log('Server mark all as read failed, using local tracking only');
      }
      
      console.log('NotificationService: markAllAsRead completed successfully');
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
      console.log('All read notifications have been reset');
    } catch (error) {
      console.error('Error resetting read notifications:', error);
    }
  }

  private convertActivitiesToNotifications(activities: any[]): Notification[] {
    console.log('NotificationService: Converting activities to notifications');
    console.log('NotificationService: Read notification IDs:', Array.from(this.readNotificationIds));
    
    const notifications = activities.slice(0, 10).map((activity, index) => {
      const notificationId = activity.id || index + 1000;
      const isRead = this.readNotificationIds.has(notificationId);
      
      console.log(`NotificationService: Activity ${notificationId} -> isRead: ${isRead}`);
      
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
    });
    
    console.log('NotificationService: Converted notifications:', notifications.map(n => ({ id: n.id, isRead: n.isRead })));
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
        return `⏰ ${baseMessage}`;
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
        return 'Lead Offer Expired';
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
      case 'offer_expired':
      case 'profile_rejected':
        return 'warning';
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
        id: 3,
        title: 'Lead Expired',
        message: 'A lead you were interested in has expired',
        type: 'warning',
        isRead: true,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'lead'
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
