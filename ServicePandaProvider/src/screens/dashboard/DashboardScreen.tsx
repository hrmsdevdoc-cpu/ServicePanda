const React = require('react');
const {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  Alert,
} = require('react-native');
const { Card, Title, Paragraph, Button, Chip, ActivityIndicator, IconButton } = require('react-native-paper');
const { useQuery } = require('@tanstack/react-query');
const { useAuth } = require('../../contexts/AuthContext');
const apiService = require('../../services/api');
const { colors } = require('../../utils/theme');

const { width } = Dimensions.get('window');

function DashboardScreen({ onNavigate }) {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [expandedSections, setExpandedSections] = React.useState({
    leads: true,
    settings: true,
  });

  const { data: leads = [], isLoading: leadsLoading, refetch: refetchLeads } = useQuery({
    queryKey: ['/api/provider/leads'],
    queryFn: () => apiService.getLeads(),
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/provider/profile'],
    queryFn: () => apiService.getProfile(),
  });

  const { data: creditBalance, isLoading: creditLoading } = useQuery({
    queryKey: ['/api/provider/credit/balance'],
    queryFn: () => apiService.getCreditBalance(),
  });

  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['/api/provider/activity'],
    queryFn: () => apiService.getActivity(),
  });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchLeads(),
      // Add other refetch calls here
    ]);
    setRefreshing(false);
  }, [refetchLeads]);

  const newLeadsCount = leads.filter(l => l.status === 'pending').length;
  const activeLeadsCount = leads.filter(l => l.status === 'purchased').length;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Function to close sidebar
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Function to handle navigation and close sidebar
  const handleNavigation = (screen) => {
    closeSidebar();
    
    // Call the navigation function passed from parent
    if (onNavigate) {
      onNavigate(screen);
    }
  };

  const getActivityIcon = (activityType) => {
    switch (activityType) {
      case 'lead_purchased':
        return '✅';
      case 'lead_lost':
        return '❌';
      case 'offer_expired':
        return '⏰';
      case 'new_offer':
        return '🎯';
      case 'price_drop':
        return '📉';
      default:
        return '📋';
    }
  };

  const getActivityColor = (activityType) => {
    switch (activityType) {
      case 'lead_purchased':
        return colors.success;
      case 'lead_lost':
        return colors.error;
      case 'offer_expired':
        return colors.warning;
      case 'new_offer':
        return colors.primary;
      case 'price_drop':
        return colors.secondary;
      default:
        return colors.textSecondary;
    }
  };

  // Handle Android back button
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (sidebarOpen) {
        closeSidebar();
        return true; // Prevent default back behavior
      }
      return false; // Allow default back behavior
    });

    return () => backHandler.remove();
  }, [sidebarOpen]);

  if (profileLoading || leadsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setSidebarOpen(!sidebarOpen)}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.logo}>💼</Text>
          <View>
            <Text style={styles.title}>ServicePanda</Text>
            <Text style={styles.subtitle}>Partners</Text>
          </View>
        </View>
      </View>

      {/* Sidebar */}
      {sidebarOpen && (
        <>
          {/* Overlay to close sidebar when clicking outside */}
          <TouchableOpacity 
            style={styles.overlay}
            activeOpacity={1}
            onPress={closeSidebar}
          />
          <View style={styles.sidebar}>
            {/* Sidebar Header with Close Button */}
            <View style={styles.sidebarHeader}>
              <View style={styles.sidebarHeaderTop}>
                <Text style={styles.sidebarLogo}>🐼</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={closeSidebar}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.sidebarTitleContainer}>
                <Text style={styles.sidebarTitle}>ServicePanda</Text>
                <Text style={styles.sidebarSubtitle}>Partners</Text>
              </View>
              {/* Swipe hint */}
              <Text style={styles.swipeHint}>💡 Tap outside or use ✕ to close</Text>
            </View>
            
            <ScrollView style={styles.sidebarContent}>
              {/* Dashboard */}
              <TouchableOpacity 
                style={[styles.sidebarItem, styles.activeItem]}
                onPress={() => handleNavigation('dashboard')}
              >
                <Text style={styles.sidebarIcon}>📊</Text>
                <Text style={[styles.sidebarText, styles.activeText]}>Dashboard</Text>
              </TouchableOpacity>

              {/* Leads Section */}
              <View style={styles.sidebarSection}>
                <TouchableOpacity 
                  style={styles.sidebarSectionHeader}
                  onPress={() => toggleSection('leads')}
                >
                  <Text style={styles.sidebarIcon}>🎯</Text>
                  <Text style={styles.sidebarText}>Leads</Text>
                  <Text style={styles.expandIcon}>
                    {expandedSections.leads ? '▼' : '▶'}
                  </Text>
                </TouchableOpacity>
                
                {expandedSections.leads && (
                  <View style={styles.sidebarSubItems}>
                    <TouchableOpacity
                      style={styles.sidebarSubItem}
                      onPress={() => handleNavigation('leads')}
                    >
                      <Text style={styles.sidebarSubText}>📊 All Leads</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.sidebarSubItem}
                      onPress={() => handleNavigation('newLeads')}
                    >
                      <Text style={styles.sidebarSubText}>🆕 New Leads</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.sidebarSubItem}
                      onPress={() => handleNavigation('activeLeads')}
                    >
                      <Text style={styles.sidebarSubText}>⚡ Active Leads</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.sidebarSubItem}
                      onPress={() => handleNavigation('closedLeads')}
                    >
                      <Text style={styles.sidebarSubText}>✅ Closed Leads</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Settings Section */}
              <View style={styles.sidebarSection}>
                <TouchableOpacity 
                  style={styles.sidebarSectionHeader}
                  onPress={() => toggleSection('settings')}
                >
                  <Text style={styles.sidebarIcon}>⚙️</Text>
                  <Text style={styles.sidebarText}>Settings</Text>
                  <Text style={styles.expandIcon}>
                    {expandedSections.settings ? '▼' : '▶'}
                  </Text>
                </TouchableOpacity>
                
                {expandedSections.settings && (
                  <View style={styles.sidebarSubItems}>
                    <TouchableOpacity 
                      style={styles.sidebarSubItem}
                      onPress={() => handleNavigation('personalDetails')}
                    >
                      <Text style={styles.sidebarSubText}>Personal Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.sidebarSubItem}
                      onPress={() => handleNavigation('services')}
                    >
                      <Text style={styles.sidebarSubText}>Services</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.sidebarSubItem}
                      onPress={() => handleNavigation('services')}
                    >
                      <Text style={styles.sidebarSubText}>Services</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.sidebarSubItem}
                      onPress={() => handleNavigation('documents')}
                    >
                      <Text style={styles.sidebarSubText}>Documents</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Other Menu Items */}
              <TouchableOpacity 
                style={styles.sidebarItem}
                onPress={() => handleNavigation('payment')}
              >
                <Text style={styles.sidebarIcon}>💳</Text>
                <Text style={styles.sidebarText}>Payment</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.sidebarItem}
                onPress={() => handleNavigation('credits')}
              >
                <Text style={styles.sidebarIcon}>🎁</Text>
                <Text style={styles.sidebarText}>Credits</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.sidebarItem}
                onPress={() => handleNavigation('billing')}
              >
                <Text style={styles.sidebarIcon}>💰</Text>
                <Text style={styles.sidebarText}>Billing</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.sidebarItem}
                onPress={() => handleNavigation('help')}
              >
                <Text style={styles.sidebarIcon}>❓</Text>
                <Text style={styles.sidebarText}>Help</Text>
              </TouchableOpacity>

              {/* User Profile */}
              <TouchableOpacity 
                style={styles.userProfile}
                onPress={() => handleNavigation('profile')}
              >
                <Text style={styles.userIcon}>👤</Text>
                <Text style={styles.userName}>
                  {profile?.firstName} {profile?.lastName}
                </Text>
              </TouchableOpacity>

              {/* Logout Button */}
              <TouchableOpacity 
                style={styles.logoutButton}
                onPress={logout}
              >
                <Text style={styles.logoutIcon}>🚪</Text>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </>
      )}

      {/* Main Content */}
      <ScrollView
        style={styles.mainContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Dashboard Header */}
        <View style={styles.dashboardHeader}>
          <Title style={styles.dashboardTitle}>Dashboard</Title>
          <Paragraph style={styles.dashboardSubtitle}>
            Overview of your provider activities
          </Paragraph>
        </View>

        {/* Status Alert */}
        {profile?.status === 'pending' && (
          <Card style={[styles.alertCard, { backgroundColor: colors.warning + '20' }]}>
            <Card.Content style={styles.alertContent}>
              <Text style={styles.alertIcon}>⏰</Text>
              <View style={styles.alertText}>
                <Title style={styles.alertTitle}>Application Under Review</Title>
                <Paragraph style={styles.alertDescription}>
                  Your provider application is currently being reviewed by our team. You'll receive an email once approved.
                </Paragraph>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Key Metrics - 2x2 Grid Layout */}
        <View style={styles.statsContainer}>
          {/* Row 1: New Leads & Active Leads */}
          <View style={styles.metricsRow}>
            <Card style={styles.metricCard}>
              <Card.Content style={styles.metricContent}>
                <View style={styles.metricHeader}>
                  <View style={styles.metricIconContainer}>
                    <Text style={styles.metricIcon}>🔔</Text>
                  </View>
                  <Text style={styles.metricStatus}>New Leads Available</Text>
                </View>
                <Text style={styles.metricNumber}>{newLeadsCount}</Text>
                <Text style={styles.metricLabel}>New Leads</Text>
                <View style={styles.metricTrend}>
                  <Text style={styles.trendText}>📈 +12% this week</Text>
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.metricCard}>
              <Card.Content style={styles.metricContent}>
                <View style={styles.metricHeader}>
                  <View style={styles.metricIconContainer}>
                    <Text style={styles.metricIcon}>🎯</Text>
                  </View>
                  <Text style={styles.metricStatus}>Currently Working</Text>
                </View>
                <Text style={styles.metricNumber}>{activeLeadsCount}</Text>
                <Text style={styles.metricLabel}>Active Leads</Text>
                <View style={styles.metricTrend}>
                  <Text style={styles.trendText}>⚡ 3 in progress</Text>
                </View>
              </Card.Content>
            </Card>
          </View>

          {/* Row 2: Credit Balance & Rating */}
          <View style={styles.metricsRow}>
            <Card style={styles.metricCard}>
              <Card.Content style={styles.metricContent}>
                <View style={styles.metricHeader}>
                  <View style={[styles.metricIconContainer, styles.creditIconContainer]}>
                    <Text style={styles.metricIcon}>💰</Text>
                  </View>
                  <Text style={styles.metricStatus}>Available Credit</Text>
                </View>
                <Text style={styles.metricNumber}>
                  ${creditBalance?.balance || '0.00'}
                </Text>
                <Text style={styles.metricLabel}>Credit Balance</Text>
                <View style={styles.metricAction}>
                  <Text style={styles.actionText}>💳 Add Credit</Text>
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.metricCard}>
              <Card.Content style={styles.metricContent}>
                <View style={styles.metricHeader}>
                  <View style={[styles.metricIconContainer, styles.ratingIconContainer]}>
                    <Text style={styles.metricIcon}>⭐</Text>
                  </View>
                  <Text style={styles.metricStatus}>Customer Rating</Text>
                </View>
                <Text style={styles.metricNumber}>
                  {profile?.rating || '5.0'}
                </Text>
                <Text style={styles.metricLabel}>Average Rating</Text>
                <View style={styles.metricAction}>
                  <Text style={styles.actionText}>
                    {profile?.totalReviews ? 
                      `👥 ${profile.totalReviews} reviews` : 
                      '📝 No reviews yet'
                    }
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityIcon}>🔔</Text>
            <Title style={styles.activityTitle}>Recent Activity</Title>
          </View>
            
            {activitiesLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading recent activity...</Text>
              </View>
            ) : activities.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🔔</Text>
                <Title style={styles.emptyTitle}>No recent activity</Title>
                <Paragraph style={styles.emptyDescription}>
                  Your lead activity and notifications will appear here.
                </Paragraph>
              </View>
            ) : (
              <View style={styles.activitiesContainer}>
                {activities.slice(0, 10).map((activity, index) => (
                  <View key={activity.id || index} style={styles.activityItem}>
                    <View style={styles.activityItemHeader}>
                      <Chip
                        mode="outlined"
                        style={[styles.activityChip, { borderColor: getActivityColor(activity.activityType) }]}
                        textStyle={{ color: getActivityColor(activity.activityType) }}
                      >
                        {getActivityIcon(activity.activityType)} {activity.activityType.replace('_', ' ').toUpperCase()}
                      </Chip>
                      <Text style={styles.activityTime}>
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </Text>
                    </View>
                    
                    <Paragraph style={styles.activityMessage}>
                      {activity.message}
                    </Paragraph>
                    
                    {activity.description && (
                      <Paragraph style={styles.activityDescription}>
                        {activity.description}
                      </Paragraph>
                    )}
                    
                    {activity.activityType === 'new_offer' && activity.leadCost && (
                      <Chip
                        mode="outlined"
                        style={[styles.costChip, { borderColor: colors.success }]}
                        textStyle={{ color: colors.success }}
                      >
                        ${activity.leadCost}
                      </Chip>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
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
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuButton: {
    padding: 8,
    marginRight: 12,
  },
  menuIcon: {
    fontSize: 24,
    color: colors.text,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.8,
    height: '100%',
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    zIndex: 1000,
    elevation: 5,
  },
  sidebarHeader: {
    padding: 16,
    paddingTop: 32, // Better top padding
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100, // Reduced height for better proportions
  },
  sidebarHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  closeButton: {
    padding: 8,
    marginLeft: 'auto', // Push to right side
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  sidebarLogo: {
    fontSize: 32, // Slightly smaller for better balance
    color: '#3B82F6',
    textAlign: 'center',
    marginBottom: 8, // Reduced margin
  },
  sidebarTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  sidebarTitle: {
    fontSize: 20, // Better proportion
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4, // Reduced margin
    textAlign: 'center',
  },
  sidebarSubtitle: {
    fontSize: 14, // Better proportion
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8, // Add bottom margin
  },
  sidebarContent: {
    flex: 1,
    paddingTop: 16, // Reduced since we now have a proper header
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  activeItem: {
    backgroundColor: colors.primary + '20',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  sidebarIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: 'center', // Center the emoji icons
  },
  sidebarText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
    fontWeight: '500', // Slightly bolder for better readability
  },
  activeText: {
    color: colors.primary,
    fontWeight: '600',
  },
  sidebarSection: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginBottom: 4, // Add spacing between sections
  },
  sidebarSectionHeader: { // Renamed to avoid conflict
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background + '50', // Slight background difference
    borderBottomWidth: 0.5, // Subtle border
    borderBottomColor: colors.borderLight,
  },
  expandIcon: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 'auto', // Push to right side
    fontWeight: 'bold', // Make arrow more visible
  },
  sidebarSubItems: {
    backgroundColor: colors.background,
    paddingLeft: 8, // Slight indentation
  },
  sidebarSubItem: {
    padding: 12,
    paddingLeft: 52,
    borderBottomWidth: 0.5, // Thinner border
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.surface + '30', // Very subtle background
  },
  sidebarSubText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background + '30', // Slight background difference
  },
  userIcon: {
    fontSize: 20,
    marginRight: 12,
    textAlign: 'center', // Center the emoji
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1, // Take remaining space
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.error + '10', // Light red background
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 12,
    textAlign: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error, // Red text for logout
  },
  mainContent: {
    flex: 1,
    paddingBottom: 80, // Add padding to prevent content from being hidden behind footer
  },
  dashboardHeader: {
    padding: 24,
    paddingBottom: 16,
  },
  dashboardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  dashboardSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  alertCard: {
    margin: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 4,
  },
  alertText: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsContainer: {
    padding: 16,
    gap: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  metricCard: {
    flex: 1,
    elevation: 3,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  metricContent: {
    alignItems: 'center',
    padding: 20,
    minHeight: 140,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricIcon: {
    fontSize: 24,
    color: colors.primary,
  },
  metricStatus: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
  },
  metricNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  metricTrend: {
    backgroundColor: colors.success + '10',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  trendText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
  },
  metricAction: {
    backgroundColor: colors.primary + '10',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 12,
  },
  actionText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  secondaryMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  secondaryMetricCard: {
    flex: 1,
    elevation: 2,
  },
  secondaryMetricContent: {
    alignItems: 'center',
    padding: 16,
  },
  secondaryMetricNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  secondaryMetricLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
  },
  quickActionCard: {
    flex: 1,
    elevation: 2,
  },
  quickActionContent: {
    alignItems: 'center',
    padding: 16,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
    color: colors.primary,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  activitySection: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  activityCard: {
    margin: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: colors.text,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  activitiesContainer: {
    gap: 12,
  },
  activityItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  activityItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityChip: {
    height: 24,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  activityMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  costChip: {
    alignSelf: 'flex-start',
    height: 24,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
  },
  swipeHint: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  creditIconContainer: {
    backgroundColor: colors.success + '10',
  },
  ratingIconContainer: {
    backgroundColor: colors.warning + '10',
  },
  successIconContainer: {
    backgroundColor: colors.success + '10',
  },
});

module.exports = DashboardScreen;

