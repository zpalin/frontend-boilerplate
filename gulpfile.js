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
  outputDir: './dist/',
  entryFile: './src/scripts/main.js',
  styleEntryFile: './src/styles/main.scss'
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
    .pipe(source('app.js'))
    .pipe(gulp.dest(config.outputDir + 'scripts/'))
    .pipe(reload({ stream: true }));
}

gulp.task('js', function() {
  return bundle();
});

// BUILD CSS
gulp.task('sass', function() {
  gulp.src(config.styleEntryFile)
    .pipe(sass({includePaths: ['node_modules']}))
    .on('error', function(err) { console.log('Sass Error: ' + sass.logError); })
    .pipe(rename('app.css'))
    .pipe(gulp.dest(config.outputDir + "styles/"))
    .pipe(reload({ stream: true }));
});

// MOVE HTML

gulp.task('html', function() {
  gulp.src('./src/index.html')
    .pipe(gulp.dest(config.outputDir))
    .pipe(reload({ stream: true }));
});

// BUILD, SERVE, WATCH
gulp.task('watch', ['js', 'sass', 'html'], function() {

  browserSync({
    server: {
      baseDir: config.outputDir
    }
  });

  getBundler().on('update', function() {
    gulp.start('js')
  });

  gulp.watch('./src/styles/**/*.scss', function () {
    gulp.start('sass');
  });

  gulp.watch('./src/index.html', function() {
    gulp.start('html');
  });
});

// BUILD FOR PROD
gulp.task('build', ['js', 'sass', 'html']);

// WEB SERVER
gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: config.outputDir
    }
  });
});

gulp.task('default', ['watch']);
