var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var _ = require('lodash');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var rename = require('gulp-rename');

var reload = browserSync.reload;


var config = {
  entryFile: './app/main.js',
  outputDir: './dist/',
  outputFile: 'app.js'
};

// BROWSERIFY INIT
var bundler;
function getBundler() {
  if (!bundler) {
    bundler = watchify(
        browserify(config.entryFile, _.extend({ debug: true }, watchify.args))
          .transform("babelify", {presets: ["es2015", "react"]})
      );
  }
  return bundler;
};

// TRIGGER BROWSERIFY
function bundle() {
  return getBundler()
    .bundle()
    .pipe(source(config.outputFile))
    .pipe(gulp.dest(config.outputDir))
    .pipe(reload({ stream: true }));
}

gulp.task('js', function() {
  return bundle();
});

// BUILD CSS
gulp.task('sass', function() {
  gulp.src('./app/styles/main.scss')
    .pipe(sass({includePaths: ['node_modules']}))
    .on('error', function(err) { console.log('Sass Error: ' + sass.logError); })
    .pipe(rename('app.css'))
    .pipe(gulp.dest(config.outputDir))
    .pipe(reload({ stream: true }));
});

// BUILD, SERVE, WATCH
gulp.task('watch', ['js', 'sass'], function() {

  browserSync({
    server: {
      baseDir: './'
    }
  });

  getBundler().on('update', function() {
    gulp.start('js')
  });

  gulp.watch('./app/styles/**/*.scss', function () {
    gulp.start('sass');
  });
});

// BUILD FOR PROD
gulp.task('build', ['js', 'sass']);

// WEB SERVER
gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: './'
    }
  });
});

gulp.task('default', ['watch']);
