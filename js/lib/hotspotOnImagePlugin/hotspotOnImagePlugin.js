(function(){
    'use strict';
    
    var classList = {
        tooltipWrapper: 'tl-wrapper',
        tooltipArrowWrapper: 'tl-arrow-wrapper',
        tooltipArrow: 'tl-arrow',
        tooltipTextWrapper: 'tl-text-wrapper',
        top: 'top',
        bottom: 'bottom',
        infoContainer: 'info-container',
        mouseover: 'mouseover',
        hovered: 'hovered'
    };
    
    var hideElement = function (element) {
            return function () {
                element.style.display = 'none';
            }
        },
        isTouchDevice = function(){
            return (('ontouchstart' in window)
                    || (navigator.MaxTouchPoints > 0)
                    || (navigator.msMaxTouchPoints > 0));
        },
        getElementsByAttribute = function (parent, attr){
            var matchingElements = [];
            var allElements = parent.getElementsByTagName('*');
            for (var i = 0, l = allElements.length; i < l; i++) {
                if (allElements[i].getAttribute(attr) !== null){
                    matchingElements.push(allElements[i]);
                }
            }
            return matchingElements;
        };
    
    
    var tooltip = (function(){
        var tooltip;
        
        function init(){
            var domElement = 'div',
                body = document.getElementsByTagName('body')[0],
                tooltipElement = document.createElement(domElement),
                arrowWrapper = document.createElement(domElement),
                arrow = document.createElement(domElement),
                textWrapper = document.createElement(domElement),
                hide = hideElement(tooltipElement);

            tooltipElement.classList.add(classList.tooltipWrapper);
            arrowWrapper.classList.add(classList.tooltipArrowWrapper);
            arrow.classList.add(classList.tooltipArrow);
            textWrapper.classList.add(classList.tooltipTextWrapper);

            arrowWrapper.appendChild(arrow);
            tooltipElement.appendChild(arrowWrapper);
            tooltipElement.appendChild(textWrapper);
            
            if (isTouchDevice()){
                tooltipElement.addEventListener('click', function(event){
                    event.stopPropagation();
                });
                document.addEventListener('click', function(event){
                    hide();
                });
            } else{
                tooltipElement.addEventListener('mouseover', function(){
                    tooltipElement.classList.add(classList.mouseover);
                });

                tooltipElement.addEventListener('mouseout', function(event){
                    var e = event.toElement || event.relatedTarget;
                    if (e && (e.parentNode == this || e == this)) {
                       return;
                    }
                    tooltipElement.classList.remove(classList.mouseover);
                    hide();
                });
            }

            body.appendChild(tooltipElement);
            
            hide();

            return {
                show: show,
                hide: hide,
                element: tooltipElement
            };
            
            function show(element, text){
                if(text !== ''){
                    textWrapper.textContent = text;
                    arrow.style.display = 'block';
                    tooltipElement.style.display = 'block';
                    var rect = element.getBoundingClientRect(),
                        centerTop = window.scrollY + rect.top + element.offsetHeight / 2,
                        centerLeft = rect.left + element.offsetWidth / 2,
                        width = tooltipElement.offsetWidth,
                        height = tooltipElement.offsetHeight,
                        topPostion = 0,
                        leftPosition = 0;
                    
                    if(height < (rect.top + 30)){
                        tooltipElement.classList.remove(classList.bottom);
                        tooltipElement.classList.add(classList.top);
                        topPostion = centerTop - 30 - height;
                        tooltipElement.style.top = centerTop - 30 - height + 'px';
                    }else{
                        tooltipElement.classList.remove(classList.top);
                        tooltipElement.classList.add(classList.bottom);
                        topPostion = centerTop - 30 - height;
                        tooltipElement.style.top = centerTop + 30 + 'px';
                    }
                    leftPosition = centerLeft - (width * 0.5);
                    
                    if (leftPosition < 0){
                        tooltipElement.style.left = 0;
                        arrow.style.left = centerLeft - 10 + 'px';
                    } else {
                        tooltipElement.style.left = leftPosition + 'px';
                        arrow.style.left = centerLeft - leftPosition - 10 + 'px';
                    }
                }
            }
        }
        
        return {
            getInstance: function(){
                if (!tooltip){
                    tooltip = init();
                }
                return tooltip;
            }
        };
    })();
    
    var Spot = function(element, coefficient){
        var that = this;
        that.element = element;
        that.defaultTopStyle = parseFloat(element.style.top);
        that.defaultLeftStyle = parseFloat(element.style.left);
        that.defaultWidthStyle = parseFloat(element.style.width);
        that.defaultHeightStyle = parseFloat(element.style.height);
        that.text = element.getAttribute('data-text');
        
        var tip = tooltip.getInstance();
        
        that.hide = hideElement(that.element);
        
        that.show = function() {
            that.element.style.display = 'inline-block';
        };
        
        that.updatePosition = function(coefficient){
            that.element.style.top = that.defaultTopStyle * coefficient + 'px';
            that.element.style.left = that.defaultLeftStyle * coefficient + 'px';
            that.element.style.width = that.defaultWidthStyle * coefficient + 'px';
            that.element.style.height = that.defaultHeightStyle * coefficient + 'px';
        };
        
        init();
        
        function init(){
            var infoElement = document.createElement('span');
            infoElement.classList.add(classList.infoContainer);
            that.element.appendChild(infoElement);
            that.hide();
            if (isTouchDevice()){
                that.element.addEventListener('click', function(event){
                    tip.show(this, that.text);
                    event.stopPropagation();
                });

            } else {
                that.element.addEventListener('mouseover', function () {
                    tip.show(this, that.text);
                });

                that.element.addEventListener('mouseout', function (event) {
                    var e = event.toElement || event.relatedTarget;
                    if (e.parentNode == this || e == this || e == tip.element) {
                       return;
                    }

                    setTimeout(function(){
                        if (!tip.element.classList.contains(classList.mouseover)){
                            that.element.classList.remove(classList.hovered);
                            tip.hide();
                        }
                    }, 10);
                });
            }
        }
    };
    
    window.HotspotOnImage = function(element, settings) {
        var that = this,
            resizeTimer,
            spotsLength;
        that.isLoaded = false;
        that.element = element;
        that.renderedImage = that.element.getElementsByTagName('img')[0];
        that.spots = [];
        that.coefficient = 1;
        that.defaultImageWidth = 0;
        
        init();
        
        function init(){
            generateSpots();
            loadImage();
        }
        
        function loadImage(){
            var image = new Image();
            image.onload = function(){
                that.defaultImageWidth = this.width;
                that.coefficient = that.renderedImage.width / that.defaultImageWidth;
                that.isLoaded = true;
                updateSpotsPosition();
            };
            image.src = that.renderedImage.getAttribute('src');
        }
        
        function generateSpots(){
            var spots = getElementsByAttribute(that.element, 'data-id');
            spotsLength = spots.length;
            for (var i = 0; i < spotsLength; i++){
                that.spots.push(new Spot(spots[i], that.coefficient));
            }
        }
        
        function updateSpotsPosition(){
            that.coefficient = that.renderedImage.width / that.defaultImageWidth;
            for (var i = 0; i < spotsLength; i++){
                that.spots[i].updatePosition(that.coefficient);
                that.spots[i].show();
            }
        }

        window.addEventListener('resize', function(){
            var spotsLength = that.spots.length;
            for (var i = 0; i < spotsLength; i++){
                that.spots[i].hide();
            }
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateSpotsPosition, 250);
        });
    };
    
})();