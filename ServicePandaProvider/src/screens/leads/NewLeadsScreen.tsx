const React = require('react');
const { useState } = require('react');
const { View, StyleSheet, ScrollView, TouchableOpacity, Text, RefreshControl, Alert, Animated, AppState } = require('react-native');
const { Title, Paragraph, Card, Button, Chip, Searchbar, Badge, ActivityIndicator } = require('react-native-paper');
const { colors } = require('../../utils/theme');
const { useQuery, useMutation } = require('@tanstack/react-query');
const apiService = require('../../services/api');

function NewLeadsScreen({ onNavigate }: { onNavigate: (screen: string, params?: any) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [purchasingLeadId, setPurchasingLeadId] = useState(null);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  // Fetch leads from API
  const { data: leads, isLoading: leadsLoading, error: leadsError, refetch } = useQuery({
    queryKey: ['provider-leads'],
    queryFn: () => apiService.getLeads(),
    staleTime: 0, // Always consider data stale - refetch immediately
    refetchInterval: 30 * 1000, // Auto-refetch every 30 seconds
    refetchIntervalInBackground: true, // Continue refetching in background
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnMount: true, // Refetch when component mounts
  });

  // Fetch credit balance and profile for payment method determination
  const { data: creditBalance } = useQuery({
    queryKey: ['/api/provider/credit/balance'],
    queryFn: () => apiService.getCreditBalance(),
  });

  const { data: profile } = useQuery({
    queryKey: ['/api/provider/profile'],
    queryFn: () => apiService.getProfile(),
  });

  // Filter for new/pending leads only - 'pending' status means available for purchase
  const newLeads = leads?.filter((lead: any) => lead.status === 'pending') || [];

  // Debug logging to see what leads we're getting
  React.useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`🔍 [${timestamp}] NEW LEADS SCREEN DEBUG:`);
    console.log(`  Total leads: ${leads?.length || 0}`);
    console.log(`  New leads count: ${newLeads.length}`);
    console.log('  All lead statuses:', leads?.map(l => ({ id: l.requestId, status: l.status, category: l.categoryName })) || []);
    console.log('  New leads:', newLeads.map(l => ({ id: l.requestId, status: l.status, category: l.categoryName })));
    console.log('  React Query staleTime: 0 (always refetch)');
    console.log('  React Query refetchInterval: 30 seconds');
  }, [leads, newLeads]);

  // Auto-refetch when app comes to foreground
  React.useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('🔄 App came to foreground - refetching leads');
        refetch();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [refetch]);

  // Manual refresh function for testing
  const handleManualRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    refetch();
  };

  // React Query handles automatic refetching - no need for manual polling

  const filters = [
    { key: 'all', label: 'All Leads', count: newLeads.length },
    { key: 'high', label: 'High Urgency', count: newLeads.filter((lead: any) => lead.urgency === 'high').length },
    { key: 'medium', label: 'Medium Urgency', count: newLeads.filter((lead: any) => lead.urgency === 'medium').length },
    { key: 'low', label: 'Low Urgency', count: newLeads.filter((lead: any) => lead.urgency === 'low').length }
  ];

  const filteredLeads = newLeads.filter((lead: any) => {
    const matchesSearch = lead.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.suburb?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || lead.urgency?.toLowerCase() === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handlePurchaseLead = async (leadId: string | number) => {
    try {
      console.log('Purchasing lead:', leadId);
      console.log('Lead ID type:', typeof leadId);
      console.log('Lead ID value:', leadId);
      
      if (!leadId) {
        Alert.alert('Error', 'Invalid lead ID');
        return;
      }

      // Show confirmation dialog
      Alert.alert(
        'Purchase Lead',
        'Are you sure you want to purchase this lead?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Purchase',
            onPress: async () => {
              try {
                setPurchasingLeadId(leadId);
                // Call the API to purchase the lead
                const result = await apiService.purchaseLead(leadId);
                console.log('Lead purchase successful:', result);
                
                // Show success message
                Alert.alert(
                  'Success!',
                  'Lead purchased successfully! You can now view the customer details.',
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        // Refresh the leads list
                        refetch();
                        // Navigate to lead details
                        onNavigate('leadDetails', { leadId: leadId });
                      }
                    }
                  ]
                );
              } catch (error: any) {
                console.error('Lead purchase failed:', error);
                Alert.alert(
                  'Purchase Failed',
                  error.message || 'Failed to purchase lead. Please try again.',
                  [{ text: 'OK' }]
                );
              } finally {
                setPurchasingLeadId(null);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error in handlePurchaseLead:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      setPurchasingLeadId(null);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 1) return 'Today';
    return `${diffDays} days ago`;
  };

  // Animation effects on mount
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (leadsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading leads...</Text>
      </View>
    );
  }

  if (leadsError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading leads</Text>
        <Button mode="contained" onPress={() => refetch()} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={leadsLoading} onRefresh={refetch} />
      }
      showsVerticalScrollIndicator={false}
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
          <View style={styles.headerContent}>
            <Text style={styles.modernTitle}>New Leads</Text>
            <Text style={styles.modernSubtitle}>Available leads in your service area</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleManualRefresh} style={styles.refreshButton}>
              <Text style={styles.refreshButtonText}>🔄</Text>
            </TouchableOpacity>
            <View style={styles.headerIcon}>
              <Text style={styles.headerEmoji}>🆕</Text>
            </View>
          </View>
        </View>

        {/* Modern Search and Filters */}
        <View style={styles.modernSearchContainer}>
          <View style={styles.searchWrapper}>
            <Searchbar
              placeholder="Search leads..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.modernSearchBar}
            />
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.modernFiltersContainer}
            contentContainerStyle={styles.filtersContent}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                onPress={() => setSelectedFilter(filter.key)}
                style={[
                  styles.modernFilterChip,
                  selectedFilter === filter.key && styles.modernFilterChipActive
                ]}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.modernFilterText,
                  selectedFilter === filter.key && styles.modernFilterTextActive
                ]}>
                  {filter.label}
                </Text>
                <View style={[
                  styles.modernFilterBadge,
                  selectedFilter === filter.key && styles.modernFilterBadgeActive
                ]}>
                  <Text style={[
                    styles.modernFilterBadgeText,
                    selectedFilter === filter.key && styles.modernFilterBadgeTextActive
                  ]}>
                    {filter.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Modern Leads List */}
        <View style={styles.modernLeadsContainer}>
          {filteredLeads.map((lead: any) => {
            console.log('Lead data:', lead);
            console.log('Lead ID:', lead.id);
            console.log('Lead requestId:', lead.requestId);
            return (
            <TouchableOpacity 
              key={lead.id || lead.requestId} 
              style={styles.modernLeadCard}
              activeOpacity={0.9}
            >
              <View style={styles.leadCardHeader}>
                <View style={styles.leadTitleSection}>
                  <Text style={styles.modernLeadTitle}>{lead.categoryName || 'Service Request'}</Text>
                  <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(lead.urgency) + '20' }]}>
                    <Text style={[styles.urgencyText, { color: getUrgencyColor(lead.urgency) }]}>
                      {lead.urgency || 'Normal'} Urgency
                    </Text>
                  </View>
                </View>
                <View style={styles.leadCostSection}>
                  <Text style={styles.costLabel}>Lead Cost</Text>
                  <Text style={styles.modernCostAmount}>${lead.leadCost || 0}</Text>
                </View>
              </View>

              <Text style={styles.modernLeadDescription}>{lead.description || 'No description provided'}</Text>

              <View style={styles.modernLeadDetails}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailIcon}>📍</Text>
                    <Text style={styles.detailText}>{lead.suburb || 'Location not specified'}</Text>
                    {lead.postcode && (
                      <Text style={styles.detailSubtext}>({lead.postcode})</Text>
                    )}
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailIcon}>👤</Text>
                    <Text style={styles.detailText}>{lead.customerName || 'Customer'}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailIcon}>📞</Text>
                    <Text style={styles.detailText}>{lead.customerPhone || 'Phone not provided'}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailIcon}>📅</Text>
                    <Text style={styles.detailText}>Preferred: {lead.preferredDate ? formatDate(lead.preferredDate) : 'Flexible'}</Text>
                  </View>
                  {lead.postedAt && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailIcon}>⏰</Text>
                      <Text style={styles.detailText}>Posted: {formatDate(lead.postedAt)}</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.modernLeadActions}>
                <TouchableOpacity
                  style={styles.modernActionButton}
                  onPress={() => onNavigate('leadDetails', { leadId: lead.id })}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionButtonText}>View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modernPurchaseButton, { opacity: purchasingLeadId === (lead.requestId || lead.id) ? 0.7 : 1 }]}
                  onPress={() => handlePurchaseLead(lead.requestId || lead.id)}
                  disabled={purchasingLeadId === (lead.requestId || lead.id)}
                  activeOpacity={0.8}
                >
                  {purchasingLeadId === (lead.requestId || lead.id) ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text style={styles.purchaseButtonText}>
                      Purchase Lead
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            );
          })}

          {filteredLeads.length === 0 && (
            <View style={styles.modernEmptyState}>
              <View style={styles.emptyIconContainer}>
                <Text style={styles.emptyIcon}>🔍</Text>
              </View>
              <Text style={styles.modernEmptyTitle}>No leads found</Text>
              <Text style={styles.modernEmptyDescription}>
                {searchQuery || selectedFilter !== 'all' 
                  ? 'Try adjusting your search or filters to find more leads'
                  : 'No new leads available at the moment. Check back later!'
                }
              </Text>
              <TouchableOpacity 
                style={styles.exploreButton}
                onPress={() => onNavigate('leads')}
                activeOpacity={0.8}
              >
                <Text style={styles.exploreButtonText}>← Back</Text>
              </TouchableOpacity>
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
  },
  animatedContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error || '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: colors.primary,
  },
  // Modern Header
  modernHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerContent: {
    flex: 1,
  },
  modernTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  modernSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 28,
  },
  // Modern Search Container
  modernSearchContainer: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  searchWrapper: {
    marginBottom: 16,
  },
  modernSearchBar: {
    elevation: 0,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  modernFiltersContainer: {
    flexDirection: 'row',
  },
  filtersContent: {
    paddingRight: 20,
  },
  modernFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  modernFilterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modernFilterText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginRight: 8,
    fontWeight: '500',
  },
  modernFilterTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  modernFilterBadge: {
    backgroundColor: colors.textSecondary + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  modernFilterBadgeActive: {
    backgroundColor: '#ffffff' + '30',
  },
  modernFilterBadgeText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  modernFilterBadgeTextActive: {
    color: '#ffffff',
  },
  // Modern Leads Container
  modernLeadsContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  modernLeadCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  leadCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  leadTitleSection: {
    flex: 1,
    marginRight: 16,
  },
  modernLeadTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  urgencyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  urgencyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  leadCostSection: {
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  modernCostAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  modernLeadDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  modernLeadDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  detailText: {
    fontSize: 13,
    color: colors.text,
    marginRight: 8,
    flex: 1,
  },
  detailSubtext: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  modernLeadActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modernActionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  modernPurchaseButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  purchaseButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  // Modern Empty State
  modernEmptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.textSecondary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 32,
    opacity: 0.6,
  },
  modernEmptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  modernEmptyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  // Refresh button styles
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  refreshButtonText: {
    fontSize: 18,
  },
});

module.exports = NewLeadsScreen;








