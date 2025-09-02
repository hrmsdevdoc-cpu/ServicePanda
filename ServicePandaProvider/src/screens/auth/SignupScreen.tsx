const React = require('react');
const { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } = require('react-native');

const SignupScreen = ({ onNavigate, navigation }) => {
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleSignup = () => {
    // TODO: Implement signup logic
    console.log('Signup:', { fullName, email, phone, password, confirmPassword });
  };

  const handleLogin = () => {
    onNavigate('login');
  };

  const handleProviderRegistration = () => {
    if (navigation) {
      navigation.navigate('ProviderRegistration');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join ServicePanda as a provider</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.signupButtonText}>Create Account</Text>
            </TouchableOpacity>

            {/* Provider Registration Button */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
              style={styles.providerButton} 
              onPress={handleProviderRegistration}
            >
              <Text style={styles.providerButtonText}>Join as Service Provider</Text>
              <Text style={styles.providerButtonSubtext}>Complete multi-step registration</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: '#fafafa',
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 12, // Reduced from 20
    marginBottom: 16, // Reduced from 20
  },
  title: {
    fontSize: 20, // Reduced from 24
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4, // Reduced from 6
  },
  subtitle: {
    fontSize: 13, // Reduced from 14
=======
    backgroundColor: '#F5FCFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
>>>>>>> 085af7f9981a4f4c28bc1fde96eb87c8bbc41059
    color: '#666',
    textAlign: 'center',
  },
  form: {
    flex: 1,
<<<<<<< HEAD
    paddingHorizontal: 16, // Reduced from 20
  },
  inputContainer: {
    marginBottom: 12, // Reduced from 16
  },
  label: {
    fontSize: 13, // Reduced from 14
    fontWeight: '600',
    color: '#333',
    marginBottom: 4, // Reduced from 6
=======
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
>>>>>>> 085af7f9981a4f4c28bc1fde96eb87c8bbc41059
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
<<<<<<< HEAD
    borderRadius: 6, // Reduced from 8
    padding: 10, // Reduced from 12
    fontSize: 14, // Reduced from 15
    height: 40, // Add fixed height for consistency
  },
  signupButton: {
    backgroundColor: '#007AFF',
    borderRadius: 6, // Reduced from 8
    padding: 10, // Reduced from 12
    alignItems: 'center',
    marginTop: 12, // Reduced from 16
    height: 40, // Add fixed height for consistency
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 14, // Reduced from 15
=======
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
>>>>>>> 085af7f9981a4f4c28bc1fde96eb87c8bbc41059
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< HEAD
    marginVertical: 12, // Reduced from 16
=======
    marginVertical: 20,
>>>>>>> 085af7f9981a4f4c28bc1fde96eb87c8bbc41059
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
<<<<<<< HEAD
    marginHorizontal: 10, // Reduced from 12
    color: '#666',
    fontSize: 12, // Reduced from 13
=======
    marginHorizontal: 15,
    color: '#666',
    fontSize: 14,
>>>>>>> 085af7f9981a4f4c28bc1fde96eb87c8bbc41059
    fontWeight: '500',
  },
  providerButton: {
    backgroundColor: '#34C759',
<<<<<<< HEAD
    borderRadius: 6, // Reduced from 8
    padding: 10, // Reduced from 12
    alignItems: 'center',
    marginBottom: 12, // Reduced from 16
    height: 40, // Add fixed height for consistency
  },
  providerButtonText: {
    color: '#fff',
    fontSize: 14, // Reduced from 15
    fontWeight: '600',
    marginBottom: 2, // Reduced from 3
  },
  providerButtonSubtext: {
    color: '#fff',
    fontSize: 10, // Reduced from 11
=======
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  providerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  providerButtonSubtext: {
    color: '#fff',
    fontSize: 12,
>>>>>>> 085af7f9981a4f4c28bc1fde96eb87c8bbc41059
    opacity: 0.9,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
<<<<<<< HEAD
    marginTop: 16, // Reduced from 20
    marginBottom: 16, // Reduced from 20
  },
  footerText: {
    color: '#666',
    fontSize: 12, // Reduced from 13
  },
  loginLink: {
    color: '#007AFF',
    fontSize: 12, // Reduced from 13
=======
    marginTop: 30,
    marginBottom: 30,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#007AFF',
    fontSize: 14,
>>>>>>> 085af7f9981a4f4c28bc1fde96eb87c8bbc41059
    fontWeight: '600',
  },
});

module.exports = SignupScreen;
