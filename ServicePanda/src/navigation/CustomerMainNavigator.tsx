const React = require('react');
const { useState } = require('react');

// Import all customer screens
const CustomerDashboardScreen = require('../screens/customer/CustomerDashboardScreen');
const RequestServiceScreen = require('../screens/customer/RequestServiceScreen');
const CustomerProfileScreen = require('../screens/customer/CustomerProfileScreen');
const TrackRequestScreen = require('../screens/customer/TrackRequestScreen');
const ViewAllServicesScreen = require('../screens/customer/ViewAllServicesScreen');
const VoucherScreen = require('../screens/customer/VoucherScreen');
const ReviewListScreen = require('../screens/customer/ReviewListScreen');

function CustomerMainNavigator({ onLogout }) {
  const [currentScreen, setCurrentScreen] = useState('dashboard');

  const handleNavigate = (screen) => {
    console.log('🔍 CustomerMainNavigator: Navigating from', currentScreen, 'to:', screen);
    setCurrentScreen(screen);
  };

  const renderCurrentScreen = () => {
    console.log('🔍 CustomerMainNavigator: Rendering screen:', currentScreen);
    switch (currentScreen) {
      case 'dashboard':
        return <CustomerDashboardScreen onLogout={onLogout} onNavigate={handleNavigate} />;
      case 'requestService':
        return <RequestServiceScreen onNavigate={handleNavigate} />;
      case 'profile':
        return <CustomerProfileScreen onLogout={onLogout} onNavigate={handleNavigate} />;
      case 'trackRequest':
        return <TrackRequestScreen onNavigate={handleNavigate} onBack={() => handleNavigate('dashboard')} />;
      case 'viewAllServices':
        return <ViewAllServicesScreen onNavigate={handleNavigate} />;
      case 'voucher':
        return <VoucherScreen onNavigate={handleNavigate} />;
      case 'reviews':
        console.log('🔍 CustomerMainNavigator: Rendering ReviewListScreen');
        return <ReviewListScreen onNavigate={handleNavigate} onBack={() => handleNavigate('dashboard')} />;
      default:
        console.warn('Unknown screen:', currentScreen);
        return <CustomerDashboardScreen onLogout={onLogout} onNavigate={handleNavigate} />;
    }
  };

  return renderCurrentScreen();
}

module.exports = CustomerMainNavigator;


