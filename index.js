var chalk = require('chalk');

var NicerReporter = function (baseReporterDecorator, config, logger, helper, formatError) {
  baseReporterDecorator(this);

  this.adapters = [function(msg) {
    browserLog(msg);
  }];

  var basePath = config.protocol + '//' + config.hostname + ':' + config.port + '/base';
  var currentBrowserName, resultsForSuite, currentSpecName;
  var log = logger.create('reporter.logical');
  var browserCount = 0;
  var horizontalLine = '-----------------------------------------------------------------';
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

  function padCount(value) {
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
    print(horizontalLine);
    print('Summary for browser  --  ' + browser.name);
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
      write(padCount(success), successColor);
      write(' ');
      write(padCount(failed), failColor);
      write(' ');
      write(padCount(skipped), skipColor);
      write('  ');
      write(padCount(len));
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
    //if (!firstLinePrinted) {
      print(horizontalLine, errorLogColor);
      //firstLinePrinted = true;
    //}
    print('FAILURE IN: "' + result.suite + '"', errorLogColor);
    print('SPEC: "' + result.description + '"', errorLogColor);
    blank();
    printErrorLogs(result.log);
    blank();
  }

  function printErrorLogs(logs) {
    logs.forEach(function(log) {
      var logLines = log.split('\n');
      logLines.forEach(function(msg) {
        print(shortenLogMessage(msg, basePath), errorLogColor);
      });
    });
  }
  
  function shortenLogMessage(msg, basePath) {
    /* Expecting path to look like
      http://localhost:9876/base/tests/deleting-many-to-many.test.js?871a02c63bbc1acbfe689918bfaffcb82ecdc088:37:21
      or 
      http://localhost:9876/base/src/ManyToManyRelationship.js?b19291610ac5d92acd96633c9a68c9e8b82d3ade (line 145)
      But chrome wraps the whole thing in brackets.
      TODO: figure out how to unit test.
      */
    var msg = msg.trim();
    var indexOfBasePath = msg.indexOf(basePath);
    if (indexOfBasePath >= 0) {
      var partBeforeUrl = msg.slice(0, indexOfBasePath);
      var remainder = msg.slice(indexOfBasePath);
      var endOfUrl = regexIndexOf(remainder, /\W/g, remainder.indexOf('?') + 1);
      var url = remainder.slice(0, endOfUrl);
      var afterUrl = remainder.slice(endOfUrl + 1);
      return partBeforeUrl + '...' + extractFileFromUrl(url, basePath) + ' ' + afterUrl;
    } else {
      return msg;
    }
  }
  
  function regexIndexOf(str, regex, startpos) {
    var indexOf = str.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
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
    write('    PASS: ' + scores.success, successColor);
    write('    FAIL: ' + scores.failed, failColor);
    write('    SKIP: ' + scores.skipped, skipColor);
    write('    TOTAL: ' + scores.total + ' (time: ' + formatTimeInterval(scores.totalTime) + ')');
    blank();
  }
  
  // Copied from karma/lib/helpers 
  function formatTimeInterval (time) {
    var mins = Math.floor(time / 60000)
    var secs = (time - mins * 60000) / 1000
    var str = secs + (secs === 1 ? ' sec' : ' secs')
    if (mins) {
      str = mins + (mins === 1 ? ' min ' : ' mins ') + str
    }
    return str
  }

  function printFinalSummary() {
    blank();
    print(horizontalLine);
    var end = (browserCount == 1)? ' browser.' : ' browsers.';
    print('Finished running tests on ' + browserCount + end);
  }

}

NicerReporter.$inject = ['baseReporterDecorator', 'config', 'logger', 'helper', 'formatError']
module.exports = {
  'reporter:nicer': ['type', NicerReporter]
}

