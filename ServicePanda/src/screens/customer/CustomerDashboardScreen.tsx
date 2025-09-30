const React = require('react');
const { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Animated, Dimensions, StatusBar, Image, ImageBackground, ActivityIndicator, Alert, Platform } = require('react-native');
// const { useSafeAreaInsets } = require('react-native-safe-area-context');

// useSafeAreaInsets hook with proper safe area values
const useSafeAreaInsets = () => {
  const { Platform, StatusBar } = require('react-native');
  
  return {
    top: Platform.OS === 'ios' ? 44 : 0, // iOS notch area, Android uses StatusBar
    bottom: Platform.OS === 'ios' ? 34 : 0, // Home indicator area
    left: 0,
    right: 0
  };
};
const { colors } = require('../../utils/theme');
const { useTheme } = require('../../contexts/ThemeContext');
const Icon = require('react-native-vector-icons/MaterialIcons').default;
const { apiService } = require('../../services/api');
const { API_BASE_URL } = require('../../config/api');
const NotificationList = require('../../components/NotificationList');
const notificationService = require('../../services/notifications');
const { getServiceImageWithFallback } = require('../../utils/serviceImages');

const { width, height } = Dimensions.get('window');

const CustomerDashboardScreen = ({ onNavigate, onLogout }: { onNavigate: any, onLogout: any }) => {
  // Theme context
  const { colors, isDarkMode } = useTheme();
  
  // Safe area insets for iOS
  const insets = useSafeAreaInsets();
  
  const [refreshing, setRefreshing] = React.useState(false);
  const [userData, setUserData] = React.useState({
    name: 'Loading...',
    email: 'Loading...',
    avatar: null
  });
  const [serviceCategories, setServiceCategories] = React.useState([]);
  const [trendingServices, setTrendingServices] = React.useState([]);
  const [recentRequests, setRecentRequests] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [categoriesLoading, setCategoriesLoading] = React.useState(true);
  const [trendingLoading, setTrendingLoading] = React.useState(true);
  const [requestsLoading, setRequestsLoading] = React.useState(true);
  
  // Dashboard statistics
  const [totalServices, setTotalServices] = React.useState(0);
  const [activeRequests, setActiveRequests] = React.useState(0);
  const [userRating, setUserRating] = React.useState(0);
  
  // Notification state
  const [notifications, setNotifications] = React.useState([]);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notificationsLoading, setNotificationsLoading] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);

  // Image loading state
  const [imageErrors, setImageErrors] = React.useState(new Set());

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;
  const headerAnim = React.useRef(new Animated.Value(0)).current;

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const user = await apiService.getCurrentUser();
      if (user) {
        setUserData({
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          avatar: null
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch service categories
  const fetchServiceCategories = async () => {
    try {
      console.log('🌐 Dashboard: Fetching service categories from:', `${API_BASE_URL}/api/service-categories`);
      const categories = await apiService.getServiceCategories();
      console.log('📡 Dashboard: API Response for categories:', categories);
      
      if (!categories || !Array.isArray(categories)) {
        console.warn('⚠️ Categories is not an array:', categories);
        throw new Error('Invalid categories data');
      }
      
      // Map API data to our expected format
      const mappedCategories = categories.map((category, index) => {
        console.log('🔄 Processing category:', category);
        
        // Simple service name extraction - just use what's in the database
        const serviceName = category.name || category.title || category.categoryName || `Service ${index + 1}`;
        
        const mapped = {
          id: category.id || category._id || index + 1,
          name: serviceName,
          color: category.color || '#3B82F6',
          image: getServiceImageWithFallback(category.imageUrl || category.image_url || category.image, serviceName, index, API_BASE_URL),
          description: category.description || 'Professional service',
          rating: category.rating || 4.5,
          reviews: category.reviews || Math.floor(Math.random() * 200) + 50,
          provider: category.provider || 'Service Provider'
        };
        console.log('✅ Mapped category:', mapped);
        return mapped;
      });
      
      console.log('🎯 Dashboard: Final mapped categories:', mappedCategories);
      setServiceCategories(mappedCategories);
      console.log('✅ Dashboard: Service categories set successfully');
    } catch (error) {
      console.error('❌ Dashboard: Error fetching service categories:', error);
      console.log('🔄 Dashboard: Using fallback categories...');
      
      // Fallback to static categories if API fails
      const fallbackCategories = [
        { id: 1, name: 'Plumbing', icon: '🔧', color: '#3B82F6' },
        { id: 2, name: 'Electrical', icon: '⚡', color: '#F59E0B' },
        { id: 3, name: 'HVAC', icon: '❄️', color: '#10B981' },
        { id: 4, name: 'Cleaning', icon: '🧹', color: '#8B5CF6' },
        { id: 5, name: 'Landscaping', icon: '🌱', color: '#06B6D4' },
        { id: 6, name: 'Painting', icon: '🎨', color: '#EF4444' },
        { id: 7, name: 'Carpentry', icon: '🔨', color: '#84CC16' },
        { id: 8, name: 'Appliance Repair', icon: '🔌', color: '#F97316' }
      ];
      setServiceCategories(fallbackCategories);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Fetch trending service categories
  const fetchTrendingServices = async () => {
    try {
      const trendingCategories = await apiService.getTrendingServiceCategories();
      
      if (!trendingCategories || !Array.isArray(trendingCategories)) {
        throw new Error('Invalid trending categories data');
      }
      
      // Map API data to trending services format
      const mappedTrendingServices = trendingCategories.map((category, index) => {
        
        // Simple service name extraction - just use what's in the database
        const serviceName = category.name || category.title || category.categoryName || `Service ${index + 1}`;
        
        return {
          id: category.id || category._id || index + 1,
          title: serviceName,
          subtitle: category.description || 'Professional service',
          image: getServiceImageWithFallback(category.imageUrl || category.image_url || category.image, serviceName, index, API_BASE_URL),
          rating: category.rating || (4.0 + Math.random() * 1.0).toFixed(1),
          reviews: category.reviews || Math.floor(Math.random() * 200) + 50,
          provider: category.provider || 'Professional Service Provider',
          category: serviceName
        };
      });
      
      console.log('🎯 Dashboard: Final mapped trending services:', mappedTrendingServices);
      setTrendingServices(mappedTrendingServices);
      console.log('✅ Dashboard: Trending services set successfully');
    } catch (error) {
      console.error('❌ Dashboard: Error fetching trending services:', error);
      // Don't show any trending services if API fails - keep it empty
      setTrendingServices([]);
    } finally {
      setTrendingLoading(false);
    }
  };

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      console.log('📊 Fetching dashboard statistics...');
      
      // Fetch all service requests to calculate stats
      const allRequests = await apiService.getMyServiceRequests();
      console.log('📋 All requests for stats:', allRequests);
      
      // Calculate active requests (pending, assigned, in progress)
      const activeStatuses = ['pending', 'assigned', 'in_progress', 'active', 'new'];
      const activeCount = allRequests.filter(request => 
        activeStatuses.includes(request.status?.toLowerCase())
      ).length;
      
      // Set statistics
      setTotalServices(allRequests.length || 0);
      setActiveRequests(activeCount);
      setUserRating(4.9); // This could come from user profile API in the future
      
      console.log('📊 Dashboard stats updated:', {
        totalServices: allRequests.length || 0,
        activeRequests: activeCount,
        userRating: 4.9
      });
      
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      // Set fallback values
      setTotalServices(0);
      setActiveRequests(0);
      setUserRating(4.9);
    }
  };

  // Fetch recent requests with proper category linking
  const fetchRecentRequests = async () => {
    try {
      const requests = await apiService.getMyServiceRequests();
      console.log('🔄 Fetched requests:', requests);
      
      // Also fetch categories if not already loaded to ensure we have them
      let categoriesData = serviceCategories;
      if (!categoriesData || categoriesData.length === 0) {
        console.log('🔄 Fetching categories for recent requests...');
        categoriesData = await apiService.getServiceCategories();
        console.log('🔄 Fetched categories for requests:', categoriesData);
      }
      
      // Map API data to match web version structure
      const mappedRequests = requests.slice(0, 3).map((request, index) => {
        console.log('🔍 Processing request:', request);
        
        // Find the category for this request using categoryId
        const category = categoriesData.find(cat => cat.id === request.categoryId);
        console.log('🔍 Found category for request:', category);
        
        const isLatest = index === 0;
        
        // Map status to colors like web version
        const statusColor = {
          'active': colors.primary,
          'assigned': colors.warning, 
          'completed': colors.success,
          'cancelled': colors.error
        }[request.status] || colors.primary;
        
        // Use category name with fallbacks - prioritize the category lookup
        let serviceName = category?.name || 
                          request.categoryName || 
                          request.category || 
                          request.serviceType ||
                          'Service Request';

        // Get category image with fallback
        const categoryImage = category ? 
          getServiceImageWithFallback(
            category.imageUrl || category.image_url || category.image, 
            category.name, 
            category.id, 
            API_BASE_URL
          ) : null;

        console.log('🔍 Final mapping:', {
          serviceName,
          categoryImage,
          categoryIcon: category?.icon,
          requestId: request.id,
          categoryId: request.categoryId
        });
        
        return {
          id: request.id || index + 1,
          title: serviceName, // Remove "request" suffix and (Latest) - keep it clean
          status: request.status || 'active',
          date: request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'Recently',
          location: request.suburb && request.postcode ? `${request.suburb}, ${request.postcode}` : 'Location not specified',
          icon: category?.icon || '🔧',
          image: categoryImage, // Add actual service category image
          color: statusColor
        };
      });
      
      console.log('✅ Final mapped requests:', mappedRequests);
      setRecentRequests(mappedRequests);
    } catch (error) {
      console.error('Error fetching recent requests:', error);
      // Fallback to static data if API fails
      setRecentRequests([
        {
          id: 1,
          title: 'Plumbing Service Request',
          status: 'In Progress',
          date: '2 hours ago',
          location: 'Brisbane, 4000',
          icon: '🔧',
          color: colors.primary
        },
        {
          id: 2,
          title: 'Electrical Repair',
          status: 'Completed',
          date: '1 day ago',
          location: 'Brisbane, 4000',
          icon: '⚡',
          color: colors.success
        }
      ]);
    } finally {
      setRequestsLoading(false);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setNotificationsLoading(true);
      const notificationData = await notificationService.getNotifications();
      setNotifications(notificationData);
      
      // Calculate unread count
      const unread = notificationData.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Load all data
  const loadDashboardData = async () => {
    setLoading(true);
    setCategoriesLoading(true);
    setTrendingLoading(true);
    setRequestsLoading(true);
    
    // Load user data, categories, trending services, and notifications in parallel
    await Promise.all([
      fetchUserData(),
      fetchServiceCategories(),
      fetchTrendingServices(),
      fetchNotifications()
    ]);
    
    // Then load requests (which depends on categories)
    await fetchRecentRequests();
    
    // Finally load dashboard statistics
    await fetchDashboardStats();
  };

  React.useEffect(() => {
    const startAnimations = () => {
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
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(headerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    };

    startAnimations();
    loadDashboardData();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
      setRefreshing(false);
  }, []);

  const handleRequestService = () => {
    onNavigate('requestService');
  };

  const handleServiceCategory = (category: any) => {
    // Navigate to request page with selected service type
    onNavigate('requestService', { selectedCategory: category });
  };

  const handleQuickAction = (action: any) => {
    Alert.alert('Quick Action', `${action} feature coming soon!`);
  };

  // Notification handlers
  const handleNotificationPress = async (notification: any) => {
    try {
      // Mark notification as read
      await notificationService.markAsRead(notification.id);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Handle notification action if needed
      if (notification.actionUrl) {
        // Navigate to specific screen based on actionUrl
        console.log('Navigate to:', notification.actionUrl);
      }
    } catch (error) {
      console.error('Error handling notification press:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleNotificationToggle = () => {
    setShowNotifications(!showNotifications);
  };


  const renderHeader = () => {
  return (
      <Animated.View 
        style={[
          styles.header,
          {
            paddingTop: Platform.OS === 'ios' ? insets.top + 20 : 20,
            opacity: headerAnim,
            transform: [
              { translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0]
              })}
            ]
          }
        ]}
      >
        {/* Decorative Background Elements */}
        <View style={styles.headerDecorations}>
          <View style={styles.decorationCircle1} />
          <View style={styles.decorationCircle2} />
          <View style={styles.decorationCircle3} />
          <View style={styles.decorationWave} />
      </View>

        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarGlow} />
              <Text style={styles.avatarText}>{userData.name.charAt(0)}</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.greetingText}>Welcome back!</Text>
              <Text style={styles.userName}>{userData.name}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationToggle}>
            <View style={styles.notificationButtonGlow} />
            <Icon name="notifications" size={24} color="#FFFFFF" style={{ fontWeight: 'bold' }} />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
        </TouchableOpacity>
      </View>

        <View style={styles.headerBottom}>
          <Text style={styles.headerSubtitle}>What service do you need today?</Text>
          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {loading ? '...' : totalServices}
              </Text>
              <Text style={styles.statLabel}>Services</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {loading ? '...' : userRating}
              </Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {loading ? '...' : activeRequests}
              </Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderQuickActions = () => {
    const actions = [
      {
        id: 'request',
        title: 'Request Service',
        description: 'Get quotes from providers',
        icon: 'build',
        color: colors.primary,
        onPress: handleRequestService
      },
      {
        id: 'track',
        title: 'Track Request',
        description: 'Monitor your requests',
        icon: 'track-changes',
        color: colors.success,
        onPress: () => onNavigate('trackRequest')
      },
      {
        id: 'review',
        title: 'Reviews',
        description: 'View your reviews',
        icon: 'star',
        color: colors.warning,
        onPress: () => onNavigate('reviews')
      },
      {
        id: 'profile',
        title: 'Profile',
        description: 'Manage your account',
        icon: 'person',
        color: '#6B7280',
        onPress: () => onNavigate('profile')
      }
    ];

    return (
      <Animated.View 
        style={[
          styles.quickActionsContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        {/* <Text style={styles.sectionTitle}>Quick Actions</Text> */}
        <View style={styles.quickActionsGrid}>
          {actions.map((action, index) => (
            <Animated.View
              key={action.id}
              style={[
                styles.quickActionCard,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim }
                  ]
                }
              ]}
            >
              <TouchableOpacity 
                style={[
                  styles.quickActionButton, 
                  { 
                    backgroundColor: action.color + '25', // Darker color background
                    borderColor: Platform.OS === 'ios' ? action.color + '25' : action.color + '15', // More visible on iOS
                  }
                ]}
                onPress={action.onPress}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <Icon name={action.icon} size={24} color="#FFFFFF" style={{ fontWeight: 'bold' }} />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionDescription}>{action.description}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    );
  };

  // Render hero banner with featured services
  const renderHeroBanner = () => {
    const featuredServices = [

      {
        id: 2,
        title: 'Plumbing Repair',
        subtitle: 'Expert plumbers at your service',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=200&fit=crop',
        price: 'From $80',
        color: '#45B7D1'
      },
      {
        id: 3,
        title: 'Electrical Work',
        subtitle: 'Safe and reliable electrical services',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=200&fit=crop',
        price: 'From $70',
        color: '#96CEB4'
      }
    ];

    return (
      <Animated.View 
        style={[
          styles.heroBannerContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={[styles.heroTitle, { color: colors.text }]}>
          Featured Services
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.heroScrollContent}
          pagingEnabled
        >
          {featuredServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[styles.heroCard, { backgroundColor: colors.surface }]}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={{ uri: service.image }}
                style={styles.heroImage}
                imageStyle={styles.heroImageStyle}
              >
                <View style={styles.heroOverlay}>
                  <View style={styles.heroContent}>
                    <Text style={styles.heroCardTitle}>{service.title}</Text>
                    <Text style={styles.heroCardSubtitle}>{service.subtitle}</Text>
                    <View style={[styles.heroPriceContainer, { backgroundColor: service.color }]}>
                      <Text style={styles.heroPrice}>{service.price}</Text>
                    </View>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    );
  };

  const renderServiceCategories = () => {
    if (categoriesLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Loading services...</Text>
        </View>
      );
    }

    const allCategories = serviceCategories.length > 0 ? serviceCategories : [
      { 
        id: 1, 
        name: 'Plumbing', 
        color: '#3B82F6', 
        description: 'Fix & Install',
        image: getServiceImageWithFallback(null, 'Plumbing', 0),
        rating: 4.9,
        reviews: 203,
        provider: 'AquaFix Plumbing'
      },
      { 
        id: 2, 
        name: 'Electrical', 
        color: '#F59E0B', 
        description: 'Wiring & Repair',
        image: getServiceImageWithFallback(null, 'Electrical', 1),
        rating: 4.8,
        reviews: 156,
        provider: 'PowerTech Electric'
      },
      { 
        id: 3, 
        name: 'HVAC', 
        color: '#10B981', 
        description: 'Heating & Cooling',
        image: getServiceImageWithFallback(null, 'HVAC', 2),
        rating: 4.9,
        reviews: 89,
        provider: 'CoolTech HVAC'
      },
      { 
        id: 4, 
        name: 'Cleaning', 
        color: '#8B5CF6', 
        description: 'Deep Clean',
        image: getServiceImageWithFallback(null, 'Cleaning', 3),
        rating: 4.8,
        reviews: 124,
        provider: 'CleanPro Services'
      },
      { 
        id: 5, 
        name: 'Landscaping', 
        color: '#06B6D4', 
        description: 'Garden Care',
        image: getServiceImageWithFallback(null, 'Landscaping', 4),
        rating: 4.6,
        reviews: 67,
        provider: 'GreenThumb Landscaping'
      },
      { 
        id: 6, 
        name: 'Painting', 
        color: '#EF4444', 
        description: 'Interior & Exterior',
        image: getServiceImageWithFallback(null, 'Painting', 5),
        rating: 4.7,
        reviews: 156,
        provider: 'ColorCraft Painters'
      },
      { 
        id: 7, 
        name: 'Carpentry', 
        color: '#84CC16', 
        description: 'Custom Work',
        image: getServiceImageWithFallback(null, 'Carpentry', 6),
        rating: 4.8,
        reviews: 98,
        provider: 'WoodWorks Studio'
      },
      { 
        id: 8, 
        name: 'Appliance Repair', 
        color: '#F97316', 
        description: 'Fix & Maintain',
        image: getServiceImageWithFallback(null, 'Appliance Repair', 7),
        rating: 4.7,
        reviews: 112,
        provider: 'FixIt Appliance'
      }
    ];
    
    console.log('🔍 Using categories:', allCategories);

    // Always show exactly 8 items
    const categories = allCategories.slice(0, 8);

    return (
      <Animated.View 
        style={[
          styles.categoriesContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Popular Services</Text>
            {/* <Text style={styles.sectionSubtitle}></Text> */}
          </View>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => onNavigate('viewAllServices')}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Icon name="arrow-forward" size={16} color={colors.primary} style={{ fontWeight: 'bold' }} />
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
        >
          {categories.map((category, index) => (
            <Animated.View
              key={category.id || `category-${index}`}
              style={[
                styles.categoryCard,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim }
                  ]
                }
              ]}
            >
              <TouchableOpacity 
                style={[styles.categoryButton, { 
                  shadowColor: category.color,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.15,
                  shadowRadius: 16,
                  elevation: 8,
                }]}
                onPress={() => handleServiceCategory(category)}
                activeOpacity={0.7}
              >
                {imageErrors.has(category.id) || !category.image ? (
                  <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&q=80' }}
                    style={styles.categoryImage}
                    imageStyle={styles.categoryImageStyle}
                  >
                    <View style={styles.categoryOverlay}>
                      <View style={styles.categoryRating}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Icon name="star" size={14} color="#FFD700" style={{ marginRight: 4 }} />
                          <Text style={styles.categoryRatingText}>{category.rating}</Text>
                        </View>
                        <Text style={styles.categoryReviewsText}>({category.reviews})</Text>
                      </View>
                    </View>
                  </ImageBackground>
                ) : (
                  <ImageBackground
                    source={{ uri: category.image }}
                    style={styles.categoryImage}
                    imageStyle={styles.categoryImageStyle}
                    onError={(error) => {
                      console.log('Image load error for category:', category.name, error);
                      setImageErrors(prev => new Set([...prev, category.id]));
                    }}
                  >
                    <View style={styles.categoryOverlay}>
                      <View style={styles.categoryRating}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Icon name="star" size={14} color="#FFD700" style={{ marginRight: 4 }} />
                          <Text style={styles.categoryRatingText}>{category.rating}</Text>
                        </View>
                        <Text style={styles.categoryReviewsText}>({category.reviews})</Text>
                      </View>
                    </View>
                  </ImageBackground>
                )}
                <View style={styles.categoryContent}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <View style={[styles.categoryCategory, { backgroundColor: category.color + '15' }]}>
                      <Text style={[styles.categoryCategoryText, { color: category.color }]}>Service</Text>
                    </View>
                  </View>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                  <View style={styles.categoryProvider}>
                    <Text style={styles.categoryProviderText}></Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      </Animated.View>
    );
  };

  // Render trending services with photos
  const renderTrendingServices = () => {
    if (trendingLoading) {
      return (
        <View style={styles.trendingServicesContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🔥 Trending Services</Text>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Loading trending services...</Text>
          </View>
        </View>
      );
    }

    if (!trendingServices || trendingServices.length === 0) {
      // Show section with placeholder when no trending services
      return (
        <Animated.View 
          style={[
            styles.trendingServicesContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>🔥 Trending Services</Text>
          </View>
          <View style={styles.emptyTrendingContainer}>
            <Text style={styles.emptyTrendingText}>No trending services at the moment</Text>
            <Text style={styles.emptyTrendingSubtext}>Check back later for trending services</Text>
          </View>
        </Animated.View>
      );
    }

    return (
      <Animated.View 
        style={[
          styles.trendingServicesContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending This Week</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => onNavigate('viewAllServices')}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Icon name="arrow-forward" size={16} color={colors.primary} style={{ fontWeight: 'bold' }} />
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trendingScrollContent}
        >
          {trendingServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[styles.trendingCard, { backgroundColor: colors.surface }]}
              activeOpacity={0.8}
            >
              <ImageBackground
                source={{ uri: service.image }}
                style={styles.trendingImage}
                imageStyle={styles.trendingImageStyle}
              >
                <View style={styles.trendingOverlay}>
                  <View style={styles.trendingBadge}>
                    <Text style={styles.trendingBadgeText}>TRENDING</Text>
                  </View>
                  <View style={styles.trendingRating}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Icon name="star" size={14} color="#FFD700" style={{ marginRight: 4 }} />
                      <Text style={styles.trendingRatingText}>{service.rating}</Text>
                    </View>
                    <Text style={styles.trendingReviewsText}>({service.reviews})</Text>
                  </View>
                </View>
              </ImageBackground>
              <View style={styles.trendingContent}>
                <View style={styles.trendingHeader}>
                  <Text style={[styles.trendingCategoryText, { color: colors.text }]}>{service.title}</Text>

                </View>
                <Text style={[styles.trendingSubtitle, { color: colors.textSecondary }]}>{service.subtitle}</Text>
                <View style={styles.trendingProvider}>
                  <Text style={styles.trendingProviderText}>by {service.provider}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    );
  };

  const renderRecentActivity = () => {
    if (requestsLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Loading recent activity...</Text>
        </View>
      );
    }

    const activities = recentRequests.length > 0 ? recentRequests : [
      {
        id: 1,
        title: 'No recent activity',
        status: 'Get started',
        date: 'Create your first request',
        icon: '📝',
        color: colors.textTertiary
      }
    ];


    return (
      <Animated.View 
        style={[
          styles.recentActivityContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => onNavigate('trackRequest')}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Icon name="arrow-forward" size={16} color={colors.primary} style={{ fontWeight: 'bold' }} />
          </TouchableOpacity>
        </View>
        <View style={styles.activityList}>
          {activities.map((activity, index) => {
            // Ensure all required properties exist
            const safeActivity = {
              id: activity.id || index + 1,
              title: activity.title || 'Service Request',
              status: activity.status || 'Pending',
              date: activity.date || 'Recently',
              location: activity.location || 'Location not specified',
              icon: activity.icon || '🔧',
              image: activity.image || null, // Add dynamic service category image
              color: activity.color || colors.primary
            };
            
            return (
              <TouchableOpacity
                key={safeActivity.id}
                style={[styles.activityItem, { backgroundColor: colors.surface }]}
                activeOpacity={0.7}
                onPress={() => onNavigate('trackRequest')}
              >
                {/* Service Image/Icon */}
                <View style={styles.activityImageContainer}>
                  {safeActivity.image ? (
                    <Image 
                      source={{ uri: safeActivity.image }}
                      style={styles.activityImage}
                    />
                  ) : (
                    <View style={[styles.activityIconBg, { backgroundColor: safeActivity.color + '15' }]}>
                      <Text style={styles.activityIcon}>{safeActivity.icon}</Text>
                    </View>
                  )}
                </View>
                
                {/* Content */}
                <View style={styles.activityContent}>
                  <View style={styles.activityHeader}>
                    <Text style={[styles.activityTitle, { color: colors.text }]} numberOfLines={1}>
                      {safeActivity.title}
                    </Text>
                    <View style={[styles.statusDot, { backgroundColor: safeActivity.color }]} />
                  </View>
                  <Text style={[styles.activitySubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
                    📍 {safeActivity.location}
                  </Text>
                  <View style={styles.activityFooter}>
                    <Text style={styles.activityDate}>{safeActivity.date}</Text>
                    <Text style={[styles.activityStatus, { color: safeActivity.color }]}>
                      {safeActivity.status.charAt(0).toUpperCase() + safeActivity.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
      </View>
      </Animated.View>
    );
  };


  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.primary} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Background Gradient - now inside ScrollView */}
        <View style={styles.backgroundGradient} />
        
        {renderHeader()}
        {renderQuickActions()}
        {renderHeroBanner()}
        {renderServiceCategories()}
        {renderTrendingServices()}
        {renderRecentActivity()}
    </ScrollView>
      
      {/* Footer Navigation */}
      {/* Notification List Modal */}
      <NotificationList
        visible={showNotifications}
        notifications={notifications}
        onClose={() => setShowNotifications(false)}
        onNotificationPress={handleNotificationPress}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundGradient: {
    height: Platform.OS === 'ios' ? 280 : 230, // Taller for iOS to cover statistics
    backgroundColor: colors.primary,
    // Add gradient effect
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: Platform.OS === 'ios' ? -300 : -250, // Adjust overlap for iOS
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 120 : 100, // More space for iOS safe area
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 10, // Remove Android padding here too
    paddingBottom: 40,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1, // Ensure header appears above background gradient
  },
  headerDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorationCircle1: {
    position: 'absolute',
    top: -50,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorationCircle2: {
    position: 'absolute',
    top: 20,
    right: 60,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  decorationCircle3: {
    position: 'absolute',
    bottom: -20,
    left: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  decorationWave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
    marginTop: 30, // Remove extra margin
    paddingRight: 50, // Increased padding to avoid emulator controls
  },
  headerSpacer: {
    width: 50, // Same width as notification button to balance the layout
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarGlow: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: -1,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  userDetails: {
    flex: 1,
  },
  greetingText: {
    fontSize: 15,
    color: colors.surface,
    opacity: 0.9,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.surface,
    marginTop: 2,
  },
  notificationButton: {
    position: 'relative',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    borderRadius: 20,
    marginRight: 20, // Increased margin to ensure it's not hidden
  },
  notificationButtonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  notificationIcon: {
    fontSize: 20,
    color: colors.surface,
    zIndex: 1,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.error,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerBottom: {
    marginTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0, // Extra space for iOS
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12, // More padding for iOS
    paddingHorizontal: 16,
    marginBottom: Platform.OS === 'ios' ? 5 : 0, // Small margin to stay within blue header
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: colors.surface,
    opacity: 0.8,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.surface,
    opacity: 0.9,
  },
  quickActionsContainer: {
    paddingHorizontal: 12, // Reduced padding for better space utilization
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 10,
    color: colors.textSecondary,
    opacity: 0.9,
    fontWeight: '500',
    lineHeight: 20,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  viewAllButton: {
    backgroundColor: colors.primary + '10',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.primary + '20',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 8,
    letterSpacing: 0.5,
    // Better text rendering on Android
    ...Platform.select({
      android: {
        includeFontPadding: false,
        textAlignVertical: 'center',
      },
    }),
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 4, // Add padding for better spacing
    marginTop: 20, // Add space from top
  },
  quickActionCard: {
    width: '48%', // Use percentage instead of calculated width
    marginBottom: 16,
    minHeight: 140, // Ensure consistent height
  },
  quickActionButton: {
    borderRadius: 16,
    padding: 16, // Reduced padding for better fit
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
    flex: 1, // Take full available space
    minHeight: 120, // Ensure minimum height
    borderWidth: 0, // Remove all borders
    // Clean look - no shadows or borders
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionEmoji: {
    fontSize: 22,
  },
  quickActionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
    lineHeight: 16,
  },
  quickActionDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
    paddingHorizontal: 4, // Add horizontal padding for text wrapping
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  categoriesScrollContent: {
    paddingRight: 20,
  },
  categoryCard: {
    width: 200,
    marginRight: 12,
  },
  categoryButton: {
    backgroundColor: colors.surface,
    // borderRadius: 16,
    padding: 0,
    borderWidth: 0,
    overflow: 'hidden',
    height: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: 120,
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
  },
  categoryImageStyle: {
    borderRadius: 0,
  },
  categoryOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    // borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  categoryRating: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  categoryRatingText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  categoryReviewsText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 6,
    opacity: 0.9,
    fontWeight: '500',
  },
  categoryContent: {
    padding: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    color: colors.text,
    flex: 1,
    marginRight: 10,
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryCategory: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryCategoryText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryDescription: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    color: colors.textSecondary,
    lineHeight: 14,
    opacity: 0.8,
    marginBottom: 10,
  },
  categoryProvider: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryProviderText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    opacity: 0.7,
  },
  imageFallback: {
    flex: 1,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  fallbackIcon: {
    fontSize: 48,
    marginBottom: 8,
    opacity: 0.8,
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    opacity: 0.9,
  },
  recentActivityContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  activityList: {
    gap: 12,
  },
  // Improved List-style Activity Styles
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  activityImageContainer: {
    marginRight: 12,
  },
  activityImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  activityIconBg: {
    width: 50,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIcon: {
    fontSize: 24,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activitySubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityDate: {
    fontSize: 11,
    color: colors.textTertiary || '#9CA3AF',
    fontWeight: '500',
  },
  activityStatus: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  bottomActions: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  primaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
  primaryButtonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    opacity: 0.1,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textTertiary,
  },
  // Hero Banner Styles
  heroBannerContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  heroScrollContent: {
    paddingRight: 20,
  },
  heroCard: {
    width: width * 0.8,
    height: 200,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  heroImageStyle: {
    borderRadius: 16,
  },
  heroOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 20,
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroContent: {
    alignItems: 'flex-start',
  },
  heroCardTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroCardSubtitle: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
    marginBottom: 12,
  },
  heroPriceContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  heroPrice: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Trending Services Styles
  trendingServicesContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  emptyTrendingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTrendingText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyTrendingSubtext: {
    fontSize: 14,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  trendingScrollContent: {
    paddingRight: 20,
  },
  trendingCard: {
    width: 200,
    marginRight: 12,
    // borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  trendingImage: {
    width: '100%',
    height: 120,
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
  },
  trendingImageStyle: {
    borderRadius: 0,
  },
  trendingOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  trendingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  trendingBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  trendingRating: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  trendingRatingText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  trendingReviewsText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 6,
    opacity: 0.9,
    fontWeight: '500',
  },
  trendingContent: {
    padding: 16,
  },
  trendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  trendingTitle: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    flex: 1,
    marginRight: 10,
    lineHeight: 18,
  },
  trendingCategory: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendingCategoryText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trendingSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    marginBottom: 10,
    lineHeight: 16,
    opacity: 0.8,
  },
  trendingProvider: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingProviderText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    opacity: 0.7,
  },
});

module.exports = CustomerDashboardScreen;