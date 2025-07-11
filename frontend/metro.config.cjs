const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Web-specific resolver configuration
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native': 'react-native-web',
  // Replace the main tslib file with our simplified version
  'tslib/tslib.js': path.resolve(__dirname, 'tslib-simple.js'),
  tslib: path.resolve(__dirname, 'tslib-simple.js'),
};

// Add polyfills for web
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Transformer configuration for better web compatibility
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    ...config.transformer.minifierConfig,
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  },
};

// Add support for additional extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

// Additional resolver configuration for web compatibility
config.resolver.unstable_enableSymlinks = false;

module.exports = withNativeWind(config, { input: './app/globals.css' });
