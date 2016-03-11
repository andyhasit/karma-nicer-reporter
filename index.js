const chalk = require('chalk');

var NicerReporter = function (baseReporterDecorator, config, logger, helper, formatError) {
  baseReporterDecorator(this);

  this.adapters = [function(msg) {
    browserLog(msg);
  }];

  var basePath = config.protocol + '//' + config.hostname + ':' + config.port + '/base';
  var currentBrowserName, resultsForSuite, currentSpecName;
  var log = logger.create('reporter.logical');
  var browserCount = 0;
  var horizontalLine = '-----------------------------------------------';
  var firstLinePrinted = false;

  // Utility functions

  function blank() {
    process.stdout.write("\r\n");
  }

  function print(msg, color) {
    var color = color || defaulColor;
    console.log(chalk[color](msg));
  }

  function write(msg, color) {
    var color = color || defaulColor;
    process.stdout.write(chalk[color](msg));
  }

  function z(value) {
    if (value == 0) {
      return ' .'
    } else {
      return String("  " + value).slice(-2)
    }
  };

  function browserLog(msg) {
    if (msg.startsWith(currentBrowserName)) {
      msg = msg.substr(currentBrowserName.length);
    }
    //print('Log during spec: ' + currentSpecName);
    print(msg);
  }

  // Settings from karma.conf.js nicerReporter section
  // chalk colors: black  red  green  yellow  blue  magenta  cyan  white  gray

  var reporterConfig = config.nicerReporter || {};
  var successColor = reporterConfig.successColor || 'green';
  var failColor = reporterConfig.failColor || 'red';
  var skipColor = reporterConfig.skipColor || 'yellow';
  var defaulColor = reporterConfig.defaulColor || 'cyan';
  var errorLogColor = reporterConfig.errorLogColor || 'white';

  // Karma runner event listeners
  this.onBrowserStart = function (browser) {
    currentBrowserName = browser.name;
    resultsForSuite = {};
  };

  this.onRunStart = function (browsers) {
    print('.');
    print('..');
    print('... running KARMA (with karma-nicer-reporter)');
    blank();
  };

  this.onRunComplete = function () {
    printFinalSummary();
  };

  this.onSpecComplete = function(browser, result) {
    currentSpecName = result.description;
    var suite = result.suite;
    if (resultsForSuite[suite] === undefined) {
      resultsForSuite[suite] = [];
    }
    resultsForSuite[suite].push(result);
    if (!result.success) {
      printSpecFailure(result);
    }
  };

  this.onBrowserComplete = function (browser) {
    browserCount ++;
    blank();
    suiteNames = Object.keys(resultsForSuite);
    suiteNames.sort();
    for (var i=0, len=suiteNames.length; i<len; i++) {
      var suiteName = suiteNames[i];
      printSuiteSummary(suiteName, resultsForSuite[suiteName]);
    }
    printBrowserSummary(browser);
  };

  // Worker functions

  function printSuiteSummary(suiteName, results) {
    function writeSummaryLine(outcome, color) {
      write(' ');
      write(z(success), successColor);
      write(' ');
      write(z(failed), failColor);
      write(' ');
      write(z(skipped), skipColor);
      write('  ');
      write(z(len));
      write('  ');
      write(outcome, color);
      write(' > ', color);
      write(suiteName , color);
      write('\r\n');
    }
    var failed = 0;
    var skipped = 0;
    var success = 0;
    var printList = [];
    for (var i=0, len=results.length; i<len; i++) {
      var result = results[i];
      var text = '   ' + result.description;
      if (result.skipped) {
        skipped += 1;
      } else if (result.success) {
        success += 1;
      } else {
        failed += 1;
      }
    }
    if (failed == 0) {
      if (skipped == 0) {
        writeSummaryLine('PASSED', successColor);
      } else {
        writeSummaryLine('UNSURE', skipColor);
      }
    } else {
      writeSummaryLine('FAILED', failColor);
    }
  };

  function printSpecFailure(result){
    blank();
    if (!firstLinePrinted) {
    print(horizontalLine, failColor);
    print('  ');
    firstLinePrinted = true;
    }
    print('Failure at:', failColor);
    print('  SUITE: ' + result.suite, failColor);
    print('  TEST:  ' + result.description, failColor);
    blank();
    printErrorLogs(result.log);
    blank();
    print(horizontalLine, failColor);
  }

  function printErrorLogs(logs) {
    //    varies per browser, this only works with PhantomJS 2
    logs.forEach(function(log) {
      var logLines = log.split('\n');
      logLines.forEach(function(msg) {
        print(msg);
        //msg could contain error or just path
        var msg = msg.trim();
        var indexOfBasePath = msg.indexOf(basePath);
        if (indexOfBasePath >= 0) {
          var partBeforeUrl = msg.slice(0, indexOfBasePath).trim();
          if (partBeforeUrl.length > 0) {
            print(partBeforeUrl, errorLogColor);
          }
          var remainder = msg.slice(indexOfBasePath);
          var firstSpaceInRemainder = remainder.indexOf(' ');
          var url = remainder.slice(0, firstSpaceInRemainder);
          var afterUrl = remainder.slice(firstSpaceInRemainder);
          print('...' + extractFileFromUrl(url, basePath) + ' ' + afterUrl, errorLogColor);
        } else {
          print(msg, errorLogColor);
        }
      });
      blank();
    });
    
  }
 
  function extractFileFromUrl(url, basePath) {
    var end = url.indexOf('?');
    if (end > 1) {
      return url.slice(basePath.length, end);
    }
    return url.slice(basePath.length);
  }
  
  function printBrowserSummary(browser) {
    var scores = browser.lastResult;
    blank();
    print('Summary for browser  --  ' + browser.name);
    //blank();
    //print('--------   Completed '  + scores.total + ' tests in ' + scores.totalTime + ' seconds   --------');
    blank();
    write('    PASS: ' + scores.success, successColor);
    write('    FAIL: ' + scores.failed, failColor);
    write('    SKIP: ' + scores.skipped, skipColor);
    write('    TOTAL: ' + scores.total + ' (time: ' + scores.totalTime + 'sec)');
    blank();
  }

  function printFinalSummary() {
    blank();
    print('-------');
    var end = (browserCount == 1)? ' browser.' : ' browsers.';
    print('Finished running tests on ' + browserCount + end);
  }

}

NicerReporter.$inject = ['baseReporterDecorator', 'config', 'logger', 'helper', 'formatError']
module.exports = {
  'reporter:nicer': ['type', NicerReporter]
}

