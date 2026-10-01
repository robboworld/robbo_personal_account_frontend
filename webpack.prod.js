const { merge } = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')

const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production',
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
