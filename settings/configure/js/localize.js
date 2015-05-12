(function (app) {

    app.localize = function (key) {
        return translations[key];
    };

    var translations = {
        'changes are saved': 'All changes are saved',
        'changes are not saved': 'Changes have NOT been saved. Please reload the page and change the settings again. Contact support@easygenerator.com if problem persists.',
        'settings are not initialize': 'Template settings are not initialized. Please reload the page and change the settings again. Contact support@easygenerator.com if problem persists.',

        //template language
        'template language': 'Template language',

        'xx': 'Custom',
        'en': 'English',
        'nl': 'Dutch',
        'ua': 'Ukrainian',

        'choose language for your course': 'Choose language for your course',
        'defaultText': 'Default',
        'translation': 'Translation'
    };

})(window.app = window.app || {});
