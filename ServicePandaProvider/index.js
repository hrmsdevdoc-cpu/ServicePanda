import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

console.log('🚀 ServicePandaProvider App Starting...');

// Simple OneSignal initialization
try {
  const OneSignal = require('react-native-onesignal');
  OneSignal.setAppId('a3f5070d-9c46-44cd-8b0a-259df155ae94');
  OneSignal.disablePush(false);
  console.log('✅ OneSignal ready for notifications');
} catch (error) {
  console.log('❌ OneSignal failed:', error);
}

AppRegistry.registerComponent(appName, () => App);