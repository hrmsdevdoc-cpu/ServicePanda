module.exports = {
  dependencies: {
    'react-native-onesignal': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-onesignal/android',
          packageImportPath: 'import com.onesignal.rnonesignalandroid.ReactNativeOneSignalPackage;',
        },
      },
    },
  },
};
