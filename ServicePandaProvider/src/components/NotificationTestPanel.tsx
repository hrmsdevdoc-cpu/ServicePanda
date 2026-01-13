import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import nativeAndroidNotificationService from '../services/nativeAndroidNotificationService';
import notificationApiService from '../services/notificationApiService';

interface NotificationTestPanelProps {
  style?: any;
}

const NotificationTestPanel: React.FC<NotificationTestPanelProps> = ({ style }) => {
  
  React.useEffect(() => {
    // Initialize services
    nativeAndroidNotificationService.initialize();
    notificationApiService.initialize();
  }, []);


  const simulateServerCustomerRequest = () => {
    notificationApiService.simulateCustomerRequest();
  };

  const simulateServerPayment = () => {
    notificationApiService.simulatePaymentReceived();
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>🔔 Notifications</Text>
      
      <TouchableOpacity style={styles.button} onPress={simulateServerCustomerRequest}>
        <Text style={styles.buttonText}>🛎️ Customer Request</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={simulateServerPayment}>
        <Text style={styles.buttonText}>💰 Payment Received</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NotificationTestPanel;
