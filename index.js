
var NicerReporter = function (baseReporterDecorator, config, logger, helper, formatError) {
  baseReporterDecorator(this);

  this.adapters = [function(msg) {
      process.stdout.write.bind(process.stdout)(msg + "\r\n");
  }];
  
  this.onRunStart = function (browsers) {
    this.write("IT'S ALIVE!");
  }
  
  this.onBrowserStart = function (browser) {
    //
    this.write("Running......");
  }

  this.specSuccess = function(browser, result) {
    //this.write(reporterConfig.successMsg)
  }
  
  this.specFailure = function(browser, result) {
    //this.write(reporterConfig.failureMsg)
  }

  this.onSpecComplete = function(browser, result) {
    this.write(result.description);
  }

  this.onRunComplete = function () {
    //Done
  }
  
}


NicerReporter.$inject = ['baseReporterDecorator', 'config', 'logger', 'helper', 'formatError']

// PUBLISH DI MODULE
module.exports = {
  'reporter:nicer': ['type', NicerReporter]
}

