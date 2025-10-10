/**
 * OneSignal Test Component
 * 
 * This component can be temporarily added to your app to test OneSignal functionality
 */

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import OneSignal from 'react-native-onesignal';

const OneSignalTestComponent = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);

  useEffect(() => {
    // Test OneSignal initialization
    testOneSignal();
  }, []);

  const testOneSignal = async () => {
    try {
      console.log('🧪 Testing OneSignal...');
      
      // Check if OneSignal is available
      if (!OneSignal) {
        console.log('❌ OneSignal not available');
        return;
      }

      // Initialize OneSignal
      OneSignal.initialize('a3f5070d-9c46-44cd-8b0a-259df155ae94');
      console.log('✅ OneSignal initialized');
      setIsInitialized(true);

      // Request notification permission
      if (OneSignal.Notifications && OneSignal.Notifications.requestPermission) {
        const permission = await OneSignal.Notifications.requestPermission(true);
        console.log('🔔 Permission result:', permission);
        setPermissionStatus(permission);
      }

      // Get device ID
      if (OneSignal.User && OneSignal.User.getOnesignalId) {
        const userId = OneSignal.User.getOnesignalId();
        console.log('👤 User ID:', userId);
        setDeviceId(userId);
      }

      // Set up notification listeners
      if (OneSignal.Notifications && OneSignal.Notifications.addEventListener) {
        OneSignal.Notifications.addEventListener('click', (event) => {
          console.log('📱 Notification clicked:', event);
          Alert.alert('Notification Clicked', JSON.stringify(event));
        });

        OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
          console.log('📱 Notification will display:', event);
          Alert.alert('Notification Received', 'You received a notification!');
        });
      }

    } catch (error) {
      console.error('❌ OneSignal test error:', error);
    }
  };

  const sendTestNotification = () => {
    Alert.alert(
      'Test Notification',
      'To test notifications, go to OneSignal dashboard and send a test notification to this device.',
      [
        { text: 'OK' },
        { 
          text: 'Open Dashboard', 
          onPress: () => {
            // You can open OneSignal dashboard URL here
            console.log('Open OneSignal dashboard');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OneSignal Test</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Status: {isInitialized ? '✅ Initialized' : '❌ Not Initialized'}
        </Text>
        
        <Text style={styles.statusText}>
          Permission: {permissionStatus ? '✅ Granted' : '❌ Not Granted'}
        </Text>
        
        <Text style={styles.statusText}>
          Device ID: {deviceId ? deviceId.substring(0, 20) + '...' : 'Not Available'}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={sendTestNotification}>
        <Text style={styles.buttonText}>Test Notifications</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>
        App ID: a3f5070d-9c46-44cd-8b0a-259df155ae94
      </Text>
      <Text style={styles.infoText}>
        Bundle ID: com.servicepandaprovider
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  statusContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
});

export default OneSignalTestComponent;
