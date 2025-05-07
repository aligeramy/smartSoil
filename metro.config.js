const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Make sure to keep ttf files in assetExts 
// (don't replace it, append to it)
config.resolver.assetExts.push('db');

module.exports = config; 