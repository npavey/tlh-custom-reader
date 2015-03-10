define(['plugins/router', 'durandal/composition', 'durandal/app', 'modulesInitializer'], function (router, composition, app, modulesInitializer) {

    var viewmodel = {
        isViewReady: ko.observable(false),

        router: router,
        activate: activate
    };

    router.on('router:navigation:composition-complete').then(function () {
        if (!$('html').hasClass('touch')) {
            $('.scrollable').each(function () {
                var that = this;

                $(that).mCustomScrollbar({
                    alwaysShowScrollbar: true,
                    mouseWheel: {
                        scrollAmount: 'auto'
                    },
                    scrollInertia: 200
                });

                if ($(that).hasClass('resettable')) {
                    $(that).mCustomScrollbar("scrollTo", 0);
                }
            });
        }
    });


    return viewmodel;

    function activate() {
        return modulesInitializer.init().then(function () {
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
        });
    }

})