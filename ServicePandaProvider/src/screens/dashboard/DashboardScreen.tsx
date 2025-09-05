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
  StatusBar,
  Platform,
} = require('react-native');
const { Card, Title, Paragraph, Button, Chip, ActivityIndicator, IconButton } = require('react-native-paper');
const { useQuery } = require('@tanstack/react-query');
const { useAuth } = require('../../contexts/AuthContext');
const apiService = require('../../services/api');
const { colors } = require('../../utils/theme');
const NotificationIcon = require('../../components/NotificationIcon');
const NotificationList = require('../../components/NotificationList');
const notificationService = require('../../services/notifications');

const { width } = Dimensions.get('window');

function DashboardScreen({ onNavigate }) {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [expandedSections, setExpandedSections] = React.useState({
    leads: true,
    settings: true,
  });
  
  // Notification state
  const [notificationsVisible, setNotificationsVisible] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);
  const [notificationsLoading, setNotificationsLoading] = React.useState(false);

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
      // Refresh notifications
      (async () => {
        try {
          const fetchedNotifications = await notificationService.getNotifications();
          setNotifications(fetchedNotifications);
        } catch (error) {
          console.error('Error refreshing notifications:', error);
        }
      })(),
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

  // Notification handlers
  const handleNotificationPress = async (notification) => {
    try {
      // Mark notification as read via service
      await notificationService.markAsRead(notification.id);
      
      // Refresh notifications to get updated read status
      const updatedNotifications = await notificationService.getNotifications();
      setNotifications(updatedNotifications);
      
      // Close notification list
      setNotificationsVisible(false);
      
      // Handle navigation based on notification type
      if (notification.category === 'lead') {
        handleNavigation('leads');
      } else if (notification.category === 'payment') {
        handleNavigation('payment');
      }
    } catch (error) {
      console.error('Error handling notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      console.log('Marking all notifications as read...');
      
      // Mark all as read via service
      await notificationService.markAllAsRead();
      
      // Refresh notifications to get updated read status
      const updatedNotifications = await notificationService.getNotifications();
      console.log('Updated notifications:', updatedNotifications.map(n => ({ id: n.id, isRead: n.isRead })));
      
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  // Fetch notifications on component mount and when activities change
  React.useEffect(() => {
    const fetchNotifications = async () => {
      setNotificationsLoading(true);
      try {
        const fetchedNotifications = await notificationService.getNotifications();
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setNotificationsLoading(false);
      }
    };

    fetchNotifications();
  }, [activities]); // Re-fetch notifications when activities change

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
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
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
        <NotificationIcon
          unreadCount={unreadNotificationsCount}
          onPress={() => setNotificationsVisible(true)}
          size={24}
          latestNotification={notifications.length > 0 ? {
            title: notifications[0].title,
            message: notifications[0].message,
            timestamp: notifications[0].timestamp
          } : undefined}
        />
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
              <View style={styles.sidebarHeaderRow}>
                <Text style={styles.sidebarLogo}>🐼</Text>
                <Text style={styles.sidebarTitle}>ServicePanda</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={closeSidebar}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
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
                      onPress={() => handleNavigation('serviceArea')}
                    >
                      <Text style={styles.sidebarSubText}>Services Area</Text>
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
        {/* <View style={styles.dashboardHeader}>
          <Title style={styles.dashboardTitle}>Dashboard</Title>
          <Paragraph style={styles.dashboardSubtitle}>
            Overview of your provider activities
          </Paragraph>
        </View> */}

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
                    <Text style={styles.metricIcon}>🎯</Text>
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
                  <TouchableOpacity onPress={() => handleNavigation('credits')}>
                    <Text style={styles.actionText}>💳 Add Credit</Text>
                  </TouchableOpacity>
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
                    <View style={styles.activityChipContainer}>
                      <Chip
                        mode="outlined"
                        style={[styles.activityChip, { borderColor: getActivityColor(activity.activityType) }]}
                        textStyle={[styles.activityChipText, { color: getActivityColor(activity.activityType) }]}
                      >
                        {getActivityIcon(activity.activityType)} {activity.activityType.replace('_', ' ').toUpperCase()}
                      </Chip>
                    </View>
                    
                    <Paragraph style={styles.activityMessage} numberOfLines={3}>
                      {activity.message}
                    </Paragraph>
                    
                    <View style={styles.descriptionRow}>
                      {activity.description && (
                        <Paragraph style={styles.activityDescription} numberOfLines={2}>
                          {activity.description}
                        </Paragraph>
                      )}
                      
                      <Text style={styles.activityTime}>
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </Text>
                    </View>
                    
                    {activity.activityType === 'new_offer' && activity.leadCost && (
                      <View style={styles.costChipContainer}>
                        <Chip
                          mode="outlined"
                          style={[styles.costChip, { borderColor: colors.success }]}
                          textStyle={[styles.costChipText, { color: colors.success }]}
                        >
                          ${activity.leadCost}
                        </Chip>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
      </ScrollView>

      {/* Notification List Modal */}
      <NotificationList
        visible={notificationsVisible}
        notifications={notifications}
        onClose={() => setNotificationsVisible(false)}
        onNotificationPress={handleNotificationPress}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
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
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 16, // Only add extra padding for iOS
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 1000,
    elevation: 5,
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
    flex: 1,
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
    width: width * 0.7,
    height: '100%',
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    zIndex: 1000,
    elevation: 5,
  },
  sidebarHeader: {
    padding: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 12, // Only add extra padding for iOS
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    minHeight: Platform.OS === 'ios' ? 86 : 50, // Adjust minHeight based on platform
  },
  sidebarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  sidebarLogo: {
    fontSize: 22,
    color: '#3B82F6',
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  sidebarContent: {
    flex: 1,
    paddingTop: 0, // Reduced since we now have a proper header
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  activeItem: {
    backgroundColor: colors.primary + '20',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  sidebarIcon: {
    fontSize: 18,
    marginRight: 10,
    width: 20,
    textAlign: 'center', // Center the emoji icons
  },
  sidebarText: {
    fontSize: 14,
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
    padding: 12,
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
    padding: 10,
    paddingLeft: 42,
    borderBottomWidth: 0.5, // Thinner border
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.surface + '30', // Very subtle background
  },
  sidebarSubText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background + '30', // Slight background difference
  },
  userIcon: {
    fontSize: 18,
    marginRight: 10,
    textAlign: 'center', // Center the emoji
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    flex: 1, // Take remaining space
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.error + '10', // Light red background
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 10,
    textAlign: 'center',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error, // Red text for logout
  },
  mainContent: {
    flex: 1,
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
    padding: 16,
    minHeight: 120,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricIcon: {
    fontSize: 18,
    color: colors.primary,
  },
  metricStatus: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  metricNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
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
    fontSize: 11,
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
    fontSize: 12,
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
    padding: 12,
  },
  secondaryMetricNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  secondaryMetricLabel: {
    fontSize: 13,
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
    // gap is now handled by individual item marginBottom
  },
  activityItem: {
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 8,
    backgroundColor: colors.surface,
    marginBottom: 8,
  },
  // activityItemHeader style removed - no longer needed
  activityChipContainer: {
    width: '100%',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  activityChip: {
    height: 'auto',
    minHeight: 32,
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '100%',
    alignSelf: 'stretch',
  },
  activityChipText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    flexShrink: 0,
    flexWrap: 'wrap',
  },
  activityTime: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
    alignSelf: 'flex-end',
    flexShrink: 0,
  },
  activityMessage: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
    flexShrink: 1,
  },
  descriptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  activityDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    flexShrink: 1,
    flex: 1,
    marginRight: 12,
  },
  costChipContainer: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  costChip: {
    height: 'auto',
    minHeight: 24,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  costChipText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
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

