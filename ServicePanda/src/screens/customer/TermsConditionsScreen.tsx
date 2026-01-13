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

const TermsConditionsScreen = ({ onBack }) => {
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

  const termsSections = [
    {
      icon: '✅',
      title: 'Acceptance of Terms',
      content: 'By accessing and using ServicePanda, you accept and agree to be bound by the terms and provision of this agreement.',
      details: [
        'You must be at least 18 years old to use our service',
        'By using the platform, you agree to these terms',
        'We may update these terms from time to time',
        'Continued use constitutes acceptance of changes'
      ]
    },
    {
      icon: '📋',
      title: 'Use License',
      content: 'Permission is granted to temporarily download one copy of ServicePanda per device for personal, non-commercial transitory viewing only.',
      details: [
        'This is a grant of license, not a transfer of title',
        'You may not modify or copy the materials',
        'Use is for personal, non-commercial purposes only',
        'You may not redistribute or resell the service'
      ]
    },
    {
      icon: '👷',
      title: 'Service Provider Responsibilities',
      content: 'Service providers must maintain professional standards, provide accurate information, and complete services as agreed upon with customers.',
      details: [
        'Maintain professional standards and conduct',
        'Provide accurate and truthful information',
        'Complete services as agreed with customers',
        'Follow all applicable laws and regulations',
        'Maintain appropriate insurance coverage'
      ]
    },
    {
      icon: '👤',
      title: 'Customer Responsibilities',
      content: 'Customers must provide accurate information, pay for services as agreed, and treat service providers with respect.',
      details: [
        'Provide accurate and complete information',
        'Pay for services as agreed upon',
        'Treat service providers with respect',
        'Follow safety guidelines and instructions',
        'Report any issues promptly and honestly'
      ]
    },
    {
      icon: '💳',
      title: 'Payment Terms',
      content: 'All payments must be made through our secure payment system. Refunds are subject to our refund policy.',
      details: [
        'Payments are processed securely through our platform',
        'All transactions are protected by encryption',
        'Refunds are subject to our refund policy',
        'Service providers receive payment after job completion',
        'We may hold funds for dispute resolution'
      ]
    },
    {
      icon: '🔒',
      title: 'Privacy Policy',
      content: 'Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service.',
      details: [
        'We collect and use data as described in our Privacy Policy',
        'Your personal information is protected',
        'We do not sell your data to third parties',
        'You can control your privacy settings'
      ]
    },
    {
      icon: '⚖️',
      title: 'Limitation of Liability',
      content: 'In no event shall ServicePanda, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages.',
      details: [
        'We are not liable for indirect or consequential damages',
        'Our liability is limited to the amount you paid us',
        'We are not responsible for third-party actions',
        'Some jurisdictions may not allow liability limitations'
      ]
    },
    {
      icon: '🚫',
      title: 'Prohibited Uses',
      content: 'You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts.',
      details: [
        'No illegal or unlawful activities',
        'No harassment or abuse of other users',
        'No violation of intellectual property rights',
        'No attempt to gain unauthorized access',
        'No spam or unsolicited communications'
      ]
    },
    {
      icon: '📞',
      title: 'Contact Information',
      content: 'If you have any questions about these Terms & Conditions, please contact us at support@servicepanda.com',
      details: [
        'Email us at support@servicepanda.com',
        'Call our customer service line',
        'Use our in-app support chat',
        'Visit our help center for FAQs'
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
          <Text style={styles.headerTitle}>Terms & Conditions</Text>
          <Text style={styles.headerSubtitle}>Our service agreement</Text>
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
              <Text style={styles.heroIcon}>📋</Text>
            </View>
            <Text style={styles.heroTitle}>ServicePanda Terms & Conditions</Text>
            <Text style={styles.heroSubtitle}>Please read these terms carefully</Text>
            <View style={styles.lastUpdatedContainer}>
              <Text style={styles.lastUpdatedLabel}>Last updated:</Text>
              <Text style={styles.lastUpdatedDate}>January 2025</Text>
            </View>
          </View>

          {/* Introduction */}
          <View style={styles.introCard}>
            <Text style={styles.introText}>
              Welcome to ServicePanda! These terms and conditions outline the rules and regulations for the use of our platform. By accessing and using our service, you accept these terms in full.
            </Text>
          </View>

          {/* Terms Sections */}
          {termsSections.map((section, index) => (
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

          {/* Important Notice */}
          <View style={styles.noticeCard}>
            <View style={styles.noticeHeader}>
              <Text style={styles.noticeIcon}>⚠️</Text>
              <Text style={styles.noticeTitle}>Important Notice</Text>
            </View>
            <Text style={styles.noticeText}>
              These terms constitute a legally binding agreement between you and ServicePanda. If you do not agree with any part of these terms, you must not use our service.
            </Text>
          </View>

          {/* Contact Section */}
          <View style={styles.contactCard}>
            <View style={styles.contactHeader}>
              <Text style={styles.contactIcon}>📧</Text>
              <Text style={styles.contactTitle}>Need Help Understanding?</Text>
            </View>
            <Text style={styles.contactText}>
              If you have any questions about these Terms & Conditions or need clarification on any point, our support team is here to help.
            </Text>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonText}>Get Support</Text>
            </TouchableOpacity>
            <Text style={styles.contactEmail}>support@servicepanda.com</Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By using ServicePanda, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
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
  noticeCard: {
    backgroundColor: colors.warning + '10',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.warning + '30',
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  noticeIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  noticeText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
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

module.exports = TermsConditionsScreen;