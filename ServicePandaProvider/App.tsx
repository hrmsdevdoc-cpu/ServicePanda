// import { enableScreens } from 'react-native-screens';

// enableScreens();

const React = require('react');
const { useState } = require('react');
const { QueryClient, QueryClientProvider } = require('@tanstack/react-query');
const { AuthProvider, useAuth } = require('./src/contexts/AuthContext');
const LoginScreen = require('./src/screens/auth/LoginScreen');
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
const { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } = require('react-native');
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
  const navigateTo = (screen, subScreen = null) => {
    setCurrentScreen(screen);
    setCurrentSubScreen(subScreen);
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
    return <LoginScreen />;
  }

  // Render different screens based on currentScreen
  const renderScreen = () => {
    switch (currentScreen) {
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
        return <ServicesScreen />;
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
        return <PaymentScreen onNavigate={navigateTo} onBack={goToDashboard} />;
      case 'billing':
        return <PaymentScreen onNavigate={navigateTo} onBack={goToDashboard} />;
      case 'help':
        return <PaymentScreen onNavigate={navigateTo} onBack={goToDashboard} />;
      
      default:
        return <DashboardScreen onNavigate={navigateTo} />;
    }
  };

  return (
    <View style={styles.container}>
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
          style={[styles.footerTab, currentScreen === 'services' && styles.activeFooterTab]}
          onPress={() => navigateTo('services')}
        >
          <Text style={[styles.footerIcon, currentScreen === 'services' && styles.activeFooterIcon]}>⚙️</Text>
          <Text style={styles.footerLabel}>Services</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.footerTab, currentScreen === 'payment' && styles.activeFooterTab]}
          onPress={() => navigateTo('payment')}
        >
          <Text style={[styles.footerIcon, currentScreen === 'payment' && styles.activeFooterIcon]}>💳</Text>
          <Text style={styles.footerLabel}>Payment</Text>
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
    paddingBottom: 80, // Add padding to prevent content from being hidden behind footer
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
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
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
  },
  footerTab: {
    alignItems: 'center',
    padding: 8,
  },
  footerIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  footerLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  activeFooterTab: {
    color: colors.primary,
  },
  activeFooterIcon: {
    color: colors.primary,
  },
  activeFooterLabel: {
    fontWeight: 'bold',
    color: colors.primary,
  },
});

module.exports = App;



