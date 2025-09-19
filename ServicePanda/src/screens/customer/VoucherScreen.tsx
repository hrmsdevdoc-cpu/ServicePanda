const React = require('react');
const { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Dimensions, Animated } = require('react-native');
const { colors } = require('../../utils/theme');

const { width, height } = Dimensions.get('window');

const VoucherScreen = ({ onNavigate, onBack }) => {
  // Mock data for vouchers (in real app, this would come from API)
  const [vouchers, setVouchers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Simulate loading vouchers
    setLoading(true);
    setTimeout(() => {
      setVouchers([]); // Empty for now to show empty state
      setLoading(false);
    }, 1000);
  }, []);


  const renderAvailableVouchers = () => {
    return (
      <Animated.View 
        style={[
          styles.section,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionIcon}>🎁</Text>
            <View>
              <Text style={styles.sectionTitle}>Available Vouchers</Text>
              <Text style={styles.sectionSubtitle}>Vouchers created by admin for customers</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionContent}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading vouchers...</Text>
            </View>
          ) : vouchers.length > 0 ? (
            <View style={styles.voucherList}>
              {vouchers.map((voucher, index) => (
                <View key={voucher.id || index} style={styles.voucherCard}>
                  <View style={styles.voucherHeader}>
                    <Text style={styles.voucherValue}>${voucher.value}</Text>
                    <Text style={styles.voucherCode}>{voucher.code}</Text>
                  </View>
                  <Text style={styles.voucherDescription}>{voucher.description}</Text>
                  <View style={styles.voucherFooter}>
                    <Text style={styles.voucherExpiry}>Expires: {voucher.expiryDate}</Text>
                    <TouchableOpacity style={styles.useButton}>
                      <Text style={styles.useButtonText}>Use Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎁</Text>
              <Text style={styles.emptyTitle}>No Vouchers Available</Text>
              <Text style={styles.emptySubtitle}>No vouchers are currently available. Check back later!</Text>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderAboutVouchers = () => {
    return (
      <Animated.View 
        style={[
          styles.section,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>About Vouchers</Text>
        </View>

        <View style={styles.sectionContent}>
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.infoText}>Vouchers are promotional credits created by ServicePanda admin</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.infoText}>Each voucher has a specific value and expiration date</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.infoText}>Vouchers can be used for service bookings</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.infoText}>Contact support if you have questions about voucher usage</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* {renderHeader()} */}
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderAvailableVouchers()}
        {renderAboutVouchers()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  backIcon: {
    fontSize: 20,
    color: colors.text,
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
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
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '30',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionContent: {
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  voucherList: {
    gap: 16,
  },
  voucherCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border + '50',
  },
  voucherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  voucherValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  voucherCode: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    backgroundColor: colors.border + '30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  voucherDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
  },
  voucherFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voucherExpiry: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  useButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  useButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.surface,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoList: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.text,
    marginTop: 8,
    marginRight: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
    lineHeight: 20,
  },
});

module.exports = VoucherScreen;
