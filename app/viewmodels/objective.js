define(['knockout', 'plugins/router', 'dataContext'], function (ko, router, dataContext) {

    var ViewModel = function () {
        this.id = ko.observable();
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
        return true;
    }

    ViewModel.prototype.activate = function (objectiveId) {
        var objective = dataContext.getObjective(objectiveId);
        
        this.id(objective.id);
        this.pages(objective.pages.map(function(page) {
            return page.id;
        }));

    }

    return ViewModel;

})