define(['knockout'], function (ko) {

    ko.bindingHandlers.toggle = {
        init: function (element, valueAccessor) {
            toggle(element, ko.unwrap(valueAccessor()), 0);
        },
        update: function (element, valueAccessor) {
            toggle(element, ko.unwrap(valueAccessor()), 250);
        }
    }

    function toggle(element, condition, duration) {
        if (condition) {
            $(element).show(duration);
        } else {
            $(element).hide(duration);
        }
    }
})