define([], function () {
    "use strict";

    var Page = function (id, title) {
        this.id = id;
        this.title = title;
        
        this.contents = [];
    };

    return Page;
});