(function (app) {

    var currentSettings = null;

    var viewModel = {
        isError: ko.observable(false),

        languages: null
    };

    viewModel.getCurrentSettingsData = function (settings) {
        return $.extend({}, settings || currentSettings, {
            languages: viewModel.languages.getData()
        });
    };

    viewModel.saveChanges = function () {
        var settings = viewModel.getCurrentSettingsData(),
            newSettings = JSON.stringify(settings);

        if (JSON.stringify(currentSettings) === newSettings) {
            return;
        }

        window.egApi.saveConfigurationSettings(newSettings, app.localize('changes are saved'), app.localize('changes are not saved'))
            .done(function () {
                currentSettings = settings;
            });
    };

    viewModel.init = function () {
        var api = window.egApi;
        return api.init().then(function () {
            var manifest = api.getManifest(),
                settings = api.getConfigurationSettings();

            viewModel.languages = new app.LanguagesModel(manifest.languages, settings.languages);

            currentSettings = viewModel.getCurrentSettingsData(settings);
        }).fail(function () {
            viewModel.isError(true);
        });
    };

    viewModel.init().always(function () {
        $(document).ready(function () {
            ko.applyBindings(viewModel, $('.settings-container')[0]);
            $(window).on('blur', viewModel.saveChanges);
        });
    });

})(window.app = window.app || {});
