var output = "./.output";

var
    gulp = require('gulp'),
    del = require('del'),
    
    less = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    
    uglify = require('gulp-uglify'),
    durandal = require('gulp-durandal'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    useref = require('gulp-useref'),
    bower = require('gulp-bower'),
    webserver = require('gulp-webserver'),
    eventStream = require('event-stream'),
    buildVersion = +new Date();

function addBuildVersion() {
    return eventStream.map(function (file, callback) {
		var filePath = file.history[0];
        if (filePath && filePath.match(/\.(js)$/gi)) {
            callback(null, file);
            return;
        }
        var fileContent = String(file.contents);
        fileContent = fileContent
            .replace(/(\?|\&)v=([0-9]+)/gi, '') // remove build version
            .replace(/\.(jpeg|jpg|png|gif|css|js|html|eot|svg|ttf|woff)([?])/gi, '.$1?v=' + buildVersion + '&') // add build version to resource with existing query param
            .replace(/\.(jpeg|jpg|png|gif|css|js|html|eot|svg|ttf|woff)([\s\"\'\)])/gi, '.$1?v=' + buildVersion + '$2') // add build version to resource without query param
            .replace(/urlArgs: 'v=buildVersion'/gi, 'urlArgs: \'v=' + buildVersion + '\''); // replace build version for require config
        file.contents = new Buffer(fileContent);
        callback(null, file);
    });
};

function removeDebugBlocks() {
    return eventStream.map(function (file, callback) {
        var fileContent = String(file.contents);
        fileContent = fileContent
            .replace(/(\/\* DEBUG \*\/)([\s\S])*(\/\* END_DEBUG \*\/)/gmi, '') // remove all code between '/* DEBUG */' and '/* END_DEBUG */' comment tags
            .replace(/(\/\* RELEASE)|(END_RELEASE \*\/)/gmi, ''); // remove '/* RELEASE' and 'END_RELEASE */' tags to uncomment release code
        file.contents = new Buffer(fileContent);
        callback(null, file);
    });
};

gulp.task('watch', function () {
    gulp.run('css');
    gulp.watch('./css/**/*.less', ['css']);
});

gulp.task('build', ['pre-build', 'build-app', 'build-settings'], function () {
});

gulp.task('clean', function (cb) {
    del([output], cb);
});

gulp.task('bower', ['clean'], function () {
    return bower({ cmd: 'update' });
});

gulp.task('build-themes', ['bower'], function() {
    gulp.src('./css/themes/black.less')
        .pipe(less())
        .pipe(gulp.dest('./css/themes'));

    gulp.src('./css/themes/light.less')
        .pipe(less())
        .pipe(gulp.dest('./css/themes'));
});

gulp.task('css', ['clean', 'build-themes'], function () {
	return gulp.src(['./css/styles.less','./css/fonts.less'])
        .pipe(less())
        .pipe(gulp.dest('./css/'));
});

gulp.task('assets', ['clean', 'bower'], function () {
    gulp.src('vendor/easygenerator-plugins/dist/font/**')
        .pipe(gulp.dest(output + '/css/font'));
    gulp.src('vendor/easygenerator-plugins/dist/img/**')
        .pipe(gulp.dest(output + '/css/img'));
});

gulp.task('pre-build', ['clean', 'bower', 'css', 'assets'], function () {
});

gulp.task('build-app', ['pre-build'], function () {
    var assets = useref.assets();

    gulp.src('./css/font/*')
        .pipe(gulp.dest(output + '/css/font'));

    gulp.src('./index.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss({ keepBreaks: true })))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(addBuildVersion())
        .pipe(gulp.dest(output));

    gulp.src('./manifest.json')
        .pipe(gulp.dest(output));

    gulp.src(['./settings.js', './publishSettings.js'])
        .pipe(gulp.dest(output));

    gulp.src('./css/themes/*.css')
        .pipe(gulp.dest(output + '/css/themes'));

    gulp.src('./css/img/**')
        .pipe(gulp.dest(output + '/css/img'));

    gulp.src('./preview/**')
        .pipe(gulp.dest(output + '/preview'));

    gulp.src('./vendor/requirejs/require.js')
        .pipe(uglify())
        .pipe(gulp.dest(output + '/js'));

    gulp.src('lang/*.json')
        .pipe(gulp.dest(output + '/lang'));

    gulp.src('./css/fonts.css')
         .pipe(gulp.dest(output + '/css'));

    return durandal({
        baseDir: 'app',
        main: 'main.js',
        output: 'main.js',
        almond: false,
        minify: true
    }).pipe(gulp.dest(output + '/app'));

});

gulp.task('build-settings', ['build-design-settings', 'build-configure-settings'], function () {
    gulp.src('settings/api.js')
        .pipe(removeDebugBlocks())
        .pipe(uglify())
        .pipe(gulp.dest(output + '/settings'));

});

gulp.task('build-design-settings', ['pre-build'], function () {
    var assets = useref.assets();

    gulp.src(['settings/design/branding.html', 'settings/design/layout.html'])
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(addBuildVersion())
        .pipe(gulp.dest(output + '/settings/design'));

    gulp.src('settings/design/css/fonts/**')
        .pipe(gulp.dest(output + '/settings/design/css/fonts'));

    gulp.src('settings/design/css/design.css')
        .pipe(minifyCss())
        .pipe(gulp.dest(output + '/settings/design/css'));

});

gulp.task('build-configure-settings', ['pre-build'], function () {
    var assets = useref.assets();

    gulp.src(['settings/configure/configure.html'])
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(addBuildVersion())
        .pipe(gulp.dest(output + '/settings/configure'));

    gulp.src('settings/configure/img/**')
        .pipe(gulp.dest(output + '/settings/configure/img'));

    gulp.src('settings/configure/css/img/**')
        .pipe(gulp.dest(output + '/settings/configure/css/img'));

    gulp.src('settings/configure/css/fonts/**')
        .pipe(gulp.dest(output + '/settings/configure/css/fonts'));

    gulp.src('settings/configure/css/configure.css')
        .pipe(minifyCss())
        .pipe(gulp.dest(output + '/settings/configure/css'));

});

gulp.task('webserver', function () {
    gulp.src('.')
        .pipe(webserver({
            livereload: {
                enable: true,
                filter: function (fileName) {
                    return !fileName.match(/.css/);
                }
            },
            directoryListing: true,
            open: "index.html"
        }));
});