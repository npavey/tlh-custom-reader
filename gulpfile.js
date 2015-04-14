var output = "./.output";

var
    gulp = require('gulp'),
    del = require('del'),
    minify = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    durandal = require('gulp-durandal'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    useref = require('gulp-useref'),
    eventStream = require('event-stream'),
    buildVersion = +new Date();
;

var addBuildVersion = function () {
    var doReplace = function (file, callback) {
        var fileContent = String(file.contents);
        fileContent = fileContent
            .replace(/(\?|\&)v=([0-9]+)/gi, '')                                                                          // remove build version
            .replace(/\.(jpeg|jpg|png|gif|css|js|html|eot|svg|ttf|woff)([?])/gi, '.$1?v=' + buildVersion + '&')          // add build version to resource with existing query param
            .replace(/\.(jpeg|jpg|png|gif|css|js|html|eot|svg|ttf|woff)([\s\"\'\)])/gi, '.$1?v=' + buildVersion + '$2')  // add build version to resource without query param
            .replace(/urlArgs: 'v=buildVersion'/gi, 'urlArgs: \'v=' + buildVersion + '\'');                              // replace build version for require config
        file.contents = new Buffer(fileContent);
        callback(null, file);
    }
    return eventStream.map(doReplace);
};

gulp.task('clean', function (cb) {
    del([output], cb);
});

gulp.task('application', ['clean'], function () {
    var assets = useref.assets();

    gulp.src('./index.html')
      .pipe(assets)
      .pipe(gulpif('*.js', uglify()))
      .pipe(gulpif('*.css', minify()))
      .pipe(assets.restore())
      .pipe(useref())
      .pipe(addBuildVersion())
      .pipe(gulp.dest(output));

    gulp.src('./manifest.json')
      .pipe(gulp.dest(output));

    gulp.src(['./settings.js', './publishSettings.js'])
      .pipe(gulp.dest(output));

    gulp.src('./css/fonts/**')
      .pipe(gulp.dest(output + '/css/fonts'));

    gulp.src(['./css/styles.css', './css/jquery.mCustomScrollbar.min.css'])
        .pipe(addBuildVersion())
        .pipe(minify({ keepBreaks: true }))
        .pipe(gulp.dest(output + '/css'));

    gulp.src('./images/**')
      .pipe(gulp.dest(output + '/images'));

    gulp.src('./js/require.js')
      .pipe(uglify())
      .pipe(gulp.dest(output + '/js'));

    gulp.src('lang/*.json')
      .pipe(gulp.dest(output + '/lang'));

    return durandal({
        baseDir: 'app',
        main: 'main.js',
        output: 'main.js',
        almond: false,
        minify: true
    }).pipe(gulp.dest(output + '/app'));
});

gulp.task('settings', ['clean'], function () {
    var assets = useref.assets();

    gulp.src('./settings/settings.html')
      .pipe(assets)
      .pipe(gulpif('*.js', uglify()))
      .pipe(gulpif('*.css', minify()))
      .pipe(assets.restore())
      .pipe(useref())
      .pipe(addBuildVersion())
      .pipe(gulp.dest(output + '/settings'));

    gulp.src('./settings/css/fonts/**')
      .pipe(gulp.dest(output + '/settings/css/fonts'));

    gulp.src('./settings/css/settings.css')
      .pipe(addBuildVersion())
      .pipe(minify())
      .pipe(gulp.dest(output + '/settings/css'));

    gulp.src('./settings/img/**')
     .pipe(gulp.dest(output + '/settings/img'));
});



gulp.task('build', ['application', 'settings'], function () {

});