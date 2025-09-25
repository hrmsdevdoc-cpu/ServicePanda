const React = require('react');
const { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Animated } = require('react-native');
const { Card, Title, Paragraph, Button, Chip, ActivityIndicator } = require('react-native-paper');
const { useQuery } = require('@tanstack/react-query');
const apiService = require('../../services/api');
const { colors } = require('../../utils/theme');
// Import vector icons
const Icon = require('react-native-vector-icons/MaterialIcons').default;

function LeadsScreen({ onNavigate, onBack }) {
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

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

  // Fetch lead statuses for accurate filtering
  const [leadStatuses, setLeadStatuses] = React.useState<{[leadId: number]: string}>({});
  
  // Fetch lead statuses when leads change
  React.useEffect(() => {
    const fetchLeadStatuses = async () => {
      if (allLeads.length > 0) {
        const statusPromises = allLeads
          .filter((l: any) => l.status === 'purchased')
          .map(async (lead: any) => {
            try {
              const response = await apiService.request('GET', `/api/provider/leads/${lead.requestId}/status`);
              return { leadId: lead.requestId, status: response.status || 'new' };
            } catch (error) {
              console.error(`Failed to fetch status for lead ${lead.requestId}:`, error);
              return { leadId: lead.requestId, status: 'new' };
            }
          });
        
        const statusResults = await Promise.all(statusPromises);
        const statusMap = statusResults.reduce((acc, { leadId, status }) => {
          acc[leadId] = status;
          return acc;
        }, {} as {[leadId: number]: string});
        
        setLeadStatuses(statusMap);
      }
    };

    fetchLeadStatuses();
  }, [allLeads]);

  const getLeadStatus = (leadId: number) => {
    return leadStatuses[leadId] || 'new';
  };

  // Calculate dynamic counts with proper filtering
  const newLeadsCount = allLeads.filter(lead => lead.status === 'pending').length;
  const activeLeadsCount = allLeads.filter(lead => lead.status === 'purchased' && getLeadStatus(lead.requestId) !== 'closed').length;
  const completedLeadsCount = closedLeads.length;

  // Loading state
  const isLoading = leadsLoading || closedLeadsLoading;

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

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetchLeads} />
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
        {/* Modern Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>Leads Overview</Text>
            <Text style={styles.welcomeSubtitle}>Manage your leads and grow your business</Text>
          </View>
          <View style={styles.welcomeIcon}>
            <Icon name="fiber-new" size={32} color="#3B82F6" style={styles.welcomeEmoji} />
          </View>
        </View>

        {/* Modern Stats Grid - 2+1 Layout */}
        <View style={styles.modernStatsContainer}>
          {/* First Row - 2 Cards */}
          <View style={styles.statsRow}>
            <TouchableOpacity 
              style={[styles.modernStatCard, styles.primaryStatCard, styles.halfWidthCard]}
              activeOpacity={0.8}
              onPress={() => onNavigate('newLeads')}
            >
              <View style={styles.statCardHeader}>
                <View style={styles.statIconWrapper}>
                  <Icon name="fiber-new" size={24} color="#3B82F6" style={styles.statIcon} />
                </View>
                <View style={styles.statBadge}>
                  <Text style={styles.statBadgeText}>NEW</Text>
                </View>
              </View>
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={styles.modernStatNumber}>{newLeadsCount}</Text>
              )}
              <Text style={styles.modernStatLabel}>New Leads</Text>
              <Text style={styles.modernStatStatus}>Available to purchase</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modernStatCard, styles.secondaryStatCard, styles.halfWidthCard]}
              activeOpacity={0.8}
              onPress={() => onNavigate('activeLeads')}
            >
              <View style={styles.statCardHeader}>
                <View style={styles.statIconWrapper}>
                  <Icon name="flash-on" size={24} color="#F59E0B" style={styles.statIcon} />
                </View>
                <View style={styles.statBadge}>
                  <Text style={styles.statBadgeText}>ACTIVE</Text>
                </View>
              </View>
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.success} />
              ) : (
                <Text style={styles.modernStatNumber}>{activeLeadsCount}</Text>
              )}
              <Text style={styles.modernStatLabel}>Active Leads</Text>
              <Text style={styles.modernStatStatus}>Currently working on</Text>
            </TouchableOpacity>
          </View>

          {/* Second Row - 1 Card */}
          <TouchableOpacity 
            style={[styles.modernStatCard, styles.tertiaryStatCard, styles.fullWidthCard]}
            activeOpacity={0.8}
            onPress={() => onNavigate('closedLeads')}
          >
            <View style={styles.statCardHeader}>
              <View style={styles.statIconWrapper}>
                <Icon name="check-circle" size={24} color="#10B981" style={styles.statIcon} />
              </View>
              <View style={styles.statBadge}>
                <Text style={styles.statBadgeText}>DONE</Text>
              </View>
            </View>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.warning} />
            ) : (
              <Text style={styles.modernStatNumber}>{completedLeadsCount}</Text>
            )}
            <Text style={styles.modernStatLabel}>Completed</Text>
            <Text style={styles.modernStatStatus}>Successfully closed</Text>
          </TouchableOpacity>
        </View>

        {/* Modern Quick Actions */}
        <View style={styles.modernActionsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <Text style={styles.sectionSubtitle}>Navigate to different lead sections</Text>
          </View>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.modernActionButton}
              activeOpacity={0.8}
              onPress={() => onNavigate('newLeads')}
            >
              <View style={styles.actionIconContainer}>
                <Icon name="fiber-new" size={20} color="#3B82F6" style={styles.actionIcon} />
              </View>
              <Text style={styles.modernActionTitle}>Browse New Leads</Text>
              <Text style={styles.modernActionDescription}>
                View and purchase new leads in your service area
              </Text>
              <View style={styles.actionArrowContainer}>
                <Text style={styles.actionArrow}>→</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modernActionButton}
              activeOpacity={0.8}
              onPress={() => onNavigate('activeLeads')}
            >
              <View style={styles.actionIconContainer}>
                <Icon name="flash-on" size={20} color="#F59E0B" style={styles.actionIcon} />
              </View>
              <Text style={styles.modernActionTitle}>Active Leads</Text>
              <Text style={styles.modernActionDescription}>
                Manage your current projects and progress
              </Text>
              <View style={styles.actionArrowContainer}>
                <Text style={styles.actionArrow}>→</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modernActionButton}
              activeOpacity={0.8}
              onPress={() => onNavigate('closedLeads')}
            >
              <View style={styles.actionIconContainer}>
                <Icon name="check-circle" size={20} color="#10B981" style={styles.actionIcon} />
              </View>
              <Text style={styles.modernActionTitle}>Completed Leads</Text>
              <Text style={styles.modernActionDescription}>
                Review your completed leads and earnings
              </Text>
              <View style={styles.actionArrowContainer}>
                <Text style={styles.actionArrow}>→</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modern Recent Activity */}
        <View style={styles.modernActivityContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <Text style={styles.sectionSubtitle}>Your latest lead activities</Text>
          </View>
          
          <View style={styles.activityCards}>
            <View style={styles.modernActivityCard}>
              <View style={styles.activityItemLeft}>
                <View style={styles.activityIconContainer}>
                  <Icon name="fiber-new" size={16} color="#3B82F6" style={styles.activityIcon} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.modernActivityTitle}>New lead available</Text>
                  <Text style={styles.modernActivityDescription}>Kitchen remodeling in Downtown area</Text>
                  <Text style={styles.modernActivityTime}>2 hours ago</Text>
                </View>
              </View>
              <View style={styles.activityItemRight}>
                <View style={styles.costBadge}>
                  <Text style={styles.costText}>$25</Text>
                </View>
              </View>
            </View>

            <View style={styles.modernActivityCard}>
              <View style={styles.activityItemLeft}>
                <View style={styles.activityIconContainer}>
                  <Icon name="check-circle" size={16} color="#10B981" style={styles.activityIcon} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.modernActivityTitle}>Lead completed</Text>
                  <Text style={styles.modernActivityDescription}>Bathroom renovation project</Text>
                  <Text style={styles.modernActivityTime}>1 day ago</Text>
                </View>
              </View>
              <View style={styles.activityItemRight}>
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>Completed</Text>
                </View>
              </View>
            </View>
          </View>
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
  // Modern Welcome Section
  welcomeSection: {
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
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  welcomeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeEmoji: {
    fontSize: 28,
  },
  // Modern Stats Container
  modernStatsContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidthCard: {
    flex: 1,
  },
  fullWidthCard: {
    width: '100%',
  },
  modernStatCard: {
    padding: 16, // Reduced padding for better fit in grid
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
  },
  primaryStatCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  secondaryStatCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.success + '20',
  },
  tertiaryStatCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.warning + '20',
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12, // Reduced margin for better fit in grid
    width: '100%',
  },
  statIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 20,
  },
  statBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  modernStatNumber: {
    fontSize: 24, // Slightly smaller for better fit in grid
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6, // Reduced margin
    letterSpacing: -1,
    textAlign: 'center',
  },
  modernStatLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  modernStatStatus: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
    textAlign: 'center',
  },
  // Modern Actions Container
  modernActionsContainer: {
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
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  actionsGrid: {
    gap: 12,
  },
  modernActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    justifyContent: 'space-between',
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionIcon: {
    fontSize: 20,
  },
  modernActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    flex: 1,
  },
  modernActionDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    flex: 1,
  },
  actionArrowContainer: {
    marginLeft: 12,
  },
  actionArrow: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  // Modern Activity Container
  modernActivityContainer: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 32,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  activityCards: {
    gap: 12,
  },
  modernActivityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    minHeight: 80,
  },
  activityItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIcon: {
    fontSize: 16,
  },
  activityContent: {
    flex: 1,
    justifyContent: 'center',
  },
  modernActivityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  modernActivityDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  modernActivityTime: {
    fontSize: 11,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  activityItemRight: {
    alignItems: 'flex-end',
  },
  costBadge: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  costText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
  },
  completedBadge: {
    backgroundColor: colors.warning + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  completedText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.warning,
  },
});

module.exports = LeadsScreen;







