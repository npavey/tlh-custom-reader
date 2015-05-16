define([], function () {

    return {
        initialize: initialize
    };

    function initialize(settings) {
        if (!settings || !settings.image || !settings.image.src) {
            return;
        }

        var element = $('<div />');
        element.prependTo('body');

        var image = new Image(),
            src = settings.image.src,
            position = '0 0',
            repeat = 'no-repeat',
            size = 'auto';


        if (settings.image.type === 'repeat') {
            repeat = 'repeat';
        }

        if (settings.image.type === 'fullscreen') {
            size = 'cover';
            position = 'center';
        }

        image.onload = function () {
            $(element)
                .css({
                    'position': 'fixed',
                    'top': '0',
                    'bottom': '0',
                    'width': '100%',
                    'height': '100%',

                    'background-image': 'url(' + src + ')',
                    'background-position': position,
                    '-webkit-background-size': size,
                    'background-size': size,
                    'background-repeat': repeat
                });
        };

        image.src = src;
    }

});
