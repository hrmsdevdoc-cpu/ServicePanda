const React = require('react');
const { useState, useEffect } = require('react');
const { View, Text, StyleSheet, ScrollView, Alert, TextInput, Animated, Dimensions, TouchableOpacity } = require('react-native');
const { Card, Title, Paragraph, Button, TextInput: PaperTextInput, HelperText } = require('react-native-paper');
const { colors } = require('../../utils/theme');
const { useQuery, useMutation, useQueryClient } = require('@tanstack/react-query');
const { getProfile, updateProfile } = require('../../services/api');
const AsyncStorage = require('@react-native-async-storage/async-storage').default;

const { width } = Dimensions.get('window');

interface PersonalDetailsScreenProps {
  onNavigate?: (screen: string) => void;
  onBack?: () => void;
}

const PersonalDetailsScreen = ({ onNavigate, onBack }: PersonalDetailsScreenProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    address: '',
    businessName: '',
    businessAbn: ''
  });
  const [errors, setErrors] = useState({});

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  const queryClient = useQueryClient();

  // Animation on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Debug: Check AsyncStorage on component mount
  useEffect(() => {
    const checkAsyncStorage = async () => {
      try {
        const providerId = await AsyncStorage.getItem('providerId');
        const providerData = await AsyncStorage.getItem('providerData');
        console.log('🔍 PersonalDetailsScreen: AsyncStorage check:');
        console.log('  - providerId:', providerId);
        console.log('  - providerData:', providerData);
      } catch (error) {
        console.error('❌ PersonalDetailsScreen: AsyncStorage check failed:', error);
      }
    };
    checkAsyncStorage();
  }, []);

  // Fetch provider profile
  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ['provider-profile'],
    queryFn: async () => {
      console.log('🔍 PersonalDetailsScreen: Starting API call to getProfile...');
      try {
        const result = await getProfile();
        console.log('✅ PersonalDetailsScreen: API call successful:', result);
        return result;
      } catch (error) {
        console.error('❌ PersonalDetailsScreen: API call failed:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => updateProfile(profile?.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['provider-profile']);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    },
    onError: (error: any) => {
      Alert.alert('Error', error?.message || 'Failed to update profile');
    }
  });

  // Load profile data when fetched
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        mobileNumber: profile.mobileNumber || '',
        address: profile.address || '',
        businessName: profile.businessName || '',
        businessAbn: profile.businessAbn || ''
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required';
    if (!formData.address.trim()) newErrors.address = 'Business address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    // Reset form data to original profile data
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        mobileNumber: profile.mobileNumber || '',
        address: profile.address || '',
        businessName: profile.businessName || '',
        businessAbn: profile.businessAbn || ''
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    // Check if it's an authentication error
    if (error.message?.includes('authentication') || error.message?.includes('401') || error.message?.includes('403') || error.message?.includes('Provider authentication required')) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Please log in to view your profile</Text>
          <Text style={styles.errorSubtext}>You need to be logged in to access your personal details</Text>
          <Button mode="contained" onPress={() => onNavigate?.('login')} style={styles.retryButton}>
            Go to Login
          </Button>
        </View>
      );
    }
    
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading profile</Text>
        <Text style={styles.errorSubtext}>{error.message || 'Something went wrong'}</Text>
        <Button mode="contained" onPress={() => refetch()} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
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
        {/* Back Button Header */}
        <View style={styles.backHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => onBack?.()}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>

        {/* Modern Header */}
        <View style={styles.modernHeader}>
          <View style={styles.modernHeaderContent}>
            <Text style={styles.modernHeaderTitle}>Personal Details</Text>
            <Text style={styles.modernHeaderSubtitle}>
              Manage your personal and business information
            </Text>
          </View>
          <View style={styles.modernHeaderIcon}>
            <Text style={styles.modernHeaderEmoji}>👤</Text>
          </View>
        </View>

        {/* Modern Personal Information Section */}
        <View style={styles.modernCard}>
          <View style={styles.modernCardHeader}>
            <View style={styles.modernCardIcon}>
              <Text style={styles.modernCardEmoji}>👤</Text>
            </View>
            <View style={styles.modernCardInfo}>
              <Text style={styles.modernCardTitle}>Personal Information</Text>
              <Text style={styles.modernCardSubtitle}>
                Your personal details and contact information
              </Text>
            </View>
          </View>
          
          <View style={styles.modernFormFields}>
            <View style={styles.modernInputGroup}>
              <Text style={styles.modernLabel}>First Name *</Text>
              <View style={styles.modernInputContainer}>
                <Text style={styles.modernInputIcon}>👤</Text>
                <PaperTextInput
                  mode="outlined"
                  value={formData.firstName}
                  onChangeText={(value: string) => handleInputChange('firstName', value)}
                  disabled={!isEditing}
                  style={styles.modernInput}
                  error={!!errors.firstName}
                  placeholder="Enter your first name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              {errors.firstName && <Text style={styles.modernErrorText}>{errors.firstName}</Text>}
            </View>

            <View style={styles.modernInputGroup}>
              <Text style={styles.modernLabel}>Last Name *</Text>
              <View style={styles.modernInputContainer}>
                <Text style={styles.modernInputIcon}>👤</Text>
                <PaperTextInput
                  mode="outlined"
                  value={formData.lastName}
                  onChangeText={(value: string) => handleInputChange('lastName', value)}
                  disabled={!isEditing}
                  style={styles.modernInput}
                  error={!!errors.lastName}
                  placeholder="Enter your last name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              {errors.lastName && <Text style={styles.modernErrorText}>{errors.lastName}</Text>}
            </View>

            <View style={styles.modernInputGroup}>
              <Text style={styles.modernLabel}>Email Address</Text>
              <View style={styles.modernInputContainer}>
                <Text style={styles.modernInputIcon}>📧</Text>
                <PaperTextInput
                  mode="outlined"
                  value={formData.email}
                  disabled={true}
                  style={[styles.modernInput, styles.modernDisabledInput]}
                  placeholder="Your email address"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <Text style={styles.modernInfoText}>
                Email cannot be changed. Please contact support if you need to update your email.
              </Text>
            </View>

            <View style={styles.modernInputGroup}>
              <Text style={styles.modernLabel}>Mobile Number *</Text>
              <View style={styles.modernInputContainer}>
                <Text style={styles.modernInputIcon}>📱</Text>
                <PaperTextInput
                  mode="outlined"
                  value={formData.mobileNumber}
                  onChangeText={(value: string) => handleInputChange('mobileNumber', value)}
                  disabled={!isEditing}
                  style={styles.modernInput}
                  error={!!errors.mobileNumber}
                  keyboardType="phone-pad"
                  placeholder="Enter your mobile number"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              {errors.mobileNumber && <Text style={styles.modernErrorText}>{errors.mobileNumber}</Text>}
            </View>

            <View style={styles.modernInputGroup}>
              <Text style={styles.modernLabel}>Business Address *</Text>
              <View style={styles.modernInputContainer}>
                <Text style={styles.modernInputIcon}>📍</Text>
                <PaperTextInput
                  mode="outlined"
                  value={formData.address}
                  onChangeText={(value: string) => handleInputChange('address', value)}
                  disabled={!isEditing}
                  style={[styles.modernInput, errors.address && styles.modernErrorInput]}
                  error={!!errors.address}
                  multiline
                  numberOfLines={2}
                  placeholder="Enter your business address"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              {errors.address && <Text style={styles.modernErrorText}>{errors.address}</Text>}
              <Text style={styles.modernWarningText}>
                ⚠️ Please select from suggestions to verify address
              </Text>
            </View>
          </View>
        </View>

        {/* Modern Business Details Section */}
        <View style={styles.modernCard}>
          <View style={styles.modernCardHeader}>
            <View style={styles.modernCardIcon}>
              <Text style={styles.modernCardEmoji}>🏢</Text>
            </View>
            <View style={styles.modernCardInfo}>
              <Text style={styles.modernCardTitle}>Business Details</Text>
              <Text style={styles.modernCardSubtitle}>
                Your business information and registration details
              </Text>
            </View>
          </View>
          
          <View style={styles.modernFormFields}>
            <View style={styles.modernInputGroup}>
              <Text style={styles.modernLabel}>Business Name</Text>
              <View style={styles.modernInputContainer}>
                <Text style={styles.modernInputIcon}>🏪</Text>
                <PaperTextInput
                  mode="outlined"
                  value={formData.businessName}
                  onChangeText={(value: string) => handleInputChange('businessName', value)}
                  disabled={!isEditing}
                  style={styles.modernInput}
                  placeholder="Enter your business name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.modernInputGroup}>
              <Text style={styles.modernLabel}>Business ABN/ACN</Text>
              <View style={styles.modernInputContainer}>
                <Text style={styles.modernInputIcon}>🆔</Text>
                <PaperTextInput
                  mode="outlined"
                  value={formData.businessAbn}
                  onChangeText={(value: string) => handleInputChange('businessAbn', value)}
                  disabled={!isEditing}
                  style={styles.modernInput}
                  placeholder="Enter your ABN or ACN (optional)"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Modern Action Buttons */}
        <View style={styles.modernButtonContainer}>
          {isEditing ? (
            <View style={styles.modernButtonRow}>
              <TouchableOpacity 
                style={styles.modernCancelButton}
                onPress={handleCancel}
                activeOpacity={0.8}
              >
                <Text style={styles.modernCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.modernSaveButton,
                  updateProfileMutation.isPending && styles.modernSaveButtonDisabled
                ]}
                onPress={handleSave}
                activeOpacity={0.8}
                disabled={updateProfileMutation.isPending}
              >
                <Text style={styles.modernSaveButtonText}>
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.modernEditButton}
              onPress={() => setIsEditing(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.modernEditButtonText}>Edit Details</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120, // Increased padding to ensure buttons are visible above footer
  },
  animatedContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: colors.error || '#EF4444',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: colors.primary,
  },
  // Back Header
  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 4,
  },
  // Modern Header
  modernHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20, // Reduced margin to save space
    paddingHorizontal: 4,
  },
  modernHeaderContent: {
    flex: 1,
  },
  modernHeaderTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  modernHeaderSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
    fontWeight: '500',
  },
  modernHeaderIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  modernHeaderEmoji: {
    fontSize: 24,
  },
  // Modern Card
  modernCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20, // Reduced padding to save space
    marginBottom: 16, // Reduced margin to save space
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    width: '100%', // Ensure full width
    maxWidth: '100%', // Prevent overflow
  },
  modernCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16, // Reduced margin to save space
  },
  modernCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modernCardEmoji: {
    fontSize: 24,
  },
  modernCardInfo: {
    flex: 1,
  },
  modernCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  modernCardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 20,
  },
  // Modern Form Fields
  modernFormFields: {
    gap: 16, // Reduced gap to save space
  },
  modernInputGroup: {
    gap: 8,
  },
  modernLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: -0.1,
  },
  modernInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 16,
    paddingVertical: 4,
    minHeight: 50, // Ensure consistent height
    maxWidth: '100%', // Prevent overflow
  },
  modernInputIcon: {
    fontSize: 20,
    marginRight: 12,
    color: colors.textSecondary,
  },
  modernInput: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  modernDisabledInput: {
    backgroundColor: '#f1f5f9',
    color: colors.textSecondary,
  },
  modernErrorInput: {
    borderColor: colors.error,
    backgroundColor: colors.error + '10',
  },
  modernErrorText: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '500',
    marginTop: 4,
  },
  modernInfoText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    fontStyle: 'italic',
    marginTop: 4,
  },
  modernWarningText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
    fontStyle: 'italic',
    marginTop: 4,
  },
  // Modern Buttons
  modernButtonContainer: {
    marginTop: 30,
    marginBottom: 30, // Increased margin to ensure buttons are visible
    paddingHorizontal: 4, // Small padding to prevent edge cutoff
  },
  modernButtonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    maxWidth: '100%',
  },
  modernEditButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14, // Reduced padding
    paddingHorizontal: 20, // Reduced padding
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  modernEditButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  modernCancelButton: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingVertical: 14, // Reduced padding
    paddingHorizontal: 12, // Reduced padding to prevent overflow
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 0, // Allow flex to work properly
  },
  modernCancelButtonText: {
    fontSize: 14, // Slightly smaller to fit better
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  modernSaveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 16, // Reduced padding to prevent overflow
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 0, // Allow flex to work properly
  },
  modernSaveButtonDisabled: {
    backgroundColor: colors.textSecondary,
    shadowOpacity: 0.05,
  },
  modernSaveButtonText: {
    fontSize: 14, // Slightly smaller to fit better
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  card: {
    elevation: 2,
    marginBottom: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.surface,
    height: 40,
    fontSize: 14,
  },
  disabledInput: {
    backgroundColor: colors.borderLight || '#f5f5f5',
    height: 40,
    fontSize: 14,
  },
  errorInput: {
    borderColor: colors.error || '#EF4444',
    height: 40,
    fontSize: 14,
  },
  infoText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  warningText: {
    fontSize: 11,
    color: '#F59E0B',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
  },
  editButton: {
    backgroundColor: colors.primary,
    height: 36,
    fontSize: 14,
  },
  cancelButton: {
    borderColor: colors.border,
    height: 36,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: colors.primary,
    height: 36,
    fontSize: 14,
  },
});

module.exports = PersonalDetailsScreen;
