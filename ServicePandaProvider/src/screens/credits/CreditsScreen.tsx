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
} = require('react-native');
const { Card, Title, Paragraph, Button, Chip, ActivityIndicator } = require('react-native-paper');
const { useQuery, useMutation } = require('@tanstack/react-query');
const { useAuth } = require('../../contexts/AuthContext');
const apiService = require('../../services/api');
const { colors } = require('../../utils/theme');

function CreditsScreen({ onNavigate, onBack }) {
  const [voucherCode, setVoucherCode] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);

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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Credit Management</Text>
        <Text style={styles.headerSubtitle}>
          Manage your credit balance, redeem vouchers, and track transactions. Use credits to purchase leads at discounted rates.
        </Text>
      </View>

      {/* Credit Balance Card */}
      <Card style={styles.balanceCard}>
        <Card.Content>
          <View style={styles.balanceCardHeader}>
            <Text style={styles.balanceCardIcon}>💰</Text>
            <View style={styles.balanceCardInfo}>
              <Text style={styles.balanceCardTitle}>Credit Balance</Text>
              <Text style={styles.balanceCardSubtitle}>Available Credits</Text>
            </View>
          </View>
          
          {balanceLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loadingSpinner} />
          ) : (
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceAmount}>
                ${balanceData?.balance?.toFixed(2) || '0.00'}
              </Text>
              <Text style={styles.balanceLabel}>Use Credit</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Voucher Redemption Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🎁</Text>
            <View>
              <Title style={styles.cardTitle}>Redeem Voucher</Title>
              <Paragraph style={styles.cardDescription}>
                Enter a voucher code to add credit to your account
              </Paragraph>
            </View>
          </View>
          
          <View style={styles.voucherInputContainer}>
            <TextInput
              style={styles.voucherInput}
              placeholder="Enter voucher code (e.g., WELCOME50)"
              value={voucherCode}
              onChangeText={setVoucherCode}
              placeholderTextColor={colors.textSecondary}
            />
            <TouchableOpacity
              style={[
                styles.redeemButton,
                (!voucherCode.trim() || redeemVoucherMutation.isPending) && styles.redeemButtonDisabled
              ]}
              onPress={handleRedeemVoucher}
              disabled={!voucherCode.trim() || redeemVoucherMutation.isPending}
            >
              {redeemVoucherMutation.isPending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.redeemButtonText}>Redeem</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <Text style={styles.voucherHelpText}>
            Enter voucher codes provided by customers or ServicePanda to add credit to your account.
          </Text>
        </Card.Content>
      </Card>

      {/* Transaction History Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📊</Text>
            <View>
              <Title style={styles.cardTitle}>Transaction History</Title>
              <Paragraph style={styles.cardDescription}>
                Recent credit transactions and lead purchases
              </Paragraph>
            </View>
          </View>
          
          {transactionsLoading ? (
            <View style={styles.loadingContainer}>
              {[...Array(3)].map((_, i) => (
                <View key={i} style={styles.transactionSkeleton} />
              ))}
            </View>
          ) : transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No transactions yet. Redeem a voucher to get started!
              </Text>
            </View>
          ) : (
            <View style={styles.transactionsContainer}>
              {transactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View style={styles.transactionIcon}>
                    <Text style={styles.transactionIconText}>
                      {getTransactionIcon(transaction.transactionType)}
                    </Text>
                  </View>
                  
                  <View style={styles.transactionContent}>
                    <View style={styles.transactionHeader}>
                      <Text style={styles.transactionTitle}>
                        {formatTransactionType(transaction.transactionType)}
                      </Text>
                      <Text style={[
                        styles.transactionAmount,
                        parseFloat(transaction.amount) >= 0 ? styles.positiveAmount : styles.negativeAmount
                      ]}>
                        {parseFloat(transaction.amount) >= 0 ? '+' : ''}${transaction.amount}
                      </Text>
                    </View>
                    
                    <Text style={styles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    
                    {transaction.voucherCode && (
                      <Chip style={styles.voucherChip} textStyle={styles.voucherChipText}>
                        {transaction.voucherCode}
                      </Chip>
                    )}
                    
                    <Text style={styles.transactionMeta}>
                      {formatDate(transaction.createdAt)} • Balance: ${transaction.balanceAfter}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
