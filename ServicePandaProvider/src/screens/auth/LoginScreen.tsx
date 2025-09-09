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
} = require('react-native');
const { TextInput, Button, Card, Title, Paragraph } = require('react-native-paper');
const { useMutation } = require('@tanstack/react-query');
const { useAuth } = require('../../contexts/AuthContext');
const { colors } = require('../../utils/theme');

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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          {/* Panda Logo with title - matching web design */}
          <View style={styles.logoContainer}>
            <View style={styles.logoRow}>
              <Text style={styles.logo}>🐼</Text>
              <Text style={styles.title}>ServicePanda</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>Partner Login</Text>
          <Text style={styles.description}>
            Access your provider dashboard to manage leads and grow your business
          </Text>
        </View>

        <Card style={styles.card} contentStyle={styles.cardContentStyle}>
          <Card.Content style={styles.cardContent}>
            <Title style={styles.cardTitle}>Sign in to your account</Title>
            {/* Email Input - matching web design */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Enter your email address"
                  style={styles.input}
                  left={<TextInput.Icon icon="email" iconColor="#9CA3AF" />}
                  outlineColor="#D1D5DB"
                  activeOutlineColor={colors.primary}
                />
              </View>
            </View>

            {/* Password Input - matching web design */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  placeholder="Enter your password"
                  style={styles.input}
                  left={<TextInput.Icon icon="lock" iconColor="#9CA3AF" />}
                  right={
                    <TextInput.Icon 
                      icon={showPassword ? "eye-off" : "eye"} 
                      iconColor="#9CA3AF"
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                  outlineColor="#D1D5DB"
                  activeOutlineColor={colors.primary}
                />
              </View>
            </View>

            {/* Sign In Button - blue color matching web */}
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loginMutation.isPending}
              disabled={loginMutation.isPending}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              buttonColor={colors.primary}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>

            {/* Links - matching web design */}
            <View style={styles.links}>
              <Button
                mode="text"
                onPress={() => {
                  console.log('🔍 Forgot password button pressed!');
                  console.log('🔍 Calling onNavigate with forgotPassword');
                  onNavigate('forgotPassword');
                  console.log('🔍 onNavigate call completed');
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
                    console.log('🔍 Button clicked! Navigating to ProviderRegistration');
                    onNavigate('providerRegistration');
                  }}
                  style={styles.linkButton}
                  textColor={colors.primary}
                >
                  Join us as a Partner
                </Button>
              </View>
            </View>
          </Card.Content>
        </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Exact web background color
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Exact web background color
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 20 : 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 0,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 0,
  },
  card: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    marginTop: 2,
  },
  cardContent: {
    backgroundColor: '#FFFFFF',
    padding: 0,
  },
  cardContentStyle: {
    backgroundColor: '#FFFFFF',
    padding: 0,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 18,
    color: '#111827',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  required: {
    color: '#EF4444',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginTop: 6,
    marginBottom: 16,
    borderRadius: 6,
    height: 40,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  links: {
    alignItems: 'center',
    gap: 12,
  },
  linkButton: {
    marginVertical: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
    marginVertical: 12,
  },
  registerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  registerText: {
    color: '#6B7280',
    fontSize: 13,
  },
  backButton: {
    marginTop: 8,
  },
});

module.exports = LoginScreen;