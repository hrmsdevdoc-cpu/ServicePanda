const React = require('react');
const {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Animated,
  Dimensions,
} = require('react-native');
const { Card, Title, Paragraph, Button, Chip, ActivityIndicator } = require('react-native-paper');
const { useQuery, useMutation } = require('@tanstack/react-query');
const { useAuth } = require('../../contexts/AuthContext');
const apiService = require('../../services/api');
const { colors } = require('../../utils/theme');

const { width } = Dimensions.get('window');

function CreditsScreen({ onNavigate, onBack }) {
  const [voucherCode, setVoucherCode] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  // Fetch credit balance
  const { data: balanceData, isLoading: balanceLoading, refetch: refetchBalance } = useQuery({
    queryKey: ['/api/provider/credit/balance'],
    queryFn: () => apiService.getCreditBalance(),
  });

  // Fetch transactions
  const { data: transactions = [], isLoading: transactionsLoading, refetch: refetchTransactions } = useQuery({
    queryKey: ['/api/provider/credit/transactions'],
    queryFn: () => apiService.getCreditTransactions(),
  });

  // Redeem voucher mutation
  const redeemVoucherMutation = useMutation({
    mutationFn: (voucherCode) => apiService.redeemVoucher(voucherCode),
    onSuccess: (data) => {
      if (data.success) {
        Alert.alert(
          'Success!',
          data.message || 'Voucher redeemed successfully!',
          [{ text: 'OK' }]
        );
        setVoucherCode('');
        refetchBalance();
        refetchTransactions();
      } else {
        Alert.alert(
          'Redemption Failed',
          data.message || 'Failed to redeem voucher',
          [{ text: 'OK' }]
        );
      }
    },
    onError: (error) => {
      Alert.alert(
        'Error',
        error.message || 'Failed to redeem voucher',
        [{ text: 'OK' }]
      );
    },
  });

  const handleRedeemVoucher = () => {
    if (!voucherCode.trim()) {
      Alert.alert('Invalid Input', 'Please enter a voucher code');
      return;
    }
    redeemVoucherMutation.mutate(voucherCode.trim());
  };

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
    Promise.all([refetchBalance(), refetchTransactions()]).finally(() => {
      setRefreshing(false);
    });
  }, [refetchBalance, refetchTransactions]);

  const formatTransactionType = (type) => {
    switch (type) {
      case 'voucher_redemption': return 'Voucher Redeemed';
      case 'free_lead': return 'Free Lead Used';
      case 'debit': return 'Lead Purchase';
      case 'credit': return 'Credit Added';
      default: return type;
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'voucher_redemption': return '🎁';
      case 'free_lead': return '💵';
      case 'debit': return '💳';
      default: return '📊';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
            <Text style={styles.modernHeaderTitle}>Credit Management</Text>
            <Text style={styles.modernHeaderSubtitle}>
              Manage your credit balance, redeem vouchers, and track transactions
        </Text>
          </View>
          <View style={styles.modernHeaderIcon}>
            <Text style={styles.modernHeaderEmoji}>💳</Text>
          </View>
      </View>

        {/* Modern Credit Balance Card */}
        <View style={styles.modernBalanceCard}>
          <View style={styles.modernBalanceHeader}>
            <View style={styles.modernBalanceIcon}>
              <Text style={styles.modernBalanceEmoji}>💰</Text>
            </View>
            <View style={styles.modernBalanceInfo}>
              <Text style={styles.modernBalanceTitle}>Credit Balance</Text>
              <Text style={styles.modernBalanceSubtitle}>Available Credits</Text>
            </View>
          </View>
          
          {balanceLoading ? (
            <View style={styles.modernLoadingContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
            </View>
          ) : (
            <View style={styles.modernBalanceAmountContainer}>
              <Text style={styles.modernBalanceAmount}>
                ${balanceData?.balance?.toFixed(2) || '0.00'}
              </Text>
              <Text style={styles.modernBalanceLabel}>Use Credit</Text>
            </View>
          )}
        </View>

        {/* Modern Voucher Redemption Card */}
        <View style={styles.modernVoucherCard}>
          <View style={styles.modernVoucherHeader}>
            <View style={styles.modernVoucherIcon}>
              <Text style={styles.modernVoucherEmoji}>🎁</Text>
            </View>
            <View style={styles.modernVoucherInfo}>
              <Text style={styles.modernVoucherTitle}>Redeem Voucher</Text>
              <Text style={styles.modernVoucherSubtitle}>
                Enter a voucher code to add credit to your account
              </Text>
            </View>
          </View>
          
          <View style={styles.modernVoucherInputContainer}>
            <TextInput
              style={styles.modernVoucherInput}
              placeholder="Enter voucher code (e.g., WELCOME50)"
              value={voucherCode}
              onChangeText={setVoucherCode}
              placeholderTextColor={colors.textSecondary}
            />
            <TouchableOpacity
              style={[
                styles.modernRedeemButton,
                (!voucherCode.trim() || redeemVoucherMutation.isPending) && styles.modernRedeemButtonDisabled
              ]}
              onPress={handleRedeemVoucher}
              disabled={!voucherCode.trim() || redeemVoucherMutation.isPending}
            >
              {redeemVoucherMutation.isPending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.modernRedeemButtonText}>Redeem</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modernVoucherHelpText}>
            Enter voucher codes provided by customers or ServicePanda to add credit to your account.
          </Text>
        </View>

        {/* Modern Transaction History Card */}
        <View style={styles.modernTransactionCard}>
          <View style={styles.modernTransactionHeader}>
            <View style={styles.modernTransactionIcon}>
              <Text style={styles.modernTransactionEmoji}>📊</Text>
            </View>
            <View style={styles.modernTransactionInfo}>
              <Text style={styles.modernTransactionTitle}>Transaction History</Text>
              <Text style={styles.modernTransactionSubtitle}>
                Recent credit transactions and lead purchases
              </Text>
            </View>
          </View>
          
          {transactionsLoading ? (
            <View style={styles.modernLoadingContainer}>
              {[...Array(3)].map((_, i) => (
                <View key={i} style={styles.modernTransactionSkeleton} />
              ))}
            </View>
          ) : transactions.length === 0 ? (
            <View style={styles.modernEmptyState}>
              <Text style={styles.modernEmptyStateEmoji}>📋</Text>
              <Text style={styles.modernEmptyStateText}>
                No transactions yet. Redeem a voucher to get started!
              </Text>
            </View>
          ) : (
            <View style={styles.modernTransactionsContainer}>
              {transactions.map((transaction) => (
                <View key={transaction.id} style={styles.modernTransactionItem}>
                  <View style={styles.modernTransactionItemIcon}>
                    <Text style={styles.modernTransactionItemEmoji}>
                      {getTransactionIcon(transaction.transactionType)}
                    </Text>
                  </View>
                  
                  <View style={styles.modernTransactionItemContent}>
                    <View style={styles.modernTransactionItemHeader}>
                      <Text style={styles.modernTransactionItemTitle}>
                        {formatTransactionType(transaction.transactionType)}
                      </Text>
                      <Text style={[
                        styles.modernTransactionItemAmount,
                        parseFloat(transaction.amount) >= 0 ? styles.modernPositiveAmount : styles.modernNegativeAmount
                      ]}>
                        {parseFloat(transaction.amount) >= 0 ? '+' : ''}${transaction.amount}
                      </Text>
                    </View>
                    
                    <Text style={styles.modernTransactionItemDescription}>
                      {transaction.description}
                    </Text>
                    
                    {transaction.voucherCode && (
                      <View style={styles.modernVoucherChip}>
                        <Text style={styles.modernVoucherChipText}>
                        {transaction.voucherCode}
                        </Text>
                      </View>
                    )}
                    
                    <Text style={styles.modernTransactionItemMeta}>
                      {formatDate(transaction.createdAt)} • Balance: ${transaction.balanceAfter}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
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
  // Modern Balance Card
  modernBalanceCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modernBalanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modernBalanceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modernBalanceEmoji: {
    fontSize: 24,
    color: 'white',
  },
  modernBalanceInfo: {
    flex: 1,
  },
  modernBalanceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  modernBalanceSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  modernLoadingContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  modernBalanceAmountContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  modernBalanceAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  modernBalanceLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // Modern Voucher Card
  modernVoucherCard: {
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
  modernVoucherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modernVoucherIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modernVoucherEmoji: {
    fontSize: 24,
  },
  modernVoucherInfo: {
    flex: 1,
  },
  modernVoucherTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  modernVoucherSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 20,
  },
  modernVoucherInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  modernVoucherInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.borderLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: '#f8fafc',
    fontWeight: '500',
  },
  modernRedeemButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modernRedeemButtonDisabled: {
    backgroundColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  modernRedeemButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modernVoucherHelpText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    fontWeight: '500',
  },
  // Modern Transaction Card
  modernTransactionCard: {
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
  modernTransactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modernTransactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modernTransactionEmoji: {
    fontSize: 24,
  },
  modernTransactionInfo: {
    flex: 1,
  },
  modernTransactionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  modernTransactionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 20,
  },
  modernLoadingContainer: {
    paddingVertical: 16,
  },
  modernTransactionSkeleton: {
    height: 80,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    marginBottom: 12,
  },
  modernEmptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  modernEmptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  modernEmptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
  modernTransactionsContainer: {
    paddingVertical: 8,
  },
  modernTransactionItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modernTransactionItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modernTransactionItemEmoji: {
    fontSize: 18,
  },
  modernTransactionItemContent: {
    flex: 1,
  },
  modernTransactionItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modernTransactionItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    letterSpacing: -0.1,
  },
  modernTransactionItemAmount: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  modernPositiveAmount: {
    color: '#22c55e',
  },
  modernNegativeAmount: {
    color: '#ef4444',
  },
  modernTransactionItemDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
    fontWeight: '500',
  },
  modernVoucherChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  modernVoucherChipText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  modernTransactionItemMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  balanceCard: {
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceCardIcon: {
    fontSize: 24,
    marginRight: 12,
    color: 'white',
  },
  balanceCardInfo: {
    flex: 1,
  },
  balanceCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  balanceCardSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cardIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  cardDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 14,
  },
  balanceContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  balanceLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  loadingSpinner: {
    paddingVertical: 16,
  },
  voucherInputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  voucherInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.textPrimary,
    marginRight: 6,
  },
  redeemButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  redeemButtonDisabled: {
    backgroundColor: colors.border,
  },
  redeemButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  voucherHelpText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  loadingContainer: {
    paddingVertical: 12,
  },
  transactionSkeleton: {
    height: 64,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    marginBottom: 10,
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  transactionsContainer: {
    paddingVertical: 6,
  },
  transactionItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  transactionIconText: {
    fontSize: 14,
  },
  transactionContent: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  transactionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  transactionAmount: {
    fontSize: 13,
    fontWeight: '600',
  },
  positiveAmount: {
    color: '#22c55e',
  },
  negativeAmount: {
    color: '#ef4444',
  },
  transactionDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 6,
    lineHeight: 14,
  },
  voucherChip: {
    alignSelf: 'flex-start',
    marginBottom: 6,
    backgroundColor: '#f3f4f6',
  },
  voucherChipText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  transactionMeta: {
    fontSize: 10,
    color: colors.textSecondary,
  },
});

module.exports = CreditsScreen;
