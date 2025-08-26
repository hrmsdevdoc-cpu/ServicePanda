const React = require('react');
const { useEffect, useState } = require('react');
const AsyncStorage = require('@react-native-async-storage/async-storage').default;
const { ActivityIndicator, View, Text } = require('react-native');
const { NavigationContainer } = require('@react-navigation/native');
const { colors } = require('../utils/theme');

// Import navigators
const AuthNavigator = require('./AuthNavigator');
const MainNavigator = require('./MainNavigator');

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 Checking authentication status...');
      const providerId = await AsyncStorage.getItem('providerId');
      const providerData = await AsyncStorage.getItem('providerData');
      
      console.log('🔍 Stored providerId:', providerId);
      console.log('🔍 Stored providerData:', providerData ? 'Data exists' : 'No data');
      
      if (providerId && providerData) {
        console.log('✅ Found stored authentication data, user is logged in');
        console.log('✅ Provider ID:', providerId);
        console.log('✅ Provider Data length:', providerData.length);
        setIsAuthenticated(true);
      } else {
        console.log('❌ No stored authentication data found, user needs to login');
        console.log('❌ Provider ID exists:', !!providerId);
        console.log('❌ Provider Data exists:', !!providerData);
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
      await AsyncStorage.removeItem('providerId');
      await AsyncStorage.removeItem('providerData');
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
        <MainNavigator onLogout={logout} />
      ) : (
        <AuthNavigator onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </NavigationContainer>
  );
};

module.exports = AppNavigator;

