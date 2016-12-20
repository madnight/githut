import wpConf from './webpack.config.babel.js'

wpConf.entry = {}

// filter out WebpackBrowserPlugin for tests
wpConf.plugins = wpConf.plugins.filter(e => e.options.port != "8080")

module.exports = config => {
  config.set({
    browsers: ['Chrome'],
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
  if (process.env.TRAVIS) {
    config.browsers = ['Chrome_travis_ci']
  }
}
