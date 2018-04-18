define(['knockout', 'Q', 'plugins/http', 'plugins/router', 'dataContext'], function (ko, Q, http, router, dataContext) {

    var ViewModel = function () {
        this.sectionTitle = ko.observable();
        this.pageTitle = ko.observable();
        this.contents = ko.observableArray([]);

        this.isViewReady = ko.observable(false);
    }

    ViewModel.prototype.canActivate = function (sectionId, pageId) {
        return dataContext.getSection(sectionId) && dataContext.getPage(sectionId, pageId) ? true : { 'redirect': '404' };
    }

    ViewModel.prototype.activate = function (sectionId, pageId) {
        var
            section = dataContext.getSection(sectionId),
            page = dataContext.getPage(sectionId, pageId)
        ;

        this.sectionTitle(section.title);
        this.pageTitle(page.title);
        this.isViewReady(false);

        var that = this;
        return loadContents(page.contents).then(function () {
            that.contents(page.contents);
            that.isViewReady(true);
        });
    }

    function loadContents(items) {
        var promises = [];
        
        items.forEach(function (item) {
            if (typeof item.content === typeof undefined) {
                promises.push(http.get(item.contentUrl, { dataType: 'html' }).then(function(content) {
                    item.content = content;
                }));
            }

            promises.push(loadContents(item.children));
        });

        return Q.all(promises);
    }

    return ViewModel;

})