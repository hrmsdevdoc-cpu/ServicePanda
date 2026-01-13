const React = require('react');
const { useState, useEffect } = require('react');
const {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} = require('react-native');
const { TextInput, Button, Card, Title, Paragraph, Checkbox } = require('react-native-paper');
const { useMutation } = require('@tanstack/react-query');
const { useAuth } = require('../../contexts/AuthContext');
const { colors } = require('../../utils/theme');
const AsyncStorage = require('@react-native-async-storage/async-storage').default;

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ onNavigate }) => {
  console.log('🔍 LoginScreen rendered with onNavigate:', !!onNavigate, onNavigate);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();

  // Load saved credentials on component mount
  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('rememberedEmail');
      const savedPassword = await AsyncStorage.getItem('rememberedPassword');
      const rememberMeStatus = await AsyncStorage.getItem('rememberMe');
      
      if (savedEmail && rememberMeStatus === 'true') {
        setEmail(savedEmail);
        setPassword(savedPassword || '');
        setRememberMe(true);
      }
    } catch (error) {
      console.error('Error loading saved credentials:', error);
    }
  };

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      console.log('🚀 Starting login process...');
      console.log('📧 Email:', credentials.email);
      console.log('🔗 API Endpoint: /api/provider/login');

      try {
        const result = await login(credentials.email, credentials.password, credentials.rememberMe);
        console.log('✅ Login successful:', result);
        return result;
      } catch (error) {
        console.error('❌ Login failed:', error);
        throw error;
      }
    },
    onSuccess: async (provider) => {
      console.log('🎉 Login success, provider data:', provider);
      console.log('📊 Profile completion check:');
      console.log('  - documentsUploaded:', provider.documentsUploaded);
      console.log('  - termsAccepted:', provider.termsAccepted);
      console.log('  - status:', provider.status);
      console.log('  - providerStatus:', provider.providerStatus);
      
      // Check if provider needs to complete signup steps
      // Only check these fields if they exist in the response
      const needsStepCompletion = (provider.documentsUploaded === false) || 
                                 (provider.termsAccepted === false) || 
                                 (provider.status === 'pending') ||
                                 (provider.providerStatus === 'deactivated');
      
      console.log('🔍 Needs step completion:', needsStepCompletion);
      
      if (needsStepCompletion) {
        console.log('⚠️ Provider needs to complete profile setup');
        // For now, just show success message - user will be automatically redirected to dashboard
        Alert.alert(
          "Login Successful",
          "Welcome back! You may need to complete some profile setup steps.",
          [{ text: "OK" }]
        );
      } else {
        console.log('✅ Provider profile is complete');
        // User will be automatically redirected to dashboard by the auth context
      }
    },
    onError: (error) => {
      console.error('💥 Login error:', error);
      Alert.alert(
        "Login Failed",
        error.message || "Invalid username or password. Please try again."
      );
    },
  });

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing Information", "Please enter both email and password.");
      return;
    }

    // Save credentials if remember me is checked
    if (rememberMe) {
      try {
        await AsyncStorage.setItem('rememberedEmail', email.trim());
        await AsyncStorage.setItem('rememberedPassword', password);
        await AsyncStorage.setItem('rememberMe', 'true');
      } catch (error) {
        console.error('Error saving credentials:', error);
      }
    } else {
      // Clear saved credentials if remember me is unchecked
      try {
        await AsyncStorage.removeItem('rememberedEmail');
        await AsyncStorage.removeItem('rememberedPassword');
        await AsyncStorage.removeItem('rememberMe');
      } catch (error) {
        console.error('Error clearing credentials:', error);
      }
    }

    loginMutation.mutate({ email: email.trim(), password, rememberMe });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Gradient Background */}
      <View style={styles.gradientBackground} />
      
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Text style={styles.logo}>🐼</Text>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>ServicePanda</Text>
                  <Text style={styles.tagline}>Partner Portal</Text>
                </View>
              </View>
            </View>

            {/* Login Form Card */}
            <View style={styles.formContainer}>
              <Card style={styles.card} elevation={0}>
                <Card.Content style={styles.cardContent}>
                  <View style={styles.formHeader}>
                    <Text style={styles.formTitle}>Sign In</Text>
                    <Text style={styles.formSubtitle}>Enter your credentials to continue</Text>
                  </View>

                  {/* Email Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      Email Address <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Enter your email address"
                        style={styles.input}
                        left={<TextInput.Icon icon="email" iconColor={colors.textTertiary} />}
                        outlineColor={colors.border}
                        activeOutlineColor={colors.primary}
                        contentStyle={styles.inputContent}
                      />
                    </View>
                  </View>

                  {/* Password Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      Password <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        value={password}
                        onChangeText={setPassword}
                        mode="outlined"
                        secureTextEntry={!showPassword}
                        placeholder="Enter your password"
                        style={styles.input}
                        left={<TextInput.Icon icon="lock" iconColor={colors.textTertiary} />}
                        right={
                          <TextInput.Icon 
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
                  </View>

                  {/* Remember Me Checkbox */}
                  <View style={styles.rememberMeContainer}>
                    <TouchableOpacity
                      style={styles.rememberMeRow}
                      onPress={() => setRememberMe(!rememberMe)}
                      activeOpacity={0.7}
                    >
                      <TouchableOpacity
                        style={styles.customCheckbox}
                        onPress={() => setRememberMe(!rememberMe)}
                      >
                        <View style={[
                          styles.checkboxSquare,
                          rememberMe && styles.checkboxChecked
                        ]}>
                          {rememberMe && (
                            <Text style={styles.checkmark}>✓</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                      <Text style={styles.rememberMeText}>Remember me</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Forgot Password Link */}
                  <View style={styles.forgotPasswordContainer}>
                    <Button
                      mode="text"
                      onPress={() => {
                        console.log('🔍 Forgot password button pressed!');
                        onNavigate('forgotPassword');
                      }}
                      style={styles.forgotPasswordButton}
                      labelStyle={styles.forgotPasswordLabel}
                    >
                      Forgot your password?
                    </Button>
                  </View>

                  {/* Sign In Button */}
                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    loading={loginMutation.isPending}
                    disabled={loginMutation.isPending}
                    style={styles.signInButton}
                    labelStyle={styles.signInButtonLabel}
                    buttonColor={colors.primary}
                    contentStyle={styles.signInButtonContent}
                  >
                    {loginMutation.isPending ? "Signing in..." : "Sign In"}
                  </Button>

            {/* Links - matching web design */}
            <View style={styles.links}>
                             <Button
                 mode="text"
                 onPress={() => {
                   console.log('🔍 Forgot password clicked! Navigating to ForgotPassword');
                   onNavigate('ForgotPassword');
                 }}
                 style={styles.linkButton}
                 textColor={colors.primary}
               >
                 Forgot your password?
               </Button>
              
              <View style={styles.divider} />
              
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>
                  Don't have a provider account?{' '}
                </Text>
                                                   <Button
                    mode="text"
                    onPress={() => {
                      console.log('🔍 Button clicked! onNavigate exists:', !!onNavigate);
                      if (onNavigate) {
                        console.log('🔍 Calling onNavigate with ProviderRegistration');
                        onNavigate('ProviderRegistration');
                      } else {
                        console.log('❌ onNavigate is undefined!');
                      }
                    }}
                    style={styles.linkButton}
                    textColor={colors.primary}
                  >
                    Join us as a Partner
                  </Button>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

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
    // Note: For a true gradient, you'd need react-native-linear-gradient
    // For now, we'll use a solid color with some visual elements
  },
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 16, // Reduced from 20
    paddingTop: 16, // Reduced from 20
  },
  
  // Header Styles
  header: {
    alignItems: 'center',
    marginBottom: 12, // Reduced from 16
    marginTop: 0, // Reduced from 5
  },
  logoContainer: {
    marginBottom: 20, // Reduced from 32
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0, // No bottom margin since it's horizontal
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    fontSize: 36, // Reduced from 48
    marginRight: 12, // Reduced from 16
  },
  title: {
    fontSize: 24, // Reduced from 30
    fontWeight: 'bold',
    color: '#111827', // Dark gray matching web
  },
  subtitle: {
    fontSize: 20, // Reduced from 26
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2, // Reduced from 4
  },
  description: {
    fontSize: 14, // Reduced from 16
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20, // Reduced from 24
    marginTop: 0,
    paddingHorizontal: 20, // Add horizontal padding for better text wrapping
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF', // Pure white background matching web
    borderWidth: 0, // Remove any borders
    marginTop: 2, // Reduced from 4
  },
  cardContent: {
    padding: 20, // Reduced padding
  },

  // Form Header
  formHeader: {
    alignItems: 'center',
    marginBottom: 20, // Reduced margin
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20, // Reduced from 24
    fontSize: 18, // Reduced from 20
    color: '#111827', // Dark gray matching web
  },
  inputContainer: {
    marginBottom: 20, // Reduced from 24
  },
  inputLabel: {
    fontSize: 13, // Reduced from 14
    fontWeight: '500',
    color: '#374151', // Medium gray matching web
    marginBottom: 6, // Reduced from 8
  },
  required: {
    color: colors.error,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#FFFFFF', // Pure white input background
  },
  button: {
    marginTop: 6, // Reduced from 8
    marginBottom: 20, // Reduced from 24
    borderRadius: 6,
    height: 40, // Reduced from 44
  },
  buttonLabel: {
    fontSize: 15, // Reduced from 16
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // Reduced from 16
  },
  linkButton: {
    marginVertical: 0,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB', // Light gray matching web
    width: '100%',
    marginVertical: 12, // Reduced from 16
  },
  registerContainer: {
    alignItems: 'center',
  },
  registerText: {
    color: '#6B7280', // Medium gray matching web
    fontSize: 13, // Reduced from 14
  },
  backButton: {
    marginTop: 6, // Reduced from 8
  },
});

module.exports = LoginScreen;