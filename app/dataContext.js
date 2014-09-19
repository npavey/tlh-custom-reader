define(['models/Course', 'models/Objective', 'models/Page', 'models/Content', 'Q'], function (Course, Objective, Page, Content, Q) {
    "use strict";

    var course;

    return {
        getCourse: getCourse,
        getObjective: getObjective,
        getPage: getPage,

        initialize: initialize
    };

    function getCourse() {
        return course;
    }

    function getObjective(id) {
        var objective = null;
        getCourse().objectives.some(function (element) {
            if (element.id == id) {
                objective = element;
                return true;
            }
        });
        return objective;
    }

    function getPage(objectiveId, pageId) {
        var objective = getObjective(objectiveId);

        if (!(objective instanceof Objective)) {
            return null;
        }

        var page = null;
        objective.pages.some(function (element) {
            if (element.id == pageId) {
                page = element;
                return true;
            }
        });
        return page;
    }

    function initialize() {
        var dfd = Q.defer();

        $.ajax({
            url: 'content/data.js?v=' + Math.random(),
            contentType: 'application/json',
            dataType: 'json'
        }).done(function (response) {

            course = new Course(response.id, response.title, response.createdBy || 'Anonymous');

            if (Array.isArray(response.objectives)) {
                response.objectives.forEach(function (dobj) {
                    var objective = new Objective(dobj.id, dobj.title);
                    if (Array.isArray(dobj.questions)) {
                        dobj.questions.forEach(function (dq) {
                            var page = new Page(dq.id, dq.title);
                            if (Array.isArray(dq.learningContents)) {
                                dq.learningContents.forEach(function (dc) {
                                    page.contents.push(new Content(dc.id, 'content/' + dobj.id + '/' + dq.id + '/' + dc.id + '.html?v=' + Math.random()));
                                });
                            }
                            if (page.contents.length) {
                                objective.pages.push(page);
                            }
                        });
                    }
                    if (objective.pages.length) {
                        course.objectives.push(objective);
                    }
                });
            }

            dfd.resolve();
        });

        return dfd.promise;
    }

});