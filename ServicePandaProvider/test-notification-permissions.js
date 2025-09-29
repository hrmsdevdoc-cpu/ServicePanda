/**
 * Test Script: Force Notification Permission Request
 * Run this in React Native to test notification permissions
 */

import { PermissionsAndroid, Platform, Alert } from 'react-native';

export async function testNotificationPermissions() {
  console.log('🔔 Testing Notification Permissions...');
  
  if (Platform.OS === 'android') {
    try {
      // Check current permission status
      const currentStatus = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      
      console.log('📱 Current notification permission status:', currentStatus);
      
      if (!currentStatus) {
        console.log('🔔 Requesting notification permission...');
        
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'ServicePanda Notifications',
            message: 'Allow ServicePanda to send you important notifications about your service requests and updates.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'No Thanks',
            buttonPositive: 'Allow',
          }
        );
        
        console.log('📱 Permission request result:', granted);
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Success!', 'Notification permissions granted!');
          console.log('✅ Notification permission granted!');
          return true;
        } else {
          Alert.alert('Permission Denied', 'Please enable notifications in Settings → Apps → ServicePandaProvider → Notifications');
          console.log('❌ Notification permission denied');
          return false;
        }
      } else {
        console.log('✅ Notification permission already granted');
        Alert.alert('Already Granted', 'Notification permissions are already enabled!');
        return true;
      }
    } catch (error) {
      console.error('❌ Error checking notification permissions:', error);
      return false;
    }
  } else {
    console.log('📱 Not Android platform');
    return false;
  }
}
