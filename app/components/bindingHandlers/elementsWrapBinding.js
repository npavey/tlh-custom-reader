define(['durandal/composition'], function (composition) {

    ko.bindingHandlers.elementsWrap = {
        init: function (element) {
            wrapElement(element);
        },

        update: function (element) {
            wrapElement(element);
        }
    };

    function wrapElement(element) {
        var $element = $(element),
                imageWrapper = '<figure class="image-wrapper"></figure>',
                tableWrapper = '<figure class="table-wrapper"></figure>';

        $('img', $element).each(function (index, image) {
            var $image = $(image),
                $wrapper = $(imageWrapper).css('float', $image.css('float'));

            $(image).css('float', 'none');
            $image.wrap($wrapper);
        });

        $('table', $element).each(function (index, table) {
            var $table = $(table),
                $wrapper = $(tableWrapper).css('text-align', $table.attr('align'));
            $table.attr('align', 'center');
            $table.wrap($wrapper);
        });
    }

    composition.addBindingHandler('elementsWrap');

});