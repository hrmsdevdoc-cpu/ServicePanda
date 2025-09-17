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
} = require('react-native');
// Fallback LinearGradient component that doesn't require native linking
const LinearGradient = ({ colors, start, end, style, children, ...props }) => {
  // Create a simple gradient effect using multiple Views
  const gradientStyle = {
    backgroundColor: colors[0],
    ...style,
  };
  
  return (
    <View style={gradientStyle} {...props}>
      {children}
    </View>
  );
};
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
      <View style={styles.dashboardLoadingContainer}>
        <View style={styles.pandaContainer}>
          <View style={styles.pandaFace}>
            <Text style={styles.pandaEmoji}>🐼</Text>
          </View>
          <View style={styles.loadingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </View>
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      {/* Enhanced Header with Gradient */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={openSidebar}
            >
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
            <View style={styles.headerMainContent}>
              <View style={styles.logoContainer}>
                <Text style={styles.logo}>💼</Text>
                <View style={styles.logoGlow} />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>ServicePanda</Text>
                <Text style={styles.subtitle}>Partners</Text>
              </View>
            </View>
            <View style={styles.notificationContainer}>
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
          </View>
        </LinearGradient>
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
              {/* Background Patterns */}
              <View style={styles.sidebarHeaderPattern} />
              <View style={styles.sidebarHeaderPattern2} />
              
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
              {/* User Profile Section */}
              <View style={styles.userProfileSection}>
                <View style={styles.userAvatarContainer}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>
                      {profile?.firstName?.charAt(0) || 'P'}
                    </Text>
                  </View>
                  <View style={styles.userStatusIndicator} />
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {profile?.firstName || 'Provider'}
                  </Text>
                  <Text style={styles.userRole}>Service Provider</Text>
                </View>
              </View>

              {/* Dashboard */}
              <TouchableOpacity 
                style={[styles.sidebarItem, styles.activeItem]}
                onPress={() => handleNavigation('dashboard')}
                activeOpacity={0.7}
              >
                <Text style={styles.sidebarIcon}>📊</Text>
                <Text style={[styles.sidebarText, styles.activeText]}>Dashboard</Text>
                {/* <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>3</Text>
                </View> */}
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
                      <Text style={styles.sidebarSubIcon}>📊</Text>
                      <Text style={styles.sidebarSubText}>All Leads</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.sidebarSubItem}
                      onPress={() => handleNavigation('newLeads')}
                    >
                      <Text style={styles.sidebarSubIcon}>🆕</Text>
                      <Text style={styles.sidebarSubText}>New Leads</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.sidebarSubItem}
                      onPress={() => handleNavigation('activeLeads')}
                    >
                      <Text style={styles.sidebarSubIcon}>⚡</Text>
                      <Text style={styles.sidebarSubText}>Active Leads</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.sidebarSubItem}
                      onPress={() => handleNavigation('closedLeads')}
                    >
                      <Text style={styles.sidebarSubIcon}>✅</Text>
                      <Text style={styles.sidebarSubText}>Closed Leads</Text>
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
                      <Text style={styles.sidebarSubIcon}>👤</Text>
                      <Text style={styles.sidebarSubText}>Personal Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.sidebarSubItem}
                      onPress={() => handleNavigation('services')}
                    >
                      <Text style={styles.sidebarSubIcon}>🔧</Text>
                      <Text style={styles.sidebarSubText}>Services</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.sidebarSubItem}
                      onPress={() => handleNavigation('serviceArea')}
                    >
                      <Text style={styles.sidebarSubIcon}>📍</Text>
                      <Text style={styles.sidebarSubText}>Service Area</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.sidebarSubItem}
                      onPress={() => handleNavigation('documents')}
                    >
                      <Text style={styles.sidebarSubIcon}>📄</Text>
                      <Text style={styles.sidebarSubText}>Documents</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Other Menu Items */}
              <View style={styles.sidebarSection}>
                <TouchableOpacity 
                  style={styles.sidebarItem}
                  onPress={() => handleNavigation('payment')}
                >
                  <Text style={styles.sidebarIcon}>💳</Text>
                  <Text style={styles.sidebarText}>Payment</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.sidebarSection}>
                <TouchableOpacity 
                  style={styles.sidebarItem}
                  onPress={() => handleNavigation('credits')}
                >
                  <Text style={styles.sidebarIcon}>🎁</Text>
                  <Text style={styles.sidebarText}>Credits</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.sidebarSection}>
                <TouchableOpacity 
                  style={styles.sidebarItem}
                  onPress={() => handleNavigation('billing')}
                >
                  <Text style={styles.sidebarIcon}>💰</Text>
                  <Text style={styles.sidebarText}>Billing</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.sidebarSection}>
                <TouchableOpacity 
                  style={styles.sidebarItem}
                  onPress={() => handleNavigation('help')}
                >
                  <Text style={styles.sidebarIcon}>❓</Text>
                  <Text style={styles.sidebarText}>Help</Text>
                </TouchableOpacity>
              </View>

              {/* User Profile */}
              <View style={styles.sidebarSection}>
                <TouchableOpacity 
                  style={styles.sidebarItem}
                  onPress={() => handleNavigation('profile')}
                >
                  <Text style={styles.sidebarIcon}>👤</Text>
                  <Text style={styles.sidebarText}>
                    {profile?.firstName} {profile?.lastName}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Logout Button */}
              <View style={styles.sidebarSection}>
                <TouchableOpacity 
                  style={[styles.sidebarItem, styles.logoutItem]}
                  onPress={logout}
                  activeOpacity={0.7}
                >
                  <Text style={styles.sidebarIcon}>🚪</Text>
                  <Text style={[styles.sidebarText, styles.logoutText]}>Logout</Text>
                </TouchableOpacity>
              </View>

              {/* Sidebar Footer */}
              <View style={styles.sidebarFooter}>
                <View style={styles.footerDivider} />
                <View style={styles.footerContent}>
                  <Text style={styles.footerText}>ServicePanda v2.0</Text>
                  <Text style={styles.footerSubtext}>Made with ❤️</Text>
                </View>
              </View>
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
          {/* Enhanced Welcome Section with Glassmorphism */}
          <View style={styles.welcomeSection}>
            <LinearGradient
              colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
              style={styles.welcomeGradient}
            >
              <View style={styles.welcomeContent}>
                <View style={styles.welcomeTextContainer}>
                  <Text style={styles.welcomeGreeting}>Welcome back!</Text>
                  <Text style={styles.welcomeName}>
                    {profile?.firstName || 'Provider'}
                  </Text>
                  <Text style={styles.welcomeSubtext}>
                    Here's what's happening with your business today
                  </Text>
                </View>
                <View style={styles.welcomeIconContainer}>
                  <View style={styles.welcomeIconGlow} />
                  <Text style={styles.welcomeEmoji}>👋</Text>
                </View>
              </View>
            </LinearGradient>
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

        {/* Enhanced Metrics Grid with Glassmorphism */}
        <View style={styles.modernStatsContainer}>
          {/* Top Row - Main Metrics */}
          <View style={styles.metricsRow}>
            <TouchableOpacity 
              style={[styles.modernMetricCard, styles.primaryMetricCard]}
              activeOpacity={0.8}
              onPress={() => handleNavigation('newLeads')}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                style={styles.metricCardGradient}
              >
                <View style={styles.metricCardHeader}>
                  <View style={styles.metricIconWrapper}>
                    <Text style={styles.metricIcon}>🎯</Text>
                    <View style={styles.metricIconGlow} />
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
                <View style={styles.metricCardPattern} />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modernMetricCard, styles.secondaryMetricCard]}
              activeOpacity={0.8}
              onPress={() => handleNavigation('activeLeads')}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                style={styles.metricCardGradient}
              >
                <View style={styles.metricCardHeader}>
                  <View style={styles.metricIconWrapper}>
                    <Text style={styles.metricIcon}>⚡</Text>
                    <View style={styles.metricIconGlow} />
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
                <View style={styles.metricCardPattern} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Bottom Row - Secondary Metrics */}
          <View style={styles.metricsRow}>
            <TouchableOpacity 
              style={[styles.modernMetricCard, styles.tertiaryMetricCard]}
              activeOpacity={0.8}
              onPress={() => handleNavigation('credits')}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                style={styles.metricCardGradient}
              >
                <View style={styles.metricCardHeader}>
                  <View style={styles.metricIconWrapper}>
                    <Text style={styles.metricIcon}>💰</Text>
                    <View style={styles.metricIconGlow} />
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
                <View style={styles.metricCardPattern} />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modernMetricCard, styles.quaternaryMetricCard]}
              activeOpacity={0.8}
              onPress={() => handleNavigation('profile')}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                style={styles.metricCardGradient}
              >
                <View style={styles.metricCardHeader}>
                  <View style={styles.metricIconWrapper}>
                    <Text style={styles.metricIcon}>⭐</Text>
                    <View style={styles.metricIconGlow} />
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
                <View style={styles.metricCardPattern} />
              </LinearGradient>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerMainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
  },
  logoContainer: {
    position: 'relative',
    marginRight: 12,
  },
  logoGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    zIndex: -1,
  },
  titleContainer: {
    flex: 1,
  },
  notificationContainer: {
    marginLeft: 12,
  },
  menuButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  menuIcon: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '600',
  },
  logo: {
    fontSize: 28,
    color: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(15px)',
    borderRightWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
    zIndex: 1000,
  },
  sidebarHeader: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
    minHeight: Platform.OS === 'ios' ? 90 : 70,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    position: 'relative',
    overflow: 'hidden',
  },
  sidebarHeaderPattern: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    zIndex: 1,
  },
  sidebarHeaderPattern2: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    zIndex: 1,
  },
  // User Profile Section
  userProfileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(8px)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  userAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  userAvatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  userStatusIndicator: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 1,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 1,
    letterSpacing: -0.2,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  userRole: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  // Notification Badge
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: colors.error,
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  // Sidebar Footer
  sidebarFooter: {
    padding: 16,
    marginTop: 12,
  },
  footerDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 12,
  },
  footerContent: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  footerSubtext: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
    opacity: 0.7,
  },
  sidebarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  closeButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    backdropFilter: 'blur(8px)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  sidebarLogo: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    flex: 1,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginLeft: 12,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  sidebarContent: {
    flex: 1,
    paddingTop: 8,
    backgroundColor: 'rgba(248, 250, 252, 0.5)',
    backdropFilter: 'blur(8px)',
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginHorizontal: 12,
    marginVertical: 3,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(8px)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ scale: 1 }],
  },
  activeItem: {
    backgroundColor: colors.primary + '15',
    borderWidth: 2,
    borderColor: colors.primary + '40',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },
  sidebarIcon: {
    fontSize: 18,
    marginRight: 14,
    width: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  sidebarText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
    fontWeight: '600',
    letterSpacing: -0.2,
    textShadowColor: 'rgba(0,0,0,0.05)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  activeText: {
    color: colors.primary,
    fontWeight: '800',
    textShadowColor: colors.primary + '30',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  logoutItem: {
    backgroundColor: colors.error + '20',
    borderWidth: 2,
    borderColor: colors.error + '40',
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  sidebarSection: {
    marginBottom: 4,
  },
  sidebarSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    backdropFilter: 'blur(8px)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  expandIcon: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 'auto',
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  sidebarSubItems: {
    marginTop: 4,
    marginHorizontal: 12,
  },
  sidebarSubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 2,
    marginLeft: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    backdropFilter: 'blur(4px)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  sidebarSubText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    letterSpacing: -0.1,
    flex: 1,
    marginLeft: 12,
  },
  // Submenu icon styling
  sidebarSubIcon: {
    fontSize: 14,
    marginRight: 12,
    width: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  // Active submenu item
  activeSubItem: {
    backgroundColor: colors.primary + '12',
    borderWidth: 1.5,
    borderColor: colors.primary + '30',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  activeSubText: {
    color: colors.primary,
    fontWeight: '700',
  },
  logoutText: {
    color: colors.error,
    fontWeight: '800',
    textShadowColor: colors.error + '30',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  mainContent: {
    flex: 1,
  },
  animatedContainer: {
    flex: 1,
  },
  // Enhanced Welcome Section
  welcomeSection: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  welcomeGradient: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeGreeting: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  welcomeName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.8,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  welcomeIconContainer: {
    position: 'relative',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeIconGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 39,
    backgroundColor: colors.primary + '20',
    zIndex: -1,
  },
  welcomeEmoji: {
    fontSize: 32,
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
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modernMetricCard: {
    flex: 1,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  metricCardGradient: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    position: 'relative',
  },
  metricCardPattern: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: -1,
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
    position: 'relative',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricIconGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 28,
    backgroundColor: colors.primary + '20',
    zIndex: -1,
  },
  metricIcon: {
    fontSize: 24,
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
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
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
    marginBottom: 16,
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
  dashboardLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 40,
  },
  pandaContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  pandaFace: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  pandaEmoji: {
    fontSize: 50,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginHorizontal: 3,
  },
  dot1: {
    animationDelay: '0s',
  },
  dot2: {
    animationDelay: '0.2s',
  },
  dot3: {
    animationDelay: '0.4s',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
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


