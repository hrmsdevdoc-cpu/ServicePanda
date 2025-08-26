const React = require('react');
const { useState, useEffect } = require('react');
const { View, Text, StyleSheet, ScrollView, Alert, TextInput } = require('react-native');
const { Card, Title, Paragraph, Button, TextInput: PaperTextInput, HelperText } = require('react-native-paper');
const { colors } = require('../../utils/theme');
const { useQuery, useMutation, useQueryClient } = require('@tanstack/react-query');
const { getProfile, updateProfile } = require('../../services/api');
const AsyncStorage = require('@react-native-async-storage/async-storage').default;

const PersonalDetailsScreen = ({ onNavigate, onBack }) => {
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

  const queryClient = useQueryClient();

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
    mutationFn: (data) => updateProfile(profile?.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['provider-profile']);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    },
    onError: (error) => {
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
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
          <Button mode="contained" onPress={() => onNavigate('login')} style={styles.retryButton}>
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
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Button 
            mode="text" 
            onPress={onBack}
            style={styles.backButton}
          >
            ← Back
          </Button>
          <Title style={styles.headerTitle}>Personal Details</Title>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            {/* Personal Information Section */}
            <View style={styles.section}>
              <Title style={styles.sectionTitle}>Personal Information</Title>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>First Name *</Text>
                <PaperTextInput
                  mode="outlined"
                  value={formData.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                  disabled={!isEditing}
                  style={styles.input}
                  error={!!errors.firstName}
                />
                {errors.firstName && <HelperText type="error">{errors.firstName}</HelperText>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Name *</Text>
                <PaperTextInput
                  mode="outlined"
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                  disabled={!isEditing}
                  style={styles.input}
                  error={!!errors.lastName}
                />
                {errors.lastName && <HelperText type="error">{errors.lastName}</HelperText>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <PaperTextInput
                  mode="outlined"
                  value={formData.email}
                  disabled={true}
                  style={[styles.input, styles.disabledInput]}
                />
                <HelperText type="info" style={styles.infoText}>
                  Email cannot be changed. Please contact support if you need to update your email.
                </HelperText>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mobile Number *</Text>
                <PaperTextInput
                  mode="outlined"
                  value={formData.mobileNumber}
                  onChangeText={(value) => handleInputChange('mobileNumber', value)}
                  disabled={!isEditing}
                  style={styles.input}
                  error={!!errors.mobileNumber}
                  keyboardType="phone-pad"
                />
                {errors.mobileNumber && <HelperText type="error">{errors.mobileNumber}</HelperText>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Business Address **</Text>
                <PaperTextInput
                  mode="outlined"
                  value={formData.address}
                  onChangeText={(value) => handleInputChange('address', value)}
                  disabled={!isEditing}
                  style={[styles.input, errors.address && styles.errorInput]}
                  error={!!errors.address}
                  multiline
                  numberOfLines={2}
                />
                {errors.address && <HelperText type="error">{errors.address}</HelperText>}
                <HelperText type="info" style={styles.warningText}>
                  ⚠️ Please select from suggestions to verify address
                </HelperText>
              </View>
            </View>

            {/* Business Details Section */}
            <View style={styles.section}>
              <Title style={styles.sectionTitle}>Business Details</Title>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Business Name</Text>
                <PaperTextInput
                  mode="outlined"
                  value={formData.businessName}
                  onChangeText={(value) => handleInputChange('businessName', value)}
                  disabled={!isEditing}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Business ABN/ACN</Text>
                <PaperTextInput
                  mode="outlined"
                  value={formData.businessAbn}
                  onChangeText={(value) => handleInputChange('businessAbn', value)}
                  disabled={!isEditing}
                  style={styles.input}
                  placeholder="Enter your ABN or ACN (optional)"
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              {isEditing ? (
                <>
                  <Button 
                    mode="outlined" 
                    onPress={handleCancel}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </Button>
                  <Button 
                    mode="contained" 
                    onPress={handleSave}
                    style={styles.saveButton}
                    loading={updateProfileMutation.isPending}
                    disabled={updateProfileMutation.isPending}
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button 
                  mode="contained" 
                  onPress={() => setIsEditing(true)}
                  style={styles.editButton}
                >
                  Edit Details
                </Button>
              )}
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
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
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error || '#EF4444',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  card: {
    elevation: 2,
    marginBottom: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.text,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
  },
  disabledInput: {
    backgroundColor: colors.borderLight || '#f5f5f5',
  },
  errorInput: {
    borderColor: colors.error || '#EF4444',
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  warningText: {
    fontSize: 12,
    color: '#F59E0B',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    borderColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
});

module.exports = PersonalDetailsScreen;
