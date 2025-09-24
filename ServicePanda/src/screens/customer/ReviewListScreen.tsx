const React = require('react');
const { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Animated, Dimensions, StatusBar, ActivityIndicator, Alert } = require('react-native');
const { colors } = require('../../utils/theme');
const { apiService } = require('../../services/api');
const Icon = require('react-native-vector-icons/MaterialIcons').default;

const { width, height } = Dimensions.get('window');

const ReviewListScreen = ({ onNavigate, onBack }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [reviews, setReviews] = React.useState([]);
  const [error, setError] = React.useState(null);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  // Fetch reviews from API - using same pattern as TrackRequestScreen
  const fetchReviews = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching reviews from API...');
      
      const reviewData = await apiService.getMyReviews();
      console.log('✅ Fetched reviews:', reviewData);
      
      // Debug: Log the first review to see the structure
      if (reviewData.length > 0) {
        console.log('🔍 First review structure:', JSON.stringify(reviewData[0], null, 2));
      }
      
      if (Array.isArray(reviewData)) {
        setReviews(reviewData);
        console.log('📊 Total reviews loaded:', reviewData.length);
      } else {
        console.warn('⚠️ Reviews data is not an array:', reviewData);
        setReviews([]);
      }
    } catch (error) {
      console.error('❌ Error fetching reviews:', error);
      setError(error.message || 'Failed to load reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Animation setup - same as TrackRequestScreen
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
    fetchReviews();
  }, [fetchReviews]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchReviews();
    setRefreshing(false);
  }, [fetchReviews]);

  const renderStarRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon 
          key={i} 
          name="star" 
          size={16} 
          color={i <= rating ? colors.warning : colors.border}
          style={styles.star}
        />
      );
    }
    return <View style={styles.starContainer}>{stars}</View>;
  };

  const renderDetailedRatings = (review: any) => {
    const ratingCategories = [
      { label: 'Quality', value: review?.qualityRating || 0 },
      { label: 'Professionalism', value: review?.professionalismRating || 0 },
      { label: 'Timeliness', value: review?.timelinessRating || 0 },
      { label: 'Value', value: review?.valueRating || 0 }
    ];

    return (
      <View style={styles.detailedRatings}>
        {ratingCategories.map((category, index) => (
          <View key={category.label} style={styles.ratingRow}>
            <Text style={styles.ratingLabel}>{category.label}:</Text>
            <View style={styles.miniStars}>
              {[1, 2, 3, 4, 5].map(star => (
                <Icon 
                  key={star} 
                  name="star" 
                  size={12} 
                  color={star <= category.value ? colors.warning : colors.border}
                  style={styles.miniStar}
                />
              ))}
            </View>
            <Text style={styles.ratingValue}>{category.value}/5</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderReviewCard = (review: any, index: number) => {
    if (!review) {
      console.warn('ReviewListScreen: Invalid review object at index', index);
      return null;
    }

    const formattedDate = review.createdAt ? 
      new Date(review.createdAt).toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) : 'Date unknown';

    return (
      <View key={review.id || index} style={styles.reviewCard}>
        {/* Header with overall rating */}
        <View style={styles.reviewHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.providerName}>
              {review.providerBusinessName || `${review.providerFirstName || ''} ${review.providerLastName || ''}`.trim() || 'Service Provider'}
            </Text>
            <Text style={styles.serviceName}>
              {review.requestCategory || 'Service'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.overallRating}>
              <Text style={styles.ratingNumber}>{review.overallRating || 0}</Text>
              <Text style={styles.ratingOutOf}>/5</Text>
            </View>
            {renderStarRating(review.overallRating || 0)}
          </View>
        </View>

        {/* Detailed ratings */}
        {renderDetailedRatings(review)}

        {/* Review text */}
        {review.reviewText && (
          <View style={styles.reviewTextContainer}>
            <Text style={styles.reviewTextLabel}>Your Review:</Text>
            <Text style={styles.reviewText}>{review.reviewText}</Text>
          </View>
        )}

        {/* Service description if available */}
        {review.requestDescription && (
          <View style={styles.serviceDescription}>
            <Text style={styles.serviceDescriptionLabel}>Service:</Text>
            <Text style={styles.serviceDescriptionText}>{review.requestDescription}</Text>
          </View>
        )}

        {/* Footer with date */}
        <View style={styles.reviewFooter}>
          <Text style={styles.reviewDate}>Reviewed on {formattedDate}</Text>
          {review.isPublic && (
            <View style={styles.publicBadge}>
              <Text style={styles.publicText}>Public</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="star-border" size={64} color={colors.textSecondary} style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>No Reviews Yet</Text>
      <Text style={styles.emptyMessage}>
        Complete a service request to leave your first review and help other customers find great providers.
      </Text>
      <TouchableOpacity 
        style={styles.emptyButton}
        onPress={() => onNavigate('dashboard')}
      >
        <Text style={styles.emptyButtonText}>Request a Service</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {reviews.length > 0 && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Your Rating Summary</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{reviews.length}</Text>
              <Text style={styles.summaryLabel}>Reviews</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {reviews && reviews.length > 0 ? 
                  (reviews.reduce((sum, r) => sum + (r?.overallRating || 0), 0) / reviews.length).toFixed(1) : 
                  '0.0'
                }
              </Text>
              <Text style={styles.summaryLabel}>Avg Rating</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {reviews && reviews.length > 0 ? reviews.filter(r => r?.overallRating === 5).length : 0}
              </Text>
              <Text style={styles.summaryLabel}>5-Star</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
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
        {renderHeader()}
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading your reviews...</Text>
          </View>
        ) : reviews.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.reviewsList}>
            {reviews && Array.isArray(reviews) ? 
              reviews.map((review, index) => renderReviewCard(review, index)).filter(Boolean) :
              <Text style={styles.errorText}>Unable to load reviews data</Text>
            }
          </View>
        )}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  animatedContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: colors.surface,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.surface,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40, // Same as back button for balance
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.surface,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.surface,
    opacity: 0.8,
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  emptyButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  reviewsList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  headerRight: {
    alignItems: 'center',
  },
  overallRating: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  ratingNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  ratingOutOf: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  starContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 16,
    marginHorizontal: 1,
  },
  detailedRatings: {
    marginBottom: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 14,
    color: colors.text,
    width: 100,
    fontWeight: '500',
  },
  miniStars: {
    flexDirection: 'row',
    marginHorizontal: 8,
  },
  miniStar: {
    fontSize: 12,
    marginHorizontal: 0.5,
  },
  ratingValue: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  reviewTextContainer: {
    marginBottom: 16,
  },
  reviewTextLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontStyle: 'italic',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  serviceDescription: {
    marginBottom: 16,
  },
  serviceDescriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  serviceDescriptionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  publicBadge: {
    backgroundColor: colors.success + '20',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  publicText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: 20,
  },
});

module.exports = ReviewListScreen;
