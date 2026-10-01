const webpack = require('webpack')
const { merge } = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')

const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    // Apollo Client (3.8+) checks globalThis.__DEV__, not NODE_ENV: without this the
    // production bundle runs Apollo's dev-mode checks and console hints.
    new webpack.DefinePlugin({ 'globalThis.__DEV__': JSON.stringify(false) }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: 'all',
      }),
    ],
  },
  performance: {
    // antd + Apollo exceed the 244 KiB hint; chunk sizes are tracked by hand.
    hints: false,
  },
})
