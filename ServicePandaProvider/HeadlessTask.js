import {AppRegistry} from 'react-native';
import BackgroundJob from './BackgroundJob';

// Register the headless task for background notifications
AppRegistry.registerHeadlessTask('ServicePandaNotifications', () => BackgroundJob);
