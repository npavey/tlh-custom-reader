define(['models/Course', 'models/Section', 'models/Page', 'models/ContentBlock', 'Q', 'templateSettings'], function (Course, Section, Page, ContentBlock, Q, templateSettings) {
    "use strict";

    var course;

    return {
        getCourse: getCourse,
        getSection: getSection,
        getPage: getPage,

        initialize: initialize
    };

    function getCourse() {
        return course;
    }

    function getSection(id) {
        var section = null;
        getCourse().sections.some(function (element) {
            if (element.id == id) {
                section = element;
                return true;
            }
        });
        return section;
    }

    function getPage(sectionId, pageId) {
        var section = getSection(sectionId);

        if (!(section instanceof Section)) {
            return null;
        }

        var page = null;
        section.pages.some(function (element) {
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
        }).done(function (data) {

            course = new Course(data.id, data.title, data.createdBy || 'Anonymous');

            if (Array.isArray(data.sections)) {
                data.sections.forEach(function (dobj) {
                    var section = new Section(dobj.id, dobj.title);
                    if (Array.isArray(dobj.questions)) {
                        dobj.questions.forEach(function (dq) {
                            var page = new Page(dq.id, dq.title);
                            if (Array.isArray(dq.learningContents)) {
                                dq.learningContents.forEach(function (item) {
                                    page.contents.push(mapLearningContent(item, dobj.id, dq.id));
                                });
                            }
                            if (page.contents.length) {
                                section.pages.push(page);
                            }
                        });
                    }
                    if (section.pages.length) {
                        course.sections.push(section);
                    }
                });
            }

            data.introductions = [];
            if (data.hasIntroductionContent && data.introductions) {
                data.introductions.forEach(function(item, index) {
                  course.introductions = data.introductions;
                  if(item.children && item.children.length) {
                    item.children.forEach(function(child, childIndex){
                        $.ajax({
                            url: "content/introduction/" + child.id + ".html?v=" + Math.random(),
                            dataType: 'html'
                        }).then(function (response) {
                            course.introductions[index].children[childIndex].content = response;
                            dfd.resolve();
                        });
                    })
                  }

                $.ajax({
                    url: 'content/introduction/'+ item.id +'.html?v=' + Math.random(),
                    dataType: 'html'
                }).then(function (response) {
                    course.introductions[index].content = response;
                    dfd.resolve();
                });
                
            });
        } else {
            dfd.resolve();
        }
            course.logo = templateSettings.logo.url;
        });

        return dfd.promise;
    }

    function mapLearningContent(item, dobjId, dqId) {
        var contentUrl = 'content/' + dobjId + '/' + dqId + '/' + item.id + '.html?v=' + Math.random();
        var children = item.children.map(function (childItem) {
            return mapLearningContent(childItem, dobjId, dqId);
        });

        return new ContentBlock(item.id, contentUrl, children);
    }

});