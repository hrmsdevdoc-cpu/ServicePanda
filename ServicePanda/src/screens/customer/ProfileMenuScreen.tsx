const React = require('react');
const { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  StatusBar,
  Dimensions,
  Animated
} = require('react-native');
const { colors } = require('../../utils/theme');
const { useTheme } = require('../../contexts/ThemeContext');

const { width, height } = Dimensions.get('window');

const ProfileMenuScreen = ({ onNavigate, onLogout }) => {
  // Theme context
  const { colors, isDarkMode, toggleTheme } = useTheme();
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  
  // Notification state
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  // Custom toggle button component
  const ToggleButton = ({ isOn, onToggle }) => {
    console.log('🔍 ToggleButton rendered:', { isOn });
    return (
      <TouchableOpacity
        style={[
          styles.toggleButton,
          { backgroundColor: isOn ? colors.toggleActive : colors.toggleBackground }
        ]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={[
          styles.toggleThumb,
          { 
            backgroundColor: colors.surface,
            transform: [{ translateX: isOn ? 20 : 2 }]
          }
        ]} />
      </TouchableOpacity>
    );
  };

  // Animate on mount
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const menuSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'account',
          title: 'Account Details',
          subtitle: 'Manage your personal information',
          icon: '👤',
          onPress: () => onNavigate('accountDetails')
        },
        {
          id: 'security',
          title: 'Security',
          subtitle: 'Password and security settings',
          icon: '🔒',
          onPress: () => Alert.alert('Coming Soon', 'Security settings coming soon!')
        },
        {
          id: 'notifications',
          title: 'Notifications',
          subtitle: 'Manage your notification preferences',
          icon: '🔔',
          hasToggle: true,
          toggleValue: notificationsEnabled,
          onToggle: () => setNotificationsEnabled(!notificationsEnabled)
        }
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'appearance',
          title: 'Appearance',
          subtitle: isDarkMode ? 'Dark Mode' : 'Light Mode',
          icon: '🎨',
          hasToggle: true,
          toggleValue: isDarkMode,
          onToggle: toggleTheme
        },
        {
          id: 'language',
          title: 'Language',
          subtitle: 'Change your language preference',
          icon: '🌐',
          onPress: () => Alert.alert('Coming Soon', 'Language settings coming soon!')
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          icon: '❓',
          onPress: () => onNavigate('helpSupport')
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Share your thoughts with us',
          icon: '💬',
          onPress: () => Alert.alert('Coming Soon', 'Feedback feature coming soon!')
        }
      ]
    },
    {
      title: 'Legal',
      items: [
        {
          id: 'terms',
          title: 'Terms & Conditions',
          subtitle: 'Read our terms and conditions',
          icon: '📄',
          onPress: () => onNavigate('termsConditions')
        },
        {
          id: 'privacy',
          title: 'Privacy Policy',
          subtitle: 'Learn how we protect your data',
          icon: '🛡️',
          onPress: () => onNavigate('privacyPolicy')
        }
      ]
    }
  ];

  const renderMenuSection = (section, index) => (
    <Animated.View
      key={section.title}
      style={[
        styles.section,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.items.map((item, itemIndex) => (
          <View
            key={item.id}
            style={[
              styles.menuItem,
              itemIndex === section.items.length - 1 && styles.lastMenuItem
            ]}
          >
            <TouchableOpacity
              style={styles.menuItemContent}
              onPress={item.onPress}
              activeOpacity={0.7}
              disabled={item.hasToggle}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuItemIcon}>
                  <Text style={styles.menuItemIconText}>{item.icon}</Text>
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              {item.hasToggle ? (
                <>
                  {console.log('🔍 Rendering toggle for item:', item.title, 'hasToggle:', item.hasToggle, 'toggleValue:', item.toggleValue)}
                  <ToggleButton 
                    isOn={item.toggleValue} 
                    onToggle={item.onToggle} 
                  />
                </>
              ) : (
                <Text style={styles.menuItemArrow}>›</Text>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </Animated.View>
  );

  const renderUserInfo = () => (
    <Animated.View
      style={[
        styles.userInfoCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.userAvatar}>
        <Text style={styles.userAvatarText}>AB</Text>
      </View>
      <View style={styles.userDetails}>
        <Text style={styles.userName}>Alice B Thompson</Text>
        <Text style={styles.userEmail}>customer1@example.com</Text>
      </View>
    </Animated.View>
  );

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.surface} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderUserInfo()}
        
        {menuSections.map((section, index) => renderMenuSection(section, index))}
        
        {/* Logout Button */}
        <Animated.View
          style={[
            styles.logoutSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              Alert.alert(
                'Logout',
                'Are you sure you want to logout?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Logout', style: 'destructive', onPress: onLogout }
                ]
              );
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for footer navigation
  },
  userInfoCard: {
    backgroundColor: colors.surface,
    margin: 20,
    marginBottom: 10,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.surface,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemIconText: {
    fontSize: 20,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  menuItemArrow: {
    fontSize: 20,
    color: colors.textTertiary,
    fontWeight: 'bold',
  },
  logoutSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
  },
  // Toggle Button Styles
  toggleButton: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});

module.exports = ProfileMenuScreen;
