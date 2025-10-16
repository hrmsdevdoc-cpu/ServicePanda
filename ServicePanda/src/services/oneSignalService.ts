import { Platform, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OneSignal } from 'react-native-onesignal';
import NotificationWillDisplayEvent from 'react-native-onesignal/dist/events/NotificationWillDisplayEvent';
import { NotificationClickEvent } from 'react-native-onesignal/dist/models/NotificationEvents';
import { PushSubscriptionChangedState } from 'react-native-onesignal/dist/models/Subscription';
import { UserChangedState } from 'react-native-onesignal/dist/models/User';

interface OneSignalConfig {
    appId: string;
    enableInAppAlerts?: boolean;
    enableInAppBanners?: boolean;
    enableInAppMessages?: boolean;
}

class OneSignalService {
    private isInitialized = false;
    private handlersRegistered = false;
    private notificationClickListener?: (event: NotificationClickEvent) => void;
    private notificationWillDisplayListener?: (event: NotificationWillDisplayEvent) => void;
    private userChangedListener?: (event: UserChangedState) => void;
    private pushSubscriptionChangedListener?: (event: PushSubscriptionChangedState) => void;
    private config: OneSignalConfig | null = null;
    private static readonly ANON_ID_STORAGE_KEY = 'onesignal_anon_external_id';

    constructor() { }

    /**
     * Initialize OneSignal with configuration
     */
    async initialize(config: OneSignalConfig): Promise<boolean> {
        try {
            // Idempotent: avoid re-initializing and duplicating handlers
            if (this.isInitialized) {
                return true;
            }
            this.config = config;

            // Initialize via JS for all platforms
            {
                // Set App ID for all platforms via RN SDK
                if (!OneSignal || !OneSignal.initialize) {
                    console.warn('OneSignal native module unavailable; skipping initialize. Ensure Metro is running and iOS pods/Android build are up to date.');
                    return false;
                }
                OneSignal.initialize(config.appId);

                // Enable verbose logging when available to aid integration debugging
                try {
                    const anyOneSignal: any = OneSignal as unknown as any;
                    if (anyOneSignal?.Debug?.setLogLevel) {
                        anyOneSignal.Debug.setLogLevel(6); // 6 = verbose
                    }
                } catch (e) {
                    // ignore optional debug failures
                }
            }

            // Ensure handlers are registered exactly once
            this.setupNotificationHandlers();

            // Mark initialized as soon as SDK is ready, before prompting permissions
            this.isInitialized = true;
            console.log('OneSignal initialized successfully');

            // Request permission for notifications (non-blocking for init)
            if (OneSignal?.Notifications?.requestPermission) {
                const permission = await OneSignal.Notifications.requestPermission(true);
                console.log('OneSignal: permission granted:', permission);
            }

            // Ensure we have permission (non-blocking)
            try {
                const permission = await this.ensurePermission();
                console.log('OneSignal: permission ensured on init:', permission);
            } catch { }

            // Auto-create an anonymous identity so the user shows up in OneSignal even before login
            try {
                await this.ensureAnonymousLogin();
                await this.debugPrintState('after-anon-login');
            } catch (e) {
                console.log('OneSignal: anonymous login failed:', e);
            }
            return true;
        } catch (error) {
            console.error('OneSignal initialization failed:', error);
            return false;
        }
    }

