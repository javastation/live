const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const baseConfig = {
  /* 入口 */
  entry: {
    app: ['react-hot-loader/patch', path.join(__dirname, '../src/index.jsx')],
    vendor: ['react', 'react-router-dom', 'redux', 'react-dom', 'react-redux'] // 把react等库生成打包到vendor.hash.js里面去。
  },
  /* 输出到build文件夹，输出文件名字为[name].[chunkhash].js */
  output: {
    path: path.join(__dirname, './build'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      page: path.resolve(__dirname, '../src/pages'),
      'react-dom': '@hot-loader/react-dom'
    },
    extensions: [".ts", ".tsx", '.js', '.jsx',]
  },
  /* src文件夹下面的以.js结尾的文件，要使用babel解析 */
  /* cacheDirectory是用来缓存编译结果，下次编译加速 */
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          },
          'react-hot-loader/webpack'
        ],
        include: path.join(__dirname, '../src'),
        exclude: /node_modules/
      },
      { test: /\.tsx?$/, loader: 'ts-loader' },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192 // 小于等于8K的图片会被转成base64编码，直接插入HTML中，减少HTTP请求。
            }
          }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        common: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          name: 'common'
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 每次自动把js插入到模板index.html里面去
      filename: 'index.html',
      template: path.join(__dirname, '../index.html')
    }),
    new webpack.HashedModuleIdsPlugin()
  ],
}

module.exports = baseConfig
