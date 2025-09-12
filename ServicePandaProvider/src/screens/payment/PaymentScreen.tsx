const React = require('react');
const {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} = require('react-native');
const { Card, Title, Paragraph, Button, ActivityIndicator } = require('react-native-paper');
const { useQuery, useMutation, useQueryClient } = require('@tanstack/react-query');
const { useAuth } = require('../../contexts/AuthContext');
const apiService = require('../../services/api');
const { colors } = require('../../utils/theme');
const SimplePaymentForm = require('../../components/SimplePaymentForm');

const { width } = Dimensions.get('window');

interface PaymentMethod {
  id: string;
  cardBrand: string;
  cardLastFour: string;
  cardExpMonth: string;
  cardExpYear: string;
  isPrimary: boolean;
}

interface Lead {
  status: string;
}

interface PaymentScreenProps {
  onNavigate?: (screen: string) => void;
  onBack?: () => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ onNavigate, onBack }) => {
  const { providerData } = useAuth();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);
  const [showAddPaymentForm, setShowAddPaymentForm] = React.useState(false);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  // Fetch payment methods
  const { data: paymentMethods = [], isLoading: loadingPayments, refetch: refetchPayments } = useQuery({
    queryKey: ['/api/provider/payment-methods'],
    queryFn: () => apiService.getPaymentMethods(providerData?.id),
    enabled: !!providerData?.id,
  });

  // Fetch leads for new leads count
  const { data: leads = [] } = useQuery({
    queryKey: ['/api/provider/leads'],
    queryFn: () => apiService.getLeads(),
  });

  const newLeadsCount = leads.filter((l: Lead) => l.status === 'pending').length;

  // Set primary payment method mutation
  const setPrimaryMutation = useMutation({
    mutationFn: (paymentMethodId: string) => apiService.setPrimaryPaymentMethod(providerData?.id, paymentMethodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/provider/payment-methods'] });
      Alert.alert('Success', 'Primary payment method updated successfully.');
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to update primary payment method.');
    },
  });

  // Delete payment method mutation
  const deletePaymentMethodMutation = useMutation({
    mutationFn: (paymentMethodId: string) => apiService.deletePaymentMethod(providerData?.id, paymentMethodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/provider/payment-methods'] });
      Alert.alert('Success', 'Payment method removed successfully.');
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to remove payment method.');
    },
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchPayments(),
    ]);
    setRefreshing(false);
  }, [refetchPayments]);

  const formatCardBrand = (brand: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa': return 'Visa';
      case 'mastercard': return 'Mastercard';
      case 'amex': return 'American Express';
      case 'discover': return 'Discover';
      default: return brand;
    }
  };

  const handleSetPrimary = (paymentMethodId: string) => {
    Alert.alert(
      'Set Primary',
      'Are you sure you want to set this as your primary payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Set Primary', onPress: () => setPrimaryMutation.mutate(paymentMethodId) }
      ]
    );
  };

  const handleDeletePaymentMethod = (paymentMethodId: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deletePaymentMethodMutation.mutate(paymentMethodId) }
      ]
    );
  };

  const handleAddPaymentMethod = () => {
    setShowAddPaymentForm(true);
  };

  const handleAddPaymentSuccess = () => {
    setShowAddPaymentForm(false);
    refetchPayments();
  };

  const handleAddPaymentCancel = () => {
    setShowAddPaymentForm(false);
  };

  // Animation effect on mount
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header with Back Button and Title */}
      {/* <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <TouchableOpacity 
          style={styles.addMethodButton}
          onPress={handleAddPaymentMethod}
        >
          <Text style={styles.addMethodButtonText}>+ Add Method</Text>
        </TouchableOpacity>
      </View> */}

      <ScrollView 
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          {/* Payment Methods Overview Card */}
          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <View style={styles.overviewIcon}>
                <Text style={styles.overviewIconText}>💳</Text>
              </View>
              <View style={styles.overviewText}>
                <Text style={styles.overviewTitle}>Payment Methods</Text>
                <Text style={styles.overviewSubtitle}>Manage your payment methods for receiving leads</Text>
              </View>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={styles.statIcon}>
                  <Text style={styles.statIconText}>💳</Text>
                </View>
                <View style={styles.statBadge}>
                  <Text style={styles.statBadgeText}>PAYMENT</Text>
                </View>
              </View>
              <Text style={styles.statNumber}>{paymentMethods.length}</Text>
              <Text style={styles.statLabel}>Payment Methods</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={styles.statIcon}>
                  <Text style={styles.statIconText}>✅</Text>
                </View>
                <View style={styles.statBadge}>
                  <Text style={styles.statBadgeText}>STATUS</Text>
                </View>
              </View>
              <Text style={[styles.statNumber, { color: paymentMethods.length > 0 ? colors.success : colors.warning }]}>
                {paymentMethods.length > 0 ? 'Ready' : 'Setup'}
              </Text>
              <Text style={styles.statLabel}>Payment Status</Text>
            </View>
          </View>

          {/* Free Leads Card */}
          <View style={styles.freeLeadsCard}>
            <View style={styles.freeLeadsHeader}>
              <View style={styles.freeLeadsIcon}>
                <Text style={styles.freeLeadsIconText}>🎁</Text>
              </View>
              <View style={styles.freeLeadsBadge}>
                <Text style={styles.freeLeadsBadgeText}>FREE</Text>
              </View>
            </View>
            <Text style={styles.freeLeadsNumber}>3</Text>
            <Text style={styles.freeLeadsLabel}>Free Leads Remaining</Text>
          </View>

        {/* Modern Payment Methods Section */}
        <View style={styles.modernPaymentMethodsContainer}>
          <View style={styles.modernSectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.modernSectionTitle}>Payment Methods</Text>
              <Text style={styles.modernSectionSubtitle}>Manage your payment methods</Text>
            </View>
            <TouchableOpacity 
              style={styles.modernAddButton}
              onPress={handleAddPaymentMethod}
            >
              <Text style={styles.addButtonIcon}>+</Text>
              <Text style={styles.addButtonText}>Add Method</Text>
            </TouchableOpacity>
          </View>

          {loadingPayments ? (
            <View style={styles.modernLoadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.modernLoadingText}>Loading payment methods...</Text>
            </View>
          ) : paymentMethods.length === 0 ? (
            <View style={styles.modernEmptyContainer}>
              <Text style={styles.modernEmptyIcon}>💳</Text>
              <Text style={styles.modernEmptyTitle}>No Payment Methods</Text>
              <Text style={styles.modernEmptyText}>
                Add a payment method to start receiving leads
              </Text>
            </View>
          ) : (
            <View style={styles.modernPaymentMethodsList}>
              {paymentMethods.map((method: PaymentMethod) => (
                <TouchableOpacity key={method.id} style={styles.modernPaymentMethodCard}>
                  <View style={styles.modernPaymentMethodHeader}>
                    <View style={styles.modernPaymentMethodIcon}>
                      <Text style={styles.modernPaymentMethodIconText}>💳</Text>
                    </View>
                    <View style={styles.modernPaymentMethodInfo}>
                      <Text style={styles.modernPaymentMethodTitle}>
                        {formatCardBrand(method.cardBrand)} **** **** **** {method.cardLastFour}
                      </Text>
                      <Text style={styles.modernPaymentMethodSubtitle}>
                        Expires {method.cardExpMonth}/{method.cardExpYear}
                      </Text>
                    </View>
                    {method.isPrimary && (
                      <View style={styles.modernPrimaryBadge}>
                        <Text style={styles.modernPrimaryBadgeText}>⭐ Primary</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.modernPaymentMethodActions}>
                    {!method.isPrimary && (
                      <TouchableOpacity
                        style={styles.modernActionButton}
                        onPress={() => handleSetPrimary(method.id)}
                        disabled={setPrimaryMutation.isPending}
                      >
                        <Text style={styles.modernActionButtonText}>Set Primary</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.modernActionButton, styles.modernDeleteButton]}
                      onPress={() => handleDeletePaymentMethod(method.id)}
                      disabled={deletePaymentMethodMutation.isPending}
                    >
                      <Text style={[styles.modernActionButtonText, styles.modernDeleteButtonText]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

          {/* Add New Payment Method Section */}
          {showAddPaymentForm && (
            <View style={styles.addPaymentCard}>
              <View style={styles.addPaymentHeader}>
                <View style={styles.addPaymentIcon}>
                  <Text style={styles.addPaymentIconText}>💳</Text>
                </View>
                <View style={styles.addPaymentText}>
                  <Text style={styles.addPaymentTitle}>Add New Payment Method</Text>
                  <Text style={styles.addPaymentSubtitle}>
                    Enter your card details to add a new payment method
                  </Text>
                </View>
              </View>
              
              <SimplePaymentForm
                onSuccess={handleAddPaymentSuccess}
                onCancel={handleAddPaymentCancel}
              />
            </View>
          )}

          <View style={styles.modernInfoContainer}>
  <View style={styles.modernInfoHeader}>
    <Text style={styles.modernInfoTitle}>Payment Information</Text>
    <Text style={styles.modernInfoSubtitle}>How billing and security work</Text>
  </View>
  <View style={styles.modernInfoGrid}>
    <View style={styles.modernInfoCard}>
      <View style={styles.modernInfoCardHeader}>
        <Text style={styles.modernInfoCardIcon}>💰</Text>
        <Text style={styles.modernInfoCardTitle}>How Billing Works</Text>
      </View>
      <View style={styles.modernInfoList}>
        <Text style={styles.modernInfoListItem}>• Your first 3 leads are completely FREE</Text>
        <Text style={styles.modernInfoListItem}>• After that, you're charged only when you accept a lead</Text>
        <Text style={styles.modernInfoListItem}>• Pricing varies by service category and location</Text>
        <Text style={styles.modernInfoListItem}>• Charges are processed using your primary payment method</Text>
      </View>
    </View>
    <View style={styles.modernInfoCard}>
      <View style={styles.modernInfoCardHeader}>
        <Text style={styles.modernInfoCardIcon}>🔒</Text>
        <Text style={styles.modernInfoCardTitle}>Security & Privacy</Text>
      </View>
      <View style={styles.modernInfoList}>
        <Text style={styles.modernInfoListItem}>• All payments processed securely by Stripe</Text>
        <Text style={styles.modernInfoListItem}>• Your card details are never stored on our servers</Text>
        <Text style={styles.modernInfoListItem}>• Industry-standard encryption protects your data</Text>
        <Text style={styles.modernInfoListItem}>• PCI DSS compliant payment processing</Text>
      </View>
    </View>
  </View>
</View>

        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  addMethodButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addMethodButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  animatedContainer: {
    padding: 20,
  },
  // Overview Card
  overviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overviewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  overviewIconText: {
    fontSize: 20,
  },
  overviewText: {
    flex: 1,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  overviewSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIconText: {
    fontSize: 16,
  },
  statBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  // Free Leads Card
  freeLeadsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  freeLeadsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  freeLeadsIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  freeLeadsIconText: {
    fontSize: 16,
  },
  freeLeadsBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  freeLeadsBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  freeLeadsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  freeLeadsLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  // Payment Methods Card
  paymentMethodsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  paymentMethodsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  paymentMethodsTitleContainer: {
    flex: 1,
  },
  paymentMethodsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  paymentMethodsSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  addMethodButtonSmall: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addMethodButtonSmallText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  cardImageContainer: {
    marginBottom: 16,
  },
  cardImage: {
    width: 60,
    height: 40,
    backgroundColor: '#fbbf24',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  cardImageText: {
    fontSize: 20,
    color: '#000',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  paymentMethodsList: {
    gap: 12,
  },
  paymentMethodItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentMethodIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentMethodIconText: {
    fontSize: 16,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  paymentMethodSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  primaryBadge: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  primaryBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.success,
  },
  paymentMethodActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  deleteButton: {
    borderColor: colors.error + '50',
    backgroundColor: colors.error + '10',
  },
  deleteButtonText: {
    color: colors.error,
  },
  // Add Payment Card
  addPaymentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  addPaymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  addPaymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addPaymentIconText: {
    fontSize: 20,
  },
  addPaymentText: {
    flex: 1,
  },
  addPaymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  addPaymentSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  // Modern Payment Methods Styles
  modernPaymentMethodsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  modernSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  modernSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  modernSectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  modernAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  modernLoadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  modernLoadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  modernEmptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  modernEmptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  modernEmptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  modernEmptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  modernPaymentMethodsList: {
    gap: 12,
  },
  modernPaymentMethodCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  modernPaymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modernPaymentMethodIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modernPaymentMethodIconText: {
    fontSize: 16,
  },
  modernPaymentMethodInfo: {
    flex: 1,
  },
  modernPaymentMethodTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  modernPaymentMethodSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  modernPrimaryBadge: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modernPrimaryBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.success,
  },
  modernPaymentMethodActions: {
    flexDirection: 'row',
    gap: 8,
  },
  modernActionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  modernActionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  modernDeleteButton: {
    borderColor: colors.error + '50',
    backgroundColor: colors.error + '10',
  },
  modernDeleteButtonText: {
    color: colors.error,
  },
  // Modern Info Section Styles
  modernInfoContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  modernInfoHeader: {
    marginBottom: 20,
  },
  modernInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  modernInfoSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  modernInfoGrid: {
    gap: 16,
  },
  modernInfoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  modernInfoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modernInfoCardIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  modernInfoCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  modernInfoList: {
    gap: 8,
  },
  modernInfoListItem: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    fontWeight: '500',
  },
});

module.exports = PaymentScreen;