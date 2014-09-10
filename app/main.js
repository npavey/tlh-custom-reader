requirejs.config({
    paths: {
        'text': '../js/text',
        'durandal': '../js/durandal',
        'plugins': '../js/durandal/plugins'
    },
    urlArgs: 'v=' + Math.random()
});

define('knockout', function () { return window.ko; });
define('jquery', function () { return window.jQuery; });
define('Q', function () { return window.Q; });
define('_', function () { return window._; });

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'dataContext'],
    function (system, app, viewLocator, dataContext) {
        app.title = 'easygenerator';

        system.debug(true);

        app.configurePlugins({
            router: true
        });

        app.start().then(function () {
            return dataContext.initialize().then(function () {
                viewLocator.useConvention();
                app.setRoot('viewmodels/shell');
            });
        });
    });