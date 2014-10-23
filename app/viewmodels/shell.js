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
        $('.scrollable').mCustomScrollbar({
            alwaysShowScrollbar: true,
            mouseWheel: {
                scrollAmount: 300
            },
            scrollInertia: 950
        });

        setTimeout(function () {
            $('.scrollable.resettable').mCustomScrollbar("scrollTo", 0);
            viewmodel.isViewReady(true);
        }, 250);
    });


    return viewmodel;

    function activate() {
        sessionStorage.removeItem('introductionWasShown');

        router.map([
            { route: '', moduleId: 'viewmodels/course' },
            { route: 'objective/:id*page', moduleId: 'viewmodels/objective' }
        ]);

        router.mapUnknownRoutes('viewmodels/404');
        return router.activate().then(function () {
            setTimeout(function () {
                viewmodel.isViewReady(true);
            }, 250);
        });
    }

})