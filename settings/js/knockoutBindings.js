(function () {
    ko.bindingHandlers.fadeVisible = {
        init: function (element, valueAccessor) {
            var value = valueAccessor();
            $(element).toggle(ko.unwrap(value));
        },
        update: function (element, valueAccessor) {
            var value = valueAccessor();
            ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
        }
    };

    ko.bindingHandlers.dropdown = {
        cssClasses: {
            dropdown: 'dropdown',
            disabled: 'disabled',
            expanded: 'expanded',
            optionsList: 'dropdown-options-list',
            optionItem: 'dropdown-options-item',
            currentItem: 'dropdown-current-item',
            currentItemText: 'dropdown-current-item-text',
            indicatorHolder: 'dropdown-indicator-holder',
            indicator: 'dropdown-indicator'
        },
        init: function (element, valueAccessor) {
            var $element = $(element),
                cssClasses = ko.bindingHandlers.dropdown.cssClasses;

            $element.addClass(cssClasses.dropdown);

            var $currentItemElement = $('<div />')
                .addClass(cssClasses.currentItem)
                .appendTo($element);

            $('<div />')
                .addClass(cssClasses.currentItemText)
                .appendTo($currentItemElement);

            var $indicatorHolder = $('<div />')
                .addClass(cssClasses.indicatorHolder)
                .appendTo($currentItemElement);

            $('<span />')
                .addClass(cssClasses.indicator)
                .appendTo($indicatorHolder);

            $('<ul />')
                .addClass(cssClasses.optionsList)
                .appendTo($element);

            $currentItemElement.on('click', function (e) {
                if ($element.hasClass(cssClasses.disabled)) {
                    return;
                }

                $currentItemElement.toggleClass(cssClasses.expanded);
                e.stopPropagation();
            });

            var collapseHandler = function () {
                $currentItemElement.removeClass(cssClasses.expanded);
            };

            $('html').bind('click', collapseHandler);
            $(window).bind('blur', collapseHandler);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $('html').unbind('click', collapseHandler);
                $(window).unbind('blur', collapseHandler);
            });
        },
        update: function (element, valueAccessor) {
            var $element = $(element),
                cssClasses = ko.bindingHandlers.dropdown.cssClasses,

                $optionsListElement = $element.find('ul.' + cssClasses.optionsList),
                $currentItemTextElement = $element.find('div.' + cssClasses.currentItemText);


            var options = valueAccessor().options,
                optionsText = valueAccessor().optionsText,
                value = valueAccessor().value,
                optionsValue = valueAccessor().optionsValue,
                currentValue = ko.unwrap(value),
                disable = ko.unwrap(valueAccessor().disable);

            if (disable) {
                $element.toggleClass(cssClasses.disabled);
            } else {
                $element.removeClass(cssClasses.disabled);
            }

            $optionsListElement.empty();

            $.each(options, function (index, option) {
                if (option[optionsValue] == currentValue) {
                    $currentItemTextElement.text(option[optionsText]);
                    return;
                }

                $('<li />')
                    .addClass(cssClasses.optionItem)
                    .appendTo($optionsListElement)
                    .text(option[optionsText])
                    .on('click', function (e) {
                        value(option[optionsValue]);
                        $element.trigger('change');
                    });
            });
        }
    };

    ko.bindingHandlers.tabs = {
        init: function (element) {
            var $element = $(element),
                dataTabLink = 'data-tab-link',
                dataTab = 'data-tab',
                activeClass = 'active',
                $tabLinks = $element.find('[' + dataTabLink + ']'),
                $tabs = $element.find('[' + dataTab + ']');

            $tabs.hide();

            $tabLinks.first().addClass(activeClass);
            $tabs.first().show();

            $tabLinks.each(function (index, item) {
                var $item = $(item);
                $item.on('click', function () {
                    var key = $item.attr(dataTabLink),
                        currentContentTab = $element.find('[' + dataTab + '="' + key + '"]');
                    $tabLinks.removeClass(activeClass);
                    $item.addClass(activeClass);
                    $tabs.hide();
                    currentContentTab.show();
                });
            });

        }
    };

    ko.bindingHandlers.localize = {
        init: function(element, valueAccessor) {
            var $element = $(element),
                key = ko.unwrap(valueAccessor());

            $element.html(app.localize(key));
        }
    };
})();