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
      {/* <View style={styles.header}>
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
      </View> */}

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
                <View key={lead.requestId || lead.id} style={styles.leadCard}>
                  {/* Top Row - Category & Status */}
                  <View style={styles.leadTopRow}>
                    <View style={styles.categorySection}>
                      <Text style={styles.categoryIcon}>🏠</Text>
                      <View style={styles.categoryText}>
                        <Text style={styles.categoryName}>{lead.categoryName || 'N/A'}</Text>
                        <Text style={styles.locationText}>{lead.suburb?.toUpperCase() || 'LOCATION'}</Text>
                      </View>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: lead.wasJobBooked ? '#10B981' : '#6B7280' }
                    ]}>
                      <Text style={styles.statusText}>
                        {lead.wasJobBooked ? 'Job Booked' : 'Not Booked'}
                      </Text>
                    </View>
                  </View>

                  {/* Middle Row - Customer Info */}
                  <View style={styles.customerRow}>
                    <View style={styles.customerIconContainer}>
                      <Text style={styles.customerIcon}>👤</Text>
                    </View>
                    <View style={styles.customerDetails}>
                      <Text style={styles.customerName}>{lead.customerName || 'N/A'}</Text>
                      <Text style={styles.customerPhone}>{lead.customerPhone || 'N/A'}</Text>
                    </View>
                    <View style={styles.dateContainer}>
                      <Text style={styles.dateLabel}>Closed</Text>
                      <Text style={styles.dateValue}>
                        {lead.closedAt ? new Date(lead.closedAt).toLocaleDateString() : 'N/A'}
                      </Text>
                    </View>
                  </View>

                  {/* Description Row */}
                  {lead.description && (
                    <View style={styles.descriptionRow}>
                      <Text style={styles.descriptionText}>{lead.description}</Text>
                    </View>
                  )}

                  {/* Bottom Row - Action Button */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity 
                      style={styles.viewButton}
                      onPress={() => onNavigate('leadDetails', { leadId: lead.requestId || lead.id })}
                    >
                      <Text style={styles.viewButtonText}>View Details</Text>
                      <Text style={styles.viewButtonIcon}>→</Text>
                    </TouchableOpacity>
                  </View>
                </View>
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
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    marginHorizontal: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  leadTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  categorySection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  categoryText: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 3,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 18,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderRadius: 6,
  },
  customerIconContainer: {
    marginRight: 10,
  },
  customerIcon: {
    fontSize: 18,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  dateLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  descriptionRow: {
    marginBottom: 12,
    paddingHorizontal: 3,
  },
  descriptionText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  actionRow: {
    alignItems: 'flex-end',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  viewButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 6,
  },
  viewButtonIcon: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
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








