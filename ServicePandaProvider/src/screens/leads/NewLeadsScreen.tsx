const React = require('react');
const { useState } = require('react');
const { View, StyleSheet, ScrollView, TouchableOpacity, Text, RefreshControl, Alert } = require('react-native');
const { Title, Paragraph, Card, Button, Chip, Searchbar, Badge, ActivityIndicator } = require('react-native-paper');
const { colors } = require('../../utils/theme');
const { useQuery, useMutation } = require('@tanstack/react-query');
const { getLeads, getCreditBalance, getProfile } = require('../../services/api');

function NewLeadsScreen({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Fetch leads from API
  const { data: leads, isLoading: leadsLoading, error: leadsError, refetch } = useQuery({
    queryKey: ['provider-leads'],
    queryFn: getLeads,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch credit balance and profile for payment method determination
  const { data: creditBalance } = useQuery({
    queryKey: ['/api/provider/credit/balance'],
    queryFn: getCreditBalance,
  });

  const { data: profile } = useQuery({
    queryKey: ['/api/provider/profile'],
    queryFn: getProfile,
  });

  // Filter for new/pending leads only
  const newLeads = leads?.filter(lead => lead.status === 'pending') || [];

  const filters = [
    { key: 'all', label: 'All Leads', count: newLeads.length },
    { key: 'high', label: 'High Urgency', count: newLeads.filter(lead => lead.urgency === 'high').length },
    { key: 'medium', label: 'Medium Urgency', count: newLeads.filter(lead => lead.urgency === 'medium').length },
    { key: 'low', label: 'Low Urgency', count: newLeads.filter(lead => lead.urgency === 'low').length }
  ];

  const filteredLeads = newLeads.filter(lead => {
    const matchesSearch = lead.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.suburb?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || lead.urgency?.toLowerCase() === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handlePurchaseLead = (leadId) => {
    // TODO: Implement lead purchase logic
    console.log('Purchasing lead:', leadId);
    // Navigate to payment or confirmation screen
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return colors.textSecondary;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 1) return 'Today';
    return `${diffDays} days ago`;
  };

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
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => onNavigate('leads')}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Title style={styles.title}>New Leads</Title>
          <Paragraph style={styles.subtitle}>Available leads in your service area</Paragraph>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search leads..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setSelectedFilter(filter.key)}
              style={[
                styles.filterChip,
                selectedFilter === filter.key && styles.filterChipActive
              ]}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter.key && styles.filterTextActive
              ]}>
                {filter.label}
              </Text>
              <Badge style={styles.filterBadge}>{filter.count}</Badge>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Leads List */}
      <View style={styles.leadsContainer}>
        {filteredLeads.map((lead) => (
          <Card key={lead.id} style={styles.leadCard}>
            <Card.Content>
              <View style={styles.leadHeader}>
                <View style={styles.leadTitleContainer}>
                  <Title style={styles.leadTitle}>{lead.categoryName || 'Service Request'}</Title>
                  <Chip 
                    mode="outlined" 
                    style={[styles.urgencyChip, { borderColor: getUrgencyColor(lead.urgency) }]}
                    textStyle={{ color: getUrgencyColor(lead.urgency) }}
                  >
                    {lead.urgency || 'Normal'} Urgency
                  </Chip>
                </View>
                <View style={styles.leadCost}>
                  <Text style={styles.costLabel}>Lead Cost</Text>
                  <Text style={styles.costAmount}>${lead.leadCost || 0}</Text>
                </View>
              </View>

              <Paragraph style={styles.leadDescription}>{lead.description || 'No description provided'}</Paragraph>

              <View style={styles.leadDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>📍</Text>
                  <Text style={styles.detailText}>{lead.suburb || 'Location not specified'}</Text>
                  {lead.postcode && (
                    <Text style={styles.detailSubtext}>({lead.postcode})</Text>
                  )}
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>👤</Text>
                  <Text style={styles.detailText}>{lead.customerName || 'Customer'}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>📞</Text>
                  <Text style={styles.detailText}>{lead.customerPhone || 'Phone not provided'}</Text>
                </View>

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

              <View style={styles.leadActions}>
                <Button
                  mode="outlined"
                  onPress={() => onNavigate('leadDetails', { leadId: lead.id })}
                  style={styles.actionButton}
                >
                  View Details
                </Button>
                <Button
                  mode="contained"
                  onPress={() => handlePurchaseLead(lead.id)}
                  style={styles.purchaseButton}
                  buttonColor={colors.primary}
                >
                  Purchase Lead
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}

        {filteredLeads.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Title style={styles.emptyTitle}>No leads found</Title>
            <Paragraph style={styles.emptyDescription}>
              {searchQuery || selectedFilter !== 'all' 
                ? 'Try adjusting your search or filters to find more leads'
                : 'No new leads available at the moment. Check back later!'
              }
            </Paragraph>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error || '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: 16,
  },
  backIcon: {
    fontSize: 24,
    color: colors.primary,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: colors.surface,
  },
  searchBar: {
    marginBottom: 16,
    elevation: 2,
  },
  filtersContainer: {
    flexDirection: 'row',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  filterTextActive: {
    color: colors.onPrimary,
  },
  filterBadge: {
    backgroundColor: colors.primary,
  },
  leadsContainer: {
    padding: 16,
  },
  leadCard: {
    marginBottom: 16,
    elevation: 2,
  },
  leadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leadTitleContainer: {
    flex: 1,
    marginRight: 16,
  },
  leadTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  urgencyChip: {
    alignSelf: 'flex-start',
  },
  leadCost: {
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  costAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  leadDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  leadDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.text,
    marginRight: 8,
  },
  detailSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  leadActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  purchaseButton: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

module.exports = NewLeadsScreen;








