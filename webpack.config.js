var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var stylus_plugin = require('stylus_plugin');
var path = require('path');

module.exports = {
  context: path.join(__dirname, "src"),
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./js/client.js",
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties']
        }
      },
      {test: /\.json$/, loader: "json"},
      {test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader'}
    ]
  },
  output: {
    path: path.join(__dirname, "src"),
    filename: "client.min.js"
  },
  stylus: {
    use: [stylus_plugin()]
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    new HtmlWebpackPlugin({
      title: 'GitHut 2.0',
      filename: 'src/index.ejs'
    })
   ]
};
