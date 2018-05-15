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
        $element.css('overflow', 'hidden');
        if (condition) {
            if(!isHorizontalDirection) {
                $element.show(duration);
            } else {
                $element.css('height', '').hide().slideDown();
            }
        } else {
            if(!isHorizontalDirection) {
                $element.hide(duration);
            } else {
                $element.animate({height: 0});
            }
        }
    }
})