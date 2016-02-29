define(['plugins/router', 'durandal/composition', 'durandal/app', 'modulesInitializer', 'dataContext', 'themesInjector', 'modules/background', 'templateSettings'],
    function (router, composition, app, modulesInitializer, dataContext, themesInjector, background, templateSettings) {

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
        background.initialize(templateSettings.background);
    });


    return viewmodel;

    function activate() {
        return modulesInitializer.init().then(function () {
            return dataContext.initialize().then(function () {
                return themesInjector.init().then(function() {
                    sessionStorage.removeItem('introductionWasShown');

                    router.map([
                        { route: '', moduleId: 'viewmodels/course' },
                        { route: 'section/:id*page', moduleId: 'viewmodels/section' }
                    ]);

                    router.mapUnknownRoutes('viewmodels/404');
                    return router.activate().then(function () {
                        viewmodel.isViewReady(true);
                    });
                });
            });
        });
    }

})