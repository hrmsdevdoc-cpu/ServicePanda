const React = require('react');
const {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} = require('react-native');
const { Button } = require('react-native-paper');
const { useMutation, useQueryClient } = require('@tanstack/react-query');
const { useAuth } = require('../contexts/AuthContext');
const apiService = require('../services/api');
const { colors } = require('../utils/theme');

const { width } = Dimensions.get('window');

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

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

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

  // Animation effect on mount
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
       <View style={styles.modernFormContent}>
         <View style={styles.modernFormHeader}>
           <View style={styles.headerIcon}>
             <Text style={styles.headerEmoji}>💳</Text>
           </View>
           <View style={styles.headerText}>
             <Text style={styles.modernTitle}>Add New Payment Method</Text>
             <Text style={styles.modernSubtitle}>
               Enter your card details to add a new payment method
             </Text>
           </View>
         </View>
        {/* Cardholder Name */}
        <View style={styles.modernInputContainer}>
          <Text style={styles.modernLabel}>Cardholder Name *</Text>
          <TextInput
            style={styles.modernTextInput}
            placeholder="John Smith"
            placeholderTextColor={colors.textTertiary}
            value={formData.cardholderName}
            onChangeText={(value) => handleInputChange('cardholderName', value)}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        {/* Card Number */}
        <View style={styles.modernInputContainer}>
          <Text style={styles.modernLabel}>Card Number *</Text>
          <TextInput
            style={styles.modernTextInput}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor={colors.textTertiary}
            value={formData.cardNumber}
            onChangeText={(value) => handleInputChange('cardNumber', formatCardNumber(value))}
            keyboardType="numeric"
            maxLength={19} // 16 digits + 3 spaces
          />
        </View>

        {/* Expiry and CVV Row */}
        <View style={styles.modernRow}>
          {/* Expiry Month */}
          <View style={[styles.modernInputContainer, styles.modernHalfWidth]}>
            <Text style={styles.modernLabel}>Expiry Month *</Text>
            <TextInput
              style={styles.modernTextInput}
              placeholder="MM"
              placeholderTextColor={colors.textTertiary}
              value={formData.expiryMonth}
              onChangeText={(value) => handleInputChange('expiryMonth', value.replace(/\D/g, '').slice(0, 2))}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>

          {/* Expiry Year */}
          <View style={[styles.modernInputContainer, styles.modernHalfWidth]}>
            <Text style={styles.modernLabel}>Expiry Year *</Text>
            <TextInput
              style={styles.modernTextInput}
              placeholder="YY"
              placeholderTextColor={colors.textTertiary}
              value={formData.expiryYear}
              onChangeText={(value) => handleInputChange('expiryYear', value.replace(/\D/g, '').slice(0, 2))}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>

          {/* CVV */}
          <View style={[styles.modernInputContainer, styles.modernHalfWidth]}>
            <Text style={styles.modernLabel}>CVV *</Text>
            <TextInput
              style={styles.modernTextInput}
              placeholder="123"
              placeholderTextColor={colors.textTertiary}
              value={formData.cvv}
              onChangeText={(value) => handleInputChange('cvv', value.replace(/\D/g, '').slice(0, 4))}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry={true}
            />
          </View>
        </View>

        {/* Modern Information */}
        <View style={styles.modernInfoContainer}>
          <View style={styles.modernInfoCard}>
            <View style={styles.modernInfoHeader}>
              <Text style={styles.modernInfoIcon}>🔒</Text>
              <Text style={styles.modernInfoTitle}>Secure Payment</Text>
            </View>
            <View style={styles.modernInfoList}>
              <Text style={styles.modernInfoItem}>• Your card information is securely processed</Text>
              <Text style={styles.modernInfoItem}>• You will be charged only when you accept a lead</Text>
              <Text style={styles.modernInfoItem}>• Your first 3 leads are completely FREE</Text>
            </View>
          </View>
        </View>

        {/* Modern Action Buttons */}
        <View style={styles.modernButtonContainer}>
          <TouchableOpacity
            style={styles.modernCancelButton}
            onPress={onCancel}
            disabled={isProcessing}
          >
            <Text style={styles.modernCancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modernSubmitButton, isProcessing && styles.modernSubmitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isProcessing}
          >
            <Text style={styles.modernSubmitButtonText}>
              {isProcessing ? 'Adding...' : 'Add Payment Method'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    padding: 0,
  },
  // Modern Form Header
  modernFormHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerEmoji: {
    fontSize: 24,
  },
  headerText: {
    flex: 1,
  },
  modernTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  modernSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 20,
  },
  // Modern Form Content
  modernFormContent: {
    gap: 20,
    backgroundColor: 'transparent',
    padding: 0,
  },
  modernInputContainer: {
    marginBottom: 0,
  },
  modernHalfWidth: {
    flex: 1,
    marginRight: 12,
  },
  modernRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modernLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: colors.text,
    letterSpacing: -0.2,
  },
  modernTextInput: {
    borderWidth: 2,
    borderColor: colors.borderLight,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#f8fafc',
    color: colors.text,
    fontWeight: '500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  // Modern Information
  modernInfoContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  modernInfoCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  modernInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modernInfoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  modernInfoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.2,
  },
  modernInfoList: {
    gap: 8,
  },
  modernInfoItem: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    fontWeight: '500',
  },
  // Modern Buttons
  modernButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  modernCancelButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  modernCancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  modernSubmitButton: {
    flex: 2,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modernSubmitButtonDisabled: {
    backgroundColor: colors.textTertiary,
    shadowOpacity: 0.1,
  },
  modernSubmitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});

module.exports = SimplePaymentForm;
