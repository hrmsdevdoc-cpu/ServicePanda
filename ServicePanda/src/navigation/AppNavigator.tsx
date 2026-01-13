const React = require('react');
const { useEffect, useState } = require('react');
const AsyncStorage = require('@react-native-async-storage/async-storage').default;
const { ActivityIndicator, View, Text } = require('react-native');
const { NavigationContainer } = require('@react-navigation/native');
const { colors } = require('../utils/theme');

// Import navigators
const CustomerAuthNavigator = require('./CustomerAuthNavigator');
const CustomerMainNavigator = require('./CustomerMainNavigator');

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 Checking authentication status...');
      const customerId = await AsyncStorage.getItem('customerId');
      const customerData = await AsyncStorage.getItem('customerData');
      
      console.log('🔍 Stored customerId:', customerId);
      console.log('🔍 Stored customerData:', customerData ? 'Data exists' : 'No data');
      
      if (customerId && customerData) {
        console.log('✅ Found stored authentication data, user is logged in');
        console.log('✅ Customer ID:', customerId);
        console.log('✅ Customer Data length:', customerData.length);
        setIsAuthenticated(true);
      } else {
        console.log('❌ No stored authentication data found, user needs to login');
        console.log('❌ Customer ID exists:', !!customerId);
        console.log('❌ Customer Data exists:', !!customerData);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('❌ Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out user...');
      await AsyncStorage.removeItem('customerId');
      await AsyncStorage.removeItem('customerData');
      setIsAuthenticated(false);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Error during logout:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 16, color: colors.textSecondary }}>Loading...</Text>
      </View>
    );
  }

  console.log('🔍 Current state - isAuthenticated:', isAuthenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <CustomerMainNavigator onLogout={logout} />
      ) : (
        <>
          {console.log('🔍 AppNavigator: Rendering CustomerAuthNavigator')}
          <CustomerAuthNavigator onLoginSuccess={() => setIsAuthenticated(true)} />
        </>
      )}
    </NavigationContainer>
  );
};

module.exports = AppNavigator;