// Create config for Next.js/Vercel deployment
const withTM = require('next-transpile-modules')([
  '@expo/vector-icons',
  'react-native-vector-icons',
]);

module.exports = withTM({
  webpack: (config) => {
    // Add a loader for TTF files
    config.module.rules.push({
      test: /\.ttf$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[hash][ext][query]',
      },
    });
    
    // Add a loader for PNG files
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif|webp)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/images/[hash][ext][query]',
      },
    });
    
    return config;
  },
}); 