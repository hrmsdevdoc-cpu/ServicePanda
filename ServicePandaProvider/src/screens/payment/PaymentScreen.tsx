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

const PaymentScreen = ({ onNavigate, onBack }) => {
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

  const newLeadsCount = leads.filter(l => l.status === 'pending').length;

  // Set primary payment method mutation
  const setPrimaryMutation = useMutation({
    mutationFn: (paymentMethodId) => apiService.setPrimaryPaymentMethod(providerData?.id, paymentMethodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/provider/payment-methods'] });
      Alert.alert('Success', 'Primary payment method updated successfully.');
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Failed to update primary payment method.');
    },
  });

  // Delete payment method mutation
  const deletePaymentMethodMutation = useMutation({
    mutationFn: (paymentMethodId) => apiService.deletePaymentMethod(providerData?.id, paymentMethodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/provider/payment-methods'] });
      Alert.alert('Success', 'Payment method removed successfully.');
    },
    onError: (error) => {
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

  const formatCardBrand = (brand) => {
    switch (brand?.toLowerCase()) {
      case 'visa': return 'Visa';
      case 'mastercard': return 'Mastercard';
      case 'amex': return 'American Express';
      case 'discover': return 'Discover';
      default: return brand;
    }
  };

  const handleSetPrimary = (paymentMethodId) => {
    Alert.alert(
      'Set Primary',
      'Are you sure you want to set this as your primary payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Set Primary', onPress: () => setPrimaryMutation.mutate(paymentMethodId) }
      ]
    );
  };

  const handleDeletePaymentMethod = (paymentMethodId) => {
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
            <Title style={styles.sectionTitle}>Your Payment Methods</Title>
            <Button
              mode="contained"
              onPress={handleAddPaymentMethod}
              style={styles.addButton}
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
              {paymentMethods.map((method) => (
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
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statusCardsContainer: {
    marginBottom: 16,
  },
  statusCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusCard: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  statusCardContent: {
    padding: 16,
  },
  statusCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  statusCardText: {
    flex: 1,
  },
  statusCardLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statusCardValue: {
    fontSize: 20,
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
    fontSize: 14,
    fontWeight: 'bold',
  },
  addButton: {
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  loadingText: {
    marginTop: 6,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 12,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  paymentMethodsList: {
    //
  },
  paymentMethodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    marginRight: 10,
  },
  paymentMethodIconText: {
    fontSize: 16,
  },
  paymentMethodDetails: {
    flex: 1,
    marginRight: 12,
  },
  paymentMethodTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  paymentMethodSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  primaryBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  primaryBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  paymentMethodRight: {
    alignItems: 'flex-end',
    gap: 8,
    minWidth: 80,
  },
  paymentMethodActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    marginRight: 8,
  },
  deleteButton: {
    borderRadius: 5,
    height: 44,
    // borderWidth: 1,
    // paddingHorizontal: 2,
    // paddingVertical: 5,
    // minHeight: 5,
  },
  infoCard: {
    marginTop: 16,
    elevation: 2,
  },
  infoGrid: {
    flexDirection: 'column',
    marginTop: 10,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoList: {
    //
  },
  infoListItem: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  paymentFormCard: {
    marginBottom: 16,
    elevation: 2,
  },
});

module.exports = PaymentScreen;











