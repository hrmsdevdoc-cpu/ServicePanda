import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Simple app registration without Firebase for now
// Firebase background handlers will be added after proper linking

AppRegistry.registerComponent(appName, () => App);