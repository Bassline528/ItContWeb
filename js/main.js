"use strict";

//hidding menu elements that do not fit in menu width
function menuHideExtraElements() {
	jQuery('#more-li').remove();
	var wrapperWidth = jQuery('.sf-menu').width();
	var summaryWidth = 0;
	//get all first level menu items
	var $liElements = jQuery('.sf-menu > li');
	$liElements.removeClass('md-hidden');
	$liElements.each(function(index) {
		var elementWidth = jQuery(this).outerWidth();
		summaryWidth += elementWidth;
		if(summaryWidth >= wrapperWidth) {
			var $newLi = jQuery('<li id="more-li"><a>...</a><ul></ul></li>');
			jQuery($liElements[index-1]).before($newLi);
			var newLiWidth = jQuery($newLi).outerWidth(true);
			var $extraLiElements = $liElements.filter(':gt('+(index-2)+')');
			$extraLiElements.clone().appendTo($newLi.find('ul'));
			$extraLiElements.addClass('md-hidden');
			return false;
		}
	});
}

function pieChart() {
	//circle progress bar
	if (jQuery().easyPieChart) {

		jQuery('.chart').each(function(){

			var $currentChart = jQuery(this);
			var imagePos = $currentChart.offset().top;
			var topOfWindow = jQuery(window).scrollTop();
			if (imagePos < topOfWindow+900) {

				var size = $currentChart.data('size') ? $currentChart.data('size') : 270;
				var line = $currentChart.data('line') ? $currentChart.data('line') : 20;
				var bgcolor = $currentChart.data('bgcolor') ? $currentChart.data('bgcolor') : '#ffffff';
				var trackcolor = $currentChart.data('trackcolor') ? $currentChart.data('trackcolor') : '#c14240';
				var speed = $currentChart.data('speed') ? $currentChart.data('speed') : 3000;


				$currentChart.easyPieChart({
					barColor: trackcolor,
					trackColor: bgcolor,
					scaleColor: false,
					scaleLength: false,
					lineCap: 'butt',
					lineWidth: line,
					size: size,
					rotate: 0,
					animate: speed,
					onStep: function(from, to, percent) {
						jQuery(this.el).find('.percent').text(Math.round(percent));
					}
				});
			}
		});
	}
}

function affixSidebarInit() {
	var $affixAside = jQuery('.affix-aside');
	if ($affixAside.length) {
		
			//on stick and unstick event
			$affixAside.on('affix.bs.affix', function(e) {
				var affixWidth = $affixAside.width() - 1;
				var affixLeft = $affixAside.offset().left;
				$affixAside
					.width(affixWidth)
					.css("left", affixLeft);
			}).on('affix-top.bs.affix affix-bottom.bs.affix', function(e) {
				$affixAside.css({"width": "", "left": ""});
			});
			
			//counting offset
			var offsetTop = $affixAside.offset().top - jQuery('.page_header').height();
			var offsetBottom = jQuery('.page_footer').outerHeight(true) + jQuery('.page_copyright').outerHeight(true);
			
			$affixAside.affix({
				offset: {
					top: offsetTop,
					bottom: offsetBottom
				},
			});

			jQuery(window).on('resize', function() {
				$affixAside.css({"width": "", "left": ""});
				
				if( $affixAside.hasClass('affix')) {
					//returning sidebar in top position if it is sticked because of unexpacted behavior
					$affixAside.removeClass("affix").css("left", "").addClass("affix-top");
				}

				var offsetTop = jQuery('.page_topline').outerHeight(true) 
								+ jQuery('.page_toplogo').outerHeight(true) 
								+ jQuery('.page_breadcrumbs').outerHeight(true) 
								+ jQuery('.page_header').outerHeight(true);
				var offsetBottom = jQuery('.page_footer').outerHeight(true) + jQuery('.page_copyright').outerHeight(true);
				
				$affixAside.data('bs.affix').options.offset.top = offsetTop;
				$affixAside.data('bs.affix').options.offset.bottom = offsetBottom;
				
				$affixAside.affix('checkPosition');

			});

	}//eof checking of affix sidebar existing
}

