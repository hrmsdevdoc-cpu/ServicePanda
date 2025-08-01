import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../../App';
import serviceRequestService from '../../services/serviceRequestService';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();

  // Fetch service categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['service-categories'],
    queryFn: serviceRequestService.getServiceCategories,
  });

  // Fetch recent requests
  const { data: recentRequests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['recent-service-requests'],
    queryFn: serviceRequestService.getMyServiceRequests,
  });

  const serviceIcons: { [key: string]: string } = {
    'domestic-cleaning': 'cleaning-services',
    'end-of-lease-cleaning': 'home',
    'carpet-cleaning': 'carpet',
    'pest-control': 'pest-control',
    'gardening': 'park',
    'removals': 'local-shipping',
    'handyman': 'build',
    'plumbing': 'plumbing',
    'electrician': 'electrical-services',
  };

  const getServiceIcon = (slug: string) => {
    return serviceIcons[slug] || 'build';
  };

  const navigateToServiceRequest = (categoryId?: string) => {
    navigation.navigate('Services', { selectedCategory: categoryId });
  };

  const navigateToRequestDetails = (requestId: string) => {
    navigation.navigate('RequestDetails', { requestId });
  };

  const renderServiceCategory = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => navigateToServiceRequest(item.id)}
    >
      <View style={styles.categoryIconContainer}>
        <Icon name={getServiceIcon(item.slug)} size={32} color="#007AFF" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderRecentRequest = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.requestCard}
      onPress={() => navigateToRequestDetails(item.id)}
    >
      <View style={styles.requestHeader}>
        <Text style={styles.requestTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>
      <Text style={styles.requestLocation}>📍 {item.suburb}, {item.state}</Text>
      <Text style={styles.requestDate}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

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
      case 'pending': return 'Pending';
      case 'quoted': return 'Quoted';
      case 'accepted': return 'Accepted';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>{user?.firstName || 'User'}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="notifications-none" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.primaryAction}
            onPress={() => navigateToServiceRequest()}
          >
            <Icon name="add" size={24} color="#fff" />
            <Text style={styles.primaryActionText}>Request Service</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryAction}
            onPress={() => navigation.navigate('My Requests')}
          >
            <Icon name="list" size={20} color="#007AFF" />
            <Text style={styles.secondaryActionText}>My Requests</Text>
          </TouchableOpacity>
        </View>

        {/* Service Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Services</Text>
            <TouchableOpacity onPress={() => navigateToServiceRequest()}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {categoriesLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading services...</Text>
            </View>
          ) : (
            <FlatList
              data={categories.slice(0, 6)} // Show first 6 categories
              renderItem={renderServiceCategory}
              keyExtractor={(item) => item.id}
              numColumns={3}
              scrollEnabled={false}
              contentContainerStyle={styles.categoriesGrid}
            />
          )}
        </View>

        {/* Recent Requests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Requests</Text>
            <TouchableOpacity onPress={() => navigation.navigate('My Requests')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {requestsLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading requests...</Text>
            </View>
          ) : recentRequests.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="inbox" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No requests yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Tap "Request Service" to get started
              </Text>
            </View>
          ) : (
            <FlatList
              data={recentRequests.slice(0, 3)}
              renderItem={renderRecentRequest}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    backgroundColor: '#fff',
    gap: 12,
  },
  primaryAction: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  primaryActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 6,
  },
  secondaryActionText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
  },
  categoriesGrid: {
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    margin: 4,
    minHeight: 100,
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e8f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    lineHeight: 16,
  },
  requestCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 12,
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
  requestLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default HomeScreen;