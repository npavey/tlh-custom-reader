define(['knockout'], function (ko) {

    ko.bindingHandlers.toggle = {
        init: function (element, valueAccessor) {
            toggle(element, ko.unwrap(valueAccessor().condition), 0, ko.unwrap(valueAccessor().isHorizontalDirection));
        },
        update: function (element, valueAccessor) {
            toggle(element, ko.unwrap(valueAccessor().condition), 300, ko.unwrap(valueAccessor().isHorizontalDirection));
        }
    }

    function toggle(element, condition, duration, isHorizontalDirection) {
        var $element = $(element);
        if (condition) {
            if(!isHorizontalDirection) {
                $element.show(duration);
            } else {
                $element.css('height', '').hide().slideDown(function(){$element.css('overflow', '')});
            }
        } else {
            if(!isHorizontalDirection) {
                $element.hide(duration);
            } else {
                $element.css('overflow', 'hidden').animate({height: 0});
            }
        }
    }
})