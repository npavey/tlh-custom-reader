define(['knockout', 'plugins/router', 'dataContext'], function (ko, router, dataContext) {

    var ViewModel = function () {
        this.id = ko.observable();
        this.isTableOfContentVisible = ko.observable(true);
        this.pages = ko.observableArray([]);
        this.router = router.createChildRouter()
                .makeRelative({
                }).map([
                    { route: 'objective/:objectiveId/page/:pageId', moduleId: 'viewmodels/page' }
                ]).buildNavigationModel();
    }

    ViewModel.prototype.canActivate = function (objectiveId, page) {
        if (typeof page != "string") {
            return { 'redirect': 'objective/' + objectiveId + '/page/' + dataContext.getObjective(objectiveId).pages[0].id };
        }

        return dataContext.getObjective(objectiveId) ? true : { 'redirect': '404' };
    }

    ViewModel.prototype.activate = function (objectiveId) {
        var objective = dataContext.getObjective(objectiveId);
        this.id(objective.id);
        this.pages(objective.pages.map(function (page) {
            return {
                id: page.id,
                title: page.title,
                isActive: ko.computed(function () {
                    if (router.activeInstruction() && router.activeInstruction().fragment && router.activeInstruction().fragment.length) {
                        var url = router.activeInstruction().fragment;
                        return url.indexOf(page.id, url.length - page.id.length) !== -1;
                    }
                    return false;
                })
            }
        }));

    }

    ViewModel.prototype.showTableOfContent = function () {
        this.isTableOfContentVisible(true);
    };

    ViewModel.prototype.hideTableOfContent = function () {
        this.isTableOfContentVisible(false);
    };

    return ViewModel;

})