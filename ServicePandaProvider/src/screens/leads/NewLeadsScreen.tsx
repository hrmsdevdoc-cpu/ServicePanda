const React = require('react');
const { useState } = require('react');
const { View, StyleSheet, ScrollView, TouchableOpacity, Text } = require('react-native');
const { Title, Paragraph, Card, Button, Chip, Searchbar, Badge } = require('react-native-paper');
const { colors } = require('../../utils/theme');

function NewLeadsScreen({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data for new leads
  const newLeads = [
    {
      id: '1',
      title: 'Kitchen Remodeling',
      description: 'Complete kitchen renovation including cabinets, countertops, and appliances',
      location: 'Downtown Area',
      budget: '$15,000 - $25,000',
      urgency: 'High',
      serviceType: 'Remodeling',
      cost: 25,
      postedTime: '2 hours ago',
      distance: '2.3 miles'
    },
    {
      id: '2',
      title: 'Bathroom Renovation',
      description: 'Full bathroom remodel with new fixtures, tiles, and plumbing',
      location: 'Westside',
      budget: '$8,000 - $15,000',
      urgency: 'Medium',
      serviceType: 'Renovation',
      cost: 20,
      postedTime: '4 hours ago',
      distance: '3.1 miles'
    },
    {
      id: '3',
      title: 'Deck Building',
      description: 'Custom wooden deck with railing and stairs',
      location: 'North Suburbs',
      budget: '$5,000 - $12,000',
      urgency: 'Low',
      serviceType: 'Construction',
      cost: 18,
      postedTime: '6 hours ago',
      distance: '5.2 miles'
    },
    {
      id: '4',
      title: 'Electrical Panel Upgrade',
      description: 'Upgrade electrical panel to support new appliances and increased capacity',
      location: 'Eastside',
      budget: '$3,000 - $6,000',
      urgency: 'High',
      serviceType: 'Electrical',
      cost: 22,
      postedTime: '1 day ago',
      distance: '1.8 miles'
    },
    {
      id: '5',
      title: 'Landscaping Design',
      description: 'Complete landscape design and installation for residential property',
      location: 'South Suburbs',
      budget: '$10,000 - $20,000',
      urgency: 'Medium',
      serviceType: 'Landscaping',
      cost: 15,
      postedTime: '1 day ago',
      distance: '4.7 miles'
    }
  ];

  const filters = [
    { key: 'all', label: 'All Leads', count: newLeads.length },
    { key: 'high', label: 'High Urgency', count: newLeads.filter(lead => lead.urgency === 'High').length },
    { key: 'medium', label: 'Medium Urgency', count: newLeads.filter(lead => lead.urgency === 'Medium').length },
    { key: 'low', label: 'Low Urgency', count: newLeads.filter(lead => lead.urgency === 'Low').length }
  ];

  const filteredLeads = newLeads.filter(lead => {
    const matchesSearch = lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || lead.urgency.toLowerCase() === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handlePurchaseLead = (leadId) => {
    // TODO: Implement lead purchase logic
    console.log('Purchasing lead:', leadId);
    // Navigate to payment or confirmation screen
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency.toLowerCase()) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return colors.textSecondary;
    }
  };

  return (
    <ScrollView style={styles.container}>
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
                  <Title style={styles.leadTitle}>{lead.title}</Title>
                  <Chip 
                    mode="outlined" 
                    style={[styles.urgencyChip, { borderColor: getUrgencyColor(lead.urgency) }]}
                    textStyle={{ color: getUrgencyColor(lead.urgency) }}
                  >
                    {lead.urgency} Urgency
                  </Chip>
                </View>
                <View style={styles.leadCost}>
                  <Text style={styles.costLabel}>Lead Cost</Text>
                  <Text style={styles.costAmount}>${lead.cost}</Text>
                </View>
              </View>

              <Paragraph style={styles.leadDescription}>{lead.description}</Paragraph>

              <View style={styles.leadDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>📍</Text>
                  <Text style={styles.detailText}>{lead.location}</Text>
                  <Text style={styles.detailSubtext}>({lead.distance})</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>💰</Text>
                  <Text style={styles.detailText}>{lead.budget}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>🏷️</Text>
                  <Text style={styles.detailText}>{lead.serviceType}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>⏰</Text>
                  <Text style={styles.detailText}>{lead.postedTime}</Text>
                </View>
              </View>

              <View style={styles.leadActions}>
                <Button
                  mode="outlined"
                  onPress={() => onNavigate('leadDetails')}
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
              Try adjusting your search or filters to find more leads
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








