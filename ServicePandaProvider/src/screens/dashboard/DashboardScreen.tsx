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
  Animated,
  LinearGradient,
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

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  
  // Sidebar animation values
  const sidebarSlideAnim = React.useRef(new Animated.Value(-width * 0.75)).current;
  const sidebarFadeAnim = React.useRef(new Animated.Value(0)).current;
  const overlayFadeAnim = React.useRef(new Animated.Value(0)).current;

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

  // Fetch lead statuses for accurate filtering
  const [leadStatuses, setLeadStatuses] = React.useState<{[leadId: number]: string}>({});
  
  // Fetch lead statuses when leads change
  React.useEffect(() => {
    const fetchLeadStatuses = async () => {
      if (leads.length > 0) {
        const statusPromises = leads
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
  }, [leads]);

  const getLeadStatus = (leadId: number) => {
    return leadStatuses[leadId] || 'new';
  };

  const newLeadsCount = leads.filter(l => l.status === 'pending').length;
  const activeLeadsCount = leads.filter(l => l.status === 'purchased' && getLeadStatus(l.requestId) !== 'closed').length;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Function to close sidebar
  const closeSidebar = () => {
    Animated.parallel([
      Animated.timing(sidebarSlideAnim, {
        toValue: -width * 0.75,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(sidebarFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSidebarOpen(false);
    });
  };

  // Function to open sidebar
  const openSidebar = () => {
    setSidebarOpen(true);
    Animated.parallel([
      Animated.spring(sidebarSlideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(sidebarFadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
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
          onPress={openSidebar}
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
          size={20}
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
          <Animated.View 
            style={[
              styles.overlay,
              {
                opacity: overlayFadeAnim,
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.overlayTouchable}
              activeOpacity={1}
              onPress={closeSidebar}
            />
          </Animated.View>
          <Animated.View 
            style={[
              styles.sidebar,
              {
                transform: [{ translateX: sidebarSlideAnim }],
                opacity: sidebarFadeAnim,
              }
            ]}
          >
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
                style={styles.sidebarItem}
                onPress={() => handleNavigation('profile')}
              >
                <Text style={styles.sidebarIcon}>👤</Text>
                <Text style={styles.sidebarText}>
                  {profile?.firstName} {profile?.lastName}
                </Text>
              </TouchableOpacity>

              {/* Logout Button */}
              <TouchableOpacity 
                style={[styles.sidebarItem, styles.logoutItem]}
                onPress={logout}
              >
                <Text style={styles.sidebarIcon}>🚪</Text>
                <Text style={[styles.sidebarText, styles.logoutText]}>Logout</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </>
      )}

      {/* Main Content */}
      <ScrollView
        style={styles.mainContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
              <Text style={styles.welcomeGreeting}>Welcome back!</Text>
              <Text style={styles.welcomeName}>
                {profile?.firstName || 'Provider'}
              </Text>
              <Text style={styles.welcomeSubtext}>
                Here's what's happening with your business today
              </Text>
            </View>
            <View style={styles.welcomeIcon}>
              <Text style={styles.welcomeEmoji}>👋</Text>
            </View>
          </View>

        {/* Status Alert */}
        {profile?.status === 'pending' && (
          <View style={styles.modernAlertCard}>
            <View style={styles.alertIconContainer}>
              <Text style={styles.alertIcon}>⏰</Text>
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Application Under Review</Text>
              <Text style={styles.alertDescription}>
                Your provider application is currently being reviewed by our team. You'll receive an email once approved.
              </Text>
            </View>
          </View>
        )}

        {/* Modern Metrics Grid */}
        <View style={styles.modernStatsContainer}>
          {/* Top Row - Main Metrics */}
          <View style={styles.metricsRow}>
            <TouchableOpacity 
              style={[styles.modernMetricCard, styles.primaryMetricCard]}
              activeOpacity={0.8}
              onPress={() => handleNavigation('newLeads')}
            >
              <View style={styles.metricCardHeader}>
                <View style={styles.metricIconWrapper}>
                  <Text style={styles.metricIcon}>🎯</Text>
                </View>
                <View style={styles.metricBadge}>
                  <Text style={styles.metricBadgeText}>NEW</Text>
                </View>
              </View>
              <Text style={styles.modernMetricNumber}>{newLeadsCount}</Text>
              <Text style={styles.modernMetricLabel}>New Leads Available</Text>
              <View style={styles.metricTrendContainer}>
                <Text style={styles.trendIcon}>📈</Text>
                <Text style={styles.trendText}>+12% this week</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modernMetricCard, styles.secondaryMetricCard]}
              activeOpacity={0.8}
              onPress={() => handleNavigation('activeLeads')}
            >
              <View style={styles.metricCardHeader}>
                <View style={styles.metricIconWrapper}>
                  <Text style={styles.metricIcon}>⚡</Text>
                </View>
                <View style={styles.metricBadge}>
                  <Text style={styles.metricBadgeText}>ACTIVE</Text>
                </View>
              </View>
              <Text style={styles.modernMetricNumber}>{activeLeadsCount}</Text>
              <Text style={styles.modernMetricLabel}>Active Leads</Text>
              <View style={styles.metricTrendContainer}>
                <Text style={styles.trendIcon}>🔥</Text>
                <Text style={styles.trendText}>3 in progress</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Bottom Row - Secondary Metrics */}
          <View style={styles.metricsRow}>
            <TouchableOpacity 
              style={[styles.modernMetricCard, styles.tertiaryMetricCard]}
              activeOpacity={0.8}
              onPress={() => handleNavigation('credits')}
            >
              <View style={styles.metricCardHeader}>
                <View style={styles.metricIconWrapper}>
                  <Text style={styles.metricIcon}>💰</Text>
                </View>
                <View style={styles.addCreditButton}>
                  <Text style={styles.addCreditText}>+</Text>
                </View>
              </View>
              <Text style={styles.modernMetricNumber}>
                ${creditBalance?.balance || '0.00'}
              </Text>
              <Text style={styles.modernMetricLabel}>Credit Balance</Text>
              <View style={styles.metricTrendContainer}>
                <Text style={styles.trendIcon}>💳</Text>
                <Text style={styles.trendText}>Add credit</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modernMetricCard, styles.quaternaryMetricCard]}
              activeOpacity={0.8}
              onPress={() => handleNavigation('profile')}
            >
              <View style={styles.metricCardHeader}>
                <View style={styles.metricIconWrapper}>
                  <Text style={styles.metricIcon}>⭐</Text>
                </View>
                <View style={styles.ratingStars}>
                  <Text style={styles.starIcon}>⭐</Text>
                  <Text style={styles.starIcon}>⭐</Text>
                  <Text style={styles.starIcon}>⭐</Text>
                  <Text style={styles.starIcon}>⭐</Text>
                  <Text style={styles.starIcon}>⭐</Text>
                </View>
              </View>
              <Text style={styles.modernMetricNumber}>
                {profile?.rating || '5.0'}
              </Text>
              <Text style={styles.modernMetricLabel}>Customer Rating</Text>
              <View style={styles.metricTrendContainer}>
                <Text style={styles.trendIcon}>👥</Text>
                <Text style={styles.trendText}>
                  {profile?.totalReviews ? 
                    `${profile.totalReviews} reviews` : 
                    'No reviews yet'
                  }
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modern Activity Section */}
        <View style={styles.modernActivitySection}>
          <View style={styles.modernActivityHeader}>
            <View style={styles.activityHeaderLeft}>
              <View style={styles.activityIconContainer}>
                <Text style={styles.activityIcon}>🔔</Text>
              </View>
              <View>
                <Text style={styles.modernActivityTitle}>Recent Activity</Text>
                <Text style={styles.modernActivitySubtitle}>Stay updated with your latest activities</Text>
              </View>
            </View>
            {/* <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => handleNavigation('leads')}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Text style={styles.viewAllArrow}>→</Text>
            </TouchableOpacity> */}
          </View>
            
          {activitiesLoading ? (
            <View style={styles.modernLoadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.modernLoadingText}>Loading recent activity...</Text>
            </View>
          ) : activities.length === 0 ? (
            <View style={styles.modernEmptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Text style={styles.emptyIcon}>🔔</Text>
              </View>
              <Text style={styles.modernEmptyTitle}>No recent activity</Text>
              <Text style={styles.modernEmptyDescription}>
                Your lead activity and notifications will appear here.
              </Text>
              <TouchableOpacity 
                style={styles.exploreButton}
                onPress={() => handleNavigation('leads')}
              >
                <Text style={styles.exploreButtonText}>Explore Leads</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.modernActivitiesContainer}>
              {activities.slice(0, 5).map((activity, index) => (
                <View key={activity.id || index} style={styles.modernActivityItem}>
                  <View style={styles.activityItemLeft}>
                    <View style={[styles.activityTypeIcon, { backgroundColor: getActivityColor(activity.activityType) + '20' }]}>
                      <Text style={styles.activityTypeEmoji}>{getActivityIcon(activity.activityType)}</Text>
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={styles.modernActivityMessage} numberOfLines={2}>
                        {activity.message}
                      </Text>
                      {activity.description && (
                        <Text style={styles.modernActivityDescription} numberOfLines={1}>
                          {activity.description}
                        </Text>
                      )}
                      <Text style={styles.modernActivityTime}>
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.activityItemRight}>
                    <View style={[styles.activityTypeBadge, { backgroundColor: getActivityColor(activity.activityType) }]}>
                      <Text style={styles.activityTypeText}>
                        {activity.activityType.replace('_', ' ').toUpperCase()}
                      </Text>
                    </View>
                    {activity.activityType === 'new_offer' && activity.leadCost && (
                      <View style={styles.costBadge}>
                        <Text style={styles.costText}>${activity.leadCost}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
        </Animated.View>
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
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  menuButton: {
    padding: 12,
    marginRight: 8,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  menuIcon: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: '600',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    fontSize: 28,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  overlayTouchable: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.75,
    height: '100%',
    backgroundColor: '#ffffff',
    borderRightWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    zIndex: 1000,
  },
  sidebarHeader: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 24,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    minHeight: Platform.OS === 'ios' ? 100 : 80,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  sidebarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  closeButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '700',
  },
  sidebarLogo: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
    letterSpacing: -0.3,
    marginLeft: 12,
  },
  sidebarContent: {
    flex: 1,
    paddingTop: 8,
    backgroundColor: '#fafbfc',
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activeItem: {
    backgroundColor: colors.primary + '15',
    borderWidth: 2,
    borderColor: colors.primary + '30',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  sidebarIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  sidebarText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  activeText: {
    color: colors.primary,
    fontWeight: '700',
  },
  logoutItem: {
    backgroundColor: colors.error + '15',
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  sidebarSection: {
    marginBottom: 8,
  },
  sidebarSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  expandIcon: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 'auto',
    fontWeight: '700',
  },
  sidebarSubItems: {
    marginTop: 4,
    marginHorizontal: 12,
  },
  sidebarSubItem: {
    padding: 14,
    paddingLeft: 48,
    marginVertical: 2,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  sidebarSubText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  logoutText: {
    color: colors.error,
    fontWeight: '700',
  },
  mainContent: {
    flex: 1,
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
  welcomeGreeting: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  welcomeName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  welcomeSubtext: {
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
  // Modern Alert Card
  modernAlertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.warning + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertIcon: {
    fontSize: 20,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  // Modern Stats Container
  modernStatsContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  modernMetricCard: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryMetricCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  secondaryMetricCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.success + '20',
  },
  tertiaryMetricCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.warning + '20',
  },
  quaternaryMetricCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.info + '20',
  },
  metricCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricIcon: {
    fontSize: 20,
  },
  metricBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metricBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  modernMetricNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -1,
  },
  modernMetricLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  metricTrendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  trendIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  addCreditButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCreditText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
  },
  starIcon: {
    fontSize: 12,
  },
  // Modern Activity Section
  modernActivitySection: {
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
  modernActivityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  activityHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIcon: {
    fontSize: 20,
  },
  modernActivityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  modernActivitySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 4,
  },
  viewAllArrow: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  modernLoadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  modernLoadingText: {
    marginTop: 16,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  modernEmptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.textSecondary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 32,
    opacity: 0.6,
  },
  modernEmptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  modernEmptyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  modernActivitiesContainer: {
    gap: 12,
  },
  modernActivityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  activityItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityTypeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityTypeEmoji: {
    fontSize: 16,
  },
  activityContent: {
    flex: 1,
  },
  modernActivityMessage: {
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
  activityTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  activityTypeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
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
});

module.exports = DashboardScreen;


