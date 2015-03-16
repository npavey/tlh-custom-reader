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
                    { route: 'objective/:objectiveId/page/:pageId', moduleId: 'viewmodels/page' }
                ]).buildNavigationModel();
    }

    ViewModel.prototype.canActivate = function (objectiveId, page) {
        if (typeof page !== "string") {
            return { 'redirect': 'objective/' + objectiveId + '/page/' + dataContext.getObjective(objectiveId).pages[0].id };
        }

        return dataContext.getObjective(objectiveId) ? true : { 'redirect': '404' };
    }

    ViewModel.prototype.activate = function (objectiveId) {
        var
            that = this,
            url = router.activeInstruction().fragment,
            objective = dataContext.getObjective(objectiveId)
        ;

        that.id(objective.id);
        that.pages(objective.pages.map(function (page) { return { id: page.id, title: page.title } }));
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