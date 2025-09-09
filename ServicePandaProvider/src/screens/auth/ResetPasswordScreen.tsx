const React = require('react');
const { View, StyleSheet, TouchableOpacity, Text, SafeAreaView } = require('react-native');
const { Title, Paragraph, Card, Button } = require('react-native-paper');
const { colors } = require('../../utils/theme');

const ResetPasswordScreen = ({ onNavigate }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
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

module.exports = ResetPasswordScreen;







