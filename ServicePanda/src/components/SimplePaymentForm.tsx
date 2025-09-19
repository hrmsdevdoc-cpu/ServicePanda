const React = require('react');
const {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
} = require('react-native');
const { Button } = require('react-native-paper');
const { useMutation, useQueryClient } = require('@tanstack/react-query');
const { useAuth } = require('../contexts/AuthContext');
const apiService = require('../services/api');
const { colors } = require('../utils/theme');

const SimplePaymentForm = ({ onSuccess, onCancel }) => {
  const { providerData } = useAuth();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = React.useState({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  
  const [isProcessing, setIsProcessing] = React.useState(false);

  const addPaymentMethodMutation = useMutation({
    mutationFn: async (paymentData) => {
      // For now, just simulate adding a payment method
      // Later you can integrate with your actual payment API
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, id: Date.now() });
        }, 1000);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/provider/payment-methods'] });
      Alert.alert('Success', 'Payment method added successfully!');
      onSuccess();
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Failed to add payment method.');
    },
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const formatExpiry = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const validateForm = () => {
    if (!formData.cardholderName.trim()) {
      Alert.alert('Error', 'Please enter cardholder name');
      return false;
    }
    if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      Alert.alert('Error', 'Please enter a valid 16-digit card number');
      return false;
    }
    if (!formData.expiryMonth || !formData.expiryYear) {
      Alert.alert('Error', 'Please enter expiry date');
      return false;
    }
    if (!formData.cvv.match(/^\d{3,4}$/)) {
      Alert.alert('Error', 'Please enter a valid CVV');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    try {
      // Create a mock payment method object
      const paymentMethod = {
        cardholderName: formData.cardholderName,
        cardLastFour: formData.cardNumber.slice(-4),
        cardBrand: 'Visa', // You can detect this based on card number
        cardExpMonth: formData.expiryMonth,
        cardExpYear: formData.expiryYear,
      };
      
      await addPaymentMethodMutation.mutateAsync(paymentMethod);
    } catch (error) {
      Alert.alert('Error', 'Failed to add payment method');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContent}>
                <View style={styles.formHeader}>
          <Text style={styles.title}>Add New Payment Method</Text>
          <Text style={styles.subtitle}>
            Enter your card details to add a new payment method
          </Text>
        </View>

            {/* Cardholder Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Cardholder Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="John Smith"
                value={formData.cardholderName}
                onChangeText={(value) => handleInputChange('cardholderName', value)}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            {/* Card Number */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Card Number *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChangeText={(value) => handleInputChange('cardNumber', formatCardNumber(value))}
                keyboardType="numeric"
                maxLength={19} // 16 digits + 3 spaces
              />
            </View>

            {/* Expiry and CVV Row */}
            <View style={styles.row}>
              {/* Expiry Month */}
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>Expiry Month *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="MM"
                  value={formData.expiryMonth}
                  onChangeText={(value) => handleInputChange('expiryMonth', value.replace(/\D/g, '').slice(0, 2))}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>

              {/* Expiry Year */}
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>Expiry Year *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="YY"
                  value={formData.expiryYear}
                  onChangeText={(value) => handleInputChange('expiryYear', value.replace(/\D/g, '').slice(0, 2))}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>

              {/* CVV */}
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>CVV *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="123"
                  value={formData.cvv}
                  onChangeText={(value) => handleInputChange('cvv', value.replace(/\D/g, '').slice(0, 4))}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry={true}
                />
              </View>
            </View>

            {/* Information */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                • Your card information is securely processed{'\n'}
                • You will be charged only when you accept a lead{'\n'}
                • Your first 3 leads are completely FREE
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={onCancel}
                disabled={isProcessing}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                disabled={isProcessing}
                style={styles.submitButton}
                loading={isProcessing}
              >
                {isProcessing ? 'Adding...' : 'Add Payment Method'}
              </Button>
            </View>
                 </View>
     </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  formContent: {
    padding: 16,
  },
  formHeader: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 0,
  },
  inputContainer: {
    marginBottom: 20,
  },
  halfWidth: {
    flex: 1,
    marginRight: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  infoContainer: {
    backgroundColor: colors.surface + '20',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});

module.exports = SimplePaymentForm;
