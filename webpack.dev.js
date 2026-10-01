const path = require('path')

const { merge } = require('webpack-merge')

const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 3030,
    hot: true,
    historyApiFallback: true,
    // public/ → /avatars; static/ → /static (logo, landing photos, fonts)
    static: [
      { directory: path.join(__dirname, 'public'), publicPath: '/' },
      { directory: path.join(__dirname, 'static'), publicPath: '/static' },
    ],
  },
})
