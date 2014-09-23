var output = "./__output";

var
    gulp = require('gulp'),
    del = require('del'),
    minify = require('gulp-minify-css'),
    durandal = require('gulp-durandal')
;

gulp.task('clean', function (cb) {
    del(['./__output'], cb);
});

gulp.task('styles', ['clean'], function () {
    gulp.src('./css/fonts/**')
      .pipe(gulp.dest(output + '/css/fonts'));

    return gulp.src(['./css/styles.min.css'])
        .pipe(minify({ keepBreaks: true }))
        .pipe(gulp.dest(output + '/css'));
});

gulp.task('app', ['clean'], function () {
    return durandal({
        baseDir: 'app',
        main: 'main.js',
        output: 'main.js',
        almond: false,
        minify: true,
        verbose: false
    }).pipe(gulp.dest(output + '/app'));
});


gulp.task('vendor', ['clean'], function () {
    gulp.src('./js/vendor.min.js')
      .pipe(gulp.dest(output + '/js'));
    gulp.src('./js/require.js')
      .pipe(gulp.dest(output + '/js'));
});


gulp.task('settings', ['clean'], function () {
    gulp.src('./settings/js/vendor.min.js')
      .pipe(gulp.dest(output + '/settings/js'));
    gulp.src('./settings/js/settings.min.js')
      .pipe(gulp.dest(output + '/settings/js'));

    gulp.src('./settings/css/fonts/**')
      .pipe(gulp.dest(output + '/settings/css/fonts'));
    gulp.src('./settings/css/settings.min.css')
      .pipe(gulp.dest(output + '/settings/css'));

    gulp.src('./settings/settings.html')
      .pipe(gulp.dest(output + '/settings'));
});

gulp.task('default', ['app', 'styles', 'vendor', 'settings'], function () {
    gulp.src('./index.html')
      .pipe(gulp.dest(output));
});