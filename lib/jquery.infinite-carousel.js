/**
 * @author Stéphane Roucheray 
 * @extends jquery
 */


jQuery.fn.carousel = function(previous, next, options){
	var sliderList = jQuery(this)[0];
	
	if (sliderList) {
		var increment = jQuery(sliderList).children().outerWidth(),
		elmnts = jQuery(sliderList).children(),
		numElmts = elmnts.length,
		sizeFirstElmnt = increment,
		shownInViewport = Math.round(jQuery(this).width() / sizeFirstElmnt),
		firstElementOnViewPort = 1,
		isAnimating = false;

		elmnts.each(function () {
			jQuery(this).css('width', increment + 'px');
		});

		jQuery(sliderList).css('width',(numElmts+shownInViewport+2)*increment + "px");

		jQuery(sliderList).prepend(jQuery(elmnts[elmnts.length-1]).clone());
		jQuery(sliderList).append(jQuery(elmnts[0]).clone());
		jQuery(sliderList).append(jQuery(elmnts[1]).clone());
		jQuery(sliderList).css('left', '-' + increment + 'px');

		jQuery(previous).click(function(event){
			event.preventDefault();
			if (!isAnimating) {
				if (firstElementOnViewPort == 1) {
					jQuery(sliderList).css('left', "-" + numElmts * sizeFirstElmnt + "px");
					firstElementOnViewPort = numElmts;
				}
				else {
					firstElementOnViewPort--;
				}
				
				jQuery(sliderList).animate({
					left: "+=" + increment,
					y: 0,
					queue: true
				}, "swing", function(){isAnimating = false;});
				isAnimating = true;
			}
			
		});
		
		jQuery(next).click(function(event){
			event.preventDefault();
			if (!isAnimating) {
				if (firstElementOnViewPort > numElmts) {
					firstElementOnViewPort = 2;
					jQuery(sliderList).css('left', '-' + increment + 'px');
				}
				else {
					firstElementOnViewPort++;
				}
				jQuery(sliderList).animate({
					left: "-=" + increment,
					y: 0,
					queue: true
				}, "swing", function(){isAnimating = false;});
				isAnimating = true;
			}
		});
	}
};
