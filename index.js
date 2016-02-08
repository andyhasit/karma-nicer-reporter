const chalk = require('chalk');

var NicerReporter = function (baseReporterDecorator, config, logger, helper, formatError) {
  baseReporterDecorator(this);
  this.adapters = [function(msg) {
    process.stdout.write.bind(process.stdout)(msg + "\r\n");
  }];
  
  var log = logger.create('reporter.logical');
  var browserCount = 0;
  var horizontalLine = '-----------------------------------------------';
  var startPath = 'at ' + config.protocol + '//' + config.hostname + ':' + config.port + '/';
  var startPathLength = startPath.length;
  var resultsForSuite; // Set once per browser
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
  
  // Settings from karma.conf.js nicerReporter section
  // chalk colors: black  red  green  yellow  blue  magenta  cyan  white  gray
  
  var reporterConfig = config.nicerReporter || {};
  var successColor = reporterConfig.successColor || 'green';
  var failColor = reporterConfig.failColor || 'red';
  var skipColor = reporterConfig.skipColor || 'yellow';
  var defaulColor = reporterConfig.defaulColor || 'cyan';
  var errorColor = reporterConfig.errorColor || 'white';
  
  // Karma runner event listeners
  this.onBrowserStart = function (browsers) {
    resultsForSuite = {};
  };
  
  this.onRunStart = function (browsers) {
    print('.');
    print('..');    
    print('... running KARMA (with karma-nicer-reporter)');
  };
  
  this.onRunComplete = function () {
    print('Finished running tests on ' + browserCount + ' browsers');
    print('');
  };
  
  this.onSpecComplete = function(browser, result) {
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
    blank();
    suiteNames = Object.keys(resultsForSuite);
    suiteNames.sort();
    for (var i=0, len=suiteNames.length; i<len; i++) {
      var suiteName = suiteNames[i];
      printSuite(suiteName, resultsForSuite[suiteName]);
    }
    printSummary(browser);
  };
  
  // Worker functions
  
  function printSuite(suiteName, results) {
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
    

    
    function printHeader(outcome, color) {
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
      write(' suite > ', color);
      write(suiteName , color);
      write('\r\n');
    }
    if (failed == 0) {
      if (skipped == 0) {
        printHeader('PASSED', successColor);
      } else {
        printHeader('UNSURE', skipColor);
      }
    } else {
      printHeader('FAILED', failColor);
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
    logs.forEach(function(log) {
      var logLines = log.split('\n');
      logLines.forEach(function(msg) {
        var msg = msg.trim();
        if (msg.startsWith(startPath)) {
          msg = msg.substr(startPathLength);
          var break1 = msg.indexOf('?');
          var filePart = msg.slice(0, break1);
          var break2 = msg.indexOf(':');
          var lineNumber = msg.substr(break2);
          msg =  '  >>> ' + filePart +  ' line: ' + lineNumber;
        }
        print(msg, errorColor);
      });
    });
  }
  
  function printSummary(browser) {
    var scores = browser.lastResult;
    blank();
    print(browser.name);
    blank();
    print('--------   Completed '  + scores.total + ' tests in ' + scores.totalTime + ' seconds   --------');
    blank();
    write('          PASS: ' + scores.success, successColor);
    write('    FAIL: ' + scores.failed, failColor);
    write('    SKIP: ' + scores.skipped, skipColor);
    blank();
  }

}

NicerReporter.$inject = ['baseReporterDecorator', 'config', 'logger', 'helper', 'formatError']
module.exports = {
  'reporter:nicer': ['type', NicerReporter]
}

