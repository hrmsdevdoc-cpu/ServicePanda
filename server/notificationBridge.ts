// Notification Bridge for Real-time Communication with React Native App
import { Request, Response } from 'express';

interface PendingNotification {
  id: string;
  providerId: number;
  title: string;
  message: string;
  type: string;
  data: any;
  timestamp: string;
  delivered: boolean;
}

class NotificationBridge {
  private pendingNotifications: Map<number, PendingNotification[]> = new Map();
  private activeConnections: Map<number, Response[]> = new Map();

  // Store notification for a provider
  addNotification(providerId: number, notification: any): void {
    const notificationData: PendingNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      providerId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      data: notification.data || {},
      timestamp: new Date().toISOString(),
      delivered: false
    };

    if (!this.pendingNotifications.has(providerId)) {
      this.pendingNotifications.set(providerId, []);
    }

    this.pendingNotifications.get(providerId)!.push(notificationData);
    
    console.log(`📨 Notification added for provider ${providerId}: ${notification.title}`);
    
    // Try to deliver immediately if provider is connected
    this.deliverPendingNotifications(providerId);
  }

  // Get pending notifications for a provider (polling)
  getPendingNotifications(providerId: number): PendingNotification[] {
    const notifications = this.pendingNotifications.get(providerId) || [];
    
    console.log(`🔍 Provider ${providerId} polling - found ${notifications.length} pending notifications`);
    if (notifications.length > 0) {
      console.log('📋 Pending notifications:', notifications.map(n => n.title));
    }
    
    // Mark as delivered and remove from pending
    notifications.forEach(notif => notif.delivered = true);
    this.pendingNotifications.set(providerId, []);
    
    console.log(`📱 Delivered ${notifications.length} notifications to provider ${providerId}`);
    return notifications;
  }

  // Long polling endpoint - provider app calls this
  async longPoll(providerId: number, res: Response): Promise<void> {
    console.log(`🔄 Provider ${providerId} connected for long polling`);
    
    // Add connection to active connections
    if (!this.activeConnections.has(providerId)) {
      this.activeConnections.set(providerId, []);
    }
    this.activeConnections.get(providerId)!.push(res);

    // Set timeout for long polling (30 seconds)
    const timeout = setTimeout(() => {
      this.removeConnection(providerId, res);
      if (!res.headersSent) {
        res.json({ notifications: [] });
      }
    }, 30000);

    // Handle client disconnect
    res.on('close', () => {
      clearTimeout(timeout);
      this.removeConnection(providerId, res);
    });

    // Deliver any pending notifications immediately
    this.deliverPendingNotifications(providerId);
  }

  // Deliver notifications to connected providers
  private deliverPendingNotifications(providerId: number): void {
    const notifications = this.pendingNotifications.get(providerId) || [];
    const connections = this.activeConnections.get(providerId) || [];

    if (notifications.length > 0 && connections.length > 0) {
      console.log(`🚀 Delivering ${notifications.length} notifications to ${connections.length} connections`);
      
      connections.forEach(res => {
        if (!res.headersSent) {
          res.json({ notifications });
        }
      });

      // Clear notifications and connections after delivery
      this.pendingNotifications.set(providerId, []);
      this.activeConnections.set(providerId, []);
    }
  }

  private removeConnection(providerId: number, res: Response): void {
    const connections = this.activeConnections.get(providerId) || [];
    const index = connections.indexOf(res);
    if (index > -1) {
      connections.splice(index, 1);
      this.activeConnections.set(providerId, connections);
    }
  }

  // Get stats for debugging
  getStats(): any {
    const totalPending = Array.from(this.pendingNotifications.values())
      .reduce((sum, arr) => sum + arr.length, 0);
    
    const totalConnections = Array.from(this.activeConnections.values())
      .reduce((sum, arr) => sum + arr.length, 0);

    return {
      totalPendingNotifications: totalPending,
      totalActiveConnections: totalConnections,
      providersWithPendingNotifications: this.pendingNotifications.size,
      providersConnected: this.activeConnections.size
    };
  }
}

// Singleton instance
export const notificationBridge = new NotificationBridge();

// Express route handlers
export const notificationRoutes = {
  // Provider app polls this endpoint
  poll: async (req: Request, res: Response) => {
    try {
      const providerId = parseInt(req.headers['x-provider-id'] as string);
      
      if (!providerId) {
        return res.status(400).json({ error: 'Provider ID required' });
      }

      const notifications = notificationBridge.getPendingNotifications(providerId);
      res.json({ notifications });
    } catch (error) {
      console.error('Error in notification poll:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Long polling endpoint
  longPoll: async (req: Request, res: Response) => {
    try {
      const providerId = parseInt(req.headers['x-provider-id'] as string);
      
      if (!providerId) {
        return res.status(400).json({ error: 'Provider ID required' });
      }

      await notificationBridge.longPoll(providerId, res);
    } catch (error) {
      console.error('Error in notification long poll:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },

  // Get notification bridge stats
  stats: (req: Request, res: Response) => {
    const stats = notificationBridge.getStats();
    res.json(stats);
  }
};

export default notificationBridge;
