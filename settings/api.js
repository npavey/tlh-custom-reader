(function () {
    var apiData = {
        isInited: false
    };

    var
        baseUrl = location.protocol + '//' + location.host,
        identifyUrl = baseUrl + '/auth/identity',
        designSettingsUrl = baseUrl + '/api/course/' + getURLParameter('courseId') + '/template/' + getURLParameter('templateId') + '/settings/design',
        configurationSettingsUrl = baseUrl + '/api/course/' + getURLParameter('courseId') + '/template/' + getURLParameter('templateId') + '/settings/configuration',

        templateUrl = location.toString().substring(0, location.toString().indexOf('/settings/')) + '/',
        manifestUrl = templateUrl + 'manifest.json', //TODO: Change way of resolving manifest file path

        headers = { 'Authorization': 'Bearer ' }
    ;

    window.egApi = {
        init: init,
        getManifest: getManifest,
        getUser: getUser,
        getDesignSettings: getDesignSettings,
        getConfigurationSettings: getConfigurationSettings,
        saveDesignSettings: saveDesignSettings,
        saveConfigurationSettings: saveConfigurationSettings,
        sendNotificationToEditor: sendNotificationToEditor,
        showSettings: showSettings,
        getSettingsToken: getSettingsToken
    };

    function getSettingsToken() {
        return getCookie('token.settings');
    }

    function init() {
        headers.Authorization += (getURLParameter('token') || getSettingsToken());

        /* DEBUG */
        var userDataPromise = $.Deferred().resolve([{ subscription: { accessType: 1, expirationDate: new Date(2016, 1, 1) } }]);
        var designSettingsPromise = $.getJSON('../../settings.js').then(function (response) { return [{ settings: JSON.stringify(response) }]; });
        var configurationSettingsPromise = $.getJSON('../../settings.js').then(function (response) { return [{ settings: JSON.stringify(response) }]; });
        var manifestPromise = $.getJSON(manifestUrl);
        /* END_DEBUG */

        /* RELEASE
        var userDataPromise = $.ajax({
            url: identifyUrl,
            headers: headers,
            cache: false,
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json'
        });

        var designSettingsPromise = $.ajax({
            url: designSettingsUrl,
            headers: headers,
            cache: false,
            contentType: 'application/json',
            dataType: 'json'
        });

        var configurationSettingsPromise = $.ajax({
            url: configurationSettingsUrl,
            headers: headers,
            cache: false,
            contentType: 'application/json',
            dataType: 'json'
        });

        var manifestPromise = $.ajax({
            url: manifestUrl,
            headers: headers,
            cache: false,
            contentType: 'application/json',
            dataType: 'json'
        });
        END_RELEASE */

        return $.when(manifestPromise, userDataPromise, designSettingsPromise, configurationSettingsPromise)
            .done(function (manifestResponse, userDataResponse, designSettings, configurationSettings) {
                apiData.manifest = getManifestModel(manifestResponse[0]);
                apiData.user = getUserModel(userDataResponse[0]);
                apiData.designSettings = getDesignSettingsModel(designSettings[0]);
                apiData.configurationSettings = getConfigurationSettingsModel(configurationSettings[0]);
                apiData.isInited = true;
            });
    }

    function isInitedGuard() {
        if (!apiData.isInited) {
            throw "Sorry, but you've tried to use api before it was initialized";
        }
    }

    function getManifest() {
        isInitedGuard();
        return apiData.manifest;
    }

    function getUser() {
        isInitedGuard();
        return apiData.user;
    }

    function getDesignSettings() {
        isInitedGuard();
        return apiData.designSettings;
    }

    function getConfigurationSettings() {
        isInitedGuard();
        return apiData.configurationSettings;
    }

    function getManifestModel(manifestData) {
        if (manifestData && manifestData.languages && manifestData.languages.length > 0) {
            for (var i = 0; i < manifestData.languages.length; i++) {
                manifestData.languages[i].url = templateUrl + manifestData.languages[i].url;
            }
        }

        return manifestData;
    }

    function getUserModel(userData) {
        userData = userData.data;
        var user = { accessType: 0 };
        var starterAccessType = 1;
        if (userData.subscription &&
            userData.subscription.accessType &&
            userData.subscription.accessType >= starterAccessType &&
            new Date(userData.subscription.expirationDate) >= new Date()
        ) {
            user.accessType = userData.subscription.accessType;
        }
        return user;
    }

    function getDesignSettingsModel(settingsData) {
        var settings;
        if (settingsData.settings && settingsData.settings.length > 0) {
            settings = JSON.parse(settingsData.settings);
        } else {
            //TODO: need to be removed in next implementation
            settings = {};
        }
        return settings;
    }

    function getConfigurationSettingsModel(settingsData) {
        var settings;
        if (settingsData.settings && settingsData.settings.length > 0) {
            settings = JSON.parse(settingsData.settings);
        } else {
            //TODO: need to be removed in next implementation
            settings = {
                xApi: {
                    enabled: true,
                    selectedLrs: 'default',
                    lrs: {
                        credentials: {}
                    }
                },
                masteryScore: {}
            };
        }
        return settings;
    }

    function getURLParameter(name) {
        var param = RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || null;
        return param === null ? null : decodeURI(param[1]);
    }

    function saveDesignSettings(settings, extraSettings, successSaveMessage, failSaveMessage) {
        var data = {
            settings: settings,
            extraSettings: extraSettings
        };

        return saveSettings(designSettingsUrl, data, successSaveMessage, failSaveMessage);
    }

    function saveConfigurationSettings(settings, successSaveMessage, failSaveMessage) {
        var data = {
            settings: settings
        };

        return saveSettings(configurationSettingsUrl, data, successSaveMessage, failSaveMessage);
    }

    function saveSettings(url, data, successSaveMessage, failSaveMessage) {
        freezeEditor();

        var requestArgs = {
            url: url,
            type: 'POST',
            headers: headers,
            cache: false,
            dataType: 'json',
            data: data
        }

        return $.ajax(requestArgs).done(function () {
            sendNotificationToEditor(successSaveMessage, true);
        }).fail(function () {
            sendNotificationToEditor(failSaveMessage, false);
        }).always(function () {
            unfreezeEditor();
        });
    }

    function freezeEditor() {
        postMessageToEditor({ type: 'freeze-editor' });
    }

    function unfreezeEditor() {
        postMessageToEditor({ type: 'unfreeze-editor' });
    }

    function sendNotificationToEditor(message, isSuccess) {
        postMessageToEditor({ type: 'notification', data: { success: isSuccess, message: message } });
    }

    function showSettings() {
        postMessageToEditor({ type: 'show-settings' });
    }

    function postMessageToEditor(data) {
        var editorWindow = window.parent;
        editorWindow.postMessage(data, '*');
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return undefined;
    }

})();
