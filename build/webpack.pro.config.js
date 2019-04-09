const merge = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const baseConfig = require('./webpack.base.config.js')

const proConfig = {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, '../dist')
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: /node_modules/,
        loader: 'style!css'
      }
      // {
      //   test: /\.scss$/,
      //   use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader']
      // }
    ]
  },
  // devServer: {
  //   contentBase: path.join(__dirname, 'dist'),
  //   historyApiFallback: true,
  //   compress: true,
  //   hot: true,
  //   proxy: {
  //     '/api': {
  //       target: 'https://192.168.2.101:3001',
  //       pathRewrite: { '^/api': '' }
  //     }
  //   },
  //   host: '192.168.2.101',
  //   https: true,
  //   port: 9000
  // },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}

module.exports = merge(baseConfig, proConfig)
