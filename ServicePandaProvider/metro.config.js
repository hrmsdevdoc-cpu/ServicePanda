const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};
const config = {
  resolver: {
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
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);






