const React = require('react');
const { useState, useRef, useEffect } = require('react');
const { QueryClient, QueryClientProvider } = require('@tanstack/react-query');
const { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, StatusBar, Platform, Animated, Dimensions, Alert } = require('react-native');
const Icon = require('react-native-vector-icons/MaterialIcons').default;
// const { SafeAreaProvider, SafeAreaView } = require('react-native-safe-area-context');

// SafeAreaProvider with proper safe area handling
const SafeAreaProvider = ({ children }: { children: any }) => {
  const { View } = require('react-native');
  
  return (
    <View style={{ flex: 1 }}>
      {children}
    </View>
  );
};

const SafeAreaView = ({ children, style, ...props }: { children: any; style?: any; [key: string]: any }) => {
  const { View } = require('react-native');
  const { Platform, StatusBar } = require('react-native');
  
  // Add safe area padding
  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;
  const safeAreaStyle = {
    paddingTop: statusBarHeight,
    ...style
  };
  
  return <View style={safeAreaStyle} {...props}>{children}</View>;
};

// useSafeAreaInsets hook with proper safe area values
const useSafeAreaInsets = () => {
  const { Platform, StatusBar } = require('react-native');
  
  return {
    top: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,
    bottom: Platform.OS === 'ios' ? 34 : 0, // Home indicator area
    left: 0,
    right: 0
  };
};
const AsyncStorage = require('@react-native-async-storage/async-storage').default;
const { apiService } = require('./src/services/api');
const oneSignalService = require('./src/services/oneSignalService').default;
const { ONESIGNAL_CONFIG, getOneSignalAppId, getNotificationSettings, getUserTags } = require('./src/config/oneSignalConfig');

// Import screens
const CustomerLoginScreen = require('./src/screens/customer/CustomerLoginScreen');
const CustomerSignupScreen = require('./src/screens/customer/CustomerSignupScreen');
const CustomerDashboardScreen = require('./src/screens/customer/CustomerDashboardScreen');
const RequestServiceScreen = require('./src/screens/customer/RequestServiceScreen');
const TrackRequestScreen = require('./src/screens/customer/TrackRequestScreen');
const CustomerProfileScreen = require('./src/screens/customer/CustomerProfileScreen');
const ViewAllServicesScreen = require('./src/screens/customer/ViewAllServicesScreen');
const VoucherScreen = require('./src/screens/customer/VoucherScreen');
const ReviewListScreen = require('./src/screens/customer/ReviewListScreen');
const ProfileMenuScreen = require('./src/screens/customer/ProfileMenuScreen');
const AccountDetailsScreen = require('./src/screens/customer/AccountDetailsScreen');
const ChangePasswordScreen = require('./src/screens/customer/ChangePasswordScreen');
const TermsConditionsScreen = require('./src/screens/customer/TermsConditionsScreen');
const PrivacyPolicyScreen = require('./src/screens/customer/PrivacyPolicyScreen');
const HelpSupportScreen = require('./src/screens/customer/HelpSupportScreen');
const OnboardingScreen = require('./src/screens/onboarding/OnboardingScreen');

// Disable font scaling for Android to prevent zooming
if (Platform.OS === 'android') {
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;
}
const { colors } = require('./src/utils/theme');
const { ThemeProvider, useTheme } = require('./src/contexts/ThemeContext');

// Loading component
const LoadingScreen = () => {
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.pandaContainer}>
        <View style={styles.pandaFace}>
          <Text style={styles.pandaEmoji}>🐼</Text>
        </View>
      </View>
      <Text style={styles.loadingText}>Loading your app...</Text>
    </View>
  );
};

