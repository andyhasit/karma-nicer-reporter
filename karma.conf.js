// Karma configuration
// Generated on Tue Feb 02 2015 14:46:14 GMT+0000 (GMT Standard Time)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'example_tests/**/*.spec.js'
    ],
    exclude: [
    ],
    reporters: ['nicer'],
    /*
    nicerReporter settings (optional) here showing the default colors.
    Uses chalk (https://github.com/chalk/chalk)
    available colors: black  red  green  yellow  blue  magenta  cyan  white  gray
    */
    nicerReporter : {
      defaulColor: 'cyan',
      successColor: 'green',
      failColor: 'red',
      skipColor: 'yellow',
      errorLogColor: 'white'
    },
    proxies : {
    },
    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,
    autoWatch: false,
    browsers: ['PhantomJS'], //Chrome
    singleRun: true,
    concurrency: Infinity
  });
};
