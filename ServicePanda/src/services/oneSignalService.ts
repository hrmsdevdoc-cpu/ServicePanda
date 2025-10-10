import { Platform } from 'react-native';
import OneSignal from 'react-native-onesignal';

interface OneSignalConfig {
    appId: string;
    enableInAppAlerts?: boolean;
    enableInAppBanners?: boolean;
    enableInAppMessages?: boolean;
}

class OneSignalService {
    private isInitialized = false;
    private config: OneSignalConfig | null = null;

    constructor() {
        this.setupNotificationHandlers();
    }

    /**
     * Initialize OneSignal with configuration
     */
    async initialize(config: OneSignalConfig): Promise<void> {
        try {
            this.config = config;

            // Set App ID
            OneSignal.initialize(config.appId);

            // Configure OneSignal settings
            OneSignal.Notifications.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
                console.log('OneSignal: notification will show in foreground:', notificationReceivedEvent);
                const notification = notificationReceivedEvent.getNotification();
                console.log('notification: ', notification);
                notificationReceivedEvent.complete(notification);
            });

            OneSignal.Notifications.addClickListener(event => {
                console.log('OneSignal: notification clicked:', event);
                this.handleNotificationClick(event);
            });

            // Request permission for notifications
            const permission = await OneSignal.Notifications.requestPermission(true);
            console.log('OneSignal: permission granted:', permission);

