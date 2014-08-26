define([], function () {
    "use strict";

    var Course = function (id, title, author) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.objectives = [];
    };

    return Course;
});