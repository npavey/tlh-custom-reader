define(['durandal/composition'], function (composition) {
    ko.bindingHandlers.learningContent = {
        init: function (element, valueAccessor) {
            var $element = $(element),
                html = valueAccessor();

            $element.html(html);
        }
    };

    composition.addBindingHandler('learningContent');
})