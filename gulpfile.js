var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify-es').default;
var gzip = require('gulp-gzip');
var imagemin = require('gulp-imagemin');
var imageResize = require('gulp-image-resize');
var webp = require('gulp-webp');

/**
 * MINIFY CSS
 */
gulp.task('styles', function () {
    gulp.src('./src/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('./src/css'));
});
gulp.task('watch-sass', function () {
    gulp.watch('./src/sass/*.scss ', ['styles']);
});

/**
 * MINIFY IMAGES
 */

// Images
gulp.task('build-images', () =>
    gulp.src('./src/img/*.jpg')
    .pipe(imageResize({
        width: 350,
        upscale: false,
    }))
    .pipe(imagemin({
        optimizationLevel: 6,
        progressive: true,
        interlaced: true
    }))
    .pipe(webp())
    .pipe(gulp.dest('./src/img'))
);
gulp.task('pipe-images', function () {
        gulp.src('./src/img/*.webp')
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('build-html', function () {
    gulp.src(['./src/index.html', './src/restaurant.html'])
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-css', function () {
    gulp.src('./src/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(gulp.dest('./dist/css'));
});

/**
 * MINIFY JAVASCRIPT FILES
 */
gulp.task("build-js", function () {
    gulp.src("./src/js/**/*.js")
        .pipe(uglify())
        .pipe(gulp.dest("./dist/js"));
    gulp.src("./src/sw.js")
        .pipe(uglify())
        .pipe(gulp.dest("./dist"));
    gulp.src('./src/manifest.json')
        .pipe(gulp.dest('./dist'));
});

/**
 * RUN ALL GULP COMMANDS WITH: gulp build
 */
gulp.task('build', ['build-images', 'pipe-images', 'build-html', 'build-css', 'build-js'])