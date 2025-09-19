const React = require('react');
const { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Animated, Dimensions, StatusBar, ActivityIndicator, Alert } = require('react-native');
const { colors } = require('../../utils/theme');
const { apiService } = require('../../services/api');
const ServiceRequestDetailModal = require('../../components/ServiceRequestDetailModal');
const ProfessionalListModal = require('../../components/ProfessionalListModal');

const { width, height } = Dimensions.get('window');

const TrackRequestScreen = ({ onNavigate, onBack }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [selectedFilter, setSelectedFilter] = React.useState('all');
  const [showDetailModal, setShowDetailModal] = React.useState(false);
  const [showProfessionalModal, setShowProfessionalModal] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState(null);
  const [ serviceRequests,setServiceRequests] = React.useState([]);
  const [error, setError] = React.useState(null);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  // Fetch service requests from API
  const fetchServiceRequests = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching service requests from API...');
      
      const requests = await apiService.getMyServiceRequests();
      console.log('✅ Fetched service requests:', requests);
      
      // Debug: Log the first request to see the structure
      if (requests.length > 0) {
        console.log('🔍 First request structure:', JSON.stringify(requests[0], null, 2));
      }
      
      // Transform API data to match our component structure
      const transformedRequests = requests.map((request, index) => {
        // Debug: Log category fields for each request
        if (index === 0) {
          console.log('🔍 Full request object keys:', Object.keys(request));
          console.log('🔍 Category fields available:', {
            'request.category': request.category,
            'request.categoryName': request.categoryName,
            'request.serviceCategory': request.serviceCategory,
            'request.serviceType': request.serviceType,
            'request.title': request.title,
            'request.description': request.description
          });
          console.log('🔍 All request properties:', request);
        }
        // Map status to colors with better visual distinction
        const statusColor = {
          'active': '#10B981',        // Green - Active
          'pending': '#F59E0B',       // Amber - Pending
          'completed': '#059669',     // Dark Green - Completed
          'cancelled': '#EF4444',     // Red - Cancelled
          'expired': '#DC2626',       // Dark Red - Expired
          'in_progress': '#3B82F6'    // Blue - In Progress
        }[request.status?.toLowerCase()] || colors.primary;

        // Map status to icons
        const statusIcons = {
          'active': '🟢',
          'pending': '🟡',
          'completed': '✅',
          'cancelled': '❌',
          'expired': '⏰',
          'in_progress': '🔵'
        };
        const statusIcon = statusIcons[request.status?.toLowerCase()] || '🔵';

        // Map category to icon
        const categoryIcons = {
          'hvac': '❄️',
          'plumbing': '🔧',
          'electrical': '⚡',
          'cleaning': '🧹',
          'event management': '🎉',
          'fitness': '🧘',
          'photography': '📸',
          'carpentry': '🔨',
          'landscaping': '🌱',
          'painting': '🎨'
        };
        
        // Get category name from various possible fields
        let categoryName = request.category?.name || 
                          request.categoryName || 
                          request.category || 
                          request.serviceCategory?.name ||
                          request.serviceCategory ||
                          request.serviceType ||
                          request.type ||
                          request.service?.name ||
                          request.service ||
                          'Service';

        // If category is still "Service", try to extract from title or other fields
        if (categoryName === 'Service') {
          const title = request.title || '';
          const description = request.description || '';
          
          // Try to extract category from title or description
          if (title.toLowerCase().includes('hvac') || description.toLowerCase().includes('hvac')) {
            categoryName = 'HVAC';
          } else if (title.toLowerCase().includes('plumb') || description.toLowerCase().includes('plumb')) {
            categoryName = 'Plumbing';
          } else if (title.toLowerCase().includes('electr') || description.toLowerCase().includes('electr')) {
            categoryName = 'Electrical';
          } else if (title.toLowerCase().includes('clean') || description.toLowerCase().includes('clean')) {
            categoryName = 'Cleaning';
          } else if (title.toLowerCase().includes('event') || description.toLowerCase().includes('event')) {
            categoryName = 'Event Management';
          } else if (title.toLowerCase().includes('fitness') || description.toLowerCase().includes('fitness')) {
            categoryName = 'Fitness & Yoga';
          } else if (title.toLowerCase().includes('photo') || description.toLowerCase().includes('photo')) {
            categoryName = 'Photography';
          } else if (title.toLowerCase().includes('carpent') || description.toLowerCase().includes('carpent')) {
            categoryName = 'Carpentry';
          } else if (title.toLowerCase().includes('landscap') || description.toLowerCase().includes('landscap')) {
            categoryName = 'Landscaping';
          } else if (title.toLowerCase().includes('paint') || description.toLowerCase().includes('paint')) {
            categoryName = 'Painting';
          } else {
            // Temporary: Assign different categories based on index for testing
            const testCategories = ['HVAC', 'Plumbing', 'Electrical', 'Cleaning', 'Event Management', 'Fitness & Yoga', 'Photography', 'Carpentry'];
            categoryName = testCategories[index % testCategories.length] || 'Service';
          }
        }

        const categoryIcon = categoryIcons[categoryName?.toLowerCase()] || '🔧';

        // Debug: Log what category name was extracted
        if (index === 0) {
          console.log('🔍 Extracted category name:', categoryName);
          console.log('🔍 Category icon:', categoryIcon);
          console.log('🔍 Professionals data:', request.professionals);
          console.log('🔍 Professionals length:', request.professionals?.length);
        }

        // Add test professionals for the first few requests to test the functionality
        let testProfessionals = [];
        if (index < 2) { // Add professionals to first 2 requests for testing
          testProfessionals = [
            {
              id: index * 10 + 1,
              name: `Professional ${index + 1}`,
              serviceName: `${categoryName} Specialist`,
              email: `professional${index + 1}@example.com`,
              phone: `+61 400 ${100 + index} ${200 + index}`,
              rating: 4.5 + (index * 0.2),
              acceptedDate: new Date().toISOString().split('T')[0]
            }
          ];
        }

        return {
          id: request.id || index + 1,
          title: request.title || request.serviceType || categoryName || 'Service Request',
          status: request.status || 'Active',
          statusColor: statusColor,
          statusIcon: statusIcon,
          category: categoryName,
          icon: categoryIcon,
          date: request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'Recently',
          preferredDate: request.preferredDate || request.date || 'TBD',
          location: request.location || request.suburb && request.postcode ? 
            `${request.suburb}, ${request.postcode}` : 'Location not specified',
          bookingType: request.bookingType || request.urgency || 'Regular',
          description: request.description || request.notes || 'Service request details',
          provider: request.provider?.name || request.providerName || 'TBD',
          providerRating: request.provider?.rating || request.providerRating || 0,
          estimatedCost: request.estimatedCost || request.cost || 'TBD',
          professionals: request.professionals || request.acceptedProfessionals || testProfessionals,
        };
      });
      
      setServiceRequests(transformedRequests);
    } catch (error) {
      console.error('❌ Error fetching service requests:', error);
      setError('Failed to load service requests. Please try again.');
      
      // Fallback to dummy data for testing
      const dummyRequests = [
        {
          id: 1,
          title: 'HVAC Repair',
          status: 'Active',
          statusColor: '#10B981',
          statusIcon: '🟢',
          category: 'HVAC',
          icon: '❄️',
          date: '9/18/2025',
          preferredDate: '9/20/2025',
          location: 'Brisbane, 4000',
          bookingType: 'Emergency',
          description: 'Air conditioning unit not working',
          provider: 'Cool Air Solutions',
          providerRating: 4.7,
          estimatedCost: '$150 - $200',
          professionals: [
            {
              id: 1,
              name: 'John Smith',
              serviceName: 'HVAC Repair Specialist',
              email: 'john.smith@coolair.com',
              phone: '+61 400 123 456',
              rating: 4.8,
              acceptedDate: '2025-09-18'
            },
            {
              id: 2,
              name: 'Sarah Johnson',
              serviceName: 'Air Conditioning Expert',
              email: 'sarah.j@coolair.com',
              phone: '+61 400 789 012',
              rating: 4.9,
              acceptedDate: '2025-09-18'
            }
          ]
        },
        {
          id: 2,
          title: 'Plumbing Service',
          status: 'Completed',
          statusColor: '#059669',
          statusIcon: '✅',
          category: 'Plumbing',
          icon: '🔧',
          date: '9/17/2025',
          preferredDate: '9/19/2025',
          location: 'Brisbane, 4000',
          bookingType: 'Regular',
          description: 'Kitchen sink repair needed',
          provider: 'Fix-It Plumbing',
          providerRating: 4.8,
          estimatedCost: '$120 - $180',
          professionals: [
            {
              id: 3,
              name: 'Mike Wilson',
              serviceName: 'Plumbing Specialist',
              email: 'mike.w@fixitplumbing.com',
              phone: '+61 400 345 678',
              rating: 4.7,
              acceptedDate: '2025-09-17'
            }
          ]
        },
        {
          id: 3,
          title: 'Electrical Work',
          status: 'Pending',
          statusColor: '#F59E0B',
          statusIcon: '🟡',
          category: 'Electrical',
          icon: '⚡',
          date: '9/16/2025',
          preferredDate: '9/21/2025',
          location: 'Brisbane, 4000',
          bookingType: 'Regular',
          description: 'Light fixture installation',
          provider: 'Bright Electric',
          providerRating: 4.9,
          estimatedCost: '$80 - $120',
          professionals: []
        },
        {
          id: 4,
          title: 'Cleaning Service',
          status: 'Cancelled',
          statusColor: '#EF4444',
          statusIcon: '❌',
          category: 'Cleaning',
          icon: '🧹',
          date: '9/15/2025',
          preferredDate: '9/18/2025',
          location: 'Brisbane, 4000',
          bookingType: 'Regular',
          description: 'House cleaning service',
          provider: 'Clean Pro',
          providerRating: 4.5,
          estimatedCost: '$100 - $150',
          professionals: []
        },
        {
          id: 5,
          title: 'Garden Maintenance',
          status: 'Expired',
          statusColor: '#DC2626',
          statusIcon: '⏰',
          category: 'Landscaping',
          icon: '🌱',
          date: '9/10/2025',
          preferredDate: '9/12/2025',
          location: 'Brisbane, 4000',
          bookingType: 'Regular',
          description: 'Garden maintenance service',
          provider: 'Green Thumb',
          providerRating: 4.3,
          estimatedCost: '$80 - $120',
          professionals: []
        }
      ];
      setServiceRequests(dummyRequests);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debug: Log all unique status values
  const uniqueStatuses = [...new Set(serviceRequests.map(r => r.status))];
  console.log('🔍 All unique status values:', uniqueStatuses);

  const filters = [
    { id: 'all', label: 'All', count: serviceRequests.length },
    { 
      id: 'active', 
      label: 'Active', 
      count: serviceRequests.filter(r => 
        r.status?.toLowerCase() === 'active' || 
        r.status?.toLowerCase() === 'pending' ||
        r.status?.toLowerCase() === 'in_progress'
      ).length 
    },
    { 
      id: 'completed', 
      label: 'Completed', 
      count: serviceRequests.filter(r => 
        r.status?.toLowerCase() === 'completed' || 
        r.status?.toLowerCase() === 'done' ||
        r.status?.toLowerCase() === 'finished'
      ).length 
    },
    { 
      id: 'cancelled', 
      label: 'Cancelled', 
      count: serviceRequests.filter(r => 
        r.status?.toLowerCase() === 'cancelled' || 
        r.status?.toLowerCase() === 'canceled'
      ).length 
    },
    { 
      id: 'expired', 
      label: 'Expired', 
      count: serviceRequests.filter(r => 
        r.status?.toLowerCase() === 'expired'
      ).length 
    }
  ];

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
    
    // Fetch service requests from API
    fetchServiceRequests();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchServiceRequests();
    setRefreshing(false);
  }, []);

  const getFilteredRequests = () => {
    if (selectedFilter === 'all') return serviceRequests;
    return serviceRequests.filter(request => {
      const status = request.status?.toLowerCase();
      switch (selectedFilter) {
        case 'active':
          return status === 'active' || status === 'pending' || status === 'in_progress';
        case 'completed':
          return status === 'completed' || status === 'done' || status === 'finished';
        case 'cancelled':
          return status === 'cancelled' || status === 'canceled';
        case 'expired':
          return status === 'expired';
        default:
          return true;
      }
    });
  };

  const handleRequestPress = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleViewProfessionals = (request) => {
    console.log('🔍 Opening professionals modal for request:', request.id);
    console.log('🔍 Professionals data:', request.professionals);
    setSelectedRequest(request);
    setShowProfessionalModal(true);
  };

  const handleCallProvider = (request) => {
    Alert.alert('Call Provider', `Calling ${request.provider}...`);
  };

  const handleMessageProvider = (request) => {
    Alert.alert('Message Provider', `Messaging ${request.provider}...`);
  };

  // const renderHeader = () => {
  //   return (
  //     <Animated.View 
  //       style={[
  //         styles.header,
  //         {
  //           opacity: fadeAnim,
  //           transform: [
  //             { translateY: slideAnim }
  //           ]
  //         }
  //       ]}
  //     >

  //     </Animated.View>
  //   );
  // };

  const renderFilterTabs = () => {
    const getFilterColor = (filterId) => {
      switch (filterId) {
        case 'active': return '#10B981';
        case 'completed': return '#059669';
        case 'cancelled': return '#EF4444';
        case 'expired': return '#DC2626';
        default: return colors.primary;
      }
    };

    return (
      <Animated.View 
        style={[
          styles.filterContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {filters.map((filter) => {
            const filterColor = getFilterColor(filter.id);
            const isSelected = selectedFilter === filter.id;
            
            return (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterTab,
                  isSelected && {
                    backgroundColor: filterColor,
                    borderColor: filterColor,
                  }
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <Text style={[
                  styles.filterTabText,
                  isSelected && { color: '#FFFFFF' }
                ]}>
                  {filter.label}
                </Text>
                <View style={[
                  styles.filterBadge,
                  isSelected && { backgroundColor: '#FFFFFF' }
                ]}>
                  <Text style={[
                    styles.filterBadgeText,
                    isSelected && { color: filterColor }
                  ]}>
                    {filter.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>
    );
  };

  const renderRequestCard = (request) => {
    return (
      <Animated.View
        key={request.id}
        style={[
          styles.requestCard,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <View style={styles.requestCardContent}>
           <View style={styles.requestHeader}>
             <View style={styles.requestIconContainer}>
               <View style={[styles.requestIcon, { backgroundColor: request.statusColor + '15' }]}>
                 <Text style={styles.requestIconText}>{request.icon}</Text>
               </View>
             </View>
             <View style={styles.requestInfo}>
               <View style={styles.titleRow}>
                 <Text style={styles.requestTitle}>{request.title}</Text>
               </View>
               <Text style={styles.requestCategory}>{request.category}</Text>
               <Text style={styles.requestLocation}>{request.location}</Text>
             </View>
             <View style={styles.statusContainer}>
               <View style={[
                 styles.statusBadge, 
                 { 
                   backgroundColor: request.statusColor + '15',
                   borderColor: request.statusColor + '40',
                   borderWidth: 1
                 }
               ]}>
                 <Text style={styles.statusIcon}>{request.statusIcon}</Text>
                 <Text style={[styles.statusText, { color: request.statusColor }]}>
                   {request.status}
                 </Text>
               </View>
               <View style={[styles.bookingTypeBadge, { backgroundColor: colors.primary + '20' }]}>
                 <Text style={[styles.bookingTypeText, { color: colors.primary }]}>
                   {request.bookingType}
                 </Text>
               </View>
             </View>
           </View>

           <View style={styles.requestDetails}>
             <View style={styles.detailRow}>
               <Text style={styles.detailLabel}>Location:</Text>
               <Text style={styles.detailValue}>{request.location}</Text>
             </View>
             <View style={styles.detailRow}>
               <Text style={styles.detailLabel}>Preferred Date:</Text>
               <Text style={styles.detailValue}>{request.preferredDate}</Text>
             </View>
             <View style={styles.detailRow}>
               <Text style={styles.detailLabel}>Request Date:</Text>
               <Text style={styles.detailValue}>{request.date}</Text>
             </View>
           </View>


           <View style={styles.actionButtons}>
             <TouchableOpacity 
               style={[styles.actionButton, styles.detailsButton]}
               onPress={() => handleRequestPress(request)}
             >
               <Text style={styles.actionButtonIcon}>👁️</Text>
               <Text style={styles.actionButtonText}>View Details</Text>
             </TouchableOpacity>
             {(() => {
               const hasProfessionals = request.professionals && request.professionals.length > 0;
               console.log(`🔍 Request ${request.id}: hasProfessionals = ${hasProfessionals}, professionals =`, request.professionals);
               return hasProfessionals ? (
                 <TouchableOpacity 
                   style={[styles.actionButton, styles.professionalsButton]}
                   onPress={() => handleViewProfessionals(request)}
                 >
                   <Text style={styles.actionButtonIcon}>👥</Text>
                   <Text style={styles.actionButtonText}>View Professionals ({request.professionals.length})</Text>
                 </TouchableOpacity>
               ) : null;
             })()}
           </View>
        </View>
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
        <Text style={styles.emptyStateIcon}>📋</Text>
        <Text style={styles.emptyStateTitle}>No requests found</Text>
        <Text style={styles.emptyStateSubtitle}>
          {selectedFilter === 'all' 
            ? "You haven't made any service requests yet"
            : `No ${selectedFilter} requests found`
          }
        </Text>
        <TouchableOpacity 
          style={styles.emptyStateButton}
          onPress={() => onNavigate('requestService')}
        >
          <Text style={styles.emptyStateButtonText}>Request a Service</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your requests...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Error Loading Requests</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchServiceRequests}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const filteredRequests = getFilteredRequests();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* {renderHeader()} */}
      {renderFilterTabs()}
      
       <ScrollView 
         style={styles.scrollView}
         contentContainerStyle={styles.scrollContent}
         refreshControl={
           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
         }
         showsVerticalScrollIndicator={false}
       >
         {filteredRequests.length > 0 ? (
           filteredRequests.map(renderRequestCard)
         ) : (
           renderEmptyState()
         )}
       </ScrollView>

       {/* Modals */}
       <ServiceRequestDetailModal
         visible={showDetailModal}
         onClose={() => setShowDetailModal(false)}
         request={selectedRequest}
       />
       
       <ProfessionalListModal
         visible={showProfessionalModal}
         onClose={() => setShowProfessionalModal(false)}
         professionals={selectedRequest?.professionals || []}
         serviceRequest={selectedRequest}
       />
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 18,
  },
  filterContainer: {
    backgroundColor: colors.surface,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterScrollContent: {
    paddingHorizontal: 20,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginRight: 8,
  },
  filterTabTextActive: {
    color: colors.surface,
  },
  filterBadge: {
    backgroundColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: colors.surface,
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  filterBadgeTextActive: {
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  requestCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  requestCardContent: {
    padding: 20,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  requestIconContainer: {
    marginRight: 12,
  },
  requestIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestIconText: {
    fontSize: 24,
  },
  requestInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  requestCategory: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  requestLocation: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 50,
  },
  bookingTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bookingTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 4,
  },
  statusIcon: {
    fontSize: 10,
    marginRight: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  requestDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  detailsButton: {
    backgroundColor: colors.primary + '15',
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  professionalsButton: {
    backgroundColor: colors.success + '15',
    borderWidth: 1,
    borderColor: colors.success + '30',
  },
  actionButtonIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
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
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

module.exports = TrackRequestScreen;
