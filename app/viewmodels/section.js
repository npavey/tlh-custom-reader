define(['knockout', 'plugins/router', 'dataContext'], function (ko, router, dataContext) {
    "use strict";

    var ViewModel = function () {
        this.id = ko.observable();
        this.isTableOfContentVisible = ko.observable(true);
        this.pages = ko.observableArray([]);
        this.previousPage = ko.observable();
        this.currentPage = ko.observable();
        this.nextPage = ko.observable();
        this.router = router.createChildRouter()
                .makeRelative({
                }).map([
                    { route: 'section/:sectionId/page/:pageId', moduleId: 'viewmodels/page' }
                ]).buildNavigationModel();
    }

    ViewModel.prototype.canActivate = function (sectionId, page) {
        if (typeof page !== "string") {
            return { 'redirect': 'section/' + sectionId + '/page/' + dataContext.getSection(sectionId).pages[0].id };
        }

        return dataContext.getSection(sectionId) ? true : { 'redirect': '404' };
    }

    ViewModel.prototype.activate = function (sectionId) {
        var
            that = this,
            url = router.activeInstruction().fragment,
            section = dataContext.getSection(sectionId)
        ;

        that.id(section.id);
        that.pages(section.pages.map(function (page) { return { id: page.id, title: page.title } }));
        that.pages().forEach(function (page, index, array) {
            if (url.indexOf(page.id, url.length - page.id.length) === -1) {
                return;
            }
            that.previousPage(index > 0 ? array[index - 1] : null);
            that.currentPage(page);
            that.nextPage(index < array.length ? array[index + 1] : null);
        });
    }

    ViewModel.prototype.deactivate = function () {
        this.previousPage(null);
        this.currentPage(null);
        this.nextPage(null);
    }

    ViewModel.prototype.toggleTableOfContent = function () {
        this.isTableOfContentVisible(!this.isTableOfContentVisible());
    };

    return ViewModel;

})