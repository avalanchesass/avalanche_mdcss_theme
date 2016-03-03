/**
 * Configuration
 */
var config = {
  styles: {
    destination: 'assets',
    destinationFileName: 'style.css',
    watchDirectories: ['scss/**/*']
  },
  sassOptions: {
    precision: 7
  }
};

/**
 * Plugins
 */
var del          = require('del');
var eyeglass     = require('eyeglass');
var gulp         = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cssGlobbing  = require('gulp-css-globbing');
var rename       = require('gulp-rename');
var sass         = require('gulp-sass');

/**
 * Styles
 */
// Build css from scss source files.
gulp.task('styles:build', ['clean:styles'], function () {
  // Use the watch directories config variable to define the src directories.
  var srcDirectories = [];
  config.styles.watchDirectories.forEach(function (value) {
    srcDirectories.push(value + '.scss');
  });
  return gulp.src(srcDirectories)
    .pipe(cssGlobbing({
      extensions: ['.scss'],
      scssImportPath: {
        leading_underscore: false,
        filename_extension: false
      }
    }))
    .pipe(sass(eyeglass(config.sassOptions)).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(rename(config.styles.destinationFileName))
    .pipe(gulp.dest(config.styles.destination));
});

/**
 * Clean
 *
 * Remove compiled files before regenerating them.
 */
gulp.task('clean:styles', function () {
  return del([
    config.styles.destination + '/**/*.css'
  ]);
});

/**
 * Default task
 */
// Run this task with `gulp`.
gulp.task('default', function () {
  gulp.start('styles:build');
});
