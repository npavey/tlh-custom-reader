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
        var fullSettings = _.defaults(settings, defaultTemplateSetting);

        _.extend(this, fullSettings);

        return fullSettings;
    }

});