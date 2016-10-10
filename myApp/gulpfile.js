var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var copy = require('gulp-contrib-copy');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
  sass: ['./scss/**/*.scss'],
  js: ['savingFood.js', 'src/**/*.js'],
  templates: ['src/**/*.tpl.html'],
  d3: ['vendor/d3/d3.min.js', 'vendor/nvd3/nv.d3.min.js','vendor/angular-nvd3/angular-nvd3.min.js'],
  css: ['vendor/nvd3/nv.d3.min.css']
};

gulp.task('default', ['scripts', 'templates','d3', 'vendorCSS', 'sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('scripts', function() {
  return gulp.src(paths.js)
    		.pipe(concat('app.js'))
    		.pipe(gulp.dest('www/js/'));
});

gulp.task('templates', function() {
    gulp.src(paths.templates)
        .pipe(copy())
        .pipe(gulp.dest('www/templates/'))
});

gulp.task('d3', function() {
    gulp.src(paths.d3)
        .pipe(copy())
        .pipe(gulp.dest('www/vendor/'))
});

gulp.task('vendorCSS', function() {
    gulp.src(paths.css)
        .pipe(copy())
        .pipe(gulp.dest('www/css/'))
});


gulp.task('watch', function() {
  gulp.watch([paths.sass, paths.js, paths.templates], ['scripts', 'templates','d3', 'vendorCSS','sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
