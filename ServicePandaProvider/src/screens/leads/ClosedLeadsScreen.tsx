const React = require('react');
const { View, StyleSheet, ScrollView, TouchableOpacity, Text, RefreshControl } = require('react-native');
const { Title, Paragraph, Card, Button, Chip, ActivityIndicator } = require('react-native-paper');
const { useQuery } = require('@tanstack/react-query');
const apiService = require('../../services/api');
const { colors } = require('../../utils/theme');

function ClosedLeadsScreen({ onNavigate }) {
  const [refreshing, setRefreshing] = React.useState(false);

  // Fetch closed leads from API
  const { data: closedLeads = [], isLoading: leadsLoading, refetch: refetchLeads } = useQuery({
    queryKey: ['/api/provider/leads/closed'],
    queryFn: () => apiService.getClosedLeads(),
    retry: false,
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetchLeads();
    setRefreshing(false);
  }, [refetchLeads]);

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
          <Title style={styles.title}>Closed Leads ({closedLeads.length})</Title>
          <Paragraph style={styles.subtitle}>Your completed projects</Paragraph>
        </View>
      </View>

      {/* Loading State */}
      {leadsLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading closed leads...</Text>
        </View>
      ) : (
        <>
          {/* Summary Stats */}
          <View style={styles.statsContainer}>
            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Text style={styles.statNumber}>{closedLeads.length}</Text>
                <Text style={styles.statLabel}>Completed Projects</Text>
              </Card.Content>
            </Card>

            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Text style={styles.statNumber}>
                  ${closedLeads.reduce((sum, lead) => {
                    const earnings = lead.leadCost || 0;
                    return sum + earnings;
                  }, 0).toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>Total Earnings</Text>
              </Card.Content>
            </Card>

            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Text style={styles.statNumber}>
                  {closedLeads.length > 0 ? 
                    (closedLeads.reduce((sum, lead) => sum + (lead.rating || 0), 0) / closedLeads.length).toFixed(1) : 
                    '0.0'
                  }
                </Text>
                <Text style={styles.statLabel}>Average Rating</Text>
              </Card.Content>
            </Card>
          </View>
        </>
      )}

      {/* Closed Leads List */}
      {!leadsLoading && (
        <View style={styles.leadsContainer}>
          {closedLeads.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>No Closed Leads</Text>
              <Text style={styles.emptyText}>You haven't completed any leads yet.</Text>
            </View>
          ) : (
            closedLeads.map((lead) => (
              <Card key={lead.requestId || lead.id} style={styles.leadCard}>
                <Card.Content>
                  <View style={styles.leadHeader}>
                    <View style={styles.leadTitleContainer}>
                      <Text style={styles.leadTitle}>
                        {lead.categoryName} - {lead.suburb?.toUpperCase() || 'LOCATION'}
                      </Text>
                      <Chip 
                        mode="outlined" 
                        style={styles.statusChip}
                        textStyle={styles.statusChipText}
                      >
                        {lead.leadStatus === 'closed' && lead.wasJobBooked ? 'Job Booked' : 'Closed'}
                      </Chip>
                    </View>
                  </View>
                  
                  <View style={styles.leadDetails}>
                    <Text style={styles.leadCustomer}>
                      Customer: {lead.customerName} - {lead.customerPhone}
                    </Text>
                    <Text style={styles.leadLocation}>
                      Location: {lead.suburb}, {lead.postcode}
                    </Text>
                    {lead.description && (
                      <Text style={styles.leadDescription}>
                        Description: {lead.description}
                      </Text>
                    )}
                    {lead.budget && (
                      <Text style={styles.leadBudget}>
                        Budget: ${lead.budget}
                      </Text>
                    )}
                  </View>
                  
                  <View style={styles.leadFooter}>
                    <Text style={styles.leadCost}>
                      Lead Cost: ${lead.leadCost || 0}
                    </Text>
                    <Text style={styles.leadClosedDate}>
                      Closed: {lead.closedAt ? new Date(lead.closedAt).toLocaleDateString() : 'N/A'}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </View>
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
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  leadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leadTitleContainer: {
    flex: 1,
  },
  leadTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
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
  leadDetails: {
    marginBottom: 16,
  },
  leadCustomer: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  leadLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  leadDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
  },
  leadBudget: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  leadFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  leadCost: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  leadClosedDate: {
    fontSize: 12,
    color: colors.textSecondary,
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

module.exports = ClosedLeadsScreen;








