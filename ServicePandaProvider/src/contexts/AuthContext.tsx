const React = require('react');
const { createContext, useContext, useState, useEffect } = require('react');
const AsyncStorage = require('@react-native-async-storage/async-storage').default;
const apiService = require('../services/api');

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [providerData, setProviderData] = useState(null);

  // Check authentication status on app startup
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 Checking authentication status...');
      
      // Check if we have stored authentication data
      const providerId = await AsyncStorage.getItem('providerId');
      const storedProviderData = await AsyncStorage.getItem('providerData');
      
      if (providerId && storedProviderData) {
        console.log('✅ Found stored authentication data');
        
        try {
          // Verify the token is still valid by making an API call
          const profile = await apiService.getProfile();
          console.log('✅ Token is valid, user is authenticated');
          
          setProviderData(profile);
          setIsAuthenticated(true);
        } catch (error) {
          console.log('❌ Token is invalid, clearing stored data');
          // Token is invalid, clear stored data
          await AsyncStorage.removeItem('providerId');
          await AsyncStorage.removeItem('providerData');
          setIsAuthenticated(false);
          setProviderData(null);
        }
      } else {
        console.log('❌ No stored authentication data found');
        setIsAuthenticated(false);
        setProviderData(null);
      }
    } catch (error) {
      console.error('❌ Error checking authentication status:', error);
      setIsAuthenticated(false);
      setProviderData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      console.log('🔐 Attempting login...');
      const provider = await apiService.login(email, password);
      
      // Store authentication data
      await AsyncStorage.setItem('providerId', provider.id.toString());
      await AsyncStorage.setItem('providerData', JSON.stringify(provider));
      
      // Store remember me preference
      await AsyncStorage.setItem('rememberMe', rememberMe.toString());
      
      setProviderData(provider);
      setIsAuthenticated(true);
      
      console.log('✅ Login successful');
      return provider;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      
      // Call logout API
      await apiService.logout();
    } catch (error) {
      console.error('❌ Logout API call failed:', error);
      // Continue with local logout even if API call fails
    }
    
    // Clear local authentication data
    await AsyncStorage.removeItem('providerId');
    await AsyncStorage.removeItem('providerData');
    
    setProviderData(null);
    setIsAuthenticated(false);
    
    console.log('✅ Logout successful');
  };

  const value = {
    isAuthenticated,
    isLoading,
    providerData,
    login,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

module.exports = { AuthProvider, useAuth };
