define(function () {

    var ticks = new Date().getTime();

    return {
        readPublishSettings: readPublishSettings
    };

    function readPublishSettings() {
        return read('publishSettings.js?_=' + ticks);
    }

    function read(filename) {
        var defer = Q.defer();
        $.getJSON(filename).then(function (json) {
            defer.resolve(json);
        }).fail(function () {
            defer.resolve({});
        });

        return defer.promise;
    }

});