    /**
     * Setup notification event handlers
     */
    private setupNotificationHandlers(): void {
        if (this.handlersRegistered) return;
        // Avoid duplicate registration across Fast Refresh
        const g: any = globalThis as any;
        if (g.__spOneSignalHandlersSet) return;
        // Handle notification received in foreground
        if (OneSignal?.Notifications?.addEventListener) {
            this.notificationWillDisplayListener = (event: NotificationWillDisplayEvent) => {
                console.log('OneSignal: notification will display in foreground');
                const notification = event.getNotification();
                console.log('notification: ', notification);
                // Show as-is (omit preventDefault to allow display), or call event.preventDefault() to suppress
            };
            OneSignal.Notifications.addEventListener('foregroundWillDisplay', this.notificationWillDisplayListener);
        }

        // Handle notification click
        if (OneSignal?.Notifications?.addEventListener) {
            this.notificationClickListener = (event: NotificationClickEvent) => {
                console.log('OneSignal: notification clicked:', event);
                this.handleNotificationClick(event);
            };
            OneSignal.Notifications.addEventListener('click', this.notificationClickListener);
        }

        // Handle user and push subscription changes
        if (OneSignal?.User?.addEventListener) {
            this.userChangedListener = (event: UserChangedState) => {
                console.log('OneSignal: user state changed:', event);
            };
            OneSignal.User.addEventListener('change', this.userChangedListener);
        }
        if (OneSignal?.User?.pushSubscription?.addEventListener) {
            this.pushSubscriptionChangedListener = (event: PushSubscriptionChangedState) => {
                console.log('OneSignal: push subscription changed:', event);
            };
            OneSignal.User.pushSubscription.addEventListener('change', this.pushSubscriptionChangedListener);
        }
        this.handlersRegistered = true;
        g.__spOneSignalHandlersSet = true;
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
                console.warn('OneSignal not initialized; skipping setExternalUserId');
                return;
            }

