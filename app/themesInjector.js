define(['templateSettings'], function (templateSettings) {
    "use strict";

    var themesInjector = {
        themesPath: 'css/themes',
        defaultThemeKey: 'black',

        init: init
    };

    return themesInjector;

    function init() {
        var
            selectedThemeKey = getSelectedThemeKey(),
            themePath = themesInjector.themesPath + '/' + selectedThemeKey + '.css';

        return injectStylesheetToDocument(themePath);
    }

    function getSelectedThemeKey() {
        var selectedThemeKey = getQueryStringParameterByName('theme');
        if (_.isEmpty(selectedThemeKey.trim())) {
            selectedThemeKey = (!!templateSettings.theme && !!templateSettings.theme.key) ? templateSettings.theme.key : themesInjector.defaultThemeKey;
        }

        return selectedThemeKey;
    }

    function injectStylesheetToDocument(url) {
        return $.get(url).then(function (cssText) {
            var style = $('<style>');
            style.attr('type', 'text/css');
            style.append(cssText);
            style.appendTo('head');
        });
    }

    function getQueryStringParameterByName(name) {
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

});