const React = require('react');
const { useState } = require('react');
const { View, StyleSheet, TouchableOpacity, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } = require('react-native');
const { Title, Paragraph, Card, Button, TextInput } = require('react-native-paper');
const { useMutation } = require('@tanstack/react-query');
const { colors } = require('../../utils/theme');
const apiService = require('../../services/api');

const ForgotPasswordScreen = ({ onNavigate }) => {
  const [email, setEmail] = useState('');

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email) => {
      console.log('🚀 Sending forgot password request for:', email);
      const response = await apiService.forgotPassword(email);
      console.log('✅ Forgot password response:', response);
      return response;
    },
    onSuccess: () => {
      console.log('🎉 Password reset email sent successfully');
      Alert.alert(
        "Reset Email Sent",
        "If an account with that email exists, we've sent a password reset link.",
        [{ text: "OK" }]
      );
      setEmail('');
    },
    onError: (error) => {
      console.error('❌ Forgot password error:', error);
      Alert.alert(
        "Request Failed",
        error.message || "Failed to send reset email. Please try again."
      );
    },
  });

  const handleSubmit = () => {
    if (!email.trim()) {
      Alert.alert("Email Required", "Please enter your email address.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    console.log('🔍 Submitting forgot password for email:', email.trim());
    forgotPasswordMutation.mutate(email.trim());
  };

  return (
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
          <Text style={styles.subtitle}>Forgot Password</Text>
          <Text style={styles.description}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>
        </View>

        <Card style={styles.card} contentStyle={styles.cardContentStyle}>
          <Card.Content style={styles.cardContent}>
            <Title style={styles.cardTitle}>Reset Your Password</Title>
            
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
                  disabled={forgotPasswordMutation.isPending}
                />
              </View>
            </View>

            {/* Send Reset Link Button - blue color matching web */}
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={forgotPasswordMutation.isPending}
              disabled={forgotPasswordMutation.isPending}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              buttonColor={colors.primary}
            >
              {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
            </Button>

            {/* Back to Login Link */}
            <View style={styles.backContainer}>
              <Button
                mode="text"
                onPress={() => {
                  console.log('🔍 Back to login clicked');
                  onNavigate('login');
                }}
                style={styles.backButton}
                textColor={colors.primary}
                disabled={forgotPasswordMutation.isPending}
              >
                ← Back to Login
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Exact web background color
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 16,
    paddingTop: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 0,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 36,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827', // Dark gray matching web
  },
  subtitle: {
    fontSize: 20,
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
    paddingHorizontal: 20,
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
    marginBottom: 20,
    fontSize: 18,
    color: '#111827',
  },
  inputContainer: {
    marginBottom: 20,
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
    marginBottom: 20,
    borderRadius: 6,
    height: 40,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  backContainer: {
    alignItems: 'center',
  },
  backButton: {
    marginVertical: 0,
  },
});

module.exports = ForgotPasswordScreen;







