const React = require('react');
const { createContext, useContext, useState, useEffect } = require('react');
const AsyncStorage = require('@react-native-async-storage/async-storage').default;
const apiService = require('../services/api');

const AuthContext = createContext();

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [providerData, setProviderData] = useState(null);
  const DEACTIVATION_KEY = 'providerAccountDeactivation';

  // Check authentication status on app startup
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 Checking authentication status...');

      // Respect account deactivation (temporary/permanent) on this device
      try {
        const raw = await AsyncStorage.getItem(DEACTIVATION_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          const mode = parsed?.mode;
          if (mode === 'temporary' || mode === 'permanent') {
            // Ensure we don't restore an existing session while deactivated
            await AsyncStorage.removeItem('providerId');
            await AsyncStorage.removeItem('providerData');
            setIsAuthenticated(false);
            setProviderData(null);
            return;
          }
        }
      } catch (e) {
        // ignore parse/storage errors
      }
      
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
          
          // Initialize OneSignal with the stored provider ID
          try {
            const { fixedOneSignalService } = require('../services/fixedOneSignalService');
            console.log('🔄 Initializing OneSignal with stored provider ID:', providerId);
            await fixedOneSignalService.initialize();
            console.log('✅ OneSignal initialized successfully on app startup');
            
            // Ensure external user ID is set on startup
            await fixedOneSignalService.updateExternalUserId(providerId);
            console.log('✅ External user ID updated on startup');
          } catch (oneSignalError) {
            console.error('⚠️ OneSignal initialization failed on startup:', oneSignalError);
          }
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

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
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
      
      // Initialize OneSignal with correct provider ID after login
      try {
        const { fixedOneSignalService } = require('../services/fixedOneSignalService');
        console.log('🔄 Initializing OneSignal with provider ID:', provider.id);
        console.log('🔍 Provider object:', JSON.stringify(provider, null, 2));
        
        // Double check provider ID is stored
        const storedProviderId = await AsyncStorage.getItem('providerId');
        console.log('🔍 Stored provider ID check:', storedProviderId);
        console.log('🔍 Provider ID type:', typeof provider.id);
        console.log('🔍 Provider ID toString:', provider.id.toString());
        
        if (!storedProviderId || storedProviderId === '1') {
          console.log('❌ Provider ID not properly stored, retrying...');
          await new Promise(resolve => setTimeout(resolve, 500));
          // Try to store again
          await AsyncStorage.setItem('providerId', provider.id.toString());
          console.log('🔄 Provider ID stored again:', provider.id.toString());
        }
        
        await fixedOneSignalService.initialize();
        console.log('✅ OneSignal initialized successfully with provider ID');
        
        // Wait a bit for OneSignal to be fully ready
        console.log('⏳ Waiting for OneSignal to be fully ready...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('⏳ Wait completed, proceeding with external user ID update...');
        
        // Ensure external user ID is set after login
        console.log('🔄 About to call updateExternalUserId with:', provider.id.toString());
        console.log('🔄 Provider ID type:', typeof provider.id);
        console.log('🔄 Provider ID value:', provider.id);
        
        try {
          await fixedOneSignalService.updateExternalUserId(provider.id.toString());
          console.log('✅ External user ID updated after login');
        } catch (updateError) {
          console.error('❌ Error updating external user ID:', updateError);
        }
      } catch (oneSignalError) {
        console.error('⚠️ OneSignal initialization failed:', oneSignalError);
        // Don't fail login if OneSignal fails
      }
      
      console.log('✅ Login successful - isAuthenticated set to true');
      console.log('✅ Provider data set:', provider);
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
