const React = require('react');
const { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Animated, Dimensions, StatusBar, ActivityIndicator, Alert, ImageBackground, TextInput, Image } = require('react-native');
const { colors } = require('../../utils/theme');
const { apiService } = require('../../services/api');
const { API_BASE_URL } = require('../../config/api');
// Removed getServiceImageWithFallback - using only dynamic images now

const { width, height } = Dimensions.get('window');

const ViewAllServicesScreen = ({ onNavigate, onBack }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [serviceCategories, setServiceCategories] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [activeFilter, setActiveFilter] = React.useState('all'); // 'all', 'top_rated', 'popular', 'new'

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  // Fetch service categories from API
  const fetchServiceCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching service categories from API...');
      
      const categories = await apiService.getServiceCategories();
      console.log('✅ Fetched service categories:', categories);
      console.log('📊 Total categories received:', categories.length);
      console.log('🔍 First category sample:', categories[0]);
      
      // Map API data to our expected format
      const mappedCategories = categories.map((category, index) => {
        console.log('Processing category:', category);
        const serviceName = category.name || category.title || category.categoryName || 'Service';
        
        // Use only dynamic images from API - imageUrl is the main database column (camelCase)
        let imageUrl = category.imageUrl || category.image_url || category.image || category.photo || category.thumbnail;
        
        // Debug logging to see what we're getting from API
        console.log('🔍 Category data from API:', {
          id: category.id,
          name: serviceName,
          imageUrl: category.imageUrl,
          image_url: category.image_url,
          image: category.image,
          photo: category.photo,
          thumbnail: category.thumbnail,
          finalImageUrl: imageUrl
        });
        
        // If we have an image URL, make sure it's a full URL
        if (imageUrl && imageUrl.trim() !== '') {
          // If it's a relative path (starts with /), add the base URL
          if (imageUrl.startsWith('/')) {
            const baseUrl = API_BASE_URL; // Production API URL
            imageUrl = baseUrl + imageUrl;
            console.log('🔧 Converted relative path to full URL:', imageUrl);
          }
          console.log('✅ Using dynamic image:', imageUrl);
        } else {
          // If no dynamic image, use a placeholder
          imageUrl = 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=' + encodeURIComponent(serviceName);
          console.log('⚠️ No dynamic image found, using placeholder:', imageUrl);
        }
        
        return {
          id: category.id || category._id || index + 1,
          name: serviceName,
          color: category.color || '#3B82F6',
          image: imageUrl,
          description: category.description || category.desc || 'Professional service',
          serviceCount: category.serviceCount || Math.floor(Math.random() * 20) + 5, // Random count for demo
          rating: category.rating || (4.0 + Math.random() * 1.0).toFixed(1), // Random rating
          isPopular: category.isPopular || Math.random() > 0.7, // Random popularity
          isNew: category.isNew || Math.random() > 0.8 // Random new status
        };
      });
      
      setServiceCategories(mappedCategories);
    } catch (error) {
      console.error('❌ Error fetching service categories:', error);
      setError('Failed to load service categories. Please try again.');
      
      // Fallback to dummy data for testing
      const dummyCategories = [
        {
          id: 1,
          name: 'HVAC Services',
          color: '#10B981',
          image: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=HVAC+Services',
          description: 'Heating, ventilation, and air conditioning services',
          serviceCount: 15,
          rating: 4.8,
          isPopular: true,
          isNew: false
        },
        {
          id: 2,
          name: 'Plumbing',
          color: '#3B82F6',
          image: 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Plumbing',
          description: 'Professional plumbing and pipe services',
          serviceCount: 22,
          rating: 4.7,
          isPopular: true,
          isNew: false
        },
        {
          id: 3,
          name: 'Electrical',
          color: '#F59E0B',
          image: 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Electrical',
          description: 'Electrical installation and repair services',
          serviceCount: 18,
          rating: 4.6,
          isPopular: false,
          isNew: false
        },
        {
          id: 4,
          name: 'Cleaning',
          color: '#8B5CF6',
          image: 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Cleaning',
          description: 'House and office cleaning services',
          serviceCount: 25,
          rating: 4.9,
          isPopular: true,
          isNew: false
        },
         {
           id: 5,
           name: 'Event Management',
           color: '#EC4899',
           image: 'https://via.placeholder.com/400x300/EC4899/FFFFFF?text=Event+Management',
           description: 'Complete event planning and management',
           serviceCount: 12,
           rating: 4.5,
           isPopular: false,
           isNew: true
         },
         {
           id: 11,
           name: 'Pet Grooming',
           color: '#F59E0B',
           image: 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Pet+Grooming',
           description: 'Professional pet grooming and care services',
           serviceCount: 7,
           rating: 4.9,
           isPopular: false,
           isNew: true
         },
         {
           id: 12,
           name: 'Home Security',
           color: '#6B7280',
           image: 'https://via.placeholder.com/400x300/6B7280/FFFFFF?text=Home+Security',
           description: 'Smart home security and surveillance systems',
           serviceCount: 9,
           rating: 4.6,
           isPopular: false,
           isNew: true
         },
        {
          id: 6,
          name: 'Fitness & Yoga',
          color: '#06B6D4',
          image: 'https://via.placeholder.com/400x300/06B6D4/FFFFFF?text=Fitness+%26+Yoga',
          description: 'Personal training and yoga classes',
          serviceCount: 8,
          rating: 4.8,
          isPopular: false,
          isNew: false
        },
        {
          id: 7,
          name: 'Photography',
          color: '#84CC16',
          image: 'https://via.placeholder.com/400x300/84CC16/FFFFFF?text=Photography',
          description: 'Professional photography services',
          serviceCount: 14,
          rating: 4.7,
          isPopular: false,
          isNew: false
        },
        {
          id: 8,
          name: 'Carpentry',
          color: '#F97316',
          image: 'https://via.placeholder.com/400x300/F97316/FFFFFF?text=Carpentry',
          description: 'Woodworking and furniture services',
          serviceCount: 16,
          rating: 4.6,
          isPopular: false,
          isNew: false
        },
        {
          id: 9,
          name: 'Landscaping',
          color: '#22C55E',
          image: 'https://via.placeholder.com/400x300/22C55E/FFFFFF?text=Landscaping',
          description: 'Garden design and maintenance',
          serviceCount: 11,
          rating: 4.4,
          isPopular: false,
          isNew: false
        },
        {
          id: 10,
          name: 'Painting',
          color: '#EF4444',
          image: 'https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Painting',
          description: 'Interior and exterior painting services',
          serviceCount: 19,
          rating: 4.5,
          isPopular: false,
          isNew: false
        }
      ];
      setServiceCategories(dummyCategories);
    } finally {
      setLoading(false);
    }
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
      ]).start();
    };

    startAnimations();
    fetchServiceCategories();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchServiceCategories();
    setRefreshing(false);
  }, []);

  const handleCategoryPress = (category) => {
    console.log('Category selected:', category);
    // Navigate to service request screen with selected category
    onNavigate('requestService', { selectedCategory: category });
  };

  const getFilteredCategories = () => {
    let filtered = serviceCategories;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(category => 
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply selected category filter
    if (selectedCategory) {
      filtered = filtered.filter(category => category.id === selectedCategory.id);
    }
    
    // Apply filter buttons
    switch (activeFilter) {
      case 'top_rated':
        filtered = filtered.filter(category => parseFloat(category.rating) >= 4.5);
        break;
      case 'popular':
        filtered = filtered.filter(category => category.isPopular);
        break;
      case 'new':
        filtered = filtered.filter(category => category.isNew);
        break;
      default: // 'all'
        break;
    }
    
    // Sort categories based on active filter
    filtered.sort((a, b) => {
      switch (activeFilter) {
        case 'top_rated':
          // Sort by rating (highest first)
          return parseFloat(b.rating) - parseFloat(a.rating);
        case 'popular':
          // Popular first, then by name
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return a.name.localeCompare(b.name);
        case 'new':
          // New first, then by name
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return a.name.localeCompare(b.name);
        default:
          // Default sorting: New first, then Popular, then by name
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return a.name.localeCompare(b.name);
      }
    });
    
    return filtered;
  };


  const renderCategoryListItem = (category) => {
    return (
      <Animated.View
        key={category.id}
        style={[
          styles.listItem,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.listItemContent}
          onPress={() => handleCategoryPress(category)}
          activeOpacity={0.7}
        >
          {/* Service Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: category.image }}
              style={styles.serviceImage}
              defaultSource={{ uri: 'https://via.placeholder.com/60x60/E5E7EB/9CA3AF?text=Service' }}
            />
            {/* Single badge overlay */}
            {(category.isPopular || category.isNew) && (
              <View style={[
                styles.badgeOverlay,
                { backgroundColor: category.isNew ? '#4CAF50' : '#FF6B35' }
              ]}>
                <Text style={styles.overlayBadgeText}>
                  {category.isNew ? 'NEW' : 'HOT'}
                </Text>
              </View>
            )}
          </View>

          {/* Service Info */}
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{category.name}</Text>
            <Text style={styles.serviceDescription} numberOfLines={2}>
              {category.description}
            </Text>
            
            {/* Rating and Stats */}
            <View style={styles.statsRow}>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>⭐ {category.rating}</Text>
                <Text style={styles.serviceCountText}>
                  {category.serviceCount} services
                </Text>
              </View>
            </View>
          </View>

          {/* Action Button */}
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={() => handleCategoryPress(category)}
              activeOpacity={0.8}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmptyState = () => {
    return (
      <Animated.View 
        style={[
          styles.emptyState,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.emptyStateIcon}>🔍</Text>
        <Text style={styles.emptyStateTitle}>No services found</Text>
        <Text style={styles.emptyStateSubtitle}>
          {searchQuery 
            ? `No services match "${searchQuery}"`
            : 'No service categories available'
          }
        </Text>
        {searchQuery && (
          <TouchableOpacity 
            style={styles.clearSearchButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearSearchButtonText}>Clear Search</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Error Loading Services</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchServiceCategories}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const filteredCategories = getFilteredCategories();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* {renderHeader()} */}
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroGreeting}>👋 Welcome!</Text>
              <Text style={styles.heroTitle}>What service do{'\n'}you need?</Text>
              <Text style={styles.heroSubtitle}>
                Browse our professional services and find the perfect provider for your needs
              </Text>
              <TouchableOpacity 
                style={styles.getStartedButton}
                onPress={() => {
                  // Scroll to categories or highlight search
                  if (filteredCategories.length > 0) {
                    handleCategoryPress(filteredCategories[0]);
                  }
                }}
              >
                <Text style={styles.getStartedButtonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.heroImageContainer}>
              <Text style={styles.heroEmoji}>🔧</Text>
              <View style={styles.heroImageBg}>
                <Text style={styles.serviceIcon}>⚡</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, styles.sectionPadding]}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search services..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textSecondary}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => {
                  setSearchQuery('');
                  setActiveFilter('all'); // Reset filter when clearing search
                }}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Search Results Counter & Filters */}
        <View style={[styles.headerSection, styles.sectionPadding]}>
          {searchQuery.length > 0 ? (
            <Text style={styles.searchResultsText}>
              {filteredCategories.length} service{filteredCategories.length !== 1 ? 's' : ''} found
            </Text>
          ) : (
            <Text style={styles.totalServicesText}>
              {filteredCategories.length} services available
            </Text>
          )}
          
          {/* Filter Chips */}
          <View style={styles.filterChips}>
            <TouchableOpacity 
              style={[
                styles.filterChip, 
                activeFilter === 'all' && styles.filterChipActive
              ]}
              onPress={() => setActiveFilter('all')}
            >
              <Text style={[
                styles.filterChipText,
                activeFilter === 'all' && styles.filterChipTextActive
              ]}>📋 All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.filterChip, 
                activeFilter === 'top_rated' && styles.filterChipActive
              ]}
              onPress={() => setActiveFilter('top_rated')}
            >
              <Text style={[
                styles.filterChipText,
                activeFilter === 'top_rated' && styles.filterChipTextActive
              ]}>⭐ Top Rated</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.filterChip, 
                activeFilter === 'popular' && styles.filterChipActive
              ]}
              onPress={() => setActiveFilter('popular')}
            >
              <Text style={[
                styles.filterChipText,
                activeFilter === 'popular' && styles.filterChipTextActive
              ]}>🔥 Popular</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.filterChip, 
                activeFilter === 'new' && styles.filterChipActive
              ]}
              onPress={() => setActiveFilter('new')}
            >
              <Text style={[
                styles.filterChipText,
                activeFilter === 'new' && styles.filterChipTextActive
              ]}>🆕 New</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.sectionPadding}>
          {filteredCategories.length > 0 ? (
            <View style={styles.servicesList}>
              {filteredCategories.map(renderCategoryListItem)}
            </View>
          ) : (
            renderEmptyState()
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 40,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  retryButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: colors.surface,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionPadding: {
    paddingHorizontal: 20,
  },
  // Hero Section Styles
  heroSection: {
    backgroundColor: colors.primary + '08',
    padding: 24,
    marginBottom: 0,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  heroGreeting: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 28,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  getStartedButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  getStartedButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  heroImageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  heroImageBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary + '30',
  },
  serviceIcon: {
    fontSize: 24,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingRight: 50,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    flex: 1,
  },
  clearButton: {
    position: 'absolute',
    right: 15,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.textSecondary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerSection: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  searchResultsText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 12,
  },
  totalServicesText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterChips: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border + '40',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    elevation: 3,
  },
  filterChipText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  servicesList: {
    flexDirection: 'column',
    gap: 8,
  },
  listItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border + '15',
  },
  listItemContent: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  serviceImage: {
    width: 65,
    height: 65,
    borderRadius: 12,
    backgroundColor: colors.border + '20',
  },
  serviceInfo: {
    flex: 1,
    marginRight: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
    lineHeight: 20,
  },
  serviceDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  serviceCountText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionContainer: {
    alignItems: 'center',
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  badgeOverlay: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'white',
  },
  overlayBadgeText: {
    fontSize: 7,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  clearSearchButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  clearSearchButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

module.exports = ViewAllServicesScreen;
