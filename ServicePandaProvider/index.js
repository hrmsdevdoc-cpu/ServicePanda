import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

console.log('🚀 ServicePandaProvider App Starting...');

// ✅ OneSignal is initialized NATIVELY in AppDelegate.mm (iOS)
// ✅ No JavaScript SDK needed - native initialization handles everything
console.log('🔔 OneSignal: Native-only mode (iOS)');
console.log('✅ OneSignal XCFramework initialized in AppDelegate.mm');
console.log('💡 Push notifications handled natively');

AppRegistry.registerComponent(appName, () => App);