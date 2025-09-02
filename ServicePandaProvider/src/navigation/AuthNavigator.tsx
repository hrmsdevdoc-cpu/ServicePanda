const React = require('react');
const { createStackNavigator } = require('@react-navigation/stack');

const LoginScreen = require('../screens/auth/LoginScreen');
const SignupScreen = require('../screens/auth/SignupScreen');
const ForgotPasswordScreen = require('../screens/auth/ForgotPasswordScreen');
const ResetPasswordScreen = require('../screens/auth/ResetPasswordScreen');
const ProviderRegistrationScreen = require('../screens/auth/ProviderRegistrationScreen');

const Stack = createStackNavigator();

const AuthNavigator = ({ onLoginSuccess, onNavigate }) => {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#111827',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} onNavigate={onNavigate} />}
      </Stack.Screen>
      <Stack.Screen name="Signup">
        {(props) => <SignupScreen {...props} onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
      <Stack.Screen name="ProviderRegistration">
        {(props) => <ProviderRegistrationScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};

module.exports = AuthNavigator;
