import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import androidSystemNotification from '../services/androidSystemNotification';
import { colors } from '../utils/theme';

const NotificationTestButton: React.FC = () => {
  const handleTestNotification = () => {
    console.log('🔥 TEST BUTTON CLICKED FOR ANDROID NOTIFICATION BAR! 🔥');
    
    try {
      console.log('🚀 Sending to ANDROID SYSTEM NOTIFICATION BAR...');
      
      // Send to ACTUAL Android notification bar (swipe down area)
      androidSystemNotification.sendCustomerRequest(
        'Plumbing service needed urgently', 
        'Brisbane CBD'
      );
      
      console.log('✅ ANDROID SYSTEM NOTIFICATION SENT!');
      console.log('📱 SWIPE DOWN FROM TOP TO SEE NOTIFICATION!');
      
    } catch (error) {
      console.error('❌ Android notification failed:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.testButton} onPress={handleTestNotification}>
      <Text style={styles.testButtonText}>🔔 Test Notification</Text>
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
  testButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NotificationTestButton;
