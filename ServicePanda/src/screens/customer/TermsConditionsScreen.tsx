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

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.surface} />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
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
          {/* Terms Card */}
          <View style={styles.termsCard}>
            <Text style={styles.cardTitle}>ServicePanda Terms & Conditions</Text>
            <Text style={styles.lastUpdated}>Last updated: January 2025</Text>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
              <Text style={styles.sectionText}>
                By accessing and using ServicePanda, you accept and agree to be bound by the terms and provision of this agreement.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Use License</Text>
              <Text style={styles.sectionText}>
                Permission is granted to temporarily download one copy of ServicePanda per device for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Service Provider Responsibilities</Text>
              <Text style={styles.sectionText}>
                Service providers must maintain professional standards, provide accurate information, and complete services as agreed upon with customers.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Customer Responsibilities</Text>
              <Text style={styles.sectionText}>
                Customers must provide accurate information, pay for services as agreed, and treat service providers with respect.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. Payment Terms</Text>
              <Text style={styles.sectionText}>
                All payments must be made through our secure payment system. Refunds are subject to our refund policy.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>6. Privacy Policy</Text>
              <Text style={styles.sectionText}>
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
              <Text style={styles.sectionText}>
                In no event shall ServicePanda, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>8. Contact Information</Text>
              <Text style={styles.sectionText}>
                If you have any questions about these Terms & Conditions, please contact us at support@servicepanda.com
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
  termsCard: {
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

module.exports = TermsConditionsScreen;
