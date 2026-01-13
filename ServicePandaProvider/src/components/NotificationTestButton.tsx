import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import fixedOneSignalService from '../services/fixedOneSignalService';
import androidSystemNotification from '../services/androidSystemNotification';
const { colors } = require('../utils/theme');

const NotificationTestButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleTestNotification = async () => {
    console.log('🔥 TESTING FIXED ONESIGNAL SERVICE! 🔥');
    setIsLoading(true);
    
    try {
      // Test 1: Try fixed OneSignal service first
      console.log('🔍 Trying fixed OneSignal service...');
      let status, result, serviceName;
      
      try {
        status = await fixedOneSignalService.getRegistrationStatus();
        console.log('📊 Fixed service status:', status);
        
        if (status.isRegistered) {
          console.log('🚀 Sending test via fixed OneSignal service...');
          const providerId = status.providerId || '1';
          result = await fixedOneSignalService.sendTestNotification(providerId);
          serviceName = 'Fixed OneSignal';
        } else {
          throw new Error('Fixed service not registered');
        }
      } catch (fixedError) {
        console.log('⚠️ Fixed service failed, trying fallback...');
        
        try {
          status = await fallbackOneSignalService.getRegistrationStatus();
          console.log('📊 Fallback service status:', status);
          
          if (status.isRegistered) {
            console.log('🚀 Sending test via fallback OneSignal service...');
            const providerId = status.providerId || '1';
            result = await fallbackOneSignalService.sendTestNotification(providerId);
            serviceName = 'Fallback OneSignal';
          } else {
            throw new Error('Both services failed');
          }
        } catch (fallbackError) {
          Alert.alert(
            'Registration Required', 
            'Device is not registered with OneSignal. Please restart the app to register.',
            [{ text: 'OK' }]
          );
          setIsLoading(false);
          return;
        }
      }
      
      if (result && result.success) {
        console.log(`✅ ${serviceName.toUpperCase()} TEST NOTIFICATION SENT!`);
        console.log('📊 Recipients:', result.recipients);
        
        Alert.alert(
          'Test Sent!', 
          `${serviceName} test notification sent!\n\nRecipients: ${result.recipients || 'Processing...'}\n\nService: ${serviceName}${status.fallbackMode ? ' (HTTP-only)' : ''}`,
          [{ text: 'OK' }]
        );
      } else {
        console.error('❌ OneSignal test failed:', result?.error);
        
        // Fallback to local notification
        console.log('🔄 Falling back to local notification...');
        androidSystemNotification.sendCustomerRequest(
          'OneSignal Test Failed - Local Fallback', 
          'Check logs for details'
        );
        
        Alert.alert(
          'Test Failed', 
          `OneSignal test failed. Check logs for details. Local notification sent as fallback.\n\nTried: ${serviceName || 'Both services'}`,
          [{ text: 'OK' }]
        );
      }
      
    } catch (error) {
      console.error('❌ Test notification error:', error);
      
      // Fallback to local notification
      androidSystemNotification.sendCustomerRequest(
        'Notification Test Error', 
        'Check logs for details'
      );
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert(
        'Test Error', 
        `Test failed: ${errorMessage}`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.testButton, isLoading && styles.testButtonDisabled]} 
      onPress={handleTestNotification}
      disabled={isLoading}
    >
      <Text style={styles.testButtonText}>
        {isLoading ? '⏳ Testing...' : '🔔 Test OneSignal'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  testButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 8,
    alignItems: 'center',
  },
  testButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  testButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NotificationTestButton;
