const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Customize the config before returning it.
  
  // Add rule for vector icons
  config.module.rules.push({
    test: /\.ttf$/,
    loader: "url-loader", // or directly file-loader
    include: [
      path.resolve(__dirname, "node_modules/@expo/vector-icons"),
      path.resolve(__dirname, "node_modules/react-native-vector-icons"),
    ],
  });

  // Add alias for react-native-vector-icons
  if (!config.resolve.alias) {
    config.resolve.alias = {};
  }

  Object.assign(config.resolve.alias, {
    'react-native-vector-icons': 'react-native-vector-icons/dist/cjs'
  });

  return config;
}; 