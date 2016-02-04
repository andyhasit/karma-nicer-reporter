// Karma configuration
// Generated on Tue Feb 02 2015 14:46:14 GMT+0000 (GMT Standard Time)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      //And your specs
      'tests/test-helpers.js',
      'tests/**/*.test.js'
    ],
    exclude: [
    ],
    reporters: ['nicer'],
    niceReporter : {
      successMsg: 'yay',
      failureMsg: 'nay',
    },
    proxies : {
    },
    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true,
    concurrency: Infinity
  });
};
