define([], function () {
    "use strict";

    function Course(id, title, author) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.logo = null;
        this.sections = [];
        this.introductions = [];
    };

    return Course;
});