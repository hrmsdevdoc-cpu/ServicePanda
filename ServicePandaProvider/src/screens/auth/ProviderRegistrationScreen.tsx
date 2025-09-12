const React = require('react');
const { useState, useEffect } = require('react');
const {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
} = require('react-native');

const { width, height } = Dimensions.get('window');
const AsyncStorage = require('@react-native-async-storage/async-storage').default;
const { Button } = require('react-native-paper');
const { colors } = require('../../utils/theme');
const apiService = require('../../services/api');

// Step Components
const BasicInfoStep = require('../../components/registration/BasicInfoStep');
const ServicesStep = require('../../components/registration/ServicesStep');
const ServiceAreasStep = require('../../components/registration/ServiceAreasStep');
const DocumentUploadStep = require('../../components/registration/DocumentUploadStep');

const ProviderRegistrationScreen = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(3); // Start from step 1 for complete registration flow
  const [isLoading, setIsLoading] = useState(false);
  const [providerId, setProviderId] = useState(null);
  const [isExistingProvider, setIsExistingProvider] = useState(false);
  const [isCheckingProgress, setIsCheckingProgress] = useState(true);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobileNumber: '',
    address: '',
    businessName: '',
    businessAbn: '',
    selectedServices: [],
    selectedState: '',
    postcode: '',
    selectedSuburbs: [],
  });

  const [documentFiles, setDocumentFiles] = useState({
    license: null,
    policeCheck: null,
    insuranceCertificate: null,
  });

  // DISABLED: Check for existing provider and determine current step
  // useEffect(() => {
  //   const checkProviderProgress = async () => {
  //     setIsCheckingProgress(true);
  //     
  //     try {
  //       let storedProviderId = null;
  //       try {
  //         if (AsyncStorage && AsyncStorage.getItem) {
  //           storedProviderId = await AsyncStorage.getItem('providerId');
  //         }
  //       } catch (storageError) {
  //         console.log('AsyncStorage getItem error:', storageError);
  //       }
  //       
  //       if (!storedProviderId) {
  //         throw new Error('No provider session');
  //       }
  //       
  //       const provider = await apiService.request('GET', '/api/provider/profile');
  //       if (provider) {
  //         setIsExistingProvider(true);
  //         setProviderId(provider.id);
  //           
  //         try {
  //           if (AsyncStorage && AsyncStorage.setItem) {
  //             await AsyncStorage.setItem('providerId', provider.id.toString());
  //           }
  //         } catch (storageError) {
  //           console.log('AsyncStorage setItem error:', storageError);
  //         }
  //           
  //         // Determine current step based on completed data
  //         let targetStep = 1;
  //           
  //         // Step 1: Basic info (always completed if provider exists)
  //         if (provider.firstName && provider.lastName && provider.email) {
  //           targetStep = 2;
  //             
  //           // Check if services are selected (Step 2)
  //           try {
  //             const services = await apiService.request('GET', '/api/provider/services');
  //             if (services && services.length > 0) {
  //               targetStep = 3;
  //                 
  //               // Check if service areas are set (Step 3)
  //               try {
  //                 const areas = await apiService.request('GET', `/api/provider/${provider.id}/service-areas`);
  //                 if (areas && areas.length > 0) {
  //                   targetStep = 4;
  //                     
  //                   // Check if documents are uploaded (Step 4)
  //                   try {
  //                     const documents = await apiService.request('GET', `/api/service-providers/${provider.id}/documents`);
  //                       if (documents && documents.length >= 3) {
  //                         targetStep = 5; // All steps completed
  //                       }
  //                     } catch (error) {
  //                       console.log('Documents not uploaded yet');
  //                     }
  //                   }
  //                 } catch (error) {
  //                   console.log('Service areas not set yet');
  //                 }
  //               }
  //             } catch (error) {
  //               console.log('Services not selected yet');
  //             }
  //           }
  //           
  //           setCurrentStep(targetStep);
  //           
  //           // Populate form data
  //           setFormData(prev => ({
  //             ...prev,
  //             firstName: provider.firstName || '',
  //             lastName: provider.lastName || '',
  //             email: provider.email || '',
  //             mobileNumber: provider.mobileNumber || '',
  //             address: provider.address || '',
  //             businessName: provider.businessName || '',
  //             businessAbn: provider.businessAbn || '',
  //           }));
  //         }
  //       } catch (error) {
  //         console.log('No existing provider session, starting fresh');
  //         setCurrentStep(1);
  //       } finally {
  //         setIsCheckingProgress(false);
  //       }
  //     };
  // 
  //     checkProviderProgress();
  //   }, []);

  const handleStep1Submit = async (data) => {
    setIsLoading(true);
    try {
      const response = await apiService.request('POST', '/api/provider/register', {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNumber: data.mobileNumber,
        address: data.address,
        businessName: data.businessName,
        businessAbn: data.businessAbn,
      });

      setProviderId(response.id);
      
      // After creating account, log the provider in to get authentication (SAME AS WEB VERSION)
      try {
        console.log('🔐 Auto-login after account creation...');
        
        // Save providerId to AsyncStorage FIRST (before login call)
        if (AsyncStorage && AsyncStorage.setItem && typeof AsyncStorage.setItem === 'function') {
          await AsyncStorage.setItem('providerId', response.id.toString());
          console.log('✅ providerId saved to AsyncStorage:', response.id);
          
          // Verify it was saved with retry mechanism
          let savedProviderId = null;
          let retryCount = 0;
          const maxRetries = 5;
          
          while (!savedProviderId && retryCount < maxRetries) {
            // Add small delay to ensure AsyncStorage operation completes
            await new Promise(resolve => setTimeout(resolve, 100));
            
            if (AsyncStorage && AsyncStorage.getItem && typeof AsyncStorage.getItem === 'function') {
              savedProviderId = await AsyncStorage.getItem('providerId');
            }
            retryCount++;
            
            if (!savedProviderId) {
              console.log(`⏳ Retry ${retryCount}: providerId not found, retrying...`);
            }
          }
          
          if (savedProviderId) {
            console.log('✅ Verified providerId in AsyncStorage:', savedProviderId);
          } else {
            throw new Error('Failed to save providerId to AsyncStorage after multiple retries');
          }
        }
        
        // Now login (this will use the providerId from AsyncStorage)
        const loginResponse = await apiService.request('POST', '/api/provider/login', {
          email: data.email,
          password: data.password
        });
        
        // Save additional authentication data
        if (AsyncStorage && AsyncStorage.setItem && typeof AsyncStorage.setItem === 'function') {
          await AsyncStorage.setItem('currentProvider', JSON.stringify(loginResponse));
          await AsyncStorage.setItem('providerAuthToken', 'authenticated');
          console.log('✅ Additional auth data saved to AsyncStorage');
        }
        
        console.log('✅ Provider auto-logged in after registration:', loginResponse);
      } catch (loginError) {
        console.error('❌ Auto-login failed after registration:', loginError);
        // Continue anyway - user can manually login later
      }
      
             setFormData(prev => ({ ...prev, ...data }));
       setCurrentStep(2);
       
       // Removed success alert - user can see progress in step indicator
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  const handleStep2Submit = async (selectedServices) => {
    if (!providerId) {
      Alert.alert('Error', 'Provider ID not found. Please complete step 1 first.');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('🔍 Step 2 Submit - providerId:', providerId);
      console.log('🔍 Step 2 Submit - selectedServices:', selectedServices);
      
      // First test if server is reachable
      try {
        const { API_BASE_URL } = require('../../config/api');
        const testResponse = await fetch(`${API_BASE_URL}/api/health`);
        console.log('🌐 Server test response:', testResponse.status);
      } catch (testError) {
        console.error('❌ Server not reachable:', testError);
        Alert.alert('Connection Error', 'Cannot connect to server. Please check your internet connection and try again.');
        return;
      }
      
      const response = await apiService.request('POST', `/api/service-providers/${providerId}/services`, {
        categoryIds: selectedServices
      });
      
      console.log('✅ Step 2 Submit - Success response:', response);
      
             setFormData(prev => ({ ...prev, selectedServices }));
       setCurrentStep(3);
       
       // Removed success alert - user can see progress in step indicator
    } catch (error) {
      console.error('❌ Step 2 Submit - Error:', error);
      Alert.alert('Error', error.message || 'Failed to add services. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3Submit = async (serviceAreas) => {
    setIsLoading(true);
    try {
      // Add each service area individually (same as web app)
      for (const area of serviceAreas) {
        // For now, use default coordinates since mobile app doesn't have geocoding
        // In a real implementation, you'd want to add geocoding here
        const serviceAreaData = {
          centerAddress: area.address,
          centerLat: '-27.4698', // Default Brisbane coordinates - should be geocoded
          centerLng: '153.0251',
          radiusKm: area.radius,
          areaName: area.areaName || null
        };
        
        await apiService.request('POST', `/api/provider/${providerId}/location-service-areas`, serviceAreaData);
      }
      
      setCurrentStep(4);
       
       // Removed success alert - user can see progress in step indicator
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to set service areas. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep4Submit = async () => {
    if (!providerId) {
      Alert.alert('Error', 'Provider ID not found. Please complete step 1 first.');
      return;
    }
    
    if (!documentFiles.license || !documentFiles.policeCheck || !documentFiles.insuranceCertificate) {
      Alert.alert('Error', 'Please upload all three required documents.');
      return;
    }

    setIsLoading(true);
    try {
            console.log('🔍 Step 4 Submit - providerId:', providerId);
      console.log('🔍 Step 4 Submit - documentFiles:', documentFiles);
      
      // Skip authentication check since user is already logged in from auto-login
      // Use the providerId from state directly
      console.log('✅ Using providerId from state:', providerId);
      
      // Create FormData for React Native - WORKING VERSION (same as DocumentsScreen)
      const formData = new FormData();
      
      console.log('Creating FormData with files:', documentFiles);
      
      // Debug: Log actual file sizes
      if (documentFiles.license) {
        console.log('📄 License file size:', documentFiles.license.size, 'bytes');
      }
      if (documentFiles.policeCheck) {
        console.log('📄 Police check file size:', documentFiles.policeCheck.size, 'bytes');
      }
      if (documentFiles.insuranceCertificate) {
        console.log('📄 Insurance certificate file size:', documentFiles.insuranceCertificate.size, 'bytes');
      }
      
      // Validate file sizes before upload to prevent HTTP 413
      const maxFileSize = 4 * 1024 * 1024; // 4MB limit
      const largeFiles = [];
      
      if (documentFiles.license && documentFiles.license.size > maxFileSize) {
        largeFiles.push('License Document');
      }
      if (documentFiles.policeCheck && documentFiles.policeCheck.size > maxFileSize) {
        largeFiles.push('Police Check');
      }
      if (documentFiles.insuranceCertificate && documentFiles.insuranceCertificate.size > maxFileSize) {
        largeFiles.push('Insurance Certificate');
      }
      
      if (largeFiles.length > 0) {
        Alert.alert(
          'File Too Large',
          `The following files are too large (over 4MB):\n\n${largeFiles.join('\n')}\n\nPlease compress or use smaller files.`,
          [{ text: 'OK' }]
        );
        return;
      }
      
      if (documentFiles.license) {
        console.log('Adding license file:', documentFiles.license);
        
        // Validate file URI
        if (!documentFiles.license.uri) {
          throw new Error('License file URI is missing');
        }
        
        // Try simpler approach like web version
        console.log('License file object:', documentFiles.license);
        formData.append('license', documentFiles.license);
      }
      
      if (documentFiles.policeCheck) {
        console.log('Adding policeCheck file:', documentFiles.policeCheck);
        
        // Validate file URI
        if (!documentFiles.policeCheck.uri) {
          throw new Error('Police check file URI is missing');
        }
        
        // Try simpler approach like web version
        console.log('Police file object:', documentFiles.policeCheck);
        formData.append('policeCheck', documentFiles.policeCheck);
      }
      
      if (documentFiles.insuranceCertificate) {
        console.log('Adding insurance file:', documentFiles.insuranceCertificate);
        
        // Validate file URI
        if (!documentFiles.insuranceCertificate.uri) {
          throw new Error('Insurance certificate file URI is missing');
        }
        
        // Try simpler approach like web version
        console.log('Insurance file object:', documentFiles.insuranceCertificate);
        formData.append('insuranceCertificate', documentFiles.insuranceCertificate);
      }
      
      console.log('FormData created successfully');
      
      // Debug: Log FormData contents
      console.log('🔍 FormData contents:');
      for (let [key, value] of formData._parts || []) {
        console.log(`  ${key}:`, typeof value, value);
      }

             // Use the new registration-specific endpoint (no authentication required)
       await apiService.request('POST', `/api/provider/${providerId}/registration-documents`, formData);
      
      setCurrentStep(5);
      
      Alert.alert(
        'Congratulations!',
        'Thank you for joining ServicePanda. Someone from our team will review your documents and contact you shortly.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Clear registration data and redirect to login
              if (AsyncStorage && AsyncStorage.removeItem && typeof AsyncStorage.removeItem === 'function') {
                AsyncStorage.removeItem('providerId');
              }
              // You can add navigation to login screen here
              Alert.alert('Registration Complete', 'Please log in with your email and password to access your account.');
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Document upload error:', error);
      
      // Handle specific HTTP errors
      if (error.message && error.message.includes('413')) {
        Alert.alert(
          'File Too Large',
          'One or more files are too large for upload. Please:\n\n1. Compress your images\n2. Use smaller file sizes (under 500KB)\n3. Try taking new photos with lower quality\n4. Remove and re-add smaller files',
          [{ text: 'OK' }]
        );
      } else if (error.message && error.message.includes('400')) {
        Alert.alert(
          'Invalid File Format',
          'Please ensure all files are valid images (JPG, PNG) and try again.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Upload Error', error.message || 'Failed to upload documents. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = ['Basic Info', 'Services', 'Service Areas', 'Documents'];
    const progressPercentage = (currentStep / steps.length) * 100;
    
    return (
      <View style={styles.stepIndicator}>
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
          </View>
        </View>
        
        {/* Step Labels */}
        <View style={styles.stepLabelsContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepLabelItem}>
              <Text style={[
                styles.stepLabel,
                currentStep > index + 1 ? styles.stepLabelCompleted :
                currentStep === index + 1 ? styles.stepLabelCurrent :
                styles.stepLabelPending
              ]}>
                {step}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // DISABLED: Loading screen since we're not checking progress
  // if (isCheckingProgress) {
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <View style={styles.loadingContainer}>
  //         <ActivityIndicator size="large" color={colors.primary} />
  //         <Text style={styles.loadingText}>Checking your progress...</Text>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Gradient Background */}
      <View style={styles.gradientBackground} />
      
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header Section */}
            <View style={styles.header}>
              {/* Back to Login - Top Left */}
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => onNavigate('login')}
                activeOpacity={0.7}
              >
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>
              
              {/* Logo and Title */}
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Text style={styles.logo}>🐼</Text>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>ServicePanda</Text>
                  <Text style={styles.tagline}>Partner Portal</Text>
                </View>
              </View>
              
              <Text style={styles.subtitle}>Complete your registration in a few simple steps</Text>
            </View>

          {renderStepIndicator()}

          {/* Form Content Card */}
          <View style={styles.formCard}>
            <View style={styles.stepContainer}>
          {currentStep === 1 && (
            <>
              {console.log('🔍 Rendering BasicInfoStep with formData:', formData)}
              
              {/* Test Button for debugging */}
              {/* <View style={{ padding: 20, backgroundColor: '#f0f0f0', margin: 10, borderRadius: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Debug Test</Text>
                <TouchableOpacity 
                  style={{ backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginBottom: 10 }}
                  onPress={testRegistration}
                >
                  <Text style={{ color: 'white', textAlign: 'center' }}>Test Registration with Valid Data</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{ backgroundColor: '#28a745', padding: 10, borderRadius: 5, marginBottom: 10 }}
                  onPress={() => {
                    console.log('🔍 Manual form submission test with current formData:', formData);
                    handleStep1Submit(formData);
                  }}
                >
                  <Text style={{ color: 'white', textAlign: 'center' }}>Test Current Form Data</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 12, color: '#666' }}>
                  This will test the API with valid data to see if the server is working.
                </Text>
              </View> */}
              
              <BasicInfoStep
                formData={formData}
                onSubmit={handleStep1Submit}
                isLoading={isLoading}
              />
            </>
          )}

          {currentStep === 2 && (
            <ServicesStep
              selectedServices={formData.selectedServices}
              onSubmit={handleStep2Submit}
              onBack={() => setCurrentStep(1)}
              isLoading={isLoading}
            />
          )}

          {currentStep === 3 && (
            <ServiceAreasStep
              providerId={providerId}
              onSubmit={handleStep3Submit}
              onBack={() => setCurrentStep(2)}
              isLoading={isLoading}
              formData={formData}
            />
          )}

          {currentStep === 4 && (
            <DocumentUploadStep
              documentFiles={documentFiles}
              setDocumentFiles={setDocumentFiles}
              onSubmit={handleStep4Submit}
              onBack={() => setCurrentStep(3)}
              isLoading={isLoading}
            />
          )}

          {currentStep === 5 && (
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Text style={styles.successCheck}>✓</Text>
              </View>
              <Text style={styles.successTitle}>Congratulations!</Text>
              <Text style={styles.successMessage}>
                Thank you for joining ServicePanda. Someone from our team will review your documents and contact you shortly.
              </Text>
              <View style={styles.officeHours}>
                <Text style={styles.officeHoursTitle}>Please Remember:</Text>
                <Text style={styles.officeHoursText}>
                  Our office hours are from 9 AM to 5 PM, Monday to Friday
                </Text>
              </View>
                                                           <TouchableOpacity
                  style={styles.loginButton}
                                     onPress={async () => {
                     try {
                       // Clear registration data and navigate directly to login
                       if (AsyncStorage && AsyncStorage.removeItem && typeof AsyncStorage.removeItem === 'function') {
                         await AsyncStorage.removeItem('providerId');
                         await AsyncStorage.removeItem('currentProvider');
                         await AsyncStorage.removeItem('providerAuthToken');
                         console.log('✅ Registration data cleared from AsyncStorage');
                       }
                       
                       // Navigate directly to login screen using the app's navigation system
                       if (onNavigate) {
                         onNavigate('login');
                       } else {
                         // Fallback if navigation prop is not available
                         Alert.alert('Login Required', 'Please log in with your email and password to access your account.');
                       }
                     } catch (error) {
                       console.error('❌ Error clearing AsyncStorage:', error);
                       // Continue with navigation even if clearing fails
                       if (onNavigate) {
                         onNavigate('login');
                       }
                     }
                   }}
                >
                  <Text style={styles.loginButtonText}>Login Now</Text>
                </TouchableOpacity>
            </View>
          )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
    position: 'relative',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  textContainer: {
    marginLeft: 16,
    alignItems: 'flex-start',
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    fontSize: 28,
    textAlign: 'center',
    lineHeight: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 10,
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 30, // Align with center of logo circle
    paddingVertical: 8,
    paddingHorizontal: 8,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  stepIndicator: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  stepLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepLabelItem: {
    flex: 1,
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
    color: '#FFFFFF',
  },
  stepLabelPending: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  stepLabelCurrent: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  stepLabelCompleted: {
    color: '#000000',
    fontWeight: '600',
  },
  stepContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  successIcon: {
    width: 80,
    height: 80,
    backgroundColor: colors.success,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successCheck: {
    color: colors.white,
    fontSize: 32,
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  officeHours: {
    backgroundColor: colors.infoLight,
    borderWidth: 1,
    borderColor: colors.info,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  officeHoursTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  officeHoursText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },

});

module.exports = ProviderRegistrationScreen;
