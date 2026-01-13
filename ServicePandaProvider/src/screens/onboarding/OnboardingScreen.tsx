const React = require('react');
const { useState, useRef } = require('react');
const {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar,
} = require('react-native');

const { width, height } = Dimensions.get('window');
const { colors } = require('../../utils/theme');

const OnboardingScreen = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef(null);

  const onboardingSlides = [
    {
      id: 1,
      title: 'Welcome to ServicePanda',
      subtitle: 'Your Professional Service Platform',
      description: 'Connect with customers and grow your business with our comprehensive service management platform.',
      image: '🏠', // You can replace with actual images
      backgroundColor: '#4A90E2',
    },
    {
      id: 2,
      title: 'Easy Registration',
      subtitle: 'Get Started in Minutes',
      description: 'Complete your profile, add your services, and start receiving leads from customers in your area.',
      image: '📝',
      backgroundColor: '#7ED321',
    },
    {
      id: 3,
      title: 'Manage Your Services',
      subtitle: 'Full Control at Your Fingertips',
      description: 'Set your service areas, manage bookings, track earnings, and communicate with customers seamlessly.',
      image: '⚙️',
      backgroundColor: '#F5A623',
    },
    {
      id: 4,
      title: 'Grow Your Business',
      subtitle: 'Reach More Customers',
      description: 'Access a network of customers looking for your services. Build your reputation and grow your business.',
      image: '📈',
      backgroundColor: '#BD10E0',
    },
  ];

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * width,
        animated: true,
      });
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  const renderSlide = (slide, index) => (
    <View key={slide.id} style={[styles.slide, { backgroundColor: slide.backgroundColor }]}>
      <View style={styles.slideContent}>
        <View style={styles.imageContainer}>
          <Text style={styles.slideImage}>{slide.image}</Text>
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.slideTitle}>{slide.title}</Text>
          <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
          <Text style={styles.slideDescription}>{slide.description}</Text>
        </View>
      </View>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {onboardingSlides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: index === currentSlide ? colors.white : 'rgba(255, 255, 255, 0.3)',
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={onboardingSlides[currentSlide].backgroundColor} />
      
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {onboardingSlides.map((slide, index) => renderSlide(slide, index))}
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {renderDots()}
        
        <View style={styles.buttonContainer}>
          {currentSlide < onboardingSlides.length - 1 ? (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.getStartedButton} onPress={handleNext}>
              <Text style={styles.getStartedButtonText}>Get Started</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  skipText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  imageContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  slideImage: {
    fontSize: 120,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    maxWidth: 300,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  slideSubtitle: {
    fontSize: 20,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  slideDescription: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  nextButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  getStartedButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  getStartedButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

module.exports = OnboardingScreen;
