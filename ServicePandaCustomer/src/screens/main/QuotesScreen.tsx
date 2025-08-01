import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialIcons';
import serviceRequestService from '../../services/serviceRequestService';

const QuotesScreen: React.FC<{ navigation: any, route: any }> = ({ 
  navigation, 
  route 
}) => {
  const { requestId } = route.params;
  const queryClient = useQueryClient();
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);

  // Fetch quotes for this request
  const { data: quotes = [], isLoading, refetch } = useQuery({
    queryKey: ['quotes', requestId],
    queryFn: () => serviceRequestService.getQuotesForRequest(requestId),
  });

  // Accept quote mutation
  const acceptQuoteMutation = useMutation({
    mutationFn: serviceRequestService.acceptQuote,
    onSuccess: () => {
      Alert.alert(
        'Quote Accepted!',
        'You have successfully accepted this quote. The service provider will contact you soon to arrange the details.',
        [
          {
            text: 'OK',
            onPress: () => {
              queryClient.invalidateQueries({ queryKey: ['quotes', requestId] });
              queryClient.invalidateQueries({ queryKey: ['service-request', requestId] });
              queryClient.invalidateQueries({ queryKey: ['my-service-requests'] });
              navigation.goBack();
            },
          },
        ]
      );
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message);
    },
  });

  // Reject quote mutation
  const rejectQuoteMutation = useMutation({
    mutationFn: serviceRequestService.rejectQuote,
    onSuccess: () => {
      Alert.alert('Quote Rejected', 'The quote has been rejected.');
      queryClient.invalidateQueries({ queryKey: ['quotes', requestId] });
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message);
    },
  });

  const handleAcceptQuote = (quoteId: string, providerName: string, amount: number) => {
    Alert.alert(
      'Accept Quote',
      `Are you sure you want to accept the quote from ${providerName} for AUD $${amount}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          style: 'default',
          onPress: () => acceptQuoteMutation.mutate(quoteId),
        },
      ]
    );
  };

  const handleRejectQuote = (quoteId: string, providerName: string) => {
    Alert.alert(
      'Reject Quote',
      `Are you sure you want to reject the quote from ${providerName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => rejectQuoteMutation.mutate(quoteId),
        },
      ]
    );
  };

  const handleContactProvider = (provider: any) => {
    Alert.alert(
      'Contact Provider',
      `Contact ${provider?.businessName || 'this provider'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => {} },
        { text: 'Email', onPress: () => {} },
      ]
    );
  };

  const getQuoteStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#007AFF';
      case 'accepted': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'expired': return '#6c757d';
      default: return '#007AFF';
    }
  };

  const getQuoteStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'New';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      case 'expired': return 'Expired';
      default: return status;
    }
  };

  const renderQuoteItem = ({ item }: { item: any }) => {
    const isProcessing = acceptQuoteMutation.isPending || rejectQuoteMutation.isPending;
    const isExpanded = selectedQuoteId === item.id;

    return (
      <View style={styles.quoteCard}>
        <TouchableOpacity
          style={styles.quoteHeader}
          onPress={() => setSelectedQuoteId(isExpanded ? null : item.id)}
        >
          <View style={styles.providerInfo}>
            <View style={styles.providerAvatar}>
              <Text style={styles.providerAvatarText}>
                {item.provider?.businessName?.charAt(0)?.toUpperCase() || 'P'}
              </Text>
            </View>
            <View style={styles.providerDetails}>
              <Text style={styles.providerName}>
                {item.provider?.businessName || 'Service Provider'}
              </Text>
              <View style={styles.providerMeta}>
                {item.provider?.rating && (
                  <View style={styles.ratingContainer}>
                    <Icon name="star" size={16} color="#ffa500" />
                    <Text style={styles.ratingText}>{item.provider.rating}</Text>
                  </View>
                )}
                {item.provider?.isVerified && (
                  <View style={styles.verifiedBadge}>
                    <Icon name="verified" size={14} color="#28a745" />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.quoteAmount}>
            <Text style={styles.amountText}>AUD ${item.amount}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getQuoteStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{getQuoteStatusLabel(item.status)}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.quoteDescription}>{item.description}</Text>

        {item.estimatedDuration && (
          <View style={styles.quoteDetail}>
            <Icon name="schedule" size={16} color="#666" />
            <Text style={styles.quoteDetailText}>Duration: {item.estimatedDuration}</Text>
          </View>
        )}

        {(item.proposedDate || item.proposedTime) && (
          <View style={styles.quoteDetail}>
            <Icon name="event" size={16} color="#666" />
            <Text style={styles.quoteDetailText}>
              Proposed: {item.proposedDate || ''} {item.proposedTime || ''}
            </Text>
          </View>
        )}

        <View style={styles.quoteFooter}>
          <Text style={styles.quoteDate}>
            Received {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => setSelectedQuoteId(isExpanded ? null : item.id)}
          >
            <Icon 
              name={isExpanded ? 'expand-less' : 'expand-more'} 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            {/* Provider Details */}
            <View style={styles.providerSection}>
              <Text style={styles.sectionTitle}>Provider Details</Text>
              <Text style={styles.providerEmail}>{item.provider?.email || 'No email provided'}</Text>
              <Text style={styles.providerPhone}>{item.provider?.phone || 'No phone provided'}</Text>
              {item.provider?.description && (
                <Text style={styles.providerDescription}>{item.provider.description}</Text>
              )}
              
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => handleContactProvider(item.provider)}
              >
                <Icon name="phone" size={16} color="#007AFF" />
                <Text style={styles.contactButtonText}>Contact Provider</Text>
              </TouchableOpacity>
            </View>

            {/* Actions */}
            {item.status === 'pending' && (
              <View style={styles.actionsSection}>
                <TouchableOpacity
                  style={[styles.rejectButton, isProcessing && styles.disabledButton]}
                  onPress={() => handleRejectQuote(item.id, item.provider?.businessName)}
                  disabled={isProcessing}
                >
                  <Text style={styles.rejectButtonText}>Decline</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.acceptButton, isProcessing && styles.disabledButton]}
                  onPress={() => handleAcceptQuote(item.id, item.provider?.businessName, item.amount)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.acceptButtonText}>Accept Quote</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="inbox" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No quotes yet</Text>
      <Text style={styles.emptyStateSubtext}>
        Service providers will send you quotes soon. You'll be notified when they arrive.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quotes</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => refetch()}
        >
          <Icon name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Quotes Count */}
      {quotes.length > 0 && (
        <View style={styles.countSection}>
          <Text style={styles.countText}>
            {quotes.length} quote{quotes.length !== 1 ? 's' : ''} received
          </Text>
          <Text style={styles.countSubtext}>
            Review and accept the best quote for your needs
          </Text>
        </View>
      )}

      {/* Quotes List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading quotes...</Text>
        </View>
      ) : quotes.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={quotes}
          renderItem={renderQuoteItem}
          keyExtractor={(item) => item.id}
          style={styles.quotesList}
          contentContainerStyle={styles.quotesListContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  countText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  countSubtext: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  quotesList: {
    flex: 1,
  },
  quotesListContent: {
    padding: 20,
  },
  quoteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  providerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  providerAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  providerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 12,
    color: '#28a745',
    marginLeft: 4,
  },
  quoteAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  quoteDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  quoteDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quoteDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  quoteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  quoteDate: {
    fontSize: 12,
    color: '#999',
  },
  expandButton: {
    padding: 4,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  providerSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  providerEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  providerPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  providerDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f4ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  contactButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  actionsSection: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dc3545',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '500',
  },
  acceptButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default QuotesScreen;