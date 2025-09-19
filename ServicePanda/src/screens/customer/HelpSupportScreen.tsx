const React = require('react');
const { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  Dimensions,
  Animated,
  Alert
} = require('react-native');
const { colors } = require('../../utils/theme');
const { useTheme } = require('../../contexts/ThemeContext');

const { width, height } = Dimensions.get('window');

const HelpSupportScreen = ({ onBack }) => {
  // Theme context
  const { colors, isDarkMode } = useTheme();
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

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

  const faqItems = [
    {
      question: "How do I request a service?",
      answer: "Tap the 'Add' button in the bottom navigation, select your service category, fill in the details, and submit your request."
    },
    {
      question: "How do I track my requests?",
      answer: "Go to the 'Requests' tab to see all your service requests and their current status."
    },
    {
      question: "How do I pay for services?",
      answer: "Payment is processed securely through our platform. You can pay using credit card, debit card, or other supported payment methods."
    },
    {
      question: "Can I cancel a service request?",
      answer: "Yes, you can cancel a request before it's accepted by the service provider. Go to your requests and tap 'Cancel'."
    },
    {
      question: "How do I contact support?",
      answer: "You can contact us through the 'Send Feedback' option in your profile, or email us at support@servicepanda.com"
    }
  ];

  const contactMethods = [
    {
      title: "Email Support",
      description: "Get help via email",
      icon: "📧",
      action: () => Alert.alert("Email Support", "Send us an email at support@servicepanda.com")
    },
    {
      title: "Live Chat",
      description: "Chat with our support team",
      icon: "💬",
      action: () => Alert.alert("Live Chat", "Live chat feature coming soon!")
    },
    {
      title: "Phone Support",
      description: "Call us directly",
      icon: "📞",
      action: () => Alert.alert("Phone Support", "Call us at +1-800-SERVICES")
    }
  ];

  const renderFAQItem = (item, index) => (
    <Animated.View
      key={index}
      style={[
        styles.faqItem,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <Text style={styles.faqQuestion}>{item.question}</Text>
      <Text style={styles.faqAnswer}>{item.answer}</Text>
    </Animated.View>
  );

  const renderContactMethod = (method, index) => (
    <TouchableOpacity
      key={index}
      style={styles.contactMethod}
      onPress={method.action}
      activeOpacity={0.7}
    >
      <View style={styles.contactIcon}>
        <Text style={styles.contactIconText}>{method.icon}</Text>
      </View>
      <View style={styles.contactText}>
        <Text style={styles.contactTitle}>{method.title}</Text>
        <Text style={styles.contactDescription}>{method.description}</Text>
      </View>
      <Text style={styles.contactArrow}>›</Text>
    </TouchableOpacity>
  );

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.surface} />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Welcome Card */}
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>How can we help you?</Text>
            <Text style={styles.welcomeText}>
              Find answers to common questions or get in touch with our support team.
            </Text>
          </View>

          {/* Contact Methods */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Support</Text>
            <View style={styles.contactMethods}>
              {contactMethods.map((method, index) => renderContactMethod(method, index))}
            </View>
          </View>

          {/* FAQ Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            <View style={styles.faqContainer}>
              {faqItems.map((item, index) => renderFAQItem(item, index))}
            </View>
          </View>

          {/* Additional Help */}
          <View style={styles.helpCard}>
            <Text style={styles.helpTitle}>Still need help?</Text>
            <Text style={styles.helpText}>
              If you can't find what you're looking for, don't hesitate to reach out to our support team.
            </Text>
            <TouchableOpacity
              style={styles.helpButton}
              onPress={() => Alert.alert("Contact Support", "Opening support options...")}
            >
              <Text style={styles.helpButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSpacer: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for footer navigation
  },
  content: {
    flex: 1,
  },
  welcomeCard: {
    backgroundColor: colors.primary,
    margin: 20,
    marginBottom: 10,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: colors.surface,
    textAlign: 'center',
    opacity: 0.9,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  contactMethods: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactIconText: {
    fontSize: 20,
  },
  contactText: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  contactArrow: {
    fontSize: 20,
    color: colors.textTertiary,
    fontWeight: 'bold',
  },
  faqContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  faqItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  helpCard: {
    backgroundColor: colors.surface,
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  helpTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  helpText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  helpButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  helpButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});

module.exports = HelpSupportScreen;
