const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add reanimated support
config.resolver.alias = {
  ...config.resolver.alias,
};

module.exports = config;