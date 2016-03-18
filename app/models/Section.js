define([], function () {
    "use strict";

    var Section = function (id, title) {
        this.id = id;
        this.title = title;
        this.pages = [];
    };

    return Section;
});