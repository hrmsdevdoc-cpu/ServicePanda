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
        {(props) => {
          console.log('🔍 AuthNavigator Login screen props:', props);
          console.log('🔍 AuthNavigator navigation prop:', props.navigation);
          const onNavigateFunction = (screen) => {
            console.log('🔍 AuthNavigator onNavigate called with:', screen);
            props.navigation.navigate(screen);
          };
          return <LoginScreen {...props} navigation={props.navigation} onNavigate={onNavigateFunction} />;
        }}
      </Stack.Screen>
      <Stack.Screen name="Signup">
        {(props) => <SignupScreen {...props} onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
      <Stack.Screen name="ProviderRegistration">
        {(props) => <ProviderRegistrationScreen {...props} onNavigate={(screen) => props.navigation.navigate(screen)} />}
      </Stack.Screen>
      <Stack.Screen name="ForgotPassword">
        {(props) => <ForgotPasswordScreen {...props} onNavigate={(screen) => props.navigation.navigate(screen)} />}
      </Stack.Screen>
      <Stack.Screen name="ResetPassword">
        {(props) => <ResetPasswordScreen {...props} onNavigate={(screen) => props.navigation.navigate(screen)} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

module.exports = AuthNavigator;
