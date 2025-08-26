const React = require('react');
const { useState } = require('react');
const { View, StyleSheet, ScrollView, TouchableOpacity, Text, RefreshControl } = require('react-native');
const { Title, Paragraph, Card, Button, Chip, ActivityIndicator } = require('react-native-paper');
const { useQuery } = require('@tanstack/react-query');
const apiService = require('../../services/api');
const { colors } = require('../../utils/theme');

function ClosedLeadsScreen({ onNavigate }) {
  const [refreshing, setRefreshing] = useState(false);

  // Fetch closed leads from API - exactly like web app
  const { data: closedLeads = [], isLoading: closedLeadsLoading, refetch: refetchLeads } = useQuery({
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
          <Paragraph style={styles.subtitle}>Your completed leads and records</Paragraph>
        </View>
      </View>

      {/* Loading State */}
      {closedLeadsLoading ? (
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
                <Text style={styles.statLabel}>Total Closed</Text>
              </Card.Content>
            </Card>

            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Text style={styles.statNumber}>
                  {closedLeads.filter(lead => lead.wasJobBooked).length}
                </Text>
                <Text style={styles.statLabel}>Jobs Booked</Text>
              </Card.Content>
            </Card>

            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Text style={styles.statNumber}>
                  {closedLeads.filter(lead => !lead.wasJobBooked).length}
                </Text>
                <Text style={styles.statLabel}>Not Booked</Text>
              </Card.Content>
            </Card>
          </View>

          {/* Closed Leads List - Exactly like web app */}
          <View style={styles.leadsContainer}>
            {closedLeads.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>✅</Text>
                <Text style={styles.emptyTitle}>No closed leads</Text>
                <Text style={styles.emptyText}>Leads you close will appear here for your records.</Text>
              </View>
            ) : (
              closedLeads.map((lead) => (
                <Card key={lead.requestId || lead.id} style={styles.leadCard}>
                  <Card.Content>
                    <View style={styles.leadHeader}>
                      <View style={styles.leadTitleContainer}>
                        <Title style={styles.leadTitle}>
                          {lead.categoryName || 'N/A'} - {lead.suburb?.toUpperCase() || 'LOCATION'}
                        </Title>
                        <View style={styles.statusContainer}>
                          <Chip 
                            mode="outlined" 
                            style={[
                              styles.statusChip, 
                              { 
                                borderColor: lead.wasJobBooked ? '#10B981' : '#6B7280',
                                backgroundColor: lead.wasJobBooked ? '#F0FDF4' : '#F9FAFB'
                              }
                            ]}
                            textStyle={{ 
                              color: lead.wasJobBooked ? '#10B981' : '#6B7280'
                            }}
                          >
                            {lead.wasJobBooked ? 'Job Booked' : 'Not Booked'}
                          </Chip>
                        </View>
                      </View>
                      <View style={styles.closedDate}>
                        <Text style={styles.closedDateLabel}>Closed:</Text>
                        <Text style={styles.closedDateText}>
                          {lead.closedAt ? new Date(lead.closedAt).toLocaleDateString() : 'N/A'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.customerInfo}>
                      <Text style={styles.customerLabel}>
                        Customer: {lead.customerName || 'N/A'} - {lead.customerPhone || 'N/A'}
                      </Text>
                    </View>

                    {/* Additional lead details if available */}
                    {lead.description && (
                      <Paragraph style={styles.leadDescription}>
                        {lead.description}
                      </Paragraph>
                    )}

                    <View style={styles.leadActions}>
                      <Button
                        mode="outlined"
                        onPress={() => onNavigate('leadDetails', { leadId: lead.requestId || lead.id })}
                        style={styles.actionButton}
                      >
                        View Details
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
  closedDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  closedDateLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 4,
  },
  closedDateText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  customerInfo: {
    marginBottom: 16,
  },
  customerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  leadDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  leadActions: {
    marginTop: 16,
    alignItems: 'flex-end',
  },
  actionButton: {
    borderRadius: 8,
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








