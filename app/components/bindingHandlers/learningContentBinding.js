define(['durandal/composition'], function (composition) {
    ko.bindingHandlers.learningContent = {
        init: function (element, valueAccessor) {
            var $element = $(element),
                html = valueAccessor();
            
            var $output = $('<output>');
            $output.html(html);
            
            var learningContent = $('[data-type]', $output);
            var dataType = learningContent.attr('data-type');
            
            
            switch(dataType){
                case 'hotspot': 
                    var hotspotOnImage = new HotspotOnImage($(html)[0]);
                    $element.html(hotspotOnImage.element);
                default:
                    $element.html(html);
            }
            
            if (dataType.length !== 0){
                var hotspotOnImage = new HotspotOnImage($(html)[0]);
                $element.html(hotspotOnImage.element);
            } else {
                $element.html(html);
            }
        }
    };
    
    composition.addBindingHandler('learningContent');
});