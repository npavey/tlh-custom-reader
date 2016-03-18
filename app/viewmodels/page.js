define(['knockout', 'Q', 'plugins/router', 'dataContext'], function (ko, Q, router, dataContext) {

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
            page = dataContext.getPage(sectionId, pageId),
            contents = [],
            promises = []
        ;

        this.sectionTitle(section.title);
        this.pageTitle(page.title);
        this.isViewReady(false);

        page.contents.forEach(function (content, index) {
            promises.push(content.text().then(function (text) {
                contents[index] = text;
            }));
        });

        var that = this;
        return Q.all(promises).then(function () {
            that.contents(contents);
            //setTimeout(function() {
                that.isViewReady(true);
            //}, 250);

        });
    }

    return ViewModel;

})