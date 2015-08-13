define(['Q', 'plugins/http'], function (Q, http) {
    "use strict";

    var Content = function (id, url) {
        this.id = id;

        var _text;

        this.text = function() {
            var dfd = Q.defer();

            if (typeof _text == typeof undefined) {
                http.get(url, { dataType: 'html' }).then(function(response) {
                    _text = response;
                    dfd.resolve(response);
                });
            } else {
                dfd.resolve(_text);
            }

            return dfd.promise;
        };
    };

    return Content;
});