// Main app component that handles authentication flow and navigation
const AppContent = () => {
  const { colors, isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('login');
  const [navigationHistory, setNavigationHistory] = useState(['login']);
  const [navigationData, setNavigationData] = useState({});

  // Check authentication status on app start
  useEffect(() => {
    initializeOneSignal();
    checkAuthStatus();
  }, []);

  // Initialize OneSignal
  const initializeOneSignal = async () => {
    try {
      console.log('🔔 Initializing OneSignal...');
      
      // Get the correct App ID for the current platform
      const oneSignalAppId = getOneSignalAppId(Platform.OS);
      
      if (oneSignalAppId === 'YOUR_ONESIGNAL_APP_ID') {
        console.warn('⚠️ OneSignal App ID not configured. Please update src/config/oneSignalConfig.ts with your actual OneSignal App ID');
        return;
      }
      
      await oneSignalService.initialize({
        appId: oneSignalAppId,
        ...getNotificationSettings()
      });
      
      console.log('✅ OneSignal initialized successfully');
    } catch (error) {
      console.error('❌ OneSignal initialization failed:', error);
    }
  };

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 Checking authentication status...');
      
      // Check if this is the first time opening the app
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      
      if (!hasSeenOnboarding) {
        console.log('🔍 First time user, showing onboarding');
        setShowOnboarding(true);
        setIsLoading(false);
        return;
      }
      
      // First check if we have stored data
      const customerId = await AsyncStorage.getItem('customerId');
      const customerData = await AsyncStorage.getItem('customerData');
      
      if (customerId && customerData) {
        console.log('🔍 Found stored authentication data, verifying with server...');
        
        try {
          // Verify with server to ensure session is still valid
          const currentUser = await apiService.getCurrentUser();
          
          if (currentUser) {
            console.log('✅ Server verification successful, user is logged in');
            setIsAuthenticated(true);
            setCurrentScreen('dashboard');
            setNavigationHistory(['dashboard']);
          } else {
            console.log('❌ Server verification failed, clearing local data');
            await AsyncStorage.removeItem('customerId');
            await AsyncStorage.removeItem('customerData');
            setIsAuthenticated(false);
            setCurrentScreen('login');
            setNavigationHistory(['login']);
          }
        } catch (apiError) {
          console.log('❌ Server verification failed, using local data');
          // If API fails, use local data (offline mode)
          setIsAuthenticated(true);
          setCurrentScreen('dashboard');
          setNavigationHistory(['dashboard']);
        }
      } else {
        console.log('❌ No stored authentication data found, user needs to login');
        setIsAuthenticated(false);
        setCurrentScreen('login');
        setNavigationHistory(['login']);
      }
    } catch (error) {
      console.error('❌ Error checking auth status:', error);
      setIsAuthenticated(false);
      setCurrentScreen('login');
      setNavigationHistory(['login']);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation function
  const navigateTo = (screen: string, data: any = {}) => {
    console.log('🔍 navigateTo called with screen:', screen, 'data:', data);
    console.log('🔍 Current screen before change:', currentScreen);
    
    // Add current screen to history if it's not already the last item
    if (currentScreen !== screen) {
      setNavigationHistory((prev: string[]) => {
        const newHistory = [...prev];
        if (newHistory[newHistory.length - 1] !== currentScreen) {
          newHistory.push(currentScreen);
        }
        return newHistory;
      });
    }
    
    setCurrentScreen(screen);
    setNavigationData(data);
    console.log('🔍 Screen change completed with data:', data);
  };

  // Go back to previous screen
  const goBack = () => {
    console.log('🔍 goBack called, navigation history:', navigationHistory);
    
    if (navigationHistory.length > 1) {
      const previousScreen = navigationHistory[navigationHistory.length - 1];
      console.log('🔍 Going back to:', previousScreen);
      
      // Remove the last item from history (current screen)
      setNavigationHistory((prev: string[]) => prev.slice(0, -1));
      setCurrentScreen(previousScreen);
    } else {
      // If no history, go to dashboard as fallback
      console.log('🔍 No history, going to dashboard');
      navigateTo('dashboard');
    }
  };

  // Handle onboarding completion
  const handleOnboardingComplete = async () => {
    console.log('🔍 Onboarding completed');
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
    // Continue with normal auth check
    checkAuthStatus();
  };

  // Handle login success
  const handleLoginSuccess = async (customerData: any) => {
    try {
      console.log('🔍 Customer login successful:', customerData);
      setIsAuthenticated(true);
      setCurrentScreen('dashboard');
      setNavigationHistory(['dashboard']);
      
      // Set OneSignal external user ID for push notifications
      if (customerData.id) {
        await oneSignalService.setExternalUserId(customerData.id.toString());
        
        // Set user tags for better targeting
        await oneSignalService.setUserTags(getUserTags({
          user_id: customerData.id.toString(),
          email: customerData.email || '',
          name: customerData.name || customerData.firstName || ''
        }));
        
        console.log('✅ OneSignal user identification set');
      }
    } catch (error) {
      console.error('❌ Error setting OneSignal user identification:', error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      console.log('🚪 Logging out user...');
      
      // Call API logout
      try {
        await apiService.logout();
        console.log('✅ Server logout successful');
      } catch (apiError) {
        console.log('⚠️ Server logout failed, continuing with local cleanup');
      }
      
      // Clear OneSignal user identification
      try {
        await oneSignalService.removeExternalUserId();
        console.log('✅ OneSignal user identification cleared');
      } catch (oneSignalError) {
        console.log('⚠️ OneSignal cleanup failed:', oneSignalError);
      }
      
      // Clear local storage
      await AsyncStorage.removeItem('customerId');
      await AsyncStorage.removeItem('customerData');
      
      setIsAuthenticated(false);
      setCurrentScreen('login');
      setNavigationHistory(['login']);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Error during logout:', error);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    // Show different screens based on currentScreen for unauthenticated users
    if (currentScreen === 'signup') {
      return <CustomerSignupScreen onNavigate={navigateTo} onLoginSuccess={handleLoginSuccess} />;
    } else {
      return <CustomerLoginScreen onNavigate={navigateTo} onLoginSuccess={handleLoginSuccess} />;
    }
  }

  // Render different screens based on currentScreen for authenticated users
  const renderScreen = () => {
    console.log('🔍 renderScreen called with currentScreen:', currentScreen, 'isAuthenticated:', isAuthenticated);
    
    if (isLoading) {
      return <LoadingScreen />;
    }

    if (showOnboarding) {
      return <OnboardingScreen onComplete={handleOnboardingComplete} />;
    }

    switch (currentScreen) {
      case 'login':
        return <CustomerLoginScreen onNavigate={navigateTo} onLoginSuccess={handleLoginSuccess} />;
      case 'signup':
        return <CustomerSignupScreen onNavigate={navigateTo} onLoginSuccess={handleLoginSuccess} />;
      case 'dashboard':
        return <CustomerDashboardScreen onNavigate={navigateTo} onLogout={handleLogout} />;
      case 'requestService':
        return <RequestServiceScreen onNavigate={navigateTo} onBack={goBack} navigationData={navigationData} />;
      case 'trackRequest':
        return <TrackRequestScreen onNavigate={navigateTo} onBack={goBack} isActive={currentScreen === 'trackRequest'} />;
      case 'profile':
        return <ProfileMenuScreen onNavigate={navigateTo} onLogout={handleLogout} />;
      case 'viewAllServices':
        return <ViewAllServicesScreen onNavigate={navigateTo} onBack={goBack} />;
      case 'voucher':
        return <VoucherScreen onNavigate={navigateTo} onBack={goBack} />;
      case 'reviews':
        return <ReviewListScreen onNavigate={navigateTo} onBack={goBack} />;
      case 'accountDetails':
        return <AccountDetailsScreen onNavigate={navigateTo} onBack={goBack} />;
      case 'changePassword':
        return <ChangePasswordScreen onNavigate={navigateTo} onBack={goBack} />;
      case 'termsConditions':
        return <TermsConditionsScreen onNavigate={navigateTo} onBack={goBack} />;
      case 'privacyPolicy':
        return <PrivacyPolicyScreen onNavigate={navigateTo} onBack={goBack} />;
      case 'helpSupport':
        return <HelpSupportScreen onNavigate={navigateTo} onBack={goBack} />;
      default:
        return <CustomerDashboardScreen onNavigate={navigateTo} onLogout={handleLogout} />;
    }
  };

  // Render footer navigation (only for authenticated users)
  const renderFooter = () => {
    if (!isAuthenticated) return null;

    const footerItems = [
      { 
        id: 'home', 
        label: 'Home', 
        icon: 'home',
        active: currentScreen === 'dashboard',
        gradient: ['#3B82F6', '#1D4ED8'],
        iconColor: '#3B82F6'
      },
      { 
        id: 'requests', 
        label: 'Requests', 
        icon: 'assignment',
        active: currentScreen === 'trackRequest',
        gradient: ['#6B7280', '#4B5563'],
        iconColor: '#6B7280'
      },
      { 
        id: 'add', 
        label: 'Add', 
        icon: 'add',
        isSpecial: true,
        gradient: ['#3B82F6', '#1D4ED8'],
        iconColor: '#3B82F6'
      },
      { 
        id: 'review', 
        label: 'Review', 
        icon: 'star',
        active: currentScreen === 'reviews',
        gradient: ['#F59E0B', '#D97706'],
        iconColor: '#F59E0B'
      },
      { 
        id: 'profile', 
        label: 'Profile', 
        icon: 'person',
        active: currentScreen === 'profile',
        gradient: ['#1E40AF', '#1E3A8A'],
        iconColor: '#1E40AF'
      }
    ];

    return (
      <View style={styles.footer}>
        <View style={styles.footerBackground} />
        <View style={styles.footerContent}>
          {footerItems.map((item, index) => {
            if (item.isSpecial) {
              return (
                <TouchableOpacity 
                  key={item.id}
                  style={styles.footerAddButton}
                  onPress={() => navigateTo('requestService')}
                  activeOpacity={0.7}
                >
                  <View style={styles.addButtonOuter}>
                    <View style={styles.addButtonContainer}>
                      <View style={styles.addButtonGlow} />
                      <Icon name={item.icon} size={24} color="white" style={{ fontWeight: 'bold' }} />
                    </View>
                  </View>
                  <Text style={styles.addButtonLabel}>{item.label}</Text>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity 
                key={item.id}
                style={[
                  styles.footerItem,
                  item.active && styles.footerItemActive
                ]}
                onPress={() => {
                  if (item.id === 'profile') {
                    navigateTo('profile');
                  } else if (item.id === 'requests') {
                    navigateTo('trackRequest');
                  } else if (item.id === 'review') {
                    navigateTo('reviews');
                  } else if (item.id === 'home') {
                    navigateTo('dashboard');
                  } else {
                    Alert.alert('Coming Soon', `${item.label} feature coming soon!`);
                  }
                }}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.footerIconContainer,
                  item.active && styles.footerIconContainerActive
                ]}>
                  {item.active && (
                    <View style={[styles.activeIndicator, { backgroundColor: item.gradient[0] }]} />
                  )}
                  <Icon 
                    name={item.icon} 
                    size={item.active ? 24 : 22} 
                    color={item.active ? item.gradient[0] : item.iconColor}
                    style={{ fontWeight: 'bold' }}
                  />
                </View>
                <Text style={[
                  styles.footerLabel,
                  item.active && styles.footerLabelActive,
                  { color: item.active ? item.gradient[0] : item.iconColor }
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  // If showing onboarding, render it without header and footer
  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.surface} />
      
      {/* Header with proper spacing - not on dashboard or requestService */}
      {currentScreen !== 'dashboard' && currentScreen !== 'requestService' && !isLoading && (
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {currentScreen === 'trackRequest' ? 'My Requests' :
               currentScreen === 'reviews' ? 'My Reviews' :
               currentScreen === 'profile' ? 'Profile' :
               currentScreen === 'accountDetails' ? 'Account Details' :
               currentScreen === 'termsConditions' ? 'Terms & Conditions' :
               currentScreen === 'privacyPolicy' ? 'Privacy Policy' :
               currentScreen === 'helpSupport' ? 'Help & Support' :
               currentScreen === 'requestService' ? '' :
               currentScreen === 'viewAllServices' ? 'All Services' :
               currentScreen === 'voucher' ? 'Vouchers' : 'ServicePanda'}
            </Text>
          </View>
        </View>
      )}
      
      {renderScreen()}
      {!isLoading && isAuthenticated && renderFooter()}
    </View>
  );
};

// Root app component with providers
const App = () => {
  const queryClient = new QueryClient();

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
    backgroundColor: colors.primary + '15',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary + '30',
    minHeight: 36,
  },
  backArrow: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
    marginRight: 2,
  },
  backButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 40,
  },
  pandaContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  pandaFace: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  pandaEmoji: {
    fontSize: 50,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  // Modern Footer Styles
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: 100,
    overflow: 'hidden',
  },
  footerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  footerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Better distribution
    paddingTop: 20,
    paddingBottom: 30, // Account for safe area
    paddingHorizontal: 8, // Minimal padding to maximize space
  },
  footerItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 20,
    minWidth: 0,
    minHeight: 0,
    flex: 1,
    position: 'relative',
  },
  footerItemActive: {
    backgroundColor: 'rgba(44, 122, 248, 0.1)', // Light blue background instead of dark
  },
  footerIconContainer: {
    width: 24,
    height: 28,
    borderRadius: 0,
    alignItems: 'center',
    marginBottom: 1, // Reduced from 3 to 1
    position: 'relative',
  },

  footerLabel: {
    fontSize: 9,
    color: '#8E8E93',
    fontWeight: '600',
    textAlign: 'center',
    numberOfLines: 1,
  },
  footerLabelActive: {
    color: '#000000',
    fontWeight: '800',
  },
  // Modern Add Button Styles
  footerAddButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 20,
    minWidth: 0,
    flex: 1,
    position: 'relative',
  },
  addButtonOuter: {
    position: 'relative',
    marginBottom: 4,
  },
  addButtonContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonGlow: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 27,
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    zIndex: -1,
  },
  addButtonLabel: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '600',
    textAlign: 'center',
  },
});

module.exports = App;