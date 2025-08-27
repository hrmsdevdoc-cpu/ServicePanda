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
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>💰</Text>
            <View>
              <Title style={styles.cardTitle}>Credit Balance</Title>
              <Paragraph style={styles.cardDescription}>
                Your current credit balance and free leads status
              </Paragraph>
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
  card: {
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  balanceContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loadingSpinner: {
    paddingVertical: 20,
  },
  voucherInputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  voucherInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    marginRight: 8,
  },
  redeemButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  redeemButtonDisabled: {
    backgroundColor: colors.border,
  },
  redeemButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  voucherHelpText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  loadingContainer: {
    paddingVertical: 16,
  },
  transactionSkeleton: {
    height: 80,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 12,
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  transactionsContainer: {
    paddingVertical: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIconText: {
    fontSize: 18,
  },
  transactionContent: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  positiveAmount: {
    color: '#22c55e',
  },
  negativeAmount: {
    color: '#ef4444',
  },
  transactionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  voucherChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    backgroundColor: '#f3f4f6',
  },
  voucherChipText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  transactionMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

module.exports = CreditsScreen;
