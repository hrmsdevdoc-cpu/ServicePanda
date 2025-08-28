const React = require('react');
const {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} = require('react-native');
const { Card, Title, Paragraph, Button, Chip, Divider } = require('react-native-paper');
const { useQuery } = require('@tanstack/react-query');
const { useAuth } = require('../../contexts/AuthContext');
const apiService = require('../../services/api');
const { colors } = require('../../utils/theme');

function HelpScreen({ onNavigate, onBack }) {
  const { providerData } = useAuth();

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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <Text style={styles.headerSubtitle}>
          Everything you need to know about using ServicePanda Partners
        </Text>
      </View>

      {/* Quick Actions */}
      <Card style={styles.quickActionsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Quick Actions</Title>
          <Text style={styles.sectionSubtitle}>
            Jump directly to the section you need help with
          </Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('profile')}
            >
              <Text style={styles.quickActionIcon}>👤</Text>
              <Text style={styles.quickActionText}>Profile Setup</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('payment')}
            >
              <Text style={styles.quickActionIcon}>💳</Text>
              <Text style={styles.quickActionText}>Payment Setup</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('credits')}
            >
              <Text style={styles.quickActionIcon}>💰</Text>
              <Text style={styles.quickActionText}>Credits & Vouchers</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('leads')}
            >
              <Text style={styles.quickActionIcon}>🎯</Text>
              <Text style={styles.quickActionText}>Lead Management</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      {/* Getting Started */}
      <Card style={styles.helpCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🚀</Text>
            <Title style={styles.cardTitle}>Getting Started</Title>
          </View>
          
          <View style={styles.helpSection}>
            <Text style={styles.helpSectionTitle}>Complete Your Profile</Text>
            <Text style={styles.helpSectionText}>
              Make sure to complete all sections: Personal Details, Services, Service Areas, and Documents. 
              Your application needs admin approval before you can receive leads.
            </Text>
            <TouchableOpacity 
              style={styles.actionLink}
              onPress={() => handleQuickAction('profile')}
            >
              <Text style={styles.actionLinkText}>→ Go to Profile Setup</Text>
            </TouchableOpacity>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.helpSection}>
            <Text style={styles.helpSectionTitle}>Set Up Payment Methods</Text>
            <Text style={styles.helpSectionText}>
              Add your credit card in the Payment section to purchase leads after using your 3 free leads.
            </Text>
            <TouchableOpacity 
              style={styles.actionLink}
              onPress={() => handleQuickAction('payment')}
            >
              <Text style={styles.actionLinkText}>→ Go to Payment Setup</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      {/* Lead System */}
      <Card style={styles.helpCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🎯</Text>
            <Title style={styles.cardTitle}>Understanding the Lead System</Title>
          </View>
          
          <View style={styles.helpSection}>
            <Text style={styles.helpSectionTitle}>Free Leads</Text>
            <Text style={styles.helpSectionText}>
              New providers get 3 free leads to try the platform. After that, leads cost $30 for unique access or $12 for shared access.
            </Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.helpSection}>
            <Text style={styles.helpSectionTitle}>Unique vs Shared Leads</Text>
            <Text style={styles.helpSectionText}>
              <Text style={styles.boldText}>Unique:</Text> You get exclusive access to the customer for $30.{'\n'}
              <Text style={styles.boldText}>Shared:</Text> Up to 3 providers can access the same lead for $12 each.
            </Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.helpSection}>
            <Text style={styles.helpSectionTitle}>Lead Expiration</Text>
            <Text style={styles.helpSectionText}>
              Unique offers expire after 24 hours. If not purchased, the lead moves to shared phase where multiple providers can purchase it.
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Billing & Credits */}
      <Card style={styles.helpCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>💳</Text>
            <Title style={styles.cardTitle}>Billing & Credits</Title>
          </View>
          
          <View style={styles.helpSection}>
            <Text style={styles.helpSectionTitle}>Payment Methods</Text>
            <Text style={styles.helpSectionText}>
              You can pay for leads using credits (if you have any) or your saved credit card. Credits are applied first.
            </Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.helpSection}>
            <Text style={styles.helpSectionTitle}>Voucher System</Text>
            <Text style={styles.helpSectionText}>
              Redeem vouchers in the Credits section to add credit to your account. Each voucher is worth $50 and expires after 30 days.
            </Text>
            <TouchableOpacity 
              style={styles.actionLink}
              onPress={() => handleQuickAction('credits')}
            >
              <Text style={styles.actionLinkText}>→ Manage Credits</Text>
            </TouchableOpacity>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.helpSection}>
            <Text style={styles.helpSectionTitle}>Billing History</Text>
            <Text style={styles.helpSectionText}>
              View all your purchases in the Billing section. Free leads show $0.00, paid leads show the actual amount charged.
            </Text>
            <TouchableOpacity 
              style={styles.actionLink}
              onPress={() => handleQuickAction('billing')}
            >
              <Text style={styles.actionLinkText}>→ View Billing History</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      {/* Customer Interaction */}
      <Card style={styles.helpCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📞</Text>
            <Title style={styles.cardTitle}>Contacting Customers</Title>
          </View>
          
          <View style={styles.helpSection}>
            <Text style={styles.helpSectionTitle}>Lead Details</Text>
            <Text style={styles.helpSectionText}>
              Tap on any lead to view full customer details, job requirements, and contact information.
            </Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.helpSection}>
            <Text style={styles.helpSectionTitle}>Contact Options</Text>
            <Text style={styles.helpSectionText}>
              Use the Call, SMS, or Email buttons to contact customers directly. All interactions are tracked for your records.
            </Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.helpSection}>
            <Text style={styles.helpSectionTitle}>Professional Communication</Text>
            <Text style={styles.helpSectionText}>
              Always respond promptly and professionally. Provide clear quotes and availability. This helps build your reputation on the platform.
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Account Management */}
      <Card style={styles.helpCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>⚙️</Text>
            <Title style={styles.cardTitle}>Managing Your Account</Title>
          </View>
          
          <View style={styles.helpSection}>
            <Text style={styles.helpSectionTitle}>Service Areas</Text>
            <Text style={styles.helpSectionText}>
              You can have multiple service areas. Set realistic radius distances you're willing to travel. 
              The system uses GPS coordinates to match you with nearby customers.
            </Text>
            <TouchableOpacity 
              style={styles.actionLink}
              onPress={() => handleQuickAction('services')}
            >
              <Text style={styles.actionLinkText}>→ Manage Service Areas</Text>
            </TouchableOpacity>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.helpSection}>
            <Text style={styles.helpSectionTitle}>Document Updates</Text>
            <Text style={styles.helpSectionText}>
              Keep your license, insurance, and police check documents current. Admin may deactivate accounts with expired documents.
            </Text>
            <TouchableOpacity 
              style={styles.actionLink}
              onPress={() => handleQuickAction('documents')}
            >
              <Text style={styles.actionLinkText}>→ Manage Documents</Text>
            </TouchableOpacity>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.helpSection}>
            <Text style={styles.helpSectionTitle}>Service Categories</Text>
            <Text style={styles.helpSectionText}>
              Only select services you actually provide. You'll only receive leads for selected categories. 
              You can update your services anytime in the Settings menu.
            </Text>
            <TouchableOpacity 
              style={styles.actionLink}
              onPress={() => handleQuickAction('services')}
            >
              <Text style={styles.actionLinkText}>→ Manage Services</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      {/* Troubleshooting */}
      <Card style={styles.helpCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>⚠️</Text>
            <Title style={styles.cardTitle}>Common Issues</Title>
          </View>
          
          <View style={styles.helpSection}>
            <Text style={styles.helpSectionTitle}>Not Receiving Leads</Text>
            <Text style={styles.helpSectionText}>
              Check that your account is approved, you've selected service categories, and set up service areas. 
              Ensure your documents are approved and not expired.
            </Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.helpSection}>
            <Text style={styles.helpSectionTitle}>Payment Issues</Text>
            <Text style={styles.helpSectionText}>
              Verify your credit card details in the Payment section. Make sure your card has sufficient funds and isn't expired.
            </Text>
            <TouchableOpacity 
              style={styles.actionLink}
              onPress={() => handleQuickAction('payment')}
            >
              <Text style={styles.actionLinkText}>→ Check Payment Methods</Text>
            </TouchableOpacity>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.helpSection}>
            <Text style={styles.helpSectionTitle}>Application Status</Text>
            <Text style={styles.helpSectionText}>
              If your status shows "Pending Review", admin is reviewing your application. 
              If "Rejected", check what documents or information need updating.
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Contact Support */}
      <Card style={styles.helpCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📧</Text>
            <Title style={styles.cardTitle}>Need More Help?</Title>
          </View>
          
          <View style={styles.supportSection}>
            <Text style={styles.supportText}>
              Can't find what you're looking for? Our support team is here to help.
            </Text>
            
            <View style={styles.contactInfo}>
              <Text style={styles.contactItem}>
                <Text style={styles.boldText}>Email:</Text> support@servicepanda.com.au
              </Text>
              <Text style={styles.contactItem}>
                <Text style={styles.boldText}>Business Hours:</Text> Monday - Friday, 9:00 AM - 5:00 PM AEST
              </Text>
              <Text style={styles.contactItem}>
                <Text style={styles.boldText}>Response Time:</Text> Within 24 hours
              </Text>
            </View>
            
            <Button
              mode="contained"
              onPress={handleContactSupport}
              style={styles.contactButton}
              buttonColor={colors.primary}
            >
              Contact Support
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
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
