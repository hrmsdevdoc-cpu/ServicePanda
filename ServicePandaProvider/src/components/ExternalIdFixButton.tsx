import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExternalIdFixButton = () => {
  const [isFixing, setIsFixing] = useState(false);

  const fixExternalId = async () => {
    try {
      setIsFixing(true);
      console.log('🔧 Starting external ID fix...');
      
      // Get provider ID
      const providerId = await AsyncStorage.getItem('providerId');
      if (!providerId) {
        Alert.alert('Error', 'No provider ID found. Please login first.');
        return;
      }
      
      console.log('🆔 Provider ID:', providerId);
      
      // Clear old player ID to force fresh registration
      console.log('🗑️ Clearing old player ID...');
      await AsyncStorage.removeItem('oneSignalPlayerId');
      console.log('✅ Old player ID cleared');
      
      // Import and use the fixed OneSignal service
      const { fixedOneSignalService } = require('../services/fixedOneSignalService');
      
      // Force update the external user ID (will create new device)
      const result = await fixedOneSignalService.forceUpdateExternalUserId(providerId);
      
      if (result.success) {
        const method = result.result.method || 'unknown';
        Alert.alert(
          'Success!', 
          `External user ID has been set to: provider-${providerId}\n\nMethod: ${method}\nPlayer ID: ${result.result.id}\n\nCheck your OneSignal dashboard to verify.`
        );
        console.log('✅ External ID fix successful:', result.result);
        
        // Send test notification
        console.log('📱 Sending test notification...');
        const notificationResult = await fixedOneSignalService.sendTestNotification(providerId);
        if (notificationResult.success && notificationResult.recipients > 0) {
          Alert.alert('Perfect!', 'Test notification sent successfully! Check your device.');
        }
        
        // Also test broadcast notification (works without external ID)
        console.log('📢 Testing broadcast notification...');
        const broadcastResult = await fixedOneSignalService.sendBroadcastTestNotification();
        if (broadcastResult.success && broadcastResult.recipients > 0) {
          Alert.alert('Excellent!', `Broadcast test sent to ${broadcastResult.recipients} recipients! This proves notifications work WITHOUT external ID!`);
        }
      } else {
        Alert.alert('Error', `Failed to fix external ID: ${result.error}`);
        console.error('❌ External ID fix failed:', result.error);
      }
      
    } catch (error) {
      console.error('❌ External ID fix error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      Alert.alert('Error', `Fix failed: ${errorMessage}`);
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, isFixing && styles.buttonDisabled]} 
        onPress={fixExternalId}
        disabled={isFixing}
      >
        <Text style={styles.buttonText}>
          {isFixing ? 'Fixing External ID...' : 'Fix External User ID'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.description}>
        This will set the external user ID in OneSignal for proper notification targeting.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default ExternalIdFixButton;
