// import { enableScreens } from 'react-native-screens';

// enableScreens();

const React = require('react');
const { useState } = require('react');
const { QueryClient, QueryClientProvider } = require('@tanstack/react-query');
const { AuthProvider, useAuth } = require('./src/contexts/AuthContext');
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
const ServicesScreen = require('./src/screens/services/ServicesScreen');
const ServiceAreaScreen = require('./src/screens/services/ServiceAreaScreen');
const DocumentsScreen = require('./src/screens/documents/DocumentsScreen');
const PaymentScreen = require('./src/screens/payment/PaymentScreen');
const ProfileScreen = require('./src/screens/profile/ProfileScreen');
const CreditsScreen = require('./src/screens/credits/CreditsScreen');
const BillingScreen = require('./src/screens/billing/BillingScreen');
const HelpScreen = require('./src/screens/help/HelpScreen');
const { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, StatusBar, Platform } = require('react-native');
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
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [currentSubScreen, setCurrentSubScreen] = useState(null);

  // Navigation function to be passed to screens
  const navigateTo = (screen: string, subScreen: string | null = null) => {
    console.log('🔍 navigateTo called with screen:', screen, 'subScreen:', subScreen);
    console.log('🔍 Current screen before change:', currentScreen);
    setCurrentScreen(screen);
    setCurrentSubScreen(subScreen);
    console.log('🔍 Screen change completed');
  };

  // Go back to dashboard
  const goToDashboard = () => {
    setCurrentScreen('dashboard');
    setCurrentSubScreen(null);
  };

  if (isLoading) {
    return <LoadingScreen />;
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
    console.log('🔍 renderScreen called with currentScreen:', currentScreen);
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
              <Text style={{ color: 'white', fontSize: 16 }}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        );
      case 'providerRegistration':
        return <ProviderRegistrationScreen onNavigate={navigateTo} />;
      case 'dashboard':
        return <DashboardScreen onNavigate={navigateTo} />;
      
      // Lead screens
      case 'leads':
        return <LeadsScreen onNavigate={navigateTo} onBack={goToDashboard} />;
      case 'newLeads':
        return <NewLeadsScreen onNavigate={navigateTo} onBack={goToDashboard} />;
      case 'activeLeads':
        return <ActiveLeadsScreen onNavigate={navigateTo} onBack={goToDashboard} />;
      case 'closedLeads':
        return <ClosedLeadsScreen onNavigate={navigateTo} onBack={goToDashboard} />;
      case 'leadDetails':
        return <LeadDetailsScreen onNavigate={navigateTo} onBack={goToDashboard} />;
      
      // Profile and settings screens
      case 'personalDetails':
        return <PersonalDetailsScreen onNavigate={navigateTo} onBack={goToDashboard} />;
      case 'services':
        return <ServicesScreen onNavigate={navigateTo} onBack={goToDashboard} />;
      case 'serviceArea':
        return <ServiceAreaScreen onNavigate={navigateTo} onBack={goToDashboard} />;
      case 'documents':
        return <DocumentsScreen onNavigate={navigateTo} onBack={goToDashboard} />;
      case 'profile':
        return <ProfileScreen onNavigate={navigateTo} onBack={goToDashboard} />;
      
      // Payment and other screens
      case 'payment':
        return <PaymentScreen onNavigate={navigateTo} onBack={goToDashboard} />;
      case 'credits':
        return <CreditsScreen onNavigate={navigateTo} onBack={goToDashboard} />;
      case 'billing':
        return <BillingScreen onNavigate={navigateTo} onBack={goToDashboard} />;
      case 'help':
        return <HelpScreen onNavigate={navigateTo} onBack={goToDashboard} />;
      
      default:
        return <DashboardScreen onNavigate={navigateTo} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      {currentScreen !== 'dashboard' && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goToDashboard}>
            <Text style={styles.backButtonText}>← Back to Dashboard</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {currentScreen.charAt(0).toUpperCase() + currentScreen.slice(1)}
          </Text>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 50, // More padding for iOS
    paddingBottom: 8,
    paddingHorizontal: 8,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
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



