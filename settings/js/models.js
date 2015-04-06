(function (app) {
    app.LogoModel = LogoModel;
    app.LanguagesModel = LanguagesModel;
    app.LanguageModel = LanguageModel;

    function LogoModel(logoSettings) {
        var that = this;

        that.url = ko.observable('');
        that.hasLogo = ko.computed(function () {
            return that.url() !== '';
        });
        that.clear = function () {
            that.url('');
        };
        that.isError = ko.observable(false);
        that.errorText = ko.observable('');
        that.errorDescription = ko.observable('');
        that.isLoading = ko.observable(false);

        that.setDefaultStatus = setDefaultStatus;
        that.setFailedStatus = setFailedStatus;
        that.setLoadingStatus = setLoadingStatus;
        that.setUrl = setUrl;
        that.getData = getData;

        init(logoSettings);

        return that;

        function init(logoSettings) {
            if (!logoSettings) {
                return;
            }

            that.setUrl(logoSettings.url);
        }

        function setDefaultStatus() {
            that.isLoading(false);
            that.isError(false);
        }

        function setFailedStatus(reasonTitle, reasonDescription) {
            that.clear();
            that.isLoading(false);
            that.errorText(reasonTitle);
            that.errorDescription(reasonDescription);
            that.isError(true);
        }

        function setLoadingStatus() {
            that.isLoading(true);
        }

        function setUrl(url) {
            that.url(url || '');
        }

        function getData() {
            return {
                url: that.url()
            };
        }
    }

    function LanguagesModel(languages, languagesSettings) {
        var that = this;

        var customLanguageCode = 'xx';
        var defaultLanguageCode = 'en';

        that.languages = [];

        var _selectedLanguageCode = ko.observable((languagesSettings && languagesSettings.selected) ? languagesSettings.selected : null);
        that.selectedLanguageCode = ko.pureComputed({
            read: function () {
                return _selectedLanguageCode();
            },
            write: function (value) {
                var language = getLanguage(value);

                if (!language) {
                    return;
                }

                if (language.isLoaded) {
                    _selectedLanguageCode(value);
                    return;
                }

                that.isLanguageLoading(true);
                language.load().done(function () {
                    _selectedLanguageCode(value);
                    that.isLanguageLoading(false);
                });
            }
        });
        that.selectedLanguageTranslations = ko.pureComputed(function () {
            var language = getLanguage(that.selectedLanguageCode());
            return language ? language.getTranslations() : null;
        });

        that.isLanguageLoading = ko.observable(false);

        that.isLanguageEditable = isLanguageEditable;
        that.getCustomTranslations = getCustomTranslations;

        that.getData = getData;

        init(languages, languagesSettings);

        return that;

        function init(languages, languagesSettings) {
            ko.utils.arrayForEach(languages || [], function (language) {
                addLanguage(new app.LanguageModel(language.code, app.localize(language.code), language.url));
            });

            var defaultLanguage = getLanguage(defaultLanguageCode);
            var customLanguage = new app.LanguageModel(customLanguageCode, app.localize(customLanguageCode), defaultLanguage ? defaultLanguage.resourcesUrl : null, languagesSettings.customTranslations);

            //if (languagesSettings && languagesSettings.customTranslations && !$.isEmptyObject(languagesSettings.customTranslations)) {
            //    customLanguage.isLoaded = true;

            //    defaultLanguage.load().then(function () {
            //        var translations = {};
            //        $.each(defaultLanguage.getNotMappedTranslations(), function (key, value) {
            //            translations[key] = languagesSettings.customTranslations[key] || value;
            //        });
            //        customLanguage.setTranslations(translations);

            //        addLanguage(customLanguage);

            //        var selectedLanguageCode = (languagesSettings && languagesSettings.selected) ? languagesSettings.selected : defaultLanguageCode;
            //        that.selectedLanguageCode(selectedLanguageCode);
            //        _selectedLanguageCode.valueHasMutated();


            //    });
            //    return;
            //}
            addLanguage(customLanguage);

            var selectedLanguageCode = (languagesSettings && languagesSettings.selected) ? languagesSettings.selected : defaultLanguageCode;
            that.selectedLanguageCode(selectedLanguageCode);
        }

        function isLanguageEditable() {
            return that.selectedLanguageCode() === customLanguageCode;
        }

        function getCustomTranslations() {
            var customLanguage = getLanguage(customLanguageCode);
            if (customLanguage) {
                return customLanguage.getNotMappedTranslations();
            }
            return [];
        }

        function addLanguage(language) {
            that.languages.push(language);
        }

        function getLanguage(code) {
            return ko.utils.arrayFirst(that.languages, function (language) {
                return language.code === code;
            });
        }

        function getData() {
            var settingsData = {};

            if (that.selectedLanguageCode()) {
                settingsData.selected = that.selectedLanguageCode();
            }

            var customTranslations = getCustomTranslations();
            if (customTranslations && !$.isEmptyObject(customTranslations)) {
                settingsData.customTranslations = customTranslations;
            }

            return settingsData;
        }
    }

    function LanguageModel(code, name, resourcesUrl, translations) {
        var that = this,
            _mappedTranslations = [],
            _customTranslations = translations;

        that.code = code;
        that.name = name;

        that.isLoaded = false;
        that.load = load;
        that.resourcesUrl = resourcesUrl;

        that.setTranslations = setTranslations;
        that.getTranslations = getTranslations;
        that.getNotMappedTranslations = getNotMappedTranslations;

        function setTranslations(translations) {
            _mappedTranslations = map(translations);
        }

        function getTranslations() {
            return _mappedTranslations;
        }

        function getNotMappedTranslations() {
            return unmap(_mappedTranslations);
        }

        function load() {
            return loadLanguageResources(that.resourcesUrl).then(function (resources) {
                if (_customTranslations) {
                    var translationsList = {};
                    $.each(resources, function (key, value) {
                        translationsList[key] = _customTranslations[key] || value;
                    });
                    that.setTranslations(translationsList);
                } else {
                    that.setTranslations(resources);
                }
                that.isLoaded = true;
            });
        }

        function loadLanguageResources(url) {
            return $.ajax({
                url: url,
                dataType: 'json',
                contentType: 'application/json'
            });
        }

        function map(translationsObject) {
            var arr = [];

            if (translationsObject) {
                Object.keys(translationsObject).forEach(function (key) {
                    arr.push({ key: key, value: translationsObject[key] });
                });
            }

            return arr;
        }

        function unmap(translationsArray) {
            var translationsObj = {};

            if (translationsArray) {
                translationsArray.forEach(function (translation) {
                    translationsObj[translation.key] = translation.value;
                });
            }

            return translationsObj;
        }
    }

})(window.app = window.app || {});