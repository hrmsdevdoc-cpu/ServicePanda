const React = require('react');
const { View, StyleSheet, TouchableOpacity, Text } = require('react-native');
const { Title, Paragraph, Card, Button } = require('react-native-paper');
const { colors } = require('../../utils/theme');

const ForgotPasswordScreen = ({ onNavigate }) => {
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
          <Title>Forgot Password</Title>
          <Paragraph>Reset your password here.</Paragraph>
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
    padding: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
  },
  card: {
    elevation: 2,
  },
  backToLoginButton: {
    marginTop: 16,
  },
});

module.exports = ForgotPasswordScreen;







