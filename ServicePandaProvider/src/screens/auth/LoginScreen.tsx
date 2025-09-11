const React = require('react');
const { useState } = require('react');
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
} = require('react-native');
const { TextInput, Button, Card, Title, Paragraph } = require('react-native-paper');
const { useMutation } = require('@tanstack/react-query');
const { useAuth } = require('../../contexts/AuthContext');
const { colors } = require('../../utils/theme');

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ onNavigate, navigation }) => {
  console.log('🔍 LoginScreen - onNavigate:', !!onNavigate, 'navigation:', !!navigation);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      console.log('🚀 Starting login process...');
      console.log('📧 Email:', credentials.email);
      console.log('🔗 API Endpoint: /api/provider/login');

      try {
        const result = await login(credentials.email, credentials.password);
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

  const handleSubmit = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing Information", "Please enter both email and password.");
      return;
    }

    loginMutation.mutate({ email: email.trim(), password });
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

                  {/* Divider */}
                  <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* Register Link */}
                  <View style={styles.registerSection}>
                    <Text style={styles.registerText}>
                      Don't have a provider account?
                    </Text>
                    <Button
                      mode="text"
                      onPress={() => {
                        console.log('🔍 Button clicked! Navigating to ProviderRegistration');
                        onNavigate('providerRegistration');
                      }}
                      style={styles.registerButton}
                      labelStyle={styles.registerButtonLabel}
                    >
                      Join us as a Partner
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By signing in, you agree to our Terms of Service and Privacy Policy
              </Text>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 20,
    minHeight: height * 0.8, // Reduced page height
  },
  
  // Header Styles
  header: {
    alignItems: 'center',
    marginBottom: 20, // Reduced margin
    paddingTop: 0,
  },
  logoContainer: {
    flexDirection: 'row', // Horizontal layout
    alignItems: 'center',
    marginBottom: 0,
  },
  textContainer: {
    marginLeft: 16, // Space between icon and text
    alignItems: 'flex-start',
  },
  logoCircle: {
    width: 60, // Reduced size
    height: 60, // Reduced size
    borderRadius: 30, // Reduced size
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0, // No bottom margin since it's horizontal
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    fontSize: 28, // Reduced size
    textAlign: 'center',
    lineHeight: 28,
  },
  title: {
    fontSize: 24, // Reduced size
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 14, // Reduced size
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },

  // Form Container
  formContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 10, // Reduced margin
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    marginHorizontal: 0,
    marginVertical: 5, // Reduced margin
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
  },

  // Input Styles
  inputGroup: {
    marginBottom: 15, // Reduced margin
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  required: {
    color: colors.error,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  inputContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  // Forgot Password
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordButton: {
    marginVertical: 0,
  },
  forgotPasswordLabel: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },

  // Sign In Button
  signInButton: {
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signInButtonContent: {
    paddingVertical: 12,
  },
  signInButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: colors.textTertiary,
    fontWeight: '500',
  },

  // Register Section
  registerSection: {
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  registerButton: {
    marginVertical: 0,
  },
  registerButtonLabel: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },

  // Footer
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 16,
  },
});

module.exports = LoginScreen;