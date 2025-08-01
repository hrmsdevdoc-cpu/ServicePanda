import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialIcons';
import serviceRequestService from '../../services/serviceRequestService';

const MyRequestsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch service requests
  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ['my-service-requests'],
    queryFn: serviceRequestService.getMyServiceRequests,
  });

  const filters = [
    { id: 'all', label: 'All', count: requests.length },
    { id: 'pending', label: 'Pending', count: requests.filter(r => r.status === 'pending').length },
    { id: 'quoted', label: 'Quoted', count: requests.filter(r => r.status === 'quoted').length },
    { id: 'accepted', label: 'Accepted', count: requests.filter(r => r.status === 'accepted').length },
    { id: 'completed', label: 'Completed', count: requests.filter(r => r.status === 'completed').length },
  ];

  const filteredRequests = selectedFilter === 'all' 
    ? requests 
    : requests.filter(request => request.status === selectedFilter);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const navigateToDetails = (requestId: string) => {
    navigation.navigate('RequestDetails', { requestId });
  };

  const navigateToQuotes = (requestId: string) => {
    navigation.navigate('Quotes', { requestId });
  };

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Waiting for quotes';
      case 'quoted': return 'Quotes received';
      case 'accepted': return 'Service accepted';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
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

  const renderFilterButton = (filter: any) => (
    <TouchableOpacity
      key={filter.id}
      style={[
        styles.filterButton,
        selectedFilter === filter.id && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(filter.id)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter.id && styles.filterButtonTextActive,
        ]}
      >
        {filter.label}
      </Text>
      {filter.count > 0 && (
        <View style={[
          styles.filterBadge,
          selectedFilter === filter.id && styles.filterBadgeActive,
        ]}>
          <Text style={[
            styles.filterBadgeText,
            selectedFilter === filter.id && styles.filterBadgeTextActive,
          ]}>
            {filter.count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderRequestItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.requestCard}
      onPress={() => navigateToDetails(item.id)}
    >
      <View style={styles.requestHeader}>
        <View style={styles.requestTitleContainer}>
          <Text style={styles.requestTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.requestDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <Icon 
            name={getStatusIcon(item.status)} 
            size={16} 
            color={getStatusColor(item.status)} 
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      <Text style={styles.requestLocation}>
        📍 {item.suburb}, {item.state} {item.postcode}
      </Text>

      <Text style={styles.requestDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.requestFooter}>
        <View style={styles.urgencyContainer}>
          <View style={[
            styles.urgencyDot,
            { backgroundColor: item.urgency === 'high' ? '#dc3545' : item.urgency === 'medium' ? '#ffa500' : '#28a745' }
          ]} />
          <Text style={styles.urgencyText}>
            {item.urgency === 'high' ? 'Urgent' : item.urgency === 'medium' ? 'Medium' : 'Low'} priority
          </Text>
        </View>

        {item.status === 'quoted' && (
          <TouchableOpacity
            style={styles.viewQuotesButton}
            onPress={() => navigateToQuotes(item.id)}
          >
            <Text style={styles.viewQuotesText}>View Quotes</Text>
            <Icon name="arrow-forward" size={16} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="inbox" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>
        {selectedFilter === 'all' ? 'No requests yet' : `No ${selectedFilter} requests`}
      </Text>
      <Text style={styles.emptyStateSubtext}>
        {selectedFilter === 'all' 
          ? 'Tap the "+" button to request your first service'
          : `You don't have any ${selectedFilter} requests at the moment`
        }
      </Text>
      {selectedFilter === 'all' && (
        <TouchableOpacity
          style={styles.createRequestButton}
          onPress={() => navigation.navigate('Services')}
        >
          <Icon name="add" size={24} color="#fff" />
          <Text style={styles.createRequestText}>Request Service</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Requests</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Services')}
        >
          <Icon name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={filters}
          renderItem={({ item }) => renderFilterButton(item)}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Requests List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your requests...</Text>
        </View>
      ) : filteredRequests.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filteredRequests}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item.id}
          style={styles.requestsList}
          contentContainerStyle={styles.requestsListContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filtersList: {
    paddingHorizontal: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  filterBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  filterBadgeActive: {
    backgroundColor: '#fff',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  filterBadgeTextActive: {
    color: '#007AFF',
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
  requestsList: {
    flex: 1,
  },
  requestsListContent: {
    padding: 20,
  },
  requestCard: {
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
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  requestTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 12,
    color: '#999',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  requestLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  requestDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  urgencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  urgencyText: {
    fontSize: 12,
    color: '#666',
  },
  viewQuotesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f4ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewQuotesText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#007AFF',
    marginRight: 4,
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
    marginBottom: 32,
  },
  createRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  createRequestText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default MyRequestsScreen;