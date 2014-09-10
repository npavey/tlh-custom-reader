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
    gulp.src('./css/img/**')
      .pipe(gulp.dest(output + '/css/img'));

    return gulp.src(['./css/styles.css'])
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


gulp.task('default', ['app', 'styles', 'vendor'], function () {
    gulp.src('./index.html')
      .pipe(gulp.dest(output));
});