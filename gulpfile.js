var gulp        = require('gulp'),
    $           = require('gulp-load-plugins')(),
    fs          = require('fs'),
    browserSync = require('browser-sync'),
    pngquant    = require('imagemin-pngquant');


// Sassのタスク
gulp.task('sass', function () {

  return gulp.src(['./assets/scss/**/*.scss'])
    .pipe($.sass({
      errLogToConsole: true,
      outputStyle    : 'compressed',
      sourceComments : 'normal',
      includePaths   : [
        './assets/sass',
        './node_modules/bootstrap-sass/assets/stylesheets',
      ]
    }))
    .pipe(gulp.dest('./assets/css'));
});


// Image min
gulp.task('imagemin', function () {
  return gulp.src('./assets/img/src/**/*')
    .pipe($.imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use        : [pngquant()]
    }))
    .pipe(gulp.dest('./assets/img'));
});

// Jade
gulp.task('jade', function () {
  var list = fs.readdirSync('./assets/jade')
    .filter(function(file) {
      return /^[^_].*\.jade$/.test(file);
    }).map(function(f){
      return f.replace('.jade', '.html');
    });

  return gulp.src(['./assets/jade/**/*.jade', '!./assets/jade/**/_*.jade'])
    .pipe($.jade({
      pretty: true,
      locals: {
        list: list
      }
    }))
    .pipe(gulp.dest('.'));
});


// watch
gulp.task('watch', function () {
  // Make SASS
  gulp.watch('./assets/scss/**/*.scss', ['sass']);
  // Minify Image
  gulp.watch('./assets/img/src/**/*', ['imagemin']);
  // Build Jade
  gulp.watch('./assets/jade/**/*.jade', ['jade']);
  // Browser sync
  gulp.watch([
    './assets/css/**/*.css',
    './assets/img/**/*', '!./assets/img/src/**/*',
    './*.html'
  ], ['bs-reload']);
});

// Reload Browser sync
gulp.task('bs-reload', function () {
  browserSync.reload();
});


// BrowserSync
gulp.task('browser-sync', function () {
  browserSync({
    server     : {
      baseDir: "./"       //対象ディレクトリ
      , index: "index.html"      //インデックスファイル
    },
    reloadDelay: 500
  });
});

// Build
gulp.task('build', ['sass', 'imagemin', 'jade']);

// Default Tasks
gulp.task('default', ['browser-sync', 'watch']);
