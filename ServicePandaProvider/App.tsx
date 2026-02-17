// import { enableScreens } from 'react-native-screens';

// enableScreens();

console.log('🚨🚨🚨 APP.TSX LOADING - IMMEDIATE TEST 🚨🚨🚨');

const React = require('react');
const { useState, useRef, useEffect } = require('react');
const { QueryClient, QueryClientProvider } = require('@tanstack/react-query');

console.log('🔥 App.tsx: After React imports - still loading...');

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
// Import vector icons
const Icon = require('react-native-vector-icons/MaterialIcons').default;
// Import notification components
const NotificationList = require('./src/components/NotificationList');
const oneSignalService = require('./src/services/oneSignalService').default;
import RealTimeNotificationController from './src/components/RealTimeNotificationController';

// Animated dot component for loading
const AnimatedDot = ({ delay = 0, style }: { delay?: number; style?: any }) => {
  const [opacity] = React.useState(new Animated.Value(0.3));

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );

    const timer = setTimeout(() => {
      animation.start();
    }, delay);

    return () => {
      clearTimeout(timer);
      animation.stop();
    };
  }, [delay, opacity]);

  return (
    <Animated.View style={[styles.dot, style, { opacity }]} />
  );
};

// Loading component while checking authentication
const LoadingScreen = () => {
  const [pandaAnim] = React.useState(new Animated.Value(0));
  const [bounceAnim] = React.useState(new Animated.Value(1));

  React.useEffect(() => {
    // Panda animation - gentle bounce
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    // Fade in animation
    Animated.timing(pandaAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    bounceAnimation.start();

    return () => {
      bounceAnimation.stop();
    };
  }, []);

  return (
    <View style={styles.loadingContainer}>
      <Animated.View 
        style={[
          styles.pandaContainer,
          {
            opacity: pandaAnim,
            transform: [{ scale: bounceAnim }],
          },
        ]}
      >
        <View style={styles.pandaFace}>
          <Text style={styles.pandaEmoji}>🐼</Text>
        </View>
        <View style={styles.loadingDots}>
          <AnimatedDot delay={0} style={styles.dot1} />
          <AnimatedDot delay={200} style={styles.dot2} />
          <AnimatedDot delay={400} style={styles.dot3} />
        </View>
      </Animated.View>
      <Text style={styles.loadingText}>Loading your app...</Text>
    </View>
  );
};

// Main app component that handles authentication flow and navigation
const AppContent = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('login');

  // Initialize OneSignal like buzyteam on app start
  useEffect(() => {
    (async () => {
      const initialized = await oneSignalService.initialize('a3f5070d-9c46-44cd-8b0a-259df155ae94');
      if (initialized && __DEV__) {
        try {
          const status = await oneSignalService.checkDeviceStatus();
          console.log('🔍 OneSignal status:', status);
        } catch (e) {
          // ignore
        }
      }
    })();
  }, []);

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
      case 'notifications':
        return (
          <NotificationList
            visible={true}
            notifications={[
              {
                id: 1,
                title: 'New Lead Available',
                message: 'A new lead for "House Cleaning" is available in your area. Estimated value: $150',
                type: 'success',
                isRead: false,
                timestamp: '2 min ago',
                category: 'lead'
              },
              {
                id: 2,
                title: 'Payment Received',
                message: 'Payment of $200 has been credited to your account for completed service',
                type: 'success',
                isRead: false,
                timestamp: '1 hour ago',
                category: 'payment'
              },
              {
                id: 3,
                title: 'New Rating',
                message: 'Customer John Smith rated your service 5 stars with a great review',
                type: 'success',
                isRead: true,
                timestamp: '3 hours ago',
                category: 'general'
              },
              {
                id: 4,
                title: 'Credit Added',
                message: 'You have received 5 free credits for completing your profile setup',
                type: 'info',
                isRead: true,
                timestamp: '1 day ago',
                category: 'system'
              },
              {
                id: 5,
                title: 'System Update',
                message: 'New features have been added to the app. Check out the latest updates!',
                type: 'info',
                isRead: true,
                timestamp: '2 days ago',
                category: 'system'
              },
              {
                id: 6,
                title: 'Reminder',
                message: 'Don\'t forget to update your service availability for next week',
                type: 'warning',
                isRead: true,
                timestamp: '3 days ago',
                category: 'general'
              }
            ]}
            onClose={() => navigateTo('dashboard')}
            onNotificationPress={(notification: any) => {
              console.log('Notification pressed:', notification.title);
            }}
            onMarkAllAsRead={() => {
              console.log('Mark all as read');
            }}
          />
        );
      
      default:
        return <DashboardScreen onNavigate={navigateTo} />;
    }
  };

  return (
    <RealTimeNotificationController oneSignalAppId="a3f5070d-9c46-44cd-8b0a-259df155ae94">
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
          <Icon 
            name="home" 
            size={24} 
            color="#3B82F6" 
          />
          <Text style={[styles.footerLabel, currentScreen === 'dashboard' && styles.activeFooterLabel]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.footerTab, currentScreen === 'leads' && styles.activeFooterTab]}
          onPress={() => navigateTo('leads')}
        >
          <Icon 
            name="assignment" 
            size={24} 
            color="#10B981" 
          />
          <Text style={[styles.footerLabel, currentScreen === 'leads' && styles.activeFooterLabel]}>Leads</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.footerTab, currentScreen === 'credits' && styles.activeFooterTab]}
          onPress={() => navigateTo('credits')}
        >
          <Icon 
            name="card-giftcard" 
            size={24} 
            color="#F59E0B" 
          />
          <Text style={[styles.footerLabel, currentScreen === 'credits' && styles.activeFooterLabel]}>Credits</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.footerTab, currentScreen === 'billing' && styles.activeFooterTab]}
          onPress={() => navigateTo('billing')}
        >
          <Icon 
            name="payment" 
            size={24} 
            color="#8B5CF6" 
          />
          <Text style={[styles.footerLabel, currentScreen === 'billing' && styles.activeFooterLabel]}>Billing</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.footerTab, currentScreen === 'profile' && styles.activeFooterTab]}
          onPress={() => navigateTo('profile')}
        >
          <Icon 
            name="person" 
            size={24} 
            color="#EC4899" 
          />
          <Text style={[styles.footerLabel, currentScreen === 'profile' && styles.activeFooterLabel]}>Profile</Text>
        </TouchableOpacity>

        </View>
      </View>
    </RealTimeNotificationController>
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
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  pandaEmoji: {
    fontSize: 50,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginHorizontal: 3,
  },
  dot1: {
    animationDelay: '0s',
  },
  dot2: {
    animationDelay: '0.2s',
  },
  dot3: {
    animationDelay: '0.4s',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
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
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeFooterIcon: {
    color: '#3B82F6',
  },
  activeFooterLabel: {
    fontWeight: '700',
    color: '#3B82F6',
  },
});


module.exports = App;



