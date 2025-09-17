// import { enableScreens } from 'react-native-screens';

// enableScreens();

const React = require('react');
const { useState, useRef, useEffect } = require('react');
const { QueryClient, QueryClientProvider } = require('@tanstack/react-query');
const { AuthProvider, useAuth } = require('./src/contexts/AuthContext');
// Onboarding screens
const OnboardingFlow = require('./src/screens/onboarding/OnboardingFlow');
// Direct registration screen for testing
const LoginScreen = require('./src/screens/auth/LoginScreen');
const ForgotPasswordScreen = require('./src/screens/auth/ForgotPasswordScreen');
const ProviderRegistrationScreen = require('./src/screens/auth/ProviderRegistrationScreen');
const DashboardScreen = require('./src/screens/dashboard/DashboardScreen');
const ActiveLeadsScreen = require('./src/screens/leads/ActiveLeadsScreen');
const ClosedLeadsScreen = require('./src/screens/leads/ClosedLeadsScreen');
const LeadDetailsScreen = require('./src/screens/leads/LeadDetailsScreen');
const NewLeadsScreen = require('./src/screens/leads/NewLeadsScreen');
const LeadsScreen = require('./src/screens/leads/LeadsScreen');
const PersonalDetailsScreen = require('./src/screens/profile/PersonalDetailsScreen');
const ChangePasswordScreen = require('./src/screens/profile/ChangePasswordScreen');
const ServicesScreen = require('./src/screens/services/ServicesScreen');
const ServiceAreaScreen = require('./src/screens/services/ServiceAreaScreen');
const DocumentsScreen = require('./src/screens/documents/DocumentsScreen');
const PaymentScreen = require('./src/screens/payment/PaymentScreen');
const ProfileScreen = require('./src/screens/profile/ProfileScreen');
const CreditsScreen = require('./src/screens/credits/CreditsScreen');
const BillingScreen = require('./src/screens/billing/BillingScreen');
const HelpScreen = require('./src/screens/help/HelpScreen');
const { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, StatusBar, Platform, Animated, Dimensions } = require('react-native');

// Disable font scaling for Android to prevent zooming
if (Platform.OS === 'android') {
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;
}
const { colors } = require('./src/utils/theme');

// Loading component while checking authentication
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

