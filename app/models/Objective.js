define([], function () {
    "use strict";

    var Objective = function (id, title) {
        this.id = id;
        this.title = title;
        this.pages = [];
    };

    return Objective;
});