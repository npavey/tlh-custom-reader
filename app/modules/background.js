define([], function () {

    return {
        initialize: initialize
    };

    function initialize(settings) {
        if (!settings || !settings.image || !settings.image.src) {
            return;
        }

        var src = settings.image.src,
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

        var backgroundStyles = '.background {' +
            'background-image: url(' + src + ');' +
            'background-position:'+ position + ';' +
            '-webkit-background-size:' + size + ';' +
            'background-size:' + size + ';' +
            'background-repeat:' + repeat + ';' +
        '}';

        appendStylesToDocument(backgroundStyles);
    }

    function appendStylesToDocument(cssStyles) {
        var styleNode = document.createElement('style');
        styleNode.type = 'text/css';
        styleNode.appendChild(document.createTextNode(cssStyles));
        document.getElementsByTagName('head')[0].appendChild(styleNode);
    }

});
