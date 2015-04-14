define(['dataContext', 'translation'], function (dataContext, translation) {
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

        viewModel.objectives = course.objectives.map(function (objective) {
            return { id: objective.id, title: objective.title };
        });
    }

    function finish() {
        window.close();
        setTimeout(function () {
            alert(translation.getTextByKey('[thank you message]'));
        }, 250);
    }

    function showIntroduction() {
        viewModel.isIntroductionVisible(true);
    }

    function hideIntroduction() {
        viewModel.isIntroductionVisible(false);
        sessionStorage.setItem('introductionWasShown', true);
    }

})