const React = require('react');
const { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Animated, Dimensions, StatusBar } = require('react-native');
const { TextInput: PaperTextInput } = require('react-native-paper');
const { colors } = require('../../utils/theme');
const { apiService } = require('../../services/api');

const { width, height } = Dimensions.get('window');

const CustomerSignupScreen = ({ onNavigate, onLoginSuccess }: { onNavigate: (screen: string) => void; onLoginSuccess: (data: any) => void }) => {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState('');
  const [confirmPasswordError, setConfirmPasswordError] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [phoneError, setPhoneError] = React.useState('');
  const [firstNameError, setFirstNameError] = React.useState('');
  const [lastNameError, setLastNameError] = React.useState('');
  const [currentStep, setCurrentStep] = React.useState(1);
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  const logoAnim = React.useRef(new Animated.Value(0)).current;
  const buttonScale = React.useRef(new Animated.Value(1)).current;
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  // Start animations on component mount
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
        Animated.timing(logoAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(progressAnim, {
          toValue: 0.33,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]).start();
    };

    startAnimations();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Real-time validation for first name
    if (field === 'firstName') {
      if (value.length === 0) {
        setFirstNameError('First name is required');
      } else {
        setFirstNameError('');
      }
    }

    // Real-time validation for last name
    if (field === 'lastName') {
      if (value.length === 0) {
        setLastNameError('Last name is required');
      } else {
        setLastNameError('');
      }
    }

    // Real-time validation for email field
    if (field === 'email') {
      if (value.length === 0) {
        setEmailError('Email is required');
      } else if (value.length > 0 && !value.includes('@')) {
        setEmailError('Please enter a valid email address');
      } else if (value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError('');
      }
    }

    // Real-time validation for phone field
    if (field === 'phone') {
      if (value.length === 0) {
        setPhoneError('Phone number is required');
      } else if (value.length > 0 && !/^[\d\s\-\+\(\)]+$/.test(value)) {
        setPhoneError('Please enter a valid phone number');
      } else if (value.length > 0 && value.replace(/\D/g, '').length < 10) {
        setPhoneError('Phone number must be at least 10 digits');
      } else if (value.length > 0 && value.replace(/\D/g, '').length > 15) {
        setPhoneError('Phone number cannot exceed 15 digits');
      } else {
        setPhoneError('');
      }
    }

    // Real-time validation for password fields
    if (field === 'password') {
      if (value.length > 0 && value.length < 6) {
        setPasswordError('Password must be at least 6 characters long');
      } else {
        setPasswordError('');
      }
      
      // Also validate confirm password if it has a value
      if (formData.confirmPassword) {
        if (value !== formData.confirmPassword) {
          setConfirmPasswordError('Passwords do not match');
        } else {
          setConfirmPasswordError('');
        }
      }
    }
    
    if (field === 'confirmPassword') {
      if (value !== formData.password) {
        setConfirmPasswordError('Passwords do not match');
      } else {
        setConfirmPasswordError('');
      }
    }
  };

  // Validate individual steps
  const validateStep1 = () => {
    const { firstName, lastName } = formData;
    let isValid = true;
    
    if (!firstName.trim()) {
      setFirstNameError('First name is required');
      isValid = false;
    } else {
      setFirstNameError('');
    }
    
    if (!lastName.trim()) {
      setLastNameError('Last name is required');
      isValid = false;
    } else {
      setLastNameError('');
    }
    
    return isValid;
  };

  const validateStep2 = () => {
    const { email, phone } = formData;
    let isValid = true;
    
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!email.includes('@') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      isValid = false;
    } else if (!/^[\d\s\-\+\(\)]+$/.test(phone)) {
      setPhoneError('Please enter a valid phone number');
      isValid = false;
    } else if (phone.replace(/\D/g, '').length < 10) {
      setPhoneError('Phone number must be at least 10 digits');
      isValid = false;
    } else if (phone.replace(/\D/g, '').length > 15) {
      setPhoneError('Phone number cannot exceed 15 digits');
      isValid = false;
    } else {
      setPhoneError('');
    }
    
    return isValid;
  };

  const validateStep3 = () => {
    const { password, confirmPassword } = formData;
    let isValid = true;
    
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    if (!acceptTerms) {
      Alert.alert('Error', 'Please accept the terms and conditions.');
      isValid = false;
    }
    
    return isValid;
  };

  const validateForm = () => {
    const { firstName, lastName, email, phone, password, confirmPassword } = formData;
    
    // Clear previous errors
    setEmailError('');
    setPhoneError('');
    setPasswordError('');
    setConfirmPasswordError('');
    
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please enter your first and last name.');
      return false;
    }
    
    if (!email.trim() || !email.includes('@') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      Alert.alert('Error', 'Please enter a valid email address.');
      return false;
    }
    
    if (!phone.trim() || phone.length < 10) {
      setPhoneError('Please enter a valid phone number (at least 10 digits)');
      Alert.alert('Error', 'Please enter a valid phone number (at least 10 digits).');
      return false;
    }
    
    if (!/^[0-9+\-\s()]+$/.test(phone)) {
      setPhoneError('Please enter a valid phone number');
      Alert.alert('Error', 'Please enter a valid phone number.');
      return false;
    }
    
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return false;
    }
    
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      Alert.alert('Error', 'Passwords do not match.');
      return false;
    }
    
    if (!acceptTerms) {
      Alert.alert('Error', 'Please accept the terms and conditions.');
      return false;
    }
    
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsLoading(true);
    
    try {
      console.log('📝 Attempting customer registration:', { email: formData.email });
      
      // Call the actual API
      const user = await apiService.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phone,
      });
      
      console.log('✅ Customer registration successful:', user);
      
      // Store customer data in AsyncStorage
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('customerId', user.id.toString());
      await AsyncStorage.setItem('customerData', JSON.stringify({
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        phone: user.phoneNumber
      }));
      
      Alert.alert('Success', `Welcome to ServicePanda, ${user.firstName}! Please login to continue.`, [
        {
          text: 'OK',
          onPress: () => onNavigate('login'),
        },
      ]);
          } catch (error: any) {
            console.error('❌ Registration error:', error);

            // Parse error message for better user feedback
            let errorMessage = 'Registration failed. Please try again.';
            if (error?.message) {
              if (error.message.includes('409') || error.message.includes('duplicate')) {
                errorMessage = 'An account with this email already exists.';
              } else if (error.message.includes('400')) {
                errorMessage = 'Please check your information and try again.';
              } else if (error.message.includes('500')) {
                errorMessage = 'Server error. Please try again later.';
              } else if (error.message.includes('Network')) {
                errorMessage = 'Network error. Please check your connection.';
              }
            }

            Alert.alert('Registration Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    onNavigate('login');
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicator}>
        <View style={styles.stepContainer}>
          <View style={[styles.step, currentStep >= 1 && styles.stepActive]}>
            <Text style={[styles.stepNumber, currentStep >= 1 && styles.stepNumberActive]}>1</Text>
          </View>
          <Text style={styles.stepLabel}>Personal</Text>
        </View>
        <View style={[styles.stepLine, currentStep >= 2 && styles.stepLineActive]} />
        <View style={styles.stepContainer}>
          <View style={[styles.step, currentStep >= 2 && styles.stepActive]}>
            <Text style={[styles.stepNumber, currentStep >= 2 && styles.stepNumberActive]}>2</Text>
          </View>
          <Text style={styles.stepLabel}>Contact</Text>
        </View>
        <View style={[styles.stepLine, currentStep >= 3 && styles.stepLineActive]} />
        <View style={styles.stepContainer}>
          <View style={[styles.step, currentStep >= 3 && styles.stepActive]}>
            <Text style={[styles.stepNumber, currentStep >= 3 && styles.stepNumberActive]}>3</Text>
          </View>
          <Text style={styles.stepLabel}>Security</Text>
        </View>
      </View>
    );
  };

  const renderFormFields = () => {
    if (currentStep === 1) {
      return (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>First Name</Text>
            <PaperTextInput
              mode="outlined"
              value={formData.firstName}
              onChangeText={(value) => handleInputChange('firstName', value)}
              autoCapitalize="words"
              placeholder="Enter your first name"
              style={[styles.paperInput, firstNameError && styles.inputError]}
              left={<PaperTextInput.Icon icon="account" iconColor={colors.textTertiary} />}
              outlineColor={firstNameError ? colors.error : colors.border}
              activeOutlineColor={firstNameError ? colors.error : colors.primary}
              contentStyle={styles.inputContent}
            />
            {firstNameError ? (
              <Text style={styles.errorText}>{firstNameError}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <PaperTextInput
              mode="outlined"
              value={formData.lastName}
              onChangeText={(value) => handleInputChange('lastName', value)}
              autoCapitalize="words"
              placeholder="Enter your last name"
              style={[styles.paperInput, lastNameError && styles.inputError]}
              left={<PaperTextInput.Icon icon="account" iconColor={colors.textTertiary} />}
              outlineColor={lastNameError ? colors.error : colors.border}
              activeOutlineColor={lastNameError ? colors.error : colors.primary}
              contentStyle={styles.inputContent}
            />
            {lastNameError ? (
              <Text style={styles.errorText}>{lastNameError}</Text>
            ) : null}
          </View>

          <TouchableOpacity 
            style={styles.nextButton}
            onPress={() => {
              if (validateStep1()) {
                setCurrentStep(2);
              }
            }}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </>
      );
    } else if (currentStep === 2) {
      return (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <PaperTextInput
              mode="outlined"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Enter your email"
              style={[styles.paperInput, emailError && styles.inputError]}
              left={<PaperTextInput.Icon icon="email" iconColor={colors.textTertiary} />}
              outlineColor={emailError ? colors.error : colors.border}
              activeOutlineColor={emailError ? colors.error : colors.primary}
              contentStyle={styles.inputContent}
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <PaperTextInput
              mode="outlined"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              keyboardType="phone-pad"
              placeholder="Enter your phone number"
              maxLength={15}
              style={[styles.paperInput, phoneError && styles.inputError]}
              left={<PaperTextInput.Icon icon="phone" iconColor={colors.textTertiary} />}
              outlineColor={phoneError ? colors.error : colors.border}
              activeOutlineColor={phoneError ? colors.error : colors.primary}
              contentStyle={styles.inputContent}
            />
            {phoneError ? (
              <Text style={styles.errorText}>{phoneError}</Text>
            ) : null}
          </View>

          <View style={styles.stepButtons}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setCurrentStep(1)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.nextButton}
              onPress={() => {
                if (validateStep2()) {
                  setCurrentStep(3);
                }
              }}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    } else {
      return (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={[styles.passwordInputWrapper, passwordError && styles.inputError]}>
              <View style={styles.lockIconContainer}>
                <PaperTextInput.Icon icon="lock" iconColor={colors.textTertiary} />
              </View>
              <TextInput
                style={styles.passwordInput}
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry={!showPassword}
                placeholder="Enter your password"
                placeholderTextColor={colors.textTertiary}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => {
                  console.log('Password visibility toggle pressed, current showPassword:', showPassword);
                  setShowPassword(!showPassword);
                }}
                activeOpacity={0.7}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              >
                <Text style={styles.eyeIcon}>
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </Text>
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={[styles.passwordInputWrapper, confirmPasswordError && styles.inputError]}>
              <View style={styles.lockIconContainer}>
                <PaperTextInput.Icon icon="lock" iconColor={colors.textTertiary} />
              </View>
              <TextInput
                style={styles.passwordInput}
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor={colors.textTertiary}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => {
                  console.log('Confirm password visibility toggle pressed, current showConfirmPassword:', showConfirmPassword);
                  setShowConfirmPassword(!showConfirmPassword);
                }}
                activeOpacity={0.7}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              >
                <Text style={styles.eyeIcon}>
                  {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
                </Text>
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? (
              <Text style={styles.errorText}>{confirmPasswordError}</Text>
            ) : null}
          </View>

          <View style={styles.termsContainer}>
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setAcceptTerms(!acceptTerms)}
            >
              <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                {acceptTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.stepButtons}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setCurrentStep(2)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.nextButton, isLoading && styles.nextButtonDisabled]} 
              onPress={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingSpinner} />
              ) : (
                <Text style={styles.nextButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Background Gradient */}
      <View style={styles.backgroundGradient} />
      
      {/* Floating Elements */}
      <Animated.View 
        style={[
          styles.floatingElement1,
          {
            opacity: logoAnim,
            transform: [
              { translateY: logoAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0]
              })}
            ]
          }
        ]}
      />
      <Animated.View 
        style={[
          styles.floatingElement2,
          {
            opacity: logoAnim,
            transform: [
              { translateY: logoAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0]
              })}
            ]
          }
        ]}
      />

      <KeyboardAvoidingView 
        style={styles.keyboardContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with Logo Animation */}
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: logoAnim,
                transform: [
                  { scale: logoAnim },
                  { translateY: logoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 0]
                  })}
                ]
              }
            ]}
          >
            <View style={styles.headerContent}>
              <View style={styles.logoContainer}>
                <View style={styles.logoBackground}>
                  <Text style={styles.logo}>🐼</Text>
                </View>
                <View style={styles.logoGlow} />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>ServicePanda</Text>
                <Text style={styles.subtitle}>Join thousands of satisfied customers</Text>
              </View>
            </View>
          </Animated.View>

          {/* Main Card with Animation */}
          <Animated.View 
            style={[
              styles.cardContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            {/* Tab Selector */}
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tab, styles.activeTab]}
                onPress={() => setActiveTab('register')}
              >
                <Text style={[styles.tabText, styles.activeTabText]}>
                  Register
                </Text>
                <View style={styles.tabIndicator} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.tab}
                onPress={handleLogin}
              >
                <Text style={styles.tabText}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>

            {/* Progress Indicator */}
            {renderStepIndicator()}

            {/* Form Content */}
            <View style={styles.formContent}>
              <Text style={styles.welcomeText}>Create your account</Text>
              <Text style={styles.welcomeSubtext}>Step {currentStep} of 3</Text>

              {renderFormFields()}

              {/* Login Link */}
              <View style={styles.loginLinkContainer}>
                <Text style={styles.loginLinkText}>
                  Already have an account? <Text style={styles.loginLinkBold} onPress={handleLogin}>Sign in</Text>
                </Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    opacity: 0.1,
  },
  floatingElement1: {
    position: 'absolute',
    top: 100,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary + '20',
  },
  floatingElement2: {
    position: 'absolute',
    bottom: 200,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.secondary + '20',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'relative',
    marginRight: 20,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  logoBackground: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoGlow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 55,
    backgroundColor: colors.primary + '30',
    zIndex: -1,
  },
  logo: {
    fontSize: 35,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.surface,
    opacity: 0.9,
    textAlign: 'center',
  },
  cardContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    margin: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  tabIndicator: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  stepContainer: {
    alignItems: 'center',
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepActive: {
    backgroundColor: colors.primary,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  stepNumberActive: {
    color: colors.surface,
  },
  stepLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 8,
    marginBottom: 20,
  },
  stepLineActive: {
    backgroundColor: colors.primary,
  },
  formContent: {
    padding: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
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
  paperInput: {
    backgroundColor: colors.surface,
  },
  inputContent: {
    fontSize: 16,
    color: colors.text,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    height: 56,
  },
  lockIconContainer: {
    marginRight: 20,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    height: 56,
    marginRight: 16,
  },
  eyeButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  eyeIcon: {
    fontSize: 20,
    color: colors.textTertiary,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  stepButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 24,
    gap: 12,
  },
  backButton: {
    flex: 0.4,
    backgroundColor: colors.background,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  backButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 0.6,
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.7,
  },
  nextButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 56,
    width: '120%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  signupButtonGlow: {
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
    marginRight: 8,
  },
  termsContainer: {
    marginTop: 10,
    marginBottom: 2,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '600',
  },
  loginLinkContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  loginLinkText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  loginLinkBold: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

module.exports = CustomerSignupScreen;