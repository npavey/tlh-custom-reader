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
        sizeAttrName: 'data-document-size-kb',
        typeAttrName: 'data-document-type',
        downloadBtnSelector: '.download-document-btn'
    };

    return {
        getDocumentBlockContent: function(html) {
            var $output = $('<output>').html(html);
            var downloadText = translation.getTextByKey(constants.downloadLocalizationKey);
            var $container = $output.find(constants.containerSelector);
            var documentType = $container.attr(constants.typeAttrName);
            var documentSizeValue = $container.attr(constants.sizeAttrName);
            var documentSize = getSize(documentSizeValue);
            var downloadBtnText = downloadText + ' (' + documentSize + ')';
            var $downloadBtn = $output.find(constants.downloadBtnSelector);
            $downloadBtn.text(downloadBtnText);
            var $typeIcon = $('<div class="icon-container"></div>');
            $typeIcon.append('<span class="document-type-text">' + documentType + '</span>');
            switch (documentType) {
                case constants.types.zip: {
                    $typeIcon.addClass('icon-zip');
                    break;
                }
                default: {
                    $typeIcon.addClass('icon-file');
                    break;
                }
            }
            var $typeIconWrapper = $('<div class="document-icon"></div>');
            $typeIconWrapper.append($typeIcon);
            $container.prepend($('<div class="separator"></div>'));
            $container.prepend($typeIconWrapper);
            var content = $output.children()[0];
            return content;
        }
    };

    function getSize(sizeKb) {
        var size = '';
        if (!sizeKb) {
            return '0 Kb';
        }
        if (sizeKb > 1024) {
            size = (sizeKb / 1024).toFixed(2);
        }
        return size + ' MB';
    }
});