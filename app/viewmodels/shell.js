define(['plugins/router', 'durandal/composition', 'durandal/app'], function (router, composition, app) {

    var viewmodel = {
        router: router,
        activate: activate
    }

    router.on('router:navigation:composition-complete').then(function () {
        if ($('html').hasClass('touch')) {
            $('.scrollable').mCustomScrollbar({
                alwaysShowScrollbar: true,
                mouseWheel: {
                    scrollAmount: 'auto'
                },
                scrollInertia: 200
            });

            $('.scrollable.resettable').mCustomScrollbar("scrollTo", 0);
        }
    });


    return viewmodel;

    function activate() {
        sessionStorage.removeItem('introductionWasShown');

        router.map([
            { route: '', moduleId: 'viewmodels/course' },
            { route: 'objective/:id*page', moduleId: 'viewmodels/objective' }
        ]);

        router.mapUnknownRoutes('viewmodels/404');
        return router.activate();
    }

})