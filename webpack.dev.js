const path = require('path')

const merge = require('webpack-merge')

const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    host: '0.0.0.0',
    port: 3030,
    hot: true,
    inline: true,
    historyApiFallback: true,
    // public/ → /avatars; static/ → /static (logo, landing photos, fonts)
    contentBase: [
      path.join(__dirname, 'public'),
      path.join(__dirname, 'static'),
    ],
    contentBasePublicPath: ['/', '/static'],
    // https: {
    //   key: './cert/key.key',
    //   cert: './cert/cert.crt',
    //   passphrase: 'webpack-dev-server',
    //   requestCert: true,
    // },
  },
})
