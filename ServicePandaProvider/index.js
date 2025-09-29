import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

console.log('🚨 INDEX.JS LOADING - IMMEDIATE ONESIGNAL TEST');

// OneSignal Emergency Initialization with DEBUG logging
try {
  const OneSignal = require('react-native-onesignal');
  console.log('✅ OneSignal imported in index.js:', typeof OneSignal);
  
  // Enable MAXIMUM DEBUG logging as recommended by OneSignal Support
  if (OneSignal && OneSignal.Debug && OneSignal.Debug.setLogLevel) {
    OneSignal.Debug.setLogLevel(6); // VERBOSE logging (OneSignal v5)
    console.log('🔍 OneSignal DEBUG logging enabled (VERBOSE v5)');
  } else if (OneSignal && OneSignal.OneSignal && OneSignal.OneSignal.Debug) {
    OneSignal.OneSignal.Debug.setLogLevel(6); // VERBOSE logging (nested OneSignal v5)
    console.log('🔍 OneSignal nested DEBUG logging enabled (VERBOSE v5)');
  } else if (OneSignal && OneSignal.setLogLevel) {
    OneSignal.setLogLevel(6, 6); // DEBUG level for both console and visual (v4 fallback)
    console.log('🔍 OneSignal DEBUG logging enabled (v4 fallback)');
  } else {
    console.log('❌ OneSignal DEBUG logging not available - check SDK version');
  }
  
  if (OneSignal && OneSignal.OneSignal && OneSignal.OneSignal.setAppId) {
    // OneSignal v5 API - nested object
    OneSignal.OneSignal.setAppId('a3f5070d-9c46-44cd-8b0a-259df155ae94');
    console.log('🎉 OneSignal.OneSignal.setAppId SUCCESS (v5) in index.js!');
    console.log('📱 App ID:', 'a3f5070d-9c46-44cd-8b0a-259df155ae94');
  } else if (OneSignal && OneSignal.setAppId) {
    // OneSignal v5 API direct
    OneSignal.setAppId('a3f5070d-9c46-44cd-8b0a-259df155ae94');
    console.log('🎉 OneSignal.setAppId SUCCESS (v5) in index.js!');
    console.log('📱 App ID:', 'a3f5070d-9c46-44cd-8b0a-259df155ae94');
  } else if (OneSignal && OneSignal.initialize) {
    // OneSignal v4 API fallback
    OneSignal.initialize('a3f5070d-9c46-44cd-8b0a-259df155ae94');
    console.log('🎉 OneSignal.initialize SUCCESS (v4) in index.js!');
    console.log('📱 App ID:', 'a3f5070d-9c46-44cd-8b0a-259df155ae94');
  } else {
    console.log('❌ OneSignal methods not found in index.js');
    console.log('🔍 Available methods:', Object.keys(OneSignal || {}));
    if (OneSignal && OneSignal.OneSignal) {
      console.log('🔍 OneSignal.OneSignal methods:', Object.keys(OneSignal.OneSignal || {}));
    }
  }
} catch (error) {
  console.log('❌ OneSignal failed in index.js:', error);
}

AppRegistry.registerComponent(appName, () => App);