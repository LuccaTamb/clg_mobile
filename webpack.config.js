const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      'react-native$': 'react-native-web',
      '@react-navigation/elements': '@react-navigation/elements/src',
      crypto: 'crypto-browserify',
    },
    fallback: {
      ...config.resolve.fallback,
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer/"),
    },
    extensions: [
      '.web.js',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ]
  };

  config.plugins = [
    ...config.plugins,
    new (require('webpack').ProvidePlugin)({
      Buffer: ['buffer', 'Buffer'],
    })
  ];

  return config;
};