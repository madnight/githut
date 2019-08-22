import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WebpackCleanupPlugin from 'webpack-cleanup-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import path from 'path'

const debug = process.env.NODE_ENV !== 'production'

module.exports = {
    context: path.join(__dirname, 'src'),
    devtool: debug ? 'source-map' : false,
    entry: './js/client.js',
    resolve: {
        alias: {
            jquery: "jquery/src/jquery"
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.md$/,
                loader: 'html-loader!markdown-loader'
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
            },
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
        new MiniCssExtractPlugin({
              // Options similar to the same options in webpackOptions.output
              // all options are optional
            filename: 'styles_[hash:6].csss',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new HtmlWebpackPlugin({
            title: 'GitHut 2.0'
        })
    ].concat(debug ? [ ] :
    [
        new WebpackCleanupPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000})
    ])
}
