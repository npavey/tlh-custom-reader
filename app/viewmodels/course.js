define(['dataContext'], function (dataContext) {

    var viewModel = {
        activate: activate,
        finish: finish
    };

    return viewModel;

    function activate() {
        var course = dataContext.getCourse();

        viewModel.title = course.title;
        viewModel.author = course.author;
        viewModel.objectives = course.objectives.map(function (objective) {
            return { id: objective.id, title: objective.title };
        });
    }

    function finish() {
        window.close();
    }

})