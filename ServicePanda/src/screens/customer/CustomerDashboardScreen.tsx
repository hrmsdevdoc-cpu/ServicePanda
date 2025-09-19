const React = require('react');
const { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Animated, Dimensions, StatusBar, Image, ImageBackground, ActivityIndicator, Alert, Platform } = require('react-native');
const { useSafeAreaInsets } = require('react-native-safe-area-context');
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
  
  // Safe area insets for iOS
  const insets = useSafeAreaInsets();
  
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
        const serviceName = category.name || category.title || category.categoryName || `Service ${index + 1}`;
        const mapped = {
          id: category.id || category._id || index + 1,
          name: serviceName,
          icon: category.icon || '🔧',
          color: category.color || '#3B82F6',
          image: category.image || getServiceImage(serviceName, index),
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

  // Function to get service-specific images
  const getServiceImage = (serviceName: string, index: number) => {
    const serviceImages: { [key: string]: string } = {
      'Plumbing': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
      'Electrical': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop',
      'HVAC': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
      'Cleaning': 'https://t4.ftcdn.net/jpg/03/05/63/55/240_F_305635573_47SjydzWbcQPCTbkcfHyfD4fUY81XW9R.jpg?w=400&h=300&fit=crop',
      'Landscaping': 'https://t4.ftcdn.net/jpg/03/05/63/55/240_F_305635573_47SjydzWbcQPCTbkcfHyfD4fUY81XW9R.jpg?w=400&h=300&fit=crop',
      'Painting': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop',
      'Carpentry': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      'Appliance Repair': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      'Bike Service': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop',
      'Automotive': 'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=400&h=300&fit=crop',
      'Home Repair': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      'Gardening': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
      'Pest Control': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop',
      'Removals': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      'Handyman': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop'
    };
    
    // Try to find exact match first
    if (serviceImages[serviceName]) {
      return serviceImages[serviceName];
    }
    
    // Try to find partial match
    const lowerName = serviceName.toLowerCase();
    for (const [key, value] of Object.entries(serviceImages)) {
      if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
        return value;
      }
    }
    
    // Fallback to random image
    return `https://picsum.photos/400/300?random=${index + 1}`;
  };

  const renderHeader = () => {
  return (
      <Animated.View 
        style={[
          styles.header,
          {
            paddingTop: Platform.OS === 'ios' ? insets.top + 30 : 60,
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
      { 
        id: 1, 
        name: 'Plumbing', 
        icon: '🔧', 
        color: '#3B82F6', 
        description: 'Fix & Install',
        image: getServiceImage('Plumbing', 0),
        rating: 4.9,
        reviews: 203,
        provider: 'AquaFix Plumbing'
      },
      { 
        id: 2, 
        name: 'Electrical', 
        icon: '⚡', 
        color: '#F59E0B', 
        description: 'Wiring & Repair',
        image: getServiceImage('Electrical', 1),
        rating: 4.8,
        reviews: 156,
        provider: 'PowerTech Electric'
      },
      { 
        id: 3, 
        name: 'HVAC', 
        icon: '❄️', 
        color: '#10B981', 
        description: 'Heating & Cooling',
        image: getServiceImage('HVAC', 2),
        rating: 4.9,
        reviews: 89,
        provider: 'CoolTech HVAC'
      },
      { 
        id: 4, 
        name: 'Cleaning', 
        icon: '🧹', 
        color: '#8B5CF6', 
        description: 'Deep Clean',
        image: getServiceImage('Cleaning', 3),
        rating: 4.8,
        reviews: 124,
        provider: 'CleanPro Services'
      },
      { 
        id: 5, 
        name: 'Landscaping', 
        icon: '🌱', 
        color: '#06B6D4', 
        description: 'Garden Care',
        image: getServiceImage('Landscaping', 4),
        rating: 4.6,
        reviews: 67,
        provider: 'GreenThumb Landscaping'
      },
      { 
        id: 6, 
        name: 'Painting', 
        icon: '🎨', 
        color: '#EF4444', 
        description: 'Interior & Exterior',
        image: getServiceImage('Painting', 5),
        rating: 4.7,
        reviews: 156,
        provider: 'ColorCraft Painters'
      },
      { 
        id: 7, 
        name: 'Carpentry', 
        icon: '🔨', 
        color: '#84CC16', 
        description: 'Custom Work',
        image: getServiceImage('Carpentry', 6),
        rating: 4.8,
        reviews: 98,
        provider: 'WoodWorks Studio'
      },
      { 
        id: 8, 
        name: 'Appliance Repair', 
        icon: '🔌', 
        color: '#F97316', 
        description: 'Fix & Maintain',
        image: getServiceImage('Appliance Repair', 7),
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
            <Text style={styles.sectionSubtitle}>Choose from our top-rated services</Text>
          </View>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => onNavigate('viewAllServices')}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Text style={styles.viewAllIcon}>→</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
        >
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
                        <Text style={styles.categoryRatingText}>⭐ {category.rating}</Text>
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
                        <Text style={styles.categoryRatingText}>⭐ {category.rating}</Text>
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
    const trendingServices = [
      {
        id: 1,
        title: 'Home Cleaning',
        subtitle: 'Professional deep cleaning',
        image: getServiceImage('Cleaning', 0),
        rating: 4.8,
        reviews: 124,
        provider: 'CleanPro Services',
        category: 'Cleaning'
      },
      {
        id: 2,
        title: 'AC Repair',
        subtitle: 'Fast & reliable cooling',
        image: getServiceImage('HVAC', 1),
        rating: 4.9,
        reviews: 89,
        provider: 'CoolTech HVAC',
        category: 'HVAC'
      },
      {
        id: 3,
        title: 'Kitchen Renovation',
        subtitle: 'Modern kitchen makeover',
        image: getServiceImage('Carpentry', 2),
        rating: 4.7,
        reviews: 156,
        provider: 'RenovateRight',
        category: 'Renovation'
      },
      {
        id: 4,
        title: 'Garden Maintenance',
        subtitle: 'Beautiful outdoor spaces',
        image: getServiceImage('Landscaping', 3),
        rating: 4.6,
        reviews: 67,
        provider: 'GreenThumb Landscaping',
        category: 'Landscaping'
      },
      {
        id: 5,
        title: 'Plumbing Services',
        subtitle: 'Emergency & routine repairs',
        image: getServiceImage('Plumbing', 4),
        rating: 4.9,
        reviews: 203,
        provider: 'AquaFix Plumbing',
        category: 'Plumbing'
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
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => onNavigate('viewAllServices')}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Text style={styles.viewAllIcon}>→</Text>
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
                    <Text style={styles.trendingRatingText}>⭐ {service.rating}</Text>
                    <Text style={styles.trendingReviewsText}>({service.reviews})</Text>
                  </View>
                </View>
              </ImageBackground>
              <View style={styles.trendingContent}>
                <View style={styles.trendingHeader}>
                  <Text style={[styles.trendingTitle, { color: colors.text }]}>{service.title}</Text>
                  <View style={styles.trendingCategory}>
                    <Text style={styles.trendingCategoryText}>{service.category}</Text>
                  </View>
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
            <Text style={styles.viewAllIcon}>→</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 15,
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
    backgroundColor: colors.primary + '15',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  viewAllText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 6,
  },
  viewAllIcon: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
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
  categoriesScrollContent: {
    paddingRight: 20,
  },
  categoryCard: {
    width: 240,
    marginRight: 16,
  },
  categoryButton: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 0,
    borderWidth: 0,
    overflow: 'hidden',
    height: 260,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: 140,
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
  },
  categoryImageStyle: {
    borderRadius: 20,
  },
  categoryOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  categoryBadge: {
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
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 10,
    lineHeight: 20,
  },
  categoryCategory: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryCategoryText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 16,
    opacity: 0.8,
    fontWeight: '500',
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
    width: 240,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  trendingImage: {
    width: '100%',
    height: 140,
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
  },
  trendingImageStyle: {
    borderRadius: 20,
  },
  trendingOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 10,
    lineHeight: 20,
  },
  trendingCategory: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendingCategoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trendingSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 10,
    lineHeight: 16,
    opacity: 0.8,
  },
  trendingProvider: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingProviderText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    opacity: 0.7,
  },
});

module.exports = CustomerDashboardScreen;