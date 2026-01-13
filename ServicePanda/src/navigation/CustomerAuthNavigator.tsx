const React = require('react');
const { createStackNavigator } = require('@react-navigation/stack');

const CustomerLoginScreen = require('../screens/customer/CustomerLoginScreen');
const CustomerSignupScreen = require('../screens/customer/CustomerSignupScreen');

const Stack = createStackNavigator();

const CustomerAuthNavigator = ({ onLoginSuccess }) => {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login">
        {(props) => <CustomerLoginScreen {...props} onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
      <Stack.Screen name="Signup">
        {(props) => <CustomerSignupScreen {...props} onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

module.exports = CustomerAuthNavigator;


