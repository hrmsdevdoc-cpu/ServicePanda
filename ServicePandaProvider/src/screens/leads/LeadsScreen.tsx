const React = require('react');
const { View, Text, StyleSheet, ScrollView, TouchableOpacity } = require('react-native');
const { Card, Title, Paragraph, Button, Chip } = require('react-native-paper');
const { colors } = require('../../utils/theme');

function LeadsScreen({ onNavigate, onBack }) {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBack}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Leads Management</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>New Leads</Text>
            <Text style={styles.statStatus}>Available to purchase</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Active Leads</Text>
            <Text style={styles.statStatus}>Currently working on</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={styles.statNumber}>24</Text>
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
          onPress={() => onNavigate('activeLeads')}
        >
          <Card style={styles.actionCard}>
            <Card.Content style={styles.actionContent}>
              <Text style={styles.actionIcon}>⚡</Text>
              <View style={styles.actionText}>
                <Title style={styles.actionTitle}>Manage Active Leads</Title>
                <Paragraph style={styles.actionDescription}>
                  Track progress and update status of current leads
                </Paragraph>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  statStatus: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actionsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
  actionCard: {
    elevation: 2,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actionArrow: {
    fontSize: 20,
    color: colors.primary,
  },
  activityContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  activityCard: {
    marginBottom: 12,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
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







