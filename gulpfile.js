var gulp = require('gulp');
var Server = require('karma').Server;

/**
 * Copy index.js to node_modules/karma-nicer-reporter so it is used as reporter.
 * By Karma. See README for details.
 */
gulp.task('copy_index', function() { 
  return gulp.src('index.js')
    .pipe(gulp.dest('node_modules/karma-nicer-reporter'));
});

/**
 * Run test once and exit.
 */
gulp.task('test', ['copy_index'], function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, 
  /*
  Note: I'm wrappin done() in a function to suppress an annoying error message.
  Don't do this if using CI as you rely on it feeding back the error code to
  indicate tests have failed.
  */
  function() { done(); }
  ).start();
});
