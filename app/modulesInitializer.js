define(['moduleLoader'],
    function (moduleLoader) {

        "use strict";

        var modulesConfigs = [],
            modulesManager = {
                register: register,
                init: init
            };

        return modulesManager;

        function register(config) {
            if (_.isUndefined(config) || _.isNull(config)) {
                return;
            }

            if (!_.isObject(config)) {
                throw "Configuration parameter should be an object.";
            }

            modulesConfigs = config;
        }

        function init() {
            var moduleIds = _.keys(modulesConfigs);
            var modulesToLoad = [];

            for (var i = 0; i < moduleIds.length; i++) {
                var moduleId = moduleIds[i];
                if (_moduleHasToBeLoaded(moduleId, modulesConfigs[moduleId])) {
                    modulesToLoad.push(moduleId);
                }
            }

            var dfd = Q.defer();
            function loadModulesSequentially() {
                if (modulesToLoad.length == 0) {
                    dfd.resolve();
                    return;
                }


                var module = modulesToLoad.shift();
                moduleLoader.loadModule(module).then(onModuleLoaded).fail(onModuleLoadingFailed).then(function () {
                    loadModulesSequentially();
                });
            }

            loadModulesSequentially();
            return dfd.promise;
        }

        function onModuleLoaded(module) {
            return Q.fcall(function () {
                if (_.isFunction(module.initialize)) {
                    module.initialize(modulesConfigs[module.__moduleId__]);
                }
            });
        }

        function onModuleLoadingFailed(error) {
            throw 'Cannot load module"' + error.modulePath + '". because of next error "' + error.message + '".';
        }

        function _moduleHasToBeLoaded(moduleId, moduleConfig) {
            // if config is not defined, module will be skiped
            if (_.isUndefined(moduleConfig) || _.isNull(moduleConfig))
                return false;

            if (_.isBoolean(moduleConfig)) {
                return moduleConfig;
            }

            if (!_.isObject(moduleConfig)) {
                throw 'Configuration parameter for module  ' + moduleId + ' has to be an object or boolean.';
            }

            if (_.isBoolean(moduleConfig['enabled'])) {
                return moduleConfig['enabled'];
            }

            return true;
        }
    }
);