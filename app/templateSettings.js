define([], function () {

    var defaultTemplateSetting = {
        logo: {
            url: "/css/img/reader.png"
        },
        languages: {
            selected: "en"
        },
        background: {
            image: {
                src: "/css/img/background.png",
                type: "fullscreen"
            }
        }
    };

    var templateSetting = {
        init: init
    };

    return templateSetting;

    function init(settings) {
        if (!settings.logo || !settings.logo.url) {
            _.extend(settings, { logo: defaultTemplateSetting.logo });
        }

        if (!settings.languages || !settings.languages.selected) {
            _.extend(settings, { languages: defaultTemplateSetting.languages });
        }

        if (!settings.background || !settings.background.image || !settings.background.image.src) {
            _.extend(settings, { background: defaultTemplateSetting.background });
        }

        _.extend(this, settings);

        return settings;
    }

});