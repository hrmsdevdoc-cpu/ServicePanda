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
  TouchableOpacity,
  SafeAreaView,
} = require('react-native');
const { TextInput, Button, Card, Title, Paragraph } = require('react-native-paper');
const { useMutation } = require('@tanstack/react-query');
const { colors } = require('../../utils/theme');

const ForgotPasswordScreen = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!email.trim()) {
      Alert.alert("Missing Information", "Please enter your email address.");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        "Reset Link Sent",
        "If an account with this email exists, you will receive a password reset link shortly.",
        [
          {
            text: "OK",
            onPress: () => onNavigate('login')
          }
        ]
      );
    }, 2000);
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
          <Text style={styles.subtitle}>Reset Password</Text>
          <Text style={styles.description}>
            Enter your email address and we'll send you a link to reset your password
          </Text>
        </View>

        <Card style={styles.card} contentStyle={styles.cardContentStyle}>
          <Card.Content style={styles.cardContent}>
            <Title style={styles.cardTitle}>Forgot your password?</Title>
            
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

            {/* Submit Button - blue color matching web */}
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              buttonColor={colors.primary}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>

            {/* Back to Login Link */}
            <View style={styles.links}>
              <Button
                mode="text"
                onPress={() => onNavigate('login')}
                style={styles.linkButton}
                textColor={colors.primary}
              >
                ← Back to Login
              </Button>
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
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 5,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    marginRight: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111827', // Dark gray matching web
  },
  subtitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 0,
  },
  card: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF', // Pure white background matching web
    borderWidth: 0,
    marginTop: 4,
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
    marginBottom: 24,
    fontSize: 20,
    color: '#111827', // Dark gray matching web
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151', // Medium gray matching web
    marginBottom: 8,
  },
  required: {
    color: '#EF4444', // Red color matching web
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#FFFFFF', // Pure white input background
  },
  button: {
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 6,
    height: 44,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  links: {
    alignItems: 'center',
    gap: 16,
  },
  linkButton: {
    marginVertical: 0,
  },
});

module.exports = ForgotPasswordScreen;