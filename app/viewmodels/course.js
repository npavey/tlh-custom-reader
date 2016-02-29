define(['dataContext', 'translation', 'plugins/router'], function (dataContext, translation, router) {
    "use strict";

    var viewModel = {
        activate: activate,
        finish: finish,
        showIntroduction: showIntroduction,
        hideIntroduction: hideIntroduction
    };

    return viewModel;

    function activate() {
        var course = dataContext.getCourse();

        viewModel.title = course.title;
        viewModel.author = course.author;
        viewModel.logo = course.logo;
        viewModel.hasIntroductionContent = course.introductionContent.length > 0;
        viewModel.introductionContent = course.introductionContent;
        viewModel.isIntroductionVisible = ko.observable(viewModel.hasIntroductionContent && !sessionStorage.getItem('introductionWasShown'));

        viewModel.sections = course.sections.map(function (section) {
            return {
                id: section.id,
                title: section.title,
                navigateToSection: navigateToSection
            };
        });
    }

    function finish() {
        window.close();
        if (!inIframe()){
            setTimeout(function () {
                alert(translation.getTextByKey('[thank you message]'));
            }, 250);
        }
    }

    function inIframe() {
        // browsers can block access to window.top due to same origin policy, so exception can be thrown here.
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
        
    function showIntroduction() {
        viewModel.isIntroductionVisible(true);
    }

    function hideIntroduction() {
        viewModel.isIntroductionVisible(false);
        sessionStorage.setItem('introductionWasShown', true);
    }

    function navigateToSection(section) {
        router.navigate('section/' + section.id);
    }

})