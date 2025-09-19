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
  Image
} = require('react-native');
const { colors } = require('../../utils/theme');
const { useTheme } = require('../../contexts/ThemeContext');

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ onComplete }) => {
  // Theme context
  const { colors, isDarkMode } = useTheme();
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const [currentPage, setCurrentPage] = React.useState(0);

  // Onboarding pages data
  const onboardingPages = [
    {
      id: 1,
      title: 'Welcome to ServicePanda',
      subtitle: 'Your one-stop solution for all service needs',
      description: 'Find reliable service providers for home maintenance, cleaning, repairs, and much more.',
      icon: '🏠',
      image: 'https://via.placeholder.com/300x200/007AFF/FFFFFF?text=Home+Services',
      color: '#007AFF'
    },
    {
      id: 2,
      title: 'Easy Booking',
      subtitle: 'Book services in just a few taps',
      description: 'Browse categories, select your service, and book instantly. Track your requests in real-time.',
      icon: '📱',
      image: 'https://via.placeholder.com/300x200/34C759/FFFFFF?text=Easy+Booking',
      color: '#34C759'
    },
    {
      id: 3,
      title: 'Trusted Providers',
      subtitle: 'Verified and rated service professionals',
      description: 'All our service providers are background-checked and rated by customers for quality assurance.',
      icon: '⭐',
      image: 'https://via.placeholder.com/300x200/FF9500/FFFFFF?text=Trusted+Providers',
      color: '#FF9500'
    }
  ];

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

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Reset animations for new page
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Handle next page
  const handleNext = () => {
    if (currentPage < onboardingPages.length - 1) {
      handlePageChange(currentPage + 1);
    } else {
      onComplete();
    }
  };

  // Handle skip
  const handleSkip = () => {
    onComplete();
  };

  // Render page indicators
  const renderPageIndicators = () => (
    <View style={styles.pageIndicators}>
      {onboardingPages.map((_, index) => (
        <View
          key={index}
          style={[
            styles.indicator,
            {
              backgroundColor: index === currentPage 
                ? onboardingPages[currentPage].color 
                : colors.border
            }
          ]}
        />
      ))}
    </View>
  );

  // Render current page content
  const renderPageContent = () => {
    const page = onboardingPages[currentPage];
    
    return (
      <Animated.View
        style={[
          styles.pageContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Page Icon */}
        <View style={[styles.iconContainer, { backgroundColor: page.color + '20' }]}>
          <Text style={styles.iconText}>{page.icon}</Text>
        </View>

        {/* Page Image */}
        <View style={styles.imageContainer}>
          <View style={[styles.imagePlaceholder, { backgroundColor: page.color + '20' }]}>
            <Text style={styles.imageText}>{page.icon}</Text>
          </View>
        </View>

        {/* Page Text Content */}
        <View style={styles.textContent}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>
            {page.title}
          </Text>
          <Text style={[styles.pageSubtitle, { color: page.color }]}>
            {page.subtitle}
          </Text>
          <Text style={[styles.pageDescription, { color: colors.textSecondary }]}>
            {page.description}
          </Text>
        </View>
      </Animated.View>
    );
  };

  // Render action buttons
  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      {currentPage < onboardingPages.length - 1 ? (
        <>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>
              Skip
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: onboardingPages[currentPage].color }]}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={[styles.getStartedButton, { backgroundColor: onboardingPages[currentPage].color }]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedButtonText}>Get Started</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      {/* Skip button (top right) */}
      <TouchableOpacity
        style={styles.topSkipButton}
        onPress={handleSkip}
        activeOpacity={0.7}
      >
        <Text style={[styles.topSkipText, { color: colors.textSecondary }]}>
          Skip
        </Text>
      </TouchableOpacity>

      {/* Page Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderPageContent()}
      </ScrollView>

      {/* Page Indicators */}
      {renderPageIndicators()}

      {/* Action Buttons */}
      {renderActionButtons()}
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topSkipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  topSkipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  pageContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  iconText: {
    fontSize: 60,
  },
  imageContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: width * 0.8,
    height: 200,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    fontSize: 80,
    opacity: 0.3,
  },
  textContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  pageSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  pageDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  pageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
  },
  nextButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  getStartedButton: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
  },
  getStartedButtonText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

module.exports = OnboardingScreen;