//function that initiating template plugins on document.ready event
function documentReadyInit() {
	////////////
	//mainmenu//
	////////////
	if (jQuery().superfish) {
		jQuery('ul.sf-menu').superfish({
			delay:       300,
			animation:   {opacity:'show'},
			animationOut: {opacity: 'hide'},
			speed:       'fast',
			disableHI:   false,
			cssArrows:   true,
			autoArrows:  true
		});
	}

	//toggle mobile menu
	jQuery('.toggle_menu').on('click', function(){
		jQuery('.toggle_menu').toggleClass('mobile-active');
		jQuery('.page_header').toggleClass('mobile-active');
	});

	jQuery('.mainmenu a').on('click', function(){
		if (!jQuery(this).hasClass('sf-with-ul')) {
			jQuery('.toggle_menu').toggleClass('mobile-active');
			jQuery('.page_header').toggleClass('mobile-active');
		}
	});

	//1 and 2/3/4th level mainmenu offscreen fix
	var MainWindowWidth = jQuery(window).width();
	jQuery(window).on('resize', function(){
		MainWindowWidth = jQuery(window).width();
	});
	//2/3/4 levels
	jQuery('.mainmenu').on('mouseover', 'ul li', function(){
		if(MainWindowWidth > 991) {
			var $this = jQuery(this);
			// checks if third level menu exist         
			var subMenuExist = $this.find('ul').length;
			if( subMenuExist > 0){
				var subMenuWidth = $this.find('ul').width();
				var subMenuOffset = $this.find('ul').parent().offset().left + subMenuWidth;
				// if sub menu is off screen, give new position
				if((subMenuOffset + subMenuWidth) > MainWindowWidth){
					var newSubMenuPosition = subMenuWidth + 0;
					$this.find('ul').first().css({
						left: -newSubMenuPosition,
					});
				} else {
					$this.find('ul').first().css({
						left: '100%',
					});
				}
			}
		}
	//1st level
	}).on('mouseover', '> li', function(){
		if(MainWindowWidth > 991) {
			var $this = jQuery(this);
			var subMenuExist = $this.find('ul').length;
			if( subMenuExist > 0){
				var subMenuWidth = $this.find('ul').width();
				var subMenuOffset = $this.find('ul').parent().offset().left;
				// if sub menu is off screen, give new position
				if((subMenuOffset + subMenuWidth) > MainWindowWidth){
					var newSubMenuPosition = MainWindowWidth - (subMenuOffset + subMenuWidth);
					$this.find('ul').first().css({
						left: newSubMenuPosition,
					});
				} 
			}
		}
	});
	

	var navHeight = jQuery('.page_header').outerHeight(true);
	jQuery('body').scrollspy({
		target: '.mainmenu_wrapper',
		offset: navHeight
	});
	if (jQuery().localScroll) {
		jQuery('.mainmenu, #land').localScroll({
			duration:900,
			easing:'easeInOutQuart',
			offset: -navHeight+10
		});
	}

	//toTop
	if (jQuery().UItoTop) {
		jQuery().UItoTop({ easingType: 'easeOutQuart' });
	}

	//parallax
	if (jQuery().parallax) {
		jQuery('.parallax').parallax("50%", 0.01);
	}
	
	//prettyPhoto
	if (jQuery().prettyPhoto) {
		jQuery("a[data-gal^='prettyPhoto']").prettyPhoto({
			hook: 'data-gal',
			theme: 'facebook' /* light_rounded / dark_rounded / light_square / dark_square / facebook / pp_default*/
		});
	}
	

	//bootstrap carousel
	if (jQuery().carousel) {
		jQuery('.carousel').carousel();
	}
	//bootstrap tab - show first tab 
	jQuery('.nav-tabs').each(function() {
		jQuery(this).find('a').first().tab('show');
	});
	jQuery('.tab-content').each(function() {
		jQuery(this).find('.tab-pane').first().addClass('fade in');
	});
	//bootstrap collapse - show first tab 
	jQuery('.panel-group').each(function() {
		jQuery(this).find('a').first().filter('.collapsed').trigger('click');
	});
	//tooltip
	if (jQuery().tooltip) {
		jQuery('[data-toggle="tooltip"]').tooltip();
	}

	
	

	//contact form php
	// jQuery('form.contact-form').on('submit', function( e ){
	// 	e.preventDefault();
	// 	var $form = jQuery(this);
	// 	jQuery($form).find('span.contact-form-respond').remove();


	// 	jQuery($form).find('[aria-required="true"], [required]').each(function(index) {
	// 		if (!jQuery(this).val().length) {
	// 			jQuery(this).addClass('invalid').on('focus', function(){jQuery(this).removeClass('invalid')});
	// 		}
	// 	});

	// 	if ($form.find('[aria-required="true"], [required]').hasClass('invalid')) {
	// 		return;
	// 	}


	// 	var request = $form.serialize();
	// 	var ajax = jQuery.post( "contact-form.php", request )
	// 	.done(function( data ) {
	// 		jQuery($form).find('[type="submit"]').attr('disabled', false).parent().append('<span class="contact-form-respond highlight">'+data+'</span>');

	// 		var $formErrors = $form.find('.form-errors');
	// 		if ( !$formErrors.length ) {
	// 			$form[0].reset();
	// 		}
	// 	})
	// 	.fail(function( data ) {
	// 		jQuery($form).find('[type="submit"]').attr('disabled', false).parent().append('<span class="contact-form-respond highlight">Mail cannot be sent. You need PHP server to send mail.</span>');
	// 	})
	// });



	


	

	

}

