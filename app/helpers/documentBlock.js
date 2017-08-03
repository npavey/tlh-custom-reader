define(['translation'], function (translation) {
    var constants = {
        types: {
            pdf: 'pdf',
            word: 'word',
            exel: 'exel',
            powerpoint: 'powerpoint',
            zip: 'zip'
        },
        downloadLocalizationKey: '[download]',
        containerSelector: '.document-container',
        sizeAttrName: 'data-document-size',
        typeAttrName: 'data-document-type',
        downloadBtnSelector: '.download-document-btn',
        documentTitleWrapperSelector: '.document-title-wrapper'
    };

    return {
        getDocumentBlockContent: function(html) {
            var $output = $('<output>').html(html),
                    $container = $output.find(constants.containerSelector);

            var downloadText = translation.getTextByKey(constants.downloadLocalizationKey);
            var documentData = {
                type: $container.attr(constants.typeAttrName),
                size: +$container.attr(constants.sizeAttrName)
            };

            var documentSizeString = getSize(documentData.size);
            var downloadBtnText = downloadText + ' (' + documentSizeString + ')';
                
             $output.find(constants.downloadBtnSelector)
                .text(downloadBtnText);

            var iconClass = documentData.type === constants.types.zip ? 'icon-zip' : 'icon-file';
            var $typeIcon = $('<div class="icon-container">' +
                '<span class="document-type-text">' + documentData.type + '</span>' +
                '</div>')
                .addClass(iconClass);
            var $typeIconWrapper = $('<div class="document-icon"></div>')
                .append($typeIcon);

            var $documentInfo = $(constants.documentTitleWrapperSelector, $container)
                .prepend($typeIconWrapper);

            var content = $output.children()[0];
            return content;
        }
    };

    function getSize(size) {
        var sizeStr = '';
        if (!size || size < 1024) {
            return '0 Kb';
        }
        sizeStr = (size / (1024 * 1024)).toFixed(2);

        return sizeStr + ' MB';
    }
});