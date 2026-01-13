const React = require('react');

// Light theme colors
const lightColors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  text: '#000000',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',
  border: '#E5E5EA',
  shadow: '#000000',
  cardBackground: '#FFFFFF',
  headerBackground: '#FFFFFF',
  footerBackground: '#FFFFFF',
  inputBackground: '#FFFFFF',
  buttonText: '#FFFFFF',
  toggleBackground: '#E5E5EA',
  toggleActive: '#007AFF',
};

// Dark theme colors
const darkColors = {
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#48484A',
  border: '#38383A',
  shadow: '#000000',
  cardBackground: '#2C2C2E',
  headerBackground: '#1C1C1E',
  footerBackground: '#1C1C1E',
  inputBackground: '#2C2C2E',
  buttonText: '#FFFFFF',
  toggleBackground: '#48484A',
  toggleActive: '#0A84FF',
};

const ThemeContext = React.createContext({
  isDarkMode: false,
  colors: lightColors,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const colors = isDarkMode ? darkColors : lightColors;

  const value = {
    isDarkMode,
    colors,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

module.exports = { ThemeProvider, useTheme };
