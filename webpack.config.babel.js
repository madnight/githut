import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import WebpackCleanupPlugin from "webpack-cleanup-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');

import path from "path";

const debug = process.env.NODE_ENV !== "production";

module.exports = {
  context: path.join(__dirname, "src"),
  devtool: debug ? "source-map" : false,
  entry: "./js/client.js",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.md$/,
        loader: "html-loader!markdown-loader"
      },
      {
        test: /\.styl$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "stylus-loader"
          }
        ]
      }
    ]
  },
  output: {
    path: path.join(__dirname, "public"),
    filename: "[name].[hash].js",
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        default: false,
        vendors: false,
        highcharts: {
          test: /[\\/]node_modules[\\/]((highcharts).*)[\\/]/,
          name: "highcharts",
          chunks: "all",
          enforce: true
        },
        react: {
          test: /[\\/]node_modules[\\/]((react).*)[\\/]/,
          name: "react",
          chunks: "all",
          enforce: true
        },
        lodash: {
          test: /[\\/]node_modules[\\/]((lodash).*)[\\/]/,
          name: "lodash",
          chunks: "all",
          enforce: true
        },
        data: {
          test: /[\\/]src[\\/]((data).*)[\\/]/,
          name: "data",
          chunks: "all",
          enforce: true
        },
        common: {
          test: /[\\/]node_modules[\\/]((?!(react|highcharts)).*)[\\/]/,
          name: "common",
          chunks: "all",
          enforce: true
        }
      }
    }
  },
  externals: {
    materialize: "materialize",
    cheerio: "window",
    "react/addons": true,
    "react/lib/ExecutionEnvironment": true,
    "react/lib/ReactContext": true
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles_[hash:6].csss",
      ignoreOrder: false
    }),
    new HtmlWebpackPlugin({
      title: "GitHut 2.0"
    })
  ].concat(
    debug
      ? []
      : [
          new WebpackCleanupPlugin(),
          new webpack.DefinePlugin({
            "process.env": {
              NODE_ENV: JSON.stringify("production")
            }
          }),
          new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 10000 }),
          new HtmlBeautifyPlugin()
        ]
  )
};
