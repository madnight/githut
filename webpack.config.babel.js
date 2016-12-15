import webpack from "webpack"
import HtmlWebpackPlugin from "html-webpack-plugin"
import WebpackCleanupPlugin from "webpack-cleanup-plugin"
import ExtractTextPlugin from "extract-text-webpack-plugin"
import path from "path"

const debug = process.env.NODE_ENV !== "production"

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
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.json$/,
        loader: "file-loader?name=[name]_[hash:6].[ext]"
      },
      {
        test: /\.md$/,
        loader: "html!markdown"
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader')
      }
    ]
  },
  output: {
    path: path.join(__dirname, "public"),
    filename: "client_[hash:6].min.js"
  },
  plugins: [
    new ExtractTextPlugin("styles_[hash:6].css", { allChunks: false }),
    new HtmlWebpackPlugin({
      title: 'GitHut 2.0',
      template: 'index.ejs'
    })
  ].concat(debug ? [] : [
    new WebpackCleanupPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
  ])
};
