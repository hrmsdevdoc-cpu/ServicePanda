const React = require('react');
const { createBottomTabNavigator } = require('@react-navigation/bottom-tabs');
const { createStackNavigator } = require('@react-navigation/stack');
const { IconButton } = require('react-native-paper');
const { colors } = require('../utils/theme');
const { Text } = require('react-native');
// Import vector icons like customer app
const Icon = require('react-native-vector-icons/MaterialIcons').default;

// Import screens
const DashboardScreen = require('../screens/dashboard/DashboardScreen');
const LeadsScreen = require('../screens/leads/LeadsScreen');
const LeadDetailsScreen = require('../screens/leads/LeadDetailsScreen');
const NewLeadsScreen = require('../screens/leads/NewLeadsScreen');
const ActiveLeadsScreen = require('../screens/leads/ActiveLeadsScreen');
const ClosedLeadsScreen = require('../screens/leads/ClosedLeadsScreen');
const ProfileScreen = require('../screens/profile/ProfileScreen');
const ServicesScreen = require('../screens/services/ServicesScreen');
const ServiceAreaScreen = require('../screens/services/ServiceAreaScreen');
const DocumentsScreen = require('../screens/documents/DocumentsScreen');
const PaymentScreen = require('../screens/payment/PaymentScreen');
const CreditsScreen = require('../screens/credits/CreditsScreen');
const BillingScreen = require('../screens/billing/BillingScreen');

const Tab = createBottomTabNavigator();
const LeadsStack = createStackNavigator();
const ServicesStack = createStackNavigator();

// Direct icon rendering function
const renderFooterIcon = (routeName, focused, size) => {
  const iconColor = focused ? colors.primary : colors.textSecondary;
  
  // Test with emoji first to see if function is called
  const emojiMap = {
    'Dashboard': '🏠',
    'Leads': '🎯',
    'Credits': '🎁',
    'Billing': '💳',
    'Profile': '👤',
    'TestTab': '🧪'
  };
  
  console.log('renderFooterIcon called for:', routeName, 'focused:', focused);
  
  // Return emoji for testing
  return React.createElement(Text, { 
    style: { 
      fontSize: size, 
      color: iconColor,
      fontWeight: focused ? 'bold' : 'normal'
    } 
  }, 'TEST' + (emojiMap[routeName] || '🏠'));
};

function LeadsNavigator() {
  return (
    <LeadsStack.Navigator>
      <LeadsStack.Screen 
        name="LeadsMain" 
        component={LeadsScreen}
        options={{ title: 'Leads' }}
      />
      <LeadsStack.Screen 
        name="LeadDetails" 
        component={LeadDetailsScreen}
        options={{ title: 'Lead Details' }}
      />
      <LeadsStack.Screen 
        name="NewLeads" 
        component={NewLeadsScreen}
        options={{ title: 'New Leads' }}
      />
      <LeadsStack.Screen 
        name="ActiveLeads" 
        component={ActiveLeadsScreen}
        options={{ title: 'Active Leads' }}
      />
      <LeadsStack.Screen 
        name="ClosedLeads" 
        component={ClosedLeadsScreen}
        options={{ title: 'Closed Leads' }}
      />
    </LeadsStack.Navigator>
  );
}

function ServicesNavigator() {
  return (
    <ServicesStack.Navigator>
      <ServicesStack.Screen 
        name="ServicesMain" 
        component={ServicesScreen}
        options={{ title: 'Services' }}
      />
      <ServicesStack.Screen 
        name="ServiceArea" 
        component={ServiceAreaScreen}
        options={{ title: 'Service Areas' }}
      />
    </ServicesStack.Navigator>
  );
}

// Create a stack navigator for the main app to handle screen navigation
const MainStack = createStackNavigator();

function MainStackNavigator({ onLogout }) {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="MainTabs" component={MainTabs} />
      <MainStack.Screen name="ServiceArea" component={ServiceAreaScreen} />
      <MainStack.Screen name="PersonalDetails" component={require('../screens/profile/PersonalDetailsScreen')} />
      <MainStack.Screen name="Documents" component={require('../screens/documents/DocumentsScreen')} />
      <MainStack.Screen name="Payment" component={require('../screens/payment/PaymentScreen')} />
    </MainStack.Navigator>
  );
}

function MainTabs({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          console.log('Footer Icon Called:', route.name, focused);
          return renderFooterIcon(route.name, focused, size || 24);
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 80,
          paddingTop: 8,
          paddingBottom: 16,
          paddingHorizontal: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.onPrimary,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        options={{ 
          title: 'Home',
          tabBarLabel: 'Home'
        }}
      >
        {(props) => <DashboardScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Leads" 
        component={LeadsNavigator}
        options={{ 
          title: 'Leads', 
          headerShown: false,
          tabBarLabel: 'Leads'
        }}
      />
      <Tab.Screen 
        name="Credits" 
        options={{ 
          title: 'Credits',
          tabBarLabel: 'Credits'
        }}
      >
        {(props) => <CreditsScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Billing" 
        options={{ 
          title: 'Billing',
          tabBarLabel: 'Billing'
        }}
      >
        {(props) => <BillingScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Profile" 
        options={{ 
          title: 'Profile',
          tabBarLabel: 'Profile'
        }}
      >
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen 
        name="TestTab" 
        options={{ 
          title: 'Test',
          tabBarLabel: 'Test'
        }}
      >
        {() => <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>Test Tab</Text></View>}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function MainNavigator({ onLogout }) {
  return <MainStackNavigator onLogout={onLogout} />;
}

module.exports = MainNavigator;

