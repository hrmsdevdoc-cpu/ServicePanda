import { StyleSheet, Platform } from 'react-native';
import { normalizeWidth, normalizeHeight, normalizeFontSize, normalizeSpacing } from './scaling';

// Responsive style utilities
export const createResponsiveStyles = (styles) => {
  const responsiveStyles = {};
  
  Object.keys(styles).forEach(key => {
    const style = styles[key];
    const responsiveStyle = {};
    
    Object.keys(style).forEach(property => {
      const value = style[property];
      
      switch (property) {
        case 'width':
        case 'minWidth':
        case 'maxWidth':
          responsiveStyle[property] = normalizeWidth(value);
          break;
        case 'height':
        case 'minHeight':
        case 'maxHeight':
          responsiveStyle[property] = normalizeHeight(value);
          break;
        case 'fontSize':
          responsiveStyle[property] = normalizeFontSize(value);
          break;
        case 'padding':
        case 'paddingTop':
        case 'paddingBottom':
        case 'paddingLeft':
        case 'paddingRight':
        case 'paddingHorizontal':
        case 'paddingVertical':
        case 'margin':
        case 'marginTop':
        case 'marginBottom':
        case 'marginLeft':
        case 'marginRight':
        case 'marginHorizontal':
        case 'marginVertical':
          responsiveStyle[property] = normalizeSpacing(value);
          break;
        case 'borderRadius':
        case 'borderWidth':
          responsiveStyle[property] = normalizeWidth(value);
          break;
        default:
          responsiveStyle[property] = value;
      }
    });
    
    responsiveStyles[key] = responsiveStyle;
  });
  
  return StyleSheet.create(responsiveStyles);
};

// Common responsive dimensions
export const responsiveDimensions = {
  // Header heights
  headerHeight: normalizeHeight(60),
  statusBarHeight: Platform.OS === 'ios' ? normalizeHeight(44) : normalizeHeight(24),
  
  // Button dimensions
  buttonHeight: normalizeHeight(48),
  smallButtonHeight: normalizeHeight(36),
  largeButtonHeight: normalizeHeight(56),
  
  // Input dimensions
  inputHeight: normalizeHeight(48),
  inputPadding: normalizeSpacing(16),
  
  // Card dimensions
  cardPadding: normalizeSpacing(16),
  cardMargin: normalizeSpacing(12),
  cardBorderRadius: normalizeWidth(12),
  
  // Footer dimensions
  footerHeight: Platform.OS === 'ios' ? normalizeHeight(75) : normalizeHeight(65),
  tabHeight: Platform.OS === 'ios' ? normalizeHeight(70) : normalizeHeight(65),
  
  // Icon sizes
  iconSmall: normalizeWidth(16),
  iconMedium: normalizeWidth(24),
  iconLarge: normalizeWidth(32),
  iconXLarge: normalizeWidth(48),
  
  // Font sizes
  fontSizeSmall: normalizeFontSize(12),
  fontSizeMedium: normalizeFontSize(14),
  fontSizeLarge: normalizeFontSize(16),
  fontSizeXLarge: normalizeFontSize(18),
  fontSizeXXLarge: normalizeFontSize(20),
  fontSizeTitle: normalizeFontSize(24),
  fontSizeHeading: normalizeFontSize(28),
};
