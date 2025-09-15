import { Dimensions, PixelRatio, Platform } from 'react-native';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions for scaling (iPhone 12 Pro dimensions as reference)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

// Calculate scale factors
const widthScale = SCREEN_WIDTH / BASE_WIDTH;
const heightScale = SCREEN_HEIGHT / BASE_HEIGHT;

// Function to normalize width
export const normalizeWidth = (size) => {
  const newSize = size * widthScale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

// Function to normalize height
export const normalizeHeight = (size) => {
  const newSize = size * heightScale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

// Function to normalize font size
export const normalizeFontSize = (size) => {
  const scale = Math.min(widthScale, heightScale);
  const newSize = size * scale;
  
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    // For Android, apply additional scaling to prevent zooming
    return Math.round(PixelRatio.roundToNearestPixel(newSize * 0.9));
  }
};

// Function to get responsive dimensions
export const getResponsiveDimensions = () => {
  return {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    widthScale,
    heightScale,
    isSmallDevice: SCREEN_WIDTH < 375,
    isLargeDevice: SCREEN_WIDTH > 414,
  };
};

// Function to normalize padding/margin
export const normalizeSpacing = (size) => {
  const scale = Math.min(widthScale, heightScale);
  const newSize = size * scale;
  
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize * 0.95));
  }
};
