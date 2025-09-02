const { MD3LightTheme: DefaultTheme } = require('react-native-paper');

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3b82f6', // Blue-500 to match web design
    primaryContainer: '#dbeafe',
    secondary: '#2563eb', // Blue-600
    secondaryContainer: '#dbeafe',
    tertiary: '#059669', // Green-600
    tertiaryContainer: '#d1fae5',
    surface: '#ffffff',
    surfaceVariant: '#f3f4f6',
    background: '#fafafa',
    error: '#dc2626',
    errorContainer: '#fef2f2',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onSurface: '#111827',
    onSurfaceVariant: '#6b7280',
    outline: '#d1d5db',
  },
};

const colors = {
  primary: '#3b82f6', // Blue-500 to match web design
  secondary: '#2563eb', // Blue-600
  success: '#059669', // Green-600
  warning: '#d97706', // Orange-500
  error: '#dc2626', // Red-600
  info: '#3b82f6', // Blue-500 for info
  background: '#fafafa',
  surface: '#ffffff',
  white: '#ffffff',
  text: '#111827', // Dark gray
  textSecondary: '#6b7280', // Medium gray
  textTertiary: '#9ca3af', // Light gray
  border: '#d1d5db', // Light gray
  borderLight: '#e5e7eb', // Very light gray
  // Additional colors for registration components
  primaryLight: '#dbeafe', // Light blue background
  successLight: '#d1fae5', // Light green background
  infoLight: '#dbeafe', // Light blue background
};

module.exports = { theme, colors };

