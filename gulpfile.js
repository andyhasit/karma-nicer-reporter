var gulp = require('gulp');


task = {
  name: 'scripts',
  start: 'src/module.js',
  sources: 'src/**/*.js',
  dest: 'dist',
  outFile: 'relate.min.js'
}

gulp.task('copy_index', function() { 
  return gulp.src('index.js')
    .pipe(gulp.dest('node_modules/karma-nicer-reporter'));
});


var Server = require('karma').Server;

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function() { done(); }).start();
});

gulp.task('test2', function (done) {
  karma.server.start({
    configFile: path.join(__dirname, '/../karma.conf.js'),
    singleRun: singleRun,
    autoWatch: !singleRun
  }, /* wrapping "done" in a function here */ function() { done(); });
});

function runTests (singleRun, done) {
  
}