function windowLoadInit() {
	//chart
	pieChart();

	//layerSlider
	if (jQuery().layerSlider) {
		jQuery('#layerslider').layerSlider({
			// showBarTimer: true,
			// showCircleTimer: false,
		});
	}
	
	

	////////////////////
	//header processing/
	////////////////////
	//stick header to top
	//wrap header with div for smooth sticking
	var $header = jQuery('.page_header').first();
	if ($header.length) {
		menuHideExtraElements();
		var headerHeight = $header.outerHeight();
		$header.wrap('<div class="page_header_wrapper"></div>').parent().css({height: headerHeight}); //wrap header for smooth stick and unstick

		//get offset
		var headerOffset = 0;
		//check for sticked template headers
			headerOffset = $header.offset().top;

		//for boxed layout - show or hide main menu elements if width has been changed on affix
		jQuery($header).on('affixed-top.bs.affix affixed.bs.affix', function ( e ) {
			if( $header.hasClass('affix-top') ) {
				$header.parent().removeClass('affix-wrapper affix-bottom-wrapper').addClass('affix-top-wrapper');
			} else if ( $header.hasClass('affix') ) {
				$header.parent().removeClass('affix-top-wrapper affix-bottom-wrapper').addClass('affix-wrapper');
			} else if ( $header.hasClass('affix-bottom') ) {
				$header.parent().removeClass('affix-wrapper affix-top-wrapper').addClass('affix-bottom-wrapper');
			} else {
				$header.parent().removeClass('affix-wrapper affix-top-wrapper affix-bottom-wrapper');
			}
			menuHideExtraElements();
		});

		//if header has different height on afixed and affixed-top positions - correcting wrapper height
		jQuery($header).on('affixed-top.bs.affix', function () {
			$header.parent().css({height: $header.outerHeight()});
		});

		jQuery($header).affix({
			offset: {
				top: headerOffset,
				bottom: 0
			}
		});
	}

	//aside affix
	affixSidebarInit();

	jQuery('body').scrollspy('refresh');

	//animation to elements on scroll
	if (jQuery().appear) {
		jQuery('.to_animate').appear();
		jQuery('.to_animate').filter(':appeared').each(function(index){
			var self = jQuery(this);
			var animationClass = !self.data('animation') ? 'fadeInUp' : self.data('animation');
			var animationDelay = !self.data('delay') ? 210 : self.data('delay');
			setTimeout(function(){
				self.addClass("animated " + animationClass);
			}, index * animationDelay);
		});

		jQuery('body').on('appear', '.to_animate', function(e, $affected ) {
			jQuery($affected).each(function(index){
				var self = jQuery(this);
				var animationClass = !self.data('animation') ? 'fadeInUp' : self.data('animation');
				var animationDelay = !self.data('delay') ? 210 : self.data('delay');
				setTimeout(function(){
					self.addClass("animated " + animationClass);
				}, index * animationDelay);
			});
		});
	}

	//counters init on scroll
	if (jQuery().appear) {
		jQuery('.counter').appear();
		jQuery('.counter').filter(':appeared').each(function(index){
			if (jQuery(this).hasClass('counted')) {
				return;
			} else {
				jQuery(this).countTo().addClass('counted');
			}
		});
		jQuery('body').on('appear', '.counter', function(e, $affected ) {
			jQuery($affected).each(function(index){
				if (jQuery(this).hasClass('counted')) {
					return;
				} else {
					jQuery(this).countTo().addClass('counted');
				}
				
			});
		});
	}


	
	

	// init Isotope
	jQuery('.isotope_container, #isotope_container').each(function(index) {
		var $container = jQuery(this);
		var layoutMode = ($container.hasClass('masonry-layout')) ? 'masonry' : 'fitRows';
		$container.isotope({
			percentPosition: true,
			layoutMode: layoutMode,
			masonry: {}
		});

		var $filters = $container.attr('data-filters') ? jQuery(jQuery(this).attr('data-filters')) : $container.parent().find('.filters');
		// bind filter click
		if ($filters.length) {
			$filters.on( 'click', 'a', function( e ) {
			e.preventDefault();
			var filterValue = jQuery( this ).attr('data-filter');
			$container.isotope({ filter: filterValue });
			jQuery(this).siblings().removeClass('selected active');
			jQuery(this).addClass('selected active');
		});
		}
	});

	//page preloader
	jQuery(".preloaderimg").fadeOut();
	jQuery(".preloader").delay(200).fadeOut("slow").delay(200, function(){
		jQuery(this).remove();
	});
}