            this.isInitialized = true;
            console.log('OneSignal initialized successfully');
        } catch (error) {
            console.error('OneSignal initialization failed:', error);
            throw error;
        }
    }

    /**
     * Setup notification event handlers
     */
    private setupNotificationHandlers(): void {
        // Handle notification received in foreground
        OneSignal.Notifications.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
            console.log('OneSignal: notification will show in foreground:', notificationReceivedEvent);
            const notification = notificationReceivedEvent.getNotification();
            console.log('notification: ', notification);
            notificationReceivedEvent.complete(notification);
        });

        // Handle notification click
        OneSignal.Notifications.addClickListener(event => {
            console.log('OneSignal: notification clicked:', event);
            this.handleNotificationClick(event);
        });

        // Handle subscription changes
        OneSignal.User.addEmailSubscriptionObserver(event => {
            console.log('OneSignal: email subscription changed:', event);
        });

        OneSignal.User.addSmsSubscriptionObserver(event => {
            console.log('OneSignal: SMS subscription changed:', event);
        });

        OneSignal.User.addPushSubscriptionObserver(event => {
            console.log('OneSignal: push subscription changed:', event);
        });
    }

    /**
     * Handle notification click events
     */
    private handleNotificationClick(event: any): void {
        try {
            const notification = event.notification;
            const data = notification.additionalData;

            console.log('OneSignal: notification clicked with data:', data);

            // Handle different notification types based on data
            if (data) {
                if (data.type === 'service_request') {
                    // Navigate to service request screen
                    this.navigateToServiceRequest(data.requestId);
                } else if (data.type === 'lead_update') {
                    // Navigate to leads screen
                    this.navigateToLeads();
                } else if (data.type === 'payment_update') {
                    // Navigate to payment screen
                    this.navigateToPayments();
                } else if (data.type === 'profile_update') {
                    // Navigate to profile screen
                    this.navigateToProfile();
                }
            }
        } catch (error) {
            console.error('OneSignal: error handling notification click:', error);
        }
    }

    /**
     * Set external user ID for OneSignal
     */
    async setExternalUserId(userId: string): Promise<void> {
        try {
            if (!this.isInitialized) {
                throw new Error('OneSignal not initialized');
            }

            OneSignal.login(userId);
            console.log('OneSignal: external user ID set:', userId);
        } catch (error) {
            console.error('OneSignal: error setting external user ID:', error);
            throw error;
        }
    }

    /**
     * Remove external user ID
     */
    async removeExternalUserId(): Promise<void> {
        try {
            if (!this.isInitialized) {
                throw new Error('OneSignal not initialized');
            }

            OneSignal.logout();
            console.log('OneSignal: external user ID removed');
        } catch (error) {
            console.error('OneSignal: error removing external user ID:', error);
            throw error;
        }
    }

    /**
     * Set user tags
     */
    async setUserTags(tags: Record<string, string>): Promise<void> {
        try {
            if (!this.isInitialized) {
                throw new Error('OneSignal not initialized');
            }

            OneSignal.User.addTags(tags);
            console.log('OneSignal: user tags set:', tags);
        } catch (error) {
            console.error('OneSignal: error setting user tags:', error);
            throw error;
        }
    }

    /**
     * Remove user tags
     */
    async removeUserTags(tagKeys: string[]): Promise<void> {
        try {
            if (!this.isInitialized) {
                throw new Error('OneSignal not initialized');
            }

            OneSignal.User.removeTags(tagKeys);
            console.log('OneSignal: user tags removed:', tagKeys);
        } catch (error) {
            console.error('OneSignal: error removing user tags:', error);
            throw error;
        }
    }

    /**
     * Set user email
     */
    async setUserEmail(email: string): Promise<void> {
        try {
            if (!this.isInitialized) {
                throw new Error('OneSignal not initialized');
            }

            OneSignal.User.addEmail(email);
            console.log('OneSignal: user email set:', email);
        } catch (error) {
            console.error('OneSignal: error setting user email:', error);
            throw error;
        }
    }

    /**
     * Set user phone number
     */
    async setUserPhone(phone: string): Promise<void> {
        try {
            if (!this.isInitialized) {
                throw new Error('OneSignal not initialized');
            }

            OneSignal.User.addSms(phone);
            console.log('OneSignal: user phone set:', phone);
        } catch (error) {
            console.error('OneSignal: error setting user phone:', error);
            throw error;
        }
    }

    /**
     * Get OneSignal user ID
     */
    async getOneSignalUserId(): Promise<string | null> {
        try {
            if (!this.isInitialized) {
                throw new Error('OneSignal not initialized');
            }

            const user = await OneSignal.User.getOnesignalId();
            return user;
        } catch (error) {
            console.error('OneSignal: error getting user ID:', error);
            return null;
        }
    }

    /**
     * Get push subscription status
     */
    async getPushSubscriptionStatus(): Promise<boolean> {
        try {
            if (!this.isInitialized) {
                throw new Error('OneSignal not initialized');
            }

            const subscription = await OneSignal.User.pushSubscription;
            return subscription.optedIn;
        } catch (error) {
            console.error('OneSignal: error getting push subscription status:', error);
            return false;
        }
    }

    /**
     * Send a test notification (for testing purposes)
     */
    async sendTestNotification(): Promise<void> {
        try {
            if (!this.isInitialized) {
                throw new Error('OneSignal not initialized');
            }

            // This would typically be done from your server
            console.log('OneSignal: test notification would be sent from server');
        } catch (error) {
            console.error('OneSignal: error sending test notification:', error);
            throw error;
        }
    }

    /**
     * Navigation helper methods
     */
    private navigateToServiceRequest(requestId: string): void {
        // This would integrate with your navigation system
        console.log('Navigate to service request:', requestId);
    }

    private navigateToLeads(): void {
        // This would integrate with your navigation system
        console.log('Navigate to leads screen');
    }

    private navigateToPayments(): void {
        // This would integrate with your navigation system
        console.log('Navigate to payments screen');
    }

    private navigateToProfile(): void {
        // This would integrate with your navigation system
        console.log('Navigate to profile screen');
    }

    /**
     * Check if OneSignal is initialized
     */
    isServiceInitialized(): boolean {
        return this.isInitialized;
    }

    /**
     * Get current configuration
     */
    getConfig(): OneSignalConfig | null {
        return this.config;
    }
}

// Export singleton instance
export default new OneSignalService();
