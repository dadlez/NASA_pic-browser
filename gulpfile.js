var gulp = require("gulp");
var sass = require("gulp-sass");
// Podlgląd w czasie rzeczywistym
var browserSync = require('browser-sync').create();
//Sourcemapa
var sourcemaps = require('gulp-sourcemaps');
//Autoprefixer -automatycznie dodaje prefixy (Bardzo ulatwia pracę - szczegolnie z flexboxem, ktory ma nieoczywiste prefixy)
var autoprefixer = require('gulp-autoprefixer');
//Te dwie paczki sprawią, że gulp watch i gulp-serve nie będzie się wywalał przy każdym błędzie
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');

//W terminalu doinstalowujemy kolejne wtyczki: npm install browser-sync gulp-autoprefixer gulp-plumber gulp-util --save-dev



gulp.task("sass", function() {
    return gulp.src("scss/main.scss")
        .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer({
            browsers: ['> 1%'], //największy zakres ['> 1%'] - więcej niż 99% procent przeglądarek
            cascade: false
        }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.stream());
});
//Jeśli potrzebujemy browser sync
// komenda gulp serve
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("scss/**/*.scss", ['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);
});
//Jesli wystaczy nam watch
//Komenda gulp watch
gulp.task("watch", function() {
    gulp.watch("scss/**/*.scss", ["sass"]);
});