// Main app component that handles authentication flow and navigation
const AppContent = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('login');
  const [currentSubScreen, setCurrentSubScreen] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [navigationHistory, setNavigationHistory] = useState(['login']);
  
  // Footer animation state
  const footerTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const scrollDirection = useRef('down');
  const isFooterVisible = useRef(true);

  // Footer animation functions
  const hideFooter = () => {
    if (isFooterVisible.current) {
      isFooterVisible.current = false;
      Animated.timing(footerTranslateY, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const showFooter = () => {
    if (!isFooterVisible.current) {
      isFooterVisible.current = true;
      Animated.timing(footerTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  // Handle scroll events for footer visibility
  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDelta = currentScrollY - lastScrollY.current;
    
    // Only trigger if scroll delta is significant (more than 10 pixels)
    if (Math.abs(scrollDelta) > 10) {
      if (scrollDelta > 0 && scrollDirection.current !== 'down') {
        // Scrolling down - hide footer
        scrollDirection.current = 'down';
        hideFooter();
      } else if (scrollDelta < 0 && scrollDirection.current !== 'up') {
        // Scrolling up - show footer
        scrollDirection.current = 'up';
        showFooter();
      }
      lastScrollY.current = currentScrollY;
    }
  };

  // Reset footer visibility when screen changes
  useEffect(() => {
    showFooter();
  }, [currentScreen]);

  // Auto-navigate to dashboard when user becomes authenticated
  useEffect(() => {
    console.log('🔍 Auth state changed - isAuthenticated:', isAuthenticated, 'currentScreen:', currentScreen);
    if (isAuthenticated) {
      console.log('🔍 User authenticated, navigating to dashboard');
      setCurrentScreen('dashboard');
      setNavigationHistory(['dashboard']);
    } else {
      console.log('🔍 User not authenticated, resetting to login screen');
      setCurrentScreen('login');
      setNavigationHistory(['login']);
    }
  }, [isAuthenticated]);

  // Navigation function to be passed to screens
  const navigateTo = (screen: string, subScreen: string | null = null) => {
    console.log('🔍 navigateTo called with screen:', screen, 'subScreen:', subScreen);
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
    setCurrentSubScreen(subScreen);
    console.log('🔍 Screen change completed');
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
      setCurrentSubScreen(null);
    } else {
      // If no history, go to dashboard as fallback
      console.log('🔍 No history, going to dashboard');
      goToDashboard();
    }
  };

  // Go back to dashboard
  const goToDashboard = () => {
    setCurrentScreen('dashboard');
    setCurrentSubScreen(null);
    // Reset navigation history to just dashboard
    setNavigationHistory(['dashboard']);
  };

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show onboarding flow first
  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  if (!isAuthenticated) {
    // Show different screens based on currentScreen for unauthenticated users
    if (currentScreen === 'forgotPassword') {
      return <ForgotPasswordScreen onNavigate={navigateTo} />;
    } else if (currentScreen === 'providerRegistration') {
      return <ProviderRegistrationScreen onNavigate={navigateTo} />;
    } else {
      return <LoginScreen onNavigate={navigateTo} />;
    }
  }
  // if (!isAuthenticated) {
  //   // Show login or registration based on currentScreen
  //   if (currentScreen === 'login') {
  //     return <LoginScreen onNavigate={navigateTo} />;
  //   }
  //   return <ProviderRegistrationScreen onNavigate={navigateTo} />;
  // }

  // Render different screens based on currentScreen
  const renderScreen = () => {
    console.log('🔍 renderScreen called with currentScreen:', currentScreen, 'isAuthenticated:', isAuthenticated);
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onNavigate={navigateTo} />;
      case 'forgotPassword':
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 20, textAlign: 'center' }}>
              Forgot Password Feature
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 20, textAlign: 'center', color: '#666' }}>
              This feature will be implemented soon.
            </Text>
            <TouchableOpacity 
              style={{ backgroundColor: colors.primary, padding: 15, borderRadius: 8 }}
              onPress={() => navigateTo('login')}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>← Back</Text>
            </TouchableOpacity>
          </View>
        );
      case 'providerRegistration':
        return <ProviderRegistrationScreen onNavigate={navigateTo} />;
      case 'dashboard':
        return <DashboardScreen onNavigate={navigateTo} />;
      
      // Lead screens
      case 'leads':
        return <LeadsScreen onNavigate={navigateTo} onBack={goBack} />;
      case 'newLeads':
        return <NewLeadsScreen onNavigate={navigateTo} onBack={goBack} />;
      case 'activeLeads':
        return <ActiveLeadsScreen onNavigate={navigateTo} onBack={goBack} />;
      case 'closedLeads':
        return <ClosedLeadsScreen onNavigate={navigateTo} onBack={goBack} />;
      case 'leadDetails':
        return <LeadDetailsScreen onNavigate={navigateTo} onBack={goBack} />;
      
      // Profile and settings screens
      case 'personalDetails':
        return <PersonalDetailsScreen onNavigate={navigateTo} onBack={goBack} />;
      case 'changePassword':
        return <ChangePasswordScreen onNavigate={navigateTo} onBack={goBack} />;
      case 'services':
        return <ServicesScreen onNavigate={navigateTo} onBack={goBack} />;
      case 'serviceArea':
        return <ServiceAreaScreen onNavigate={navigateTo} onBack={goBack} />;
      case 'documents':
        return <DocumentsScreen onNavigate={navigateTo} onBack={goBack} />;
      case 'profile':
        return <ProfileScreen onNavigate={navigateTo} onBack={goBack} />;
      
      // Payment and other screens
      case 'payment':
        return <PaymentScreen onNavigate={navigateTo} onBack={goBack} />;
      case 'credits':
        return <CreditsScreen onNavigate={navigateTo} onBack={goBack} />;
      case 'billing':
        return <BillingScreen onNavigate={navigateTo} onBack={goBack} />;
      case 'help':
        return <HelpScreen onNavigate={navigateTo} onBack={goBack} />;
      
      default:
        return <DashboardScreen onNavigate={navigateTo} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      {currentScreen !== 'dashboard' && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              {currentScreen.charAt(0).toUpperCase() + currentScreen.slice(1)}
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      )}
      
      {renderScreen()}
      
      {/* Static Footer Navigation Bar - Always Visible */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.footerTab, currentScreen === 'dashboard' && styles.activeFooterTab]}
          onPress={() => navigateTo('dashboard')}
        >
          <Text style={[styles.footerIcon, currentScreen === 'dashboard' && styles.activeFooterIcon]}>🏠</Text>
          <Text style={[styles.footerLabel, currentScreen === 'dashboard' && styles.activeFooterLabel]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.footerTab, currentScreen === 'leads' && styles.activeFooterTab]}
          onPress={() => navigateTo('leads')}
        >
          <Text style={[styles.footerIcon, currentScreen === 'leads' && styles.activeFooterIcon]}>🎯</Text>
          <Text style={styles.footerLabel}>Leads</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.footerTab, currentScreen === 'credits' && styles.activeFooterTab]}
          onPress={() => navigateTo('credits')}
        >
          <Text style={[styles.footerIcon, currentScreen === 'credits' && styles.activeFooterIcon]}>💰</Text>
          <Text style={styles.footerLabel}>Credits</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.footerTab, currentScreen === 'billing' && styles.activeFooterTab]}
          onPress={() => navigateTo('billing')}
        >
          <Text style={[styles.footerIcon, currentScreen === 'billing' && styles.activeFooterIcon]}>📊</Text>
          <Text style={styles.footerLabel}>Billing</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.footerTab, currentScreen === 'profile' && styles.activeFooterTab]}
          onPress={() => navigateTo('profile')}
        >
          <Text style={[styles.footerIcon, currentScreen === 'profile' && styles.activeFooterIcon]}>👤</Text>
          <Text style={styles.footerLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Root app component with providers
const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingBottom: Platform.OS === 'ios' ? 75 : 65, // More padding for iOS footer
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 50, // More padding for iOS
    paddingBottom: 8,
    paddingHorizontal: 8,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    width: 100, // Same width as back button to balance the layout
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 0,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    zIndex: 1000,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: Platform.OS === 'ios' ? 75 : 65,
  },
  footerTab: {
    alignItems: 'center',
    padding: Platform.OS === 'ios' ? 12 : 10,
    borderRadius: 16,
    minWidth: 60,
    minHeight: Platform.OS === 'ios' ? 70 : 65,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  footerIcon: {
    fontSize: Platform.OS === 'ios' ? 24 : 22,
    marginBottom: Platform.OS === 'ios' ? 6 : 4,
  },
  footerLabel: {
    fontSize: Platform.OS === 'ios' ? 13 : 12,
    color: colors.textSecondary,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  activeFooterTab: {
    backgroundColor: colors.primary + '15',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  activeFooterIcon: {
    color: colors.primary,
  },
  activeFooterLabel: {
    fontWeight: '700',
    color: colors.primary,
  },
});


module.exports = App;



