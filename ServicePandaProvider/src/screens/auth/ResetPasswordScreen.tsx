const React = require('react');
const { View, StyleSheet, TouchableOpacity, Text } = require('react-native');
const { Title, Paragraph, Card, Button } = require('react-native-paper');
const { colors } = require('../../utils/theme');

const ResetPasswordScreen = ({ onNavigate }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => onNavigate('login')}
      >
        <Text style={styles.backButtonText}>← Back to Login</Text>
      </TouchableOpacity>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Reset Password</Title>
          <Paragraph>Enter your new password here.</Paragraph>
          <Button 
            mode="contained" 
            onPress={() => onNavigate('login')}
            style={styles.backToLoginButton}
          >
            Back to Login
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
<<<<<<< HEAD
    padding: 12, // Reduced from 16
  },
  backButton: {
    marginBottom: 12, // Reduced from 16
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 14, // Reduced from 16
=======
    padding: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
>>>>>>> 085af7f9981a4f4c28bc1fde96eb87c8bbc41059
  },
  card: {
    elevation: 2,
  },
  backToLoginButton: {
<<<<<<< HEAD
    marginTop: 12, // Reduced from 16
=======
    marginTop: 16,
>>>>>>> 085af7f9981a4f4c28bc1fde96eb87c8bbc41059
  },
});

module.exports = ResetPasswordScreen;







