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

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'components/bootstrapper', 'dataContext', 'settingsReader', 'modulesInitializer'],
    function (system, app, viewLocator, bootstrapper, dataContext, settingsReader, modulesInitializer) {
        app.title = 'easygenerator';

        //system.debug(true);

        app.configurePlugins({
            router: true
        });

        var modules = [];

        app.start().then(function () {
            bootstrapper.run();

            return dataContext.initialize().then(function () {
                return readPublishSettings().then(function () {
                    modulesInitializer.register(modules);

                    viewLocator.useConvention();
                    app.setRoot('viewmodels/shell');
                });
            });
        });

        function readPublishSettings() {
            return settingsReader.readPublishSettings().then(function (settings) {
                _.each(settings.modules, function (module) {
                    modules['../includedModules/' + module.name] = true;
                });
            });
        }
    }
);