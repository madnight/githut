import webpackConfig from './webpack.config.babel.js'
webpackConfig.entry = {}

module.exports = config => {
  config.set({
    browsers: [process.env.CONTINUOUS_INTEGRATION ? 'Firefox' : 'Chrome'],
    reporters: ['mocha'],
    singleRun: true,
    frameworks: ['mocha'],
    files: ['tests.webpack.js'],
    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true
    }
  })
}
