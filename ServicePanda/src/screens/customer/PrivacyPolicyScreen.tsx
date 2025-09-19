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

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.surface} />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
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
          {/* Privacy Policy Card */}
          <View style={styles.privacyCard}>
            <Text style={styles.cardTitle}>ServicePanda Privacy Policy</Text>
            <Text style={styles.lastUpdated}>Last updated: January 2025</Text>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Information We Collect</Text>
              <Text style={styles.sectionText}>
                We collect information you provide directly to us, such as when you create an account, request services, or contact us for support.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Personal Information</Text>
              <Text style={styles.sectionText}>
                • Name and contact information{'\n'}
                • Email address and phone number{'\n'}
                • Service preferences and history{'\n'}
                • Payment information (processed securely)
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
              <Text style={styles.sectionText}>
                We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Information Sharing</Text>
              <Text style={styles.sectionText}>
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. Data Security</Text>
              <Text style={styles.sectionText}>
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>6. Cookies and Tracking</Text>
              <Text style={styles.sectionText}>
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and improve our services.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>7. Your Rights</Text>
              <Text style={styles.sectionText}>
                You have the right to access, update, or delete your personal information. You can also opt out of certain communications from us.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>8. Children's Privacy</Text>
              <Text style={styles.sectionText}>
                Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>9. Changes to This Policy</Text>
              <Text style={styles.sectionText}>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>10. Contact Us</Text>
              <Text style={styles.sectionText}>
                If you have any questions about this Privacy Policy, please contact us at privacy@servicepanda.com
              </Text>
            </View>
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
  privacyCard: {
    backgroundColor: colors.surface,
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  lastUpdated: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
});

module.exports = PrivacyPolicyScreen;
