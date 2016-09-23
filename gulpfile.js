// General Deps ----------------------------------------------------------------

var gulp = require('gulp');
var gutil = require('gulp-util');
var del     = require('del');
var _ = require('lodash');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var plumber = require('gulp-plumber');
var historyApiFallback = require('connect-history-api-fallback')

// Script Deps -----------------------------------------------------------------

var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var buffer  = require('vinyl-buffer');
var source  = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');

// Style Deps ------------------------------------------------------------------

var sass = require('gulp-sass');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');

// File paths ------------------------------------------------------------------

var DIST_DIR = 'dist/';
var SCRIPTS_PATH = 'src/**/*.js';
var SCRIPT_ENTRY = 'src/index.js';
var STYLES_PATH = 'style/**/*.scss';
var STYLE_ENTRY = 'style/main.scss';
var IMAGES_PATH = 'images/**/*.{png,jpeg,jpg,gif,svg}';
var STATIC_DIR = 'static/**/*';

// Error Handler ---------------------------------------------------------------

function handleErrors(err) {
  gutil.log('Error: ' + err.message);
  this.emit('end');
}

// Browserify ------------------------------------------------------------------
console.log(process.env.NODE_ENV);
var babelOpts = {
  compact: true
};

var debug = (process.env.NODE_ENV !== 'production');
var opts = {
  sourceMaps: debug,
  debug: debug
};

opts = _.assign({}, opts, watchify.args);
var b = watchify(browserify(SCRIPT_ENTRY, opts));
b.transform(babelify.configure(babelOpts));

if(process.env.NODE_ENV === 'production') {
  console.log('Uglyfying...');
  b.transform({
    global: true
  }, 'uglifyify');
}


// Build Scripts ---------------------------------------------------------------

gulp.task('scripts', function () {
  if (debug) {
    return b.bundle()
      .on('error', handleErrors)
      .pipe(plumber())
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(DIST_DIR))
      .pipe(reload({ stream: true }));
  } else {
    return b.bundle()
      .on('error', handleErrors)
      .pipe(plumber())
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(gulp.dest(DIST_DIR))
      .pipe(reload({ stream: true }));
  }
});

// Build Styles ----------------------------------------------------------------

gulp.task('styles', function () {
  gulp.src(STYLE_ENTRY)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['node_modules']
    }))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(rename('app.css'))
    .pipe(gulp.dest(DIST_DIR))
    .pipe(browserSync.stream());
});

// Move Static -----------------------------------------------------------------

gulp.task('static', function () {
  gulp.src(STATIC_DIR)
    .pipe(gulp.dest(DIST_DIR))
    .pipe(reload({ stream: true }));
});

gulp.task('build', ['scripts', 'styles', 'static']);

// Clean -----------------------------------------------------------------------

gulp.task('clean', function () {
	return del.sync([
		DIST_DIR
	]);
});

// Watch -----------------------------------------------------------------------

gulp.task('watch', ['build'], function () {

  browserSync.init({
    server: {
      baseDir: DIST_DIR,
      middleware: [historyApiFallback()]
    }
  });

  b.on('update', function () {
    gulp.start('scripts');
  });

  gulp.watch(STYLES_PATH, function () {
    gulp.start('styles');
  });

  gulp.watch(STATIC_DIR, function () {
    gulp.start('static');
  });
});


gulp.task('default', ['build'], function () {
  process.exit(0);
});
