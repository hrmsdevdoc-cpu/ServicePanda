// Notification Service
// Manages all notification-related functionality

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    isRead: boolean;
    timestamp: string;
    actionUrl?: string;
    category?: 'lead' | 'payment' | 'system' | 'general';
    priority?: 'low' | 'medium' | 'high';
}

interface ToastNotification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
    actionText?: string;
    onPress?: () => void;
}

class NotificationService {
    private notifications: Notification[] = [];
    private toastQueue: ToastNotification[] = [];
    private listeners: Array<(notifications: Notification[]) => void> = [];
    private toastListeners: Array<(toast: ToastNotification | null) => void> = [];

    // Initialize with sample data
    constructor() {
        this.loadSampleNotifications();
    }

    // Load sample notifications for testing
    private loadSampleNotifications() {
        this.notifications = [
            {
                id: '1',
                title: 'New Lead Available',
                message: 'You have a new plumbing job request in Brisbane CBD',
                type: 'info',
                isRead: false,
                timestamp: new Date().toISOString(),
                category: 'lead',
                priority: 'high',
                actionUrl: '/leads/1',
            },
            {
                id: '2',
                title: 'Payment Successful',
                message: 'Your payment of $25.00 has been processed successfully',
                type: 'success',
                isRead: false,
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                category: 'payment',
                priority: 'medium',
            },
            {
                id: '3',
                title: 'Service Area Updated',
                message: 'Your service area has been updated successfully',
                type: 'success',
                isRead: true,
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                category: 'system',
                priority: 'low',
            },
            {
                id: '4',
                title: 'Profile Incomplete',
                message: 'Please complete your profile to receive more leads',
                type: 'warning',
                isRead: false,
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                category: 'general',
                priority: 'medium',
            },
        ];
        this.notifyListeners();
    }

    // Get all notifications
    getNotifications(): Notification[] {
        return [...this.notifications];
    }

    // Get unread notifications
    getUnreadNotifications(): Notification[] {
        return this.notifications.filter(n => !n.isRead);
    }

    // Get notifications by category
    getNotificationsByCategory(category: string): Notification[] {
        return this.notifications.filter(n => n.category === category);
    }

    // Get notification count
    getUnreadCount(): number {
        return this.notifications.filter(n => !n.isRead).length;
    }

    // Add new notification
    addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): string {
        const newNotification: Notification = {
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            isRead: false,
        };

        this.notifications.unshift(newNotification);
        this.notifyListeners();

        // Show toast for high priority notifications
        if (notification.priority === 'high') {
            this.showToast({
                id: newNotification.id,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                duration: 5000,
            });
        }

        return newNotification.id;
    }

    // Mark notification as read
    markAsRead(notificationId: string): void {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.isRead = true;
            this.notifyListeners();
        }
    }

    // Mark all notifications as read
    markAllAsRead(): void {
        this.notifications.forEach(n => n.isRead = true);
        this.notifyListeners();
    }

    // Delete notification
    deleteNotification(notificationId: string): void {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.notifyListeners();
    }

    // Clear all notifications
    clearAllNotifications(): void {
        this.notifications = [];
        this.notifyListeners();
    }

    // Toast notifications
    showToast(toast: ToastNotification): void {
        this.toastQueue.push(toast);
        this.notifyToastListeners();
    }

    // Remove toast from queue
    removeToast(toastId: string): void {
        this.toastQueue = this.toastQueue.filter(t => t.id !== toastId);
        this.notifyToastListeners();
    }

    // Get current toast
    getCurrentToast(): ToastNotification | null {
        return this.toastQueue[0] || null;
    }

    // Listeners
    addNotificationListener(listener: (notifications: Notification[]) => void): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    addToastListener(listener: (toast: ToastNotification | null) => void): () => void {
        this.toastListeners.push(listener);
        return () => {
            this.toastListeners = this.toastListeners.filter(l => l !== listener);
        };
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener([...this.notifications]));
    }

    private notifyToastListeners(): void {
        const currentToast = this.getCurrentToast();
        this.toastListeners.forEach(listener => listener(currentToast));
    }

    // Utility methods
    formatTimestamp(timestamp: string): string {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            if (diffInDays < 7) {
                return `${diffInDays}d ago`;
            } else {
                return date.toLocaleDateString();
            }
        }
    }

    // Quick notification creators
    showSuccess(title: string, message: string, options?: Partial<Notification>): string {
        return this.addNotification({
            title,
            message,
            type: 'success',
            category: 'general',
            priority: 'medium',
            ...options,
        });
    }

    showError(title: string, message: string, options?: Partial<Notification>): string {
        return this.addNotification({
            title,
            message,
            type: 'error',
            category: 'system',
            priority: 'high',
            ...options,
        });
    }

    showWarning(title: string, message: string, options?: Partial<Notification>): string {
        return this.addNotification({
            title,
            message,
            type: 'warning',
            category: 'general',
            priority: 'medium',
            ...options,
        });
    }

    showInfo(title: string, message: string, options?: Partial<Notification>): string {
        return this.addNotification({
            title,
            message,
            type: 'info',
            category: 'general',
            priority: 'low',
            ...options,
        });
    }
}

// Create singleton instance
const notificationService = new NotificationService();

module.exports = notificationService;
