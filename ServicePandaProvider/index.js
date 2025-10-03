import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

console.log('🚀 ServicePandaProvider App Starting...');

// Prevent OneSignal auto-initialization
// OneSignal will be initialized manually after user login
try {
  const OneSignal = require('react-native-onesignal');
  console.log('✅ OneSignal imported but NOT initialized - waiting for login');
  
  // Completely disable OneSignal auto-initialization
  // This prevents any automatic device creation
  if (OneSignal && OneSignal.Debug && OneSignal.Debug.setLogLevel) {
    OneSignal.Debug.setLogLevel(0); // Disable logging to prevent auto-init
  }
  
  // Don't call any initialization methods here
  // This prevents auto-creation of device entries
  
} catch (error) {
  console.log('❌ OneSignal import failed:', error);
}

AppRegistry.registerComponent(appName, () => App);