// OneSignal Configuration
// Replace these with your actual OneSignal App IDs

export const ONESIGNAL_CONFIG = {
    // iOS App ID - Get this from your OneSignal dashboard
    IOS_APP_ID: 'c10624ec-0af6-43ba-a72b-7c778268e861', // OneSignal App ID

    // Android App ID - Get this from your OneSignal dashboard (if you have Android)
    ANDROID_APP_ID: 'c10624ec-0af6-43ba-a72b-7c778268e861', // OneSignal App ID

    // Notification settings
    NOTIFICATION_SETTINGS: {
        enableInAppAlerts: true,
        enableInAppBanners: true,
        enableInAppMessages: true,
        enableForegroundNotifications: true,
    },

    // User tags for segmentation
    USER_TAGS: {
        user_type: 'customer',
        platform: 'ios',
    },

    // Notification categories for different types of notifications
    NOTIFICATION_CATEGORIES: {
        SERVICE_REQUEST: 'service_request',
        LEAD_UPDATE: 'lead_update',
        PAYMENT_UPDATE: 'payment_update',
        PROFILE_UPDATE: 'profile_update',
        SYSTEM_UPDATE: 'system_update',
        PROMOTIONAL: 'promotional',
    },

    // Dev-only: automatically run a OneSignal registration test on app start
    DEBUG_TEST_ON_START: false,
    TEST_EXTERNAL_ID: 'sp_test_debug',
};

// Helper function to get the correct App ID based on platform
export const getOneSignalAppId = (platform: string): string => {
    return platform === 'ios' ? ONESIGNAL_CONFIG.IOS_APP_ID : ONESIGNAL_CONFIG.ANDROID_APP_ID;
};

// Helper function to get notification settings
export const getNotificationSettings = () => {
    return ONESIGNAL_CONFIG.NOTIFICATION_SETTINGS;
};

// Helper function to get user tags
export const getUserTags = (additionalTags: Record<string, string> = {}) => {
    return {
        ...ONESIGNAL_CONFIG.USER_TAGS,
        ...additionalTags,
    };
};
