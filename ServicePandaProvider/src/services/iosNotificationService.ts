import { Platform, Alert, Linking } from 'react-native';

export interface IOSNotificationService {
    requestPermissions(): Promise<boolean>;
    initializeOneSignal(appId: string): Promise<void>;
    isPermissionGranted(): Promise<boolean>;
    openSettings(): void;
}

class IOSNotificationServiceImpl implements IOSNotificationService {
    private isInitialized = false;

    async requestPermissions(): Promise<boolean> {
        if (Platform.OS !== 'ios') {
            console.log('📱 Not iOS platform, skipping iOS-specific permission request');
            return true;
        }

        try {
            console.log('🔔 Requesting iOS notification permissions...');

            // Dynamically require to avoid undefined default import issues
            const OS: any = (() => {
                try { return require('react-native-onesignal'); } catch { return null; }
            })();

            if (!OS?.Notifications?.requestPermission) {
                console.log('⚠️ OneSignal.Notifications.requestPermission not available (already prompted in AppDelegate).');
                return true;
            }

            const permission = await OS.Notifications.requestPermission(true);
            if (permission) {
                console.log('✅ iOS notification permission granted');
                return true;
            } else {
                console.log('❌ iOS notification permission denied');
                this.showPermissionDeniedAlert();
                return false;
            }
        } catch (error) {
            console.error('❌ Error requesting iOS notification permissions:', error);
            return false;
        }
    }

    async initializeOneSignal(appId: string): Promise<void> {
        if (this.isInitialized) {
            console.log('⚠️ OneSignal already initialized for iOS');
            return;
        }

        try {
            console.log('🚀 OneSignal XCFramework already initialized in AppDelegate.mm');
            console.log('📱 App ID:', appId);

            // OneSignal XCFramework is already initialized in AppDelegate.mm
            // No need to call initialize as it's handled natively

            // Set up notification handlers if API is present
            this.setupNotificationHandlers();

            this.isInitialized = true;
            console.log('✅ OneSignal XCFramework ready for iOS');

        } catch (error) {
            console.error('❌ Error with OneSignal XCFramework for iOS:', error);
            throw error;
        }
    }

    private setupNotificationHandlers(): void {
        const OS: any = (() => { try { return require('react-native-onesignal'); } catch { return null; } })();
        if (!OS?.Notifications) {
            console.log('⚠️ OneSignal Notifications API not available yet; handlers not attached.');
            return;
        }

        // Handle notification received while app is in foreground
        OS.Notifications.addEventListener('foregroundWillDisplay', (event: any) => {
            console.log('🔔 iOS notification received in foreground:', event);

            // You can customize the notification display here
            // For now, we'll let it display normally
            try {
                const notif = event.getNotification ? event.getNotification() : event.notification;
                notif?.display?.();
            } catch { }
        });

        // Handle notification opened
        OS.Notifications.addEventListener('click', (event: any) => {
            console.log('🔔 iOS notification clicked:', event);

            // Handle notification click - navigate to relevant screen
            const notification = event.notification;
            const data = notification.additionalData;

            if (data) {
                console.log('📱 Notification data:', data);
                // Handle navigation based on notification data
                this.handleNotificationNavigation(data);
            }
        });

        // Handle permission changes
        OS.Notifications.addEventListener('permissionChange', (permission: any) => {
            console.log('🔔 iOS notification permission changed:', permission);
        });

        // Handle notification actions (Accept/Decline Lead)
        OS.Notifications.addEventListener('action', (event: any) => {
            console.log('🔔 iOS notification action triggered:', event);

            const actionId = event.action.actionId;
            const notification = event.notification;
            const data = notification.additionalData;

            if (actionId === 'ACCEPT_LEAD') {
                console.log('📱 Lead accepted via notification');
                this.handleLeadAction('accept', data);
            } else if (actionId === 'DECLINE_LEAD') {
                console.log('📱 Lead declined via notification');
                this.handleLeadAction('decline', data);
            }
        });
    }

    private handleNotificationNavigation(data: any): void {
        // Handle different types of notifications
        if (data.type === 'new_lead') {
            console.log('📱 Navigating to new leads screen');
            // Navigate to new leads screen
        } else if (data.type === 'lead_update') {
            console.log('📱 Navigating to lead details');
            // Navigate to specific lead details
        } else if (data.type === 'payment') {
            console.log('📱 Navigating to billing screen');
            // Navigate to billing screen
        }
    }

    private handleLeadAction(action: 'accept' | 'decline', data: any): void {
        console.log(`📱 Handling lead ${action} action:`, data);

        // Here you would typically make an API call to accept/decline the lead
        // For now, we'll just log the action
        if (action === 'accept') {
            console.log('✅ Lead accepted via notification action');
            // TODO: Make API call to accept lead
        } else if (action === 'decline') {
            console.log('❌ Lead declined via notification action');
            // TODO: Make API call to decline lead
        }
    }

    async isPermissionGranted(): Promise<boolean> {
        try {
            const OS: any = (() => { try { return require('react-native-onesignal'); } catch { return null; } })();
            if (!OS?.Notifications?.getPermissionAsync) return false;
            const permission = await OS.Notifications.getPermissionAsync();
            return permission;
        } catch (error) {
            console.error('❌ Error checking iOS notification permission:', error);
            return false;
        }
    }

    openSettings(): void {
        if (Platform.OS === 'ios') {
            Alert.alert(
                'Notification Permission Required',
                'Please enable notifications in Settings to receive important updates about your service requests.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Open Settings',
                        onPress: () => { try { Linking.openSettings(); } catch { } }
                    }
                ]
            );
        }
    }

    private showPermissionDeniedAlert(): void {
        Alert.alert(
            'Notifications Disabled',
            'To receive important updates about your service requests, please enable notifications in Settings.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Open Settings',
                    onPress: () => this.openSettings()
                }
            ]
        );
    }
}

export const iosNotificationService = new IOSNotificationServiceImpl();
export default iosNotificationService;
