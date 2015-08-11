(function (app) {

    app.UserAccessModel = UserAccessModel;
    app.LogoModel = LogoModel;
    app.ThemesModel = ThemesModel;
    app.BackgroundModel = BackgroundModel;

    function UserAccessModel(userData) {
        this.hasStarterPlan = userData && userData.accessType > 0;
    }

    function LogoModel(logoSettings, saveChanges) {
        var that = this;

        that.url = ko.observable('');
        that.hasLogo = ko.computed(function () {
            return that.url() !== '';
        });
        that.clear = function () {
            that.url('');
            saveChanges();
        };
        that.isError = ko.observable(false);
        that.errorText = ko.observable('');
        that.errorDescription = ko.observable('');
        that.isLoading = ko.observable(false);
        
        that.hasLogo = ko.computed(function () {
            that.isError(false);
            return that.url() !== '';
        });

        that.setUrl = setUrl;
        that.getData = getData;

        that.upload = upload;

        init(logoSettings);

        return that;

        function init(logoSettings) {
            if (!logoSettings) {
                return;
            }

            that.setUrl(logoSettings.url);
        }

        function upload() {
            if (that.isLoading()) {
                return;
            }

            app.upload(function () {
                setLoadingStatus();
            }).done(function (url) {
                setUrl(url);
                setDefaultStatus();
                saveChanges();
            }).fail(function (reason) {
                setFailedStatus(reason.title, reason.description);
                saveChanges();
            });
        }

        function setDefaultStatus() {
            that.isLoading(false);
            that.isError(false);
        }

        function setFailedStatus(reasonTitle, reasonDescription) {
            that.clear();
            that.isLoading(false);
            that.isError(true);
            that.errorText(reasonTitle);
            that.errorDescription(reasonDescription);
        }

        function setLoadingStatus() {
            that.clear();
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

    function ThemesModel(themesSettings, saveChanges, useBlackAsDefault) {
        var that = this;

        that.list = [
            new ThemeModel('light', !useBlackAsDefault),
            new ThemeModel('black', useBlackAsDefault)
        ];

        that.selectedThemeName = ko.computed(function () {
            var selectedName = '';
            ko.utils.arrayForEach(that.list, function (theme) { //foreach because of we need to track selecting of all themes
                if (theme.isSelected()) {
                    selectedName = theme.name;
                }
            });
            return selectedName;
        }, that);

        that.select = select;
        that.selectByName = selectByName;
        that.openDemo = openDemo;
        that.getData = getData;

        init(themesSettings);

        return that;

        function init(themesSettings) {
            if (!themesSettings || !themesSettings.key) {
                return;
            }

            that.selectByName(themesSettings.key);
        }

        function select(item) {
            ko.utils.arrayForEach(that.list, function (theme) {
                theme.isSelected(false);
            });

            item.isSelected(true);

            saveChanges();
        }

        function selectByName(name) {
            ko.utils.arrayForEach(that.list, function (theme) {
                theme.isSelected(theme.name === name);
            });

        }

        function openDemo() {
            var index = location.toString().indexOf('/settings/');
            var templateUrl = location.toString().substring(0, index);

            var params = [
                'v=' + new Date().getTime(),
                'theme=' + that.selectedThemeName()
            ].join('&');

            window.open(templateUrl + '?' + params, '_blank');
        }

        function getData() {
            return {
                key: that.selectedThemeName()
            };
        }

        function ThemeModel(name, isSelected) {
            var that = this;

            that.name = name;
            that.isSelected = ko.observable(isSelected === true);

            return that;
        }
    }

    function BackgroundModel(backgroundSettings, saveChanges) {
        var settings = $.extend(true, {
            image: {
                src: null,
                type: 'fullscreen'
            }
        }, backgroundSettings);

        var that = this;
        that.image = ko.observable(settings.image.src);
        that.image.isUploading = ko.observable(false);
        that.image.isEmpty = ko.computed(function () {
            return !(that.image() && that.image().length > 0);
        });

        that.type = ko.observable(settings.image.type);
        that.type.fullscreen = function () {
            that.type('fullscreen');
            saveChanges();
        };
        that.type.repeat = function () {
            that.type('repeat');
            saveChanges();
        };
        that.type.original = function () {
            that.type('original');
            saveChanges();
        };

        that.errorTitle = ko.observable();
        that.errorDescription = ko.observable();
        that.hasError = ko.observable(false);

        that.changeImage = function () {
            if (that.image.isUploading()) {
                return;
            }

            app.upload(function () {
                that.image.isUploading(true);

                that.hasError(false);
                that.errorTitle(undefined);
                that.errorDescription(undefined);
            }).done(function (url) {
                that.image(url);
            }).fail(function (reason) {
                that.image(undefined);
                that.hasError(true);
                that.errorTitle(reason.title);
                that.errorDescription(reason.description);
            }).always(function () {
                saveChanges();
                that.image.isUploading(false);
            });
        };

        that.clearImage = function () {
            that.image(null);
            saveChanges();
        };

        that.getData = function () {
            return {
                image: {
                    src: that.image(),
                    type: that.type()
                }
            };
        };
    }

})(window.app = window.app || {});
