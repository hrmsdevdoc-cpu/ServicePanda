// import 'react-native-screens';

const {AppRegistry} = require('react-native');
const App = require('./App');

// Disable font scaling on Android to prevent zooming issues
if (require('react-native').Platform.OS === 'android') {
  require('react-native').Text.defaultProps = require('react-native').Text.defaultProps || {};
  require('react-native').Text.defaultProps.allowFontScaling = false;
}

AppRegistry.registerComponent('ServicePandaProvider', () => App);

