import wpConf from './webpack.config.babel.js'
import { initial } from 'lodash/fp'
wpConf.entry = {}

// filter out WebpackBrowserPlugin for tests
wpConf.plugins = wpConf.plugins | initial

module.exports = config => {
    config.set({
        browsers: ['Firefox'],
        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
        reporters: ['mocha'],
        singleRun: true,
        frameworks: ['mocha'],
        files: [
            'node_modules/babel-polyfill/dist/polyfill.js',
            'test/**/*.js'
        ],
        preprocessors: {
            'test/**/*.js': ['webpack'],
            'src/**/*.js': ['webpack']
        },
        webpack: wpConf,
        webpackServer: {
            noInfo: true
        }
    })
    if (process.env.TRAVIS)
        config.browsers = [
            // 'Chrome_travis_ci',
            // Chrome is atm buggy https://github.com/karma-runner/karma/issues/1656
            'Firefox']
    if (process.env['CHROME'])
        config.browsers = ['Chrome_travis_ci']
    if (process.env['BROWSERS'])
        config.browsers = ['Chrome', 'Firefox']
    if (process.env['LOOP'])
        config.singleRun = false
}
