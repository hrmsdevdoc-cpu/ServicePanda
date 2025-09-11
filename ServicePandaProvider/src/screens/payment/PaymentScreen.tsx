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
    <ScrollView 
      style={styles.container}
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
        {/* Modern Header */}
        <View style={styles.modernHeader}>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Text style={styles.headerEmoji}>💳</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.modernTitle}>Payment Methods</Text>
              <Text style={styles.modernSubtitle}>
                Manage your payment methods for receiving leads
              </Text>
            </View>
          </View>
        </View>

        {/* Modern Status Cards */}
        <View style={styles.modernStatsContainer}>
          <View style={styles.statsGrid}>
            <TouchableOpacity style={[styles.modernStatCard, styles.primaryStatCard]}>
              <View style={styles.statCardHeader}>
                <View style={styles.statIconWrapper}>
                  <Text style={styles.statIcon}>💳</Text>
                </View>
                <View style={styles.statBadge}>
                  <Text style={styles.statBadgeText}>PAYMENT</Text>
                </View>
              </View>
              <Text style={styles.modernStatNumber}>{paymentMethods.length}</Text>
              <Text style={styles.modernStatLabel}>Payment Methods</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modernStatCard, styles.secondaryStatCard]}>
              <View style={styles.statCardHeader}>
                <View style={styles.statIconWrapper}>
                  <Text style={styles.statIcon}>✅</Text>
                </View>
                <View style={styles.statBadge}>
                  <Text style={styles.statBadgeText}>STATUS</Text>
                </View>
              </View>
              <Text style={[styles.modernStatNumber, { color: paymentMethods.length > 0 ? colors.success : colors.warning }]}>
                {paymentMethods.length > 0 ? 'Ready' : 'Setup'}
              </Text>
              <Text style={styles.modernStatLabel}>Payment Status</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.modernStatCard, styles.tertiaryStatCard, styles.fullWidthCard]}>
            <View style={styles.statCardHeader}>
              <View style={styles.statIconWrapper}>
                <Text style={styles.statIcon}>🎁</Text>
              </View>
              <View style={styles.statBadge}>
                <Text style={styles.statBadgeText}>FREE</Text>
              </View>
            </View>
            <Text style={styles.modernStatNumber}>3</Text>
            <Text style={styles.modernStatLabel}>Free Leads Remaining</Text>
          </TouchableOpacity>
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

       {/* Add Payment Method Form */}
       {showAddPaymentForm && (
         <Card style={styles.paymentFormCard}>
           <Card.Content>
             <SimplePaymentForm
               onSuccess={handleAddPaymentSuccess}
               onCancel={handleAddPaymentCancel}
             />
           </Card.Content>
         </Card>
       )}

        {/* Modern Information Section */}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  statusCardsContainer: {
    marginBottom: 12,
  },
  statusCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusCard: {
    flex: 1,
    marginHorizontal: 3,
    elevation: 1,
  },
  statusCardContent: {
    padding: 10,
  },
  statusCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  iconText: {
    fontSize: 18,
  },
  statusCardText: {
    flex: 1,
  },
  statusCardLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  statusCardValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentMethodsCard: {
    marginBottom: 8,
    elevation: 1,
  },
  paymentMethodsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  addButton: {
    marginLeft: 4,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  loadingText: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 11,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 10,
  },
  emptyIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  emptyText: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 8,
    lineHeight: 14,
  },
  paymentMethodsList: {
    gap: 8,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 8,
  },
  paymentMethodIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    marginRight: 8,
    marginTop: 2,
  },
  paymentMethodIconText: {
    fontSize: 14,
  },
  paymentMethodDetails: {
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    lineHeight: 14,
  },
  paymentMethodSubtitle: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 1,
    lineHeight: 12,
  },
  primaryBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  primaryBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  paymentMethodRight: {
    alignItems: 'flex-end',
    gap: 4,
    minWidth: 120,
  },
  paymentMethodActions: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
  },
  actionButton: {
    marginBottom: 4,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 110,
  },
  deleteButton: {
    borderRadius: 6,
    height: 40,
    paddingHorizontal: 16,
    minWidth: 110,
  },
  infoCard: {
    marginTop: 12,
    elevation: 1,
  },
  infoGrid: {
    flexDirection: 'column',
    marginTop: 8,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoList: {
    gap: 4,
  },
  infoListItem: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 3,
    lineHeight: 14,
  },
  paymentFormCard: {
    marginBottom: 12,
    elevation: 1,
  },
  // Modern Styles
  animatedContainer: {
    flex: 1,
  },
  // Modern Header
  modernHeader: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
  // Modern Stats Container
  modernStatsContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  modernStatCard: {
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
    flex: 1,
  },
  fullWidthCard: {
    flex: 1,
  },
  primaryStatCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  secondaryStatCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.success + '20',
  },
  tertiaryStatCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.warning + '20',
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  statIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 20,
  },
  statBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  modernStatNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -1,
    textAlign: 'center',
  },
  modernStatLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  // Modern Payment Methods Container
  modernPaymentMethodsContainer: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
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
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  modernSectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  modernAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  // Modern Loading and Empty States
  modernLoadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  modernLoadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    fontWeight: '500',
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
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  modernEmptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Modern Payment Methods List
  modernPaymentMethodsList: {
    gap: 12,
  },
  modernPaymentMethodCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  modernPaymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modernPaymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modernPaymentMethodIconText: {
    fontSize: 18,
  },
  modernPaymentMethodInfo: {
    flex: 1,
  },
  modernPaymentMethodTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  modernPaymentMethodSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  modernPrimaryBadge: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modernPrimaryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
  },
  modernPaymentMethodActions: {
    flexDirection: 'row',
    gap: 8,
  },
  modernActionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  modernActionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  modernDeleteButton: {
    borderColor: colors.error + '30',
    backgroundColor: colors.error + '05',
  },
  modernDeleteButtonText: {
    color: colors.error,
  },
  // Modern Payment Form Container
  modernPaymentFormContainer: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  // Modern Info Container
  modernInfoContainer: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 32,
  },
  modernInfoHeader: {
    marginBottom: 20,
  },
  modernInfoTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.3,
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
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.2,
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











