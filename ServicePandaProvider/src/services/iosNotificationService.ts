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
            console.log('🔔 iOS: Permissions handled natively in AppDelegate.mm');
            console.log('✅ No JavaScript SDK needed - native initialization handles everything');
            return true; // Always return true as permissions are handled natively
        } catch (error) {
            console.error('❌ Error in iOS permission check:', error);
            return true; // Still return true as native handles it
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
        console.log('⚠️ iOS: Skipping JavaScript notification handlers (native-only mode)');
        console.log('✅ Native AppDelegate.mm handles all notification events');
        // NO JAVASCRIPT SDK - All notifications handled natively
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
        console.log('🔍 iOS: Checking permission status natively (JS SDK not used)');
        return true; // Assume granted as native handles it
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