jQuery(document).ready( function() {
	documentReadyInit();
});


jQuery(window).on('load', function(){
	windowLoadInit();

	//Google Map script
	var $googleMaps = jQuery('#map, .page_map');
	if ( $googleMaps.length ) {
		$googleMaps.each(function() {
			var $map = jQuery(this);

			var lat;
			var lng;
			var map;

			//map styles. You can grab different styles on https://snazzymaps.com/
			var styles = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}];
			
			//map settings
			var address = $map.data('address') ? $map.data('address') : 'london, baker street, 221b';
			var markerDescription = $map.find('.map_marker_description').prop('outerHTML');

			//if you do not provide map title inside #map (.page_map) section inside H3 tag - default titile (Map Title) goes here:
			var markerTitle = $map.find('h3').first().text() ? $map.find('h3').first().text() : 'Map Title';
			var markerIconSrc = $map.find('.map_marker_icon').first().attr('src');

			//type your address after "address="
			jQuery.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + address, function(data) {
				
				lat = data.results[0].geometry.location.lat;
				lng = data.results[0].geometry.location.lng;

			}).complete(function(){
				
				var center = new google.maps.LatLng(lat, lng);
				var settings = {
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					zoom: 16,
					draggable: false,
					scrollwheel: false,
					center: center,
					styles: styles 
				};
				map = new google.maps.Map($map[0], settings);

				var marker = new google.maps.Marker({
					position: center,
					title: markerTitle,
					map: map,
					icon: markerIconSrc,
				});

				var infowindow = new google.maps.InfoWindow({ 
					content: markerDescription
				});
				
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.open(map,marker);
				});

			});
		}); //each
	}//google map length

}); //end of "window load" event

jQuery(window).on('resize', function(){

	jQuery('body').scrollspy('refresh');

	//header processing
	menuHideExtraElements();
	var $header = jQuery('.page_header').first();
		//checking document scrolling position
		if ($header.length && !jQuery(document).scrollTop() && $header.first().data('bs.affix')) {
			$header.first().data('bs.affix').options.offset.top = $header.offset().top;
		}
	jQuery(".page_header_wrapper").css({height: $header.first().outerHeight()}); //editing header wrapper height for smooth stick and unstick
	
});

jQuery(window).scroll(function() {
	//circle progress bar
	pieChart();
});