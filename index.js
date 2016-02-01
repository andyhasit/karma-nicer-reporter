const chalk = require('chalk');

var NicerReporter = function (baseReporterDecorator, config, logger, helper, formatError) {
var log = logger.create('reporter.logical');
  
  var startPath = 'at ' + config.protocol + '//' + config.hostname + ':' + config.port + '/';
  var startPathLength = startPath.length;
  
  //Allow us to take parts from karma.conf.js logicalReporter section
  var reporterConfig = config.logicalReporter || {};
  var successColor = reporterConfig.successColor || 'green';
  var failColor = reporterConfig.failColor || 'red';
  var skipColor = reporterConfig.skipColor || 'yellow';
  var defaulColor = reporterConfig.defaulColor || 'cyan';
  var errorColor = reporterConfig.errorColor || 'white';
  /*
  black
  red
  green
  yellow
  blue (on Windows the bright version is used as normal blue is illegible)
  magenta
  cyan
  white
  gray
  */
  var groupedResults = {};
  var firstLinePrinted = false;
  
  baseReporterDecorator(this);

  this.adapters = [function(msg) {
    process.stdout.write.bind(process.stdout)(msg + "\r\n");
  }];
  
  function print(msg, color) {
    var color = color || defaulColor;
    console.log(chalk[color](msg));
  }
  
  function write(msg, color) {
    var color = color || defaulColor;
    process.stdout.write(chalk[color](msg));
  }
  
  this.onRunStart = function (browsers) {
  }

  this.onBrowserStart = function (browser) {
    //
    print('.');
    print('..');    
    print('... running KARMA (with karma-logical-reporter)');
  }
  
  function printErrorLog(log) {
    for (var i=0, len=log.length; i<len; i++) {
      var logLines = log[i].split('\n');
      for (var i=0, len=logLines.length; i<len; i++) {
        var msg = logLines[i].trim() ;
        
        if (msg.startsWith(startPath)) {
          msg = msg.substr(startPathLength);
          var break1 = msg.indexOf('?');
          var filePart = msg.slice(0, break1);
          var break2 = msg.indexOf(':');
          var lineNumber = msg.substr(break2);
          msg = 'at ' + filePart +  ' line: ' + lineNumber;
        }
        print(msg, errorColor);
      }
    }
  }
  
  this.onSpecComplete = function(browser, result) {
    var suite = result.suite;
    if (groupedResults[suite] === undefined) {
      groupedResults[suite] = [];
    }
    groupedResults[suite].push(result);
    if (!result.success) {
      print('  ');
      if (!firstLinePrinted) {
        print('-----------------------------------------------', failColor);
        print('  ');
        firstLinePrinted = true;
      }
      print('Failure at:', failColor);
      print('  SUITE: ' + result.suite, failColor);
      print('  TEST:  ' + result.description, failColor);
      print('  ');
      printErrorLog(result.log);
      print('  ');
      print('-----------------------------------------------', failColor);
    }
    
  };

  this.onBrowserComplete = function (browser) {
    print('');
    suiteNames = Object.keys(groupedResults);
    suiteNames.sort();
    for (var i=0, len=suiteNames.length; i<len; i++) {
      var suiteName = suiteNames[i];
      printSuite(suiteName, groupedResults[suiteName]);
    }
    printSummary(browser);
  };
  
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
    
    function z(value) {
      if (value == 0) {
        return ' .'
      } else {
        return String("  " + value).slice(-2)
      }
    };
    
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
  
  
  function printSummary(browser) {
    var scores = browser.lastResult;
    print(' ');
    print(browser.name);
    print(' ');
    //print('-------------------------------------');
    print('--------   Completed '  + scores.total + ' tests in ' + scores.totalTime + ' seconds   --------');
    //print('-------------'  + browser.name + '-------------');
    //print('Summary for ' + scores.total + ' tests in ' + scores.totalTime + ' seconds:');
    print('  ');
    write('          PASS: ' + scores.success, successColor);
    write('    FAIL: ' + scores.failed, failColor);
    write('    SKIP: ' + scores.skipped, skipColor);
    print('  ');
  }
  
  this.onRunComplete = function () {
    //
  }

}

NicerReporter.$inject = ['baseReporterDecorator', 'config', 'logger', 'helper', 'formatError']
module.exports = {
  'reporter:nicer': ['type', NicerReporter]
}

