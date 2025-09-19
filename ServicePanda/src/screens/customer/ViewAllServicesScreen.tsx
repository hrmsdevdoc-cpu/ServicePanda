const React = require('react');
const { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Animated, Dimensions, StatusBar, ActivityIndicator, Alert } = require('react-native');
const { colors } = require('../../utils/theme');
const { apiService } = require('../../services/api');

const { width, height } = Dimensions.get('window');

const ViewAllServicesScreen = ({ onNavigate, onBack }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [serviceCategories, setServiceCategories] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState(null);

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
      
      // Map API data to our expected format
      const mappedCategories = categories.map((category, index) => {
        console.log('Processing category:', category);
        return {
          id: category.id || category._id || index + 1,
          name: category.name || category.title || category.categoryName || 'Service',
          icon: category.icon || '🔧',
          color: category.color || '#3B82F6',
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
          icon: '❄️',
          color: '#10B981',
          description: 'Heating, ventilation, and air conditioning services',
          serviceCount: 15,
          rating: 4.8,
          isPopular: true,
          isNew: false
        },
        {
          id: 2,
          name: 'Plumbing',
          icon: '🔧',
          color: '#3B82F6',
          description: 'Professional plumbing and pipe services',
          serviceCount: 22,
          rating: 4.7,
          isPopular: true,
          isNew: false
        },
        {
          id: 3,
          name: 'Electrical',
          icon: '⚡',
          color: '#F59E0B',
          description: 'Electrical installation and repair services',
          serviceCount: 18,
          rating: 4.6,
          isPopular: false,
          isNew: false
        },
        {
          id: 4,
          name: 'Cleaning',
          icon: '🧹',
          color: '#8B5CF6',
          description: 'House and office cleaning services',
          serviceCount: 25,
          rating: 4.9,
          isPopular: true,
          isNew: false
        },
         {
           id: 5,
           name: 'Event Management',
           icon: '🎉',
           color: '#EC4899',
           description: 'Complete event planning and management',
           serviceCount: 12,
           rating: 4.5,
           isPopular: false,
           isNew: true
         },
         {
           id: 11,
           name: 'Pet Grooming',
           icon: '🐕',
           color: '#F59E0B',
           description: 'Professional pet grooming and care services',
           serviceCount: 7,
           rating: 4.9,
           isPopular: false,
           isNew: true
         },
         {
           id: 12,
           name: 'Home Security',
           icon: '🔒',
           color: '#6B7280',
           description: 'Smart home security and surveillance systems',
           serviceCount: 9,
           rating: 4.6,
           isPopular: false,
           isNew: true
         },
        {
          id: 6,
          name: 'Fitness & Yoga',
          icon: '🧘',
          color: '#06B6D4',
          description: 'Personal training and yoga classes',
          serviceCount: 8,
          rating: 4.8,
          isPopular: false,
          isNew: false
        },
        {
          id: 7,
          name: 'Photography',
          icon: '📸',
          color: '#84CC16',
          description: 'Professional photography services',
          serviceCount: 14,
          rating: 4.7,
          isPopular: false,
          isNew: false
        },
        {
          id: 8,
          name: 'Carpentry',
          icon: '🔨',
          color: '#F97316',
          description: 'Woodworking and furniture services',
          serviceCount: 16,
          rating: 4.6,
          isPopular: false,
          isNew: false
        },
        {
          id: 9,
          name: 'Landscaping',
          icon: '🌱',
          color: '#22C55E',
          description: 'Garden design and maintenance',
          serviceCount: 11,
          rating: 4.4,
          isPopular: false,
          isNew: false
        },
        {
          id: 10,
          name: 'Painting',
          icon: '🎨',
          color: '#EF4444',
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
    
    if (searchQuery) {
      filtered = filtered.filter(category => 
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(category => category.id === selectedCategory.id);
    }
    
    // Sort categories: New services first, then Popular, then by name
    filtered.sort((a, b) => {
      // New services go to the top
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      
      // Popular services go next
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      
      // Then sort by name alphabetically
      return a.name.localeCompare(b.name);
    });
    
    return filtered;
  };


  const renderCategoryCard = (category) => {
    return (
      <Animated.View
        key={category.id}
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
          style={styles.categoryCardContent}
          onPress={() => handleCategoryPress(category)}
        >
          <View style={styles.categoryHeader}>
            <View style={[styles.categoryIcon, { backgroundColor: category.color + '15' }]}>
              <Text style={styles.categoryIconText}>{category.icon}</Text>
            </View>
            <View style={styles.categoryInfo}>
              <View style={styles.categoryTitleRow}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <View style={styles.badgeContainer}>
                  {category.isPopular && (
                    <View style={[styles.badge, styles.popularBadge]}>
                      <Text style={styles.badgeText}>Popular</Text>
                    </View>
                  )}
                  {category.isNew && (
                    <View style={[styles.badge, styles.newBadge]}>
                      <Text style={styles.badgeText}>New</Text>
                    </View>
                  )}
                </View>
              </View>
              <Text style={styles.categoryDescription}>{category.description}</Text>
              <View style={styles.categoryStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>🔧</Text>
                  <Text style={styles.statText}>{category.serviceCount} services</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>⭐</Text>
                  <Text style={styles.statText}>{category.rating}</Text>
                </View>
              </View>
            </View>
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
        {filteredCategories.length > 0 ? (
          filteredCategories.map(renderCategoryCard)
        ) : (
          renderEmptyState()
        )}
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
    padding: 20,
    paddingBottom: 100,
  },
  categoryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryCardContent: {
    padding: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryIconText: {
    fontSize: 28,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadge: {
    backgroundColor: colors.warning + '20',
  },
  newBadge: {
    backgroundColor: colors.success + '20',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
  },
  categoryDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  categoryStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
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
