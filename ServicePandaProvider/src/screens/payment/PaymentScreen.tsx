const React = require('react');
const {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} = require('react-native');
const { Card, Title, Paragraph, Button, ActivityIndicator } = require('react-native-paper');
const { useQuery, useMutation, useQueryClient } = require('@tanstack/react-query');
const { useAuth } = require('../../contexts/AuthContext');
const apiService = require('../../services/api');
const { colors } = require('../../utils/theme');
const SimplePaymentForm = require('../../components/SimplePaymentForm');

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

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Page Header */}
      <View style={styles.header}>
        <Title style={styles.pageTitle}>Payment Methods</Title>
        <Paragraph style={styles.pageSubtitle}>
          Manage your payment methods for receiving leads. Your payment method will be charged when you accept a lead.
        </Paragraph>
      </View>

             {/* Payment Status Cards */}
       <View style={styles.statusCardsContainer}>
         <View style={styles.statusCardsRow}>
           <Card style={styles.statusCard}>
             <Card.Content style={styles.statusCardContent}>
               <View style={styles.statusCardHeader}>
                 <View style={[styles.statusIcon, { backgroundColor: colors.primary + '20' }]}>
                   <Text style={styles.iconText}>💳</Text>
                 </View>
                 <View style={styles.statusCardText}>
                   <Text style={styles.statusCardLabel}>Payment Methods</Text>
                   <Text style={styles.statusCardValue}>{paymentMethods.length}</Text>
                 </View>
               </View>
             </Card.Content>
           </Card>

           <Card style={styles.statusCard}>
             <Card.Content style={styles.statusCardContent}>
               <View style={styles.statusCardHeader}>
                 <View style={[styles.statusIcon, { backgroundColor: colors.success + '20' }]}>
                   <Text style={styles.iconText}>✅</Text>
                 </View>
                 <View style={styles.statusCardText}>
                   <Text style={styles.statusCardLabel}>Status</Text>
                   <Text style={[styles.statusCardValue, { color: colors.success }]}>
                     {paymentMethods.length > 0 ? 'Ready' : 'Setup Required'}
                   </Text>
                 </View>
               </View>
             </Card.Content>
           </Card>
         </View>

         <View style={styles.statusCardsRow}>
           <Card style={styles.statusCard}>
             <Card.Content style={styles.statusCardContent}>
               <View style={styles.statusCardHeader}>
                 <View style={[styles.statusIcon, { backgroundColor: colors.warning + '20' }]}>
                   <Text style={styles.iconText}>⚠️</Text>
                 </View>
                 <View style={styles.statusCardText}>
                   <Text style={styles.statusCardLabel}>Free Leads</Text>
                   <Text style={[styles.statusCardValue, { color: colors.warning }]}>3</Text>
                 </View>
               </View>
             </Card.Content>
           </Card>

           <Card style={styles.statusCard}>
             <Card.Content style={styles.statusCardContent}>
               <View style={styles.statusCardHeader}>
                 <View style={[styles.statusIcon, { backgroundColor: colors.info + '20' }]}>
                   <Text style={styles.iconText}>📊</Text>
                 </View>
                 <View style={styles.statusCardText}>
                   <Text style={styles.statusCardLabel}>Total Leads</Text>
                   <Text style={[styles.statusCardValue, { color: colors.info }]}>{leads.length}</Text>
                 </View>
               </View>
             </Card.Content>
           </Card>
         </View>
       </View>

      {/* Payment Methods List */}
      <Card style={styles.paymentMethodsCard}>
        <Card.Content>
          <View style={styles.paymentMethodsHeader}>
            <Title style={styles.sectionTitle}>Payment Methods</Title>
            <Button
              mode="contained"
              onPress={handleAddPaymentMethod}
              style={styles.addButton}
              labelStyle={styles.buttonLabel}
            >
              Add Payment Method
            </Button>
          </View>

          {loadingPayments ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading payment methods...</Text>
            </View>
          ) : paymentMethods.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>💳</Text>
              <Title style={styles.emptyTitle}>No payment methods</Title>
              <Paragraph style={styles.emptyText}>
                Add a payment method to start receiving leads.
              </Paragraph>
            </View>
          ) : (
            <View style={styles.paymentMethodsList}>
              {paymentMethods.map((method: PaymentMethod) => (
                <View key={method.id} style={styles.paymentMethodItem}>
                  <View style={styles.paymentMethodInfo}>
                    <View style={styles.paymentMethodIcon}>
                      <Text style={styles.paymentMethodIconText}>💳</Text>
                    </View>
                    <View style={styles.paymentMethodDetails}>
                      <Text style={styles.paymentMethodTitle}>
                        {formatCardBrand(method.cardBrand)} **** **** **** {method.cardLastFour}
                      </Text>
                      <Text style={styles.paymentMethodSubtitle}>
                        Expires {method.cardExpMonth}/{method.cardExpYear}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.paymentMethodRight}>
                    {method.isPrimary && (
                      <View style={[styles.primaryBadge, { backgroundColor: colors.success + '20' }]}>
                        <Text style={[styles.primaryBadgeText, { color: colors.success }]}>⭐ Primary</Text>
                      </View>
                    )}
                    
                    <View style={styles.paymentMethodActions}>
                      {!method.isPrimary && (
                        <Button
                          mode="outlined"
                          onPress={() => handleSetPrimary(method.id)}
                          disabled={setPrimaryMutation.isPending}
                          style={styles.actionButton}
                          labelStyle={styles.buttonLabel}
                        >
                          Set Primary
                        </Button>
                      )}
                      <Button
                        mode="outlined"
                        onPress={() => handleDeletePaymentMethod(method.id)}
                        disabled={deletePaymentMethodMutation.isPending}
                        style={[styles.deleteButton, { borderColor: colors.error }]}
                        textColor={colors.error}
                        labelStyle={styles.buttonLabel}
                      >
                        Delete
                      </Button>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
                 </Card.Content>
       </Card>

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

       {/* Information Section */}
       <Card style={styles.infoCard}>
         <Card.Content>
           <Title style={styles.sectionTitle}>Payment Information</Title>
           
           <View style={styles.infoGrid}>
             <View style={styles.infoSection}>
               <Text style={styles.infoSectionTitle}>How Billing Works</Text>
               <View style={styles.infoList}>
                 <Text style={styles.infoListItem}>• Your first 3 leads are completely FREE</Text>
                 <Text style={styles.infoListItem}>• After that, you're charged only when you accept a lead</Text>
                 <Text style={styles.infoListItem}>• Pricing varies by service category and location</Text>
                 <Text style={styles.infoListItem}>• Charges are processed using your primary payment method</Text>
               </View>
             </View>
             
             <View style={styles.infoSection}>
               <Text style={styles.infoSectionTitle}>Security & Privacy</Text>
               <View style={styles.infoList}>
                 <Text style={styles.infoListItem}>• All payments processed securely by Stripe</Text>
                 <Text style={styles.infoListItem}>• Your card details are never stored on our servers</Text>
                 <Text style={styles.infoListItem}>• Industry-standard encryption protects your data</Text>
                 <Text style={styles.infoListItem}>• PCI DSS compliant payment processing</Text>
               </View>
             </View>
           </View>
                  </Card.Content>
        </Card>
     </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 12,
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
});

module.exports = PaymentScreen;











