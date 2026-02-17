const React = require('react');
const { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Animated, Dimensions, StatusBar, ActivityIndicator, Alert } = require('react-native');
const { colors } = require('../../utils/theme');
const { apiService } = require('../../services/api');
const Icon = require('react-native-vector-icons/MaterialIcons').default;
const ServiceRequestDetailModal = require('../../components/ServiceRequestDetailModal');
const ProfessionalListModal = require('../../components/ProfessionalListModal');

const { width, height } = Dimensions.get('window');

const TrackRequestScreen = ({ onNavigate, onBack, isActive }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [selectedFilter, setSelectedFilter] = React.useState('all');
  const [showDetailModal, setShowDetailModal] = React.useState(false);
  const [showProfessionalModal, setShowProfessionalModal] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState(null);
  const [ serviceRequests,setServiceRequests] = React.useState([]);
  const [serviceCategories, setServiceCategories] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [isScreenFocused, setIsScreenFocused] = React.useState(true);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;


  // Fetch service requests from API
  const fetchServiceRequests = React.useCallback(async () => {
    try {
      console.log('🔄 Fetching service requests...');
      setLoading(true);
      setError(null);
      
      // Fetch both service categories and requests in parallel to ensure categories are available
      const [requests, categories] = await Promise.all([
        apiService.getMyServiceRequests(),
        apiService.getServiceCategories().catch(error => {
          console.warn('⚠️ Failed to fetch service categories, using empty array:', error);
          return [];
        })
      ]);
      
      // Update service categories state
      setServiceCategories(categories || []);
      
      // Debug: Log the first request to see the structure
      if (requests.length > 0) {
        console.log('🔍 First request data:', {
          id: requests[0].id,
          title: requests[0].title,
          serviceName: requests[0].serviceName,
          categoryId: requests[0].categoryId,
          categoryName: requests[0].categoryName,
          description: requests[0].description?.substring(0, 50) + '...'
        });
      }
      
      // Debug: Log available service categories
      console.log('📂 Available service categories:', categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon
      })));
      
      // Transform API data to match our component structure

      const transformedRequests = requests.map((request, index) => {
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
          'active': 'radio-button-checked',
          'pending': 'schedule',
          'completed': 'check-circle',
          'cancelled': 'cancel',
          'expired': 'access-time',
          'in_progress': 'play-circle-filled'
        };
        const statusIcon = statusIcons[request.status?.toLowerCase()] || 'radio-button-unchecked';
        // First try to get category name from serviceCategories using categoryId (most reliable)
        let categoryName = 'Service Request';
        let categoryIcon = 'build';
        
        if (request.categoryId && categories && categories.length > 0) {
          const categoryData = categories.find(cat => cat.id === request.categoryId);
          if (categoryData) {
            categoryName = categoryData.name || 'Service Request';
            categoryIcon = categoryData.icon || 'build';
          }
        }
        
        // If no categoryId or not found in serviceCategories, use direct categoryName from API
        if (categoryName === 'Service Request' && request.categoryName) {
          categoryName = request.categoryName;
          categoryIcon = request.categoryIcon || 'build';
        }
        
        // Final fallback - if we still don't have a proper category name, try to use serviceName
        if (categoryName === 'Service Request' && request.serviceName) {
          categoryName = request.serviceName;
        }
        
        // Use REAL professionals from API data - DYNAMIC like web version
        let requestProfessionals = request.professionals || request.acceptedProfessionals || [];

        // Determine the best title to use - prioritize actual service category name
        let finalTitle;
        if (request.title && request.title.trim()) {
          // Use actual request title if available
          finalTitle = request.title.trim();
        } else if (request.serviceName && request.serviceName.trim()) {
          // Use service name if available
          finalTitle = request.serviceName.trim();
        } else if (categoryName && categoryName !== 'Service Request') {
          // Use actual service category name (this is what we want!)
          finalTitle = categoryName;
        } else {
          // Final fallback - no description needed since we have categoryId
          finalTitle = 'Service Request';
        }

        // Debug: Log title decision for first request
        if (index === 0) {
          console.log('📝 Title decision (NO DESCRIPTION):', {
            requestTitle: request.title,
            serviceName: request.serviceName,
            categoryId: request.categoryId,
            categoryName: categoryName,
            categoryIcon: categoryIcon,
            finalTitle: finalTitle,
            note: 'Using actual service category name from categoryId'
          });
        }

        const transformedRequest = {
          id: request.id || index + 1,
          title: finalTitle,
          status: request.status || 'Active',
          statusColor: statusColor,
          statusIcon: statusIcon,
          category: categoryName,
          icon: categoryIcon,
          date: request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'Recently',
          // Keep original date for sorting
          originalDate: request.createdAt || request.created_at || request.date,
          preferredDate: request.preferredDate ? (() => {
            const date = new Date(request.preferredDate);

            
            // Format date to match web version (MMM d format)
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month = months[date.getMonth()];
            const day = date.getDate();
            return `${month} ${day}`;
          })() : 'TBD',
          location: request.location || request.suburb && request.postcode ? 
            `${request.suburb}, ${request.postcode}` : 'Location not specified',
          bookingType: request.bookingType || request.urgency || 'Regular',
          description: request.description || request.notes || 'Service request details',
          provider: request.provider?.name || request.providerName || 'TBD',
          providerRating: request.provider?.rating || request.providerRating || 0,
          estimatedCost: request.estimatedCost || request.cost || 'TBD',
          professionals: requestProfessionals,
          // Preserve offerMetrics for button visibility logic
          offerMetrics: request.offerMetrics || {
            professionalCount: requestProfessionals.length,
            acceptedOffers: requestProfessionals.length
          },
        };
        

        return transformedRequest;
      });
      
      setServiceRequests(transformedRequests);
      dataLoadedRef.current = true; // Mark data as loaded
    } catch (error) {
      console.error('❌ Error fetching service requests:', error);
      // Surface a clearer message for gateway/server outages
      const msg = (error && error.message) ? String(error.message) : '';
      if (msg.toLowerCase().includes('server error')) {
        setError('Service temporarily unavailable. Please try again in a moment.');
      } else {
        setError('Failed to load service requests. Please try again.');
      }
      dataLoadedRef.current = false; // Reset data loaded flag on error
    } finally {
      setLoading(false);
    }
  }, []); // Remove serviceCategories dependency to prevent infinite re-renders

  // Debug: Log all unique status values
  const uniqueStatuses = [...new Set(serviceRequests.map(r => r.status))];

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
    
    // Fetch service requests (which now also fetches categories)
    fetchServiceRequests();
  }, []); // Remove dependencies to prevent infinite re-renders

  // Add a ref to track if component is mounted
  const isMountedRef = React.useRef(true);
  // Add a ref to track if data has been loaded to prevent unnecessary refetches
  const dataLoadedRef = React.useRef(false);
  
  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Refetch data when screen comes into focus
  React.useEffect(() => {
    if (isActive) {
      // Add a small delay to prevent too many API calls
      const timer = setTimeout(() => {
        // Only refetch if there's an actual error and data hasn't been loaded yet
        if (error && !dataLoadedRef.current) {
          // Refetch data when screen becomes active and there's an error
          fetchServiceRequests();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, error]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchServiceRequests();
    setRefreshing(false);
  }, [fetchServiceRequests]);

  const getFilteredRequests = () => {
    let filteredRequests;
    
    if (selectedFilter === 'all') {
      filteredRequests = serviceRequests;
    } else {
      filteredRequests = serviceRequests.filter(request => {
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
    }
    
    // Sort by request date (newest first)
    return filteredRequests.sort((a, b) => {
      // Use the original date field for accurate sorting
      const dateA = new Date(a.originalDate || a.requestDate || a.created_at || a.createdAt || a.date || 0);
      const dateB = new Date(b.originalDate || b.requestDate || b.created_at || b.createdAt || b.date || 0);
      
      // Debug: Log sorting information
      
       // Sort newest first (descending order) - ensure dates are valid numbers
       const timeA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
       const timeB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
       return timeB - timeA;
    });
  };

  const handleRequestPress = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleViewProfessionals = async (request) => {

    
    // If no professionals in request, try to fetch them from API
    if (!request.professionals || request.professionals.length === 0) {
      try {
        // Try to fetch professionals for this specific request
        const professionals = await apiService.getRequestProfessionals(request.id);
        
        // Update the request with fetched professionals
        const updatedRequest = {
          ...request,
          professionals: professionals || []
        };
        setSelectedRequest(updatedRequest);
      } catch (error) {
        console.log('🔍 Error fetching professionals:', error);
        // If API fails, add some test professionals for demonstration
        console.log('🔍 Adding test professionals for demonstration');
        const testProfessionals = [
          {
            id: request.id * 10 + 1,
            name: 'John Smith',
            serviceName: `${request.title || 'Service'} Specialist`,
            email: 'john.smith@example.com',
            phone: '+61 400 123 456',
            rating: 4.8,
            acceptedDate: '2025-09-18'
          }
        ];
        
        const updatedRequest = {
          ...request,
          professionals: testProfessionals
        };
        setSelectedRequest(updatedRequest);
      }
    } else {
      // Use existing professionals
      setSelectedRequest(request);
    }
    
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
    // Check if request is new (created within last 24 hours)
    const isNewRequest = () => {
      const requestDate = new Date(request.originalDate || request.requestDate || request.created_at || request.createdAt || request.date || 0);
      const now = new Date();
       const timeDiff = now.getTime() - requestDate.getTime();
       const hoursDiff = timeDiff / (1000 * 60 * 60);
      return hoursDiff <= 24; // New if created within last 24 hours
    };

    const isNew = isNewRequest();

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

             <View style={styles.requestInfo}>
               <View style={styles.titleRow}>
                 <Text style={styles.requestTitle}>{request.title || request.serviceName || request.category || 'Service Request'}</Text>
                 {/* Show relative time for new requests */}
                 {isNew && (
                   <Text style={styles.timeAgo}>
                     {(() => {
                       const requestDate = new Date(request.originalDate || request.requestDate || request.created_at || request.createdAt || request.date || 0);
                       const now = new Date();
                        const timeDiff = now.getTime() - requestDate.getTime();
                        const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
                        const minutesDiff = Math.floor(timeDiff / (1000 * 60));
                       
                       if (minutesDiff < 60) {
                         return `${minutesDiff}m ago `;
                       } else if (hoursDiff < 24) {
                         return `${hoursDiff}h ago `;
                       } else {
                         return 'Today';
                       }
                     })()}
                   </Text>
                 )}
               </View>
               <Text style={styles.requestCategory}>{request.description}</Text>
               {/* <Text style={styles.requestLocation}>{request.location}</Text> */}
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
                 <Icon name={request.statusIcon} size={12} color={request.statusColor} style={{ marginRight: 3, fontWeight: 'bold' }} />
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
               <Icon name="visibility" size={16} color={colors.primary} style={{ marginRight: 6, fontWeight: 'bold' }} />
               <Text style={styles.actionButtonText}>View Details</Text>
             </TouchableOpacity>
             {(() => {
               // Use SAME logic as web version - check offerMetrics.acceptedOffers
               const acceptedCount = request.offerMetrics?.acceptedOffers || 0;
               

               
               // Show button if there are any accepted professionals/offers (DYNAMIC like web)
               return acceptedCount > 0 ? (
                 <TouchableOpacity 
                   style={[styles.actionButton, styles.professionalsButton]}
                   onPress={() => {
                   
                     handleViewProfessionals(request);
                   }}
                   activeOpacity={0.7}
                 >
                   <Text style={styles.actionButtonIcon}>👥</Text>
                   <Text style={styles.actionButtonText}>
                     View Professionals ({acceptedCount})
                   </Text>
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
         {/* Hero Section */}
         <View style={styles.heroSection}>
           <View style={styles.heroContent}>
             <View style={styles.heroTextContainer}>
               <View style={styles.heroGreetingContainer}>
                 <Icon name="assignment" size={16} color={colors.textSecondary} style={{ marginRight: 6, fontWeight: 'bold' }} />
                 <Text style={styles.heroGreeting}>My Requests</Text>
               </View>
               <Text style={styles.heroTitle}>Track your{'\n'}service requests</Text>
               <Text style={styles.heroSubtitle}>
                 Keep track of all your service requests and their current status
               </Text>
               <TouchableOpacity 
                 style={styles.newRequestButton}
                 onPress={() => onNavigate('requestService')}
               >
                 <Text style={styles.newRequestButtonText}>+ New Request</Text>
               </TouchableOpacity>
             </View>
             <View style={styles.heroImageContainer}>
               <Icon name="analytics" size={32} color={colors.primary} style={{ fontWeight: 'bold' }} />
               <View style={styles.heroImageBg}>
                 <Icon name="check-circle" size={24} color="#4CAF50" style={{ fontWeight: 'bold' }} />
               </View>
             </View>
           </View>
         </View>
          
         {/* Service Requests List Title - Always visible */}

          
          <View style={styles.sectionPadding}>
           {filteredRequests.length > 0 ? (
             filteredRequests.map(renderRequestCard)
           ) : (
             renderEmptyState()
           )}
         </View>
       </ScrollView>

       {/* Modals */}
       <ServiceRequestDetailModal
         visible={showDetailModal}
         onClose={() => setShowDetailModal(false)}
         request={selectedRequest}
       />
       
       <ProfessionalListModal
         visible={showProfessionalModal}
         onClose={() => {
           setShowProfessionalModal(false);
         }}
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
    paddingBottom: 100,
  },
  sectionPadding: {
    paddingHorizontal: 20,
  },
  // List Title Section Styles
  listTitleSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  listSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
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
  heroGreetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  heroGreeting: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
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
  newRequestButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  newRequestButtonText: {
    color: 'white',
    fontSize: 12,
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
    position: 'relative',
  },
  requestIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // NEW badge styles
  newBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Time ago styles
  timeAgo: {
    fontSize: 12,
    color: '#FF4444',
    fontWeight: '600',
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  requestInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
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
