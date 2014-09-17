define(['plugins/router', 'durandal/composition', 'durandal/app'], function (router, composition, app) {

    var viewmodel = {
        isViewReady: ko.observable(false),

        router: router,
        activate: activate
    }

    router.on('router:route:activating').then(function () {
        viewmodel.isViewReady(false);
    });

    router.on('router:navigation:composition-complete').then(function () {
        setTimeout(function () {            
            viewmodel.isViewReady(true);
        }, 250);
    });


    return viewmodel;

    function activate() {

        router.map([
            { route: '', moduleId: 'viewmodels/course' },
            { route: 'objective/:id*page', moduleId: 'viewmodels/objective' }
        ]);

        return router.activate().then(function () {
            viewmodel.isViewReady(true);
        });
    }

})