define(['dataContext'], function (dataContext) {
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
        viewModel.hasIntroductionContent = course.hasIntroductionContent;
        viewModel.isIntroductionVisible = ko.observable(false);

        viewModel.objectives = course.objectives.map(function (objective) {
            return { id: objective.id, title: objective.title };
        });

        if (viewModel.hasIntroductionContent) {
            return Q($.ajax({
                url: 'content/content.html?v=' + Math.random(),
                dataType: 'html'
            })).then(function (introductionContent) {
                viewModel.introductionContent = introductionContent;
            });
        }
    }

    function finish() {
        window.close();
        setTimeout(function () {
            alert('Thank you. It is now safe to close this page.');
        }, 250);
    }

    function showIntroduction() {
        viewModel.isIntroductionVisible(true);
    }

    function hideIntroduction() {
        viewModel.isIntroductionVisible(false);
    }

})