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

interface SimplePaymentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const SimplePaymentForm: React.FC<SimplePaymentFormProps> = ({ onSuccess, onCancel }) => {
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
    mutationFn: async (paymentData: any) => {
      try {
        console.log('🔍 Creating payment method with data:', paymentData);
        console.log('🔍 Provider ID:', providerData?.id);
        
        // Create payment method data for API
        const paymentMethodData = {
          cardholderName: paymentData.cardholderName,
          cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
          expiryMonth: paymentData.expiryMonth,
          expiryYear: paymentData.expiryYear,
          cvv: paymentData.cvv,
          cardLastFour: paymentData.cardNumber.slice(-4),
          cardBrand: getCardBrand(paymentData.cardNumber),
        };

        console.log('🔍 Calling API with payment method data:', paymentMethodData);
        
        // Call the API service to add payment method
        const result = await apiService.addPaymentMethod(providerData?.id, paymentMethodData);
        console.log('✅ API response:', result);
        
        return result;
      } catch (error) {
        console.error('❌ Payment method creation failed:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/provider/payment-methods'] });
      Alert.alert('Success', 'Payment method added successfully!');
      onSuccess();
    },
    onError: (error: any) => {
      console.error('❌ Payment method addition error:', error);
      Alert.alert('Error', error.message || 'Failed to add payment method.');
    },
  });

  // Helper function to detect card brand
  const getCardBrand = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'American Express';
    if (cleaned.startsWith('6')) return 'Discover';
    return 'Unknown';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const formatExpiry = (text: string) => {
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
      console.log('🔍 Starting payment method submission...');
      console.log('🔍 Form data:', formData);
      console.log('🔍 Provider data:', providerData);
      
      // Create payment method object with all required data
      const paymentMethod = {
        cardholderName: formData.cardholderName,
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        cvv: formData.cvv,
        cardLastFour: formData.cardNumber.slice(-4),
        cardBrand: getCardBrand(formData.cardNumber),
      };
      
      console.log('🔍 Payment method object:', paymentMethod);
      
      await addPaymentMethodMutation.mutateAsync(paymentMethod);
    } catch (error) {
      console.error('❌ Submit error:', error);
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
      {/* Cardholder Name */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Cardholder Name *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="John Smith"
          placeholderTextColor="#9ca3af"
          value={formData.cardholderName}
          onChangeText={(value: string) => handleInputChange('cardholderName', value)}
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
          placeholderTextColor="#9ca3af"
          value={formData.cardNumber}
          onChangeText={(value: string) => handleInputChange('cardNumber', formatCardNumber(value))}
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
            placeholderTextColor="#9ca3af"
            value={formData.expiryMonth}
            onChangeText={(value: string) => handleInputChange('expiryMonth', value.replace(/\D/g, '').slice(0, 2))}
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
            placeholderTextColor="#9ca3af"
            value={formData.expiryYear}
            onChangeText={(value: string) => handleInputChange('expiryYear', value.replace(/\D/g, '').slice(0, 2))}
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
            placeholderTextColor="#9ca3af"
            value={formData.cvv}
            onChangeText={(value: string) => handleInputChange('cvv', value.replace(/\D/g, '').slice(0, 4))}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry={true}
          />
        </View>
      </View>



      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={isProcessing}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitButton, isProcessing && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isProcessing}
        >
          <Text style={styles.submitButtonText}>
            {isProcessing ? 'Adding...' : 'Add Payment Method'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    padding: 0,
  },
  inputContainer: {
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
    marginRight: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#ffffff',
    color: colors.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  submitButton: {
    flex: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  // Debug styles
  debugSection: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  debugText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  debugButton: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  debugButtonText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
  },
});

module.exports = SimplePaymentForm;