const React = require('react');
const { useState } = require('react');
const { View, StyleSheet, ScrollView, TouchableOpacity, Text, RefreshControl } = require('react-native');
const { Title, Paragraph, Card, Button, Chip, ActivityIndicator } = require('react-native-paper');
const { useQuery } = require('@tanstack/react-query');
const apiService = require('../../services/api');
const { colors } = require('../../utils/theme');

function ActiveLeadsScreen({ onNavigate }) {
  const [refreshing, setRefreshing] = useState(false);

  // Fetch active leads from API
  const { data: activeLeads = [], isLoading: leadsLoading, refetch: refetchLeads } = useQuery({
    queryKey: ['/api/provider/leads'],
    queryFn: () => apiService.getLeads(),
    retry: false,
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetchLeads();
    setRefreshing(false);
  }, [refetchLeads]);

  // Filter active leads (status === 'purchased')
  const purchasedLeads = activeLeads.filter(lead => lead.status === 'purchased');

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
          <Title style={styles.title}>Active Leads ({purchasedLeads.length})</Title>
          <Paragraph style={styles.subtitle}>Manage your current projects</Paragraph>
        </View>
      </View>

      {/* Loading State */}
      {leadsLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading active leads...</Text>
        </View>
      ) : (
        <>
          {/* Summary Stats */}
          <View style={styles.statsContainer}>
            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Text style={styles.statNumber}>{purchasedLeads.length}</Text>
                <Text style={styles.statLabel}>Active Projects</Text>
              </Card.Content>
            </Card>

            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Text style={styles.statNumber}>
                  ${purchasedLeads.reduce((sum, lead) => {
                    const budget = lead.budget || 0;
                    return sum + budget;
                  }, 0).toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>Total Value</Text>
              </Card.Content>
            </Card>

            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Text style={styles.statNumber}>
                  ${purchasedLeads.reduce((sum, lead) => {
                    const leadCost = lead.leadCost || 0;
                    return sum + leadCost;
                  }, 0).toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>Total Lead Cost</Text>
              </Card.Content>
            </Card>
          </View>

          {/* Active Leads List */}
          <View style={styles.leadsContainer}>
            {purchasedLeads.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📋</Text>
                <Text style={styles.emptyTitle}>No Active Leads</Text>
                <Text style={styles.emptyText}>You don't have any active leads yet.</Text>
              </View>
            ) : (
              purchasedLeads.map((lead) => (
                <Card key={lead.requestId || lead.id} style={styles.leadCard}>
                  <Card.Content>
                    <View style={styles.leadHeader}>
                      <View style={styles.leadTitleContainer}>
                        <Title style={styles.leadTitle}>
                          {lead.categoryName} - {lead.suburb?.toUpperCase() || 'LOCATION'}
                        </Title>
                        <View style={styles.statusContainer}>
                          <Chip 
                            mode="outlined" 
                            style={styles.statusChip}
                            textStyle={styles.statusChipText}
                          >
                            {lead.status === 'purchased' ? 'Active' : lead.status}
                          </Chip>
                        </View>
                      </View>
                      <View style={styles.leadBudget}>
                        <Text style={styles.budgetLabel}>Budget</Text>
                        <Text style={styles.budgetAmount}>${lead.budget || 'N/A'}</Text>
                      </View>
                    </View>

                    <Paragraph style={styles.leadDescription}>{lead.description}</Paragraph>

                    <View style={styles.leadDetails}>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailIcon}>👤</Text>
                        <Text style={styles.detailText}>
                          {lead.customerName || 'Customer Name N/A'}
                        </Text>
                      </View>

                      <View style={styles.detailItem}>
                        <Text style={styles.detailIcon}>📍</Text>
                        <Text style={styles.detailText}>
                          {lead.suburb}, {lead.postcode}
                        </Text>
                      </View>

                      <View style={styles.detailItem}>
                        <Text style={styles.detailIcon}>📅</Text>
                        <Text style={styles.detailText}>
                          Created: {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                        </Text>
                      </View>

                      <View style={styles.detailItem}>
                        <Text style={styles.detailIcon}>💰</Text>
                        <Text style={styles.detailText}>
                          Lead Cost: ${lead.leadCost || 0}
                        </Text>
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
                        onPress={() => console.log('Update progress for lead:', lead.requestId || lead.id)}
                        style={styles.updateButton}
                        buttonColor={colors.primary}
                      >
                        Update Progress
                      </Button>
                    </View>
                  </Card.Content>
                </Card>
              ))
            )}
          </View>
        </>
      )}
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
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    padding: 16,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
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
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.success + '20',
    borderColor: colors.success,
  },
  statusChipText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '600',
  },
  leadBudget: {
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.success,
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
  leadActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  updateButton: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
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
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

module.exports = ActiveLeadsScreen;








