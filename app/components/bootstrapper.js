define(function (require) {

    return {
        run: function () {
            require('./bindingHandlers/toggle');

            if ('ontouchstart' in window) {
                $('html').addClass('touch');
            }
        }
    }

})