define(['jquery', 'knockout', 'durandal/composition'], function ($, ko, composition) {

    ko.bindingHandlers.elementsWrap = {
        init: function (element) {
            wrapElement(element);
        }
    };

    function wrapElement(element) {
        var $element = $(element),
                imageWrapper = '<figure class="image-wrapper"></figure>',
                tableWrapper = '<figure class="table-wrapper"></figure>';

        $('img', $element).each(function (index, image) {
            var $image = $(image),
                $wrapper = $(imageWrapper).css('float', $image.css('float')),
                $parent = $image.parent();
                
            if ($image.closest('.cropped-image').length > 0) {
                return;
            }

            if ($parent.prop('tagName') == "TD" && $parent[0].style.width == "") {
                $wrapper.css('width', $image[0].style.width);
                $wrapper.css('height', $image[0].style.height);
            }

            $image.height('auto');
            $image.css('float', 'none');
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