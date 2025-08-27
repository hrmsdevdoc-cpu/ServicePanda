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
} = require('react-native');
const AsyncStorage = require('@react-native-async-storage/async-storage');
const { colors } = require('../../utils/theme');
const apiService = require('../../services/api');

// Step Components
const BasicInfoStep = require('../../components/registration/BasicInfoStep');
const ServicesStep = require('../../components/registration/ServicesStep');
const ServiceAreasStep = require('../../components/registration/ServiceAreasStep');
const DocumentUploadStep = require('../../components/registration/DocumentUploadStep');

const ProviderRegistrationScreen = () => {
  const [currentStep, setCurrentStep] = useState(1);
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

  // Check for existing provider and determine current step
  useEffect(() => {
    const checkProviderProgress = async () => {
      setIsCheckingProgress(true);
      
      try {
        let storedProviderId = null;
        try {
          if (AsyncStorage && AsyncStorage.getItem) {
            storedProviderId = await AsyncStorage.getItem('providerId');
          }
        } catch (storageError) {
          console.log('AsyncStorage getItem error:', storageError);
        }
        
        if (!storedProviderId) {
          throw new Error('No provider session');
        }
        
        const provider = await apiService.request('GET', '/api/provider/profile');
        if (provider) {
          setIsExistingProvider(true);
          setProviderId(provider.id);
          
          try {
            if (AsyncStorage && AsyncStorage.setItem) {
              await AsyncStorage.setItem('providerId', provider.id.toString());
            }
          } catch (storageError) {
            console.log('AsyncStorage setItem error:', storageError);
          }
          
          // Determine current step based on completed data
          let targetStep = 1;
          
          // Step 1: Basic info (always completed if provider exists)
          if (provider.firstName && provider.lastName && provider.email) {
            targetStep = 2;
            
            // Check if services are selected (Step 2)
            try {
              const services = await apiService.request('GET', '/api/provider/services');
              if (services && services.length > 0) {
                targetStep = 3;
                
                // Check if service areas are set (Step 3)
                try {
                  const areas = await apiService.request('GET', `/api/provider/${provider.id}/service-areas`);
                  if (areas && areas.length > 0) {
                    targetStep = 4;
                    
                    // Check if documents are uploaded (Step 4)
                    try {
                      const documents = await apiService.request('GET', `/api/provider/${provider.id}/documents`);
                      if (documents && documents.length >= 3) {
                        targetStep = 5; // All steps completed
                      }
                    } catch (error) {
                      console.log('Documents not uploaded yet');
                    }
                  }
                } catch (error) {
                  console.log('Service areas not set yet');
                }
              }
            } catch (error) {
              console.log('Services not selected yet');
            }
          }
          
          setCurrentStep(targetStep);
          
          // Populate form data
          setFormData(prev => ({
            ...prev,
            firstName: provider.firstName || '',
            lastName: provider.lastName || '',
            email: provider.email || '',
            mobileNumber: provider.mobileNumber || '',
            address: provider.address || '',
            businessName: provider.businessName || '',
            businessAbn: provider.businessAbn || '',
          }));
        }
      } catch (error) {
        console.log('No existing provider session, starting fresh');
        setCurrentStep(1);
      } finally {
        setIsCheckingProgress(false);
      }
    };

    checkProviderProgress();
  }, []);

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
      
      // Try to save to AsyncStorage, but don't fail if it doesn't work
      try {
        if (AsyncStorage && AsyncStorage.setItem) {
          await AsyncStorage.setItem('providerId', response.id.toString());
          await AsyncStorage.setItem('currentProvider', JSON.stringify(response));
        }
      } catch (storageError) {
        console.log('AsyncStorage error (non-critical):', storageError);
        // Continue without storage - not critical for registration
      }
      
      setFormData(prev => ({ ...prev, ...data }));
      setCurrentStep(2);
      
      Alert.alert('Success', 'Account created! Now select the services you provide.');
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
        const testResponse = await fetch('http://192.168.1.39:4000/api/health');
        console.log('🌐 Server test response:', testResponse.status);
      } catch (testError) {
        console.error('❌ Server not reachable:', testError);
        Alert.alert('Connection Error', 'Cannot connect to server. Please check if the backend is running on port 4000.');
        return;
      }
      
      const response = await apiService.request('POST', `/api/service-providers/${providerId}/services`, {
        categoryIds: selectedServices
      });
      
      console.log('✅ Step 2 Submit - Success response:', response);
      
      setFormData(prev => ({ ...prev, selectedServices }));
      setCurrentStep(3);
      
      Alert.alert('Success', 'Services added! Now set your service areas.');
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
      // Use the same endpoint as web app
      await apiService.request('POST', `/api/provider/${providerId}/location-service-areas`, {
        serviceAreas
      });
      
      setCurrentStep(4);
      
      Alert.alert('Success', 'Service areas set! Now upload your documents.');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to set service areas. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep4Submit = async () => {
    if (!documentFiles.license || !documentFiles.policeCheck || !documentFiles.insuranceCertificate) {
      Alert.alert('Error', 'Please upload all three required documents.');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('license', documentFiles.license);
      formData.append('policeCheck', documentFiles.policeCheck);
      formData.append('insuranceCertificate', documentFiles.insuranceCertificate);

      await apiService.request('POST', `/api/provider/${providerId}/documents`, formData);
      
      setCurrentStep(5);
      
      Alert.alert(
        'Congratulations!',
        'Thank you for joining ServicePanda. Someone from our team will review your documents and contact you shortly.',
        [
          {
            text: 'OK',
            onPress: () => Alert.alert('Info', 'Registration completed! You can now login.')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to upload documents. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = ['Basic Info', 'Services', 'Service Areas', 'Documents'];
    return (
      <View style={styles.stepIndicator}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepItem}>
            <View style={[
              styles.stepCircle,
              currentStep > index + 1 ? styles.stepCompleted :
              currentStep === index + 1 ? styles.stepCurrent :
              styles.stepPending
            ]}>
              {currentStep > index + 1 ? (
                <Text style={styles.stepCheck}>✓</Text>
              ) : (
                <Text style={styles.stepNumber}>{index + 1}</Text>
              )}
            </View>
            <Text style={[
              styles.stepLabel,
              currentStep === index + 1 && styles.stepLabelCurrent
            ]}>
              {step}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  if (isCheckingProgress) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Checking your progress...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Join ServicePanda</Text>
          <Text style={styles.subtitle}>Complete your registration in a few simple steps</Text>
          

        </View>

        {renderStepIndicator()}

        <View style={styles.stepContainer}>
          {currentStep === 1 && (
            <BasicInfoStep
              formData={formData}
              onSubmit={handleStep1Submit}
              isLoading={isLoading}
            />
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
                onPress={() => Alert.alert('Info', 'Registration completed! You can now login.')}
              >
                <Text style={styles.loginButtonText}>Login Now</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepPending: {
    backgroundColor: colors.border,
    borderWidth: 2,
    borderColor: colors.border,
  },
  stepCurrent: {
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  stepCompleted: {
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.success,
  },
  stepNumber: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepCheck: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  stepLabelCurrent: {
    color: colors.primary,
    fontWeight: '600',
  },
  stepContainer: {
    padding: 20,
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
    fontSize: 40,
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
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
