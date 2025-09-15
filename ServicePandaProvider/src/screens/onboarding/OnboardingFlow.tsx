const React = require('react');
const { useState, useEffect } = require('react');
const { View, StyleSheet } = require('react-native');
const AsyncStorage = require('@react-native-async-storage/async-storage').default;

const StartupScreen = require('./StartupScreen');
const OnboardingScreen = require('./OnboardingScreen');

const OnboardingFlow = ({ onComplete }) => {
  const [currentScreen, setCurrentScreen] = useState('startup');
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasSeen = await AsyncStorage.getItem('hasSeenOnboarding');
      if (hasSeen === 'true') {
        setHasSeenOnboarding(true);
        // Skip onboarding if user has already seen it
        onComplete();
      }
    } catch (error) {
      console.log('Error checking onboarding status:', error);
    }
  };

  const handleStartupComplete = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = async () => {
    try {
      // Mark onboarding as completed
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      setHasSeenOnboarding(true);
      onComplete();
    } catch (error) {
      console.log('Error saving onboarding status:', error);
      // Still complete even if saving fails
      onComplete();
    }
  };

  const handleSkipOnboarding = async () => {
    try {
      // Mark onboarding as completed even when skipped
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      setHasSeenOnboarding(true);
      onComplete();
    } catch (error) {
      console.log('Error saving onboarding status:', error);
      onComplete();
    }
  };

  // If user has already seen onboarding, don't show anything
  if (hasSeenOnboarding) {
    return null;
  }

  return (
    <View style={styles.container}>
      {currentScreen === 'startup' && (
        <StartupScreen onComplete={handleStartupComplete} />
      )}
      {currentScreen === 'onboarding' && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

module.exports = OnboardingFlow;
