import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

console.log('🚨 INDEX.JS LOADING - IMMEDIATE ONESIGNAL TEST');

// OneSignal Emergency Initialization
try {
  const OneSignal = require('react-native-onesignal');
  console.log('✅ OneSignal imported in index.js:', typeof OneSignal);
  
  if (OneSignal && OneSignal.initialize) {
    OneSignal.initialize('f64bf04a-b174-4862-a7b4-62b8d93f159b');
    console.log('🎉 OneSignal.initialize SUCCESS in index.js!');
  } else if (OneSignal && OneSignal.setAppId) {
    OneSignal.setAppId('f64bf04a-b174-4862-a7b4-62b8d93f159b');
    console.log('🎉 OneSignal.setAppId SUCCESS in index.js!');
  } else {
    console.log('❌ OneSignal methods not found in index.js');
  }
} catch (error) {
  console.log('❌ OneSignal failed in index.js:', error);
}

AppRegistry.registerComponent(appName, () => App);