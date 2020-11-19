var gulp = require('gulp');
var browsersync = require('browser-sync');
var useRef = require('gulp-useref');
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var uglifyCss = require('gulp-uglifycss');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');


// WordPress Setup
// gulp.task('browsersync', function() {
//   browsersync.init({
//     proxy: 'localhost:8888/xalamisco',
//     baseDir: './xalamisco'
//   });
// }); 

// HTML Setup
gulp.task('browsersync', function() {
  browsersync.init({
    server:{
      baseDir: 'app'
    }
  });
});

// WordPress Setup
// gulp.task('start', ['browsersync'], function(){
//   gulp.watch('./**/**.php', browsersync.reload )
//   gulp.watch('./sass/**/*.scss', ['sass'])
//   gulp.watch('./assets/js/custom.js', ['concat-min-js'], browsersync.reload)
//   gulp.watch('./**/**.php', browsersync.reload);
// });

// HTML Setup
gulp.task('start', ['browsersync'], function(){
  gulp.watch('app/*.html', browsersync.reload);
  gulp.watch('sass/**/*.scss', ['sass']); 
  gulp.watch('app/assets/css/*.css', browsersync.reload);
  gulp.watch('js/*.js', ['concat-min-js']);
});

gulp.task('build', function(){
  return gulp.src('./**.php')
  .pipe(useRef())
  .pipe(gulpif('*.js', uglify()))
  .pipe(gulpif('*.css', uglifyCss()))
  .pipe(gulp.dest('../new-theme'));
});

gulp.task('sass', function() { 
  return gulp.src('./sass/**/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(uglifyCss(['concat-min-css']))
    .pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
        }))
    .pipe(gulpif('./assets/css/*.css', uglifyCss()))
    .pipe(gulp.dest('app/assets/css/'))
    .pipe(browsersync.reload({stream: true}));
});


gulp.task('concat-min-js', function() {
  return gulp.src('js/*.js')
    .pipe(concat('app.js'))
    .pipe(uglify('js/*.js'))
    .pipe(gulp.dest('app/assets/js/'))
    .pipe(browsersync.reload({stream: true}));
});

gulp.task('concat-min-css', function() {
  return gulp.src('/sass/*.scss')
    .pipe(concat('app.css'))
    .pipe(uglifyCss('./assets/css/*.css'))
    .pipe(gulp.dest('./assets/css/'));
});

gulp.task('concat-min', ['concat-min-js', 'concat-min-css', 'build', 'sass', 'start']);