const React = require('react');
const {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
  Dimensions,
} = require('react-native');
const { Card, Title, Paragraph, Button, Chip, ActivityIndicator } = require('react-native-paper');
const { useQuery } = require('@tanstack/react-query');
const { useAuth } = require('../../contexts/AuthContext');
const apiService = require('../../services/api');
const { colors } = require('../../utils/theme');

const { width } = Dimensions.get('window');

interface BillingScreenProps {
  onNavigate?: (screen: string) => void;
  onBack?: () => void;
}

function BillingScreen({ onNavigate, onBack }: BillingScreenProps) {
  const { providerData } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

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

  // Animation on mount
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([refetchBilling()]).finally(() => {
      setRefreshing(false);
    });
  }, [refetchBilling]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (amount: number | string) => {
    return `$${parseFloat(String(amount) || '0').toFixed(2)}`;
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'credit': return '💰';
      case 'card': return '💳';
      case 'partial': return '💳💰';
      default: return '💳';
    }
  };

  const getPaymentMethodLabel = (method: string) => {
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
          <View style={styles.modernHeaderContent}>
            <Text style={styles.modernHeaderTitle}>Billing & Payments</Text>
            <Text style={styles.modernHeaderSubtitle}>
          Track your lead purchases, payment history, and billing information
        </Text>
          </View>
          <View style={styles.modernHeaderIcon}>
            <Text style={styles.modernHeaderEmoji}>💳</Text>
          </View>
      </View>

        {/* Modern Summary Cards */}
        <View style={styles.modernSummaryContainer}>
          <View style={styles.modernSummaryGrid}>
            <TouchableOpacity style={styles.modernSummaryCard} activeOpacity={0.8}>
              <View style={styles.modernSummaryCardHeader}>
                <View style={styles.modernSummaryIcon}>
                  <Text style={styles.modernSummaryEmoji}>📊</Text>
                </View>
                <View style={styles.modernSummaryInfo}>
                  <Text style={styles.modernSummaryLabel}>This Month</Text>
                  <Text style={styles.modernSummaryValue}>
                    {billingLoading ? '...' : billingData?.thisMonthPurchases || 0}
                  </Text>
                  <Text style={styles.modernSummarySubtext}>Leads Purchased</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modernSummaryCard} activeOpacity={0.8}>
              <View style={styles.modernSummaryCardHeader}>
                <View style={styles.modernSummaryIcon}>
                  <Text style={styles.modernSummaryEmoji}>💰</Text>
                </View>
                <View style={styles.modernSummaryInfo}>
                  <Text style={styles.modernSummaryLabel}>Total Spent</Text>
                  <Text style={styles.modernSummaryValue}>
                    {billingLoading ? '...' : formatCurrency(billingData?.thisMonthTotal)}
                  </Text>
                  <Text style={styles.modernSummarySubtext}>This Month</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modernSummaryCard} activeOpacity={0.8}>
              <View style={styles.modernSummaryCardHeader}>
                <View style={styles.modernSummaryIcon}>
                  <Text style={styles.modernSummaryEmoji}>💳</Text>
        </View>
                <View style={styles.modernSummaryInfo}>
                  <Text style={styles.modernSummaryLabel}>Credit Balance</Text>
                  <Text style={styles.modernSummaryValue}>
                    {creditBalance ? formatCurrency(creditBalance.balance) : '$0.00'}
                  </Text>
                  <Text style={styles.modernSummarySubtext}>Available</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modernSummaryCard} activeOpacity={0.8}>
              <View style={styles.modernSummaryCardHeader}>
                <View style={styles.modernSummaryIcon}>
                  <Text style={styles.modernSummaryEmoji}>🎯</Text>
                </View>
                <View style={styles.modernSummaryInfo}>
                  <Text style={styles.modernSummaryLabel}>Total Leads</Text>
                  <Text style={styles.modernSummaryValue}>
                    {billingLoading ? '...' : billingData?.allPaidLeads?.length || 0}
                  </Text>
                  <Text style={styles.modernSummarySubtext}>All Time</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modern Billing History */}
        <View style={styles.modernBillingHistoryCard}>
          <View style={styles.modernBillingHistoryHeader}>
            <View style={styles.modernBillingHistoryIcon}>
              <Text style={styles.modernBillingHistoryEmoji}>📋</Text>
      </View>
            <View style={styles.modernBillingHistoryInfo}>
              <Text style={styles.modernBillingHistoryTitle}>Billing History</Text>
              <Text style={styles.modernBillingHistorySubtitle}>
              All your lead purchases and payment records
            </Text>
            </View>
          </View>
          
          {billingLoading ? (
            <View style={styles.modernLoadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.modernLoadingText}>Loading billing history...</Text>
            </View>
          ) : !billingData?.allPaidLeads || billingData.allPaidLeads.length === 0 ? (
            <View style={styles.modernEmptyState}>
              <Text style={styles.modernEmptyStateIcon}>📋</Text>
              <Text style={styles.modernEmptyStateTitle}>No billing history yet</Text>
              <Text style={styles.modernEmptyStateText}>
                Your lead purchases and payment records will appear here once you start buying leads.
              </Text>
            </View>
          ) : (
            <View style={styles.modernBillingHistoryList}>
              {billingData.allPaidLeads.map((lead: any, index: number) => (
                <View key={lead.id || index} style={styles.modernBillingHistoryItem}>
                  <View style={styles.modernBillingHistoryItemHeader}>
                    <View style={styles.modernBillingHistoryItemLeft}>
                      <View style={styles.modernTransactionTypeContainer}>
                        <Text style={styles.modernTransactionTypeIcon}>💳</Text>
                        <Text style={styles.modernTransactionTypeLabel}>Lead Purchase</Text>
                      </View>
                      <Text style={styles.modernBillingHistoryItemTitle}>
                        {lead.categoryName}
                      </Text>
                      <Text style={styles.modernBillingHistoryItemSubtitle}>
                        Lead #{lead.requestId} • {lead.location}
                      </Text>
                      <Text style={styles.modernBillingHistoryItemDate}>
                        {formatDate(lead.purchasedAt)}
                      </Text>
                    </View>
                    
                    <View style={styles.modernBillingHistoryItemRight}>
                      <Text style={[styles.modernBillingHistoryItemAmount, styles.modernDebitAmount]}>
                        -{formatCurrency(lead.totalCost)}
                      </Text>
                      <View style={styles.modernPaymentMethodContainer}>
                        <Text style={styles.modernPaymentMethodIcon}>
                          {getPaymentMethodIcon(lead.paymentMethod)}
                        </Text>
                        <Text style={styles.modernPaymentMethodLabel}>
                          {getPaymentMethodLabel(lead.paymentMethod)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  {/* Modern Payment Breakdown */}
                  <View style={styles.modernPaymentBreakdown}>
                    {lead.creditUsed > 0 && (
                      <View style={styles.modernBreakdownItem}>
                        <Text style={styles.modernBreakdownLabel}>Credit Applied:</Text>
                        <Text style={[styles.modernBreakdownValue, styles.modernCreditValue]}>
                          +{formatCurrency(lead.creditUsed)}
                        </Text>
                      </View>
                    )}
                    
                    {lead.amountCharged > 0 && (
                      <View style={styles.modernBreakdownItem}>
                        <Text style={styles.modernBreakdownLabel}>Card Charged:</Text>
                        <Text style={[styles.modernBreakdownValue, styles.modernChargedValue]}>
                          -{formatCurrency(lead.amountCharged)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Modern Quick Actions */}
        <View style={styles.modernQuickActionsCard}>
          <View style={styles.modernQuickActionsHeader}>
            <View style={styles.modernQuickActionsIcon}>
              <Text style={styles.modernQuickActionsEmoji}>⚡</Text>
            </View>
            <View style={styles.modernQuickActionsInfo}>
              <Text style={styles.modernQuickActionsTitle}>Quick Actions</Text>
              <Text style={styles.modernQuickActionsSubtitle}>
                Manage your billing and leads
              </Text>
            </View>
          </View>
          
          <View style={styles.modernQuickActionsGrid}>
            <TouchableOpacity 
              style={styles.modernQuickActionButton}
              onPress={() => onNavigate?.('credits')}
              activeOpacity={0.7}
            >
              <View style={styles.modernQuickActionIcon}>
                <Text style={styles.modernQuickActionEmoji}>💰</Text>
              </View>
              <Text style={styles.modernQuickActionText}>Manage Credits</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modernQuickActionButton}
              onPress={() => onNavigate?.('payment')}
              activeOpacity={0.7}
            >
              <View style={styles.modernQuickActionIcon}>
                <Text style={styles.modernQuickActionEmoji}>💳</Text>
              </View>
              <Text style={styles.modernQuickActionText}>Payment Methods</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modernQuickActionButton}
              onPress={() => onNavigate?.('leads')}
              activeOpacity={0.7}
            >
              <View style={styles.modernQuickActionIcon}>
                <Text style={styles.modernQuickActionEmoji}>🎯</Text>
              </View>
              <Text style={styles.modernQuickActionText}>View Leads</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modernQuickActionButton}
              onPress={() => onNavigate?.('newLeads')}
              activeOpacity={0.7}
            >
              <View style={styles.modernQuickActionIcon}>
                <Text style={styles.modernQuickActionEmoji}>🆕</Text>
              </View>
              <Text style={styles.modernQuickActionText}>New Leads</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modern Information Section */}
        <View style={styles.modernInfoCard}>
          <View style={styles.modernInfoHeader}>
            <View style={styles.modernInfoIcon}>
              <Text style={styles.modernInfoEmoji}>ℹ️</Text>
            </View>
            <View style={styles.modernInfoInfo}>
              <Text style={styles.modernInfoTitle}>Billing Information</Text>
              <Text style={styles.modernInfoSubtitle}>
                How billing and payments work
              </Text>
            </View>
          </View>
          
          <View style={styles.modernInfoSection}>
            <Text style={styles.modernInfoSectionTitle}>How Billing Works</Text>
            <View style={styles.modernInfoList}>
              <Text style={styles.modernInfoListItem}>• Your first 3 leads are completely FREE</Text>
              <Text style={styles.modernInfoListItem}>• After that, you're charged only when you accept a lead</Text>
              <Text style={styles.modernInfoListItem}>• Credits are applied first, then your payment method</Text>
              <Text style={styles.modernInfoListItem}>• Pricing varies by service category and location</Text>
            </View>
          </View>
          
          <View style={styles.modernInfoDivider} />
          
          <View style={styles.modernInfoSection}>
            <Text style={styles.modernInfoSectionTitle}>Payment Methods</Text>
            <View style={styles.modernInfoList}>
              <Text style={styles.modernInfoListItem}>• Use credits to purchase leads at discounted rates</Text>
              <Text style={styles.modernInfoListItem}>• Redeem vouchers to add credits to your account</Text>
              <Text style={styles.modernInfoListItem}>• Credit cards are charged for remaining amounts</Text>
              <Text style={styles.modernInfoListItem}>• All payments processed securely by Stripe</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  animatedContainer: {
    flex: 1,
  },
  // Modern Header
  modernHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  modernHeaderContent: {
    flex: 1,
  },
  modernHeaderTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  modernHeaderSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
    fontWeight: '500',
  },
  modernHeaderIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  modernHeaderEmoji: {
    fontSize: 24,
  },
  // Modern Summary Cards
  modernSummaryContainer: {
    marginBottom: 20,
  },
  modernSummaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  modernSummaryCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  modernSummaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modernSummaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modernSummaryEmoji: {
    fontSize: 20,
  },
  modernSummaryInfo: {
    flex: 1,
  },
  modernSummaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  modernSummaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  modernSummarySubtext: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  // Modern Billing History
  modernBillingHistoryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  modernBillingHistoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modernBillingHistoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modernBillingHistoryEmoji: {
    fontSize: 24,
  },
  modernBillingHistoryInfo: {
    flex: 1,
  },
  modernBillingHistoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  modernBillingHistorySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 20,
  },
  modernLoadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  modernLoadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  modernEmptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  modernEmptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  modernEmptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  modernEmptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
    paddingHorizontal: 16,
  },
  modernBillingHistoryList: {
    paddingVertical: 8,
  },
  modernBillingHistoryItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modernBillingHistoryItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modernBillingHistoryItemLeft: {
    flex: 1,
    marginRight: 16,
  },
  modernTransactionTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modernTransactionTypeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  modernTransactionTypeLabel: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  modernBillingHistoryItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  modernBillingHistoryItemSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  modernBillingHistoryItemDate: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  modernBillingHistoryItemRight: {
    alignItems: 'flex-end',
  },
  modernBillingHistoryItemAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  modernDebitAmount: {
    color: colors.error,
  },
  modernPaymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modernPaymentMethodIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  modernPaymentMethodLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  modernPaymentBreakdown: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  modernBreakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modernBreakdownLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  modernBreakdownValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  modernCreditValue: {
    color: colors.success,
  },
  modernChargedValue: {
    color: colors.primary,
  },
  // Modern Quick Actions
  modernQuickActionsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  modernQuickActionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modernQuickActionsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modernQuickActionsEmoji: {
    fontSize: 24,
  },
  modernQuickActionsInfo: {
    flex: 1,
  },
  modernQuickActionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  modernQuickActionsSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 20,
  },
  modernQuickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  modernQuickActionButton: {
    width: '48%',
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  modernQuickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modernQuickActionEmoji: {
    fontSize: 20,
  },
  modernQuickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  // Modern Info Card
  modernInfoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  modernInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modernInfoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modernInfoEmoji: {
    fontSize: 24,
  },
  modernInfoInfo: {
    flex: 1,
  },
  modernInfoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  modernInfoSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 20,
  },
  modernInfoSection: {
    marginBottom: 16,
  },
  modernInfoSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
    letterSpacing: -0.1,
  },
  modernInfoList: {
    gap: 8,
  },
  modernInfoListItem: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
    fontWeight: '500',
  },
  modernInfoDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 16,
  },
  summaryContainer: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 3,
    elevation: 1,
  },
  summaryCardContent: {
    padding: 10,
  },
  summaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  summaryLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 3,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  summarySubtext: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  billingHistoryCard: {
    marginBottom: 12,
    elevation: 1,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyStateIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  emptyStateTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptyStateText: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 12,
  },
  billingHistoryList: {
    paddingVertical: 6,
  },
  billingHistoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  billingHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  billingHistoryLeft: {
    flex: 1,
    marginRight: 12,
  },
  transactionTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  transactionTypeIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  transactionTypeLabel: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  billingHistoryTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  billingHistorySubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 3,
  },
  billingHistoryDate: {
    fontSize: 10,
    color: colors.textTertiary,
  },
  billingHistoryRight: {
    alignItems: 'flex-end',
  },
  billingHistoryAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  debitAmount: {
    color: colors.error,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  paymentMethodLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  paymentBreakdown: {
    backgroundColor: colors.surfaceVariant,
    padding: 8,
    borderRadius: 6,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  breakdownLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  breakdownValue: {
    fontSize: 10,
    fontWeight: '600',
  },
  creditValue: {
    color: colors.success,
  },
  chargedValue: {
    color: colors.primary,
  },
  quickActionsCard: {
    marginBottom: 12,
    elevation: 1,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 1,
  },
  quickActionIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: 12,
    elevation: 1,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  infoList: {
    gap: 4,
  },
  infoListItem: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
    lineHeight: 14,
  },
});

module.exports = BillingScreen;
