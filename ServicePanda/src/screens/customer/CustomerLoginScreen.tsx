const React = require('react');
const { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Animated, Dimensions, StatusBar } = require('react-native');
const { TextInput: PaperTextInput } = require('react-native-paper');
const { colors } = require('../../utils/theme');
const { apiService } = require('../../services/api');

const { width, height } = Dimensions.get('window');

const CustomerLoginScreen = ({ onNavigate, onLoginSuccess }: { onNavigate: (screen: string) => void; onLoginSuccess: (data: any) => void }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('login');
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  const logoAnim = React.useRef(new Animated.Value(0)).current;
  const buttonScale = React.useRef(new Animated.Value(1)).current;

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
      ]).start();
    };

    startAnimations();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

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
      console.log('🔐 Attempting customer login:', { email });
      
      // Call the actual API
      const user = await apiService.login({ email, password });
      
      console.log('✅ Customer login successful:', user);
      
      // Store customer data in AsyncStorage
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('customerId', user.id.toString());
      await AsyncStorage.setItem('customerData', JSON.stringify({
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        phone: user.phoneNumber
      }));
      
      Alert.alert('Success', `Welcome back, ${user.firstName}!`, [
        {
          text: 'OK',
          onPress: () => onLoginSuccess({
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            phone: user.phoneNumber
          }),
        },
      ]);
          } catch (error: any) {
            console.error('❌ Login error:', error);

            // Parse error message for better user feedback
            let errorMessage = 'Login failed. Please try again.';
            if (error?.message) {
              if (error.message.includes('401')) {
                errorMessage = 'Invalid email or password.';
              } else if (error.message.includes('404')) {
                errorMessage = 'Account not found. Please check your email.';
              } else if (error.message.includes('500')) {
                errorMessage = 'Server error. Please try again later.';
              } else if (error.message.includes('Network')) {
                errorMessage = 'Network error. Please check your connection.';
              }
            }

            Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset feature coming soon!');
  };

  const handleSignup = () => {
    onNavigate('signup');
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
                <Text style={styles.subtitle}>Find the perfect service provider</Text>
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
                style={[styles.tab, activeTab === 'login' && styles.activeTab]}
                onPress={() => setActiveTab('login')}
              >
                <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>
                  Login
                </Text>
                {activeTab === 'login' && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'register' && styles.activeTab]}
                onPress={() => onNavigate('signup')}
              >
                <Text style={[styles.tabText, activeTab === 'register' && styles.activeTabText]}>
                  Register
                </Text>
                {activeTab === 'register' && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            </View>

            {/* Form Content */}
            <View style={styles.formContent}>
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.welcomeSubtext}>Sign in to your ServicePanda account</Text>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <PaperTextInput
                  mode="outlined"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Enter your email"
                  style={styles.paperInput}
                  left={<PaperTextInput.Icon icon="email" iconColor={colors.textTertiary} />}
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                  contentStyle={styles.inputContent}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <PaperTextInput
                  mode="outlined"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="Enter your password"
                  style={styles.paperInput}
                  left={<PaperTextInput.Icon icon="lock" iconColor={colors.textTertiary} />}
                  right={
                    <PaperTextInput.Icon 
                      icon={showPassword ? "eye-off" : "eye"} 
                      iconColor={colors.textTertiary}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                  contentStyle={styles.inputContent}
                />
              </View>

              {/* Login Button */}
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity 
                  style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <View style={styles.loginButtonContent}>
                    {isLoading ? (
                      <View style={styles.loadingSpinner} />
                    ) : (
                      <Text style={styles.loginButtonText}>Sign In</Text>
                    )}
                  </View>
                  <View style={styles.loginButtonGlow} />
                </TouchableOpacity>
              </Animated.View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Sign Up Link */}
              <TouchableOpacity 
                style={styles.signupButton}
                onPress={handleSignup}
              >
                <Text style={styles.signupButtonText}>
                  Don't have an account? <Text style={styles.signupButtonTextBold}>Sign up</Text>
                </Text>
              </TouchableOpacity>
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
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButtonText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButtonGlow: {
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
  forgotPasswordButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.textSecondary,
    fontSize: 14,
  },
  signupButton: {
    alignItems: 'center',
  },
  signupButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  signupButtonTextBold: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

module.exports = CustomerLoginScreen;