import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WebpackCleanupPlugin from 'webpack-cleanup-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import WebpackBrowserPlugin from 'webpack-browser-plugin'

import path from 'path'

const debug = process.env.NODE_ENV !== 'production'

module.exports = {
  context: path.join(__dirname, 'src'),
  devtool: debug ? 'source-map' : null,
  entry: './js/client.js',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: [
            'react-html-attrs',
            'add-module-exports',
            'transform-decorators-legacy',
            'transform-class-properties',
            'pipe-operator-curry'
          ]
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.json$/,
        loader: 'file-loader?name=[name]_[hash:6].[ext]'
      },
      {
        test: /\.md$/,
        loader: 'html!markdown'
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader')
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'client_[hash:6].min.js'
  },
  externals: {
    'materialize': 'materialize',
    'cheerio': 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  },
  plugins: [
    new ExtractTextPlugin('styles_[hash:6].css', { allChunks: false }),
    new webpack.ProvidePlugin({
           $: "jquery",
           jQuery: "jquery"
       }),
    new HtmlWebpackPlugin({
      title: 'GitHut 2.0'
    })
  ].concat(debug ?
  [
     new WebpackBrowserPlugin()
  ] : [
    new WebpackCleanupPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
      NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000})
  ])
}
