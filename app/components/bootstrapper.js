define(function (require) {

    return {
        run: function () {
            var binder = require('durandal/binder');
            require('./bindingHandlers/toggle');
            require('./bindingHandlers/learningContentBinding');
            require('./bindingHandlers/elementsWrapBinding');

            binder.binding = function(obj, view) {
                require('localization').localize(view);
            }

            if ('ontouchstart' in window) {
                $('html').addClass('touch');
            }
        }
    }

})