import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialIcons';
import serviceRequestService from '../../services/serviceRequestService';

const RequestDetailsScreen: React.FC<{ navigation: any, route: any }> = ({ 
  navigation, 
  route 
}) => {
  const { requestId } = route.params;

  // Fetch request details
  const { data: request, isLoading } = useQuery({
    queryKey: ['service-request', requestId],
    queryFn: () => serviceRequestService.getServiceRequest(requestId),
  });

  // Fetch quotes for this request
  const { data: quotes = [] } = useQuery({
    queryKey: ['quotes', requestId],
    queryFn: () => serviceRequestService.getQuotesForRequest(requestId),
    enabled: !!request && request.status !== 'pending',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ffa500';
      case 'quoted': return '#007AFF';
      case 'accepted': return '#28a745';
      case 'completed': return '#6c757d';
      case 'cancelled': return '#dc3545';
      default: return '#007AFF';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'hourglass-empty';
      case 'quoted': return 'email';
      case 'accepted': return 'check-circle';
      case 'completed': return 'task-alt';
      case 'cancelled': return 'cancel';
      default: return 'info';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending': return 'We\'re notifying service providers in your area. You should start receiving quotes soon.';
      case 'quoted': return 'Great news! You\'ve received quotes from service providers. Review and accept the one that works best for you.';
      case 'accepted': return 'Your service has been accepted! The provider will contact you soon to arrange the details.';
      case 'completed': return 'Service completed successfully. We hope you\'re happy with the results!';
      case 'cancelled': return 'This service request has been cancelled.';
      default: return '';
    }
  };

  const handleViewQuotes = () => {
    navigation.navigate('Quotes', { requestId });
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'For assistance with this request, please email us at support@servicepanda.com.au or call 1300 123 456',
      [
        { text: 'Email Support', onPress: () => {} },
        { text: 'Call Support', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  if (isLoading || !request) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading request details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Request Details</Text>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleContactSupport}
          >
            <Icon name="more-vert" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Status Section */}
        <View style={styles.statusSection}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIconContainer}>
              <Icon 
                name={getStatusIcon(request.status)} 
                size={32} 
                color={getStatusColor(request.status)} 
              />
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Text>
              <Text style={styles.statusDate}>
                Updated {new Date(request.updatedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <Text style={styles.statusDescription}>
            {getStatusDescription(request.status)}
          </Text>
        </View>

        {/* Quick Actions */}
        {request.status === 'quoted' && quotes.length > 0 && (
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.primaryAction}
              onPress={handleViewQuotes}
            >
              <Icon name="email" size={20} color="#fff" />
              <Text style={styles.primaryActionText}>
                View {quotes.length} Quote{quotes.length !== 1 ? 's' : ''}
              </Text>
              <Icon name="chevron-right" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Request Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Request Details</Text>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Service</Text>
            <Text style={styles.detailValue}>{request.title}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.detailValue}>{request.description}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>
              📍 {request.location}
              {'\n'}{request.suburb}, {request.state} {request.postcode}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Priority</Text>
            <View style={styles.priorityContainer}>
              <View style={[
                styles.priorityDot,
                { backgroundColor: request.urgency === 'high' ? '#dc3545' : request.urgency === 'medium' ? '#ffa500' : '#28a745' }
              ]} />
              <Text style={styles.detailValue}>
                {request.urgency === 'high' ? 'High - ASAP' : 
                 request.urgency === 'medium' ? 'Medium - Within 3 days' : 
                 'Low - Within a week'}
              </Text>
            </View>
          </View>

          {request.budget && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Budget</Text>
              <Text style={styles.detailValue}>AUD ${request.budget}</Text>
            </View>
          )}

          {(request.preferredDate || request.preferredTime) && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Preferred Schedule</Text>
              <Text style={styles.detailValue}>
                {request.preferredDate && `Date: ${request.preferredDate}`}
                {request.preferredDate && request.preferredTime && '\n'}
                {request.preferredTime && `Time: ${request.preferredTime}`}
              </Text>
            </View>
          )}

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Created</Text>
            <Text style={styles.detailValue}>
              {new Date(request.createdAt).toLocaleDateString()} at{' '}
              {new Date(request.createdAt).toLocaleTimeString()}
            </Text>
          </View>
        </View>

        {/* Quotes Summary */}
        {quotes.length > 0 && (
          <View style={styles.quotesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quotes Received</Text>
              <TouchableOpacity onPress={handleViewQuotes}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {quotes.slice(0, 2).map((quote) => (
              <View key={quote.id} style={styles.quoteCard}>
                <View style={styles.quoteHeader}>
                  <Text style={styles.quoteBusiness}>
                    {quote.provider?.businessName || 'Service Provider'}
                  </Text>
                  <Text style={styles.quoteAmount}>AUD ${quote.amount}</Text>
                </View>
                <Text style={styles.quoteDescription} numberOfLines={2}>
                  {quote.description}
                </Text>
                <View style={styles.quoteFooter}>
                  <Text style={styles.quoteDate}>
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </Text>
                  {quote.status === 'pending' && (
                    <View style={styles.quoteBadge}>
                      <Text style={styles.quoteBadgeText}>New</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}

            {quotes.length > 2 && (
              <TouchableOpacity
                style={styles.viewMoreQuotes}
                onPress={handleViewQuotes}
              >
                <Text style={styles.viewMoreText}>
                  View {quotes.length - 2} more quote{quotes.length - 2 !== 1 ? 's' : ''}
                </Text>
                <Icon name="chevron-right" size={16} color="#007AFF" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Support Section */}
        <View style={styles.supportSection}>
          <Text style={styles.sectionTitle}>Need Help?</Text>
          <TouchableOpacity
            style={styles.supportButton}
            onPress={handleContactSupport}
          >
            <Icon name="support-agent" size={24} color="#007AFF" />
            <View style={styles.supportContent}>
              <Text style={styles.supportTitle}>Contact Support</Text>
              <Text style={styles.supportSubtitle}>
                Get help with your request
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
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
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 12,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e8f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statusDate: {
    fontSize: 14,
    color: '#666',
  },
  statusDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  actionsSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 12,
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  primaryActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
    flex: 1,
    textAlign: 'center',
  },
  detailsSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  quotesSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 12,
  },
  quoteCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quoteBusiness: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  quoteAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  quoteDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  quoteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quoteDate: {
    fontSize: 12,
    color: '#999',
  },
  quoteBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quoteBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  viewMoreQuotes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  viewMoreText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 4,
  },
  supportSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 12,
    marginBottom: 20,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  supportContent: {
    flex: 1,
    marginLeft: 12,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  supportSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default RequestDetailsScreen;