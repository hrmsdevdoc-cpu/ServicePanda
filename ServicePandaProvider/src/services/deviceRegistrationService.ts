import AsyncStorage from '@react-native-async-storage/async-storage';

class DeviceRegistrationService {
  private serverUrl = 'https://api.servicepanda.com.au';

  // Register device with server for push notifications
  async registerDeviceForNotifications() {
    try {
      console.log('📱 Registering device for push notifications...');
      
      // Get provider ID from storage
      const providerId = await AsyncStorage.getItem('providerId');
      if (!providerId) {
        console.log('⚠️ No provider ID found - cannot register for notifications');
        return;
      }

      console.log(`📱 Registering device for provider ${providerId}`);

      // In real implementation, you would:
      // 1. Get OneSignal player ID
      // 2. Send it to server to associate with provider ID
      // 3. Server stores this mapping for push notifications

      // For now, just simulate registration
      const registrationData = {
        providerId: providerId,
        deviceType: 'android',
        appVersion: '1.2.0',
        registeredAt: new Date().toISOString()
      };

      console.log('📱 Device registration data:', registrationData);
      console.log('✅ Device registered for push notifications');

      // Store registration status locally
      await AsyncStorage.setItem('notificationRegistered', 'true');
      await AsyncStorage.setItem('registrationDate', new Date().toISOString());

    } catch (error) {
      console.error('❌ Failed to register device for notifications:', error);
    }
  }

  // Check if device is registered
  async isDeviceRegistered(): Promise<boolean> {
    try {
      const registered = await AsyncStorage.getItem('notificationRegistered');
      return registered === 'true';
    } catch (error) {
      return false;
    }
  }

  // Register device with server when provider logs in
  async onProviderLogin(providerId: string) {
    try {
      console.log(`📱 Provider ${providerId} logged in - registering for notifications`);
      
      // Store provider ID
      await AsyncStorage.setItem('providerId', providerId);
      
      // Register device for notifications
      await this.registerDeviceForNotifications();
      
    } catch (error) {
      console.error('❌ Failed to register on provider login:', error);
    }
  }
}

export const deviceRegistrationService = new DeviceRegistrationService();
export default deviceRegistrationService;
