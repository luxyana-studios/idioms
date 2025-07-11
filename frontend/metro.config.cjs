const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Web-specific resolver configuration
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = withNativeWind(config, { input: './app/globals.css' });
