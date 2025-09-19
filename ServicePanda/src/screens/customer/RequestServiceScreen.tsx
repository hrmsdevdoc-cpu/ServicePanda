const React = require('react');
const { useState, useEffect } = require('react');
const { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Alert,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar,
  Platform
} = require('react-native');
// Using built-in date picker instead of external package
const { colors } = require('../../utils/theme');
const { apiService } = require('../../services/api');

const { width, height } = Dimensions.get('window');

const RequestServiceScreen = ({ onNavigate, onBack, navigationData = {} }) => {
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [postcode, setPostcode] = useState('');
  const [suburb, setSuburb] = useState('');
  const [postcodeSearch, setPostcodeSearch] = useState('');
  const [suburbs, setSuburbs] = useState([]);
  const [preferredDate, setPreferredDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bookingType, setBookingType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceCategories, setServiceCategories] = useState([]);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;
  const selectedServiceAnim = React.useRef(new Animated.Value(1)).current;

  // Fetch service categories
  const fetchServiceCategories = async () => {
    try {
      console.log('🔄 Fetching service categories...');
      const categories = await apiService.getServiceCategories();
      console.log('✅ Fetched service categories:', categories);
      
      // Map API data to our expected format
      const mappedCategories = categories.map((category, index) => {
        return {
          id: category.id || category._id || index + 1,
          name: category.name || category.title || category.categoryName || 'Service',
          icon: category.icon || '🔧',
          color: category.color || '#3B82F6',
        };
      });
      
      setServiceCategories(mappedCategories);
    } catch (error) {
      console.error('❌ Error fetching service categories:', error);
      // Fallback to static categories
      const fallbackCategories = [
        { id: 1, name: 'Plumbing', icon: '🔧', color: '#3B82F6' },
        { id: 2, name: 'Electrical', icon: '⚡', color: '#F59E0B' },
        { id: 3, name: 'HVAC', icon: '❄️', color: '#10B981' },
        { id: 4, name: 'Cleaning', icon: '🧹', color: '#8B5CF6' },
        { id: 5, name: 'Landscaping', icon: '🌱', color: '#06B6D4' },
        { id: 6, name: 'Painting', icon: '🎨', color: '#EF4444' },
        { id: 7, name: 'Carpentry', icon: '🔨', color: '#84CC16' },
        { id: 8, name: 'Appliance Repair', icon: '🔌', color: '#F97316' },
        { id: 9, name: 'Roofing', icon: '🏠', color: '#6B7280' },
        { id: 10, name: 'Other', icon: '🔧', color: '#9CA3AF' }
      ];
      setServiceCategories(fallbackCategories);
    }
  };

  // Load service categories on component mount
  useEffect(() => {
    fetchServiceCategories();
  }, []);

  // Pre-select service if passed from navigation
  useEffect(() => {
    console.log('🔍 Navigation data received:', navigationData);
    if (navigationData.selectedCategory) {
      console.log('🎯 Pre-selecting service:', navigationData.selectedCategory);
      console.log('🎯 Service ID:', navigationData.selectedCategory.id);
      setServiceType(navigationData.selectedCategory.id);
      
      // Animate the selected service
      Animated.sequence([
        Animated.timing(selectedServiceAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(selectedServiceAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [navigationData]);

  // Fetch suburbs based on postcode
  const fetchSuburbs = async (postcode) => {
    if (postcode.length < 4) {
      setSuburbs([]);
      return;
    }
    
    try {
      const response = await apiService.get(`/api/suburbs/${postcode}`);
      setSuburbs(response || []);
    } catch (error) {
      console.error('Error fetching suburbs:', error);
      setSuburbs([]);
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
  }, []);

  React.useEffect(() => {
    if (postcodeSearch) {
      const timeoutId = setTimeout(() => {
        fetchSuburbs(postcodeSearch);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSuburbs([]);
    }
  }, [postcodeSearch]);

  const getCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Get first day of current month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    // Get first day of the week (Sunday = 0)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Get last day of the week
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const isCurrentMonth = currentDate.getMonth() === currentMonth;
      const isToday = currentDate.toDateString() === today.toDateString();
      const isPast = currentDate < today && !isToday;
      
      days.push({
        date: new Date(currentDate),
        day: currentDate.getDate(),
        isCurrentMonth,
        isToday,
        isPast,
        value: currentDate.toISOString().split('T')[0],
        display: currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const selectDate = (dateValue) => {
    setPreferredDate(dateValue);
    setShowDatePicker(false);
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };


  const bookingTypes = [
    { id: 'one-time', name: 'One-time Service', description: 'Single service request' },
    { id: 'regular', name: 'Regular/Recurring Service', description: 'Ongoing service needs' },
    { id: 'emergency', name: 'Emergency Service', description: 'Urgent service required' },
    { id: 'quote', name: 'Quote Only', description: 'Just need a price estimate' }
  ];


  const handleSubmit = async () => {
    if (!serviceType || !description || !postcode || !suburb) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare form data
      const formData = {
        categoryId: serviceType, // Map serviceType to categoryId
        description,
        postcode,
        suburb,
        preferredDate: preferredDate || null,
        bookingType: bookingType || null,
        customerId: 'customer_001' // This should come from auth context
      };

      console.log('Submitting form data:', formData);

      // Make API call
      const response = await apiService.post('/api/service-requests', formData);
      
      console.log('API response:', response);
      
      Alert.alert(
        'Service Request Submitted! 🎉', 
        'Your service request has been submitted successfully. You will receive quotes from providers soon.',
        [
          {
            text: 'OK',
            onPress: () => onBack()
          }
        ]
      );
    } catch (error) {
      console.error('Form submission error:', error);
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderServiceTypeSelector = () => {
    console.log('🎨 Rendering service type selector, current serviceType:', serviceType);
    return (
      <Animated.View 
        style={[
          styles.section,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.sectionTitle}>Service Type *</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.serviceTypeContainer}
        >
          {serviceCategories.map((type, index) => {
            const isSelected = serviceType === type.id;
            console.log(`🔍 Service ${type.name} (ID: ${type.id}): isSelected=${isSelected}, serviceType=${serviceType}, type=${typeof serviceType}, typeId=${type.id}, typeIdType=${typeof type.id}`);
            return (
            <Animated.View
              key={type.id}
              style={[
                styles.serviceTypeCard,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim }
                  ]
                }
              ]}
            >
              <Animated.View
                style={[
                  serviceType === type.id && {
                    transform: [{ scale: selectedServiceAnim }]
                  }
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.serviceTypeButton,
                    serviceType === type.id && styles.serviceTypeButtonSelected,
                    { borderColor: type.color + '30' }
                  ]}
                  onPress={() => {
                    console.log('🔘 Service type selected:', type.id, type.name);
                    setServiceType(type.id);
                  }}
                  activeOpacity={0.8}
                >
                {serviceType === type.id && (
                  <View style={[styles.selectedIndicator, { backgroundColor: type.color }]} />
                )}
                <View style={[
                  styles.serviceTypeIcon,
                  { backgroundColor: type.color + '15' },
                  serviceType === type.id && { 
                    backgroundColor: type.color + '20',
                    shadowColor: type.color,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }
                ]}>
                  <Text style={styles.serviceTypeEmoji}>{type.icon}</Text>
                  {serviceType === type.id && (
                    <View style={[styles.checkmark, { backgroundColor: type.color }]}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={[
                  styles.serviceTypeText,
                  serviceType === type.id && styles.serviceTypeTextSelected
                ]}>
                  {type.name}
                </Text>
                {serviceType === type.id && (
                  <View style={[styles.selectedGlow, { backgroundColor: type.color + '20' }]} />
                )}
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
            );
          })}
        </ScrollView>
      </Animated.View>
    );
  };

  const renderFormFields = () => {
    return (
      <Animated.View 
        style={[
          styles.formSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Location */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Location *</Text>
          <View style={styles.locationContainer}>
            <TextInput
              style={[
                styles.input,
                suburbs.length > 0 && styles.inputWithDropdown
              ]}
              value={postcodeSearch}
              onChangeText={(text) => {
                setPostcodeSearch(text);
                setPostcode(text);
                setSuburb('');
              }}
              placeholder="Enter postcode (e.g., 2000, 3000, 4000)"
              maxLength={4}
              keyboardType="numeric"
            />
            
            {suburbs.length > 0 && (
              <View style={styles.suburbsDropdown}>
                <ScrollView style={styles.suburbsList} nestedScrollEnabled>
                  {suburbs.map((suburbItem) => (
                    <TouchableOpacity
                      key={suburbItem.id}
                      style={[
                        styles.suburbItem,
                        suburb === suburbItem.suburb && styles.suburbItemSelected
                      ]}
                      onPress={() => {
                        setSuburb(suburbItem.suburb);
                        setPostcode(suburbItem.postcode);
                        setPostcodeSearch('');
                        setSuburbs([]);
                      }}
                    >
                      <Text style={[
                        styles.suburbName,
                        suburb === suburbItem.suburb && styles.suburbNameSelected
                      ]}>
                        {suburbItem.suburb}
                      </Text>
                      <Text style={styles.suburbPostcode}>
                        {suburbItem.postcode}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
          
          {suburb && (
            <View style={styles.selectedLocation}>
              <Text style={styles.selectedLocationText}>
                Selected: {suburb}, {postcode}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSuburb('');
                  setPostcode('');
                  setPostcodeSearch('');
                }}
              >
                <Text style={styles.clearLocationText}>Clear</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Preferred Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Preferred Date</Text>
          <Text style={styles.inputSubLabel}>When do you need this service? (optional)</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={showDatePickerModal}
          >
            <Text style={[
              styles.datePickerText,
              !preferredDate && styles.datePickerPlaceholder
            ]}>
              {preferredDate || 'Select a date'}
            </Text>
            <Text style={styles.datePickerIcon}>📅</Text>
          </TouchableOpacity>
        </View>

        {/* Type of Booking */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Type of Booking *</Text>
          <Text style={styles.inputSubLabel}>What type of booking do you need?</Text>
          <View style={styles.bookingTypeContainer}>
            {bookingTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.bookingTypeButton,
                  bookingType === type.id && styles.bookingTypeButtonSelected
                ]}
                onPress={() => setBookingType(type.id)}
              >
                <Text style={[
                  styles.bookingTypeText,
                  bookingType === type.id && styles.bookingTypeTextSelected
                ]}>
                  {type.name}
                </Text>
                <Text style={[
                  styles.bookingTypeDescription,
                  bookingType === type.id && styles.bookingTypeDescriptionSelected
                ]}>
                  {type.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Description *</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Describe what you need done in detail..."
              placeholderTextColor={colors.textTertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={styles.characterCount}>
              <Text style={styles.characterCountText}>{description.length}/500</Text>
            </View>
          </View>
        </View>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <View style={styles.datePickerModal}>
            <View style={styles.datePickerContent}>
              <View style={styles.datePickerHeader}>
                <Text style={styles.datePickerTitle}>Select Preferred Date</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  style={styles.datePickerCloseButton}
                >
                  <Text style={styles.datePickerCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.calendarContainer}>
                {/* Calendar Header */}
                <View style={styles.calendarHeader}>
                  <Text style={styles.calendarMonth}>
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </Text>
                </View>
                
                {/* Day Headers */}
                <View style={styles.dayHeaders}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <Text key={day} style={styles.dayHeaderText}>{day}</Text>
                  ))}
                </View>
                
                {/* Calendar Grid */}
                <View style={styles.calendarGrid}>
                  {getCalendarDays().map((day, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.calendarDay,
                        !day.isCurrentMonth && styles.calendarDayOtherMonth,
                        day.isToday && styles.calendarDayToday,
                        day.isPast && styles.calendarDayPast,
                        preferredDate === day.value && styles.calendarDaySelected
                      ]}
                      onPress={() => !day.isPast && selectDate(day.value)}
                      disabled={day.isPast}
                    >
                      <Text style={[
                        styles.calendarDayText,
                        !day.isCurrentMonth && styles.calendarDayTextOtherMonth,
                        day.isToday && styles.calendarDayTextToday,
                        day.isPast && styles.calendarDayTextPast,
                        preferredDate === day.value && styles.calendarDayTextSelected
                      ]}>
                        {day.day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}

      </Animated.View>
    );
  };


  const renderSubmitButton = () => {
    return (
      <Animated.View 
        style={[
          styles.submitContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <View style={styles.submitButtonContent}>
            {isSubmitting ? (
              <View style={styles.loadingSpinner} />
            ) : (
              <>
                <Text style={styles.submitButtonIcon}>🚀</Text>
                <Text style={styles.submitButtonText}>Submit Request</Text>
              </>
            )}
          </View>
          <View style={styles.submitButtonGlow} />
        </TouchableOpacity>
        
        <Text style={styles.submitNote}>
          You'll receive quotes from qualified providers within 24 hours
        </Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Background */}
        <View style={styles.headerContainer}>
          <View style={styles.backgroundGradient} />
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <Text style={styles.headerTitle}>Request a Service</Text>
            <Text style={styles.headerSubtitle}>Tell us what you need and we'll connect you with the best providers</Text>
          </Animated.View>
        </View>

        {/* Service Type Selector */}
        {renderServiceTypeSelector()}

        {/* Form Fields */}
        {renderFormFields()}

        {/* Submit Button */}
        {renderSubmitButton()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    position: 'relative',
    height: 200,
    marginBottom: 20,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.surface,
    opacity: 0.9,
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  formSection: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  serviceTypeContainer: {
    paddingRight: 20,
  },
  serviceTypeCard: {
    marginRight: 12,
  },
  serviceTypeButton: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceTypeButtonSelected: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    transform: [{ scale: 1.05 }],
  },
  selectedIndicator: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    height: 4,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    zIndex: 1,
  },
  serviceTypeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  serviceTypeEmoji: {
    fontSize: 24,
  },
  checkmark: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  checkmarkText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
  },
  serviceTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  serviceTypeTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  selectedGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    zIndex: -1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    minHeight: 48,
  },
  textAreaContainer: {
    position: 'relative',
  },
  textArea: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    position: 'absolute',
    bottom: 8,
    right: 12,
  },
  characterCountText: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  submitContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  submitButtonText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButtonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    opacity: 0.1,
  },
  loadingSpinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.surface,
    borderTopColor: 'transparent',
  },
  submitNote: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  locationContainer: {
    position: 'relative',
  },
  inputWithDropdown: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomColor: 'transparent',
  },
  suburbsDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    maxHeight: 200,
    zIndex: 1000,
  },
  suburbsList: {
    maxHeight: 200,
  },
  suburbItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suburbItemSelected: {
    backgroundColor: colors.primary + '10',
  },
  suburbName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  suburbNameSelected: {
    color: colors.primary,
  },
  suburbPostcode: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectedLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.success + '10',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  selectedLocationText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  clearLocationText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  inputSubLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  bookingTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  bookingTypeButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  bookingTypeButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  bookingTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  bookingTypeTextSelected: {
    color: colors.primary,
  },
  bookingTypeDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  bookingTypeDescriptionSelected: {
    color: colors.primary,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  datePickerText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  datePickerPlaceholder: {
    color: colors.textTertiary,
  },
  datePickerIcon: {
    fontSize: 18,
    marginLeft: 8,
  },
  datePickerModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  datePickerContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    width: width * 0.9,
    maxHeight: height * 0.6,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  datePickerCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerCloseText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  calendarContainer: {
    padding: 16,
  },
  calendarHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarMonth: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  calendarDayOtherMonth: {
    opacity: 0.3,
  },
  calendarDayToday: {
    backgroundColor: colors.primary + '20',
    borderRadius: 20,
  },
  calendarDayPast: {
    opacity: 0.3,
  },
  calendarDaySelected: {
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  calendarDayText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  calendarDayTextOtherMonth: {
    color: colors.textSecondary,
  },
  calendarDayTextToday: {
    color: colors.primary,
    fontWeight: '600',
  },
  calendarDayTextPast: {
    color: colors.textSecondary,
  },
  calendarDayTextSelected: {
    color: colors.surface,
    fontWeight: '600',
  },
});

module.exports = RequestServiceScreen;