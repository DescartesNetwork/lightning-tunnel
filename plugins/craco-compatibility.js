/**
 * Maintain Webpack 5 compatibility
 */
const path = require('path')
const webpack = require('webpack')

const overrideWebpackConfig = ({ context, webpackConfig, pluginOptions }) => {
  // Add buffer to Webpack 5 polyfill
  // https://github.com/diegomura/react-pdf/issues/1029
  webpackConfig.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  )
  // Add polyfill libraries
  webpackConfig.resolve.fallback = {
    // For IPFS
    util: require.resolve('util/'),
    // For WASM
    stream: require.resolve('stream-browserify'),
    // For Ethereum Web3
    assert: require.resolve('assert/'),
    os: require.resolve('os-browserify/browser'),
    http: require.resolve('stream-http'),
    crypto: require.resolve('crypto-browserify'),
    https: require.resolve('https-browserify'),
    path: require.resolve('path-browserify'),
    url: require.resolve('url/'),
    fs: false,
    // For Jupiter Aggregator
    process: require.resolve('process/browser'),
  }
  // Fix unrecognized change / caching problem
  webpackConfig.cache.buildDependencies.config.push(
    path.join(context.paths.appPath, './craco.config.js'),
  )
  return webpackConfig
}

module.exports = { overrideWebpackConfig }
