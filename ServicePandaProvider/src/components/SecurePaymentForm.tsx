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
const { useMutation, useQueryClient, useQuery } = require('@tanstack/react-query');
const { useAuth } = require('../contexts/AuthContext');
const apiService = require('../services/api');
const { colors } = require('../utils/theme');
const { StripeProvider, useStripe, CardField } = require('@stripe/stripe-react-native');

const { width } = Dimensions.get('window');

interface SecurePaymentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const SecurePaymentForm: React.FC<SecurePaymentFormProps> = ({ onSuccess, onCancel }) => {
  const { providerData } = useAuth();
  const queryClient = useQueryClient();
  const { createPaymentMethod } = useStripe();
  
  const [cardholderName, setCardholderName] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [cardDetails, setCardDetails] = React.useState(null);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  // Get Stripe public key
  const { data: stripeConfig } = useQuery({
    queryKey: ['/api/config/stripe'],
    queryFn: async () => {
      const response = await apiService.request('GET', '/api/config/stripe');
      return response;
    },
    retry: false,
  });

  const addPaymentMethodMutation = useMutation({
    mutationFn: async (paymentMethodId) => {
      try {
        console.log('🔍 Creating payment method with Stripe ID:', paymentMethodId);
        console.log('🔍 Provider ID:', providerData?.id);
        
        // Call the secure API endpoint that just attaches the payment method
        const result = await apiService.request('POST', `/api/provider/${providerData?.id}/stripe-payment-methods`, {
          paymentMethodId: paymentMethodId
        });
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
    onError: (error) => {
      console.error('❌ Payment method addition error:', error);
      Alert.alert('Error', error.message || 'Failed to add payment method.');
    },
  });

  const handleSubmit = async () => {
    if (!cardholderName.trim()) {
      Alert.alert('Error', 'Please enter cardholder name');
      return;
    }

    if (!cardDetails?.complete) {
      Alert.alert('Error', 'Please enter complete card details');
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log('🔍 Creating payment method with Stripe...');
      
      // Create payment method using Stripe Elements
      const { error, paymentMethod } = await createPaymentMethod({
        type: 'Card',
        card: cardDetails,
        billingDetails: {
          name: cardholderName,
        },
      });

      if (error) {
        console.error('❌ Stripe error:', error);
        Alert.alert('Error', error.message || 'Failed to create payment method');
        return;
      }

      if (paymentMethod) {
        console.log('✅ Payment method created:', paymentMethod.id);
        await addPaymentMethodMutation.mutateAsync(paymentMethod.id);
      }
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

  if (!stripeConfig?.publicKey) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading secure payment form...</Text>
      </View>
    );
  }

  return (
    <StripeProvider publishableKey={stripeConfig.publicKey}>
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
            value={cardholderName}
            onChangeText={setCardholderName}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        {/* Card Details using Stripe Elements */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Card Information *</Text>
          <View style={styles.cardFieldContainer}>
            <CardField
              postalCodeEnabled={false}
              placeholders={{
                number: '1234 5678 9012 3456',
              }}
              cardStyle={styles.cardField}
              style={styles.cardFieldStyle}
              onCardChange={(cardDetails) => {
                setCardDetails(cardDetails);
              }}
            />
          </View>
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Text style={styles.securityText}>
            🔒 Your card information is securely processed by Stripe and never stored on our servers.
          </Text>
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
            disabled={isProcessing || !cardDetails?.complete}
          >
            <Text style={styles.submitButtonText}>
              {isProcessing ? 'Adding...' : 'Add Payment Method'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    padding: 0,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
  },
  inputContainer: {
    marginBottom: 16,
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
  cardFieldContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cardField: {
    backgroundColor: '#ffffff',
    textColor: colors.text,
    fontSize: 16,
  },
  cardFieldStyle: {
    height: 50,
  },
  securityNotice: {
    backgroundColor: '#f0f9ff',
    borderColor: '#0ea5e9',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  securityText: {
    fontSize: 12,
    color: '#0369a1',
    textAlign: 'center',
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
});

module.exports = SecurePaymentForm;
