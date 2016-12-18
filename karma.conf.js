var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var WebpackCleanupPlugin = require("webpack-cleanup-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require("path");

module.exports = function(config) {
    config.set({

        browsers: [process.env.CONTINUOUS_INTEGRATION
                ? 'Firefox'
                : 'Chrome'],
        reporters: ['mocha'],
        singleRun: true,

        frameworks: ['mocha'],

        files: ['tests.webpack.js'],

        preprocessors: {
            'tests.webpack.js': ['webpack', 'sourcemap']
        },

        webpack: {
            devtool: 'inline-source-map',
            plugins: [
                new ExtractTextPlugin("styles_[hash:6].css", {allChunks: false}),
            ],
            externals: {
                'cheerio': 'window',
                'react/addons': true,
                'react/lib/ExecutionEnvironment': true,
                'react/lib/ReactContext': true
            },
            module: {
                loaders: [
                    {
                        test: /\.jsx?$/,
                        exclude: /(node_modules|bower_components)/,
                        loader: 'babel-loader',
                        query: {
                            presets: [
                                'react', 'es2015', 'stage-0'
                            ],
                            plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties']
                        }
                    }, {
                        test: /\.css$/,
                        loader: "style-loader!css-loader"
                    }, {
                        test: /\.json$/,
                        loader: "file-loader?name=[name]_[hash:6].[ext]"
                    }, {
                        test: /\.md$/,
                        loader: "html!markdown"
                    }, {
                        test: /\.styl$/,
                        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader')
                    }
                ]
            }
        },

        webpackServer: {
            noInfo: true
        }

    });
};
