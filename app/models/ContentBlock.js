﻿define([], function () {
    "use strict";

    function ContentBlock(id, contentUrl, children) {
        this.id = id;
        this.contentUrl = contentUrl;
        this.children = children;

        this.content;
    };

    return ContentBlock;
});