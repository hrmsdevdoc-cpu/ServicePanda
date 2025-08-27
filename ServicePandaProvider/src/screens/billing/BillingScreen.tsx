const React = require('react');
const {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} = require('react-native');
const { Card, Title, Paragraph, Button, Chip, ActivityIndicator } = require('react-native-paper');
const { useQuery } = require('@tanstack/react-query');
const { useAuth } = require('../../contexts/AuthContext');
const apiService = require('../../services/api');
const { colors } = require('../../utils/theme');

function BillingScreen({ onNavigate, onBack }) {
  const { providerData } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  // Fetch billing data
  const { data: billingData, isLoading: billingLoading, refetch: refetchBilling } = useQuery({
    queryKey: ['/api/provider/billing'],
    queryFn: () => apiService.getBillingData(),
    enabled: !!providerData?.id,
  });

  // Fetch credit balance for display
  const { data: creditBalance } = useQuery({
    queryKey: ['/api/provider/credit/balance'],
    queryFn: () => apiService.getCreditBalance(),
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([refetchBilling()]).finally(() => {
      setRefreshing(false);
    });
  }, [refetchBilling]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount || 0).toFixed(2)}`;
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'credit': return '💰';
      case 'card': return '💳';
      case 'partial': return '💳💰';
      default: return '💳';
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method?.toLowerCase()) {
      case 'credit': return 'Credit Used';
      case 'card': return 'Card Payment';
      case 'partial': return 'Credit + Card';
      default: return method || 'Unknown';
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Billing & Payments</Text>
        <Text style={styles.headerSubtitle}>
          Track your lead purchases, payment history, and billing information
        </Text>
      </View>

      {/* Monthly Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Card style={styles.summaryCard}>
            <Card.Content style={styles.summaryCardContent}>
              <View style={styles.summaryCardHeader}>
                <Text style={styles.summaryIcon}>📊</Text>
                <View>
                  <Text style={styles.summaryLabel}>This Month</Text>
                  <Text style={styles.summaryValue}>
                    {billingLoading ? '...' : billingData?.thisMonthPurchases || 0}
                  </Text>
                  <Text style={styles.summarySubtext}>Leads Purchased</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.summaryCard}>
            <Card.Content style={styles.summaryCardContent}>
              <View style={styles.summaryCardHeader}>
                <Text style={styles.summaryIcon}>💰</Text>
                <View>
                  <Text style={styles.summaryLabel}>Total Spent</Text>
                  <Text style={styles.summaryValue}>
                    {billingLoading ? '...' : formatCurrency(billingData?.thisMonthTotal)}
                  </Text>
                  <Text style={styles.summarySubtext}>This Month</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.summaryRow}>
          <Card style={styles.summaryCard}>
            <Card.Content style={styles.summaryCardContent}>
              <View style={styles.summaryCardHeader}>
                <Text style={styles.summaryIcon}>💳</Text>
                <View>
                  <Text style={styles.summaryLabel}>Credit Balance</Text>
                  <Text style={styles.summaryValue}>
                    {creditBalance ? formatCurrency(creditBalance.balance) : '$0.00'}
                  </Text>
                  <Text style={styles.summarySubtext}>Available</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.summaryCard}>
            <Card.Content style={styles.summaryCardContent}>
              <View style={styles.summaryCardHeader}>
                <Text style={styles.summaryIcon}>🎯</Text>
                <View>
                  <Text style={styles.summaryLabel}>Total Leads</Text>
                  <Text style={styles.summaryValue}>
                    {billingLoading ? '...' : billingData?.allPaidLeads?.length || 0}
                  </Text>
                  <Text style={styles.summarySubtext}>All Time</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>
      </View>

      {/* Billing History */}
      <Card style={styles.billingHistoryCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Billing History</Title>
            <Text style={styles.sectionSubtitle}>
              All your lead purchases and payment records
            </Text>
          </View>
          
          {billingLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading billing history...</Text>
            </View>
          ) : !billingData?.allPaidLeads || billingData.allPaidLeads.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📋</Text>
              <Text style={styles.emptyStateTitle}>No billing history yet</Text>
              <Text style={styles.emptyStateText}>
                Your lead purchases and payment records will appear here once you start buying leads.
              </Text>
            </View>
          ) : (
            <View style={styles.billingHistoryList}>
              {billingData.allPaidLeads.map((lead, index) => (
                <View key={lead.id || index} style={styles.billingHistoryItem}>
                  <View style={styles.billingHistoryHeader}>
                    <View style={styles.billingHistoryLeft}>
                      <Text style={styles.billingHistoryTitle}>
                        {lead.categoryName}
                      </Text>
                      <Text style={styles.billingHistorySubtitle}>
                        Lead #{lead.requestId} • {lead.location}
                      </Text>
                      <Text style={styles.billingHistoryDate}>
                        {formatDate(lead.purchasedAt)}
                      </Text>
                    </View>
                    
                    <View style={styles.billingHistoryRight}>
                      <Text style={styles.billingHistoryAmount}>
                        {formatCurrency(lead.totalCost)}
                      </Text>
                      <View style={styles.paymentMethodContainer}>
                        <Text style={styles.paymentMethodIcon}>
                          {getPaymentMethodIcon(lead.paymentMethod)}
                        </Text>
                        <Text style={styles.paymentMethodLabel}>
                          {getPaymentMethodLabel(lead.paymentMethod)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  {/* Payment Breakdown */}
                  <View style={styles.paymentBreakdown}>
                    {lead.creditUsed > 0 && (
                      <View style={styles.breakdownItem}>
                        <Text style={styles.breakdownLabel}>Credit Used:</Text>
                        <Text style={[styles.breakdownValue, styles.creditValue]}>
                          {formatCurrency(lead.creditUsed)}
                        </Text>
                      </View>
                    )}
                    
                    {lead.amountCharged > 0 && (
                      <View style={styles.breakdownItem}>
                        <Text style={styles.breakdownLabel}>Amount Charged:</Text>
                        <Text style={[styles.breakdownValue, styles.chargedValue]}>
                          {formatCurrency(lead.amountCharged)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.quickActionsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Quick Actions</Title>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => onNavigate('credits')}
            >
              <Text style={styles.quickActionIcon}>💰</Text>
              <Text style={styles.quickActionText}>Manage Credits</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => onNavigate('payment')}
            >
              <Text style={styles.quickActionIcon}>💳</Text>
              <Text style={styles.quickActionText}>Payment Methods</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => onNavigate('leads')}
            >
              <Text style={styles.quickActionIcon}>🎯</Text>
              <Text style={styles.quickActionText}>View Leads</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => onNavigate('newLeads')}
            >
              <Text style={styles.quickActionIcon}>🆕</Text>
              <Text style={styles.quickActionText}>New Leads</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      {/* Information Section */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Billing Information</Title>
          
          <View style={styles.infoSection}>
            <Text style={styles.infoSectionTitle}>How Billing Works</Text>
            <View style={styles.infoList}>
              <Text style={styles.infoListItem}>• Your first 3 leads are completely FREE</Text>
              <Text style={styles.infoListItem}>• After that, you're charged only when you accept a lead</Text>
              <Text style={styles.infoListItem}>• Credits are applied first, then your payment method</Text>
              <Text style={styles.infoListItem}>• Pricing varies by service category and location</Text>
            </View>
          </View>
          
          <View style={styles.infoSection}>
            <Text style={styles.infoSectionTitle}>Payment Methods</Text>
            <View style={styles.infoList}>
              <Text style={styles.infoListItem}>• Use credits to purchase leads at discounted rates</Text>
              <Text style={styles.infoListItem}>• Redeem vouchers to add credits to your account</Text>
              <Text style={styles.infoListItem}>• Credit cards are charged for remaining amounts</Text>
              <Text style={styles.infoListItem}>• All payments processed securely by Stripe</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  summaryContainer: {
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  summaryCardContent: {
    padding: 16,
  },
  summaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  summarySubtext: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  billingHistoryCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  billingHistoryList: {
    paddingVertical: 8,
  },
  billingHistoryItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  billingHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  billingHistoryLeft: {
    flex: 1,
    marginRight: 16,
  },
  billingHistoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  billingHistorySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  billingHistoryDate: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  billingHistoryRight: {
    alignItems: 'flex-end',
  },
  billingHistoryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  paymentMethodLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  paymentBreakdown: {
    backgroundColor: colors.surfaceVariant,
    padding: 12,
    borderRadius: 8,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  breakdownLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  breakdownValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  creditValue: {
    color: colors.success,
  },
  chargedValue: {
    color: colors.primary,
  },
  quickActionsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 1,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: 16,
    elevation: 2,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  infoList: {
    // Styles for info list
  },
  infoListItem: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
});

module.exports = BillingScreen;
