var output = "./.output";

var
    gulp = require('gulp'),
    del = require('del'),
    minify = require('gulp-minify-css'),
    durandal = require('gulp-durandal'),
    concat = require('gulp-concat')
;

gulp.task('clean', function (cb) {
    del([output], cb);
});

gulp.task('application', ['clean'], function () {
    gulp.src('./index.html')
      .pipe(gulp.dest(output));

    gulp.src('./settings.js')
      .pipe(gulp.dest(output));

    gulp.src('./css/fonts/**')
      .pipe(gulp.dest(output + '/css/fonts'));

    gulp.src(['./css/styles.min.css', './css/jquery.mCustomScrollbar.min.css'])
        .pipe(minify({ keepBreaks: true }))
        .pipe(gulp.dest(output + '/css'));

    gulp.src('./js/vendor.min.js')
     .pipe(gulp.dest(output + '/js'));
    gulp.src('./js/require.js')
      .pipe(gulp.dest(output + '/js'));

    durandal({
        baseDir: 'app',
        main: 'main.js',
        output: 'main.js',
        almond: false,
        minify: true,
        rjsConfigAdapter: function (config) {
            config.generateSourceMaps = false;
            return config;
        }
    }).pipe(gulp.dest(output + '/app'));
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



gulp.task('default', ['application', 'settings'], function () {

});