            if (OneSignal?.login) {
                OneSignal.login(userId);
            }
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
                console.warn('OneSignal not initialized; skipping removeExternalUserId');
                return;
            }

            if (OneSignal?.logout) {
                OneSignal.logout();
            }
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
                console.warn('OneSignal not initialized; skipping setUserTags');
                return;
            }

            if (OneSignal?.User?.addTags) {
                OneSignal.User.addTags(tags);
            }
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
                console.warn('OneSignal not initialized; skipping removeUserTags');
                return;
            }

            if (OneSignal?.User?.removeTags) {
                OneSignal.User.removeTags(tagKeys);
            }
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
                console.warn('OneSignal not initialized; skipping setUserEmail');
                return;
            }

            if (OneSignal?.User?.addEmail) {
                OneSignal.User.addEmail(email);
            }
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
                console.warn('OneSignal not initialized; skipping setUserPhone');
                return;
            }

            if (OneSignal?.User?.addSms) {
                OneSignal.User.addSms(phone);
            }
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
                console.warn('OneSignal not initialized; getOneSignalUserId returning null');
                return null;
            }

            if (!OneSignal?.User?.getOnesignalId) return null;
            const user = await OneSignal.User.getOnesignalId();
            return user;
        } catch (error) {
            console.error('OneSignal: error getting user ID:', error);
            return null;
        }
    }

    /**
     * Retry fetching the registered OneSignal user id briefly after startup.
     */
    async getRegisteredUserId(maxAttempts = 5, delayMs = 600): Promise<string | null> {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const id = await this.getOneSignalUserId();
            if (id) return id;
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
        return null;
    }

    /**
     * Get push subscription status
     */
    async getPushSubscriptionStatus(): Promise<boolean> {
        try {
            if (!this.isInitialized) {
                console.warn('OneSignal not initialized; getPushSubscriptionStatus returning false');
                return false;
            }

            // SDK v5: use getter methods on pushSubscription
            const ps: any = (OneSignal as any)?.User?.pushSubscription;
            if (!ps) return false;
            if (typeof ps.getOptedIn === 'function') {
                return !!(await ps.getOptedIn());
            }
            // Fallback: try reading property if present
            return !!ps.optedIn;
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
                console.warn('OneSignal not initialized; skipping sendTestNotification');
                return;
            }

            // This would typically be done from your server
            console.log('OneSignal: test notification would be sent from server');
        } catch (error) {
            console.error('OneSignal: error sending test notification:', error);
            throw error;
        }
    }

    /**
     * Ensure the device is logged in with a stable anonymous external_id until a real user logs in.
     */
    private async ensureAnonymousLogin(): Promise<void> {
        try {
            // If already has an OS user id, nothing to do
            const existingOsId = await this.getOneSignalUserId();
            if (existingOsId) return;

            // Get or create a stable anon external id
            let anonId = await AsyncStorage.getItem(OneSignalService.ANON_ID_STORAGE_KEY);
            if (!anonId) {
                const rnd = Math.random().toString(36).slice(2, 10);
                anonId = `sp_anon_${Platform.OS}_${Date.now()}_${rnd}`;
                await AsyncStorage.setItem(OneSignalService.ANON_ID_STORAGE_KEY, anonId);
            }

            if (OneSignal?.login) {
                OneSignal.login(anonId);
                console.log('OneSignal: anonymous login set:', anonId);
            }
        } catch (e) {
            console.log('OneSignal: ensureAnonymousLogin error:', e);
        }
    }

    /**
     * Public helper to ensure startup registration and print state.
     */
    async ensureStartupRegistration(): Promise<void> {
        try {
            await this.ensureAnonymousLogin();
            await this.debugPrintState('startup');
        } catch (e) {
            console.log('OneSignal: ensureStartupRegistration error:', e);
        }
    }

    /**
     * Debug: print current OneSignal state (ids, token, opt-in)
     */
    async debugPrintState(label: string = 'state'): Promise<void> {
        try {
            const osId = (await this.getOneSignalUserId()) || null;
            const token = await OneSignal.User.pushSubscription.getTokenAsync();
            const optedIn = await OneSignal.User.pushSubscription.getOptedInAsync();
            console.log('OneSignal debug:', label, { osId, token, optedIn } as any);
        } catch (e) {
            console.log('OneSignal debug: failed to read state', e);
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

    /**
     * Check if notifications permission is granted
     */
    async hasPermission(): Promise<boolean> {
        try {
            if (!OneSignal?.Notifications?.getPermissionAsync) return false;
            return await OneSignal.Notifications.getPermissionAsync();
        } catch (error) {
            console.error('OneSignal: error checking notification permission:', error);
            return false;
        }
    }

    /**
     * Check if we can still request notifications permission (iOS and Android 13+)
     */
    async canRequestPermission(): Promise<boolean> {
        try {
            if (!OneSignal?.Notifications?.canRequestPermission) return false;
            return await OneSignal.Notifications.canRequestPermission();
        } catch (error) {
            console.error('OneSignal: error checking canRequestPermission:', error);
            return false;
        }
    }

    /**
     * Request notifications permission (shows native prompt)
     */
    async requestPermission(): Promise<boolean> {
        try {
            if (!OneSignal?.Notifications?.requestPermission) return false;
            const granted = await OneSignal.Notifications.requestPermission(true);
            return !!granted;
        } catch (error) {
            console.error('OneSignal: error requesting notification permission:', error);
            return false;
        }
    }

    /**
     * Ensure permission is granted: if not, request when possible
     */
    async ensurePermission(): Promise<boolean> {
        try {
            const alreadyGranted = await this.hasPermission();
            if (alreadyGranted) return true;

            const canRequest = await this.canRequestPermission();
            if (!canRequest) return false;

            return await this.requestPermission();
        } catch (error) {
            console.error('OneSignal: error ensuring notification permission:', error);
            return false;
        }
    }

    /**
     * Open OS notification settings for this app
     */
    async openNotificationSettings(): Promise<void> {
        try {
            await Linking.openSettings();
        } catch (error) {
            console.error('OneSignal: error opening app settings:', error);
        }
    }

    /**
     * Dev helper: test register a user with OneSignal to verify configuration
     */
    async debugTestRegister(userId: string = 'sp_test_debug'): Promise<void> {
        try {
            if (!this.isInitialized) {
                console.log('OneSignal debug: service not initialized, skipping test');
                return;
            }

            const granted = await this.ensurePermission();
            console.log('OneSignal debug: permission ensured:', granted);

            await this.setExternalUserId(userId);
            await this.debugPrintState('after-login');
        } catch (error) {
            console.error('OneSignal debug: test registration failed:', error);
        }
    }
}

// Export singleton instance
export default new OneSignalService();
