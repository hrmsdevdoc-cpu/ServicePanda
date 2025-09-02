const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
<<<<<<< HEAD
    ...getDefaultConfig(__dirname).resolver,
    alias: {
      '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime'),
    },
    assetExts: ['bin', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    sourceExts: ['js', 'json', 'ts', 'tsx', 'jsx'],
    platforms: ['android', 'ios', 'native', 'web'],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  serializer: {
    getModulesRunBeforeMainModule: () => [],
=======
    alias: {
      '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime'),
    },
>>>>>>> 085af7f9981a4f4c28bc1fde96eb87c8bbc41059
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);






