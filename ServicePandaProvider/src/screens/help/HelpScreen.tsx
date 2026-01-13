const React = require('react');
const {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Animated,
  Dimensions,
} = require('react-native');
const { Card, Title, Paragraph, Button, Chip, Divider } = require('react-native-paper');
const { useQuery } = require('@tanstack/react-query');
const { useAuth } = require('../../contexts/AuthContext');
const apiService = require('../../services/api');
const { colors } = require('../../utils/theme');

const { width } = Dimensions.get('window');

function HelpScreen({ onNavigate, onBack }) {
  const { providerData } = useAuth();

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  // Fetch lead settings for dynamic help content
  const { data: leadSettings } = useQuery({
    queryKey: ['/api/admin/lead-settings'],
    queryFn: () => apiService.getLeadSettings(),
    enabled: false, // Don't fetch automatically, just use if available
  });

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'How would you like to contact support?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Email', 
          onPress: () => Linking.openURL('mailto:support@servicepanda.com.au')
        },
        { 
          text: 'Visit Website', 
          onPress: () => Linking.openURL('https://servicepanda.com.au/support')
        }
      ]
    );
  };

  // Animation on mount
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleQuickAction = (action) => {
    switch (action) {
      case 'profile':
        onNavigate('profile');
        break;
      case 'payment':
        onNavigate('payment');
        break;
      case 'credits':
        onNavigate('credits');
        break;
      case 'billing':
        onNavigate('billing');
        break;
      case 'leads':
        onNavigate('leads');
        break;
      case 'services':
        onNavigate('services');
        break;
      case 'documents':
        onNavigate('documents');
        break;
      default:
        break;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        {/* Modern Header */}
        <View style={styles.modernHeader}>
          <View style={styles.modernHeaderContent}>
            <Text style={styles.modernHeaderTitle}>Help & Support</Text>
            <Text style={styles.modernHeaderSubtitle}>
          Everything you need to know about using ServicePanda Partners
        </Text>
          </View>
          <View style={styles.modernHeaderIcon}>
            <Text style={styles.modernHeaderEmoji}>❓</Text>
          </View>
      </View>

        {/* Modern Quick Actions */}
        <View style={styles.modernQuickActionsCard}>
          <View style={styles.modernQuickActionsHeader}>
            <View style={styles.modernQuickActionsIcon}>
              <Text style={styles.modernQuickActionsEmoji}>⚡</Text>
            </View>
            <View style={styles.modernQuickActionsInfo}>
              <Text style={styles.modernQuickActionsTitle}>Quick Actions</Text>
              <Text style={styles.modernQuickActionsSubtitle}>
            Jump directly to the section you need help with
          </Text>
            </View>
          </View>
          
          <View style={styles.modernQuickActionsGrid}>
            <TouchableOpacity 
              style={styles.modernQuickActionButton}
              onPress={() => handleQuickAction('profile')}
              activeOpacity={0.7}
            >
              <View style={styles.modernQuickActionIcon}>
                <Text style={styles.modernQuickActionEmoji}>👤</Text>
              </View>
              <Text style={styles.modernQuickActionText}>Profile Setup</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modernQuickActionButton}
              onPress={() => handleQuickAction('payment')}
              activeOpacity={0.7}
            >
              <View style={styles.modernQuickActionIcon}>
                <Text style={styles.modernQuickActionEmoji}>💳</Text>
              </View>
              <Text style={styles.modernQuickActionText}>Payment Setup</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modernQuickActionButton}
              onPress={() => handleQuickAction('credits')}
              activeOpacity={0.7}
            >
              <View style={styles.modernQuickActionIcon}>
                <Text style={styles.modernQuickActionEmoji}>💰</Text>
              </View>
              <Text style={styles.modernQuickActionText}>Credits & Vouchers</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modernQuickActionButton}
              onPress={() => handleQuickAction('leads')}
              activeOpacity={0.7}
            >
              <View style={styles.modernQuickActionIcon}>
                <Text style={styles.modernQuickActionEmoji}>🎯</Text>
              </View>
              <Text style={styles.modernQuickActionText}>Lead Management</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modern Getting Started Card */}
        <View style={styles.modernHelpCard}>
          <View style={styles.modernHelpCardHeader}>
            <View style={styles.modernHelpCardIcon}>
              <Text style={styles.modernHelpCardEmoji}>🚀</Text>
            </View>
            <View style={styles.modernHelpCardInfo}>
              <Text style={styles.modernHelpCardTitle}>Getting Started</Text>
              <Text style={styles.modernHelpCardSubtitle}>
                Essential steps to get your account ready
              </Text>
            </View>
          </View>
          
          <View style={styles.modernHelpSection}>
            <Text style={styles.modernHelpSectionTitle}>Complete Your Profile</Text>
            <Text style={styles.modernHelpSectionText}>
              Make sure to complete all sections: Personal Details, Services, Service Areas, and Documents. 
              Your application needs admin approval before you can receive leads.
            </Text>
            <TouchableOpacity 
              style={styles.modernActionLink}
              onPress={() => handleQuickAction('profile')}
              activeOpacity={0.7}
            >
              <Text style={styles.modernActionLinkText}>→ Go to Profile Setup</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modernDivider} />
          
          <View style={styles.modernHelpSection}>
            <Text style={styles.modernHelpSectionTitle}>Set Up Payment Methods</Text>
            <Text style={styles.modernHelpSectionText}>
              Add your credit card in the Payment section to purchase leads after using your 3 free leads.
            </Text>
            <TouchableOpacity 
              style={styles.modernActionLink}
              onPress={() => handleQuickAction('payment')}
              activeOpacity={0.7}
            >
              <Text style={styles.modernActionLinkText}>→ Go to Payment Setup</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modern Lead System Card */}
        <View style={styles.modernHelpCard}>
          <View style={styles.modernHelpCardHeader}>
            <View style={styles.modernHelpCardIcon}>
              <Text style={styles.modernHelpCardEmoji}>🎯</Text>
            </View>
            <View style={styles.modernHelpCardInfo}>
              <Text style={styles.modernHelpCardTitle}>Understanding the Lead System</Text>
              <Text style={styles.modernHelpCardSubtitle}>
                How leads work and pricing structure
              </Text>
            </View>
          </View>
          
          <View style={styles.modernHelpSection}>
            <Text style={styles.modernHelpSectionTitle}>Free Leads</Text>
            <Text style={styles.modernHelpSectionText}>
              New providers get 3 free leads to try the platform. After that, leads cost $30 for unique access or $12 for shared access.
            </Text>
          </View>
          
          <View style={styles.modernDivider} />
          
          <View style={styles.modernHelpSection}>
            <Text style={styles.modernHelpSectionTitle}>Unique vs Shared Leads</Text>
            <Text style={styles.modernHelpSectionText}>
              <Text style={styles.modernBoldText}>Unique:</Text> You get exclusive access to the customer for $30.{'\n'}
              <Text style={styles.modernBoldText}>Shared:</Text> Up to 3 providers can access the same lead for $12 each.
            </Text>
          </View>
          
          <View style={styles.modernDivider} />
          
          <View style={styles.modernHelpSection}>
            <Text style={styles.modernHelpSectionTitle}>Lead Expiration</Text>
            <Text style={styles.modernHelpSectionText}>
              Unique offers expire after 24 hours. If not purchased, the lead moves to shared phase where multiple providers can purchase it.
            </Text>
          </View>
        </View>

        {/* Modern Billing & Credits Card */}
        <View style={styles.modernHelpCard}>
          <View style={styles.modernHelpCardHeader}>
            <View style={styles.modernHelpCardIcon}>
              <Text style={styles.modernHelpCardEmoji}>💳</Text>
            </View>
            <View style={styles.modernHelpCardInfo}>
              <Text style={styles.modernHelpCardTitle}>Billing & Credits</Text>
              <Text style={styles.modernHelpCardSubtitle}>
                Payment methods and credit management
              </Text>
            </View>
          </View>
          
          <View style={styles.modernHelpSection}>
            <Text style={styles.modernHelpSectionTitle}>Payment Methods</Text>
            <Text style={styles.modernHelpSectionText}>
              You can pay for leads using credits (if you have any) or your saved credit card. Credits are applied first.
            </Text>
          </View>
          
          <View style={styles.modernDivider} />
          
          <View style={styles.modernHelpSection}>
            <Text style={styles.modernHelpSectionTitle}>Voucher System</Text>
            <Text style={styles.modernHelpSectionText}>
              Redeem vouchers in the Credits section to add credit to your account. Each voucher is worth $50 and expires after 30 days.
            </Text>
            <TouchableOpacity 
              style={styles.modernActionLink}
              onPress={() => handleQuickAction('credits')}
              activeOpacity={0.7}
            >
              <Text style={styles.modernActionLinkText}>→ Manage Credits</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modernDivider} />
          
          <View style={styles.modernHelpSection}>
            <Text style={styles.modernHelpSectionTitle}>Billing History</Text>
            <Text style={styles.modernHelpSectionText}>
              View all your purchases in the Billing section. Free leads show $0.00, paid leads show the actual amount charged.
            </Text>
            <TouchableOpacity 
              style={styles.modernActionLink}
              onPress={() => handleQuickAction('billing')}
              activeOpacity={0.7}
            >
              <Text style={styles.modernActionLinkText}>→ View Billing History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modern Customer Interaction Card */}
        <View style={styles.modernHelpCard}>
          <View style={styles.modernHelpCardHeader}>
            <View style={styles.modernHelpCardIcon}>
              <Text style={styles.modernHelpCardEmoji}>📞</Text>
            </View>
            <View style={styles.modernHelpCardInfo}>
              <Text style={styles.modernHelpCardTitle}>Contacting Customers</Text>
              <Text style={styles.modernHelpCardSubtitle}>
                How to interact with leads and customers
              </Text>
            </View>
          </View>
          
          <View style={styles.modernHelpSection}>
            <Text style={styles.modernHelpSectionTitle}>Lead Details</Text>
            <Text style={styles.modernHelpSectionText}>
              Tap on any lead to view full customer details, job requirements, and contact information.
            </Text>
          </View>
          
          <View style={styles.modernDivider} />
          
          <View style={styles.modernHelpSection}>
            <Text style={styles.modernHelpSectionTitle}>Contact Options</Text>
            <Text style={styles.modernHelpSectionText}>
              Use the Call, SMS, or Email buttons to contact customers directly. All interactions are tracked for your records.
            </Text>
          </View>
          
          <View style={styles.modernDivider} />
          
          <View style={styles.modernHelpSection}>
            <Text style={styles.modernHelpSectionTitle}>Professional Communication</Text>
            <Text style={styles.modernHelpSectionText}>
              Always respond promptly and professionally. Provide clear quotes and availability. This helps build your reputation on the platform.
            </Text>
          </View>
        </View>

        {/* Modern Account Management Card */}
        <View style={styles.modernHelpCard}>
          <View style={styles.modernHelpCardHeader}>
            <View style={styles.modernHelpCardIcon}>
              <Text style={styles.modernHelpCardEmoji}>⚙️</Text>
            </View>
            <View style={styles.modernHelpCardInfo}>
              <Text style={styles.modernHelpCardTitle}>Managing Your Account</Text>
              <Text style={styles.modernHelpCardSubtitle}>
                Account settings and preferences
              </Text>
            </View>
          </View>
          
          <View style={styles.modernHelpSection}>
            <Text style={styles.modernHelpSectionTitle}>Service Areas</Text>
            <Text style={styles.modernHelpSectionText}>
              You can have multiple service areas. Set realistic radius distances you're willing to travel. 
              The system uses GPS coordinates to match you with nearby customers.
            </Text>
            <TouchableOpacity 
              style={styles.modernActionLink}
              onPress={() => handleQuickAction('services')}
              activeOpacity={0.7}
            >
              <Text style={styles.modernActionLinkText}>→ Manage Service Areas</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modernDivider} />
          
          <View style={styles.modernHelpSection}>
            <Text style={styles.modernHelpSectionTitle}>Document Updates</Text>
            <Text style={styles.modernHelpSectionText}>
              Keep your license, insurance, and police check documents current. Admin may deactivate accounts with expired documents.
            </Text>
            <TouchableOpacity 
              style={styles.modernActionLink}
              onPress={() => handleQuickAction('documents')}
              activeOpacity={0.7}
            >
              <Text style={styles.modernActionLinkText}>→ Manage Documents</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modernDivider} />
          
          <View style={styles.modernHelpSection}>
            <Text style={styles.modernHelpSectionTitle}>Service Categories</Text>
            <Text style={styles.modernHelpSectionText}>
              Only select services you actually provide. You'll only receive leads for selected categories. 
              You can update your services anytime in the Settings menu.
            </Text>
            <TouchableOpacity 
              style={styles.modernActionLink}
              onPress={() => handleQuickAction('services')}
              activeOpacity={0.7}
            >
              <Text style={styles.modernActionLinkText}>→ Manage Services</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modern Troubleshooting Card */}
        <View style={styles.modernHelpCard}>
          <View style={styles.modernHelpCardHeader}>
            <View style={styles.modernHelpCardIcon}>
              <Text style={styles.modernHelpCardEmoji}>⚠️</Text>
            </View>
            <View style={styles.modernHelpCardInfo}>
              <Text style={styles.modernHelpCardTitle}>Common Issues</Text>
              <Text style={styles.modernHelpCardSubtitle}>
                Troubleshooting common problems
              </Text>
            </View>
          </View>
          
          <View style={styles.modernHelpSection}>
            <Text style={styles.modernHelpSectionTitle}>Not Receiving Leads</Text>
            <Text style={styles.modernHelpSectionText}>
              Check that your account is approved, you've selected service categories, and set up service areas. 
              Ensure your documents are approved and not expired.
            </Text>
          </View>
          
          <View style={styles.modernDivider} />
          
          <View style={styles.modernHelpSection}>
            <Text style={styles.modernHelpSectionTitle}>Payment Issues</Text>
            <Text style={styles.modernHelpSectionText}>
              Verify your credit card details in the Payment section. Make sure your card has sufficient funds and isn't expired.
            </Text>
            <TouchableOpacity 
              style={styles.modernActionLink}
              onPress={() => handleQuickAction('payment')}
              activeOpacity={0.7}
            >
              <Text style={styles.modernActionLinkText}>→ Check Payment Methods</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modernDivider} />
          
          <View style={styles.modernHelpSection}>
            <Text style={styles.modernHelpSectionTitle}>Application Status</Text>
            <Text style={styles.modernHelpSectionText}>
              If your status shows "Pending Review", admin is reviewing your application. 
              If "Rejected", check what documents or information need updating.
            </Text>
          </View>
        </View>

        {/* Modern Contact Support Card */}
        <View style={styles.modernContactCard}>
          <View style={styles.modernContactHeader}>
            <View style={styles.modernContactIcon}>
              <Text style={styles.modernContactEmoji}>📧</Text>
            </View>
            <View style={styles.modernContactInfo}>
              <Text style={styles.modernContactTitle}>Need More Help?</Text>
              <Text style={styles.modernContactSubtitle}>
                Our support team is here to help
              </Text>
            </View>
          </View>
          
          <View style={styles.modernSupportSection}>
            <Text style={styles.modernSupportText}>
              Can't find what you're looking for? Our support team is here to help.
            </Text>
            
            <View style={styles.modernContactInfoContainer}>
              <View style={styles.modernContactItem}>
                <Text style={styles.modernContactLabel}>Email:</Text>
                <Text style={styles.modernContactValue}>support@servicepanda.com.au</Text>
              </View>
              <View style={styles.modernContactItem}>
                <Text style={styles.modernContactLabel}>Business Hours:</Text>
                <Text style={styles.modernContactValue}>Monday - Friday, 9:00 AM - 5:00 PM AEST</Text>
              </View>
              <View style={styles.modernContactItem}>
                <Text style={styles.modernContactLabel}>Response Time:</Text>
                <Text style={styles.modernContactValue}>Within 24 hours</Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.modernContactButton}
              onPress={handleContactSupport}
              activeOpacity={0.8}
            >
              <Text style={styles.modernContactButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  animatedContainer: {
    flex: 1,
  },
  // Modern Header
  modernHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  modernHeaderContent: {
    flex: 1,
  },
  modernHeaderTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  modernHeaderSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
    fontWeight: '500',
  },
  modernHeaderIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  modernHeaderEmoji: {
    fontSize: 24,
  },
  // Modern Quick Actions
  modernQuickActionsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  modernQuickActionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modernQuickActionsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modernQuickActionsEmoji: {
    fontSize: 24,
  },
  modernQuickActionsInfo: {
    flex: 1,
  },
  modernQuickActionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  modernQuickActionsSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 20,
  },
  modernQuickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  modernQuickActionButton: {
    width: '48%',
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  modernQuickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modernQuickActionEmoji: {
    fontSize: 20,
  },
  modernQuickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  // Modern Help Cards
  modernHelpCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  modernHelpCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modernHelpCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modernHelpCardEmoji: {
    fontSize: 24,
  },
  modernHelpCardInfo: {
    flex: 1,
  },
  modernHelpCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  modernHelpCardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 20,
  },
  modernHelpSection: {
    marginBottom: 16,
  },
  modernHelpSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  modernHelpSectionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
    fontWeight: '500',
  },
  modernActionLink: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modernActionLinkText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  modernDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 16,
  },
  modernBoldText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  // Modern Contact Support
  modernContactCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modernContactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modernContactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modernContactEmoji: {
    fontSize: 24,
    color: 'white',
  },
  modernContactInfo: {
    flex: 1,
  },
  modernContactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  modernContactSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    lineHeight: 20,
  },
  modernSupportSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 16,
  },
  modernSupportText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
    lineHeight: 22,
    fontWeight: '500',
  },
  modernContactInfoContainer: {
    marginBottom: 20,
  },
  modernContactItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  modernContactLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    width: 120,
  },
  modernContactValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
    flex: 1,
  },
  modernContactButton: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modernContactButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  quickActionsCard: {
    marginBottom: 12,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 1,
  },
  quickActionIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  helpCard: {
    marginBottom: 12,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  helpSection: {
    marginBottom: 12,
  },
  helpSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  helpSectionText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 6,
  },
  actionLink: {
    alignSelf: 'flex-start',
  },
  actionLinkText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  divider: {
    marginVertical: 12,
    backgroundColor: colors.border,
  },
  boldText: {
    fontWeight: 'bold',
  },
  supportSection: {
    backgroundColor: colors.primary + '10',
    padding: 12,
    borderRadius: 6,
  },
  supportText: {
    fontSize: 11,
    color: colors.primary + 'CC',
    marginBottom: 12,
    lineHeight: 16,
  },
  contactInfo: {
    marginBottom: 12,
  },
  contactItem: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 6,
    lineHeight: 16,
  },
  contactButton: {
    alignSelf: 'center',
  },
});

module.exports = HelpScreen;
