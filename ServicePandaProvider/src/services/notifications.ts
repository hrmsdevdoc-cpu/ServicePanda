const apiService = require('./api');

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
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await apiService.get('/api/provider/notifications');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Return mock data for now
      return this.getMockNotifications();
    }
  }

  async markAsRead(notificationId: number): Promise<boolean> {
    try {
      await apiService.put(`/api/provider/notifications/${notificationId}/read`);
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  async markAllAsRead(): Promise<boolean> {
    try {
      await apiService.put('/api/provider/notifications/read-all');
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
