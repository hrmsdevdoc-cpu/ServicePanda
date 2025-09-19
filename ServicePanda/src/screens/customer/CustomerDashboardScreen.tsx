const React = require('react');
const { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Animated, Dimensions, StatusBar, Image, ImageBackground, ActivityIndicator, Alert } = require('react-native');
const { colors } = require('../../utils/theme');
const { useTheme } = require('../../contexts/ThemeContext');
const { apiService } = require('../../services/api');
const { API_BASE_URL } = require('../../config/api');
const NotificationList = require('../../components/NotificationList');
const notificationService = require('../../services/notifications');

const { width, height } = Dimensions.get('window');

const CustomerDashboardScreen = ({ onNavigate, onLogout }: { onNavigate: any, onLogout: any }) => {
  // Theme context
  const { colors, isDarkMode } = useTheme();
  
  const [refreshing, setRefreshing] = React.useState(false);
  const [userData, setUserData] = React.useState({
    name: 'Loading...',
    email: 'Loading...',
    avatar: null
  });
  const [serviceCategories, setServiceCategories] = React.useState([]);
  const [recentRequests, setRecentRequests] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [categoriesLoading, setCategoriesLoading] = React.useState(true);
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
        const mapped = {
          id: category.id || category._id || index + 1,
          name: category.name || category.title || category.categoryName || `Service ${index + 1}`,
          icon: category.icon || '🔧',
          color: category.color || '#3B82F6'
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
      setTotalServices(serviceCategories.length || 0);
      setActiveRequests(activeCount);
      setUserRating(4.9); // This could come from user profile API in the future
      
      console.log('📊 Dashboard stats updated:', {
        totalServices: serviceCategories.length || 0,
        activeRequests: activeCount,
        userRating: 4.9
      });
      
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      // Set fallback values
      setTotalServices(serviceCategories.length || 0);
      setActiveRequests(0);
      setUserRating(4.9);
    }
  };

  // Fetch recent requests
  const fetchRecentRequests = async () => {
    try {
      const requests = await apiService.getMyServiceRequests();
      console.log('Fetched requests:', requests);
      
      // Map API data to match web version structure
      const mappedRequests = requests.slice(0, 3).map((request, index) => {
        console.log('Processing request:', request);
        console.log('Available categories:', serviceCategories);
        
        // Find the category for this request
        const category = serviceCategories.find(cat => cat.id === request.categoryId);
        console.log('Found category for request:', category);
        
        const isLatest = index === 0;
        
        // Map status to colors like web version
        const statusColor = {
          'active': colors.primary,
          'assigned': colors.warning, 
          'completed': colors.success,
          'cancelled': colors.error
        }[request.status] || colors.primary;
        
        // Enhanced service name extraction (same logic as TrackRequestScreen)
        let serviceName = request.category?.name || 
                          request.categoryName || 
                          request.category || 
                          request.serviceCategory?.name ||
                          request.serviceCategory ||
                          request.serviceType ||
                          request.type ||
                          request.service?.name ||
                          request.service ||
                          category?.name ||
                          'Service';

        // If service name is still "Service", try to extract from title or other fields
        if (serviceName === 'Service') {
          const title = request.title || '';
          const description = request.description || '';
          
          // Try to extract service name from title or description
          if (title.toLowerCase().includes('hvac') || description.toLowerCase().includes('hvac')) {
            serviceName = 'HVAC';
          } else if (title.toLowerCase().includes('plumb') || description.toLowerCase().includes('plumb')) {
            serviceName = 'Plumbing';
          } else if (title.toLowerCase().includes('electr') || description.toLowerCase().includes('electr')) {
            serviceName = 'Electrical';
          } else if (title.toLowerCase().includes('clean') || description.toLowerCase().includes('clean')) {
            serviceName = 'Cleaning';
          } else if (title.toLowerCase().includes('event') || description.toLowerCase().includes('event')) {
            serviceName = 'Event Management';
          } else if (title.toLowerCase().includes('fitness') || description.toLowerCase().includes('fitness')) {
            serviceName = 'Fitness & Yoga';
          } else if (title.toLowerCase().includes('photo') || description.toLowerCase().includes('photo')) {
            serviceName = 'Photography';
          } else if (title.toLowerCase().includes('carpent') || description.toLowerCase().includes('carpent')) {
            serviceName = 'Carpentry';
          } else if (title.toLowerCase().includes('landscap') || description.toLowerCase().includes('landscap')) {
            serviceName = 'Landscaping';
          } else if (title.toLowerCase().includes('paint') || description.toLowerCase().includes('paint')) {
            serviceName = 'Painting';
          } else {
            // Fallback to a more descriptive name
            serviceName = `Service ${request.id || index + 1}`;
          }
        }

        // Debug logging
        if (index === 0) {
          console.log('🔍 Dashboard - Service name extraction for request:', {
            'request.category': request.category,
            'request.categoryName': request.categoryName,
            'request.serviceCategory': request.serviceCategory,
            'request.serviceType': request.serviceType,
            'request.title': request.title,
            'extracted serviceName': serviceName
          });
        }
        
        console.log('Final service name:', serviceName);
        
        return {
          id: request.id || index + 1,
          title: `${serviceName} request${isLatest ? ' (Latest)' : ''}`,
          status: request.status || 'active',
          date: request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'Recently',
          location: request.suburb && request.postcode ? `${request.suburb}, ${request.postcode}` : 'Location not specified',
          icon: '🔧',
          color: statusColor
        };
      });
      
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
    setRequestsLoading(true);
    
    // Load user data, categories, and notifications in parallel
    await Promise.all([
      fetchUserData(),
      fetchServiceCategories(),
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
    Alert.alert('Service Category', `${category} services coming soon!`);
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
            <Text style={styles.notificationIcon}>🔔</Text>
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
        icon: '🔧',
        color: colors.primary,
        onPress: handleRequestService
      },
      {
        id: 'track',
        title: 'Track Request',
        description: 'Monitor your requests',
        icon: '📊',
        color: colors.success,
        onPress: () => onNavigate('trackRequest')
      },
      {
        id: 'review',
        title: 'Reviews',
        description: 'View your reviews',
        icon: '⭐',
        color: colors.warning,
        onPress: () => onNavigate('reviews')
      },
      {
        id: 'profile',
        title: 'Profile',
        description: 'Manage your account',
        icon: '👤',
        color: colors.info,
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
                style={[styles.quickActionButton, { backgroundColor: action.color + '15' }]}
                onPress={action.onPress}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <Text style={styles.quickActionEmoji}>{action.icon}</Text>
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
        id: 1,
        title: 'Home Cleaning',
        subtitle: 'Professional cleaning services',
        image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f4c4?w=400&h=200&fit=crop',
        price: 'From $50',
        color: '#4ECDC4'
      },
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
        image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=200&fit=crop',
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

    console.log('🔍 Dashboard serviceCategories:', serviceCategories);
    console.log('🔍 serviceCategories.length:', serviceCategories.length);
    console.log('🔍 categoriesLoading:', categoriesLoading);
    
    const allCategories = serviceCategories.length > 0 ? serviceCategories : [
      { id: 1, name: 'Plumbing', icon: '🔧', color: '#3B82F6' },
      { id: 2, name: 'Electrical', icon: '⚡', color: '#F59E0B' },
      { id: 3, name: 'HVAC', icon: '❄️', color: '#10B981' },
      { id: 4, name: 'Cleaning', icon: '🧹', color: '#8B5CF6' },
      { id: 5, name: 'Landscaping', icon: '🌱', color: '#06B6D4' },
      { id: 6, name: 'Painting', icon: '🎨', color: '#EF4444' },
      { id: 7, name: 'Carpentry', icon: '🔨', color: '#84CC16' },
      { id: 8, name: 'Appliance Repair', icon: '🔌', color: '#F97316' }
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
          <Text style={styles.sectionTitle}>Popular Services</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => onNavigate('viewAllServices')}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <Animated.View
              key={category.name}
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
                style={[styles.categoryButton, { borderColor: category.color + '30' }]}
                onPress={() => handleServiceCategory(category.name)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '15' }]}>
                  <Text style={styles.categoryEmoji}>{category.icon}</Text>
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    );
  };

  // Render trending services with photos
  const renderTrendingServices = () => {
    const trendingServices = [
      {
        id: 1,
        title: 'Deep Cleaning',
        image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f4c4?w=300&h=200&fit=crop',
        rating: 4.8,
        reviews: 124,
        price: '$60-90'
      },
      {
        id: 2,
        title: 'AC Repair',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=200&fit=crop',
        rating: 4.9,
        reviews: 89,
        price: '$80-120'
      },
      {
        id: 3,
        title: 'Kitchen Renovation',
        image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop',
        rating: 4.7,
        reviews: 156,
        price: '$200-500'
      },
      {
        id: 4,
        title: 'Garden Maintenance',
        image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f4c4?w=300&h=200&fit=crop',
        rating: 4.6,
        reviews: 67,
        price: '$40-80'
      }
    ];

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
          <TouchableOpacity onPress={() => onNavigate('viewAllServices')} activeOpacity={0.7}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
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
                  <View style={styles.trendingRating}>
                    <Text style={styles.trendingRatingText}>⭐ {service.rating}</Text>
                    <Text style={styles.trendingReviewsText}>({service.reviews})</Text>
                  </View>
                </View>
              </ImageBackground>
              <View style={styles.trendingContent}>
                <Text style={[styles.trendingTitle, { color: colors.text }]}>{service.title}</Text>
                <Text style={[styles.trendingPrice, { color: colors.primary }]}>{service.price}</Text>
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

    console.log('Rendering activities:', activities);

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
              color: activity.color || colors.primary
            };
            
            return (
              <Animated.View
                key={safeActivity.id}
                style={[
                  styles.activityCard,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                  }
                ]}
              >
                <View style={[styles.activityIcon, { backgroundColor: safeActivity.color + '15' }]}>
                  <Text style={styles.activityEmoji}>{safeActivity.icon}</Text>
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{safeActivity.title}</Text>
                  <Text style={styles.activityLocation}>{safeActivity.location}</Text>
                  <Text style={styles.activityDate}>{safeActivity.date}</Text>
                </View>
                <View style={[styles.activityStatus, { backgroundColor: safeActivity.color + '20' }]}>
                  <Text style={[styles.activityStatusText, { color: safeActivity.color }]}>
                    {safeActivity.status}
                  </Text>
                </View>
              </Animated.View>
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
    height: 230,
    backgroundColor: colors.primary,
    // Add gradient effect
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: -250, // Overlap with content below
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for footer
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
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
    // marginTop: -15,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  userDetails: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
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
    fontSize: 24,
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
    marginTop: 8,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    fontSize: 12,
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
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 0, // Remove bottom margin since we're using sectionHeader
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    backgroundColor: colors.primary + '10',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 56) / 2, // Adjusted for better alignment
    marginBottom: 16,
  },
  quickActionButton: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionEmoji: {
    fontSize: 24,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Align items to top
  },
  categoryCard: {
    width: (width - 56) / 4, // Adjusted for better alignment
    marginBottom: 12,
    height: 100, // Fixed height for consistent alignment
  },
  categoryButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    height: '100%', // Take full height of parent
    flex: 1, // Allow flex to fill available space
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 14, // Consistent line height
    numberOfLines: 2, // Allow max 2 lines
    flexWrap: 'wrap', // Allow text wrapping
  },
  recentActivityContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  activityList: {
    gap: 12,
  },
  activityCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityEmoji: {
    fontSize: 18,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  activityLocation: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  activityStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activityStatusText: {
    fontSize: 12,
    fontWeight: '600',
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
    fontSize: 24,
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
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
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  trendingScrollContent: {
    paddingRight: 20,
  },
  trendingCard: {
    width: 200,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trendingImage: {
    width: '100%',
    height: 120,
    justifyContent: 'flex-end',
  },
  trendingImageStyle: {
    borderRadius: 12,
  },
  trendingOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
  },
  trendingRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingRatingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  trendingReviewsText: {
    color: 'white',
    fontSize: 10,
    marginLeft: 4,
    opacity: 0.8,
  },
  trendingContent: {
    padding: 12,
  },
  trendingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trendingPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
});

module.exports = CustomerDashboardScreen;