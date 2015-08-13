requirejs.config({
    paths: {
        'text': '../vendor/requirejs-text/text',
        'durandal': '../vendor/durandal/js/',
        'plugins': '../vendor/durandal/js//plugins'
    },
    urlArgs: 'v=' + Math.random()
});

define('knockout', function () { return window.ko; });
define('jquery', function () { return window.jQuery; });
define('Q', function () { return window.Q; });
define('_', function () { return window._; });

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'components/bootstrapper', 'settingsReader', 'translation', 'templateSettings', 'modulesInitializer'],
    function (system, app, viewLocator, bootstrapper, settingsReader, translation, templateSettings, modulesInitializer) {
        app.title = 'easygenerator';

        //system.debug(true);

        app.configurePlugins({
            router: true
        });

        var modules = [];

        app.start().then(function () {
            bootstrapper.run();

            Q.fcall(function () {
                return readPublishSettings().then(function (publishSettings) {
                    initIncludedModules(publishSettings);
                });
            }).then(function () {
                return readTemplateSettings().then(function (settings) {
                    return initTranslations(settings);
                });
            }).then(function () {
                modulesInitializer.register(modules);

                viewLocator.useConvention();
                app.setRoot('viewmodels/shell');
            }).catch(function (e) {
                console.log(e);
            });

        });

        function readPublishSettings() {
            return settingsReader.readPublishSettings();
        }

        function initIncludedModules(publishSettings) {
            _.each(publishSettings.modules, function (module) {
                modules['../includedModules/' + module.name] = true;
            });
        }

        function readTemplateSettings() {
            return settingsReader.readTemplateSettings().then(function (settings) {
                return templateSettings.init(settings);
            });
        }

        function initTranslations(settings) {
            return translation.init(settings.languages.selected, settings.languages.customTranslations);
        }

    }
);