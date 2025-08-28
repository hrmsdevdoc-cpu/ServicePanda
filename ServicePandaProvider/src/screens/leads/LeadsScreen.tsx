const React = require('react');
const { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } = require('react-native');
const { Card, Title, Paragraph, Button, Chip, ActivityIndicator } = require('react-native-paper');
const { useQuery } = require('@tanstack/react-query');
const apiService = require('../../services/api');
const { colors } = require('../../utils/theme');

function LeadsScreen({ onNavigate, onBack }) {
  // Fetch all leads data for dynamic counts
  const { data: allLeads = [], isLoading: leadsLoading, refetch: refetchLeads } = useQuery({
    queryKey: ['/api/provider/leads'],
    queryFn: () => apiService.getLeads(),
    retry: false,
  });

  // Fetch closed leads for completed count
  const { data: closedLeads = [], isLoading: closedLeadsLoading } = useQuery({
    queryKey: ['/api/provider/leads/closed'],
    queryFn: () => apiService.getClosedLeads(),
    retry: false,
  });

  // Calculate dynamic counts
  const newLeadsCount = allLeads.filter(lead => lead.status === 'pending').length;
  const activeLeadsCount = allLeads.filter(lead => lead.status === 'purchased').length;
  const completedLeadsCount = closedLeads.length;

  // Loading state
  const isLoading = leadsLoading || closedLeadsLoading;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetchLeads} />
      }
    >
      {/* Header removed - back button already exists at top level */}

      {/* Quick Stats - Now Dynamic! */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.statNumber}>{newLeadsCount}</Text>
            )}
            <Text style={styles.statLabel}>New Leads</Text>
            <Text style={styles.statStatus}>Available to purchase</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.statNumber}>{activeLeadsCount}</Text>
            )}
            <Text style={styles.statLabel}>Active Leads</Text>
            <Text style={styles.statStatus}>Currently working on</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.statNumber}>{completedLeadsCount}</Text>
            )}
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={styles.statStatus}>Successfully closed</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Title style={styles.sectionTitle}>Quick Actions</Title>
        
        <TouchableOpacity 
          style={styles.actionButton}
          activeOpacity={0.7}
          onPress={() => onNavigate('newLeads')}
        >
          <Card style={styles.actionCard}>
            <Card.Content style={styles.actionContent}>
              <Text style={styles.actionIcon}>🆕</Text>
              <View style={styles.actionText}>
                <Title style={styles.actionTitle}>Browse New Leads</Title>
                <Paragraph style={styles.actionDescription}>
                  View and purchase new leads in your service area
                </Paragraph>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>



        <TouchableOpacity 
          style={styles.actionButton}
          activeOpacity={0.7}
          onPress={() => onNavigate('closedLeads')}
        >
          <Card style={styles.actionCard}>
            <Card.Content style={styles.actionContent}>
              <Text style={styles.actionIcon}>✅</Text>
              <View style={styles.actionText}>
                <Title style={styles.actionTitle}>View Completed Leads</Title>
                <Paragraph style={styles.actionDescription}>
                  Review your completed leads and earnings
                </Paragraph>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      <View style={styles.activityContainer}>
        <Title style={styles.sectionTitle}>Recent Activity</Title>
        
        <Card style={styles.activityCard}>
          <Card.Content>
            <View style={styles.activityItem}>
              <Text style={styles.activityIcon}>🎯</Text>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>New lead available</Text>
                <Text style={styles.activityDescription}>Kitchen remodeling in Downtown area</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
              <Chip mode="outlined" style={styles.activityChip}>$25</Chip>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.activityCard}>
          <Card.Content>
            <View style={styles.activityItem}>
              <Text style={styles.activityIcon}>✅</Text>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Lead completed</Text>
                <Text style={styles.activityDescription}>Bathroom renovation project</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
              <Chip mode="outlined" style={styles.activityChip}>Completed</Chip>
            </View>
          </Card.Content>
        </Card>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  statCard: {
    flex: 1,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    padding: 12,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  statStatus: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actionsContainer: {
    padding: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  actionCard: {
    elevation: 2,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 4,
  },
  actionText: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 0,
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  actionArrow: {
    fontSize: 18,
    color: colors.primary,
  },
  actionButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  activityContainer: {
    padding: 12,
    paddingBottom: 24,
  },
  activityCard: {
    marginBottom: 8,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 4,
  },
  activityDetails: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 1,
  },
  activityDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 1,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  activityChip: {
    borderColor: colors.primary,
  },
});

module.exports = LeadsScreen;







