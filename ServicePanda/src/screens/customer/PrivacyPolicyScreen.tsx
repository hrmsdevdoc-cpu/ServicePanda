const React = require('react');
const { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  Dimensions,
  Animated
} = require('react-native');
const { colors } = require('../../utils/theme');
const { useTheme } = require('../../contexts/ThemeContext');

const { width, height } = Dimensions.get('window');

const PrivacyPolicyScreen = ({ onBack }) => {
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

  const styles = createStyles(colors);

  const privacySections = [
    {
      icon: '🔍',
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us, such as when you create an account, request services, or contact us for support.',
      details: [
        'Name and contact information',
        'Email address and phone number', 
        'Service preferences and history',
        'Payment information (processed securely)'
      ]
    },
    {
      icon: '🛡️',
      title: 'How We Use Your Information',
      content: 'We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.',
      details: [
        'Provide and maintain our services',
        'Process transactions and payments',
        'Send you technical notices and support',
        'Improve our platform and user experience'
      ]
    },
    {
      icon: '🤝',
      title: 'Information Sharing',
      content: 'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.',
      details: [
        'We never sell your personal data',
        'We share only with trusted service providers',
        'We may share for legal compliance',
        'We respect your privacy choices'
      ]
    },
    {
      icon: '🔒',
      title: 'Data Security',
      content: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
      details: [
        'End-to-end encryption for sensitive data',
        'Regular security audits and updates',
        'Secure data storage and transmission',
        'Access controls and monitoring'
      ]
    },
    {
      icon: '🍪',
      title: 'Cookies and Tracking',
      content: 'We use cookies and similar technologies to enhance your experience, analyze usage patterns, and improve our services.',
      details: [
        'Essential cookies for functionality',
        'Analytics cookies for improvement',
        'Preference cookies for personalization',
        'You can control cookie settings'
      ]
    },
    {
      icon: '⚖️',
      title: 'Your Rights',
      content: 'You have the right to access, update, or delete your personal information. You can also opt out of certain communications from us.',
      details: [
        'Access your personal data',
        'Update or correct information',
        'Delete your account and data',
        'Opt out of marketing communications'
      ]
    },
    {
      icon: '👶',
      title: 'Children\'s Privacy',
      content: 'Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.',
      details: [
        'We do not target children under 13',
        'We do not knowingly collect their data',
        'Parents can contact us about their children',
        'We comply with COPPA regulations'
      ]
    },
    {
      icon: '📝',
      title: 'Changes to This Policy',
      content: 'We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.',
      details: [
        'We will notify you of significant changes',
        'Updated policies will be posted here',
        'Your continued use constitutes acceptance',
        'We maintain version history'
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.surface} />
      
      {/* Modern Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <Text style={styles.headerSubtitle}>How we protect your data</Text>
        </View>
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
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroIconContainer}>
              <Text style={styles.heroIcon}>🛡️</Text>
            </View>
            <Text style={styles.heroTitle}>ServicePanda Privacy Policy</Text>
            <Text style={styles.heroSubtitle}>Your privacy is our priority</Text>
            <View style={styles.lastUpdatedContainer}>
              <Text style={styles.lastUpdatedLabel}>Last updated:</Text>
              <Text style={styles.lastUpdatedDate}>January 2025</Text>
            </View>
          </View>

          {/* Introduction */}
          <View style={styles.introCard}>
            <Text style={styles.introText}>
              At ServicePanda, we are committed to protecting your privacy and ensuring the security of your personal information. This policy explains how we collect, use, and safeguard your data when you use our platform.
            </Text>
          </View>

          {/* Privacy Sections */}
          {privacySections.map((section, index) => (
            <View key={index} style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Text style={styles.sectionIcon}>{section.icon}</Text>
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              
              <Text style={styles.sectionContent}>{section.content}</Text>
              
              <View style={styles.detailsContainer}>
                {section.details.map((detail, detailIndex) => (
                  <View key={detailIndex} style={styles.detailItem}>
                    <Text style={styles.detailBullet}>•</Text>
                    <Text style={styles.detailText}>{detail}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          {/* Contact Section */}
          <View style={styles.contactCard}>
            <View style={styles.contactHeader}>
              <Text style={styles.contactIcon}>📧</Text>
              <Text style={styles.contactTitle}>Questions or Concerns?</Text>
            </View>
            <Text style={styles.contactText}>
              If you have any questions about this Privacy Policy or how we handle your data, please don't hesitate to contact us.
            </Text>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonText}>Contact Us</Text>
            </TouchableOpacity>
            <Text style={styles.contactEmail}>privacy@servicepanda.com</Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By using ServicePanda, you acknowledge that you have read and understood this Privacy Policy.
            </Text>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: colors.surface,
    marginBottom: 20,
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroIcon: {
    fontSize: 40,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  lastUpdatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastUpdatedLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 4,
  },
  lastUpdatedDate: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  introCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  introText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionIcon: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  sectionContent: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  detailsContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  detailBullet: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
    marginRight: 12,
    marginTop: 2,
  },
  detailText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    flex: 1,
  },
  contactCard: {
    backgroundColor: colors.primary + '10',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  contactText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  contactButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 12,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contactEmail: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

module.exports = PrivacyPolicyScreen;